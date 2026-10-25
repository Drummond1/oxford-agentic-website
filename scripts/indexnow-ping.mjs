/**
 * IndexNow ping — tells Bing-family engines which URLs changed, immediately,
 * instead of waiting to be re-crawled. Bing feeds ChatGPT's web answers, so
 * this is a GEO lever as much as an indexing one (cycle 41).
 *
 * Runs in the deploy workflow after a successful publish. It maps the files
 * changed in the pushed commits to page URLs:
 *
 *   src/content/guides/x.md      -> /guides/<slug>/ and /guides/
 *   src/content/events/x.md      -> every URL in the sitemap, because the header
 *                                   CTA and the footer print the next cohort's
 *                                   date on every page
 *   src/content/programmes/x.md  -> /bootcamps/<slug>/, /bootcamps/, / and every
 *                                   guide naming it in `relatedProgrammes`
 *   src/content/team/x.md        -> /team/<slug>/ and /team/
 *   src/pages/a/b.astro (static) -> /a/b/, if it is in the sitemap
 *   any template/config/style change -> every URL in the sitemap, since every
 *   page was rebuilt
 *
 * Pass --dry-run to print the mapping and exit without submitting anything. The
 * two mappings above were wrong from cycle 41 until 22 Oct 2026 and no cycle
 * caught it, because checking meant pinging production. Now it does not.
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

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const changed = args.filter((a) => a !== '--dry-run');
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
 * Guide slugs naming a programme in `relatedProgrammes`. Each of those pages
 * renders the programme's card, so a programme edit rebuilds them. Reads the
 * whole guides directory rather than the changed files: the pages that moved
 * are the ones pointing at what changed, not the ones that changed.
 */
function guidesForProgramme(programmeSlug) {
  const dir = path.join('src', 'content', 'guides');
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((file) => file.endsWith('.md'))
    .filter((file) => {
      const block = fs
        .readFileSync(path.join(dir, file), 'utf8')
        .match(/^relatedProgrammes:[ \t]*\n((?:[ \t]*-[ \t]*[a-z0-9-]+[ \t]*\n)+)/m);
      if (!block) return false;
      return [...block[1].matchAll(/-[ \t]*([a-z0-9-]+)/g)].some((m) => m[1] === programmeSlug);
    })
    .map((file) => slugOf(path.join(dir, file)))
    .filter(Boolean);
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

// A static page file (no [param] in its path) builds exactly one URL, so it
// maps to that URL rather than the whole site. Only URLs in the sitemap are
// kept, so noindex pages such as /home-photos/ are never submitted.
const pageCandidates = new Set();

// Shared sources that feed only one public page. HomeSections also renders
// /home-photos/, but that page is noindex and out of the sitemap.
const SINGLE_PAGE_SOURCES = new Map([
  ['src/lib/home.ts', '/'],
  ['src/components/HomeSections.astro', '/'],
]);

for (const file of changed) {
  if (SINGLE_PAGE_SOURCES.has(file)) {
    pageCandidates.add(`https://${HOST}${SINGLE_PAGE_SOURCES.get(file)}`);
    continue;
  }
  const page = file.match(/^src\/pages\/((?:[a-z0-9-]+\/)*)([a-z0-9-]+)\.astro$/);
  if (page) {
    const [, dir, name] = page;
    pageCandidates.add(`https://${HOST}/${name === 'index' ? dir : `${dir}${name}/`}`);
    continue;
  }
  const content = file.match(/^src\/content\/(guides|events|programmes|team)\/([^/]+)\.md$/);
  if (!content) {
    // Docs, outreach, CI and the check/ping scripts never change a page;
    // anything else rebuilt the site.
    if (!/^(IMPROVEMENTS|STATE|README)\.md$|^outreach\/|^seo-data\/|^\.github\/|^scripts\/(check-[a-z-]+|indexnow-ping)\.mjs$/.test(file)) wholeSite = true;
    continue;
  }
  const [, kind] = content;
  const slug = slugOf(file);
  if (kind === 'guides') {
    if (slug) urls.add(`https://${HOST}/guides/${slug}/`);
    urls.add(`https://${HOST}/guides/`);
  } else if (kind === 'events') {
    // The whole site, and this is not the lazy answer. The header CTA and the
    // footer both print the next cohort's date on every page, and an event file
    // is the only thing that can move them. Measured 22 Oct 2026 by shifting
    // Cohort 3 from 19 to 20 November and rebuilding: 61 of 63 pages differ,
    // plus llms.txt, llms-full.txt and the sitemap. This branch submitted three
    // - the event, /events/ and / - so a date change, a venue change or a
    // past-tense sweep left 58 changed pages with no hint that they had moved.
    wholeSite = true;
  } else if (kind === 'programmes') {
    if (slug) urls.add(`https://${HOST}/bootcamps/${slug}/`);
    // /bootcamps/ prints every programme's name, shortPitch and next cohort
    // date, and each guide tagged to a programme carries the same card.
    // Measured the same day on second-brain-bootcamp's shortPitch: 13 sitemap
    // pages differ - the programme page, /bootcamps/, / and the 10 guides that
    // name it in `relatedProgrammes`. This branch submitted two. Not whole-site
    // like events above, because the 50 pages that do not name the programme
    // genuinely do not change.
    urls.add(`https://${HOST}/bootcamps/`);
    urls.add(`https://${HOST}/`);
    if (slug) for (const guide of guidesForProgramme(slug)) urls.add(`https://${HOST}/guides/${guide}/`);
  } else if (kind === 'team') {
    // The person's own profile page, which is the page that actually changed and
    // was the one URL this branch omitted. Measured 25 Oct 2026 on
    // nicolai-thomson.md: editing the body prose moves exactly one file in dist,
    // `team/<slug>/index.html`, and `/team/` is byte-identical, so the branch
    // submitted one URL and it was the wrong one. Editing frontmatter moves two
    // sitemap pages, the profile and `/team/` (plus llms.txt, llms-full.txt and
    // the OG image, which are not sitemap URLs). `/team/` stays in the set for
    // that second case: telling frontmatter from body means parsing the file,
    // and a hint for a page that did not move costs nothing.
    if (slug) urls.add(`https://${HOST}/team/${slug}/`);
    urls.add(`https://${HOST}/team/`);
  }
}

if (!wholeSite && pageCandidates.size > 0) {
  const inSitemap = new Set(await allSitemapUrls());
  for (const url of pageCandidates) if (inSitemap.has(url)) urls.add(url);
}

const urlList = wholeSite ? await allSitemapUrls() : [...urls];

if (urlList.length === 0) {
  console.log('indexnow: no page URLs affected by this push; nothing to submit');
  process.exit(0);
}

if (dryRun) {
  console.log(`indexnow (dry run): would submit ${urlList.length} URL(s)`);
  for (const url of urlList.slice().sort()) console.log(`  ${url}`);
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
