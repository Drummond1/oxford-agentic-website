// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.ts';

/**
 * Truthful `lastmod` for the sitemap.
 *
 * Built from each content file's own `updatedDate`, falling back to the file's
 * modification time. Pages with no content file behind them get no lastmod at
 * all — stamping every URL with the build date would tell crawlers the whole
 * site changed on every deploy, which is both false and a wasted signal.
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
      const date = updated && !Number.isNaN(Date.parse(updated)) ? new Date(updated) : fs.statSync(full).mtime;

      map.set(`${urlPrefix}/${slug}/`, date);
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
  !siteConfig.features.speakers && '/speakers',
  !siteConfig.features.testimonials && '/testimonials',
  !siteConfig.features.guides && '/guides',
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
