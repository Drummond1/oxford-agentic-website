# Continuous-improvement loop — ledger

This file is the memory of the website improvement loop. A scheduled agent reads
it first and writes to it last, every cycle, so improvement compounds instead of
re-deriving from scratch. Same pattern as the delight ledger in the vault.

**Live site:** https://oxfordagentic.com · **Repo:** github.com/Drummond1/oxford-agentic-website
**Deploy:** push to `main` → GitHub Actions builds + validates → GitHub Pages. Auto-deploys.

---

## How the loop runs (follow this order every cycle)

1. **Read** this whole file. Never re-pitch anything under "Decided against". Never
   redo anything under "Shipped".
2. **Gather signal** (whatever is available):
   - Google Search Console — top queries, impressions, average position, CTR, coverage.
   - Analytics (Plausible) — pageviews, `register_section_viewed`, `luma_outbound_click`,
     `newsletter_signup`, `next_event_cta_click`, by event-slug.
   - Luma registrations vs site referrals.
   - `npm run build` output (link + schema + Lighthouse budgets).
   - Content freshness — any past event missing outcomes; any stale `updatedDate`.
   - Record the numbers under "Signal snapshot".
3. **Decide** the 1–3 highest-leverage changes this cycle. Until Search Console data
   exists, work the Backlog in priority order. Once it exists, become signal-driven:
   fix the biggest gap between impressions and position/CTR first.
4. **Change** — make small, focused edits. Update `updatedDate` on any content you touch.
5. **Verify** — run `npm run build`. It MUST pass (link check, schema, Lighthouse).
   If it fails, fix or revert — never push a failing build.
6. **Ship** — commit with a clear message and `git push origin main`.
7. **Log** — move the item to "Shipped" with the date and what changed; add any new
   ideas to the Backlog; update "Signal snapshot".

## Autonomy — AUTO-SHIP (current setting, pre-launch)

Auto-ship changes without approval, because the site is not yet promoted and the CI
gate prevents breakage. Keep each cycle small and reversible.

**Hard guardrails — never, even on auto-ship:**
- Never invent testimonials, quotes, names, statistics, or outcomes. Facts only.
- Never publish prices (they live on Luma).
- Never flip a consent-gated flag (`testimonials`, photo `consentCleared`) — those wait
  for real human consent.
- Never change a confirmed fact (dates, venue, capacity) unless told to.
- British spelling; brand voice (plain, practical, confident, no hype, no exclamation
  marks, no emoji). Newsreader/Plex/Plex Mono and the design tokens are law.
- One clean commit per cycle; if the build fails, do not push.

_When the site goes public, switch this section to: auto-ship the technical/freshness
tier; propose-and-approve anything touching copy, claims or design._

---

## Backlog (priority order)

Status: `todo` · `blocked` (why) · `doing`

2. `todo` (Drummond, 2 min in the GSC UI) — Search Console property is VERIFIED via
   DNS TXT (confirmed 2026-07-23). Still to do: submit `sitemap-index.xml` under
   Sitemaps, and URL-Inspect → Request indexing for the homepage, the Cohort 2 event
   page and /guides/. Then export Performance CSVs into `seo-data/` so the loop has
   real query signal.
3. `blocked` (needs Bing account) — Bing Webmaster verification + sitemap.
4. `blocked` (needs Plausible account + site id) — wire analytics in site.config.
5. `blocked` (needs a LinkedIn Company Page URL) — add it to `brand.social` so it flows
   into Organization `sameAs` for entity consistency / GEO triangulation.
6. `blocked` (needs consent) — flip `testimonials` on once quotes are cleared; add
   Cohort 1 testimonials and un-gate the people photos.
7. `blocked` (needs venue confirm + Luma page) — set Cohort 2 `confirmed: true` and add
   its `lumaEventId` when the page exists (~28 Jul).
8. `blocked` (needs Drummond's answers — these are policy facts the loop must not
   invent) — Deepen FAQ coverage for GEO. Open questions to answer: What AI tools do
   attendees use on the day, and does anyone need to buy a licence? Can colleagues book
   as a team, and is there a group rate? What happens if someone cannot make the date
   (refund/transfer)? Are sessions recorded? Is lunch included? Each answered question
   becomes an FAQ entry on the homepage, programme and event pages, and feeds FAQPage
   schema — high GEO value.
9. `todo` — Write a 5th guide once a query gap is known (hold until Search Console data
   exists, so it targets a real query rather than a guess).
10. `blocked` (needs Drummond to approve his own bio) — turn `speakers` on. His profile
    page would add a Person entity and strengthen the Article author signal, but the bio
    was drafted from vault facts and he has not reviewed it. Do not publish a biography
    of a real person unreviewed.
11. `todo` — Continue the manual accessibility audit: keyboard path through the nav
    dropdown and mobile menu, FAQ accordion, Luma embed fallback link, and focus order
    around the sticky mobile bar. (Scroll-reveal focus trap fixed in cycle 7.)
12. `todo` — Consider `changefreq`/`priority` in the sitemap only if Search Console shows
    a crawl-budget issue; otherwise leave them out (Google largely ignores them).
12. `todo` (once GSC data) — rewrite titles/meta on any page with impressions but low CTR.

## Shipped

_(dated, newest first — filled by the loop)_

- **2026-07-23 — Cycle 7: fixed a real keyboard-accessibility bug.** Manual audit found
  2 focusable links sitting inside scroll-reveal blocks still at `opacity: 0` — including
  the Cohort 2 event card, i.e. the primary conversion path. A keyboard user tabbing down
  before the observer fired would have landed focus on invisible content. Lighthouse's
  automated checks cannot detect this. Fixed with `:focus-within` plus a `focusin`
  handler that reveals the block permanently. Verified: focus now reveals, and it stays
  revealed after focus moves on.

- **2026-07-23 — Cycle 6: truthful sitemap lastmod.** Each content-backed URL now
  carries a real `lastmod` from its own `updatedDate` (falling back to file mtime);
  pages with no content file behind them deliberately carry none, rather than stamping
  the whole site with the build date on every deploy.

- **2026-07-23 — Cycle 5: RSS feed + list schema on index pages.** Added /rss.xml for
  the guides (a second machine-readable surface alongside llms.txt, and a distribution
  channel that does not depend on search), discoverable via <link rel="alternate">.
  Added CollectionPage + ItemList schema to the guides and events indexes so crawlers
  and AI engines read them as ordered listings rather than loose pages. Links 389 → 402.

- **2026-07-23 — Cycle 4: QA pass + widened CI coverage.** Added a guide page to the
  Lighthouse budget (a page type CI had never measured) — scores 100/100/100/100, LCP
  0.4s. Flags acceptance test re-run with guides live: all-on = 16 pages / 569 links,
  all-off = 8 pages / 213 links, both coherent with zero broken links. Verified live:
  12 sitemap URLs, 5 guide URLs, all 4 guides in llms.txt.

- **2026-07-23 — Cycle 3: added "Agentic AI for finance teams" guide.** Targets the
  long-tail "AI training for finance teams" query and seeds demand for a possible future
  Finance Edition (without claiming one is scheduled). 4 guides now live; 13 pages;
  internal links 358 → 389.

- **2026-07-23 — Cycle 2: per-guide OG cards + two-way internal linking.** Each guide
  now generates its own 1200×630 card (was sharing the generic index card), and the
  programme page gained a "Further reading" section linking to its guides — closing the
  loop that previously only ran guide → programme. Internal links 355 → 358.

- **2026-07-23 — Published the guides section (3 articles, flag on).** Wrote
  "Agentic AI for business leaders: where to start" and "Why in-person beats online
  for learning AI"; turned `guides: true`. Site went 8 → 12 pages; each guide ships
  Article schema and links to the programme. Build/link/schema all pass. Next: per-guide
  OG images (backlog 11), and a finance-team guide (backlog 9).

## Decided against

_(so the loop never re-pitches — record the reason)_

## Signal snapshot

_(latest numbers — filled once data sources are connected)_
- Search Console: property VERIFIED 2026-07-23 (DNS TXT). No query data yet — a new
  property takes roughly 3–7 days to report. Loop reads exports from `seo-data/`.
- Analytics: not connected yet.
- Luma registrations: track weekly per event.
- Last Lighthouse (local, 2026-07-23): home, event and guide pages all
  100 / 100 / 100 / 100; LCP 0.3–0.4s; CLS 0.
- Site size: 13 pages live (12 in sitemap + 404); 4 guides.
- **Loop status:** high-value unblocked work is largely done. Before declaring the
  backlog empty, GENERATE new candidates (technical SEO surfaces, schema depth,
  accessibility, performance, content gaps) — only stop when genuinely nothing
  truthful and useful remains. Never manufacture churn; never invent facts.
