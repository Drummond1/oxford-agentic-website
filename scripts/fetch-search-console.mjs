/**
 * Search Console export — makes the search data readable without a browser.
 *
 * Why this exists: the improvement loop's rule 4 (fix the valuable page with
 * meaningful impressions and an unusually low CTR) needs Search Console. Until
 * now the only route in was the web UI driven through Claude in Chrome, so
 * every headless cycle recorded "Search Console unavailable from this checkout"
 * and fell through to rule 5. Fourteen cycles in a row did that, and the
 * output drifted into publishing existing prose as FAQ nodes because that was
 * the only move left that needed no data. This script closes that gap: a
 * scheduled run writes the numbers into the repo, and any cycle — cloud or
 * local, browser or none — reads them from the checkout.
 *
 * Auth is a Google service account using the JWT bearer flow, signed with
 * node's built-in crypto so the repo gains no dependency. The key never lands
 * in the tree: it is read from the environment.
 *
 *   GSC_SERVICE_ACCOUNT_KEY       the key JSON, raw or base64 (CI secret)
 *   GSC_SERVICE_ACCOUNT_KEY_FILE  path to the key JSON (local runs)
 *
 * No key configured is NOT an error — it prints how to set one up and exits 0,
 * so this can never turn a build red. A key that is present but rejected IS an
 * error and exits non-zero, because a scheduled export that silently stops
 * producing data is how the loop went blind in the first place.
 *
 * Writes two files, both committed:
 *
 *   seo-data/search-console-latest.json  full rows, for machine reading
 *   seo-data/search-console-latest.md    the summary a cycle reads first
 *
 * One pair of files, overwritten each run, rather than a dated file per run:
 * git history already keeps every previous version, so `git log -p` on the
 * markdown is the trend record and the tree stays small.
 *
 * The page table carries the previous 28 days beside the current 28, because
 * the standing decision not to rewrite a hub page's title on a hunch came from
 * exactly that comparison — /events/ fell from 2% to 1.3% after a title change
 * and it took weeks to notice. A CTR delta column makes that visible on day one.
 *
 * Usage: node scripts/fetch-search-console.mjs [--quiet]
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'sc-domain:oxfordagentic.com';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const API_BASE = 'https://www.googleapis.com/webmasters/v3';

const OUT_DIR = 'seo-data';
const JSON_OUT = path.join(OUT_DIR, 'search-console-latest.json');
const MD_OUT = path.join(OUT_DIR, 'search-console-latest.md');

/** 28 days is Search Console's own default window and the one the baseline file uses. */
const WINDOW_DAYS = 28;

/**
 * Row caps. These bound what gets committed every day: the whole point of one
 * overwritten file is that the repo does not grow without limit, and an
 * uncapped page+query export would undo that. The site has ~53 pages, so the
 * page cap is slack; the query caps are where the size actually sits.
 */
const CAP = { page: 500, query: 1000, pageQuery: 1500, date: 100 };

/**
 * Per-page query breakdowns are the expensive part of the payload, so they are
 * limited to the pages a cycle might actually act on. Every low-CTR page the
 * loop has investigated turned out to be explained by its query mix — Google
 * anonymised rows, brand queries the homepage wins, or an excluded cluster —
 * and that diagnosis is impossible from page totals alone. Without these rows
 * in the file, a headless cycle can see a 1% CTR and not see why, which is how
 * a page gets rewritten for no reason.
 */
const BREAKDOWN_MIN_IMPRESSIONS = 20;
const BREAKDOWN_MAX_PAGES = 12;
const BREAKDOWN_QUERIES_PER_PAGE = 15;

const quiet = process.argv.includes('--quiet');
const log = (...args) => {
  if (!quiet) console.log(...args);
};

/* ---------------------------------------------------------------- dates --- */

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

// Current window ends today: with the default `final` dataState the API simply
// omits days it has not finalised, so asking for today costs nothing and the
// response reports where the data actually stops.
const CURRENT = { startDate: iso(daysAgo(WINDOW_DAYS - 1)), endDate: iso(daysAgo(0)) };
const PREVIOUS = { startDate: iso(daysAgo(WINDOW_DAYS * 2 - 1)), endDate: iso(daysAgo(WINDOW_DAYS)) };

/* ----------------------------------------------------------------- auth --- */

function loadKey() {
  const file = process.env.GSC_SERVICE_ACCOUNT_KEY_FILE;
  let raw = process.env.GSC_SERVICE_ACCOUNT_KEY;

  if (file) {
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch (err) {
      throw new Error(`GSC_SERVICE_ACCOUNT_KEY_FILE is set but unreadable: ${err.message}`);
    }
  }
  if (!raw || !raw.trim()) return null;

  raw = raw.trim();
  // A multiline JSON secret is easy to mangle in CI, so base64 is accepted too
  // and detected rather than configured. Buffer.from never throws on bad
  // base64 - it just returns bytes - so the decode is checked by looking at
  // the result, otherwise a mistyped secret surfaces as a JSON error full of
  // mojibake instead of saying what is actually wrong.
  if (!raw.startsWith('{')) {
    const decoded = Buffer.from(raw, 'base64').toString('utf8').trim();
    if (!decoded.startsWith('{')) {
      throw new Error(
        'service account key is neither JSON nor base64-encoded JSON. Expected the key file ' +
          'that Google Cloud downloads, starting with "{".',
      );
    }
    raw = decoded;
  }

  let key;
  try {
    key = JSON.parse(raw);
  } catch (err) {
    throw new Error(`service account key is not valid JSON: ${err.message}`);
  }
  if (!key.client_email || !key.private_key) {
    throw new Error('service account key is missing client_email or private_key');
  }
  return key;
}

const b64url = (input) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/**
 * Mints an access token with the service-account JWT bearer flow:
 * sign {header}.{claims} with RS256, then exchange the assertion for a token.
 */
async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  if (key.private_key_id) header.kid = key.private_key_id;

  const claims = {
    iss: key.client_email,
    scope: SCOPE,
    aud: TOKEN_ENDPOINT,
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(key.private_key)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    // The common causes are a clock far out of step, a disabled key, or a key
    // pasted with its newlines flattened. Google names which in the body.
    throw new Error(`token request failed (${res.status}): ${body.slice(0, 400)}`);
  }
  const token = JSON.parse(body).access_token;
  if (!token) throw new Error('token response contained no access_token');
  return token;
}

/* ------------------------------------------------------------------ api --- */

async function query(token, body) {
  const url = `${API_BASE}/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        `Search Console refused the request (403). The service account is authenticated but ` +
          `probably not a user on the ${SITE_URL} property. Add its client_email in Search ` +
          `Console → Settings → Users and permissions (Full or Restricted both work for reads). ` +
          `Response: ${text.slice(0, 300)}`,
      );
    }
    throw new Error(`searchAnalytics/query failed (${res.status}): ${text.slice(0, 400)}`);
  }
  return JSON.parse(text);
}

const rows = (res) => res.rows ?? [];

/** Shrinks a row to the fields we use, and rounds so the committed file does not churn on noise. */
const tidy = (row, keyNames) => {
  const out = {};
  keyNames.forEach((name, i) => {
    out[name] = row.keys[i];
  });
  out.clicks = row.clicks;
  out.impressions = row.impressions;
  out.ctr = Math.round(row.ctr * 10000) / 10000;
  out.position = Math.round(row.position * 10) / 10;
  return out;
};

/* ------------------------------------------------------------- reporting --- */

const pct = (n) => `${(n * 100).toFixed(1)}%`;
// Always one decimal, so a whole-number position reads 22.0 and the column lines up.
const pos = (n) => n.toFixed(1);
const shortPath = (url) => url.replace(/^https?:\/\/[^/]+/, '') || '/';

function markdown(data) {
  const { window, previousWindow, totals, pages, queries, pageQueries, dates, meta } = data;
  const out = [];

  out.push('# Search Console — latest export');
  out.push('');
  out.push(`Generated ${meta.generatedAt} by \`scripts/fetch-search-console.mjs\`.`);
  out.push(`Window **${window.startDate} to ${window.endDate}** (${WINDOW_DAYS} days), compared with ${previousWindow.startDate} to ${previousWindow.endDate}.`);
  if (meta.firstIncompleteDate) {
    out.push(`Google reports data from **${meta.firstIncompleteDate}** onwards as incomplete, so treat the last few days as provisional.`);
  }
  out.push('');
  out.push('This file is written by a scheduled job, not by hand. Do not edit it — edits are overwritten on the next run. Judgement about what a low CTR *means* lives in `IMPROVEMENTS.md` and `STATE.md`, not here; this is only the numbers.');
  out.push('');

  out.push('## Site totals');
  out.push('');
  out.push('| Metric | This window | Previous window |');
  out.push('| --- | --- | --- |');
  out.push(`| Clicks | ${totals.current.clicks} | ${totals.previous.clicks} |`);
  out.push(`| Impressions | ${totals.current.impressions} | ${totals.previous.impressions} |`);
  out.push(`| CTR | ${pct(totals.current.ctr)} | ${pct(totals.previous.ctr)} |`);
  out.push(`| Average position | ${pos(totals.current.position)} | ${pos(totals.previous.position)} |`);
  out.push('');

  out.push('## Pages by impressions');
  out.push('');
  out.push('CTR delta is this window minus the previous one, in percentage points. A blank previous column means the page had no impressions then.');
  out.push('');
  out.push('| Page | Clicks | Impressions | CTR | Position | Prev CTR | Δ pp |');
  out.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const page of pages.slice(0, 40)) {
    const prev = page.previous;
    out.push(
      `| ${shortPath(page.page)} | ${page.clicks} | ${page.impressions} | ${pct(page.ctr)} | ${pos(page.position)} | ` +
        `${prev ? pct(prev.ctr) : '—'} | ${prev ? ((page.ctr - prev.ctr) * 100).toFixed(1) : '—'} |`,
    );
  }
  if (pages.length > 40) out.push('');
  if (pages.length > 40) out.push(`_${pages.length - 40} further pages are in the JSON._`);
  out.push('');

  out.push('## Query mix for the pages worth judging');
  out.push('');
  out.push(
    `Pages with at least ${BREAKDOWN_MIN_IMPRESSIONS} impressions, most-seen first, with their top queries. ` +
      'Page totals alone cannot tell a fixable low CTR from an unfixable one, so read these rows before changing any title or description. ' +
      'Note that Google anonymises low-volume queries: where a page\'s listed query impressions fall well short of its page total, the difference is anonymised rows that no title rewrite can reach.',
  );
  out.push('');
  for (const entry of pageQueries) {
    const named = entry.queries.reduce((sum, q) => sum + q.impressions, 0);
    const hidden = entry.impressions - named;
    out.push(`### ${shortPath(entry.page)}`);
    out.push('');
    out.push(
      `${entry.impressions} impressions, ${entry.clicks} clicks, ${pct(entry.ctr)} CTR, position ${pos(entry.position)}. ` +
        `Named queries below account for ${named} impressions` +
        (hidden > 0 ? `; the remaining ${hidden} (${pct(hidden / entry.impressions)}) are anonymised by Google.` : '.'),
    );
    out.push('');
    if (entry.queries.length === 0) {
      out.push('_No queries returned for this page — all of its impressions are anonymised._');
      out.push('');
      continue;
    }
    out.push('| Query | Clicks | Impressions | CTR | Position |');
    out.push('| --- | --- | --- | --- | --- |');
    for (const q of entry.queries) {
      out.push(`| ${q.query} | ${q.clicks} | ${q.impressions} | ${pct(q.ctr)} | ${pos(q.position)} |`);
    }
    out.push('');
  }

  out.push('## Top queries, site-wide');
  out.push('');
  out.push('| Query | Clicks | Impressions | CTR | Position |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const q of queries.slice(0, 40)) {
    out.push(`| ${q.query} | ${q.clicks} | ${q.impressions} | ${pct(q.ctr)} | ${pos(q.position)} |`);
  }
  out.push('');
  if (queries.length > 40) {
    out.push(`_${queries.length - 40} further queries are in the JSON._`);
    out.push('');
  }

  out.push('## Daily totals');
  out.push('');
  out.push('| Date | Clicks | Impressions | CTR | Position |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const d of dates) {
    out.push(`| ${d.date} | ${d.clicks} | ${d.impressions} | ${pct(d.ctr)} | ${pos(d.position)} |`);
  }
  out.push('');

  return `${out.join('\n')}\n`;
}

/* ----------------------------------------------------------------- main --- */

const SETUP_NOTE = `search-console: no service account key configured, so nothing was exported.

To turn this on, three steps — only the first two need a Google account:

  1. In Google Cloud, create a service account and enable the
     "Google Search Console API" for its project. Create a JSON key for it.
  2. In Search Console for oxfordagentic.com, open
     Settings -> Users and permissions, and add the service account's
     client_email as a user. Restricted access is enough to read.
  3. Put the key JSON in the repository secret GSC_SERVICE_ACCOUNT_KEY
     (Settings -> Secrets and variables -> Actions). For a local run instead,
     point GSC_SERVICE_ACCOUNT_KEY_FILE at the file on disk.

Exiting 0: a missing key is a configuration state, not a failure.`;

async function main() {
  let key;
  try {
    key = loadKey();
  } catch (err) {
    console.error(`search-console: ${err.message}`);
    process.exit(1);
  }

  if (!key) {
    log(SETUP_NOTE);
    process.exit(0);
  }

  log(`search-console: authenticating as ${key.client_email}`);
  const token = await accessToken(key);

  log(`search-console: querying ${CURRENT.startDate} to ${CURRENT.endDate}`);
  const [totalsNow, totalsPrev, pagesNow, pagesPrev, queriesNow, pageQueryNow, datesNow] = await Promise.all([
    query(token, { ...CURRENT }),
    query(token, { ...PREVIOUS }),
    query(token, { ...CURRENT, dimensions: ['page'], rowLimit: CAP.page }),
    query(token, { ...PREVIOUS, dimensions: ['page'], rowLimit: CAP.page }),
    query(token, { ...CURRENT, dimensions: ['query'], rowLimit: CAP.query }),
    query(token, { ...CURRENT, dimensions: ['page', 'query'], rowLimit: CAP.pageQuery }),
    query(token, { ...CURRENT, dimensions: ['date'], rowLimit: CAP.date }),
  ]);

  const siteTotal = (res) => {
    const row = rows(res)[0];
    if (!row) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    return {
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: Math.round(row.ctr * 10000) / 10000,
      position: Math.round(row.position * 10) / 10,
    };
  };

  const prevByPage = new Map(rows(pagesPrev).map((r) => [r.keys[0], tidy(r, ['page'])]));
  const pages = rows(pagesNow)
    .map((r) => {
      const page = tidy(r, ['page']);
      const prev = prevByPage.get(page.page);
      if (prev) page.previous = { clicks: prev.clicks, impressions: prev.impressions, ctr: prev.ctr, position: prev.position };
      return page;
    })
    .sort((a, b) => b.impressions - a.impressions);

  const queries = rows(queriesNow).map((r) => tidy(r, ['query']));

  // Group the page+query rows under their page, then keep the breakdowns for
  // the pages a cycle might act on.
  const byPage = new Map();
  for (const row of rows(pageQueryNow)) {
    const [page, q] = row.keys;
    if (!byPage.has(page)) byPage.set(page, []);
    byPage.get(page).push(tidy(row, ['page', 'query']));
  }
  const pageQueries = pages
    .filter((p) => p.impressions >= BREAKDOWN_MIN_IMPRESSIONS)
    .slice(0, BREAKDOWN_MAX_PAGES)
    .map((p) => ({
      page: p.page,
      clicks: p.clicks,
      impressions: p.impressions,
      ctr: p.ctr,
      position: p.position,
      queries: (byPage.get(p.page) ?? [])
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, BREAKDOWN_QUERIES_PER_PAGE)
        .map(({ query: text, clicks, impressions, ctr, position }) => ({ query: text, clicks, impressions, ctr, position })),
    }));

  const data = {
    meta: {
      generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
      site: SITE_URL,
      windowDays: WINDOW_DAYS,
      dataState: 'final',
      firstIncompleteDate:
        totalsNow.metadata?.first_incomplete_date ?? pagesNow.metadata?.first_incomplete_date ?? null,
      caps: CAP,
      source: 'webmasters/v3 searchAnalytics/query',
    },
    window: CURRENT,
    previousWindow: PREVIOUS,
    totals: { current: siteTotal(totalsNow), previous: siteTotal(totalsPrev) },
    dates: rows(datesNow).map((r) => tidy(r, ['date'])),
    pages,
    queries,
    pageQueries,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(MD_OUT, markdown(data));

  log(
    `search-console: wrote ${JSON_OUT} and ${MD_OUT} — ` +
      `${data.totals.current.clicks} clicks, ${data.totals.current.impressions} impressions, ` +
      `${pct(data.totals.current.ctr)} CTR across ${pages.length} pages`,
  );
}

main().catch((err) => {
  console.error(`search-console: ${err.message}`);
  process.exit(1);
});
