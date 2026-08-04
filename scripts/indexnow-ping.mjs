/**
 * IndexNow ping — tells Bing-family engines which URLs changed, immediately,
 * instead of waiting to be re-crawled. Bing feeds ChatGPT's web answers, so
 * this is a GEO lever as much as an indexing one (cycle 41).
 *
 * Runs in the deploy workflow after a successful publish. It maps the files
 * changed in the pushed commits to page URLs:
 *
 *   src/content/guides/x.md      -> /guides/<slug>/ and /guides/
 *   src/content/events/x.md      -> /events/<slug>/, /events/ and /
 *   src/content/programmes/x.md  -> /bootcamps/<slug>/ and /
 *   src/content/team/x.md        -> /team/
 *   any template/config/style change -> every URL in the sitemap, since every
 *   page was rebuilt
 *
 * The key file (public/<KEY>.txt, containing the key) proves domain ownership
 * per the IndexNow protocol. A ping failure NEVER fails the deploy — the site
 * being live matters more than an indexing hint, and a third-party outage must
 * not turn this pipeline red (same principle as keeping external link checks
 * out of CI).
 *
 * Usage: node scripts/indexnow-ping.mjs <changed-file>...
 *        (no args: submit the full sitemap, used for manual runs)
 */
import fs from 'node:fs';
import path from 'node:path';

const HOST = 'oxfordagentic.com';
const KEY = 'a41f6f2cd0be48f2b1b2c69d7e3d51c4';

const changed = process.argv.slice(2);
const urls = new Set();

/** Frontmatter slug of a content file, if it still exists (deleted files skip). */
function slugOf(file) {
  try {
    return fs.readFileSync(file, 'utf8').match(/^slug:\s*"?([a-z0-9-]+)"?\s*$/m)?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Whole-site submissions read the LIVE sitemap: this runs right after a deploy,
 * so the published sitemap is already current — no rebuild needed in CI. Local
 * dist/ is the fallback for manual runs.
 */
async function allSitemapUrls() {
  try {
    const res = await fetch(`https://${HOST}/sitemap-0.xml`);
    if (res.ok) {
      const xml = await res.text();
      return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    }
  } catch {
    /* fall through to local dist */
  }
  const xml = fs.readFileSync(path.join('dist', 'sitemap-0.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

let wholeSite = changed.length === 0;

for (const file of changed) {
  const content = file.match(/^src\/content\/(guides|events|programmes|team)\/([^/]+)\.md$/);
  if (!content) {
    // Docs and outreach never affect pages; anything else rebuilt the site.
    if (!/^(IMPROVEMENTS|STATE|README)\.md$|^outreach\/|^seo-data\//.test(file)) wholeSite = true;
    continue;
  }
  const [, kind] = content;
  const slug = slugOf(file);
  if (kind === 'guides') {
    if (slug) urls.add(`https://${HOST}/guides/${slug}/`);
    urls.add(`https://${HOST}/guides/`);
  } else if (kind === 'events') {
    if (slug) urls.add(`https://${HOST}/events/${slug}/`);
    urls.add(`https://${HOST}/events/`);
    urls.add(`https://${HOST}/`);
  } else if (kind === 'programmes') {
    if (slug) urls.add(`https://${HOST}/bootcamps/${slug}/`);
    urls.add(`https://${HOST}/`);
  } else if (kind === 'team') {
    urls.add(`https://${HOST}/team/`);
  }
}

const urlList = wholeSite ? await allSitemapUrls() : [...urls];

if (urlList.length === 0) {
  console.log('indexnow: no page URLs affected by this push; nothing to submit');
  process.exit(0);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log(`indexnow: submitted ${urlList.length} URL(s), status ${res.status}`);
} catch (err) {
  // Never fail the deploy over an indexing hint.
  console.log(`indexnow: ping failed (${err.message}) — ignored`);
}
