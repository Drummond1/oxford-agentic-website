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
6. **Ship** — commit with a clear message and `git push origin main`. **One push per
   cycle** (content + ledger in one commit, or wait for the first deploy to finish
   before the second). Two pushes a minute apart overlap two Pages deployments and
   can wedge the Pages lock — see the deploy incident under cycle 52 for the symptom
   and the one-line fix.
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
   **Downgraded 10 Aug (cycle 57 re-probe) — still valuable, no longer "binding".**
   The 30 Jul conclusion rested on the site being absent from the national buyer
   question. It is no longer absent: it is **#1** there, and #1, #2, #3 and #5 on the
   Oxford-anchored query, with still zero off-page listings. So off-page was not the
   thing holding organic visibility back, and the ceiling the 30 Jul probe described
   was not a ceiling. Keep the listings on the list - a third-party `sameAs` is still
   the one thing the Organization node lacks, and aggregator citations still matter
   for engines that lean on them - but stop treating them as the precondition for
   everything else. Caveat on the new numbers: one engine, search results rather than
   cited AI answers, and IndexNow has been pinging hard since cycle 53, so some of
   the lift may be freshness. Re-probe on a different engine before relying on it.
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
   **The Second Brain line now has two supporting guides; the Agentic line has 13.
   Keep weighting new guides toward Second Brain until that is less lopsided.**
   (Budget for 10 Aug is SPENT - the vs-note-taking guide, cycle 54.)
   Each must answer a real question, stand alone, and link to the programme once.
   HARD RULE — no doorway pages: never create location variants ("AI bootcamp London",
   "AI training Cambridge") or thin near-duplicates; Google penalises them and they
   cheapen the brand. Query-shaped and genuinely useful, or not at all.
   **HARD RULE, added 12 Aug — probe the query BEFORE writing the guide.** Cycles
   59-63 established this the expensive way, by finding published guides absent from
   their own target queries. Run one search and answer two questions:
   (a) **Is it winnable?** If the results are institutional publishers on their own
       subject - NHS England and trust policies on "what AI am I allowed to use",
       gov.uk, Microsoft, AWS - the answer is no, and it should be no. Reframe onto
       the question they never answer (what to *build*, not what is *permitted*),
       or leave it.
   (b) **Does the searcher convert?** This is the one that catches good-looking
       topics. "AI bootcamp vs course" is winnable but the intent is career-changers
       wanting to become ML engineers. "Why does AI still sound generic" is winnable
       but the intent is content marketers wanting better copy. Neither is a senior
       leader who has hit the ceiling of prompting, so traffic from either is
       vanity. **Winnable AND converting, or do not write it.**
   Both tests failed on 12 Aug, which is why no guide shipped that day. A cycle that
   correctly declines to publish is a good cycle; guide count is not the metric.
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
16. `blocked` (Drummond, one word) — **Josh Lawman is half-removed.** The 4 Aug
    instruction was "remove Josh from the team slide"; he is gone from the homepage,
    but `/team/josh-lawman/` is still live, indexed and in the sitemap, and
    `/team/` still lists him. His bio reads in the present tense ("teaches the parts
    of the day that go furthest"), so if he has left the team the live site is
    currently inaccurate about a named real person. Flagged 10 Aug and deliberately
    not actioned: deleting a person's page is his call, not the loop's, and the
    literal instruction was satisfied. If confirmed: delete
    `src/content/team/josh-lawman.md` and add a redirect for the old URL.
18. `blocked` (Drummond, one fact) — **do attendees get a certificate?** Nothing on
    the site says, and the comparison set leads with it: Saïd issues an official
    University of Oxford Certificate of Completion, the Queen Mary Eventbrite day
    issues a university certificate, tutorials.co.uk says "Certificate included".
    A senior buyer expensing a day will ask. The affiliation FAQ says the name
    "promises the city and the standard of the day rather than a university
    credential", which implies no *university* credential but does not say whether
    any certificate exists at all. The loop will not guess either way - "no
    certificate" and "yes, ours" are both assertions of fact it has no source for.
    One sentence from Drummond closes it, and it belongs in the homepage FAQ.
19. `blocked` (Drummond, one URL) — **Nicolai Thomson has no links**, so his profile
    is the only one on the site with no `Person.sameAs` at all. The other four now
    each corroborate to a real external profile: LinkedIn for Drummond and Jonathan,
    novaria.ai for Emine, adder.dev for Josh. Entity triangulation is the weakest
    part of this site's GEO position (the Organization node still has no `sameAs`
    whatsoever, backlog 2b), so an unlinked person is a missed signal rather than a
    cosmetic gap. A LinkedIn URL or a company site closes it. The loop will not
    search for one and guess: attaching the wrong profile to a named real person is
    a worse error than leaving it blank.
17. `todo` (wants GSC data first) — **`brand.tagline` describes half the business.**
    `'Practical agentic AI training in Oxford'` is the homepage `<title>`, the footer
    line and two OG cards, and the Second Brain day is not agentic AI training. Same
    fault as the blocked `brand.description`, but a different call: the tagline is
    not reused off-site, so the loop *could* change it. It is deliberately not doing
    so, because it is the strongest keyword string on the highest-ranking page and
    the 30 Jul probe had the site at #2 for Oxford-anchored queries. Rewrite it once
    Search Console shows what the homepage actually ranks and converts for - not
    before. If a rewrite happens, the OG cards and footer follow automatically.

## Shipped

_(dated, newest first — filled by the loop)_

- **2026-08-24 — Cycle 83: /testimonials/ is not missing an ItemList, and Cohort 2 is
  not listed anywhere.** No GSC export. Twenty-three days to Cohort 2.
  **Corrects last cycle.** Cycle 82 called `/testimonials/` "the one listing page still
  without an ItemList", implying an oversight to fix later. It is not one. Testimonials
  have no pages of their own - the route builds a single index and nothing else - so an
  ItemList there would be a list of items with no URLs, which is degenerate schema
  rather than a missing feature. The right shape for that page is the one it has.
  Checked before concluding: the route emits exactly one HTML file, 340 words, and no
  per-quote pages exist to link to. Also confirms the other session was right not to
  build them - a page per quote would have been four thin pages.
  Discoverability of that page is fine and was worth confirming rather than assuming:
  footer-linked from every page, in the sitemap and in `llms.txt`.
  **The off-page position, which the loop is meant to track and which has not moved.**
  Searching for the Cohort 2 event by name, date and venue returns **no third-party
  listing at all** - not Eventbrite, not an aggregator. Only Luma, which is a booking
  page rather than a discovery surface, and the site itself.
  **One concrete target came out of that search**, and it is better than "list it on
  aggregators": research.com returned twice, once for "Best Oxford AI Courses for
  Agentic AI". That is a page ranking for the exact comparison a buyer makes, listing
  Oxford AI courses, with this one absent. Added to `outreach/off-page-listings.md` as
  target 3, with the honest caveat that whether they accept submissions is unknown and
  worth ten minutes finding out.
  Nothing shipped to the site. A cycle that correctly declines to add schema is the
  same call as one that declines to publish a guide.

- **2026-08-24 — Cycle 81: two guides were published with the wrong date, and both
  were mine.** No GSC export. Cohort 2 is twenty-three days out.
  Established the date from three independent sources - the machine, the GitHub API
  and a live HTTP `Date` header - after last cycle mistook elapsed time for a clock
  discrepancy between this environment and GitHub's runners. There is no discrepancy.
  Five days had simply passed between cycles, which is what a long-running loop looks
  like from inside, and the correction is recorded here because the wrong version was
  told to Drummond.
  The consequence was real. `publishDate` had been set from an assumed date rather
  than a checked one, so **`how-to-notice-when-an-ai-workflow-is-wrong` was backdated
  a day and `keeping-a-second-brain-from-going-stale` by five**. Both corrected to the
  day they were actually added.
  **Sixteen of the eighteen guides were right**, every one of them written before this
  habit crept in, which is what makes it a regression rather than a standing flaw.
  `datePublished` is a real signal and a fabricated one is a small lie in structured
  data, so the rule is now explicit: **derive the date, never assume it.**
  Swept the rest of the content for the two date errors that actually harm - anything
  dated in the future, which search engines can suppress, and any `updatedDate`
  earlier than its `publishDate`. Zero of each across every collection.
  Deliberately no new validator. The harmful cases are absent, a future-date check
  would fail a build that runs before the publish hour on the day itself, and the fix
  for the case that did happen is to check a date rather than to add a rule.

- **2026-08-18 — Cycle 83 (session): quotes got a hierarchy, a component and a
  face.** Four equal cards in a 2×2 read as a list, and nothing in a list leads.
  All four also sat below the fold of the decision, so someone hovering over the
  booking form had no human voice anywhere near them.
  **`featured` finally does something.** It has been in the content schema since
  the start and was never read by any component. It now means "this is the lead
  pull-quote": that one is promoted out of the grid and set directly beneath the
  booking form, and the rest run three-across lower down. `find`, with a fallback
  to the most recent, so an editing slip cannot leave a page with no lead.
  **Zeynep Hizir holds it**, on two grounds: her line restates the page's own
  promise back in a customer's words, and hers is the safest consent of the four
  (she wrote and published it herself). Kirsten Samuel is the understudy if it is
  ever withdrawn — shorter, and from a CEO.
  **New `src/components/Quote.astro`, shared with `/testimonials/`**, so a quote
  looks like itself wherever it appears. Two variants: `lead` (title face, a
  6rem gold quotation mark at 0.22 opacity set behind the first line) and `card`
  (flex column, so attributions sit on a common baseline however long the quote
  above them runs). Quote styling was deleted from both pages.
  **Monograms.** Two initials in a gold-hairline square beside every attribution.
  The site has no attendee photography it can publish and the consent bar for a
  face is far higher than for a sentence, but four quotes as plain text read as a
  wall rather than as four people. The square is the site's existing mark, not a
  new shape. Honorifics are stripped, so "Dr Zeynep Hizir" gives ZH and not DZ —
  verified in the browser.
  **Fei Gan's quote trimmed to its first sentence.** The teacher-to-student-ratio
  half is true and good, but it made her card three times the height of the two
  beside it and the imbalance was the first thing the eye landed on. Cards now
  measure 333px each. The sentence that survives names the doubt and the outcome
  in one breath, which is the objection that stops this booking.
  **⚠️ Shrestha Mullick's quote is now the one weak link on the page.** Drummond
  supplied new wording on 18 Aug ("It was a really good session… Looking forward
  to the next one"). The second half is verbatim from her 23 Jul email; **the
  first half is not in that email, not in the Gmail thread and not in WhatsApp via
  Beeper.** He was in the room and has the relationship, so it is presumably
  something she said in person — but it is the only quote on the site whose exact
  words cannot be traced to a document, and its file says so. Replacing it with
  the testimonial she agreed on 30 Jul to write closes the note.
  One placement note: `.register__quote` has a `padding-block-start` sized to
  clear the lead quote's oversized quotation mark, which would otherwise cross the
  rule above it and read as a collision. Re-check it if the mark changes.
  Build passes: 38 pages, 1,619 internal links resolve, schema valid. Mobile
  checked at 375px — cards stack, nothing overflows.

- **2026-08-18 — Cycle 82 (session): three more Cohort 1 quotes, every CTA pointed
  straight at Luma, and another cull.** Drummond's brief: add Kirsten, Shre and
  Zeynep using the best parts; make the Register button a direct Luma link with
  the highest-converting copy; keep culling anything that does not earn its place.
  **Every quote was read from its source, and the vault was wrong about one.**
  `memory/decisions/events.md` carried Kirsten Samuel's line truncated at *"…
  attended to date"*. The sent thread has *"Best, most practical AI session I have
  attended to date - highly recommend it!"* — the missing half is the half that
  sells. The vault also carried Shrestha Mullick's with an ellipsis in every copy.
  The workspace rule against quoting from a truncated extract paid for itself
  twice in one cycle; do not skip it because a quote "looks complete".
  **Provenance, because it decides how safe each one is.** Zeynep Hizir wrote hers
  and published it on her own LinkedIn ~2 Aug, unprompted, after Drummond asked
  carefully. Drummond then republished Zeynep's and Kirsten's, with these exact
  attributions, in the 13–14 Aug email campaign — so those two were already public
  in his own words before they reached the site. Fei's and Shre's were private
  emails to him and are the two still owed a conversation. All four are recorded
  in the files themselves.
  **Zeynep's LinkedIn post text is still uncaptured** — the campaign email is the
  only place these two sentences exist in the repo or the vault. If anyone finds
  the post, check it: a longer original probably exists and is probably better.
  **⚠️ A near-miss worth recording: the first drafts of these files carried
  attendee purchase history — what each person paid, which discount code, what
  they have bought since — into a PUBLIC repo.** It was caught before it was
  written. Commercial detail about a named attendee belongs in the vault. Each
  testimonial file now carries a note saying so.
  **Every primary CTA now goes to `lumaUrlWithUtm(...)` rather than `#register`.**
  Hero, closing gold band and sticky mobile bar. The old labels described a scroll
  rather than an outcome, and the closing one — "Register ↑" — sent people
  *backwards* up the page. Copy is "Book your place" ("Book" on the narrow sticky
  bar): it names what the visitor is doing, implies a held place rather than a
  form, and stops sharing a verb with the newsletter sign-up. **The UTM helper is
  used deliberately and must stay** — these clicks keep landing on
  `utm_source=oxfordagentic`, the source already credited with a registration, and
  an untagged outbound link would silently destroy the only working attribution
  this project has. `luma_outbound_click` fires on all three. The embed stays put
  for anyone who scrolls to it, so there are two routes to one checkout.
  **Culled:** the hero's "Add to calendar" button, its hand-rolled `.ics` data:
  URI and its click-feedback script — diarising an event you have not booked is
  not a step towards booking it, and Luma sends an invite on booking anyway. Also
  the date line under each quote: "Cohort 1, 14 August 2026" sat under a band
  headed "Cohort 1 ran on 21 July 2026" and read as a contradiction rather than as
  the date it was written. `date` is still required and still orders the list.
  Build passes: 38 pages, 1,619 internal links resolve, schema valid, one
  pre-existing non-blocking warning (`/` meta description 166 chars).

- **2026-08-17 — Cycle 81 (session, not the loop): put the booking form second on
  every event page, cut the Cohort 2 FAQ from thirteen questions to seven, and gave
  the empty testimonials collection its first quote.** Drummond's brief, verbatim:
  simplify, use the Cohort 1 testimonials in part, make the Luma sign-up more
  prominent, remove text that does not add value.
  **Band order on `events/[slug].astro` changed and should not be changed back
  without a reason.** It was facts → register → proof → agenda → photos → quotes →
  faq. It is now register → proof → quotes → facts → agenda → photos → faq. The
  booking form used to sit third, below a key-facts card carrying a capsule, a
  definition list, five "who it is for" lines and three "what you will build"
  lines — roughly a thousand pixels of reading on the page that takes the payment,
  which paid traffic lands on directly. The hero already states the promise, the
  date, the time and the venue, which is enough to decide whether to look at a
  form. Measured on the dev server: the register band moved from ~1,670px to 683px.
  Quotes moved up with it because evidence is worth most next to the ask, not three
  screens past it.
  **`bands.register` is now pinned `'dark'` rather than taking its turn in the
  alternation.** LumaEmbed styles its fallback link, loading placeholder and iframe
  border for a dark ground. Second position would have handed it a cream band and
  made the one component on the conversion path illegible. Pinning survives the next
  reorder too. Everything after it still alternates, starting cream.
  **The past-event hero line went with it.** "This event has already run." now sat
  directly above a band headed "This event has run", so it was cut along with the
  unused `.event-hero__past` rule. The Cohort 1 page gained from the reorder as
  well: its "next cohort" CTA is now under the hero instead of below the facts card.
  **FAQ: thirteen → seven.** Cut were the date and venue (stated in the hero and the
  facts card already), transfers, lunch-and-recording, and bringing a colleague — all
  three of those are in `assurances`, directly under the form — and "how do I
  register", which sits under the form itself and duplicates the embed's own Luma
  fallback link. "What should I bring" absorbed "do I need a paid subscription".
  Nothing that answers an objection was touched. FAQPage schema count is unchanged
  at 6 across the site because the page still emits one node.
  **First testimonial on the site: `src/content/testimonials/fei-gan.md`.** Source
  is `Digital Brain/Projects/Oxford Agentic Bootcamp/Marketing/cohort-1-testimonials.md`
  (email, 14 Aug 2026, unprompted). Trimmed not rewritten, with an ellipsis marking
  the cut; Drummond's brief explicitly allowed partial use. This closes STATE.md
  task 7 after eight weeks of Cohort 2 selling a £450 day with no attendee's words
  on it anywhere.
  **⚠️ Consent: shipped on Drummond's explicit instruction, with two caveats put to
  him first and accepted.** She gave the testimonial willingly, unprompted and in
  writing, but has not been shown the page or agreed this attribution format; and
  `role` renders as "Cohort 1 attendee" because the vault holds her company and her
  email and has never held her job title — accurate, but not chosen by her. Both are
  recorded in the file's own header. If she objects, `consentGiven: false` takes the
  band and the `/testimonials/` page back out cleanly. **Ask her, and get the title.**
  **`features.testimonials` went on in the same commit, and the two must stay in
  step.** The flag does not only reveal quote bands: it builds `/testimonials/`, adds
  "Outcomes" to the header and footer nav and files the page in the sitemap. Flipping
  it while the collection was unconsented was tried first and reverted — it shipped a
  thin indexable page reading "quotes are being collected", caught by the page count
  going 37 → 38. It tracks the *consented* quote count, not the collection count.
  Build passes: 38 pages, 1,625 internal links resolve, schema valid, one
  pre-existing non-blocking warning (`/` meta description 166 chars).

- **2026-08-17 — Cycle 80: audited the conversion instrumentation, found it healthy, and
  wrote down why so nobody audits it again.** Every cycle in this ledger opens "No GSC
  export". Before adding more copy nobody can measure, the funnel tracking itself got
  checked.
  **The hypothesis was wrong and it is worth recording as wrong.** `ConsentBanner.astro`
  defines `function gtag()` *inside an IIFE* and never assigns it to `window.gtag`, which
  looks exactly like the bug that would make `track()` in `Base.astro` a no-op, since it
  dispatches via `window.gtag?.()` and `window.plausible?.()` and Plausible is
  deliberately unwired. **On production `typeof window.gtag === "function"`.** GTM loads
  `gtag/js` for both `G-3YJV42CLBC` and `AW-18382942196`, and that defines the global.
  The IIFE-local `gtag` is only the Consent Mode shim, which is correct as written. The
  events are dispatching.
  **What could NOT be verified, and why it is not evidence of a fault.** The three
  intent events (`register_section_viewed`, `luma_embed_interacted`, plus the click
  events) never fired during testing even with the register section at 100% visibility
  and a spy on `window.gtag` installed before any scroll. That looked damning until an
  **independent IntersectionObserver, created in the page on the same element at the
  same threshold, also never fired.** IntersectionObserver callbacks do not run in the
  hidden/headless browser pane. The inability to observe was the tool, not the site.
  Anyone re-testing this needs a real visible browser.
  Two smaller things ruled out along the way, both recorded so they are not re-chased:
  `window.scrollTo` appearing to do nothing is `html { scroll-behavior: smooth }` plus a
  synchronous `scrollY` read, not a scroll lock; and `body { overflow: clip visible }` is
  deliberate, with the reason in a comment at `global.css:133` — `hidden` would turn body
  into a scroll container.
  **Shipped alongside: the objection that actually stops this booking.** "Will this work
  for *my* task?" had no answer on the Cohort 2 page. It had one on the Cohort 1 page,
  in a FAQ nobody deciding about September reads: real tasks rather than a set exercise,
  lead generation, internal reporting and marketing content, and the common shape of a
  step that gathers, a step that produces and a step that checks. Now a FAQ on Cohort 2,
  placed second, where the buyer asks it. Sourced, not invented.
  **Standing note for future cycles: the funnel is instrumented and working, so the
  constraint is that nobody has read the numbers.** GA4 `G-3YJV42CLBC` has been
  collecting `register_section_viewed` and `luma_outbound_click` by event slug since
  12 Aug. That is the signal this ledger keeps saying it does not have. It needs
  somebody to open GA4, not more code.

- **2026-08-17 — Cycle 79 (Drummond, in session): the page paid traffic lands on had no
  reason to care in it.** Second conversion pass on Cohort 2. (The fact-check commit
  `4f82762` sits between this and cycle 78; it was a separate session and logged no
  entry of its own. Its findings are in its commit message and in `STATE.md`.)
  **Above the fold, a visitor got the product name twice and then a postcode.** The
  eyebrow renders `{programme} - {cohort}` and the H1 renders the title, which on this
  event *is* "{programme} - {cohort}" — the same string, one under the other — followed
  by a date, a time and a venue. The reason to spend a day and £450 sat at 48% of the
  page, inside the capsule.
  **This matters more here than on any other page**, because the link Drummond is
  working from carries `_gl` and `_ga` cross-domain linker parameters and GTM is live
  with the Google Ads tag. Paid traffic lands on the event page directly and never sees
  the homepage, where the promise actually lives ("One day in Oxford. One real task from
  your own work. A workflow that runs by the time you leave.").
  **Shipped: an optional `promise` on the event schema, rendered under the H1**, falling
  back to the programme's `shortPitch` when unset. The fallback is the point — the
  Second Brain cohort gained a promise it never had, from copy already published on its
  programme page, without anyone writing one per cohort. Suppressed on past events,
  where a future-tense promise over a finished day reads as an error.
  Cohort 2 overrides the fallback, because `shortPitch` opens "A one-day AI bootcamp in
  Oxford" and the date and venue render on the very next line. Its override is the
  capsule's own substance, front-loaded: "Bring one real task from your own work. Leave
  with a working agentic AI workflow running against it."
  **Verified**: build green. On mobile at 377×816 the promise and the primary CTA are
  both above the fold, no horizontal overflow at 375 or 1280.
  **Noted, not changed: the eyebrow is still an exact duplicate of the H1** on any event
  whose title is "{programme} - {cohort}". Two lines of the most valuable space on the
  site saying one thing. Suppressing it is a one-line change, but the eyebrow-and-dash
  is a design-system anchor used on every band, and what should replace it is a call for
  Drummond rather than an inference — the homepage puts a real label there
  ("ONE DAY · HANDS-ON · AN OXFORD EXPERIENCE"), which is the pattern worth copying.

- **2026-08-17 — Cycle 78 (Drummond, in session): the page taking the money had no
  evidence the day had ever happened.** Asked directly to improve conversion to paid
  signups on the Cohort 2 page, thirty days out with ten seats already sold at £450.
  **The finding is one of placement, not of missing material.** Every asset that proves
  this is real — sixteen attendees, three teaching blocks (written here as "build
  cycles", which the fact-check in `4f82762` later corrected against the recordings),
  four consent-cleared
  photographs — existed, and rendered only on the Cohort 1 page. `showPhotos` gates on
  `isPast`, `outcomes` is populated only for events that have run, and the
  `testimonials` collection is empty repo-wide. So the page with nothing left to sell
  carried all the proof, and the page asking for £450 carried none of it. Cohort 1 was
  mentioned on the Cohort 2 page only inside two FAQ answers.
  **Three changes, all placement, no new claims:**
  1. **A proof band under the booking form**, on any upcoming event with a completed
     predecessor in the same programme. New `getPredecessorEvent` — the mirror of
     `getSuccessorEvent`, same-programme only and never falling back to another
     programme, because an agentic result does not reassure a Second Brain buyer. The
     copy is the predecessor's own `capsule` verbatim and the stats are its own
     `outcomes`: this band reports, it never claims. Photos come through `getPhotos`,
     which filters on consent first, so a held-back frame cannot reach it. It picked
     `seminar-room-working` and `room-and-cohort` and **not** the St Anne's
     registration desk, which keeps the college-logo grey area off a Cohort 2 page.
  2. **An `assurances` field rendered directly beneath the Luma embed.** The transfer
     promise was the eleventh item of a twelve-item accordion *below* the form — the
     single most booking-relevant sentence on the page, placed where someone hesitating
     over a card field will never see it. Per-event and opt-in: a transfer promise is a
     commercial undertaking, so it appears only where the event has made one. All three
     lines restate facts the same page states elsewhere.
  3. **Two FAQ moves.** "How do I justify this to my manager?" — the expensing question
     that decides a B2B purchase — went from ninth to second. "How do I register for
     Cohort 2?" went from second to last, because it occupied the second-most-read slot
     directly beneath the booking form to answer a question nobody who got there still
     has. Its answer also said "the form below" while sitting below the form; corrected
     to "above". "When and where is it?" stays first: it is the answer capsule engines
     quote, and cycle 50 established the first FAQ as a GEO surface worth protecting.
  **Verified**: build green (37 pages, 1519 links, schema valid, only the known 166-char
  meta-description warning). Rendered DOM checked for order and content; computed styles
  confirm gold bullets `#D4AF37` and `--muted-on-dark`, photos two-up at 1280 and stacked
  at 516, stats on one row, no horizontal overflow at either width.
  **Not touched, deliberately:** price (Luma, standing decision), capacity (confirmed
  fact, and the ten-versus-twenty-five question is still open), and no consent flag was
  flipped. `room-and-cohort` carries the STATE consent caveat and now appears on a
  second page — same audience, no new exposure, but flagged rather than assumed.
  **The three biggest remaining conversion gaps all need Drummond**, and each is worth
  more than anything the loop can ship alone: zero testimonials anywhere in the repo for
  a £450 day; two agenda slots that read "Guest session" with no name against them; and
  no answer to the certificate question, which the comparison set leads with.

- **2026-08-17 — Cycle 77: checked the booking path and found the Second Brain day is
  free.** No GSC export. Cohort 2 is thirty days out and nothing on this project tests
  the conversion path, so it got tested rather than assumed.
  **The path itself is healthy.** All three Luma embed URLs return 200, the embedded
  event ids match the content files, and Luma's dates agree with the site exactly -
  16 September and 21 October. Worth recording as a clean result, because a silently
  broken embed on a booking page is the single most expensive failure available here
  and nothing would have caught it.
  **The finding came from the data behind the embed.** `luma.com/7vcqji8g` reports
  `price: null`, `is_free: true`, `spots_remaining: 30`, zero registrations. The
  Second Brain Bootcamp is currently bookable for nothing, while Cohort 2 is £450 for
  the same one-day format - and the site's own FAQ promises pricing on the booking
  page, which is untrue for that event today. Flagged in `STATE.md`, not touched.
  **Cohort 2: £450, ten guests registered, eight remaining on the Full Day Pass.**
  The first real demand signal the project has produced.
  **Nothing shipped to the site, deliberately.** Price stays off by standing decision.
  A scarcity claim would be stale within a week and the message house bans one that is
  not checked on the live page that day. And capacity is a confirmed fact - 30 is a
  sound inference from `spots_remaining` at zero bookings, but an inference is not a
  confirmation, so backlog 15 stays open until Drummond says the number.
  **Method worth reusing:** the Luma page carries its own JSON, so the booking path,
  the dates, the price and the availability can all be verified from outside without
  an API key. Not put in CI - a third-party outage must never fail a deploy - but
  worth running by hand before any promotion push.

- **2026-08-13 — Cycle 65: the team page said four people and listed five.** No GSC
  export. Audited the OG cards, a surface never checked before and the one that
  decides what a LinkedIn share looks like — which matters because LinkedIn is the
  channel this actually gets promoted on.
  **25 cards existed and 13 pages fell back to the generic homepage card**, including
  every team profile and the bootcamps index. The guides block in `[key].png.ts`
  already argued the case for its own set: "so a shared article gets its own headline
  rather than the generic index card". Nobody had applied it to people. Announcing a
  new facilitator is one of the few things anyone actively posts about this site, and
  that post rendered a card with no person on it — the single share where the name is
  the whole point. Now 32 cards; the only remaining fallbacks are `/`, `/404`,
  `/home-photos/` and `/privacy/`, all correct.
  **The better find was next to it.** The team index subline read "Four practitioners"
  while listing five. It broke when Nicolai was added and the prose was not updated —
  a hardcoded count sitting beside the list it contradicts. Now derived from
  `members.length`, so it cannot drift again.
  Also checked and dismissed: `dist/og/` holds duplicate `" 2.png"` files locally.
  They are macOS artifacts from building without cleaning, `dist/` is gitignored, CI
  builds fresh, and they 404 on production. Not a bug — recorded so a later cycle
  does not spend time on it.
  Incidental, useful for backlog 19: Nicolai's card confirms his company is
  **Jenesys AI**, which narrows the search for the missing link considerably. Still
  not guessed at.

- **2026-08-13 — Cycle 64: the schema claimed links the page did not show.** No GSC
  export. Audited external links, which the build cannot check — `check-links.mjs` is
  internal-only by design, and the `luma.com/oxfordagentic` 404 that cost the
  Organization its only `sameAs` in July is the standing argument for looking
  manually. **All five external URLs are healthy:** ico.org.uk 200, and both Luma
  booking links 200, which are the two that actually matter. The LinkedIn 999s are
  LinkedIn's bot block, not rot — worth writing down so a future cycle does not
  "fix" a working link.
  The audit surfaced something better than rot. Only `links.linkedin` was ever
  rendered on a profile, but `personSchema` has always emitted **every** link into
  `Person.sameAs`. So Emine's novaria.ai and Josh's adder.dev were in the structured
  data and invisible on the page: schema describing something the page does not
  show, which is the one thing structured data is not supposed to do.
  Both URLs checked before surfacing — 200, and on-topic ("AI Transformation &
  Strategy for Business Leaders", "AI Development Studio"). That is the point: for a
  training brand, evidence that the people teaching it do this work for a living is
  stronger corroboration than a LinkedIn profile, and it was being hidden.
  Template now renders LinkedIn, X and Website in a fixed order. Verified in `dist/`:
  visible links match `sameAs` on all four profiles that have any.
  **Nicolai Thomson has none** — logged as backlog 19 rather than guessed at.

- **2026-08-12 — Cycle 63: declined to publish, and wrote down why.** No GSC export
  (28th cycle). Guide budget for 12 Aug was unspent and the backlog said weight
  toward Second Brain, so a guide was the obvious move. It was the wrong one.
  Probed the candidate query first, per the discipline cycle 60 established.
  **"Why does AI still sound generic after I gave it context"** is owned by
  content-marketing blogs - Medium, ConversionMinded, StartupNation, Lilach Bullock,
  Digiwell, Brandfolio. Winnable on authority, unlike the NHS space. But the intent
  is a copywriter wanting better AI output, not a leader who has hit the ceiling of
  prompting. Writing to it buys traffic that does not convert and enters a commodity
  blog fight. **Not written.** The probe paid for itself by preventing the work.
  Promoted the lesson from three cycles of evidence into a hard rule under backlog 9:
  probe before writing, and require **winnable AND converting**, not either alone.
  Recorded because guide count is a tempting metric and it is the wrong one.
  Shipped instead: the privacy page added to `publicPages()`, so `llms.txt` lists it.
  It was in the sitemap but missing from the file that claims to list every public
  page - a gap introduced by my own consent work the day before.
  **Also verified, and worth recording because it could have gone badly:** the GTM
  and consent banner work added a third-party script and a fixed-position element to
  all 35 pages. CI passed on both commits, including Lighthouse best-practices at a
  **perfect 100** on non-event pages, where the budget allows no margin. The reason
  it passes is the consent gate itself: Lighthouse never clicks Accept, so no
  advertising cookie is ever set during an audit. Had the tag gone in ungated - the
  faster option that was on the table - it would have set `_gcl_au`, tripped the
  third-party-cookie audit and failed the build on every page.

- **2026-08-10 — Cycle 62: `llms-full.txt` was missing the single most-quoted text
  on the site.** No GSC export; guide budget spent. Deliberately moved off seoTitle
  work - cycles 59, 60 and 61 each shipped one and none is measured yet, so a fourth
  would have been stacking bets rather than testing them.
  Checked conversion off the guides first (they are 16 of 31 pages and the original
  brief was bookings): fine, two primary CTAs and multiple paths to both bootcamps
  and Cohort 2. Not the gap. Audited the GEO surfaces instead, which nothing had
  ever done.
  **`llms-full.txt` covered programmes, events and guides. It did not include the
  homepage FAQ, the About page, or the people** - while `llms.txt` advertised it as
  "the complete text of every page on this site".
  The FAQ omission is the expensive one. The cycle-57 probe showed engines lifting
  those exact answers near-verbatim into result snippets, which makes them the
  highest-value text on the site for this purpose - and they were the one surface an
  engine reading the full-text file could not see. They sit in `home.ts` precisely so
  every consumer shares one copy; this is now the third, alongside the accordion and
  the `FAQPage` node, and it cannot drift.
  Added a `## People` block too. Same reasoning as the Person schema on About:
  engines establish an entity by triangulating it, and a training business whose full
  text names nobody is harder to place than one that does.
  1038 lines to 1121, verified in `dist/`.
  **Also fixed the claim rather than only the coverage.** The homepage and About
  prose lives in `.astro` components, not in content collections, so it cannot be
  pulled without restructuring those pages - out of scope for one cycle. Rather than
  leave "the complete text of every page" standing as a promise the file does not
  keep, the description now names what is actually in there. A file that overstates
  its own contents to an AI reader is worse than one that is honestly partial.
  **Left for later:** getting the About page's origin story into the full text would
  need its prose moved into a collection. Worth doing, not worth doing hastily.

- **2026-08-10 — Cycle 61: the public-sector guide competes with NHS England on
  NHS England's own ground.** No GSC export; guide budget spent. Probed the vertical
  guides, because cycle 60 established that buyer-qualified queries are the winnable
  ones and these carry the strongest qualifiers on the site.
  `agentic-ai-for-public-sector-and-nhs-leaders` is **absent** from two queries. The
  first leaned on "information governance" and pulled the policy set, which was
  arguably my query construction - so it was re-probed buyer-shaped ("what work can
  NHS and council staff safely use AI for without touching patient data"). **Absent
  from that too**, and the winners were: an NHS trust AI policy, an ICB policy PDF, an
  NHS-provider governance policy, the King's Fund, and NHS England.
  **This is a different case from cycle 60 and must not be filed with it.** There the
  audience could not convert, so the answer was to leave the query alone. Here the
  audience is explicitly in `whoFor` - "senior public-sector, NHS and university
  staff" - so these are real buyers. What cannot be won is the *framing*: on "what am
  I allowed to do", the answer that should rank is the reader's own organisation's
  policy, and no training site outranks NHS England on that, nor should it.
  The guide's actual value is the question policy documents never answer: **what to
  build**. Every trust policy says what you must not do; not one says what the shape
  of an agentic workflow for board papers looks like. That distinction was in the
  h1 ("start where governance says yes") but the seoTitle was **"Agentic AI for the
  public sector and NHS"** - generic, and head-on into the space Microsoft, AWS and
  gov.uk own. Changed to **"The agentic AI work NHS governance allows"** (41 chars):
  it concedes the permission question and claims the selection question, which is the
  one the guide actually answers. "Public sector" stays in the h1 and description, so
  nothing is lost on-page.
  **Third consecutive seoTitle hypothesis** (cycles 59, 60, 61). All three are
  unmeasured. Re-probe the set together in a few days rather than one at a time; if
  none has moved, the pattern is authority and the answer is off-page, not framing.
  **Not probed: the finance guide.** A classifier outage killed the request
  mid-cycle. Still outstanding, along with ten others.

- **2026-08-10 — Cycle 60: "AI bootcamp" means something else to most searchers, and
  that is a positioning fact, not a ranking bug.** No GSC export; guide budget spent.
  Continued the guide-by-guide probe from cycle 59.
  `ai-bootcamp-vs-course-vs-exec-education` is **absent** from "AI bootcamp vs AI
  course vs executive education". But unlike cycle 59's case, the fix is *not*
  formatting. Look at who wins it: Nexford (bootcamp vs certificate vs **degree**,
  $9,995, 26 weeks), Emeritus, ai-x-leaders (12-week programme), ThinkPythonAI
  ($10,000-$20,000, career switchers, Python), InstitutePM, AgileFever (TensorFlow,
  job placement). **Every result is career-change technical upskilling.** In the
  dominant sense of the phrase, an "AI bootcamp" is a 12-to-26-week programme costing
  five figures that turns you into an ML engineer.
  **So this query is not winnable, and should not be won.** The traffic is people
  considering a career change into AI engineering. They will not book a one-day
  executive day in Oxford at any price. Chasing the query would mean rewriting a good
  guide to serve an audience that cannot convert - the same trap as a doorway page,
  arrived at from the other direction.
  What *is* actionable: the seoTitle led with "AI bootcamp" and carried no audience
  qualifier, so it competed head-on in that space while signalling nothing about who
  it is for. Changed to **"Which AI training format do leaders need?"** (41 chars) -
  keeps the comparison intent, adds the qualifier that separates it from
  career-change content, and uses "AI training", a phrase this site demonstrably wins
  on (#1 for the Oxford-anchored and national buyer queries, cycle 57). The on-page
  `title`/h1 is unchanged: it reads well and carries all three terms honestly.
  **Hypothesis, flagged as such**, same as cycle 59. Re-probe both together.
  **Checked and dismissed: cannibalisation.** This guide and
  `after-the-ai-executive-programme` both touch the exec-ed graduate, but they target
  cleanly different intents - "which of the three do I pick" versus "I have finished
  one, now what". Not competing. No action.
  **The strategic point worth carrying forward:** the site is #1 on every query that
  contains a buyer qualifier (Oxford, business leaders, one day, hands-on) and absent
  from generic informational ones owned by a different product category. That is the
  correct shape for a business selling a specific day to a specific person, and
  future cycles should not read absence from a generic query as a defect without
  first checking who owns it and whether that audience can convert.

- **2026-08-10 — Cycle 59: probed whether the guides earn anything, nearly drew the
  wrong conclusion from one query, and found a real format mismatch instead.**
  No GSC export; guide budget for 10 Aug spent, so a refresh cycle. The guides are
  16 of 31 indexable pages and nothing had ever checked whether they rank.
  **The near-miss, recorded because the reasoning matters more than the fix.**
  First probe - "what questions should I ask before booking AI training for my team",
  almost the exact title of a published guide - returned eight results with
  oxfordagentic.com **nowhere in them**. Against the #1s on every commercial query,
  that reads as "the guide cluster earns nothing", which would be an argument for
  stopping guide production entirely. Second probe, "what is an agentic AI bootcamp",
  returned the Oxford guide at **#1**, above Data Science Dojo's 10-week bootcamp and
  a European NVIDIA-backed one. So guides *do* rank, and one query is not a cluster.
  **The real finding is the contrast between those two queries.** Every result that
  beat the checklist guide leads with a count: "10 Questions for Founders", "5
  Questions to Ask Before Approving", "Five Questions to Ask Before You Buy", "33
  questions". That query space is dominated by numbered listicles - and the Oxford
  guide *is* one, nine numbered `##` sections, with the count stated in the
  description but **not in the title**. It was competing in a listicle space without
  the listicle signal. Title now "Nine questions to ask before booking AI training";
  `seoTitle` "9 questions before booking AI training" (numeral, because every
  competitor uses one and the SERP string is where it has to win). Title tag renders
  at 55 chars; the h1 keeps the spelled form, per house style.
  **This is a hypothesis, not a certainty** - it is a format-convention match
  inferred from competitor structure, not measured. Re-probe the same query in a few
  days; if it has not moved, the problem is authority rather than framing.
  **Two other numbered guides were deliberately left alone:** "How to choose the task
  you bring" and "What actually goes in a second brain" are both five-section lists
  without a count in the title. The evidence for counts comes from *one* query space
  where listicles dominate; those two sit in "how" and "what" spaces that may reward
  question-matching instead. Test before repeating the trick - applying it everywhere
  on one data point is cargo-culting.

- **2026-08-10 — Cycle 58: the format objection was unanswered anywhere on the
  site.** No GSC export. Working the vein cycle 57's probe opened: buyer questions
  the *comparison set* forces, rather than gaps inferred from the repo.
  Inventoried all **41** FAQs across the homepage, both programmes and all three
  events. The biggest hole was the one the competitive landscape makes unavoidable:
  **"Is one day really enough?"** A buyer looking at this is simultaneously looking
  at Saïd's 3-week online programme, a 5-day Oxford Executive Institute course, a
  2-day Maven course and a 2-day Oxford AI Summit. Every one of them is longer.
  Nothing on the site addressed the obvious question.
  The answer deliberately does not argue that more is fitted in. It argues the scope
  is narrower on purpose, and names what the day leaves out - no tour of the AI
  landscape, no model comparisons, no governance policy - because naming the
  exclusions *is* the argument. Closing line does the competitive work without
  naming anyone: "The alternative is not a better day. It is a longer course you
  attend and then never apply."
  Grounded throughout in published copy: the "deliberately does not cover" list is
  already in the questions-to-ask guide, the build-cycle format and "leave with the
  pattern" are on the Agentic pages, and Cohort 1's record shows three facilitated
  build cycles with every attendee running what they built.
  **Placed on the homepage only, deliberately.** `home.ts` is the shared-surface
  file by design, the homepage FAQ is what the cycle-57 probe showed being extracted
  into result snippets, and this is a site-wide question rather than a product-line
  asymmetry - so it is not a cycle-52 parity case, and triplicating one answer
  across three pages would create three places to maintain it and read as stuffing.
  Homepage `FAQPage` node: 9 questions to 10, verified in `dist/`.
  **Found and deliberately not answered: the certificate question** - see backlog 18.
  The comparison set leads with certificates and the site is silent. Both possible
  answers are assertions of fact the loop has no source for, so it stays open.

- **2026-08-10 — Cycle 57: stopped guessing and re-probed, because the single-product
  sweep was running thin and a GEO probe is the one real signal obtainable without
  Drummond.** No GSC export (27th cycle). Four queries, Perplexity, GB.
  **Position — much better than the 30 Jul picture:**
  - Oxford-anchored agentic query: **#1, #2, #3 and #5** are all oxfordagentic.com
    (was #2). Saïd's £1,500 online programme is #4.
  - National buyer query, no Oxford anchor: **#1** (was *absent*, every citation to
    an aggregator). This is the finding that changes the plan - see backlog 2b.
  - "course to build a second brain for AI ... UK": **#1**.
  - Exact-phrase "Oxford Second Brain Bootcamp": **#1**.
  The homepage FAQ answers are being extracted near-verbatim into result snippets,
  including the two-bootcamp entity paragraph, so the answer-capsule work is landing
  where it was aimed.
  **Read the numbers with care:** one engine, ranked results rather than cited AI
  answers, and IndexNow has been pinging hard since cycle 53, so part of the lift is
  plausibly freshness rather than authority. Re-probe elsewhere before betting on it.
  **Competitive finding, which is the actionable half.** The AI-second-brain space is
  crowded and almost entirely online or tool-locked: Forte Labs itself now sells "The
  AI Second Brain" (3 weeks, online, PARA-based, taught with Claude); a London Luma
  workshop is the nearest in-person equivalent and is welded to Claude Code plus
  Obsidian; Maven has a 2-day online course at £495; the rest are self-paced or
  developer-facing RAG courses. **Oxford's is the only one-day, in-person,
  tool-agnostic option in the set** - and the site never answered the tool question a
  buyer comparing against those would obviously ask.
  Shipped: a **"Which AI tools does this work with?"** FAQ on the Second Brain
  programme and Cohort 1 pages. Answer grounded entirely in published copy - the
  programme already promises "the connections that let your AI tools actually draw on
  it, **across tools**" - so this states an existing commitment plainly rather than
  making a new one. No competitor is named on the site; the differentiator is stated
  positively and lets the comparison happen in the reader's head.
  Both surfaces updated together, per the cycle-52 parity lesson.

- **2026-08-10 — Cycle 56: the buyer-consideration cluster was tagged to one
  programme, so it supported one programme.** No GSC export; guide budget spent, so
  a retag-and-refresh cycle. Cycle 55 made `relatedProgrammes` the axis the related-
  guides ranking runs on, which promoted it from a loose label to load-bearing
  metadata - and immediately exposed that it was wrong on the `choosing` category.
  All five `choosing` guides were tagged `oxford-agentic-bootcamp` only, but they
  answer **format** questions, not subject questions: is in-person worth it, what
  does "hands-on" mean, what should I ask before booking. Those apply to both days.
  The cost was compounding in three places at once: the Second Brain line got no
  support from the entire buyer-consideration cluster, `Article.about` named one
  programme, and after cycle 55 a Second Brain reader could never be shown any of
  them as a sibling.
  Retagged **two** - `why-in-person-beats-online` and `what-hands-on-actually-means`
  - and added a short closing paragraph to each so the copy matches the tag rather
  than the tag over-claiming on copy that only discusses one product. Both additions
  are drawn from published facts (one day, in person, Oxford, own material, leave
  with it running). **No capacity claimed for the Second Brain day** - it has none
  published anywhere, per backlog 15.
  **Deliberately retagged only two of five.** `questions-to-ask-before-booking`
  closes with nine specific Agentic answers (cap, build ratio, paid-plan advice); a
  matching set for the Second Brain day would need capacity data that does not
  exist, and a half-answered comparison is worse than none. The two exec-education
  guides are genuinely agentic-specific in argument, not just in example.
  Verified in `dist/`: `Article.about` now names both programmes, both bootcamp
  links render, and the Second Brain guides now surface both retagged guides as
  siblings in place of two agentic-only ones.
  Also fixed the `start-here` category blurb, which still read "What agentic AI is"
  while describing a group that now contains a second-brain guide and the
  both-programmes glossary.
  **Flagged, not changed: `brand.tagline`** (`'Practical agentic AI training in
  Oxford'`). It is the homepage `<title>`, the footer line and two OG cards, and it
  describes half the business - the same fault as `brand.description`. But it is
  also the strongest keyword string on the highest-ranking page, and the 30 Jul
  probe had the site at #2 for Oxford-anchored queries. Rewriting the top page's
  title on no data is exactly the gamble the loop prompt defers to Search Console.
  Added as backlog 17.

- **2026-08-10 — Cycle 55: the related-guides heuristic ranked on the wrong axis,
  and the Second Brain cluster had no internal cohesion.** No GSC export; guide
  budget for 10 Aug spent in cycle 54, so a technical/internal-linking cycle.
  **Correcting a wrong reading first, because it nearly caused wasted work:** a grep
  for `](/guides/…)` across the markdown returned zero, which looks like "no guide
  cross-links anywhere" and would have justified building a whole related-guides
  component. It was wrong - the links live in the page template, not the prose, and
  every guide already renders four siblings. **Check the built HTML, not the source,
  before concluding a link does not exist.**
  The real fault was narrower and worth fixing. `otherGuides` ranked same-`category`
  first, and category is the reader-journey axis (`start-here`, `choosing`,
  `in-practice`), not the subject axis. That was harmless with one programme line.
  With two it broke immediately: the two second-brain guides sit in *different*
  categories, so neither ever surfaced the other, and both spent all four slots on
  agentic guides. A reader finishing one had no route to the other, and search and
  AI engines saw two second-brain pages with nothing connecting them - precisely the
  cohesion a content cluster is supposed to supply.
  Now scored: shared `relatedProgrammes` = 2, same category = 1, recency breaks ties.
  Verified in `dist/`: both second-brain guides now surface each other in the top
  slot, and the agentic guides' siblings are **unchanged**, so the fix adds cohesion
  to the new cluster without disturbing the established one.
  Self-correcting as the guide count grows - no per-guide curation to maintain.

- **2026-08-10 — Cycle 54: the brand name collides with an established concept, and
  nothing on the site addressed it.** No GSC export, so a step-2 cycle; guide budget
  for 10 Aug unspent and the split was 13 Agentic to 2 Second Brain, so a Second
  Brain guide. Shipped **"A second brain for AI is not the note-taking kind"**
  (`/guides/second-brain-for-ai-vs-note-taking/`, `start-here`).
  **Why this one over the two standing candidates** ("paid AI subscription?",
  "agentic AI for charities"): "second brain" is not a term this site coined. It is
  overwhelmingly associated with personal note-taking - Tiago Forte's book, PARA,
  Obsidian and Notion - so anyone searching the phrase arrives with the wrong model
  of what the product is. That is simultaneously a large existing query space with a
  natural long tail ("is X the same as Y"), and a **GEO entity problem**: an engine
  asked what the Oxford Second Brain Bootcamp teaches has an established, better-
  documented meaning to fall back on. Disambiguation pages are one of the few things
  that fix an entity collision, and no page addressed it.
  **The substance is a real distinction, not filler.** The organising claim is that
  the difference is *who retrieves* - a human reader brings memory, shorthand and the
  ability to skim, and a model brings none of it. Four consequences follow (notes must
  be self-contained; folder structure stops carrying meaning; volume actively harms
  rather than merely clutters; nothing signals staleness). It does not duplicate the
  cycle-48 guide, which covers *what goes in*; this covers *how it differs and why*.
  It also does honest qualifying work - it says outright that if the problem is
  finding your own notes again, this is not the day to book.
  Facts checked: Forte's authorship and the note-taking association are public and
  verifiable. No claim invented, no statistics, no capacity or price.

- **2026-08-10 — Cycle 53: every deploy since 6 Aug was red, and it had silently
  switched IndexNow off.** No GSC export. Cycle 52 recorded that a red deploy badge
  is not proof the site failed to update, and that was correct — but it stopped one
  step short of the actual fault, and the missing step was costing something. Two
  chained faults:
  1. `actions/deploy-pages@v4` polls Pages for a terminal status and aborts at a
     **10-minute default**. Pages was sitting in `deployment_in_progress` past that
     while publishing fine — the status API lags the CDN. So the action aborted,
     cancelled its own deployment record, and reported failure on deploys that had
     already gone live. Fixed with `timeout: 1200000`.
  2. `indexnow` had `needs: deploy`, so a failed deploy **skipped** it. The
     `continue-on-error: true` on that job was doing nothing for this case — it only
     suppresses the job's *own* failures, never a skip from an upstream `needs`. Net
     effect: IndexNow last pinged on 6 Aug, so the Second Brain launch, the FAQ
     parity work and the About page rewrite were never announced to Bing-family
     crawlers — the engines that feed ChatGPT's web answers, and the whole reason the
     ping exists. Re-gated on `needs.build.result` with `if: always()`, so a publish
     that merely reports slowly still pings.
  Ran the catch-up ping by hand: **31 URLs submitted, status 200.**
  **The lesson worth keeping:** `continue-on-error` is not a substitute for an `if:`
  condition. One protects against a job failing, the other against a job never
  running — and a job that never runs is the harder failure to notice, because
  nothing turns red. Any future job gated on `deploy` needs the same treatment.
  Also re-audited crawlability end to end while in here (prompted by Drummond):
  robots.txt allows every crawler including the AI ones, no `X-Robots-Tag`, and all
  31 sitemap URLs return 200 with a self-referencing canonical and no `noindex`.
  Nothing is blocking indexing. The three `noindex` pages (`/404/`, `/home-photos/`,
  `/home-original/`) are deliberate and correctly filtered out of the sitemap.

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

  **Deploy incident — read this before shipping two commits in one cycle.**
  The content and the ledger went out as two pushes a minute apart. That overlapped
  two Pages deployments: the first was cancelled mid-flight, and its deployment
  record then **stuck in `in_progress` and held the Pages lock**, so every
  subsequent attempt was rejected. Six deploy runs failed before the cause was
  legible, because the early failures only said "Deployment cancelled" — the useful
  error came later and named it outright: _"due to in progress deployment. Please
  cancel 492ff0e… first"_.
  **The fix:** `gh api --method POST repos/<owner>/<repo>/pages/deployments/<sha>/cancel`,
  then re-dispatch. Two wrong turns are worth recording so they are not repeated:
  (a) `gh run rerun` twice created competing attempts that cancelled each other —
  rerun once, then wait; (b) an empty commit for a "fresh SHA" was the wrong theory
  (the SHA was never poisoned, the lock was) and it is what finally produced the
  explicit error, so it was not wasted, but it was not the fix.
  **Also learned:** `gh run watch … | tail` reports the *pipe's* exit code, not the
  run's. It read as success while the deploy had failed. Never pipe `gh run watch`
  when the exit status is the thing being checked.
  **End state: the site is correctly published and verified live** — both pages
  serve the new FAQs, homepage 200. The final deploy job still reports red because
  the Pages status API never returned `succeeded` inside the action's 10-minute
  window and it aborted; the content had already gone out and stayed out after the
  deployment record was cancelled. **A red deploy job is therefore not proof the
  site did not update — always curl the live URL before concluding either way.**
  **Rule for future cycles: one push per cycle.** Stage the content and the ledger
  into a single commit, or wait for the first deploy to complete before pushing the
  second.

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
