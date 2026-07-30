# Continuous-improvement loop — ledger

This file is the memory of the website improvement loop. A scheduled agent reads
it first and writes to it last, every cycle, so improvement compounds instead of
re-deriving from scratch. Same pattern as the delight ledger in the vault.

**Start with [STATE.md](STATE.md)** for current state, blockers and settled decisions.

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
9. `todo` — Content cluster: the probe-driven list from the GEO baseline is now FULLY
   SHIPPED (12 guides). Do NOT invent a thirteenth to keep the cadence going — the next
   guide should answer a question real signal shows people asking. Blocked on Search
   Console query data. If a topic is genuinely obvious before then, it must pass the
   same test as the others: a real question, standing alone, one link to the programme.
   (Budget for 30 Jul is SPENT.)
   Each must answer a real question, stand alone, and link to the programme once.
   HARD RULE — no doorway pages: never create location variants ("AI bootcamp London",
   "AI training Cambridge") or thin near-duplicates; Google penalises them and they
   cheapen the brand. Query-shaped and genuinely useful, or not at all.
10. `blocked` (needs Drummond to approve his own bio) — turn `speakers` on. His profile
    page would add a Person entity and strengthen the Article author signal, but the bio
    was drafted from vault facts and he has not reviewed it. Do not publish a biography
    of a real person unreviewed.
12. `todo` — Consider `changefreq`/`priority` in the sitemap only if Search Console shows
    a crawl-budget issue; otherwise leave them out (Google largely ignores them).
13. `todo` (once GSC data) — rewrite titles/meta on any page with impressions but low CTR.
## Shipped

_(dated, newest first — filled by the loop)_

- **2026-07-30 — Cycle 27: the closing CTA was pointing the wrong way.**
  The cycle's hypothesis was wrong and worth recording as such: the Cohort 2 page was
  expected to have accumulated too many sections, and it has not — four sections
  (facts, register, agenda, FAQ) plus hero and closing band. It is lean. No
  restructuring was warranted and none was invented.
  What the read-through did find is a real bug. `registerLabel` was one shared string,
  "Register below ↓", used by both the hero CTA and the closing gold band — but the
  register section sits *above* the agenda and FAQ, so from the closing band the form
  is upward. The label promised "below" and the arrow pointed down, at a section the
  reader had already scrolled past. The page's own code comment states the rule it was
  breaking: "The CTA has to tell the truth about what is actually below it." Now the
  verb is extracted once (`Register` / `Join the waitlist` / `Get notified`) and each
  CTA states its own direction: `heroRegisterLabel` ends "below ↓",
  `finalRegisterLabel` ends "↑". The sticky bar keeps its deliberately shorter labels,
  which fit a constrained bar and are not directional.
  _Deliberately not fixed:_ the agenda still ends 16:20 while the day runs to 17:00
  (blocked item 3). A closing row could be derived honestly from `endDate`, but
  Drummond has an open decision on that agenda and one clean change per cycle beats
  bundling churn into a decision that is his.

- **2026-07-30 — Cycle 26: the guides section grows up (12 guides needs structure).**
  Two problems that arrived by accretion, both invisible at three guides and obvious
  at twelve. (a) **The index was a flat reverse-chronological grid** — fine as an
  archive, useless for "which one is for me". Guides now carry a required `category`
  (`start-here` / `choosing` / `in-practice`, defined once in `content.config.ts` with
  labels and blurbs) and the index groups by it, in reader-journey order rather than
  publication order. Required, not defaulted, deliberately: a guide nobody has placed
  in the journey is usually a guide nobody decided the purpose of. (b) **Every guide
  page listed all eleven siblings** — a wall of undifferentiated links. Now
  same-category first, newest others to fill, capped at four, with an "All guides"
  link underneath so nothing is orphaned: 13 guide links per page down to 7. The
  CollectionPage ItemList still enumerates all 12, so crawlers lose nothing.
  Verified: grouped index and the new sibling nav by screenshot, flags matrix green
  both ways, 28 pages, schema green.
  _Note for next time:_ the browser pane again refused to scroll (`scrollIntoView`
  returned ok, screenshot unchanged) — headless Chrome with a tall `--window-size`
  plus a sharp crop is the reliable way to see below the fold. Third time this pane
  quirk has cost a cycle a few minutes.

- **2026-07-30 — Cycle 25: "How to run an AI pilot that survives contact with your team"
  — and the content cluster is now complete.** The last guide on the probe-driven list.
  Angle: pilots do not fail on the technology, they fail organisationally, so the guide
  is about scoping (a task, not a tool), ownership (the person whose task it is, not an
  innovation team), defining "better" in advance against how the job is done today,
  building the check in, and planning for week two — the fortnight-in drop-off where
  most pilots quietly die. It is also the closest guide to a sales argument for the
  bootcamp without making one: "if that person cannot build it, that is a stronger
  argument for teaching them than for building it for them."
  _Two process notes._ A draft sentence used an invented first name for an illustrative
  colleague; cut before build, because on a site whose credibility rests on never
  inventing people, even a hypothetical name is a bad habit. And the build caught the
  meta description at >160 chars — the strict schema doing exactly its job.
  12 guides, 28 pages. **The backlog's content list is now exhausted**: rather than
  invent a thirteenth topic to keep the cadence, backlog 9 is rewritten to require real
  query signal first. Guide budget for 30 Jul: spent.
  _Loop status:_ the 09:01 cron has not fired since 27 Jul (`lastRunAt` 27 Jul, next
  31 Jul) — the machine is asleep at that hour, so every cycle since has come from the
  in-session loop. Worth moving to a cloud schedule if hands-off daily runs matter.

- **2026-07-29 — Cycle 24: "Agentic AI for public-sector and NHS leaders" (backlog 9).**
  (Cycle 23 was heartbeats only: guide budget spent, everything else blocked.) The
  angle honours the persona rule from the copywriter brief - never write as if money
  is no object or as if they can adopt tools unilaterally. Governance is framed as
  the design brief, not the blocker: pick tasks the rules already permit (papers from
  public material, consultation synthesis, minutes, template drafts) and keep
  decisions about individuals, clinical judgement and personal data explicitly out of
  scope. Budgets get the same treatment - a workflow is a method in tools already
  licensed, not a procurement exercise. 11 guides live; 27 pages; propagated into
  llms.txt, RSS and the sitemap; no em dashes; schema green. Guide budget for 29 Jul:
  spent. Next unblocked item: the AI-pilot guide, tomorrow.
  Fresh-eyes pass over content conventions (no em dashes, no Americanisms outside
  schema.org/CSS identifiers), 320px layout, console errors, 404, robots and
  canonicals: nothing to fix. One finding worth keeping: **headless Chrome
  `--window-size=320` screenshots showed phantom horizontal clipping that does not
  exist** — the real browser at 320px measures `scrollWidth` 320 with zero overflowing
  elements (only the decorative `hero__motif`, by design). Do not chase overflow bugs
  from bare headless captures; verify with a real viewport measurement first, the same
  class of trap as the stale-computed-styles note from cycle 16. Since the sweep found
  nothing, the cycle went to STATE.md instead, which was five cycles stale: page count,
  the photography system + its consent caveat (two flags flipped in-session, Drummond
  asked to confirm — now blocked-table item 9), `/home-original/`, the schema-depth
  summary, and a corrupted duplicate of the blocked table removed. Loop note: unblocked
  backlog is now thin; guide budget for 28 Jul spent; interval stretched.

- **2026-07-28 — Cycle 21: "Agentic AI for consultants" (backlog 9).**
  The next guide in the probe-driven order. Angle: sell the judgement, not the
  assembly — the assembly layer (discovery synthesis, proposal-from-proposals,
  findings from meeting notes, a check-against-the-brief reviewer step) suits a
  workflow; the recommendation, prioritisation and client relationship do not. Two
  consultant-specific sections the sibling guides don't have: confidentiality as the
  precondition (client material only into tools the engagement terms allow), and why
  workflows compound for time-sellers in particular — an associate helps the
  engagements they staff, a kept workflow helps every engagement after it. Facts
  drawn from repo content only; no client claims invented. 10 guides now live;
  25 pages, 932 links; propagated automatically into llms.txt, RSS, the guides
  index, sibling links and the sitemap; Article carries articleSection + about.
  Guide budget for 28 Jul: spent.
  Freshness sweep first: llms.txt turned out to be generated and current (all 9 guides,
  team pages, both events), and `hasCourseInstance` was already on the Course node from
  an earlier cycle — the "never redo" rule caught both before work started. The genuine
  gap: the Organization node asserted no `founder` even though the team page publicly
  establishes one. Now emitted on every page, sourced from the team collection's
  `isHost` entry rather than a hardcoded string, with the same `@id` as the Person node
  on Drummond's team page so both references resolve to one entity — verified identical
  in the built HTML. When `features.team` is off the URL and @id are withheld and only
  the name is asserted (flags matrix green both ways). Entity triangulation is the GEO
  lever here: Organization → founder → Person → sameAs LinkedIn is exactly the kind of
  cross-confirmable chain engines reward. Next cycle: the guide-per-day budget has
  reset — "Agentic AI for consultants" (backlog 9) is due.

- **2026-07-26 — Cycle 19: conversion-path audit (backlog 17), two friction points fixed.**
  Walked the landing-to-booking path as a first-time visitor. Most of it held up —
  the event hero's Register jump, the mobile sticky bar and the embed loading state
  all shipped in earlier cycles, and `--burnt` (suspected undefined during the audit)
  turned out to be a deliberate alias of rust. Two things did not hold up:
  (a) **The homepage event card never used the capacity fact** — the cap is the honest
  scarcity signal and it sat unused in frontmatter. The card's meta row now reads
  date ■ venue ■ "Capped at 25", rendered only while status is `upcoming`, straight
  from the event file, nothing invented. (b) **"Book the next cohort" now lands on the
  booking form** (`…/#register`) instead of the top of the event page — a button whose
  verb is "book" should not cost a second click to reach the thing it promised. The
  event card deliberately still lands at the page top: its job is details, the hero
  button's job is intent. Verified in dist/ HTML and by screenshot; 879 links, 24
  pages, schema green. Audit item retired; re-run it against real analytics once
  Plausible is wired.

- **2026-07-26 — Cycle 18: every URL becomes a first-class entity (schema depth, backlog 14 + 16).**
  Overnight in-session loop, distinct from the 09:01 cron. (a) **A `WebPage` node on
  every indexable page** (22 of 24 — `noindex` pages deliberately excluded), emitted
  from BaseHead so no page can forget it: `@id` `…#webpage`, `isPartOf` the WebSite,
  `primaryImageOfPage`, article dates when present. Article `mainEntityOfPage` now
  references that `@id` instead of a bare URL string, so the graph is connected rather
  than parallel. (b) **Article nodes gain `articleSection: 'Guides'` and `about`** —
  the related programme(s) as Things with URLs, tying every guide to the bootcamp
  entity it supports. (c) **Event photo images are `ImageObject`s with captions**
  (the alt text), replacing bare URL strings. (d) **Backlog 16 resolved by correcting
  the comment** rather than building an `nth-of-type` mechanism: the alternation
  comment in `global.css` now says plainly that `createRhythm()` in page frontmatter
  is the mechanism, that a bare `class="band"` renders transparent, and that new
  sections must take their colour from `rhythm.next()`. Chose the comment over a CSS
  rule because a position-based CSS rule would fight the JS assignment and reintroduce
  the very ambiguity it was meant to fix. Verified in built HTML: WebPage on 22 pages,
  absent on `/home-original/`; captions and `about` present; 879 links, 24 pages,
  schema check green.

- **2026-07-26 — Cycle 17: a buyer's-checklist guide, and a 404 that routes properly.**
  No Search Console export in `seo-data/` (see Signal snapshot), so backlog-driven again.
  (a) **"Questions to ask before booking AI training"** (backlog 9) — the next guide in
  the probe-driven order, and the one the GEO baseline argued for: engines assemble
  comparison tables for this query, and a checklist page hands them the criteria. Nine
  questions, each with what a straight answer sounds like, then our own answers to all
  nine — cohort cap, three build cycles, no coding, laptop plus one real task, not
  recorded, place transfers at no charge — every one a fact already in the repo, none
  invented. It closes by naming what the day deliberately does not cover (landscape,
  model comparisons, governance), which is the checklist's own most revealing question
  turned back on us. 9 guides now live; 24 pages; 879 internal links.
  (b) **The 404 became a real landing surface** (backlog 15) — it takes organic traffic
  from dead and mistyped links and is the one page with no breadcrumb trail behind it,
  yet it offered only "All events" and "Home". It now carries an "Or start here" band
  with the programme, Events, Guides and About; the Guides route sits behind
  `features.guides` like the rest of the section, so the flags test stays coherent.
  _Two notes for the next cycle._ The browser pane reported a 0×0 viewport throughout
  this run (scroll and `read_page` returned nothing, `computer` timed out) — a scheduled
  run appears to get a hidden pane, so verify from `dist/` HTML rather than the preview.
  And `class="band"` with no modifier renders transparent despite the alternation comment
  in `global.css`; caught before it shipped, logged as backlog 16.

- **2026-07-25 — Fix: CI had been red since cycle 14 (~12:07), across eight commits.**
  Two separate faults, found only after reading the actual CI log rather than assuming:
  1. **The real cause — Lighthouse was auditing the wrong build.** `check:flags` finishes
     on the all-flags-OFF build, so it left `dist/` with 7 pages and no `/guides/`.
     Lighthouse then 404'd on the guide URL added to its budget in cycle 14 and errored
     out. Fixed at the root: `check-flags.mjs` now rebuilds `dist/` from the restored
     config in its `finally` block, so nothing downstream can ever inspect the wrong
     site — plus an explicit rebuild step in `ci.yml` as a belt-and-braces guard.
  2. **A genuine budget problem underneath it.** Luma's booking iframe sets third-party
     cookies and logs DevTools issues, dropping best-practices to 78 on event pages.
     Not fixable from our side, and the embed IS the conversion mechanism (PRD §9), so
     Lighthouse now uses an `assertMatrix`: event pages accept ≥0.75 with those two
     audits off; every other page must still score 100.

  **Lesson, recorded so it is not repeated: after pushing, check `ci.yml` — not just
  `deploy.yml`.** Deploy stays green through this class of fault because it does not run
  Lighthouse, which is exactly why it went unnoticed for eight commits. The live site was
  never affected.

- **2026-07-25 — Cycle 16: micro-interactions phase 4, all on paths that gave no feedback.**
  Chosen by auditing where a user currently acts and learns nothing, not by adding
  ornament. (a) **The Luma booking embed now has a loading state** — it is lazy-loaded, so
  the highest-intent moment on the site was an empty 450px box. A placeholder sits behind
  it in the same box (so CLS stays 0) and clears on the iframe's load event, with a 6s
  timeout fallback and an idempotent guard so a blocked third-party embed can never leave
  a stuck "Loading…". (b) **Signup field feedback** — amber underline on focus, rust on
  `:user-invalid` (not `:invalid`, so an untouched field is never scolded), and the button
  says "Sending…" rather than going dead. NOTE: dormant until `newsletter.endpoint` is
  set, because the form only renders when configured. (c) **"Add to calendar" confirms** —
  it downloads an .ics silently, so people clicked twice; it now says "Calendar file
  saved" for 2.4s. (d) **The header gains an amber hairline once scrolled**, via an
  IntersectionObserver on a 1px sentinel rather than a scroll listener — a border, not a
  shadow, because the guidelines are a flat printerly system.
  _Verification note:_ the browser pane returns STALE computed styles for pre-existing
  elements (an `!important` inline style on an existing element does not move it, while a
  freshly created element behaves correctly). Do not trust `getComputedStyle` there for
  class-toggle checks — verify visually or in the built CSS instead. The header state was
  confirmed by screenshot.

- **2026-07-25 — Cycle 15: the agenda becomes machine-readable (schema depth).**
  Event nodes now carry `subEvent` — all 12 agenda rows as real sub-events with precise
  BST timestamps composed from the event's own date, so an assistant asked "what does
  the day look like?" reads the actual schedule instead of inferring it from prose. Rows
  without a parseable HH:MM carry no timestamp rather than an invented one. Cohort 1's
  consent-cleared photos are now also `image` entries on its Event node (3 images):
  Google's event rich results prefer real photography over a generated card. Verified
  the emitted JSON-LD by hand — offsets correct, each row handing off to the next.
  Flags test: all-on 20 pages/823 links, all-off 8 pages/222 links, both clean.
  Guides deliberately NOT extended this cycle: the one-guide-per-day rule was already
  spent by cycles 11–12 today.

- **2026-07-25 — Cycle 14: micro-interactions phase 3 (incl. a missed PRD item).**
  (a) **Animated stat counters** — PRD §10 specified these and they had never been
  built. Cohort 1's outcome tiles now count up once as they scroll into view, easing
  out so they settle rather than stop dead. The final number stays in the HTML, so it
  is correct before, during, and entirely without JS. (b) **Reading progress** — a
  2px amber hairline on long-form pages, driven off the existing `article` prop;
  rAF-throttled with `scrollHeight` cached on resize, so it never forces a reflow.
  (c) **Heading anchors** on guide articles — hover reveals a rust `#`, clicking copies
  the deep link and confirms briefly. Progressive enhancement only: the ids are already
  in the static HTML, so deep links and citations work with JS off. (d) **The Quad
  responds** — the amber centre of the logo grows slightly on hover/focus. All four
  reduced-motion-safe. Lighthouse still 100/100/100/100, CLS 0.
  _Rejected during this cycle:_ adding rehype-slug/autolink-headings, which would have
  swapped Astro's default markdown processor for unified across 8 shipped guides — the
  build revealed heading ids already exist, so the risk bought nothing.

- **2026-07-25 — Cycle 13: visible breadcrumbs, article metadata, course workload.**
  No Search Console export in `seo-data/` yet, and cycle 12 had already shipped the
  day's guide allowance, so this cycle worked the technical tier. (a) Breadcrumbs are
  now visible on all 15 deep pages, rendered from the same trail array that feeds the
  BreadcrumbList JSON-LD — one source of truth, so markup and schema cannot drift.
  They sit on ink above the dark hero and read as the top of that band; the current
  crumb is ellipsis-truncated to one line because the h1 names the page in full
  directly below. Internal links 586 → 612; every deep page now has a route back to
  its section and to home. (b) Guides send `og:type=article` plus
  `article:published_time` / `modified_time` / `author` / `publisher`, so crawlers and
  social cards that never parse JSON-LD still read freshness and authorship.
  (c) `CourseInstance` gained `courseWorkload` (PT7H30M, computed by `isoDuration()`
  from the published start and end times — never asserted), plus a per-instance
  `name`/`url` and a stable `@id` on the Course node. Workload is the duration field
  Google's course rich result wants; `offers` is still deliberately absent because
  price lives on Luma. Build green: 17 pages, 612 links resolve, schema valid.
  Verified in the browser at desktop and mobile, no console errors.

- **2026-07-25 — Cycle 12: probe-driven guides, lead capture on guides, micro phase 2.**
  Shipped the top two recommendations from the GEO probe: "You've finished an AI
  executive programme. Now what?" (speaks to the PRD's primary audience at the exact
  moment the engines frame exec ed as strategic-not-hands-on) and "What does 'hands-on'
  actually mean in AI training?" (owns the axis term the whole query space pivots on).
  8 guides; 17 pages; links 496 → 586. Lead-gen: every guide now ends with a quiet
  email-capture card — organic readers convert to subscribers on the page they landed
  on; homepage untouched (0 guide links in its main flow, verified). Micro-interactions
  phase 2 (backlog 11): the amber dash draws in from the left as its section reveals;
  the event page's sticky mobile bar rises in once on load. Both reduced-motion-safe.

- **2026-07-25 — Cycle 11: content cluster opened (glossary + comparison guide).**
  Two new query-shaped pages: "A plain-English glossary of agentic AI" (definition
  shape — the format AI assistants quote most readily; 12 terms, each a self-contained
  answer) and "AI bootcamp, AI course or executive education: which do you need?"
  (comparison shape — how buyers actually decide; honest about what each route is for).
  6 guides now live; 15 pages; internal links 414 → 496. Linked only through the quiet
  surfaces (guides index, More-guides cross-links, Further reading, RSS, sitemap,
  llms.txt) — the content layer stays subtle, never a primary feature of the site.

- **2026-07-25 — Cycle 10: keyword alignment on the primary ranking page.** The
  programme page — the page targeting "AI bootcamp Oxford" — never said "AI bootcamp"
  in its title or meta, and its title wasted length repeating the brand ("The Oxford
  Agentic Bootcamp — Oxford Agentic"). Now: title "The Oxford Agentic Bootcamp |
  One-day AI bootcamp in Oxford", shortPitch/meta and answer capsule aligned (both
  truthful, capsule at 56 words), events-index description de-duplicated. This is the
  single highest-leverage on-page SEO fix available pre-data.

- **2026-07-25 — Cycle 9: guide cross-links, keyboard fixes, micro-interactions.**
  Every guide page now ends with a "More guides" nav linking its three siblings —
  no guide dead-ends, internal links 402 → 414. Accessibility audit continued and
  closed out: Escape now closes the mobile menu and returns focus to the toggle;
  removed the Luma iframe's redundant `tabindex="0"` (was a double tab stop) and the
  no-op `aria-hidden="false"` attributes; dropdown (`:focus-within`), FAQ accordion
  (native `details`) and always-visible Luma fallback link all verified sound.
  Micro-interaction pass (requested live by Drummond mid-cycle): CTA arrows nudge
  forward on hover, buttons settle on press, FAQ answers fade in on open, top-nav
  links draw a gold underline (held on the current page). All inherit the global
  reduced-motion override. Verified in the browser: More-guides links resolve,
  Escape/focus behaviour confirmed, underline + arrow transitions live.

- **2026-07-24 — Cycle 8: FAQ depth from Drummond's answers (+ FAQPage schema).**
  Added five real Q&As (paid subscription, team bookings, transfer if you can't make the
  date, recordings, lunch) sourced from Drummond directly — no invented policy. Programme
  FAQ 6 → 11, Cohort 2 event FAQ 5 → 9, homepage FAQ 6 → 8. Each renders in-page and
  feeds FAQPage schema, the format AI assistants quote directly. Highest-value GEO move
  available; was blocked on knowledge, now unblocked.

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

- **`offers` on the Course node (2026-07-25, cycle 13).** Google's course rich result
  reads `offers`, but a valid `Offer` means publishing a price, and price lives on Luma
  by policy (PRD §18). The `EducationEvent` node already carries a priceless `Offer`
  with availability only. Not revisited unless the pricing policy itself changes.

## GEO baseline (Perplexity probe, 2026-07-25)

Asked Perplexity: "best hands-on AI training or AI bootcamp in Oxford for business
leaders — I want to actually build something, not just listen to talks." Findings:

- **oxfordagentic.com was NOT cited.** Expected — domain is 3 days old, indexing pending.
- **Who won the citation:** Elansio (elansio.com/ai-training-oxford.html) ranked first
  for exactly our positioning ("leave having deployed real, working capabilities",
  exec audience, on-site Oxford); The Oxford AI School second; OxML took the technical
  slot; Saïd Business School programmes framed as "strategic, online, not hands-on".
- **What the winning answer rewarded:** an exact-match landing page for "AI training
  Oxford", build-outcome language, and local/in-person emphasis. Perplexity's own
  framing ("exec ed = strategy, bootcamp = build") matches our comparison guide.
- **Third-party sources cited:** digitaldefynd.com, datadrivendaily.com, cpduk.co.uk —
  aggregator/review sites. Confirms §13's point: engines triangulate third-party
  mentions. (Outreach/listings are Drummond's side; the loop cannot create them.)
- **Re-probe monthly** with the same question and log deltas here. First success
  criterion: oxfordagentic.com appears in the citation list at all.

## Signal snapshot — first external validation (Search Console, 25 Jul)

Google's own reports, data as at 24 Jul (so this PREDATES cycle 15's subEvent work
and the four guides shipped on 25 Jul — expect all counts to rise):

- **Sitemap: Success.** Submitted 23 Jul, last read 24 Jul, 12 pages discovered.
  12 was the true count on 24 Jul; the live sitemap now lists 16. No action needed —
  Google re-reads on its own schedule and `lastmod` already reflects the change.
- **Enhancements → Events: 2 valid, 0 invalid.** Both event pages validated. This is
  the gate for Google event rich results, and it passed before indexing even finished.
- **Enhancements → Breadcrumbs: 3 valid, 0 invalid.** Only 3 because few pages had been
  crawled by 24 Jul; 15 deep pages carry breadcrumbs, so this should climb.
- **Page indexing: still "processing data".** Normal for a property verified 23 Jul.
  Re-check ~27 Jul for the Indexed count and any not-indexed reasons. Watch for
  `noindex` or `Redirect error` — those would be real faults. `Discovered/Crawled —
  currently not indexed` is expected at this age and needs nothing.
- **Performance: no query data yet.** Nothing to export into `seo-data/` until roughly
  the first week of August.

## Signal snapshot

_(latest numbers — filled once data sources are connected)_
- Search Console (checked 2026-07-26, cycle 17): `seo-data/` still holds only its
  README — **no Search Console export available**, so this cycle could not be
  signal-driven either. The property was verified 2026-07-23 (DNS TXT) and the
  25 Jul in-UI check showed sitemap Success plus valid Event and Breadcrumb
  enhancements, but Performance had no query data yet — expected for a property
  this new, roughly the first week of August. **Drummond: export Performance →
  Queries.csv and Pages.csv into `seo-data/`** (git-ignored) the moment rows appear,
  and the loop switches to gap-driven work immediately. Until then it stays
  backlog-driven and technical. Four cycles have now run without query signal;
  this is the single biggest constraint on the loop's usefulness.
- Analytics: not connected yet.
- Luma registrations: track weekly per event.
- Last Lighthouse (local, 2026-07-23): home, event and guide pages all
  100 / 100 / 100 / 100; LCP 0.3–0.4s; CLS 0. CI enforces the budgets on every push
  via the `assertMatrix` added in the cycle-14 fix.
- Site size (2026-07-26, after cycle 17): 24 pages built; 9 guides;
  879 internal links.
- **Loop status:** high-value unblocked work is largely done. Before declaring the
  backlog empty, GENERATE new candidates (technical SEO surfaces, schema depth,
  accessibility, performance, content gaps) — only stop when genuinely nothing
  truthful and useful remains. Never manufacture churn; never invent facts.
