// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.ts';
/**
 * The date the homepage's own copy last changed. It lives in `src/lib/home.ts`,
 * beside that copy, and NOT in this file: the contract that it be bumped in the
 * same commit as a homepage-copy edit would otherwise drag this file into every
 * such commit, and `scripts/indexnow-ping.mjs` treats this file as whole-site -
 * correctly, because it also holds the sitemap filter and the lastmod
 * derivations below. Measured on 8 Nov 2026 before the move: 55 sitemap URLs
 * submitted for a commit that moved one page. See the comment on the constant.
 */
import { homepageCopyLastmod } from './src/lib/home.ts';

/** Frontmatter fields this file needs, read without pulling in a parser. */
function readRecords(dir) {
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs)) return [];

  return fs
    .readdirSync(abs)
    // The same exclusion as `MARKDOWN` in `src/content.config.ts`: a local
    // duplicate such as "adam-martin 2.md" is not in the collection, so it must
    // not supply a date here either. In CI those files do not exist, so this
    // only ever protects local verification — the reason it is there at all is
    // that this checkout has carried three of them before now.
    .filter((f) => f.endsWith('.md') && !/ [0-9]\.md$/.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(abs, file), 'utf8');
      const field = (name) =>
        raw.match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?\\s*$`, 'm'))?.[1]?.trim();
      return {
        slug: field('slug'),
        updated: field('updatedDate'),
        endDate: field('endDate'),
        status: field('status'),
        draft: field('draft') === 'true',
      };
    });
}

function toDate(value) {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms);
}

/**
 * The dates that move a page showing programme cards with each one's next cohort.
 *
 * Shared by `/` and `/bootcamps/`, which both render exactly that: a card per
 * programme, carrying the next cohort's date. Extracted on 3 Nov 2026 rather
 * than copied, because the awkward half below is easy to get subtly wrong and
 * two copies of it would drift.
 *
 * The hard part, found on 24 Oct: these pages change **without a commit behind
 * them**. A cohort whose `endDate` passes drops out of `isUpcoming` on the next
 * build — the daily 03:17 cron — and the page visibly loses a card, or prints a
 * different next date. So the obvious derivation, the newest `updatedDate`
 * among the cohorts listed, moves BACKWARDS on exactly that change: today it
 * would read Cohort 3's 18 Oct, and after 19 November it would fall to the
 * Coding cohort's earlier 18 Oct. A lastmod that goes backwards on a page that
 * just changed is worse than none.
 *
 * So a passed event contributes the moment it passed, `endDate`, rather than
 * the date of a file edit nobody made. That is both true — the card left the
 * page then — and monotonic: `endDate` only ever joins the set, so the maximum
 * cannot fall. Cohort 3 passing on 19 November moves this to 19 November.
 *
 * An event's `updatedDate` counts only while it is upcoming, because that is
 * the only time its card is on these pages: Cohort 2's past-tense rewrite on
 * 24 October changed its own page and neither of these. The one case this
 * understates is a future cohort being cancelled, which takes a card off the
 * page on a date no input here carries. Understating is the safe direction.
 */
function programmeCardDates(events, programmes, now) {
  const dates = [];

  for (const p of programmes) {
    const d = toDate(p.updated);
    if (d) dates.push(d);
  }

  for (const e of events) {
    if (e.draft) continue;
    const end = toDate(e.endDate);
    if (!end) continue;
    if (e.status !== 'cancelled' && end >= now) {
      const d = toDate(e.updated);
      if (d) dates.push(d);
    } else if (end < now) {
      dates.push(end);
    }
  }

  return dates;
}

const newest = (dates) => new Date(Math.max(...dates.map((d) => d.getTime())));

/**
 * `lastmod` for `/`, the first composed page to earn one.
 *
 * It is the page every engine probe lands on, everything an engine knows about
 * the November cohorts it reads off that page, and its cached copy has been
 * measured days stale. It was also 1 of the 15 URLs in this sitemap with no
 * lastmod at all, because no single content file backs it.
 */
function homepageLastmod(events, programmes, now = new Date()) {
  return newest([
    new Date(homepageCopyLastmod),
    // "What we run" renders a card per programme, so every programme edit moves it.
    ...programmeCardDates(events, programmes, now),
  ]);
}

/**
 * `lastmod` for the four listing hubs. Three added 3 Nov 2026, `/team/` later
 * the same day.
 *
 * The first three were 3 of the 14 URLs left with no lastmod at all, and they
 * are the three worst to leave silent: `/events/` is the dated list an engine is asked
 * for by name, `/guides/` is the only route into 32 of the site's 55 indexable
 * pages, and `/bootcamps/` carries the `CollectionPage` and the only cards that
 * print each programme's next date. The measured constraint on this domain is
 * crawl budget (Search Console, 24 Aug: 23 indexed, 16 not), and `lastmod` is
 * the one sitemap field Google says it acts on — but only where it is
 * verifiably accurate, which is why each of these is derived from the files the
 * page actually lists rather than stamped with the build date.
 *
 * Each is the newest date among what that page renders, and each is monotonic:
 *
 *  - `/guides/` lists every guide, so it is the newest guide `updatedDate`.
 *  - `/bootcamps/` renders the same programme cards as `/`, so it takes the
 *    same set, minus the homepage's own copy date.
 *  - `/events/` lists every cohort, past as well as upcoming, so every event's
 *    `updatedDate` counts — unlike on the two pages above, a past-tense rewrite
 *    does change this page. A passed cohort also moves between the two bands,
 *    on a date no file edit carries, so `endDate` joins the set the same way.
 *  - `/team/` prints a card per person carrying their name, role and the
 *    opening of their bio, so it is the newest `updatedDate` among the seven.
 *    It is the simplest of the four and the only one with no time-based term:
 *    nobody drops off this page on a date, so unlike `/events/` and
 *    `/bootcamps/` this set cannot change on a build with no commit behind it,
 *    which is the whole of the trap those two had to be written around. The one
 *    way it can still fall is someone **leaving** the team, since deleting the
 *    newest file lowers the maximum — but that is a commit, so whoever makes it
 *    can bump another date in it, and `/guides/` has carried the same property
 *    since it was added.
 *
 * All four understate rather than overstate: the standfirsts and headings live
 * in templates, and a template edit moves 55 pages, so claiming it moved only
 * these would be the same lie in the other direction (same stance as
 * `homepageCopyLastmod`, and the reason `/about/`, `/privacy/` and
 * `/testimonials/` are still bare).
 */
function listingLastmods(guides, events, programmes, team, now = new Date()) {
  const map = new Map();

  const guideDates = guides.filter((g) => !g.draft).map((g) => toDate(g.updated)).filter(Boolean);
  if (guideDates.length > 0) map.set('/guides/', newest(guideDates));

  const programmeDates = programmeCardDates(events, programmes, now);
  if (programmeDates.length > 0) map.set('/bootcamps/', newest(programmeDates));

  const eventDates = [];
  for (const e of events) {
    if (e.draft) continue;
    const updated = toDate(e.updated);
    if (updated) eventDates.push(updated);
    const end = toDate(e.endDate);
    if (end && end < now) eventDates.push(end);
  }
  if (eventDates.length > 0) map.set('/events/', newest(eventDates));

  const teamDates = team.map((m) => toDate(m.updated)).filter(Boolean);
  if (teamDates.length > 0) map.set('/team/', newest(teamDates));

  return map;
}

/**
 * Truthful `lastmod` for the sitemap.
 *
 * Built from each content file's own `updatedDate`. Pages with no content file
 * behind them get no lastmod at all — stamping every URL with the build date
 * would tell crawlers the whole site changed on every deploy, which is both
 * false and a wasted signal. The homepage is the one exception, below.
 *
 * A file with no readable `updatedDate` is skipped for the same reason, rather
 * than falling back to its mtime as this did until 23 Oct 2026. git does not
 * record mtimes, so in CI — which clones fresh on every run — the mtime IS the
 * build time. All five event files had no `updatedDate`, so the fallback gave
 * those five URLs a `lastmod` seconds old on every push and on the daily
 * scheduled redeploy, with nothing changed. All three collections now require
 * the field, so the skip is a guard rather than a path: a missing lastmod is
 * merely absent, a build-time one is untrue.
 */
function contentLastmod() {
  const map = new Map();
  const events = readRecords('src/content/events');
  const programmes = readRecords('src/content/programmes');
  const guides = readRecords('src/content/guides');
  const team = readRecords('src/content/team');
  const collections = [
    [guides, '/guides'],
    [programmes, '/bootcamps'],
    [events, '/events'],
    // The `team` collection gained `updatedDate` on 3 Nov 2026 for exactly
    // this. These eight URLs are flag-gated, so when `features.team` is off
    // they are not in the sitemap and these entries are simply never read.
    [team, '/team'],
  ];

  for (const [records, urlPrefix] of collections) {
    for (const record of records) {
      if (!record.slug) continue;
      const updated = toDate(record.updated);
      if (!updated) continue;
      map.set(`${urlPrefix}/${record.slug}/`, updated);
    }
  }

  map.set('/', homepageLastmod(events, programmes));
  for (const [url, date] of listingLastmods(guides, events, programmes, team)) map.set(url, date);

  return map;
}

const lastmodByPath = contentLastmod();

/**
 * Routes that only exist when their feature flag is on (PRD §11). These are not
 * generated at all when the flag is off, so two things follow: they must stay
 * out of the sitemap, and nothing may redirect to them. Kept separate from the
 * noindex-only entries below, which are routes that do build.
 */
const flagGatedOffPrefixes = [
  !siteConfig.features.team && '/team',
  !siteConfig.features.testimonials && '/testimonials',
  !siteConfig.features.guides && '/guides',
].filter(Boolean);

/**
 * Routes kept out of the sitemap: the flag-gated ones above, which do not
 * exist, plus the ones below, which do exist but are noindex or reference-only.
 */
const flaggedOffPrefixes = [
  ...flagGatedOffPrefixes,
  // Reference-only design variants. They carry noindex as well, but keeping
  // them out of the sitemap means never inviting a crawler to a second
  // homepage in the first place. '/home-original' stays listed because a
  // redirect page still exists at that address.
  '/home-photos',
  '/home-original',
  // The application form is noindex and footer-only (23 Sept 2026).
  '/apply',
  // The voice bootcamp finder is noindex and unlinked (30 Sept 2026).
  '/find-your-bootcamp',
  // The voice office hours page is noindex and unlinked (30 Sept 2026).
  '/office-hours',
  // The CEO roundtable demand page is ad-only: noindex, nofollow, no sitemap entry.
  '/ceo-roundtable',
  // The Second Brain register-interest page is noindex, linked from the programme page (27 Oct 2026).
  '/second-brain-interest',
  // The First Workflow Picker lead-gen pages are ad-only: noindex, unlinked (9 Nov 2026).
  '/first-workflow-picker',
].filter(Boolean);

/**
 * Rename safety net (PRD §4). Slugs change; URLs must not break. Astro emits a
 * redirect page for each entry, which works on any host — no Netlify _redirects
 * or vercel.json to keep in sync. Add pairs to `redirects` in site.config.ts.
 *
 * A pair whose target is flagged off is dropped. Astro emits a redirect page for
 * every pair unconditionally, while the target route is conditional, so a
 * tombstone kept over a route that no longer builds would send visitors and
 * crawlers to a 404 by way of a redirect — strictly worse than the 404 the
 * tombstone exists to avoid, and a link pointing at a route that is not there.
 */
const redirects = Object.fromEntries(
  siteConfig.redirects
    .filter(({ to }) => !flagGatedOffPrefixes.some((prefix) => to.startsWith(`${prefix}/`)))
    .map(({ from, to }) => [from, to]),
);

export default defineConfig({
  site: siteConfig.brand.domain,
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects,
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !flaggedOffPrefixes.some((prefix) => pathname.startsWith(prefix));
      },
      serialize: (item) => {
        const date = lastmodByPath.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: date.toISOString() } : item;
      },
    }),
  ],
  image: {
    // Originals go in at any size; the build emits responsive AVIF/WebP.
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
