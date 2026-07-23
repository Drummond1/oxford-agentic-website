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

2. `blocked` (needs GSC account + verification token) — Add Google Search Console
   verification meta tag; submit sitemap; request indexing.
3. `blocked` (needs Bing account) — Bing Webmaster verification + sitemap.
4. `blocked` (needs Plausible account + site id) — wire analytics in site.config.
5. `blocked` (needs a LinkedIn Company Page URL) — add it to `brand.social` so it flows
   into Organization `sameAs` for entity consistency / GEO triangulation.
6. `blocked` (needs consent) — flip `testimonials` on once quotes are cleared; add
   Cohort 1 testimonials and un-gate the people photos.
7. `blocked` (needs venue confirm + Luma page) — set Cohort 2 `confirmed: true` and add
   its `lumaEventId` when the page exists (~28 Jul).
8. `todo` — Deepen FAQ coverage with real user questions (GEO): "How much does it cost?"
   handling, "Is it suitable for non-technical founders?", "What AI tools will we use?",
   "Can my team come together?". Add to homepage + programme + event FAQ where truthful.
9. `todo` — Add a guide targeting "AI training for finance teams" (feeds a future
   Finance Edition), linking to the programme.
12. `todo` (once GSC data) — rewrite titles/meta on any page with impressions but low CTR.

## Shipped

_(dated, newest first — filled by the loop)_

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
- Search Console: not connected yet.
- Analytics: not connected yet.
- Luma registrations: track weekly per event.
- Last Lighthouse (local, 2026-07-23): 100 / 100 / 100 / 100, LCP 0.3s, CLS 0.
