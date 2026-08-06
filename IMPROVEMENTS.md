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
2b. **`blocked` (Drummond, highest-leverage item on this list) — off-page presence.**
   _Sharper as of 31 Jul: the Organization node now claims **no third-party identity at
   all**, because its only `sameAs` entry (`luma.com/oxfordagentic`) was a 404 and was
   removed. A LinkedIn Company Page would be its first. A real Luma calendar URL works
   too — drop either into `brand.social` and it flows into schema automatically._
   The 30 Jul GEO re-probe proved the on-page work has hit its ceiling: the site now
   ranks #2 for Oxford-anchored queries and is absent from the national buyer question,
   where every citation came from an aggregator. Concretely: list Cohort 2 on
   **Eventbrite** (cited three times in that answer), on UK AI-event aggregators, and
   create the **LinkedIn Company Page**. Each is a citable third-party mention of the
   entity. This now outranks every remaining technical item on the backlog.
3. `blocked` (needs Bing account) — Bing Webmaster verification + sitemap.
4. `blocked` (needs Plausible account + site id) — wire analytics in site.config.
5. `blocked` (needs a LinkedIn Company Page URL) — add it to `brand.social` so it flows
   into Organization `sameAs` for entity consistency / GEO triangulation.
6. `blocked` (needs consent) — flip `testimonials` on once quotes are cleared; add
   Cohort 1 testimonials and un-gate the people photos.
7. `blocked` (needs venue confirm + Luma page) — set Cohort 2 `confirmed: true` and add
   its `lumaEventId` when the page exists (~28 Jul).
9. `todo` — Content cluster: **Drummond re-opened guides on 4 Aug** ("add more guides
   for example"), overriding the wait-for-signal gate cycle 25 set. The quality bar is
   unchanged: a real question, standing alone, one programme link, never more than one
   guide per day. 13 shipped; "choosing your first task" went out in cycle 38.
   Remaining candidates that pass the bar: "do I need a paid AI subscription?"
   (expands a real event-page FAQ); agentic AI for charities and non-profits
   (persona-established). The second-brain contents guide shipped in cycle 48.
   **The Second Brain line now has one supporting guide; the Agentic line has 13.
   Weight new guides toward Second Brain until that is less lopsided.**
   (Budget for 6 Aug is SPENT.)
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
14. `todo` — **two-product sweep checklist** (from cycles 49–52). When a product line
    launches, these four shared surfaces silently keep describing the old single
    product: the homepage FAQ (`src/lib/home.ts`), the glossary's `about` edge, the
    About page origin story, and FAQ depth parity between the lines. All four are
    now reconciled for the Second Brain launch; re-run the list on the next launch
    rather than rediscovering them one cycle at a time.
15. `blocked` (Drummond) — the Second Brain day has **no published capacity** anywhere,
    including Luma, so its pages cannot answer "how big is the cohort?" while the
    Agentic pages can. If there is a real number, adding it closes a genuine buyer
    question. The loop will not guess one.
## Shipped

_(dated, newest first — filled by the loop)_

- **2026-08-06 — Cycle 52: the Second Brain line had half the FAQ coverage of the
  Agentic line.** No GSC export. Guide budget for 6 Aug spent (cycle 48), so a
  refresh — and the fourth surface in the two-product reconciliation that cycles
  49–51 have been working. Counted properly rather than eyeballed: the Agentic
  programme carries **11** FAQs and Cohort 2 carries **9**; the Second Brain
  programme carried **3** and its Cohort 1 page **5**. The missing ones were not
  decoration — they were the practical booking questions a buyer actually blocks
  on (what to bring, whether their material can be confidential, where it is,
  teams, date transfers, how to book), and FAQ answers are the single thing AI
  engines quote most from this site. Programme 3 → 8, event 5 → 9; verified in the
  built FAQPage nodes, and `llms.txt`/`llms-full.txt` pick both up automatically
  because they iterate the same frontmatter.
  **Nothing invented, and the line is worth recording.** The booking, teams and
  date-transfer answers are established organisation policy, already published
  verbatim on the homepage FAQ and the Agentic pages — restating them is
  consistency, not assertion. The confidentiality answer is drawn entirely from
  the exclusions section of the second-brain guide (cycle 48): supplier-email
  test, no credentials, no other people's personal data. **Deliberately left out:
  cohort size (no capacity is stated for this day anywhere, including Luma),
  lunch, recording policy, and the paid-subscription answer.** Those are
  established for the Agentic day only; copying them across would have been
  inventing operational facts about a day nobody has run yet. A first draft of the
  confidentiality answer said the day "covers where that line sits" — cut, because
  the agenda does not say that and curriculum is not the loop's to promise.
  _Standing pattern, now four cycles deep:_ a new product line does not just need
  its own pages, it needs every shared surface re-read as a two-product site. Four
  found so far — homepage FAQ (50), glossary `about` edge (49), About page origin
  story (51), and now FAQ depth parity (52). Next launch: sweep these four first.

- **2026-08-06 — Cycle 51: the About page told a one-product origin story.**
  No GSC export. Continuing the two-product reconciliation from cycle 50 into the
  other surface that answers "what is this company": the About page's origin story
  is entirely the agentic gap ("never chained three AI steps together"), written
  before the second line existed. A new paragraph now gives the honest reason there
  are two days - a workflow is only as good as what it knows about you, so the
  context store is a different problem with its own day, and the two compound.
  **Phrased as an argument, not a claim about attendees.** A first draft said people
  "kept hitting the same wall", which would have been an assertion about real
  attendees' experience with nothing in the vault behind it. Rewritten to state the
  logic instead, which is both true and stronger. Unlike `brand.description` this is
  site copy, so it is the loop's to change; the canonical entity string remains
  Drummond's call (see STATE.md).
  _Checked, no action:_ local `dist/og/` had duplicate "… 2.png" files — a Desktop
  filesystem-sync artefact, not a build fault. Live is clean (dup 404s, real 200s)
  because CI builds from a fresh checkout. Do not chase this again.

- **2026-08-06 — Cycle 50: the most-quoted answer on the site described half the
  business.** No GSC export. The find: the homepage FAQ's "What is Oxford Agentic?"
  answer was `config.brand.description` verbatim — the canonical entity string,
  written when there was one product, still describing the agentic day alone. Since
  the Second Brain launch on 4 Aug that made the single answer engines quote most
  a half-truth.
  **Split the two concerns rather than editing the entity string.** The FAQ answer now
  names both bootcamps and what each produces; `brand.description` is untouched,
  because PRD §13 requires it verbatim off-site (Luma, LinkedIn, socials) and it can
  only move when Drummond moves those. Verified: FAQPage answer updated,
  `Organization.description` unchanged.
  **Raised for Drummond in STATE.md** with a drafted 157-character replacement that
  still fits a meta description, plus the note that `longDescription` needs the same.
  That string is the Organization description on every page, the homepage meta, the
  llms.txt entity line, the footer, About and the RSS channel — worth him doing once,
  properly, everywhere.
  _Also checked, correctly left alone:_ the Second Brain pages do not link to the new
  guide. That is Drummond's 4 Aug decision (guides are an SEO/GEO play, reachable from
  the footer and their own index only), not an oversight — do not "fix" it.

- **2026-08-06 — Cycle 49: the glossary's schema catches up with its own body.**
  Guide budget spent for the day, so a refresh. Measured the programme balance
  properly first — a naive grep said 15/15 because the nav dropdown links both
  programmes on every page; the real signal is `relatedProgrammes`, and that read
  **14 Agentic / 1 Second Brain**. The honest fix available today was not a new
  guide but a mismatch: the glossary has linked to the Second Brain programme in
  its body since cycle 42, while its `about` edge still declared the Agentic
  Bootcamp alone. The article demonstrably covers both, so it now says so —
  `about` emits two Things, verified in the built JSON-LD. Balance 14/2.
  _Method note worth keeping:_ measure internal-link balance from
  `relatedProgrammes`, never from grepping built HTML — site chrome links
  everything from everywhere and drowns the signal.

- **2026-08-06 — Cycle 48: the Second Brain line gets its first supporting guide.**
  Still no GSC export (twenty-somethingth cycle). New day, budget reset, and the
  clearest gap was structural rather than topical: the Second Brain Bootcamp
  launched two days ago with a programme page, an event page and **zero**
  supporting content, while the Agentic line had thirteen guides feeding it.
  "What actually goes in a second brain for AI?" is the question its own event
  page provokes and never answers. Five kinds of context that earn their place
  (voice samples, the written standard, decisions plus their reasons, recurring
  facts, the shape of repeated work), then the exclusions — credentials, other
  people's personal data, anything you would not email a supplier, and
  everything-you-have-ever-written, since a curated supply beats an archive.
  Closes on maintenance, which is the honest reason the day is a day.
  Facts drawn only from the programme and event files; nothing about the day
  invented. 15 guides, 34 pages; `about` edge verified pointing at the Second
  Brain programme; IndexNow pings on deploy. Guide budget for 6 Aug: spent.

- **2026-08-05 — Cycle 47: the independence statement reaches llms.txt.** Follow-through
  on the affiliation FAQ Drummond added an hour earlier: the FAQ reached the homepage
  and its schema, but neither `llms.txt` nor `llms-full.txt` — the two files built
  specifically for AI engines — said a word about it. Now both do, in their entity
  header blocks: llms.txt states it as a fact of the entity in the same wording as
  the FAQ; llms-full.txt carries an `Affiliation:` line beside Location and Contact.
  This is the disambiguation engines most need — the 30 Jul probe showed the market
  actively conflating Oxford AI providers with the university's own programmes.
  Consistent entity statements across page, schema and llms files is the whole
  triangulation game. (Also this cycle, Drummond-directed and shipped separately:
  the hero eyebrow became "An Oxford Experience", and the affiliation FAQ itself.)

- **2026-08-05 — Cycle 46 (Drummond-directed): the Gold brand guide is applied.**
  Imported "Brand Guide Gold.dc.html" from his claude.ai/design project via
  DesignSync. The delta from the shipped system was three things, so that is all
  that changed: **gold** `#F1AF39` → `#D4AF37` (accent, buttons, rules, mark
  centre, focus rings — button hover recomputed to `#C3A133`, ~8% darker per the
  guide); **bronze** `#9A7B23` replaces rust `#AF4C1F` (links, eyebrows, tags —
  hover already brightened to the accent, which is exactly the guide's rule, so
  only values moved); and the **Quad construction** lightened (stroke 16→10,
  outer 84→72, centre 27→24 per 100) in marks.ts — which regenerates favicon,
  logo, apple-touch icon and OG cards — and in Wordmark.astro's mirror copy.
  Type scale, spacing, layout, voice: already conformant, untouched. All 19
  rgba(241,175,57) literals swept to rgba(212,175,55); zero old-colour residuals
  in dist. Variable names --rust/--burnt kept (values now bronze), documented.
  **Revert path: tag `pre-gold-redesign` (pushed). If Drummond types "revert",
  git-revert the redesign commit.** Verified by screenshot at 1440; flags and
  schema green. Mid-task note: a transient model-availability outage blocked all
  write tools for ~10 minutes; work resumed cleanly because the colour sweep was
  already in the working tree and nothing had been pushed half-done.

- **2026-08-05 — Cycle 45: "Scout, drafter, reviewer" gets its own guide.**
  The site's core method was referenced on the homepage FAQ, both event pages, the
  glossary and four guides — and defined in depth nowhere. Now it is: what each step
  does, why three narrow steps beat one clever prompt (visibility of failure,
  independent improvement, trust earned per step), where the human sits, and — per
  the honesty rule that runs through the cluster — where the pattern is the wrong
  shape. 14 guides, 32 pages; start-here category; IndexNow pings the two changed
  URLs on deploy. Guide budget for 5 Aug: spent.

- **2026-08-04 — Cycle 43: the homepage FAQ stopped pretending there is one bootcamp.**
  No GSC data; Luma copy unchanged (tenth check). The find: the homepage FAQ — which
  is also the FAQPage schema engines quote — still answered as a one-product site.
  "What will I actually leave with?" promised an agentic workflow flatly, which is now
  wrong for a Second Brain buyer, and "Who are the bootcamps for?" never distinguished
  the two days. Both answers now name both bootcamps and their different deliverables,
  keeping the shared audience sentence. This is exactly the drift the shared
  `home.ts` FAQ was built to prevent within one page — but nothing guards it against
  product-line changes; noted for future launches: **new programme → check the
  homepage FAQ in the same cycle** (missed in cycle 39 by three cycles).
  Verified in built JSON-LD; refresh not a new guide; IndexNow pings home +
  /home-photos/ on deploy.

- **2026-08-04 — Cycle 42 (first under the new prompt): the glossary learns what a
  second brain is.** No Search Console data (step 1 of the new prompt), so the
  highest-value unblocked item: the glossary predated the Second Brain launch and
  never defined the new product's central term. A "Second brain" entry now sits
  directly after "Context", framed as the fix for context being the bottleneck, with
  the guide's one new internal link pointing at the programme page. This is the first
  *refresh* under the refreshes-unlimited rule — an update to a proven page rather
  than a new page, `updatedDate` bumped so sitemap `lastmod` reflects it, and the
  IndexNow pipeline shipped in cycle 41 will ping the changed URL on deploy
  automatically. Guide-per-day budget untouched (this is not a new guide).
  _Off-page flags, restated per the new prompt rather than skipped:_ Eventbrite
  listing (both events, packs ready in `outreach/`), LinkedIn Company Page (would
  also give Organization.sameAs its first identity), Bing Webmaster, GSC export or
  API credentials. All Drummond's; all standing.

- **2026-08-04 — Cycle 41: IndexNow on every deploy.** Drummond asked how to make the
  loop's SEO/GEO work more rapid; this was the one immediate, unblocked answer (the
  others - GSC API access, Eventbrite, the LinkedIn page - are his). Every push now
  pings `api.indexnow.org` with the URLs the change actually affected, so Bing-family
  engines (which feed ChatGPT's web answers) re-crawl in minutes rather than on their
  own schedule. Mechanics: a key file at the site root proves ownership;
  `scripts/indexnow-ping.mjs` maps changed files to URLs (guide → its page + the
  index; event → its page, the index and home; template/config → the whole live
  sitemap, fetched over HTTP so CI never rebuilds); docs-only pushes submit nothing.
  A new `indexnow` job in deploy.yml runs after publish with `continue-on-error` at
  both levels - an indexing hint must never redden a deploy, the same principle that
  keeps external link checks out of CI. Mapping verified with a stubbed fetch:
  content changes → correct URL set, docs-only → no submission. Google note: Google
  does not consume IndexNow; its path stays sitemap + lastmod, unchanged.
  _Also this wake:_ ninth Luma check on the Second Brain page - copy still unchanged.

- **2026-08-04 — Cycle 39 (Drummond-directed): the Second Brain Bootcamp joins the
  site, Nicolai replaces Josh, and guides leave the programme page.**
  Three instructions, shipped as three commits.
  (a) **The Oxford Second Brain Bootcamp** — new programme + Cohort 1 event page. All
  facts from Drummond's own live Luma page (`luma.com/7vcqji8g`, `evt-uIVsPanZjsQkHn1`):
  Wed 21 Oct 2026, 09:00–17:00, Pitt Rivers Museum, South Parks Road. The booking
  embed, schema (third Event node), homepage card, nav dropdown, sitemap and llms.txt
  all picked it up from the two content files with zero template changes — the
  config-driven architecture doing what it was built for. Copy re-checked ~20 min
  after the first fetch per Drummond's instruction; unchanged, so shipped. Re-check
  on the next wake in case his edit lands later. Rust accent to distinguish the
  programme line. No price published (rule), capacity omitted (not stated on Luma).
  Facilitator names beyond the team page NOT added — Glenn Smith and Adrian Shedden
  are named publicly on Luma but have no vault-established bios; flag raised rather
  than thin profiles invented.
  (b) **Team**: Josh Lawman removed (his instruction; no dangling references — checked
  before deletion), Nicolai Thomson added at the same order slot, bio from vault facts
  only. Spelling follows the vault's repeated "Nicolai" over the message's "Nicholai".
  (c) **Programme pages**: the "Further reading" guides band removed. Decision
  recorded in STATE.md: guides are an SEO/GEO play — footer, own index and
  cross-links only. Guides keep linking TO programmes, so the crawl edge survives.
  31 pages, 3 Event nodes, flags matrix green, Lighthouse budgets enforced in CI.

- **2026-08-04 — Cycle 38: "How to choose the task you bring" (guides re-opened by
  Drummond).** His instruction — "add more guides for example" — overrides the
  wait-for-signal gate from cycle 25, so backlog 9 is reworded and the cluster
  continues under the same quality bar. This topic was chosen first because it is the
  rare guide that serves both sides of the funnel: a buyer weighing the day gets a
  concrete picture of what "bring one real task" means, and a booked attendee gets
  better pre-work — which is also what the Cohort 1 retro asked for (more guided
  building, a shared worksheet). Five tests, each grounded in the format's real
  mechanics (frequency, text-based, checkable at a glance, annoying enough to care,
  affordable to get wrong), closing on the recurring-assembly-job shape and the
  event's actual deliverables. No facts invented; the "review step" and "written
  recipe" claims come straight from the event file. 13 guides, 29 pages, propagated
  into llms.txt, RSS, sitemap and the grouped index (in-practice). Budget for 4 Aug
  spent; next candidates queued in backlog 9.

- **2026-08-04 — Cycle 37: loop restarted; the vault moved while the site stood still.**
  No Search Console export (twentieth cycle). Four days of vault changes (3 Aug) were
  newer than everything on the site, so the cycle went to reconciling them:
  - **Venue** — now "decided, not secured" in Drummond's own words to Conference
    Oxford; Worcester beat a five-venue shortlist but still has no contract. STATE.md's
    30 Jul warning rewritten with the newer evidence: risk narrowed from "address might
    move" to "booking not signed". Flag still untouched, still Drummond's call.
  - **Speakers** — Nicolai Thomson (Jenesys AI) confirmed warm for the technical slot
    Josh Lawman vacated. NOT added to the site: he is owed his promised assets and a
    speaker announcement is coordinated with the speaker, not sprung on him. Recorded
    in STATE.md as the strongest unpulled bookings lever, with the exact wiring steps
    for when Drummond says go. Josh's team-page status flagged for Drummond to confirm.
  - **College-logo constraint** (an unaffiliated event may not use University or
    college logos) — audited the site: no crest assets, no affiliation claims; one
    grey area flagged (the St Anne's tablecloth photo, documentary rather than a logo
    asset). Clean, recorded so the check is not re-run.
  Documentation-only cycle by design: every new fact concerns real people, a legal
  constraint or an unsigned booking — exactly the three categories the guardrails
  reserve for Drummond.

- **2026-07-31 — Cycle 36: second dry cycle. Loop paused, as planned.**
  No Search Console export (nineteenth cycle); venue flag still `confirmed: true`; no
  LinkedIn Company Page. Site healthy, CI green.
  Tested the last untested confident comment — Header.astro's "Opens on hover and on
  keyboard focus, **so it is reachable by tab alone**". **The claim holds**: with the
  Bootcamps link focused, the submenu renders and "The Oxford Agentic Bootcamp" is
  visible and reachable. Verified by screenshot.
  **Worth recording, because it nearly went the other way.** `getComputedStyle` in the
  browser pane reported `visibility: hidden`, `opacity: 0` and a child that could not
  take focus — while `:focus-within` matched. Read literally that is a hard WCAG
  failure, and it was tempting to file. It is instead the exact stale-computed-styles
  quirk logged in **cycle 16**, which says in as many words: do not trust
  `getComputedStyle` here for state changes on pre-existing elements; verify visually
  or in the built CSS. Both of those confirmed the menu opens correctly. A note written
  eleven days ago stopped this loop shipping a fictional bug report — which is the
  entire argument for keeping this ledger honest about tooling as well as code.
  **Paused here.** Last cycle set the rule: if this one was also dry, stop rather than
  stretch further. It was. The audit vein is genuinely worked out — 2 defects in the
  first 3 attempts, 0 in the last 4 — and everything of real value now sits with
  Drummond: the Search Console export, the Worcester venue decision, and backlog 2b.
  Restart with `/loop` the moment any of those lands; the first has the most upside,
  because it is the only one that turns this loop signal-driven for the first time.

- **2026-07-31 — Cycle 35: nothing found. Slowing down, as instructed.**
  No Search Console export (eighteenth cycle). Cycles 33 and 34 both found defects by
  testing confident comments, so this cycle tested three more. All three held:
  - **Breadcrumbs** — "the markup and the JSON-LD can never disagree". Compared the
    visible trail against the `BreadcrumbList` node on all 24 pages that carry one.
    Zero disagreements, including the guides and team subtrees.
  - **The FAQ's exclusive accordion** — `<details name="faq">` makes one group where
    opening an item closes the rest, which would break if a page rendered two FAQ
    groups. No page does: five pages carry FAQs, one group and one open item each.
  - **Reduced motion** — the site has accumulated a lot of animation over 35 cycles
    (reveals, stat counters, reading progress, drifting motif, hover transforms, photo
    push-in). A blanket `*, *::before, *::after` rule neutralises animation and
    transition duration, plus targeted rules for the progress bar and reveals. It
    ships in the built CSS. Coverage is complete without per-component guards.
  **No change shipped, deliberately.** The standing instruction is to log a dry cycle
  and slow down rather than manufacture work, and that is the honest read: the site is
  in good shape and everything genuinely valuable left is blocked on Drummond — the
  Search Console export, the venue decision, and off-page listings (backlog 2b).
  Cadence moved to the maximum the loop allows. **The vein of "test a confident
  comment" is not exhausted, but it is thinning: 2 defects in the last 3 attempts, now
  0 in 3.** If the next cycle is also dry, the useful move is to stop rather than
  stretch further — a loop with nothing to do is better paused than idling.

- **2026-07-31 — Cycle 34: the primary CTA's font was never preloaded.**
  No Search Console export (seventeenth cycle). Same technique as cycle 33's win —
  check a surface the build does not — turned inward to assets.
  **Clean, recorded so they are not re-run:** every local asset referenced from HTML
  exists in `dist/` (15 distinct), and every `url()` in the built CSS resolves (7 refs,
  7 font files shipped). No missing favicon, icon or font.
  **The find.** Only three faces were preloaded, and the comment said so proudly — but
  the set was wrong. `plex-mono-600` (eyebrows) was preloaded while **`plex-mono-700`
  was not**, and 700 is what the header nav and *every* `.btn` use, including "Book the
  next cohort" and the "Next Bootcamp" header button. So the most prominent
  above-the-fold interactive text on every page rendered in fallback monospace and
  swapped once the real face arrived. Invisible to Lighthouse, which scores the paint
  it gets rather than the one the reader wanted, and invisible to every check in CI.
  Fixed by preloading it too — 15KB, and the comment now lists all four faces with
  what each one paints, so the next person adding a weight can see whether it belongs.
  Verified after: performance still 100 on all three audited URLs, CLS 0, LCP
  323–368ms. (Not claiming the change improved LCP — that is a different measurement
  session from the earlier 0.5s reading. The point is it cost nothing.)
  _Generalisable lesson:_ two cycles running, the defects have been in things nothing
  validates — an external link, a preload set. Both were also **documented as correct**
  in a comment right above the bug. A confident comment is where to look, not where to
  stop looking.

- **2026-07-31 — Cycle 33: the footer's Luma link had been 404 on every page.**
  No Search Console export (sixteenth cycle). Audited three things the build never
  checks. Two were clean and are recorded so they are not re-run: **crawl depth** —
  every indexable page sits within two clicks of the homepage, nothing at depth 3+,
  and the only unreachable page is `/home-photos/`, which is deliberately unlinked and
  noindexed; and **heading hierarchy** — zero issues across 25 pages, exactly one `h1`
  each and no skipped levels, including the `h3`/`h4` structure cycle 26 introduced on
  the guides index.
  The third found a real defect. **`https://luma.com/oxfordagentic` returns 404** —
  confirmed with a browser user-agent and no redirects, against a 200 control on
  `luma.com/oxfordagentic2`. It was rendering in the footer of every page, and after
  cycle 31 removed the personal LinkedIn from `sameAs` it had become **the sole
  identity the Organization claimed**. A broken `sameAs` is worse than none: it is a
  positive assertion pointing nowhere.
  Removed rather than repointed. The working Cohort 2 URL identifies an *event*, not
  the organisation, and would go stale in September; `sameAs` has to be persistent.
  The schema code already omits the key when the list is empty, so the graph degrades
  cleanly, the `founder` edge still connects Organization to Person, and the footer
  falls back to LinkedIn plus email. Both rules are now documented in `site.config.ts`
  at the point of change.
  **Consequence, and it sharpens backlog 2b considerably: the Organization now claims
  no third-party identity at all.** A LinkedIn Company Page would be its first.
  **Process note:** `check-links` validates internal links only, which is why a dead
  external link survived sixteen cycles. Deliberately NOT adding external checking to
  CI — a third-party outage should never turn this build red. Instead: **spot-check
  outbound links each month alongside the GEO re-probe.** There are only four.

- **2026-07-30 — Cycle 32: ten pages had titles Google would cut off.**
  No Search Console export (fifteenth cycle), so backlog-driven — but this is the
  closest thing to GSC work that can be done without it, because title truncation is a
  direct CTR problem and it is measurable from `dist/` alone.
  **The find.** 10 of 25 indexable pages carried `<title>` over ~60 characters. Worst
  was the public-sector guide at 94: Google shows roughly the first 60, so it rendered
  as "Agentic AI for public-sector and NHS leaders: start where gov…" and the brand
  name never appeared at all. Eight were guides whose headlines are deliberately long
  because they are good headlines.
  **The fix separates the two jobs.** Guides gain an optional `seoTitle` (max 43, since
  the " - Oxford Agentic" suffix is 17), used only for `<title>`. The `h1` still renders
  the full headline, so the page reads exactly as written and only the search snippet
  is trimmed. Eight short titles added, each front-loading the query-shaped phrase:
  "Agentic AI for consultants", "How to run an AI pilot that survives", and so on.
  All eight now fit; h1s verified unchanged.
  **Left alone deliberately:** the two event pages (67 and 72 chars). Their dated
  pattern is PRD §12 and the identifying words — "The Oxford Agentic Bootcamp - Cohort
  2" — are the first 38 characters, so what gets cut is the tail, not the meaning.
  Front-loading matters more than total length, and re-litigating a settled pattern to
  win a character count is not an improvement.
  **Also noted, not changed:** the homepage description is 166 chars, six over the
  truncation point. It is `brand.description`, the canonical entity string the PRD
  requires be reused verbatim on Luma, LinkedIn and in schema. Trimming it here would
  desynchronise it from every off-site copy for six characters of snippet. Not worth it.
  _Trade-off accepted:_ `og:title` now uses the short form too, while the OG *image*
  still renders the full headline. Social previews do not truncate at 60, so the full
  title would arguably be better there — but plumbing a second title through for that
  is complexity out of proportion to the gain.

- **2026-07-30 — Cycle 31: the Organization was claiming to be a person.**
  No Search Console export in `seo-data/` (fourteenth cycle without one), so
  backlog-driven. Went looking at the entity graph itself, since triangulation is the
  mechanism the whole schema layer exists to serve, and found it contradicting itself.
  `Organization.sameAs` included `linkedin.com/in/drummondgilbert/` — a **personal**
  profile — asserted as an alternate identity of Oxford Agentic. The same URL is also
  the Person node's `sameAs` on the team page, which is where it correctly belongs. So
  the graph told engines that the organisation and the person are the same entity,
  precisely inverting cycle 20's `founder` edge and the entity separation the schema is
  built on. Silent, valid, and exactly the sort of thing that quietly degrades AI
  citation without ever failing a validator.
  Fixed in `organizationSchema()` with a filter on `linkedin.com/in/`, documented at
  both ends: company pages (`/company/…`) pass through untouched, so dropping a real
  Company Page URL into `brand.social` flows into schema with no further work. The
  footer link is unchanged — a human reads "LinkedIn" under Elsewhere correctly.
  Result: `Organization.sameAs` is now `[luma.com/oxfordagentic]`, `Person.sameAs` is
  the personal profile, and the `founder` edge connects them. Flags matrix green.
  _Standing note:_ this is the strongest remaining argument for backlog 2b. A real
  LinkedIn Company Page would give the Organization its first genuine third-party
  identity, and the code is now waiting for it.

- **2026-07-30 — Cycle 30: the site is publishing a venue as confirmed that the vault
  calls a hold.** Went looking for comparison points a buyer would weigh against the
  competitors cycle 28 surfaced, and found something more important on the way.
  **The find.** `venue.confirmed: true` on Cohort 2, so the page states the Worcester
  address flat. `Digital Brain/CLAUDE.md` (27–28 Jul, newer than the site value) says
  the Nash Suite is provisionally held with **no contract, deposit or cancellation
  terms and no stated expiry**, with a venue meeting diarised for Fri 31 Jul. The
  `confirmed` flag exists for exactly this case and renders "Room booking being
  finalised" when false.
  **Deliberately not fixed.** Venue facts are a hard guardrail — "never change a
  confirmed fact unless told to" — and Drummond may have contracted it since the vault
  was written. Raised at the top of `STATE.md` as a decision, with both branches
  spelled out. A loop that quietly edited a venue on the strength of a three-day-old
  note would be exactly the kind of autonomy this ledger exists to prevent.
  **Also found, and deliberately not used:** 16 completion certificates were issued
  after Cohort 1 (one per confirmed attendee; corroborated in the vault). It is a real
  fact and a real comparison point, since Saïd sells partly on a University of Oxford
  certificate. It is still the wrong thing to lead on: it invites comparison on the one
  axis where a university programme wins outright, and it dilutes the actual
  differentiator, which is that you leave with something running. Recorded so a future
  cycle does not "discover" it and reach for it.
  No site changes this cycle beyond documentation, which is the correct outcome when
  the finding is a decision rather than a defect.

- **2026-07-30 — Cycle 29: four audits found nothing, so the cycle went to unblocking
  the one thing that matters.** Checked and clean, recorded so nobody re-checks:
  (a) **no-JS rendering** — homepage and event page both render fully with JavaScript
  disabled. The FAQ is `<details>/<summary>`, reveals are gated behind a `.js-motion`
  class that JS adds, and the Luma iframe plus its "Register on Luma" fallback link
  both work. Progressive enhancement is real here, not aspirational.
  (b) **OG cards at the longest title** — the 86-character public-sector title wraps to
  two lines inside the card with room to spare. No overflow.
  (c) **Attendee travel evidence** — searched the vault for any record of Cohort 1
  attendees travelling from outside Oxford, to support an honest non-geographic angle
  after the GEO probe. **There is none, so nothing was written.** Recording the absence
  so a future cycle does not re-derive the idea and be tempted to assume it.
  With no bugs to fix, the cycle produced **`outreach/off-page-listings.md`** instead:
  a paste-ready listing pack for Eventbrite, LinkedIn and aggregators, since cycle 28
  established that off-page citations are the binding constraint and the only thing
  stopping it is Drummond having to write the copy. Facts drawn only from the Cohort 2
  content file; the price is left as a marked `[NEEDS: …]`. It lives outside `src/` so
  it is version-controlled but never built into the site (verified absent from `dist/`).
  _Caught in review:_ the first draft used em dashes in the very blocks intended for
  pasting, immediately under a section telling Drummond not to. Fixed.

- **2026-07-30 — Cycle 28: GEO re-probe. The on-page ceiling has been reached.**
  The first genuinely new signal since the loop began, and it changes the priorities.
  Full detail under "GEO re-probe — 30 Jul" above; the short version is that the site
  now ranks **#2** for Oxford-anchored queries (up from uncited on 25 Jul, quoting its
  own capsule and FAQ back) and is **absent from the national buyer question**, where
  an engine named twelve competitors and handed "spend the day on your own real task"
  to JBI Training. Every citation in that answer was an aggregator or an off-site
  provider page. On-page work did what it could; the remaining lever is off-page and
  it is Drummond's — new **backlog 2b**, now the highest-leverage item on the list.
  Two things changed on the site as a result. **STATE.md's competitive framing was
  corrected**: Saïd now runs an Oxford Generative and Agentic AI Programme that
  includes building an agent, so "they are strategic, not hands-on" is no longer true
  and must not be implied. And the comparison guide was **sharpened where that framing
  leaked into copy** — it now grants that executive programmes may include a build
  exercise and relocates the distinction to where it actually holds: a guided build on
  a sample case is not your own task running on Monday. Being generous about the
  alternative makes the real difference land harder, and it is now also the accurate
  thing to say. `updatedDate` bumped.
  _Rejected this cycle:_ adding "UK" phrasing or a non-Oxford landing page to chase the
  national query. That is the doorway-page rule in a new costume; the answer is
  off-page citations, not another page.

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

## GEO re-probe — 30 Jul 2026 (cycle 28). The first real signal the loop has ever had.

Same engine (Perplexity) as the 25 Jul baseline. Two queries, two opposite answers, and
the gap between them is the finding.

**1. "hands-on AI training Oxford for business leaders" — WE NOW RANK #2.**
Up from not cited at all on 25 Jul. The engine pulled the capsule, the FAQ, the venue
answer and "three build cycles, not three lectures" — the site's own words, verbatim.
Five weeks of entity consistency, schema depth and 12 guides did the job they were
meant to do. Elansio no longer appears in the top 8 for this phrasing.

**2. The actual buyer question — WE ARE INVISIBLE.**
Asked as a founder would ask it ("UK, one-day, in-person, build a working agent on my
own real task, name providers"), the engine named twelve providers and **not one of
them was Oxford Agentic**: Columbus/Microsoft Agent in a Day, BrainStation, ODSC,
DataStax, JBI Training, TESS, Edinburgh, Cambridge. Worse, it concluded that the
strongest fit for "spend the entire day on your own real task" is **JBI Training** —
which is Oxford Agentic's exact positioning, awarded to someone else.

**Why.** The word "Oxford" is doing all the retrieval work. Every citation in the
national answer came from an aggregator or a provider with off-site presence
(Eventbrite ×3, vendor event pages, university pages). The 25 Jul baseline predicted
exactly this — "third-party aggregators carry the citations, so off-page mentions are
the real lever" — and this probe is the proof. **On-page work has now taken the site
about as far as on-page work can.** The remaining lever is off-page and it is
Drummond's: an Eventbrite listing, AI-event aggregators, a LinkedIn Company Page,
directory entries. No amount of further schema will substitute.

**Competitive correction — STATE.md was out of date.** Saïd Business School has
launched an **Oxford Generative and Agentic AI Programme**: £1,500, online, four weeks,
next start **16 September 2026 — the same day as Cohort 2**. It explicitly includes
"build a simple agent on an existing platform" and a governance checklist. The old
framing ("Saïd is strategic, online, not hands-on; that gap is ours") is no longer
safe: they now claim hands-on agent building too. The honest remaining distinction is
in-person, your own real task rather than a platform exercise, and a room of peers —
not "they don't do hands-on". Do not let site copy imply otherwise.
Also new locally: **The Oxford AI School** (Witney), publishing prices from £149.

_Re-probe again ~30 Aug, or sooner if Drummond lands an off-page listing._

## Signal snapshot

_(latest numbers — filled once data sources are connected)_
- **Search Console (checked 2026-08-06, cycle 52): still no export.** `seo-data/`
  holds only its README. The property has been verified since 23 Jul and
  Performance data should exist by now — this is no longer "too new", it is simply
  unexported. **Drummond: Performance → last 28 days → Export → CSV → drop
  `Queries.csv` and `Pages.csv` into `seo-data/`** (git-ignored). Roughly two dozen
  cycles have now run blind; it remains the single biggest constraint on this
  loop's usefulness, and every cycle spent on inference is a cycle that could have
  been spent closing a measured gap.
- Site size (2026-08-06, after cycle 52): 34 pages, 15 guides, 1,321 internal
  links, 6 FAQPage nodes, 3 Event nodes. FAQ depth by line: Agentic 11 (programme)
  / 9 (Cohort 2); Second Brain 8 (programme) / 9 (Cohort 1).
- Guide balance by `relatedProgrammes` (the only honest measure — never grep built
  HTML, site chrome links everything from everywhere): 14 Agentic / 2 Second Brain.
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
