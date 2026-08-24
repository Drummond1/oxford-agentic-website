#!/usr/bin/env node
/**
 * Outbound link checker.
 *
 * `check-links.mjs` deliberately skips anything starting with `http`, which
 * left two gaps that had never been checked on any build:
 *
 * 1. **Absolute self-links.** A link written as `https://oxfordagentic.com/foo/`
 *    rather than `/foo/` was treated as external and skipped, so a typo in one
 *    bypassed every guardrail the build has. These resolve against `dist/`
 *    exactly as the internal checker does, and they FAIL the build, because the
 *    answer is deterministic and entirely ours.
 *
 * 2. **Third-party links.** Luma booking URLs, the ICO, team members' sites.
 *    These are checked over the network and only ever WARN. A build must not go
 *    red because someone else's server is having a bad afternoon, and LinkedIn
 *    answers bots with 999 by design — that is unverifiable, not broken.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import config from '../site.config.ts';

const DIST = path.resolve('dist');
const ORIGIN = config.brand.domain.replace(/\/$/, '');
const TIMEOUT_MS = 12_000;
const CONCURRENCY = 6;
/** Codes that mean "a bot asked", not "the page is gone". */
const BOT_BLOCKED = new Set([401, 403, 405, 429, 999]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

/** Same resolution rules as the internal checker, so the two agree. */
async function resolvesLocally(pathname) {
  const clean = pathname.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return exists(path.join(DIST, 'index.html'));
  const rel = clean.replace(/^\//, '');
  for (const candidate of [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel.replace(/\/$/, '')}.html`),
  ]) {
    if (await exists(candidate)) return true;
  }
  return false;
}

const UA = { 'user-agent': 'Mozilla/5.0 (compatible; oxfordagentic-link-check)' };

/**
 * Redirects are reported, not just followed.
 *
 * The Second Brain booking link sat on a Luma-generated id that 302'd to a branded
 * vanity URL for an unknown length of time, and this checker said 200 the whole while
 * because it followed the hop without mentioning it. A link you control the target of
 * should point at the target. Redirects also rot: whoever owns the old URL can retire
 * it, and a booking link is the worst place to discover that.
 */
async function probe(url) {
  let redirectedTo = null;
  try {
    const first = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: UA,
    });
    if (first.status >= 300 && first.status < 400) {
      redirectedTo = first.headers.get('location');
    }
  } catch {
    /* fall through to the followed request, which reports the real failure */
  }

  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: UA,
      });
      // Some servers reject HEAD but serve GET; only retry for that shape.
      if (res.status === 405 && method === 'HEAD') continue;
      return { status: res.status, redirectedTo };
    } catch (error) {
      if (method === 'GET') return { status: 0, error: error.message, redirectedTo };
    }
  }
  return { status: 0, error: 'unreachable', redirectedTo };
}

/** url -> Set of page paths that link to it. */
const selfLinks = new Map();
const external = new Map();

for (const file of await walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const pageUrl = `/${path.relative(DIST, file).replace(/index\.html$/, '')}`;

  for (const match of html.matchAll(/\shref="(https?:\/\/[^"]+)"/g)) {
    const url = match[1].replace(/&amp;/g, '&');
    const target = url.startsWith(ORIGIN) ? selfLinks : external;
    if (!target.has(url)) target.set(url, new Set());
    target.get(url).add(pageUrl);
  }
}

// 1. Absolute self-links — deterministic, blocking.
const brokenSelf = [];
for (const [url, pages] of selfLinks) {
  const { pathname } = new URL(url);
  if (!(await resolvesLocally(pathname))) {
    brokenSelf.push(`${url}  (linked from ${[...pages].join(', ')})`);
  }
}

// 2. Third-party links — network, advisory only.
const broken = [];
const unverifiable = [];
const redirected = [];
const urls = [...external.keys()];

for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(async (url) => [url, await probe(url)]));

  for (const [url, { status, error, redirectedTo }] of results) {
    const from = [...external.get(url)].slice(0, 3).join(', ');
    if (redirectedTo) redirected.push(`${url}\n      → ${redirectedTo}  (linked from ${from})`);
    if (status >= 200 && status < 400) continue;
    if (BOT_BLOCKED.has(status)) unverifiable.push(`${status} ${url}`);
    else broken.push(`${status || 'ERR'} ${url}  (linked from ${from})${error ? ` — ${error}` : ''}`);
  }
}

if (redirected.length > 0) {
  console.log(`\n! ${redirected.length} outbound link(s) redirect — point at the destination instead:\n`);
  for (const line of redirected) console.log(`  ${line}`);
}

if (unverifiable.length > 0) {
  console.log(`\n· ${unverifiable.length} link(s) could not be verified (bot-blocked, not broken):\n`);
  for (const line of unverifiable) console.log(`  ${line}`);
}

if (broken.length > 0) {
  console.log(`\n! ${broken.length} outbound link warning(s) — not blocking:\n`);
  for (const line of broken) console.log(`  ${line}`);
  console.log('\n  Third-party outages are transient. Re-run before acting on these.');
}

if (brokenSelf.length > 0) {
  console.error(`\n✗ ${brokenSelf.length} broken absolute self-link(s):\n`);
  for (const line of brokenSelf) console.error(`  ${line}`);
  console.error('\n  These point at this site, so they are ours to fix. Prefer a root-relative path.\n');
  process.exit(1);
}

console.log(
  `\n✓ outbound: ${selfLinks.size} absolute self-link(s) resolve, ` +
    `${urls.length - broken.length - unverifiable.length}/${urls.length} third-party link(s) reachable\n`,
);
