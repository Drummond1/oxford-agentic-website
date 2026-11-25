/**
 * The date the About page's own copy last changed, and part of the `lastmod`
 * the sitemap publishes for `/about/`.
 *
 * Read by `aboutLastmod()` in `astro.config.mjs`. Same mechanism and the same
 * contract as `homepageCopyLastmod` in `src/lib/home.ts`, for the same reason:
 * `/about/` is a composed page with no content file of its own, so nothing can
 * derive its date, and `astro.config.mjs` cannot import a `.astro` file.
 *
 * It covers one source, `src/pages/about.astro`. **Bump it in the same commit
 * whenever you change the copy there.** The copy is what it dates, so this
 * constant is not itself copy: moving it, or rewriting this comment, is not a
 * reason to move the date.
 *
 * Why a module of its own rather than a line in the config, or a shared
 * `page-lastmods.ts` holding `/privacy/`'s too. `scripts/indexnow-ping.mjs`
 * maps `src/pages/about.astro` to `/about/` and this file to `/about/`, so a
 * commit touching both hints at that one URL and nothing else. In the config
 * the contract above would drag a whole-site file into every About-copy commit
 * and submit all 58 - the 8 November measurement on the homepage, where the two
 * files cancelled out. `SINGLE_PAGE_SOURCES` maps one file to one URL and
 * cannot express one module serving two pages, so a second page wants a second
 * module, not a second constant here.
 *
 * Current value: commit 49aced1, 24 Nov 2026 08:10:36 UTC, which added the
 * prose link to `/guides/`. Deliberately not today's date - adding a sitemap
 * field changes nothing a reader sees, and the `team` and `testimonials`
 * precedents both recorded the prior content-change date.
 */
export const aboutCopyLastmod = '2026-11-24T08:10:36Z';
