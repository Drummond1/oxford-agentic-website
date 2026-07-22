// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import siteConfig from './site.config.ts';

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
        const path = new URL(page).pathname;
        return !flaggedOffPrefixes.some((prefix) => path.startsWith(prefix));
      },
    }),
  ],
  image: {
    // Originals go in at any size; the build emits responsive AVIF/WebP.
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
