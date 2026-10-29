// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.ts';

/**
 * The homepage's own copy: `src/pages/index.astro`,
 * `src/components/HomeSections.astro` and `src/lib/home.ts`.
 *
 * Those three have no `updatedDate` because they are code, not content, and
 * CI clones at depth 1 so git cannot supply a per-file date either. Recorded
 * by hand, exactly as `updatedDate` is on the 40 content files.
 *
 * **Bump it in the same commit whenever you change one of those three.** If
 * you forget, the homepage's lastmod understates, which is the safe direction:
 * a crawler is told less recently than the truth, never more.
 *
 * Deliberately NOT covering the components the homepage shares with every
 * other page (Hero, EventCard, Faq, the layout): a change to those moves 63
 * pages, and claiming it moved only this one would be the same lie in the
 * other direction.
 */
const HOMEPAGE_COPY_LASTMOD = '2026-10-29T07:07:49Z';

/** Frontmatter fields this file needs, read without pulling in a parser. */
function readRecords(dir) {
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs)) return [];

  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith('.md'))
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
 * `lastmod` for `/`, the one composed page that earns one.
 *
 * It is the page every engine probe lands on, everything an engine knows about
 * the November cohorts it reads off that page, and its cached copy has been
 * measured days stale. It was also 1 of the 15 URLs in this sitemap with no
 * lastmod at all, because no single content file backs it.
 *
 * The hard part, found on 24 Oct before this shipped: the homepage changes
 * **without a commit behind it**. A cohort whose `endDate` passes drops out of
 * `isUpcoming` on the next build — the daily 03:17 cron — and the page visibly
 * loses a card. So the obvious derivation, the newest `updatedDate` among the
 * cohorts the page lists, moves BACKWARDS on exactly that change: today it
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
 * the only time its card is on the page: Cohort 2's past-tense rewrite on
 * 24 October changed its own page and not this one. The one case this
 * understates is a future cohort being cancelled, which takes a card off the
 * page on a date no input here carries. Understating is the safe direction.
 */
function homepageLastmod(events, programmes, now = new Date()) {
  const dates = [new Date(HOMEPAGE_COPY_LASTMOD)];

  // "What we run" renders a card per programme, so every programme edit moves it.
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

  return new Date(Math.max(...dates.map((d) => d.getTime())));
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
  const collections = [
    [readRecords('src/content/guides'), '/guides'],
    [programmes, '/bootcamps'],
    [events, '/events'],
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

  return map;
}

const lastmodByPath = contentLastmod();

/**
 * Routes that only exist when their feature flag is on (PRD §11). Flagged-off
 * routes are never generated, so they must also be kept out of the sitemap.
 */
const flaggedOffPrefixes = [
  !siteConfig.features.team && '/team',
  !siteConfig.features.testimonials && '/testimonials',
  !siteConfig.features.guides && '/guides',
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
].filter(Boolean);

/**
 * Rename safety net (PRD §4). Slugs change; URLs must not break. Astro emits a
 * redirect page for each entry, which works on any host — no Netlify _redirects
 * or vercel.json to keep in sync. Add pairs to `redirects` in site.config.ts.
 */
const redirects = Object.fromEntries(siteConfig.redirects.map(({ from, to }) => [from, to]));

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
