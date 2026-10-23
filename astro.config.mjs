// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.ts';

/**
 * Truthful `lastmod` for the sitemap.
 *
 * Built from each content file's own `updatedDate`. Pages with no content file
 * behind them get no lastmod at all — stamping every URL with the build date
 * would tell crawlers the whole site changed on every deploy, which is both
 * false and a wasted signal.
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
  const collections = [
    ['src/content/guides', '/guides'],
    ['src/content/programmes', '/bootcamps'],
    ['src/content/events', '/events'],
  ];

  for (const [dir, urlPrefix] of collections) {
    const abs = path.resolve(dir);
    if (!fs.existsSync(abs)) continue;

    for (const file of fs.readdirSync(abs).filter((f) => f.endsWith('.md'))) {
      const full = path.join(abs, file);
      const raw = fs.readFileSync(full, 'utf8');
      const slug = raw.match(/^slug:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
      if (!slug) continue;

      const updated = raw.match(/^updatedDate:\s*"?([^"\n]+)"?\s*$/m)?.[1]?.trim();
      if (!updated || Number.isNaN(Date.parse(updated))) continue;

      map.set(`${urlPrefix}/${slug}/`, new Date(updated));
    }
  }

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
