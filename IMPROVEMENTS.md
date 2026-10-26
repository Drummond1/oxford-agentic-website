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
- "Ask Drummond" (the AI assistant, 29 Sept 2026) answers from `llms.txt` and
  `llms-full.txt`, re-synced daily: whatever this site publishes, it will repeat. Never
  add a price, discount code or personal detail to any page, and never change
  `assistant.greeting` or the privacy page's `#assistant` section without the matching
  change in ElevenLabs. See STATE.md.
- "Ask Drummond" is **OFF** - taken off the site on 29 Sept 2026, the day it launched, at
  Drummond's request "until it has been further tested". Never set `features.assistant`
  back to true or `assistant.previewOnly` to false: only Drummond switches it back on.
  The rule above still applies while it is off: when it returns, it reads the same files.
- `/find-your-bootcamp/` and `/office-hours/` (30 Sept 2026) are deliberately **unlisted** voice
  pages. Never link them from any nav, footer, public page, sitemap or llms file (they may link each
  other), never remove their noindex, and never change `assistant.finderAgentId` or
  `assistant.officeHoursAgentId`. Only Drummond promotes them. See STATE.md.

_When the site goes public, switch this section to: auto-ship the technical/freshness
tier; propose-and-approve anything touching copy, claims or design._

---

## Backlog (priority order)

Status: `todo` · `blocked` (why) · `doing`

2. `todo` (Drummond, 2 min in the GSC UI) — **RAISED IN PRIORITY 6 Sept 2026. The CSV
   export is now the loop's biggest self-inflicted blocker, not a nice-to-have.**
   Search Console property is VERIFIED via DNS TXT (confirmed 2026-07-23). Still to do:
   submit `sitemap-index.xml` under Sitemaps, and URL-Inspect → Request indexing for the
   homepage, the Cohort 2 event page and /guides/. **Then export Performance CSVs into
   `seo-data/`.**
   - Without the CSV the loop cannot reliably read **Average position**: the metric
     toggle does not surface the column through text extraction and the row-click filter
     does not apply. It has cost twice - a near-miss title rewrite on a page sitting at
     81.9, and a half-tested verdict criterion on 5 Sept.
   - This blocks **step 1 of the loop's own standing instruction**, "fix the biggest
     impressions-vs-CTR gap", because a zero-click query at position 8 is a fixable title
     problem and the same query at position 42 is not. There are live zero-click queries
     with real impressions right now and the loop cannot sort them.
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
   **RE-RAISED 26 Oct 2026 (13:00 cycle) - this is the top ask again, and the 10 Aug
   downgrade rested on the instrument this cycle retired.** That downgrade was argued from
   *search-result positions* read through a web-search tool. This cycle showed that tool
   returning a query-invariant set of three URLs for our domain, failing an exact-phrase
   retrieval of a page that carries the phrase, and **ignoring its own domain restriction**
   on the next call. Positions read that way cannot carry a conclusion about what is
   indexed or reachable. Meanwhile the 24 August Search Console baseline - the only real
   index measurement in this repo, never overturned - reads **23 indexed, 16 not indexed**
   and diagnoses **crawl budget on a domain with zero external links**, with
   `/bootcamps/oxford-agentic-bootcamp/` on **257 inbound internal links and never crawled**.
   One external link is still the named remedy, `Organization.sameAs` is still empty, and no
   amount of on-page work substitutes. A LinkedIn Company Page or a real Luma calendar URL
   in `brand.social` is the cheapest version.
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
   (expands a real event-page FAQ). **"Who should take the seat - you or someone in your
   team?" SHIPPED 19 Oct 2026 (13:00 cycle)** as `/guides/who-should-take-the-seat/`, after the
   delegation axis was probed twice on four phrasings across two cycles. Four separate engine
   admissions that nothing in the field answers it ("I found no independent comparison of
   sending a delegate versus attending yourself"; "No source compares founders and heads of
   operations for an AI workshop"; "The search didn't find anything that answers who should
   attend"; "no direct evidence on which leader gets the most out of a hands-on workshop"),
   with everything returned being a provider's own marketing. Built from published facts only -
   the bring-one-real-task format, `whoFor`, "Who is it not for?", the laptop and team-booking
   answers, and Cohort 1's recorded composition and tasks. Cross-programme, so it does not
   worsen the Second Brain weighting below. **The level-fit axis ("I already use ChatGPT daily,
   is this too basic?") was probed the same cycle and DECLINED:** the programme pages answer
   both the floor and the ceiling already, so a guide would restate pages that rank. Do not
   re-pitch it without new evidence.
   **"Getting a one-day AI bootcamp approved" SHIPPED 20 Oct 2026 (02:00 cycle)** as
   `/guides/getting-an-ai-bootcamp-approved/`, after the budget-approval axis - untested in 146
   probes - came back empty on three phrasings. It is the last step of the `choosing` journey:
   the buyer has decided and now needs someone else's yes. **The payback-promise axis was probed
   the same cycle and DECLINED:** what the field offers there is measurement after the fact,
   which `is-your-ai-workflow-saving-time-or-just-effort` already covers, so it went in as one
   section rather than a guide. Do not re-pitch it as a guide without new evidence.
   **Agentic AI for charities and non-profits is KILLED,
   16 Oct 2026, by its probe** - DSC (the Directory of Social Change) holds nine of ten
   results on its own subject, and the live alternatives are a £200-£289 online day and a
   free funded TechSoup/Google.org course, so the field is neither winnable nor converting.
   Do not re-pitch it. The second-brain contents guide shipped in cycle 48.
   **The Second Brain line has four supporting guides as of 2 Sept 2026; the Agentic
   line has 13. Keep weighting new guides toward Second Brain until that is less
   lopsided.** (Said "two" until 2 Sept; it was wrong - count the files, do not trust
   this line's memory of itself.)
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
    **Re-run for the Coding Bootcamp launch (25 Sept) over 16 Oct**, which is what the
    checklist is for: FAQ depth parity closed at 14:05, the glossary swept at 19:00 (two
    coding terms, the `No-code` entry reconciled, all three lines in `relatedProgrammes`).
    `src/lib/home.ts` already named all three lines in four answers and needed nothing.
    **The About page origin story was swept 17 Oct** - it described exactly two gaps and two
    days, and now names the third. That closes the four-surface list for this line.
    **A fifth surface, added 17 Oct 2026: `brand.longDescription` in `site.config.ts`.** It
    is the entity line at the top of `llms.txt` and `llms-full.txt`, the About hero subline
    and (its first sentence) the footer on every page, and it had described only the
    agentic-workflow line since 16 Aug, through two launches. It is site-only - NOT the
    string PRD §13 requires reused verbatim off-site - so the loop can move it, and did.
    Check it on the next launch. `brand.description` and `brand.tagline` still wait for
    Drummond (the decision note in STATE.md, and backlog 17).
15. `done` 13 Sept 2026 — Second Brain group size. **Drummond: "small group", no number.**
    The Second Brain programme FAQ now answers "Small, and capped". Do not publish a number.
16. `blocked` (Drummond, one word) — **Josh Lawman is half-removed.** The 4 Aug
    instruction was "remove Josh from the team slide"; he is gone from the homepage,
    but `/team/josh-lawman/` is still live, indexed and in the sitemap, and
    `/team/` still lists him. His bio reads in the present tense ("teaches the parts
    of the day that go furthest"), so if he has left the team the live site is
    currently inaccurate about a named real person. Flagged 10 Aug and deliberately
    not actioned: deleting a person's page is his call, not the loop's, and the
    literal instruction was satisfied. If confirmed: delete
    `src/content/team/josh-lawman.md` and add a redirect for the old URL.
18. `answered, not published` 13 Sept 2026 — **Certificate: not yet confirmed, maybe in
    future** (Drummond). Say nothing on the site either way until he confirms. Do not write
    "no certificate", and do not imply one.
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
20. `todo` **(needs Drummond, one click)** — **PR #1 is open, stale and superseded.**
    "Stop the breadcrumb pushing 31 pages past the viewport on a phone", branch
    `fix/breadcrumb-mobile-overflow`, opened 26 September from a cycle that could not
    reach production and has had no activity since. Its base is `28a8529`, long behind
    `main`. The change it carries — `min-width: 0` on `.crumbs__item` — shipped
    independently in `384564e` on 11 October and is live, so merging it would be a
    no-op and leaving it open reads as unfinished work to every future cycle, which is
    a stop condition in the loop's own rules. Close the PR and delete the branch. The
    loop will not close someone else's pull request on its own.

21. `todo` **(needs Drummond, a colour decision)** — **the bronze link and eyebrow colour
    fails WCAG AA on cream.** `--rust` / `--burnt` is `#9A7B23` on the `#FFF9EC` page
    background, which measures **3.83:1** against the 4.5:1 that normal-size text needs.
    Measured on 13 Oct across all 60 built pages at 375px: it is the colour of every
    eyebrow, every byline, the "More guides" headings, the event-card "Register" labels,
    the agenda times, the team roles and most inline links, so it is on 58 of 60 pages
    rather than in one component. The gold `#D4AF37` arrows (`programme-row__arrow`,
    `module__num`) measure 2.0:1 on the same background. A pre-existing instance of this
    was flagged on the guide byline in the 7 Sept cycle as "worth a later cycle"; the
    measurement above is the whole of it. **The loop will not change it**: bronze is
    Drummond's own Brand Guide Gold token, applied 5 Aug, and the design tokens are law.
    The fix is one number — darkening the bronze to about `#7E6415` clears 4.5:1 while
    staying the same hue — but it is a brand-colour change and his call. Note that the
    recorded Lighthouse accessibility scores of 100 do not contradict this: the 7 Sept
    cycle logged a guide page at 95 for exactly this cause.
22. `todo` **(needs Drummond, facts only he has)** — **Cohort 2 ran on 16 September and
    the site records nothing about it.** `/events/` says in its own standfirst that "past
    ones stay here with what came out of them", and Cohort 1's page carries three outcome
    figures. Cohort 2's file carries none, with the comment "nothing about the day has
    been confirmed". Four weeks on, that is the one past-cohort page that does not keep
    the page's promise, and it is the most recent proof the site has. Attendee count and
    anything about what the room built would close it. The loop will not infer either.
23. `todo` **(needs Drummond, a wording call)** - **two of the three quotes on a past
    cohort's page read as if they came from that cohort.** Testimonials are attached to
    the programme rather than to an event, so Cohort 2's page shows the three Cohort 1
    voices under the heading "From the room". Fei Gan's names its own day ("the July 2026
    AI Agentic Bootcamp", "Cohort 1 attendee"); Kirsten Samuel's and Shrestha Mullick's
    carry a role and a company and no cohort, so on the Cohort 2 page a reader can fairly
    take them for Cohort 2 attendees. The date under each name was removed on purpose in
    an earlier cycle because it read as a contradiction, so this is not a case of putting
    it back. A heading that says whose room it was, on past events only, would fix it in
    one line. The loop is not rewording how a real person's quote is presented without
    his say-so.

24. `todo` **(needs Drummond, a positioning call)** - **the seven team profiles have one
    inbound internal link each, and every place that would fix it argues with a decision
    already on the record.** Measured on the built site on 16 Oct: counting unique inbound
    internal links per sitemap URL across all 61 pages, `/team/<person>/` scores **1** for all
    seven people - `/team/` is the only route in - while every page in the nav or footer scores
    58 or 59 and the least-linked guide now scores 3. The site's own JSON-LD leans on those
    pages: all 30 guides declare `author` as `.../team/drummond-gilbert/#person`, and the
    Organization node names the same `@id` as `founder`. The ledger calls entity triangulation
    the weakest part of this site's GEO position (backlog 2b, 19), so Person pages with one
    route in are a missed signal rather than a cosmetic gap. **Three placements were considered
    and all three were declined by the loop, which is why this is his call and not a cycle:**
    - **The guide byline.** It is plain text today ("By Drummond Gilbert · Updated ..."), and
      linking it is the standard pattern for author corroboration. But all 30 guides are his,
      so it adds 30 links anchored on his name to his own profile - which is precisely what the
      15 Oct `/team/` diagnosis said not to chase: `drummond gilbert` resolves to `/team/`
      rather than the profile at position 7.4, and that is "working as intended" under the
      9 Oct preference that the site read as a team rather than one person.
    - **The programme pages.** They would link the four people tagged to each bootcamp, which
      is the mapping `/team/` already publishes ("Each runs part of a day"), so it asserts
      nothing new and it answers a real buyer question. But the programme page template carries
      Drummond's own 4 Aug instruction that guides deliberately do not surface there because
      "the programme page's one job is the booking path", and four profile links are four more
      off-ramps on the page that sells the day.
    - **The About page.** Lowest tension and lowest value: it names only Drummond, so it would
      duplicate `/team/` to reach the other six.
    **What would settle it in one line from him:** whether the guides' bylines should link his
    profile. If yes, the loop ships the byline link. If no, the loop leaves all seven at one
    link and stops re-measuring this.

25. `todo` **(needs Drummond, one fact only he has)** - **does the Agentic Coding Bootcamp
    require a paid Claude or ChatGPT plan, and which?** The Agentic Bootcamp answers this on
    both its programme and its event page: a paid plan "gets you more out of it, but it is not
    essential and we make sure everyone can take part either way". The Coding Bootcamp answers
    it nowhere, and the honest answer is probably not the same one, because Claude Code and
    Codex both sit behind paid plans rather than free tiers. The 17 Oct prerequisite probe
    found **every** competitor listing in the field stating its requirement outright - one
    warning that turning up without it means missing the first thirty minutes, another naming
    the exact plan and the desktop app - and found no editorial page answering the question at
    all, so the listing is where buyers check it. **The loop will not write this one**: "a paid
    plan is required" and "a paid plan is not required" are both event facts, both unverifiable
    from here with `luma.com` blocked by the sandbox egress policy, and getting it wrong either
    strands someone at 09:30 on the day or invents a cost. One line from him closes it on the
    programme page and the event page together.

26. `todo` **(needs Drummond, a hero-layout call)** - **every event page prints its own
    heading twice.** The hero eyebrow is built as `programme name - cohort` and the `h1` is
    the event title, and since 17 Oct all five event titles follow the same convention, so
    the two strings are now identical on all five: "THE OXFORD AGENTIC CODING BOOTCAMP -
    COHORT 1" sits directly above "The Oxford Agentic Coding Bootcamp - Cohort 1". A screen
    reader reads the day's name twice before reaching the promise, and the hero spends a
    line saying nothing new. The event **cards** already solve this - programme name as the
    eyebrow, "Cohort 1" as the heading - so the fix is to borrow that split on the event
    page. **The loop will not do it**: it changes the first thing a buyer sees on the page
    that takes the booking, which is a layout call on the conversion journey. One line from
    him either way.

27. `todo` **(needs Drummond, two event facts only he has)** - **is lunch provided on the
    Second Brain and Coding days, and should either page say anything about getting there?**
    "Is lunch included?" is published on exactly one page of the whole site, the Agentic
    programme page, and "Lunch and refreshments are included" sits in `assurances` on the
    Agentic event pages. The **Second Brain** and **Coding** lines say nothing about food on
    any page. The 18 Oct travel probe found the field answering this straight off booking
    pages - a council course naming a sandwich lunch, a Manchester one listing "Lunch, Snacks
    and beverages", a London agenda printing a 12:00 lunch break - and both workshop probes
    closed by telling the reader to go and ask the provider. **The loop will not write it**:
    whether lunch is laid on at the Pitt Rivers Museum on 21 October, or on the coding day at
    Worcester College, is an event fact, and `luma.com` does not resolve from the sandbox.
    The same cycle declined **travel detail** on the same rule: nearest station, walking time,
    parking and Park & Ride are facts about the world that an invented sentence gets wrong,
    and the street and postcode are already on every event page. If he wants a "getting here"
    line, it needs to come from him. One line closes the lunch half across four pages.

28. `todo` **(needs Drummond, two one-character edits he has to want)** - **the two unlisted
    voice pages are the only pages left with a typewriter apostrophe.** The 18 Oct sweep took
    the indexable site from 46 straight marks to 0; `/find-your-bootcamp/` keeps three
    ("Drummond's pick for you", "anyone's personal details") and `/office-hours/` one ("An AI
    in Drummond's cloned voice"). The loop did not fix them because STATE.md records that it
    leaves those pages unchanged, and that is a settled decision rather than an oversight. The
    build-time warning added in the same cycle skips them too, since it only reads indexable
    pages, so nothing will nag about this. One word from him and the loop closes it in a line.

30. `todo` **(needs Drummond, a component call)** - **no FAQ answer anywhere on the site can
    carry a link.** `src/components/Faq.astro` renders each answer as escaped plain text
    (`<p>{faq.a}</p>`), so the 100-odd answers across 9 `FAQPage` nodes are the one body of copy on
    this site with no internal links in it. It cost something measurable on 18 Oct: the claim "the
    ones that surfaced in the room were lead generation, internal reporting and marketing content"
    is published in the **"What did people in Cohort 1 actually build?"** answer on both Cohort 2’s
    and Cohort 3’s pages - the pages that take the booking - and neither could be pointed at the
    page that evidences it, while the same sentence in a guide could be and was. **The loop will not
    do it**: allowing markup in answers changes how every answer on the site renders and what goes
    into the JSON-LD `acceptedAnswer.text`, on the conversion path, and it needs a decision about
    whether answers become markdown or a narrow allowlist. One line from him either way.

29. `todo` **(needs Drummond, one word about a named real person)** - **the site gives
    Jonathan Waddingham two different former employers.** His team profile says he is "an
    independent product consultant and the former Chief Product Officer at **Lightful**";
    the Coding Bootcamp's "Who runs it?" answer, on both its programme and its booking page,
    says "Jonathan Waddingham (**CPO, ex-JustGiving**)". Both can be true read charitably -
    CPO at one, earlier career at the other - but "CPO, ex-JustGiving" reads to most people,
    and to an answer engine, as CPO *of* JustGiving. The 17 Oct probe that put Josh Lawman
    back on the roster is why this is worth a word rather than a shrug: a misattributed role
    for a named real person is the error class this site has already been bitten by. **The
    loop will not resolve it**: it cannot check either employment history from here, and
    guessing between two published claims about someone's career is worse than asking. This
    cycle's new answer on the Agentic pages deliberately names him as "product consultant"
    only, which is what `src/content/team/` publishes and what `/team/` shows, so it adds no
    third version. One word from him fixes whichever of the two is wrong.

31. `todo` **(needs Drummond, a consent-UI call)** - **the cookie banner's buttons are cut
    off at large text.** Measured 20 Oct with the browser default font at 24px: at a 320px
    viewport the "Accept" button reaches `right: 369` in a 320px window, and at 32px it
    reaches 491 in a 375px window, so on a narrow phone a visitor who has enlarged their
    text cannot see the whole of either control on the one panel that gates the site. The
    banner is `position: fixed`, so it clips silently without adding to the page's own
    scroll width, which is why the overflow sweep in the same cycle scored those pages 0.
    **The loop will not touch it**: it is the consent surface, and changes affecting
    tracking or consent are his call, not a cycle's. The fix is almost certainly the same
    shape as the header's - let `.consent__inner` and `.consent__actions` wrap - and it is a
    few minutes once he says yes.

32. `todo` **(needs Drummond, a brand-typography call)** - **the wordmark alone exceeds a
    phone viewport at 200% text.** `.wordmark__text` is `font-size: 1.3rem` with
    `white-space: nowrap`, so at a 32px browser default it measures 266px and the lockup
    338px, against a 375px window. The header now wraps, so nothing is lost and the page no
    longer scrolls sideways because of it, but the brand line itself is wider than the
    screen. Capping its growth (a `clamp`, or letting it wrap) would hold it inside the
    viewport. **The loop will not do it**: the wordmark is Drummond's Brand Guide lockup and
    the design tokens and typefaces are law. Same class of call as the bronze contrast
    token (backlog 21). Not urgent - 200% is a far less common setting than the 150% this
    cycle fixed.

33. `done` 20 Oct 2026 (20:00 cycle) - **one inline `<code>` string still overflows at 320px
    with 150% text.** `Clients/Acme/Pricing` in `/guides/second-brain-for-ai-vs-note-taking/`
    measured 325px in a 320px window and set the page's own minimum width. Fixed with
    `overflow-wrap: anywhere` on `code` in `global.css`. The check the item asked for was
    done first: the whole site has exactly **five** inline code spans across three pages,
    and no `<pre>`, `<kbd>` or `<samp>` anywhere, so there is no code block for the rule to
    reach. The break lands mid-segment (`Clients/Acme/Pr` + `icing`), which is the safe
    outcome the item was worried about - a break after a slash is the one that reads as part
    of the path, and `anywhere` does not produce one here.

34. `done` 21 Oct 2026 (08:00 cycle) - **the `#` heading anchor was the last thing
    overflowing at 320px with 150% text, on two guides.** Fixed with `display: inline-block`
    on `.heading-anchor` in `global.css` - one declaration. The script appends the anchor
    straight after the heading text with no space between them, so as an inline box there was
    no point at which the line could break and the `#` sat wherever the last word ended, even
    past the right edge. An atomic inline can be moved to the next line, and is only moved
    when it will not otherwise fit. The three states the item asked to be checked all hold:
    hover, `:focus-visible` and `[data-copied]` (which grows the box to 95.8px at 375px and
    110.6px at 1280px for its " copied" label, with no overflow in either). Screenshots of the
    visible anchor at 375px and 1280px are **byte-identical** before and after, so nothing
    about the rendering moved; the only layout change anywhere is one heading per page gaining
    a line at 320px/24px, where the alternative was the page moving 21px sideways. The full
    sweep that found this item now reads **0px on all 55 indexable pages at 320px and 375px,
    at both a 16px and a 24px browser default** - the first time every combination has been
    clean. (Original diagnosis, kept: measured 20 Oct across the same grid,
    `/guides/agentic-ai-glossary/` +21px and `/guides/how-to-choose-your-first-agentic-task/`
    +1px, both at 320px/24px only, both caused by `<a class="heading-anchor">#</a>` appended
    inside an `h2`/`h3` with `margin-inline-start: 0.4em`.)

35. `todo` **(needs Drummond, a call-to-action decision)** - **the Outcomes page is the
    only page on the site that ends in nothing.** `/testimonials/` sits in the primary
    nav, is the page a buyer opens to check that real people have said real things, and
    once it has quotes on it there is no link out of it at all: the four cards, then the
    footer. Its own empty state does better - "See the events ->" - and every other page
    on the site closes with a call to action (the homepage and event pages with a booking
    band, programme pages with a booking band, guides with one programme link). So the
    page converts a visitor's belief into nothing, at the moment the belief is strongest.
    **The loop will not do it**: adding a call to action to a nav-level page that has none
    is a new call to action, which the loop's own rules put on Drummond. The cheapest
    version is the line the empty state already uses, under the quotes; the better one
    probably names the next cohort. One line from him either way. (Found 21 Oct 2026 in
    the 09:00 cycle, alongside the "dated" claim that cycle fixed.)
36. `todo` **(needs Drummond, one fact only he has)** - **is there a second Second Brain
    cohort?** Cohort 1 ran on 21 Oct 2026 and the 20:00 cycle moved every sentence that
    called it upcoming into the past tense. The programme now has no date, so
    `/bootcamps/second-brain-bootcamp/` and the Cohort 1 event page both fall back to the
    template's "Dates for the next cohort are being confirmed" plus the notify form, which
    is honest and is as far as the loop can go. Two things follow and both are his: whether
    a date exists to publish, and - if one does not for a while - whether that line should
    keep saying "being confirmed". Four Second Brain guides and the programme page now end
    on a cohort nobody can book.
37. `todo` - **the Second Brain Cohort 1 FAQ block still answers a buyer, not a reader of a
    past page.** The 20:00 cycle on 21 Oct fixed only what had become false: the capsule and
    summary tense, "Registration is open", "Book directly on this page", and the invoice
    answer's pointer to a booking form. Left standing, because they are odd rather than
    untrue: "What should I bring?", "Can I install software on my work laptop?" ("worth
    checking before you book") and "What if I cannot make the date?". Cohort 2's own page is
    the precedent and the pace - it was cut from seven questions to three on 23 Sept, a week
    after the day ran, once there was something true to say about what happened. Do the same
    here in about a week, and only with outcomes in hand. Do not invent any.
38. `killed` 22 Oct 2026 (02:00 cycle), by the second phrasing it asked for - **do not
    re-pitch the legal vertical without new evidence.** The product gap is real and repeated:
    *"I found no one-day agentic AI workshop aimed specifically at UK law firms"*. But the
    **field is not winnable** - the Law Society holds two of the first ten results on its own
    subject ("The future of agentic AI in legal practice", "Building your legal team's AI
    skill set") with Thomson Reuters beside it, which is the rule's own institutional-publisher
    case and the shape that killed charities on 16 Oct. **Converting is weaker than it looks**:
    the law-specific training that exists is in-house and sold to firms (Astranti's half and
    full days, learn-ai.io's half-day for up to 20 fee-earners framed on SRA and UK GDPR), not
    cohort seats. **And the honest answer is one this site cannot write**: the published
    confidentiality test - a task you would be comfortable describing to an external supplier -
    is a real answer for a finance extract and a thin one for privileged material, and nothing
    here can speak to privilege or SRA duties without inventing. With operations already closed
    on 21 Oct, the vertical seam finance opened is worked out. Original diagnosis kept below.

38a. (the original item, kept for the record) **the legal vertical is the strongest untried content candidate in the log.**
    Probed 21 Oct (20:00 cycle): *"agentic AI training for law firms UK hands-on one day
    workshop"* returned no page of ours and the engine said *"I found no UK one-day hands-on
    course that is clearly labelled agentic AI for law firms"*, naming its own near misses -
    a London taster of unstated duration, a morning session it suspects is US, a one-hour
    talk inside a vendor's London event, and aiawareness.ai's one-day courses, which it
    notes are ChatGPT prompting and *"neither is framed around agents"*. That is the same
    shape as the finance gap the 14:00 cycle acted on, one vertical over, and the site has
    `agentic-ai-for-finance-teams` and `agentic-ai-for-consultants` but nothing for legal.
    **Probe a second phrasing before writing anything**, exactly as finance was. Weigh the
    confidentiality angle carefully: a law firm's material is privileged, and the honest
    answer is the published one (bring what you would be comfortable describing to an
    external supplier), not a new claim. The operations vertical was probed the same cycle
    and is NOT the same gap - BrainStation London and Columbus both run full-day in-person
    agent courses - so do not write it on the strength of the finance result.

39. `todo` (loop-actionable, found 22 Oct 2026 in the 14:00 cycle) - **`/testimonials/` still
    carries no `ItemList`, which is the gap `collectionPageSchema` was written to close.** The
    helper's own comment says it was shared because "`/bootcamps/`, `/team/` and
    `/testimonials/` - three pages that are just as much listings - carried no `ItemList` at
    all". Two of the three were then wired to it; `/testimonials/` never was. Measured on the
    built site today: `/bootcamps/`, `/team/`, `/guides/` and `/events/` each emit a
    `CollectionPage` with an `ItemList`, and `/testimonials/` emits only `WebPage` plus the
    breadcrumb. **Weigh before doing it**: the things it lists are quotes, not pages with URLs,
    so an `ItemList` of them would be an entity list rather than a list of links, and `Review`
    markup is explicitly NOT the answer - self-serving reviews about one's own organisation are
    what Google asks sites not to publish, and the loop should not. Possibly the honest version
    is no `ItemList` at all and a line in this ledger saying so, which is why it is a backlog
    item rather than a cycle.

40. `done` 23 Oct 2026 (14:00 cycle) - **the homepage publishes no machine-readable event
    data.** Its own test - re-probe once `/events/` has been recrawled - was answered from the
    other direction. A search restricted to the domain returns the same three URLs whatever is
    asked (`/` and two guides), so `/events/` is not in the index to be re-read, which is why
    its 21 Oct fix moved nothing, and the homepage is the only page the engine holds that could
    answer a date question. It now carries an `EducationEvent` per upcoming cohort under the
    `@id` that cohort's own page publishes. Original diagnosis kept below. Its JSON-LD is `Organization`, `WebSite`, `WebPage`,
    `Person`, `FAQPage` and nothing else, while the page itself - and the header and footer of
    all 63 pages - names the next cohort and its date ("Next Bootcamp - 19 Nov 2026"). It is
    the highest-ranking page the site has, and on the two probes of 22 Oct an engine asked for
    the next cohort date by name and answered off a third party's July listing. `/events/` was
    the sharper case and was done first this cycle, because its whole content is the dated list
    and the fix needed no new facts. Whether the homepage should carry the same two upcoming
    cohorts as `EducationEvent` under their existing `@id`s is the same judgement one page
    over: the argument for is that it is where engines land, the argument against is that the
    homepage's primary entity is the Organization and events are not its main content. Re-probe
    once `/events/` has been recrawled before deciding - if the index fix moves anything, that
    is the evidence; if it does not, adding more of the same to the homepage will not either.

41. `todo` (loop-actionable, found 22 Oct 2026 in the 20:00 cycle) - **the third IndexNow
    under-submission, and the only one that cannot be fixed with a static map.** Measured the
    same way as the two this cycle shipped: changing one guide's `title` and rebuilding moves
    **6 sitemap pages** - the guide itself, `/guides/`, and the **4 sibling guides whose "More
    guides" block offers it** - and the ping script submits 2. The events and programmes cases
    were fixable because their blast radius follows from frontmatter (`relatedProgrammes`) or is
    simply the whole site. This one does not: which four siblings offer a guide is decided by the
    deterministic greedy pass in `src/pages/guides/[...slug].astro`, including the FLOOR clause
    that lets an under-offered guide jump the queue, and reimplementing that inside
    `scripts/indexnow-ping.mjs` would be a second copy of a non-trivial algorithm that will drift
    from the first. **The shape of the right fix**: have the build emit the sibling mapping it
    already computes (a small JSON beside the sitemap in `dist/`) and have the ping script read
    it, which also makes `/guides/`-adjacent changes exact rather than guessed. Smaller than it
    sounds, but it is a build-output change rather than a script change, so it was not folded
    into this cycle. Until then a guide edit under-submits by four pages, which is the mildest of
    the three by a wide margin - the pages that miss the hint are siblings whose only change is
    four words of link text.
    **Confirmed on a real push, 26 Oct 2026 (01:00 cycle).** The guide-title change that cycle
    moved 7 sitemap pages and `--dry-run` submitted 3, so the four siblings printing the retitled
    guide got no hint - exactly the predicted shape, now measured on a change that actually
    shipped rather than on a test edit.
    **DOWNGRADED to `wontfix-for-now` on 26 Oct 2026 (13:00 cycle), on its own numbers.**
    Picked up as this cycle's candidate, scoped, and put back down. What the fix buys is an
    IndexNow hint for four pages whose **only** change is four words of link text in a "More
    guides" block - the item says so itself, "the mildest of the three by a wide margin". What
    it costs is a new build output plus plumbing to get it to the ping job, which runs
    `actions/checkout` with `fetch-depth: 2` and **no `npm ci` and no build**, so the map has
    to travel either as a public file at the site root (a URL with no visitor purpose, to hint
    link-text changes) or as a workflow artifact between jobs. Neither is wrong; both are
    mechanism bought for approximately no SEO value, on a site whose measured constraint is
    crawl budget and external links (2b). Leave it. Revisit only if a cycle ever has evidence
    that a sibling's link text failing to be recrawled cost something.

42. `todo` **(needs Drummond, a copy call on the booking path)** - **should the booking pages say
    in words that this is not a University of Oxford course?** The 08:00 cycle on 23 Oct put the
    independence fact into `Organization.disambiguatingDescription`, so all 60 pages that carry
    the entity node now assert it machine-readably. In **visible copy** it is still on 3 pages of
    63 - the homepage FAQ, About and privacy - and on none of the five event pages, the four
    programme pages, `/events/`, `/bootcamps/` or any of the 32 guides. The same cycle's probes
    are the argument for closing that gap: a competitor was introduced to a buyer as *"a private
    provider that is not part of the University of Oxford"* while this bootcamp was described
    only by its host's Saïd Business School role. **The loop will not do it**: the event template
    carries his own 4 Aug instruction that "the programme page's one job is the booking path",
    and a line about what this is *not* on the page that takes the booking is a positioning call,
    not a cycle's. The cheapest version is the homepage FAQ's answer, reused verbatim, as one
    more entry in the event and programme FAQ blocks. One line from him either way.

43. `done` 24 Oct 2026 (08:00 cycle) - **the footer grows an empty
    fifth column at every desktop width, and it is what squeezed the contact address into two
    lines in the first place.** `.site-footer__grid` is
    `minmax(min(100%, 15rem), 1.6fr) repeat(auto-fit, minmax(min(100%, 9rem), 1fr))`, and
    `.site-footer__signup` sits in the same grid with `grid-column: 1 / -1`. `auto-fit` collapses
    a track only when nothing is placed in or spanning it, and the signup spans every one, so at
    1,100px and up the grid generates **five** tracks for **four** blocks. Measured: the three
    link columns are **176px at 1024px and 159px at 1440px** - wider viewport, narrower columns -
    and the fifth track plus its gap leaves 207px of dead space to the right of "Elsewhere" on
    all 63 pages. Prototyped in the browser this cycle: moving the signup out of the grid
    collapses the empty track and takes the columns to 204-206px, with the footer's height and
    every track below 1,100px **unchanged**. That is a DOM move in a component on every page
    rather than a declaration, so it was logged rather than folded into a cycle that was already
    changing the same file. The address defect it caused is fixed independently and does not wait
    on this.
    **Shipped 24 Oct 2026**: the band moved out of the grid, nested one level inside its own
    `.wrap` so the hairline stays on the content box rather than running into the gutter. The
    columns measure 191 / 206 / 204px at 1,100 / 1,280 / 1,440px, the footer's height is
    unchanged at every width, and the rendering is byte-identical at 1,024px and below.

44. `done` 24 Oct 2026 (13:00 cycle) - **the homepage is the one
    page an engine is demonstrably re-reading, and it is one of 15 URLs in the sitemap with no
    `lastmod` at all.** The 20:00 cycle fixed the opposite fault - five event URLs claiming the
    build time - and left this deliberately, because the config's reason for the omission is
    sound as far as it goes: `lastmod` is derived from a single content file's `updatedDate`,
    and `/`, `/about/`, `/bootcamps/`, `/events/`, `/guides/`, `/privacy/`, `/testimonials/` and
    the 8 team pages have no single file behind them. But the homepage is a special case on
    today's evidence: it is 1 of the 3 URLs this engine holds, everything the engine knows about
    the November cohorts it reads off that page, and its cached copy was measured at roughly four
    days old ("21 October ... only two days away" on 23 October). A truthful date is derivable -
    the homepage is composed from `src/lib/home.ts`, `HomeSections.astro` and the events
    collection, so the newest of (the two source files' last content change, the `updatedDate`s
    of the events it lists) is a real answer, and the same shape works for `/events/`,
    `/bootcamps/`, `/guides/` and `/team/`. **Weigh before doing it**: it means teaching
    `contentLastmod()` about composed pages, which is a genuinely new mechanism rather than a
    declaration, and getting it wrong reintroduces the fault just fixed - a derived date that
    moves when nothing a reader sees has moved is the same lie in a smarter costume. Do it only
    with the whole-site `dist` diff as the test, exactly as the 20:00 cycle measured, and never
    from a file mtime.
    **Taken up and put back down on 24 Oct (07:00 cycle), with a finding that narrows it.**
    The obvious derivation - the newest `updatedDate` among the upcoming cohorts the homepage
    lists - **can move backwards on exactly the change that matters**. On 24 Oct the set is
    Cohort 3 (`updatedDate` 18 Oct 13:12) and Coding Cohort 1 (18 Oct 08:23), so `/` would
    read 13:12. After 19 November, Cohort 3 leaves `isUpcoming` on the **daily scheduled
    rebuild with no commit behind it** (`cron: '17 3 * * *'`), the homepage visibly loses a
    card, and the derived date falls to 08:23 - earlier than the day before. A `lastmod` that
    goes backwards on a page that just changed is worse than no `lastmod`, and it is the
    23 Oct fault in the other direction. Whatever ships here has to survive a **time-triggered**
    change with no file edit behind it, which a max over frontmatter dates cannot. That is the
    hard part of this item and it was not visible when the item was written.
    **Shipped 24 Oct 2026 (13:00 cycle).** The hard part is answered by giving a passed event
    its `endDate` rather than an `updatedDate` nobody wrote: that is the moment its card left
    the page, it is true, and because `endDate` only ever joins the set the maximum cannot
    fall. `/` now reads 2026-10-23T13:14:11Z, the day its own markup last changed. Simulated
    forward: 18 Nov unchanged, 20 Nov moves to 19 Nov 17:00 (Cohort 3 passing, on the cron
    with no commit), 27 Nov to 26 Nov 17:00, March 2027 holds. Never earlier, never future.
    Only `/` was taken; `/events/`, `/bootcamps/`, `/guides/` and `/team/` are the same shape
    and stay unclaimed, because the homepage is the one with evidence behind it.

45. `done` 25 Oct 2026 (01:00 cycle) - **`coursePrerequisites`
    and `audience` are the two `Course` properties the probes keep asking for and the site
    still does not publish.** The 01:00 cycle drafted both from published copy and declined to
    ship them, correctly, on the grounds that they would land on programme pages no engine has
    ever returned. **That objection is now half answered**: as of this cycle the three `Course`
    nodes are also on `/`, which this engine does hold, so a property added to `courseSchema()`
    reaches the indexed page as well as the unindexed ones. The evidence for the properties
    themselves is unchanged and strong - *"I didn't find the course's prerequisites or a note
    on whether beginners are welcome"* (17 Oct), and the Coding Bootcamp probe on 24 Oct that
    inferred the opposite of what the site publishes. **Weigh before doing it**: unlike this
    cycle's change, it asserts something. Both strings have to come verbatim from published
    copy - the programme pages' own "Do I need to be able to code?" answer and `whoFor` - and
    the Coding Bootcamp's prerequisite is the one place the site is thinnest (backlog 25 is
    open on whether it needs a paid plan, which is his call). Do the Agentic and Second Brain
    lines from published copy if the Coding one has to wait.
    **Shipped 25 Oct 2026 (01:00 cycle), all three lines including the Coding one.** The paid-plan
    question did not have to be answered to ship it: the Coding Bootcamp's published prerequisite
    is a laptop you can install software on, and backlog 25 is about a subscription, which the
    string does not mention. `audience` is the published `whoFor` list, unchanged and verbatim.
    `coursePrerequisites` is a new `prerequisites` field on the programme collection, schema-only,
    carrying one rule: every clause must restate that page's own "Do I need to be technical?" and
    "What do I need to bring?" answers. Checked clause by clause against the rendered page - 11 of
    11 found in visible text - because structured data a reader cannot verify on the page is a
    claim invented for machines.

46. `done` 26 Oct 2026 (08:00 cycle) - **the footer puts
    "Elsewhere" alone on a second row between 700 and 820px.** Shipped: the band is
    657-865px measured to the pixel, not 700-820, and the fix is not the narrower floor
    this item guessed at - that would have squeezed the link columns to about 91px and
    made the cohort titles wrap five deep. Holding the two-column form through the band
    instead costs 42px of footer height and leaves both rows full. Detail in the Shipped
    entry for this cycle. Original diagnosis kept below. Measured across fourteen
    widths on the built site: `.site-footer__grid` resolves to one column up to 480px, a
    tidy 2x2 at 600-640px, **three tracks with the fourth block wrapping underneath at
    700-820px**, and four across from 900px up. The 700-820 band is the only untidy one -
    "Elsewhere" sits under the entity block with the width of two columns of dead space
    beside it, which is the same shape of fault the 24 Oct cycle fixed at the other end of
    the range. It is cosmetic rather than broken, and the honest fix is probably a narrower
    `minmax` floor on the link tracks (9rem today) so four fit sooner, measured the same
    way. Not folded into this cycle, which was already changing the footer's conditions.


47. `todo` **(needs Drummond, a copy call on the homepage, and a second thing only he can do)** -
    **the homepage stopped answering the affiliation question today, and two probes the same
    evening show it is the one question the site cannot afford to be silent on.** Commit
    `ff3726f`, pushed 15:56 GMT on 26 Oct by the content and design loop, replaced the homepage
    FAQ entry *"Is Oxford Agentic affiliated with the University of Oxford?"* / *"No. Oxford
    Agentic is independent - no affiliation with the University of Oxford, its colleges, or any
    other institution. We hire the city's rooms ... and that is the whole relationship."* with
    *"Which organisations is Oxford Agentic affiliated to?"* / *"Oxford Agentic currently
    operates as an independent organisation."*
    - **Nothing in the new wording is untrue, and this loop did not revert it.** Rewriting
      another loop's three-hour-old copy is not a cycle's call, and the item is here rather than
      in a commit for that reason.
    - **What it costs, measured in a browser at 375 and 1280px.** The rendered homepage now
      contains the string "University of Oxford" **zero** times. The single occurrence left in
      `dist/index.html` is inside `Organization.disambiguatingDescription` in the JSON-LD, which
      no reader sees. The `FAQPage` node - the one node an engine lifts verbatim, on the page
      engines actually land on - no longer names the institution the disambiguation exists to
      separate this company from, and the question string no longer matches the shape a buyer
      types. Visible copy carrying the phrase went from 3 pages of 63 to 2, `/about/` and
      `/privacy/`, neither of which a buyer weighing a day opens.
    - **`site.config.ts` now cites a source that no longer says it.** The comment above
      `disambiguation` names the homepage FAQ as the place the site "answers the question
      outright" and takes two of its four clauses from that answer verbatim, including "we hire
      the city's rooms ... and that is the whole relationship". Whatever is decided, those two
      should end up agreeing again.
    - **The probes are in `seo-data/geo-citations.md` under 26 Oct 19:00.** Two phrasings, neither
      returning a page of ours, the second with our own domain in the query: *"The search didn't
      surface oxfordagentic.com itself, so I couldn't confirm ... whether it describes the
      bootcamp as independent of the University"*, and *"The listings also don't describe it as
      independent. That remains an inference."* Both answered off two Luma pages, `allai.events`
      and `nobleprog.co.uk`, and the first then set out Saïd Business School's own four-week
      online programme at £1,500 with "an official University of Oxford Certificate of
      Completion" directly after ours.
    - **The second thing, and it may matter more: the stale Luma pages.** Those same two answers
      took from them a 21 July date, **"tickets from $275"**, two venues the engine could not
      reconcile, **Josh Lawman** on the roster (removed 17 August) and a co-host placed at "the
      AI Centre for Business", which this site does not publish. Retiring or updating the retired
      Luma listings is his account and his call, and it is the standing review-list item now with
      its sharpest evidence.
    - **What would settle the first half in one line from him:** whether the homepage FAQ should
      name the University of Oxford again. If yes, the loop restores a question and answer that
      do, in his wording or the old one. If no, it leaves it and stops re-measuring this.


## Shipped

_(dated, newest first — filled by the loop)_

- **2026-10-26 (19:00 cycle) - NO SITE CHANGE. The cycle went looking for an on-page improvement,
  found none, and found something else: the affiliation question is answered entirely off stale
  third-party Luma pages, and the homepage stopped answering it three hours earlier.** Nothing
  under `src/`, `public/` or `scripts/` moved and `dist` is byte-identical to the baseline build.
  What ships is the evidence, in `seo-data/geo-citations.md` and backlog 47, because a fresh cloud
  checkout has no memory of a diff it did not make.
  - **The finding.** Two phrasings of the affiliation question, run as GEO probes. Neither
    returned a page of this site; the second had `oxfordagentic.com` in the query and the engine
    still said *"The search didn't surface oxfordagentic.com itself, so I couldn't confirm ...
    whether it describes the bootcamp as independent of the University"*, and *"The listings also
    don't describe it as independent. That remains an inference."* Both were answered off
    `luma.com/oxfordagentic2` (the **passed** 16 September day), `luma.com/k7c2rm5s`,
    `allai.events` and `nobleprog.co.uk`. The first then described Saïd Business School's own
    four-week online programme, **£1,500, with "an official University of Oxford Certificate of
    Completion"**, directly after ours. That is the adjacency `disambiguation` was written for,
    landing on the one question where this brand's own name does the damage.
  - **What those stale listings are teaching an engine**, none of it from this site: a 21 July
    date, **"tickets from $275"**, two venues it could not reconcile, **Josh Lawman** on the
    roster (removed 17 August) and a co-host at "the AI Centre for Business". The standing
    review-list item about our retired Luma pages outranking the live one now has its sharpest
    evidence, and it is his account to fix.
  - **And the homepage got quieter on it today.** Commit `ff3726f`, 15:56 GMT, from the content
    and design loop, replaced *"Is Oxford Agentic affiliated with the University of Oxford?"* and
    its four-sentence answer with *"Which organisations is Oxford Agentic affiliated to?"* /
    *"Oxford Agentic currently operates as an independent organisation."* Nothing in it is untrue
    and **this loop did not revert it** - three-hour-old copy from another loop is not a cycle's
    to rewrite. Measured in a browser at 375 and 1280px: the rendered homepage now contains
    "University of Oxford" **zero** times, the one occurrence left in `dist/index.html` being
    inside the JSON-LD `disambiguatingDescription`. Visible copy carrying the phrase went from 3
    pages of 63 to 2. `site.config.ts` still names that FAQ as the place the site answers the
    question outright and quotes two of its clauses verbatim, so the two now disagree. Backlog 47.
  - **What was checked and found clean, before concluding there was nothing to ship.** The two
    named candidates in the standing brief are both already closed: `scripts/indexnow-ping.mjs`
    maps `src/lib/home.ts` to `/` alone (line 109), and every sentence naming a passed cohort as
    upcoming is already in the past tense across guides, event files and programme pages. A whole
    built-site audit added nothing: **0** of 55 sitemap pages missing `og:image` or
    `twitter:card`, **0** `<img>` without width and height, 2 external links without `rel` and
    both are arXiv citations that should be followed. Past events' `Offer` nodes correctly omit
    `availability` - checked against the reasoning in `src/lib/schema.ts`, which retired a
    SoldOut inference on purpose. Cohort 2's `assurances` still read as booking copy, but the
    event template renders them only in the not-past branch, so they reach no page and no feed:
    dead data, not a defect. Extending `lastmod` to `/events/`, `/guides/`, `/bootcamps/` and
    `/team/` (left unclaimed by backlog 44) was scoped and declined: each needs its own
    hand-maintained copy constant, four more things to forget, to help hub pages that are already
    the best-crawled on the site.
  - **A measurement worth keeping: `/testimonials/` has zero inbound internal links from any
    page's `<main>`.** It is in the primary nav, so discovery and link flow are fine, but no
    page's body ever points a reader at the proof. Backlog 35 has the page's missing way out;
    this is the same page's missing way in. Not acted on - a body link into the proof page from
    conversion copy is the kind of call backlog 35 already puts with him.
  - **Checks, on an unchanged tree.** `npm ci` and `npm run build` clean: 61 pages built, 63
    checked, 3,094 internal links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and
    descriptions unique, no SEO warnings. The 11 outbound warnings are the sandbox egress policy,
    unchanged. Headless Chromium confirmed working and used on `/` at 375 and 1280px: 200, 0px
    horizontal overflow, one `h1`, correct self-canonical, no robots meta, and the
    "University of Oxford" count taken from `document.body.innerText` at both widths.
  - **Production state from the Actions API.** Deploy run **304 succeeded on `ff3726f`**, the
    `main` HEAD this cycle started from, with CI run 289 green beside it and nothing queued; it
    finished at 15:58 GMT, three hours before this cycle began. `oxfordagentic.com` answers **403
    on CONNECT** from this sandbox and does not resolve for WebFetch, so `build.txt` could not be
    read and the Actions API stood in for it, as on every cycle since 22 October. **No Luma page
    was read and no event fact was read or changed** - `luma.com` is blocked by the same policy,
    which is also why the stale-listing finding above is reported rather than acted on.
  - **Search Console: unavailable from the cloud.** No export newer than the 24 August baseline in
    `seo-data/`, and no API credentials in the repo.
  - **Off-page: no new contactable lead.** Six probes returned tool-pricing blogs, US universities
    and competitors; `innovationvisual.com` held five of ten on the takeaways question, as it did
    on the away-day question at 13:00. Everything citable was already on the review list, so
    nothing was added to it.
  - **No guide. 0 of 3 for the week of 26 Oct - 1 Nov**, the allowance deliberately unspent for
    the fifteenth cycle running. Four buyer questions were probed for a topic and none passed:
    paid-plan prerequisites is a Coding Bootcamp fact only Drummond has (backlog 25); takeaways,
    group-size and the six-month-obsolescence objection are all already answered on this site -
    the last one in a three-question block in `scout-drafter-reviewer-pattern`, which is thorough
    and well linked. No Q&A block either, for the same reason: a refresh needs a gap, and there
    was not one.

- **2026-10-26 (13:00 cycle) - NO SITE CHANGE. The loop has been reasoning from a diagnosis
  its own instrument cannot produce, and this cycle proves it and stops it.** Not one file
  under `src/`, `public/` or `scripts/` moved; `dist` is byte-identical to the baseline build.
  What shipped is the correction, in `seo-data/geo-citations.md` and in backlog 2b and 41
  below, because a fresh cloud checkout has no memory and an uncommitted finding is a finding
  the next cycle re-derives or, worse, does not.
  - **The claim that was retired.** Since 22 October this log has carried, as its "standing
    reading", that *a domain-restricted search returns the same three URLs whatever is asked,
    so the engine holds only three pages of this site*. Three probes written to test it:
    an **exact-phrase** query for a string that exists on exactly one page of ours
    (`"Whose morning does the task eat"`, on `/guides/who-should-take-the-seat/`) returned
    **the same three URLs and not that page**, with the engine saying it found no direct
    match; a second exact-phrase query had its **domain restriction ignored outright**, coming
    back with USPTO patents and arxiv; and a privacy query returned **one** URL, not three.
    A result set that does not move for an exact phrase it contains, from a tool that drops
    its own domain filter on the next call, is an artefact. It is not an index reading.
  - **The probe was made fair before it was believed.** The phrase is present in
    `dist/guides/who-should-take-the-seat/index.html`, the URL is in `sitemap-0.xml`, the page
    serves 200 with a correct self-canonical and no robots meta at 375 and 1280px, and it has
    been live since 19 October.
  - **What the loop actually owns on index coverage says the opposite.** The 24 August Search
    Console baseline in this repo reads **23 indexed, 16 not indexed, 35 discovered**, and its
    diagnosis is **crawl budget on a domain with zero external links**, "not fixable on-page",
    evidenced by `/bootcamps/oxford-agentic-bootcamp/` sitting on **257 inbound internal links
    and never once crawled**. Twenty-three pages and an off-page constraint, not three pages
    and an on-page one. Nothing has ever overturned that reading.
  - **What it cost.** Cycles 40, 44, 45 and the structured-data cycles of 25-26 October each
    leaned on the three-URL premise in their own justification ("the homepage is the only page
    the engine holds"; "`/events/` is not in the index to be re-read"). None of those changes
    is harmful and each stands on its own merits - correct `EducationEvent` and `Course` data
    is right whoever reads it - but they were **prioritised** against a premise that was not
    measured. Checking the instrument instead of adding to the pile is the whole of this cycle.
  - **Checks, on an unchanged tree.** `npm ci` and `npm run build` clean: 63 pages, 3,094
    internal links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and
    descriptions unique, no SEO warnings. The 11 outbound warnings are the sandbox egress
    policy, unchanged. A whole-site audit found **no on-page defect to fix**: 0 titles over 60
    characters, 0 missing or over-long descriptions, 0 missing canonicals, 0 noindex URLs in
    the sitemap across all 55 sitemap pages. The only pages at or below two inbound internal
    links are the **seven team profiles at one each**, which is backlog 24 and his call.
    Headless Chromium confirmed working and used on `/`, `/guides/who-should-take-the-seat/`
    and `/privacy/` at 375 and 1280px - 6 configurations, all clean: 200, 0px overflow, one
    `h1`, correct canonical.
  - **Homepage verified accurate against an engine that misreported it.** The cohort probe was
    answered correctly off our homepage (19 November Worcester College, Coding on 26 November)
    but added "Cohort 1 as 21 October". The rendered homepage says **St Anne's College, 21
    July 2026** for Cohort 1, and its JSON-LD carries only **upcoming** `hasCourseInstance`
    entries under the right `Course` `@id`s, with the Second Brain course correctly carrying
    none. The engine conflated two product lines. Nothing to fix on-site.
  - **Production state from the Actions API.** Deploy run **302 succeeded on `df621e8`**, the
    `main` HEAD this cycle started from, with CI run 287 green and nothing queued; it finished
    over four hours before this cycle began. `oxfordagentic.com` answers **403 on CONNECT**
    from this sandbox, so `build.txt` could not be read and the Actions API stood in for it,
    as on every cycle since 22 October. **No Luma page was read and no event fact was read or
    changed.** Search Console unavailable from the cloud: no export newer than the 24 August
    baseline, and no credentials in the repo.
  - **Off-page: no new contactable lead.** Every domain this cycle returned is a competitor or
    a vendor blog, and `createwith.com`, `allai.events`, `getclear.ca`, `nobleprog.co.uk` and
    `learnersink.com` are already on the review list. New competitor of note, recorded not
    acted on: **`innovationvisual.com`**, which holds six of nine on the away-day query with
    one page per city. **The ask that matters is unchanged and now better evidenced: one
    external link** (backlog 2b).
  - **No guide. 0 of 3 for the week of 26 Oct - 1 Nov**, the allowance deliberately unspent
    for the fourteenth cycle running. Away day declined on winnability and converting
    together; executive assistants declined on converting, against an engine admitting the
    product gap is real.

- **2026-10-26 (08:00 cycle) - the footer dropped "Elsewhere" onto a row of its own, with
  two columns of dead space beside it, right across tablet widths.** `.site-footer__grid`
  is one wide track plus `repeat(auto-fit, minmax(min(100%, 9rem), 1fr))`, and `auto-fit`
  takes on link tracks one at a time as the window grows. Between **657px and 865px** it
  fits exactly three for the footer's four blocks, so the fourth wrapped underneath and the
  two tracks beside it stood empty. 768px - a tablet in portrait, and one of this loop's own
  review widths - sits in the middle of that band, on all 63 pages. Backlog 46 found it on
  25 Oct and left it; this closes it.
  - **Measured to the pixel before anything was written.** Stepping the built site 1px at a
    time from 470px to 960px: one column to 480, a tidy 2x2 from **481**, three tracks with
    one block wrapped from **657**, four across from **866**. The ledger's "700-820" was the
    sampled band, not the real one.
  - **The fix this item proposed was tried first and rejected on its numbers.** A narrower
    `minmax` floor so four tracks fit sooner needs about **5.25rem** to reach 657px, which
    leaves the link columns at **91px** - narrow enough to wrap "The Oxford Agentic Coding
    Bootcamp - Cohort 1" five or six lines deep and make the footer *taller* than the fault
    it fixes. What shipped instead holds the two-column form - the same 2x2 that already runs
    from 481px - through to the width where all four fit. One `@media` block, one
    declaration, no token touched.
  - **Both bounds in the query are the measured flip points** (30.0625rem = 481px,
    54.0625rem = 865px), because neither can be read off the declarations above them: they
    fall out of the 15rem and 9rem floors, the `vw` gap and the `.wrap` padding together.
    Below 657px the rule writes out exactly what `auto-fit` already resolves to, so it changes
    nothing there, and at 866px it stops applying.
  - **`:has(> :nth-child(4))` guards it, and that is not decoration.** "Upcoming" is only
    rendered while a cohort is still to come (backlog 36 is the live case of that running
    out). With three blocks the three tracks are exactly right, and an unguarded rule would
    have made the same fault one block smaller. Simulated by removing that column in the
    browser: with three blocks the footer renders the old three-across at 700, 768 and 820px,
    unchanged. `:has()` was already in this file, on the "Upcoming" link rule.
  - **Measured whole-site: no page's markup moved.** All 61 HTML files differ from the
    baseline build by exactly one string, the stylesheet's hashed filename; with that
    substituted they are byte-identical. Every other file in `dist` - both sitemaps,
    `llms.txt`, `llms-full.txt`, `rss.xml`, `robots.txt`, every image and font - is
    byte-identical, correctly, since no content file changed and no `updatedDate` moved. The
    CSS bundle gains **195 bytes**, one rule, and nothing else in it changed.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions
    unique, no SEO warnings. `npm run check:flags` passes both the all-on and all-off builds.
    `astro check` reports the same **79** pre-existing implicit-`any` errors on the baseline
    and on this change, so none of them is new; the change is inside a `<style>` block and
    cannot reach TypeScript. The 11 outbound warnings are the sandbox egress policy and are
    identical on the baseline build.
  - **Inspected in headless Chromium, before against after.** 60 pages x 6 widths (320, 375,
    700, 768, 820, 1280) = **360 configurations, all clean**: 0px horizontal overflow, one
    `h1`, no missing `alt`, no unlabelled form control, no link or button without an
    accessible name, no duplicate element id, no skipped heading level, every page 200. The
    footer was screenshotted at 14 widths on both builds: identical at 320, 375, 480, 560,
    640, 866, 900, 1024, 1280 and 1440 (the handful of differing bytes at some of those are
    antialiasing jitter, confirmed by shooting the same build twice), and changed only at
    700, 768, 820 and 865, where it grows 41-42px and both rows fill. Footer state was also
    mapped every 4px from 320 to 1440 at three root font sizes; the whole diff against the
    baseline is **one line removed**, the three-column band. The enlarged-text overflow in
    that sweep is the wordmark (backlog 32), unchanged: 149 overflowing widths before, 149
    after.
  - **Keyboard.** All 13 footer tab stops at 768px take a visible focus ring and are scrolled
    into view. The back-to-top button appeared to cover "Apply for a place" in a screenshot;
    at the real page bottom it does not overlap it at 375, 700, 768 or 1280px, so there is
    nothing to log.
  - **Production could not be read and the Actions API stood in for it.** `oxfordagentic.com`,
    `www.` and `drummond1.github.io` all answer **403 on CONNECT** from this sandbox (the
    proxy's own failure log names the policy denial), so no page of the live site, no
    `build.txt` and no Luma page was fetched. Deploy run **300 succeeded on `90ac6af`**, the
    `main` HEAD this cycle started from, with CI run 286 green beside it and nothing queued.
    **No event fact was read or changed.** PR #1 and `feat/ceo-roundtable-demand-page` are the
    known-stale leftovers already on this ledger (backlog 20), not work in flight.
  - **No GEO probe and no guide this cycle.** The change is a layout fix in a shared
    component, with nothing to probe; today's guide allowance is deliberately unspent for the
    thirteenth cycle running.

- **2026-10-26 (07:00 cycle) - every guide said what it was about and gave the engine no way
  to know it meant the course.** `Article.about` named the programme as an anonymous `Thing`
  with a name and a URL and no `@id`, so all 32 guides pointed at `/bootcamps/<slug>/` as a
  string rather than at the `Course` node that page - and the homepage - already publish under
  `<url>#course`. It now emits `@type: Course` with that `@id`.
  - **Why this join and not another.** The GEO log's standing reading is an indexing one: a
    domain-restricted search returns the same three URLs whatever is asked - `/` and two guides
    - and dated questions get answered off third parties' expired Luma pages. The homepage
    carries all three `Course` nodes with their `hasCourseInstance` dates and venues (shipped
    25 Oct) and the `EducationEvent` per upcoming cohort (23 Oct). The guides carried a blank
    node pointing at a page the engine does not hold. A consumer holding a guide and the
    homepage - which is to say the only combination an engine actually has of this site - can
    now resolve the two to one course instead of two unrelated things, and read the next
    cohort's date off the join.
  - **Identity only.** Same class as the `@id` on `FAQPage` (25 Oct) and the `sameAs` on the
    event listing item (25 Oct). `name` and `url` are untouched and the `@id` is derived from
    the same path the node already carried, so nothing is asserted that the programme's own page
    does not already publish. Deliberately not done: adding the programme's `Course` or the
    cohort's `EducationEvent` as a full top-level node on every guide. The event is a card at
    the foot of an article, not the page's subject, and marking up 32 articles as event pages to
    chase a rich result is the kind of thing this ledger has declined before.
  - **Measured whole-site: exactly 32 files in `dist` differ, and they are exactly the 32
    guides.** All 31 other pages are byte-identical, as are both sitemaps, `llms.txt`,
    `llms-full.txt`, `rss.xml` and `robots.txt` - correctly, since no content file changed and
    no `updatedDate` moved. On all 32, the HTML outside the JSON-LD block is byte-identical, so
    nothing a reader sees moved. The JSON-LD diffed as data: node counts unchanged, no node
    added, removed or retyped, and the only changed property anywhere is `about` - 38 entries
    across 32 Article nodes, each gaining exactly one key. Every `@id` emitted equals that
    entry's own `url` plus `#course`, and the three distinct values are exactly the three the
    programme pages and the homepage publish.
  - **Checks.** `npm ci` then `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique,
    no SEO warnings. The 11 outbound warnings are the sandbox egress policy and are identical on
    the baseline build. Inspected in headless Chromium at 375 and 1280px on five guides,
    including the three an engine has been recorded citing and one per programme line - 10
    configurations, all clean: 0px overflow, one `h1`, JSON-LD parses with the new `about`
    present and its `url` matching a link visible on the page, correct canonical, no robots
    meta, no duplicate `@id` in the graph, no duplicate element id, no missing alt. The only 2
    console errors per page are googletagmanager `gtag.js` and `gtm.js`, blocked by the sandbox
    proxy, confirmed against the proxy's own failure log.
  - **IndexNow:** `--dry-run` submits all 55 sitemap URLs, because `src/lib/schema.ts` maps
    whole-site, where 32 pages moved. Over-submission, not under - the same call as the last
    seven cycles, and the opposite fault to backlog 41. The ping script was not run other than
    `--dry-run`; the deploy workflow runs the real thing, as always.
  - **GEO: four probes on two new axes, eight phrasings between them and the previous cycles,
    none cited, two declines.** *Preparing for the day* is winnable and the engine admitted the
    one thing it could not source is our whole proposition (*"Bring a real problem. This is my
    suggestion rather than a sourced one"*), but the searcher has already booked somebody's day,
    so it fails converting. *The marketing vertical* - the strongest untried one left - is dead
    on the institutional-publisher clause: **CIM holds two of nine on its own subject** with a
    one-day no-code agents course, and Anicca five more. Do not re-pitch either without new
    evidence. Production state from the Actions API: Deploy run 299 success on `2bd0bbc`, the
    current HEAD, nothing queued; it finished nearly six hours before this cycle began.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox and does not resolve for
    WebFetch, so `build.txt` could not be read and no Luma page was read; no event fact was read
    or changed. Search Console unavailable from the cloud; no export newer than the 24 August
    baseline and no API credentials in the repo. Off-page: **no new lead** - the four probes
    returned competitors and providers' own pages, and every aggregator in them is already on
    the review list or in `off-page-listings.md`.
  - **No guide: 0 of 3 for the week of 26 Oct - 1 Nov**, today's allowance deliberately unspent
    for the twelfth cycle running.

- **2026-10-26 (01:00 cycle) - the site's own buyer checklist asked nine questions about
  before and during the day, and none about after it. It now asks ten.**
  - **The evidence is a probe this cycle, and it is unusually direct.** *"what happens after a
    one-day AI workshop do you get follow-up support or materials"* returned no page of ours and
    closed with the engine's own instruction to the buyer: *"Before booking, ask the provider in
    writing what's included after the day, such as materials, how long support lasts, and
    whether there's a follow-up call."* It had found the answers scattered across providers' own
    pages - a prompt library on one, *"one week of Slack support"* on another, a *"30-minute
    follow-up call within seven calendar days"* on a third - and said plainly that *"The sources
    don't show whether follow-up is standard across the market."*
  - **The gap was in a page we already own.** `/guides/questions-to-ask-before-booking-ai-training/`
    is this site's buyer checklist, in the `choosing` category, and its nine questions covered
    what you will have running, whose work you build against, room size, the talk-to-build ratio,
    getting stuck, what to bring, who else is there, what the day leaves out, and the
    cancellation policy. Nine of nine are about before or during the day. The one thing the
    field itself tells buyers to ask about was missing. That is why this is a refresh and not a
    new guide: getclear.ca already holds the standalone version of that title at position 1, and
    a second page of ours on the same subject would compete with our own.
  - **What shipped.** A tenth section, "What do I get after the day, and for how long?", written
    to the guide's established form - what the honest answers sound like, including that "the day
    ends on the day" is a fair one - and separating the two halves buyers conflate: what you take
    away (yours, not inside the provider's account) and what happens when it breaks a fortnight
    later. Plus the title, `seoTitle`, `description` and the closing "all nine" moved to ten, and
    the one inbound anchor in `what-hands-on-ai-training-actually-means` with it.
  - **Our own answer in the worked "here are ours" paragraph uses only published facts**: you
    keep the workflow and a written recipe for rebuilding and extending it (Cohort 1's own
    `outcomes` line, and the same sentence in `how-to-choose-your-first-agentic-task`), and you
    leave with the group, their contact details and first notice of the next cohort (the Agentic
    programme page's "What happens after the day?", verbatim in substance so the two cannot
    drift). **Deliberately not written: any claim that there is or is not post-day support.**
    Both are facts the loop does not have, and asserting the absence of something is as much an
    invention as asserting it.
  - **The slug carries no number**, so the URL is unchanged and no redirect is needed. `seoTitle`
    measures 39 characters against the schema's 43; `description` 143 against 160; the capsule is
    untouched at 57 words and still true, because it names five of the questions and says "those
    five".
  - **Measured whole-site: 7 sitemap pages differ** - the guide, `/guides/`, and 5 siblings. Four
    of those five changed by exactly one string, the guide's title in their "More guides" block,
    verified programmatically: replacing "Ten" with "Nine" in each makes the file byte-identical
    to the baseline. The fifth is `what-hands-on-ai-training-actually-means`, whose one changed
    line is the anchor text. `llms.txt`, `llms-full.txt` and `rss.xml` carry the new title and
    description. **Exactly one `lastmod` moved** in `sitemap-0.xml`, the guide's own, because the
    sibling guides' `updatedDate` was deliberately left alone - a word of link text is not a
    revision, and `updatedDate` drives both the visible "Updated" byline and the sitemap date, so
    moving it would claim a revision that did not happen.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal links
    resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique, no SEO
    warnings. The 11 outbound warnings are the sandbox egress policy (`luma.com`, `linkedin.com`,
    `arxiv.org`, `ico.org.uk`, `elevenlabs.io`) and are identical on the baseline build.
    `astro check` is still not installed here and the repo has no `tsconfig.json`.
  - **Inspected in headless Chromium** at 375px and 1280px on all three pages whose visible text
    changed - **6 configurations, all clean**: 0px horizontal overflow, exactly one `h1`, JSON-LD
    parses with the `Article` node present, correct canonical, no `robots` meta, no duplicate
    element id, no image without alt, and **no "nine" anywhere in the rendered text of any page**.
    The new heading renders as the tenth `h2` in order, and the typographer produced curly marks
    for the apostrophe and the quoted "ongoing support", so the build's straight-apostrophe check
    stays silent. The only 2 console errors per page are `googletagmanager.com/gtag/js` and
    `/gtm.js`, blocked by the sandbox proxy, read off the failed requests.
  - **Backlog 41 confirmed on a real push, not a simulation.** `--dry-run` submits **3** URLs for
    this change set while **7** sitemap pages moved: the four siblings that print this guide's
    title get no hint. That is exactly the figure the 22 Oct measurement predicted. Same call as
    every cycle since - the fix is a build-emitted sibling map, not a second copy of the greedy
    pass. The ping script was **not** run other than `--dry-run`; the deploy workflow runs the
    real thing, as always.
  - **GEO: four probes, none cited.** Full table in `seo-data/geo-citations.md`. Three axes were
    probed for the first time - group booking, aftercare and the Second Brain how-to - and only
    aftercare came back open, which is what this cycle shipped against. **Twenty-eighth
    consecutive reading of the stale-listing harm**, and the second cycle running where a query
    carrying our own domain name cannot reach us: *"I'd check the official oxfordagentic.com page
    or the Luma ticket page directly to confirm the date and venue"*, with the 26 November date
    **unconfirmed by anything in the field**. New: **NobleProg holds four of nine results** on an
    Oxford coding-agent query, one page titled for AI coding assistants in Oxford - the first
    time one commercial trainer has occupied that product's geography at that density. Recorded,
    not acted on.
  - **Production state from the Actions API:** Deploy run 298 success on `d0c2cb5`, the current
    HEAD, nothing queued or in progress; it finished at 19:07 UTC, nearly six hours before this
    cycle began. **The whole egress policy is tighter than it was**: `oxfordagentic.com`,
    `luma.com` and general web hosts all answer 403 on CONNECT from this sandbox, so `build.txt`
    could not be read, no Luma page was read and no event fact was read or changed. Production
    state is taken from the runner, as on every cycle since 15 October.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **Off-page: one new lead, the first in several cycles.**
    `getclear.ca/guides/what-ai-workshop-should-deliver` is an editorial buyer's guide to
    one-day AI workshops that outranked every provider page on the aftercare question, and it
    names nobody of ours. Added to `outreach/review-list.md` as a possible mention route, with
    the caveat that the domain does not resolve from here so nothing about who runs it is
    checked. Nothing contacted. The standing Coding Bootcamp entry gained a fourth dated
    corroboration.
  - **No guide: 0 of 3 for the week of 26 Oct - 1 Nov, and today's allowance deliberately
    unspent for the eleventh cycle running.** The one open axis was answered by a section in a
    guide that already ranks, which is cheaper and more honest than a new page competing with it.

- **2026-10-25 (19:00 local cycle) - a team edit told the Bing family that `/team/` had
  changed, which it had not, and never named the profile page, which had. The fourth IndexNow
  under-submission, and the first where the hint went to the wrong URL entirely.**
  - **The defect.** `scripts/indexnow-ping.mjs` mapped `src/content/team/x.md` to `/team/`
    and nothing else - the script's own header comment said so in one line. All seven
    `/team/<slug>/` pages are in the sitemap, and each is the page that an edit to that
    person's file actually rebuilds.
  - **Measured on the built site, twice, on `nicolai-thomson.md`.** Editing the **body prose**
    moves **exactly one** file in `dist` - `team/nicolai-thomson/index.html` - and `/team/` is
    byte-identical, because the listing page renders the frontmatter `bio` and not the body. So
    the branch submitted one URL and it was **the wrong one**. Editing **frontmatter** (`role`)
    moves five files: the profile page and `/team/` (two sitemap URLs), plus `llms.txt`,
    `llms-full.txt` and `og/team--nicolai-thomson.png`, which are not sitemap URLs. In both
    cases the profile page moved and in neither was it hinted.
  - **Why it is worth a cycle.** These are the pages carrying the `Person` nodes that all 32
    guides point at as `author` and that the `Organization` node names as `founder`. The ledger
    calls entity triangulation the weakest part of this site's GEO position (backlog 2b, 19,
    24), so the one class of page whose edits were never hinted is the class where corroboration
    matters most. Bing feeds ChatGPT's web answers, which is why this script exists at all.
  - **The fix is one line plus its measurement.** The `team` branch now adds
    `https://<host>/team/<slug>/` when the file still has a `slug`, and keeps `/team/` for the
    frontmatter case. Telling a frontmatter change from a body change means parsing the file,
    and a hint for a page that did not move costs nothing - the script already submits the whole
    sitemap routinely. The header comment was corrected to match.
  - **Verified by `--dry-run`, which submits nothing** (it `process.exit(0)`s before the
    `fetch`). A team file now yields both URLs; a **deleted** team file yields `/team/` alone,
    with no crash and no invented URL, because `slugOf()` returns null for a file that is gone;
    a guide file is unchanged at two URLs; an `IMPROVEMENTS.md`-only push still correctly
    submits nothing. All seven team slugs were then resolved against `dist/sitemap-0.xml`:
    **7 of 7 present**, so the branch cannot emit a URL that is not in the sitemap.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique,
    no SEO warnings. `npm run check:flags` passes on both the all-on and all-off builds. The 11
    outbound warnings are the sandbox egress policy (`luma.com`, `linkedin.com`, `arxiv.org`,
    `ico.org.uk`) and are identical on the baseline build. `astro check` is still not installed
    here and the repo has no `tsconfig.json`.
  - **`dist` is byte-identical to the baseline build - 0 files differ.** Correct, and the point:
    this is a CI script, so no page, sitemap, `llms.txt`, `llms-full.txt`, `rss.xml` or
    `robots.txt` can move. **Inspected in headless Chromium anyway** at 375px and 1280px on
    `/team/` and two profile pages - 6 configurations, all clean: 0px overflow, one `h1`, JSON-LD
    parses, each profile carries its `Person` node, correct canonical, no `robots` meta, no
    duplicate element id, no image without alt. The only 2 console errors per page are
    `googletagmanager.com/gtag/js` and `/gtm.js`, blocked by the sandbox proxy, read off the
    failed requests. The ping script was **not** run other than `--dry-run`; the deploy workflow
    runs the real thing, as always.
  - **Still recorded and not fixed:** IndexNow maps `src/lib/schema.ts` and `content.config.ts`
    to the whole site, and a guide edit under-submits by four siblings (backlog 41). Same call
    as previous cycles.
  - **GEO: four probes, none cited.** Full table in `seo-data/geo-citations.md`. The sharpest
    reading the loop has logged, and it is an **indexing** reading: a probe carrying **our own
    domain name and programme name** returned no page of ours and closed *"To confirm the next
    date and venue, check the oxfordagentic.com site directly."* The engine named this site as
    the authority and could not retrieve it. Twenty-sixth and twenty-seventh consecutive
    readings of the stale-listing harm beside it - 21 July and 16 September dates, the
    Worcester / St Anne's contradiction, "5 Spots Remaining" as live availability, "$275" in the
    wrong currency, and the Thomson / Lawman roster contradiction. **This strengthens backlog 2
    (submit `sitemap-index.xml`, URL-Inspect, request indexing) and argues against another
    page.**
  - **Production state from the Actions API:** Deploy run 297 success on `5874676`, the current
    HEAD, nothing queued or in progress; it finished at 13:10 UTC, nearly six hours before this
    cycle began. `oxfordagentic.com` answers 403 on CONNECT from this sandbox and does not
    resolve for `WebFetch` either, so `build.txt` could not be read and production state is
    taken from the runner, as on every cycle since 15 October.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **Off-page: no new lead to contact.** The standing `allai.events` stale-listing entry gained
    a dated corroboration, the strongest one on the list: the domain-carrying probe above.
  - **No guide: 2 of 3 this week (19-25 Oct), today's allowance deliberately unspent for the
    tenth cycle running.** Two axes probed and both declined. "What does a one-day AI bootcamp
    cover, is it worth it" is **not winnable** - providers on their own courses plus LSBU and
    Exeter, the institutional-publisher shape - and the engine's verdict (*"will not make you
    capable of building or implementing AI"*) is already answered in a named section of
    `what-you-can-build-in-one-day-with-ai` since 20 October, so the gap is retrieval, not
    coverage. First-task choice is **not winnable** either - Salesforce Trailhead holds five of
    ten results in five locales - and `how-to-choose-your-first-agentic-task` answers it. Second
    cycle running for that one; do not re-pitch without new evidence. The week resets tomorrow.

- **2026-10-25 (13:00 local cycle) - 91 questions and answers across 9 pages, carrying this
  site's highest-stakes sentences, and the node holding them named no URL at all. The FAQ
  node now says which page it belongs to.**
  - **The defect, measured across all 63 built pages.** This site emits ten top-level node
    types. Nine of them say where they belong: `Organization`, `WebSite`, `WebPage`, `Person`,
    `Course` and `EducationEvent` by their `@id`; `Article` (32 of them) by `mainEntityOfPage`;
    `CollectionPage` (4) by `url` plus `isPartOf`; `BreadcrumbList` (55) by the absolute URLs
    inside its own `itemListElement`. **`FAQPage` was the exception, on all 9 pages that carry
    one.** Its entire key set was `@type` and `mainEntity`. No `@id`, no `url`, no `isPartOf`,
    no `mainEntityOfPage`, and no URL anywhere inside it.
  - **Why this node and not the others.** The FAQ answers are where this site states the facts
    answer engines keep getting wrong off third-party listings: that Oxford Agentic is not part
    of the University of Oxford, that the day assumes no code, which venue each cohort is in.
    Twenty-five consecutive GEO readings have an engine reciting a passed date, two colleges
    and a price in the wrong currency off two expired Luma pages. The site's own machine-
    readable answer to all of that travelled with nothing to say whose it was: lift the node
    out of the graph and it is 91 unattributed Q&A pairs.
  - **The fix is identity only, the same class as the `@id` and `url` every other node already
    carries.** `faqSchema()` takes the page's `path` and emits `@id: <url>#faq` and
    `isPartOf: { @id: <url>#webpage }`. Both values derive from the page's own canonical URL,
    and `#webpage` is the `@id` that page's own `WebPage` node already publishes, so the
    reference resolves inside the same graph. Three call sites pass the `path` they already
    hold (`index.astro`, `bootcamps/[slug].astro`, `events/[slug].astro`).
  - **The page deliberately stays a `WebPage`.** Adding `FAQPage` to the `WebPage` node's own
    `@type` and hanging the questions off it is the other canonical shape, and it is the wrong
    one here: it would claim the FAQ is the page's main content, which on none of these nine
    pages it is - the homepage's main content is the proposition, an event page's is the booking.
    A separate, identified node says what is true, which is that the page has an FAQ.
  - **Measured whole-site.** Exactly **9** files in `dist` differ, and they are exactly the 9
    that emit an `FAQPage`. All 54 other pages are byte-identical, as are both sitemaps,
    `llms.txt`, `llms-full.txt`, `rss.xml` and `robots.txt` - correctly, since no content file
    changed. On every one of the 9 the HTML **outside** the JSON-LD block is byte-identical, so
    nothing a reader sees moved. The JSON-LD diffed as data: node counts unchanged (9 on `/`,
    6 on each of the other eight), **exactly 18 properties added - two per page - with no node
    added, removed or otherwise altered and no other property changed anywhere.**
  - **Verified as data across all 63 pages.** Every `@id` equals that page's own `<link
    rel="canonical">` plus `#faq`; every `isPartOf` target resolves to a node present in the
    same graph and is that page's `#webpage`; all 9 `@id`s unique site-wide; no duplicate `@id`
    within any graph; all 91 questions preserved, each with its `acceptedAnswer`.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes (unchanged), titles and
    descriptions unique, no SEO warnings. `npm run check:flags` passes on both the all-on and
    all-off builds. The 11 outbound warnings are the sandbox egress policy and are identical on
    the baseline build. `astro check` is still not installed here and the repo has no
    `tsconfig.json`. The checker matches `node['@type'] === 'FAQPage'` as a string, which is
    the other reason the type was left alone.
  - **Inspected in headless Chromium** at 375px and 1280px on all 9 changed pages - **18
    configurations, all clean**: 0px horizontal overflow, exactly one `h1`, JSON-LD parses, the
    `FAQPage` carries its `@id` and its `isPartOf` resolves, **every one of the 91 questions
    found in the page's own rendered text**, correct canonical, no `robots` meta, no duplicate
    element id, no image without alt. The only 2 console errors per page are
    `googletagmanager.com/gtag/js` and `/gtm.js`, blocked by the sandbox proxy - read off the
    failed requests this time rather than assumed. Full-page screenshots kept at both widths.
  - **Checked and clean, so it is not re-derived: the Coding Bootcamp's internal links.** This
    cycle's two sharpest probes were about that product, so the guide corpus was measured
    against it. In-prose links from the 32 guides: Agentic Bootcamp 23, Second Brain 10,
    **Coding Bootcamp 4** (`relatedProgrammes`: 24 / 10 / 4). That looked like the 13 Oct orphan
    shape and is not. The four are exactly the four coding-adjacent guides
    (`why-the-code-an-agent-wrote-is-not-live`, `what-you-can-build-in-one-day-with-ai`,
    `claude-cowork-claude-code-or-codex`, `agentic-ai-glossary`); the other 28 are about
    agentic workflows and second brains. The nearest candidate,
    `ai-bootcamp-vs-course-vs-exec-education`, was read in full and **declined**: it compares
    exec education, online courses, bootcamps and doing it yourself, not our three bootcamps,
    and its closing line correctly names one as "our version of the third". The ratio reflects
    the corpus's subject matter, not a defect. Do not re-open it without a guide whose own
    subject calls for the link.
  - **Recorded and not fixed.** IndexNow maps `src/lib/schema.ts` to the whole site, so 55 URLs
    are hinted where 9 changed. Same call as the last five cycles: a change to `schema.ts`
    usually does rebuild every page, and a one-off exception for a file name would be worse
    than 55 hints nobody is harmed by. The ping script was not run by hand; the deploy workflow
    runs it, as always.
  - **GEO: five probes, none cited.** Full table in `seo-data/geo-citations.md`. The Coding
    Bootcamp was probed on its own subject for the first time, twice, and the field twice said
    it does not exist - *"I found no other UK one-day course for non-developers"* and *"I
    didn't find a one-day, in-person, beginner-friendly AI coding course in Oxford for November
    2026"* - while it is bookable for 26 November, 32 days out. Twenty-fifth consecutive
    reading of the stale-listing harm.
  - **Production state from the Actions API:** Deploy run 296 success on `1e03fdc`, the current
    HEAD, nothing queued or in progress; CI run 282 green on the same commit.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox, so `build.txt` could not be
    read and production state is taken from the runner, as on every cycle since 15 October.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **Off-page: no new lead.** The standing Coding Bootcamp coverage entry on the review list
    gained two dated lines, the second and third corroborations of the 24 Oct finding.
  - **No guide: 2 of 3 this week (19-25 Oct), today's allowance deliberately unspent for the
    ninth cycle running.** Three axes probed as candidates and three declined. The
    paid-subscription axis fails on **accuracy**, not winnability: the field answers it per
    listing, and our own answer for the Coding Bootcamp is backlog 25, a fact only Drummond
    has. Agent-versus-agentic-workflow is **not winnable** - nine of nine results are vendors
    on their own product, Workday four times, and they contradict each other. "Which task to
    automate first" is not winnable and `how-to-choose-your-first-agentic-task` already answers
    it. The week resets tomorrow.

- **2026-10-25 (09:00 local cycle) - the homepage asked for the same email address twice in
  the same words, once in its own band and again in the footer directly below it. The
  footer's copy of the ask now stands down on the page that already makes it.**
  - **The defect.** `NewsletterForm` is rendered twice on `/`: once inside the gold
    "Not ready to book?" band at the end of `HomeSections`, and again in the footer
    directly below it. Both are passed the same label, **"Hear about the next cohort
    first"**, and because `newsletter.endpoint` is still empty (backlog 1) both fall back to
    the same hardcoded sentence - *"Email hello@oxfordagentic.com and we will add you to the
    list for the next cohort."* Measured in the browser on the deployed build: the two
    labels sat **624px apart at 1280px, 729px at 768px and 1,033px at 375px**, with nothing
    between them but the end of the gold band and the footer's own columns. Two identical
    asks that close together read as a template fault rather than a second chance.
  - **It is the homepage only.** Every other page carries exactly one email capture, in the
    footer, which is what the footer's compact signup is for. `/` and its unindexed mirror
    `/home-photos/` are the two pages that render `HomeSections`, and therefore the only two
    that already have a dedicated capture band of their own.
  - **The fix is a condition, not a deletion.** `Footer.astro` takes a new `signup` prop
    (default `true`), `Base.astro` threads it through as `footerSignup`, and the two
    `HomeSections` pages pass `false`. Nothing is removed from the component and no other
    page changes. The invariant holds in both directions: the band in `HomeSections` renders
    on the same `showSection('newsletter')` flag the footer's does, so when the flag is on
    the homepage always keeps one ask, and when it is off both were already gone.
  - **Measured whole-site.** Exactly **2** files in `dist` differ, `index.html` and
    `home-photos/index.html`. All 61 other pages are byte-identical, as are both sitemaps,
    `llms.txt`, `llms-full.txt`, `rss.xml` and `robots.txt`. The homepage diff is a single
    changed line, and read as markup it is exactly the eight removed elements of the
    duplicate block; no JSON-LD node, attribute or other element moved. 59 of
    63 built pages still carry `site-footer__signup`, the four without it being `/`,
    `/home-photos/` and the two redirect stubs that have no footer at all.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 61 pages built, 3,094
    internal links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and
    descriptions unique. `npm run check:flags` passes on both the all-on and all-off builds.
    The 11 outbound warnings are the sandbox egress policy and are identical on the baseline
    build. `astro check` is still not installed here and the repo has no `tsconfig.json`, so
    it was skipped rather than installed into the diff. Headless Chromium over all **55**
    indexable pages at **375, 768 and 1280px**: no horizontal overflow, no image without
    alt, no unlabelled form control, no link or button without an accessible name, exactly
    one `h1` per page and no heading-level jump - clean before and after. Keyboard: 47 tab
    stops on `/` (was 48, the one removed being the duplicate mailto), every one with the
    gold `:focus-visible` ring. Full-page screenshots at all three widths on `/events/`,
    `/bootcamps/`, `/testimonials/`, `/team/` and the Cohort 3 booking page are
    **byte-identical** before and after; only `/` moves, losing 143px of height at 375px,
    150px at 768px and 159px at 1280px.
  - **Production state from the Actions API:** Deploy run 294 success on `93d55b4`, the
    current HEAD, nothing queued. `oxfordagentic.com` answers 403 on CONNECT from this
    sandbox and does not resolve through `WebFetch` either, so production could not be read
    directly; the deploy is green on HEAD and the local build of that same commit was used
    as the before-state. PR #1 and `feat/ceo-roundtable-demand-page` are the known-stale
    leftovers already recorded in backlog 20, not work in flight.
  - **Recorded and not fixed.** Four team headshots are `loading="lazy"` while sitting just
    inside the first viewport at 1280px (tops at 740-746px) and one at 375px (603px), so
    they are fetched later than they are needed on `/team/`. Small, and a separate concern
    from this cycle's file. The footer's 700-820px wrap found in the same sweep is backlog 46.

- **2026-10-25 (07:00 local cycle) - the engine now describes this bootcamp well, off the wrong
  page. `Event.sameAs` was on the cohort detail pages and missing from the condensed node that
  `/` and `/events/` emit, which is the only one that gets read.**
  - **The evidence, and it is the first of its kind in twenty-four readings.** Asked what a
    one-day agentic bootcamp actually produces, the engine answered with our proposition almost
    word for word: *"Small groups build and run a working agentic workflow that does a real
    job... designing skills, then a multi-agent workflow, and where to keep a human in the loop,
    plus security and stakeholder questions."* It read all of it off `luma.com/oxfordagentic2`
    (Cohort 2, which **ran** on 16 September) and `luma.com/k7c2rm5s` (Cohort 1, **July**). A
    second probe carrying the domain itself returned no page of ours and closed with *"One
    listing shows 21 Jul 2026... with tickets from $275. The venue differs between listings: one
    names St Anne's College and another names Worcester College."* The pitch is reaching buyers.
    The date, the venue and the price attached to it are a passed day, two colleges and a figure
    in the wrong currency - and this site publishes no price at all, by decision.
  - **What was missing, and it was missing by omission rather than by decision.**
    `eventSchema()` has carried `sameAs` since 15 Oct with a documented reason: it names the
    Luma listing of this same event, so a consumer holding both knows they are one thing and
    which is ours. `eventListingItem()` - the condensed node emitted on `/` and inside the
    `/events/` `ItemList` - never gained it, because it was written before 15 Oct and went onto
    the homepage on 23 Oct. Its own comment names the three things it deliberately leaves on the
    detail page: the agenda, the photos and the series. `sameAs` is none of them. It is an
    identity statement, the same class as the `@id` and the `url` the node already carries, and
    identity is what a listing node is for.
  - **It reaches the page that is read.** `/bootcamps/<slug>/` and `/events/<slug>/` have never
    been returned by a probe; `/` is returned by every probe that returns anything of ours. The
    live listing's URL was on the pages an engine does not hold and absent from the one it does.
  - **On a passed cohort it corrects in the other direction.** `/events/` lists all five, so
    `luma.com/oxfordagentic2` is now bound to a page whose `eventStatus`, dates and prose all say
    the day ran in September. That is exactly what these probes keep getting wrong.
  - **Nothing is asserted.** Each value is `event.data.lumaUrl`, already the visible booking link
    on that cohort's page and already in that page's own `Event` node under the same `@id`.
    Checked as data: all five listing nodes' `sameAs` are identical to their detail page's, and
    both homepage nodes match theirs, so the two cannot drift. No Luma page was read: `luma.com`
    answers 403 on CONNECT from this sandbox, and no event fact was read or changed.
  - **Measured whole-site.** Exactly **2** files in `dist` differ, `index.html` and
    `events/index.html`. All 61 other pages are byte-identical, as are both sitemaps,
    `llms.txt`, `llms-full.txt`, `rss.xml` and `robots.txt` - the sitemap correctly does not move,
    because no content file changed and `/`'s derivation does not read `schema.ts`. On both
    changed pages the HTML **outside** the JSON-LD block is byte-identical, so nothing a reader
    sees moved. The JSON-LD diffed as data: node counts unchanged (9 on `/`, 5 on `/events/`),
    exactly 7 `sameAs` properties added across the two pages, **no node added, removed or
    otherwise altered, and no other property changed anywhere**.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal links
    resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique, no SEO
    warnings. `npm run check:flags` passes on both the all-on and all-off builds. The 11 outbound
    warnings are the sandbox egress policy and are identical on the baseline build. `astro check`
    is not installed here and the repo has no `tsconfig.json`. Headless Chromium at 375 and
    1280px on `/` and `/events/`: **0px overflow in all 4 configurations**, one `h1` each, the
    JSON-LD block parses, 2 Event nodes on `/` and 5 on `/events/` each carrying its `sameAs`,
    correct canonicals, no robots meta, no duplicate ids, no missing alt. The 2 console errors
    per page are googletagmanager blocked by the sandbox.
  - **Recorded and not fixed.** IndexNow maps `src/lib/schema.ts` to the whole site, so 55 URLs
    are hinted where 2 changed. Same call as the last four cycles: a change to `schema.ts`
    usually does rebuild every page, and a one-off exception for a file name would be worse than
    55 hints nobody is harmed by. The ping script was not run by hand; the deploy workflow runs
    it, as always.
  - **GEO: five probes, none cited.** Two axes were probed and both correctly produced no page.
    *"Is one day enough"* is a real hole in the field - the engine's own *"The results don't
    include independent evidence on how much behavior change a one-day course produces"*, with a
    provider saying a boot camp *"simply isn't enough"* as the only direct answer - and
    `what-you-can-build-in-one-day-with-ai` has carried a named "Is one day enough?" section
    since 20 October, so the gap is coverage and not a thirty-third page. **Marketing as a
    vertical was probed and declined**: unlike finance, the field has live UK competition rather
    than a hole (Anicca, LXA's London day, aiawareness.ai at £1,795 to £1,995) and the searcher
    is largely the content marketer the 12 Aug rule names as vanity traffic. Do not re-pitch
    without new evidence.
  - **Production state from the Actions API:** Deploy run 293 success on `520560b`, the current
    HEAD, nothing queued. `oxfordagentic.com` answers 403 on CONNECT from this sandbox, so
    `build.txt` could not be read. Search Console unavailable from the cloud; no export newer
    than the 24 August baseline and no API credentials in the repo. Off-page: no new lead - the
    standing stale-Luma entry gained a fourth dated line, the first showing the product described
    *well* off the wrong page.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the eighth cycle
    running.** Of the two axes that passed WINNABLE, one is already answered on a page published
    thirteen days ago and the other fails CONVERTING.

- **2026-10-25 (01:00 local cycle) - four probes asked this field what a one-day AI bootcamp
  expects of you and who it is for, and all four said nobody answers it. This site answers both
  in prose on three pages and published neither as data. `Course.coursePrerequisites` and
  `Course.audience` now ship on all three bootcamps. Backlog 45 closed.**
  - **The evidence, and it is unusually direct.** Four questions on the prerequisites and
    audience axis, none citing this site, each one naming the same gap in its own words: *"I
    can't say who it's for or what the prerequisites are"* (Oxford, November, one-day); *"the
    results don't say how much technical background it assumes"* and *"The results don't say
    explicitly whether either course requires programming"* (the Agentic Bootcamp specifically,
    answered off the two expired Luma pages); *"few one-day courses list an explicit audience"*
    (Second Brain). The 17 Oct reading this item was opened on - *"I didn't find the course's
    prerequisites or a note on whether beginners are welcome"* - is now four readings.
  - **The competitors returned beside us publish exactly these two things.** Saïd's online
    programme came back with its audience stated and its certificate; LSBU with *"no formal
    entry requirements"*; a Brighton day with *"bring your laptop and curiosity"*. The answer
    is on our pages in a named FAQ and was in none of our structured data.
  - **Nothing is asserted that the page does not already say.** `audience` is the published
    `whoFor` list verbatim, as a single `Audience` node carrying 5 / 3 / 3 `audienceType`
    strings - the same shape as `teaches`, which is the published `outcomes` list.
    `coursePrerequisites` is a new schema-only `prerequisites` field on the programme
    collection, each one restating that programme's own "Do I need to be technical?" (or "Do I
    need to be able to code?") and "What do I need to bring?" answers. **Verified clause by
    clause against the rendered page with the JSON-LD stripped out: 11 of 11 clauses found in
    visible text.** That check is the point of the field's comment - structured data a reader
    cannot verify on the page would be a claim invented for machines.
  - **The Coding Bootcamp shipped too, and did not need backlog 25 answered.** Its published
    prerequisite is a laptop you can install software on, with the code editor, terminal and
    GitHub account the day sets up on it. The open question there is a paid *subscription*,
    which the string does not mention either way.
  - **Measured whole-site.** Exactly **7** files in `dist` differ: the three programme pages,
    `index.html`, `llms-full.txt` and the two sitemaps. All 59 other pages are byte-identical,
    as are `llms.txt`, `rss.xml` and `robots.txt`. The JSON-LD was diffed **as data**: on all
    four changed pages the only change is `audience` and `coursePrerequisites` added to the
    three `Course` nodes - no node added, removed or otherwise altered. Each homepage `Course`
    is still byte-identical to its programme page's, so the two pages cannot drift. On the
    programme pages the HTML outside the JSON-LD differs by **two characters each**, the "Last
    updated" day. `llms-full.txt` differs by exactly 3 lines, the same date.
  - **The sitemap moves 4 of 55 `lastmod` values, all true**: the three programme pages, whose
    files changed, and `/`, whose derivation takes the newest programme `updatedDate` and whose
    `Course` nodes did change. No URL added or removed, 41 carried a `lastmod` before and after,
    **0 future-dated, 0 malformed**. The first draft of this change *was* future-dated by 17
    minutes and was caught by that check: British Summer Time ended at 02:00 this morning, so a
    `+01:00` timestamp written at what the shell had just stopped calling 02:15 was ahead of the
    clock. Timestamps are `+00:00` from today until March.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique,
    no SEO warnings. `npm run check:flags` passes on both the all-on and all-off builds. Voice
    check on the three new strings: British spelling, no banned word, no em dash, no exclamation
    mark, spaced hyphens. The 11 outbound warnings are the sandbox egress policy. `astro check`
    is not installed in this sandbox and the repo has no `tsconfig.json`, so neither could run.
  - **Inspected in headless Chromium** at 375px and 1280px on `/` and all three programme pages
    - 8 configurations: 0px horizontal overflow, one `h1` each, JSON-LD parses, **3 `Course`
    nodes on `/` and 1 on each programme page, every one of them carrying both new properties**,
    correct canonicals, no `robots` meta, no duplicate ids, no missing alt. The 2 console errors
    per page are `www.googletagmanager.com` blocked by the sandbox.
  - **Recorded, not fixed: IndexNow over-submits this one too.** `src/lib/schema.ts` and
    `src/content.config.ts` both map to the whole site, so 55 URLs are hinted where 4 changed.
    Same call as the last three cycles: the conservative mapping is right in general. The ping
    script itself could not be run even with `--dry-run` this cycle - the sandbox classifier
    declined it - so the mapping above is read from the script rather than executed. The deploy
    workflow runs it, as always, and it was not run by hand.
  - **No copy, claim, link or event fact changed.** Three programme `updatedDate`s moved to
    today, which is true and is the only thing a reader sees.
  - **GEO: four probes, none cited.** Full table in `seo-data/geo-citations.md`. Twenty-third
    consecutive reading of the stale-listing harm, including the Agentic Bootcamp described to a
    buyer off `luma.com/k7c2rm5s` and `luma.com/oxfordagentic2` as *"a community event, not a
    formal course"* at *"St Anne's or Worcester College"*.
  - **Production state from the Actions API.** CI run 279 and Deploy run 292 both success on
    `2f94072`, the current `main` HEAD, finished 19:12Z yesterday, nothing queued or in progress.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox, so `build.txt` could not be
    read and production state is taken from the runner, as on the last nine cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **Off-page: one dated corroboration, no new lead.** EnSpire Oxford's competitor bootcamp page
    was returned a fourth time, on a fourth distinct query shape; the route and the open question
    are unchanged, so the existing entry gained a line rather than the list gaining an entry. The
    other hosts today - createwith, maven, happeningnext, eventbrite, allai.events - are all
    already recorded.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the seventh cycle
    running.** The axis probed is a prerequisites-and-audience question the three programme pages
    already answer in their own FAQs; the gap was machine-readability, not a 33rd page. The week
    resets tomorrow.

- **2026-10-24 (19:00 local cycle) - the three `Course` nodes that say this is a one-day,
  in-person, Oxford course sat only on the programme pages, which no probe has ever returned.
  They are now on the homepage too, the one page this engine demonstrably holds.**
  - **The evidence, from this cycle's fourth probe.** The query carried the domain itself:
    *"oxfordagentic.com Oxford Agentic Bootcamp November 2026 next cohort"*. The engine
    answered *"I didn't find a November 2026 cohort ... and the search didn't surface
    oxfordagentic.com itself"*, off `luma.com/oxfordagentic2` (ran 16 September),
    `luma.com/k7c2rm5s` (July) and allai.events (*"21 Jul 2026, which is already past"*),
    with the venue contradiction between the two stale pages volunteered again. **Then it
    offered a competitor as the substitute, unprompted**: a *"possible mix-up"* with Oxford
    Saïd's **online** Generative and Agentic AI Programme, *"11 November 2026 ... £1,500 ...
    4-week format"*. A buyer holding this brand name is being handed a four-week online
    programme. Twenty-second consecutive reading of the stale-listing harm.
  - **Why the homepage and why schema.** Restricted to this domain, the index holds `/` and
    two guides and nothing else, so every fact an engine quotes about these bootcamps it
    reads off `/`. Its graph was Organization, WebSite, WebPage, FAQPage and (since 23 Oct)
    two `EducationEvent`s. **No `Course` node anywhere on it**, while
    `/bootcamps/<slug>/` carried a rich one each. `courseMode: onsite`, `courseWorkload:
    PT8H` and a dated `CourseInstance` at a named Oxford venue are precisely the three facts
    that separate this from a four-week online programme, and precisely the three earlier
    probes said they could not confirm (*"its length, format, or whether attendees build
    their own workflow"*).
  - **Nothing new is asserted, and the two pages cannot drift.** The node was moved out of
    `src/pages/bootcamps/[slug].astro` into a shared `courseSchema()` in `src/lib/schema.ts`,
    and both pages now emit the **identical** node under the `@id` the programme's own page
    publishes. Verified as data, not as text: each homepage `Course` is byte-identical to its
    programme page's, so a consumer holding both describes one course rather than two.
    `teaches` is the published `outcomes` list and `description` the published capsule.
  - **The Second Brain Bootcamp correctly publishes no instance.** It has no cohort on sale,
    and `hasCourseInstance` is omitted rather than empty - an empty array claims instances
    and supplies none. So the homepage now says, machine-readably, that two of the three
    bootcamps have a dated November run and one does not.
  - **Measured whole-site.** Exactly **one** file in `dist` differs: `index.html`. All 62
    other pages are byte-identical, **including the three programme pages**, which is the
    proof that the refactor changed nothing where the node already lived. No sitemap,
    `llms.txt`, `llms-full.txt`, `rss.xml` or `robots.txt` change. On `/` itself, the HTML
    **outside** the JSON-LD block is byte-identical, so nothing a reader sees moved: the
    graph goes from 6 nodes to 9.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions
    unique, no SEO warnings. `npm run check:flags` passes on both the all-on and all-off
    builds. All 55 indexable titles re-measured at 60 characters or fewer and all 55
    descriptions between 70 and 160, unchanged. The 11 outbound warnings are the sandbox
    egress policy. `astro check` is not installed in this sandbox and the repo has no
    `tsconfig.json`, so neither could run.
  - **Inspected in headless Chromium** at 375px and 1280px on `/` and all three programme
    pages - 8 configurations: 0px horizontal overflow, one `h1` each, every JSON-LD block
    parses, 3 `Course` nodes on `/` and 1 on each programme page, no `robots` meta. The 2
    console errors per page are `www.googletagmanager.com` blocked by the sandbox.
  - **Recorded, not fixed: IndexNow over-submits this one too.** `--dry-run` on the real
    change set maps to all 55 sitemap URLs, because `src/lib/schema.ts` and a `[slug]`
    template usually do rebuild every page. Here they provably rebuilt one. Same call as the
    13:00 cycle: the conservative mapping is right in general, and a file-name exception
    would be worse than 55 hints nobody is harmed by. (`src/pages/index.astro` alone maps to
    `/` exactly, which is the true blast radius.)
  - **No content, copy, claim, link or event-fact change.** Structured data only.
  - **Also measured and found clean, so no later cycle re-spends it.** Inbound internal links
    per sitemap URL across all 63 built pages: **no orphans**, minimum 3 outside the seven
    team pages, which sit at 1 and are backlog 24 (his call). Every `Event` node re-audited
    for `eventStatus` and `offers`: the three passed cohorts publish no offer, the two
    upcoming ones publish `InStock`, which is correct. `llms.txt` carries all 33 guides and
    both November cohorts.
  - **GEO: four probes, none cited.** The three open buyer questions are all unwinnable
    fields and two of them this site already answers - the human-in-the-loop question is
    arxiv, Oracle's product docs and Airtable against a guide published 11 September, and the
    time-saving question is a content farm (itechguides, geekchamp and macmyths returned the
    same title three times) against a guide published 13 October. Neither was returned, which
    is coverage, not content. Full table in `seo-data/geo-citations.md`.
  - **Production state from the Actions API.** CI run 278 and Deploy run 291 both success on
    `3052fc4`, the current `main` HEAD, finished 13:11Z, nothing queued or in progress.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox, so `build.txt` could not be
    read and production state is taken from the runner, as on the last eight cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **Off-page: nothing new recorded.** Today's hosts - the two expired Luma pages,
    allai.events and Saïd's online programme - are already on the review list as evidence for
    backlog 2 and 2b rather than as leads. The Saïd substitution sharpens them; it does not
    add a third item.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the sixth cycle
    running.** None of the four axes probed passed WINNABLE, and two of them this site already
    answers on pages no engine has indexed.

- **2026-10-24 (13:00 local cycle) - the homepage, the one page an engine demonstrably holds,
  was 1 of 15 URLs in the sitemap with no `lastmod` at all. It has one now, and it survives
  the change that has no commit behind it. Backlog 44, the top loop-actionable item, closed.**
  - **Why this page and not the other fourteen.** Every probe that returns anything of ours
    returns `/`; everything an engine knows about the November cohorts it reads off that page;
    its cached copy was measured roughly four days stale on 23 Oct. The 20 Oct cycle made this
    sitemap's `lastmod` trustworthy by removing five false ones, which is what makes adding a
    true one worth anything.
  - **The problem that blocked it at 07:00 today, and the answer.** The homepage changes with
    **no commit behind it**: a cohort whose `endDate` passes leaves `isUpcoming` on the daily
    03:17 cron and the page visibly loses a card. The obvious derivation - newest `updatedDate`
    among the cohorts listed - therefore moves **backwards** on exactly that change (today
    13:12 on 18 Oct, after 19 November falling to 08:23 on 18 Oct). The answer is that a passed
    event contributes **`endDate`**, the moment its card left the page, rather than a file edit
    nobody made. True, and monotonic: `endDate` only ever joins the set, so the maximum cannot
    fall.
  - **What `/` now takes the maximum of.** The three files that are its own copy
    (`index.astro`, `HomeSections.astro`, `home.ts`, recorded by hand as
    `HOMEPAGE_COPY_LASTMOD` because CI clones at depth 1 and git cannot supply a per-file
    date); every programme's `updatedDate`, since "What we run" renders a card each; each
    **upcoming** event's `updatedDate`; and each **passed** event's `endDate`. An event's
    `updatedDate` counts only while it is upcoming, which is why Cohort 2's past-tense rewrite
    on 24 October does not touch this page's date. Shared components (Hero, EventCard, Faq,
    the layout) are deliberately excluded: a change to those moves 63 pages, and claiming it
    moved one would be the same lie in the other direction.
  - **Simulated forward, which is the test this item asked for.** 24 Oct 2026-10-23T13:14:11Z;
    18 Nov unchanged; 20 Nov (after Cohort 3) 2026-11-19T17:00Z; 27 Nov (after the Coding
    cohort) 2026-11-26T17:00Z; 1 Mar 2027 unchanged. **Never earlier than the reading before
    it, never ahead of the clock.**
  - **Measured whole-site.** Exactly **one** file in `dist` differs: `sitemap-0.xml`. All 63
    built pages are byte-identical, as are `sitemap-index.xml`, `llms.txt`, `llms-full.txt`,
    `rss.xml` and `robots.txt`, and no JSON-LD changes anywhere. Inside the sitemap exactly
    **1 of 55** entries changed, `/` gaining a lastmod; no URL added or removed; 40 entries
    carried one before, 41 now; 0 future-dated. Touching nothing and rebuilding produces a
    byte-identical sitemap.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions
    unique, no SEO warnings. `npm run check:flags` passes. Both sitemaps re-parsed with a real
    XML parser: well-formed, 0 malformed and 0 future-dated values. The date function was
    extracted and run directly against the live content files at five simulated clock
    positions for the monotonicity table above. `astro check` is not installed in this sandbox
    and the repo has no `tsconfig.json`, so neither could run; `astro.config.mjs` is
    `// @ts-check`ed and the build parses it. The 11 outbound warnings are the sandbox egress
    policy.
  - **Inspected in headless Chromium** at 375px and 1280px on `/` and `/events/` - 4
    configurations: 0px horizontal overflow, one `h1` each, JSON-LD parses, correct canonicals,
    no `robots` meta, both cohort cards present. The 2 console errors are
    `www.googletagmanager.com` blocked by the sandbox; the rendered HTML is byte-identical to
    the baseline build, so nothing visual could have moved.
  - **Recorded, not fixed: IndexNow over-submits this one.** `--dry-run` on
    `astro.config.mjs` maps to all 55 sitemap URLs, because a config change usually does
    rebuild every page. Here it provably rebuilt none. Not special-cased - the conservative
    mapping is right in general, and a one-off exception for a file name would be worse than
    55 hints nobody is harmed by.
  - **No content, copy, claim, schema or link change.** One build-config file.
  - **GEO: four probes, none cited, and the sharpest stale-listing reading yet.** On the core
    Oxford commercial query - #2, #3 and #5 for this site in September - oxfordagentic.com did
    not appear at all; the engine answered from two of Drummond's own expired Luma pages plus
    allai.events, reported conflicting venues, gave the date as 21 July *"which has already
    passed"*, and closed on *"I couldn't find a confirmed upcoming date"* while two cohorts sit
    26 and 33 days out. It did quote this site's own words back, so the copy reaches it and the
    URL does not. Twenty-first consecutive reading; already the open item for Drummond on the
    review list, so nothing new was added there. The 19 and 20 October guides are still
    unindexed and both their fields are still empty, which is coverage, not content. Full table
    in `seo-data/geo-citations.md`.
  - **Production state from the Actions API.** CI run 277 and Deploy run 290 both success on
    `eb44d38`, the current `main` HEAD, finished 08:20Z, nothing queued or in progress.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox, so `build.txt` could not be
    read and production state is taken from the runner, as on the last seven cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 August baseline, and no API credentials exist in the repo.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the fifth cycle
    running.** The two axes probed today are already answered by guides four and five days old
    that no engine has indexed yet. A third page on the same axes would be the near-duplicate
    the hard rule forbids. Not a Q&A refresh either: no probe showed a gap an existing page
    raises and leaves open.

- **2026-10-24 (08:00 local cycle) - the footer built five columns for four blocks at every
  desktop width, so its three link columns were narrower at 1,280px than at 1,024px. Backlog
  43, measured, prototyped and now shipped.**
  - **The cause, confirmed in the browser.** `.site-footer__grid` is
    `minmax(min(100%, 15rem), 1.6fr) repeat(auto-fit, minmax(min(100%, 9rem), 1fr))`, and the
    newsletter band sat inside it with `grid-column: 1 / -1`. `auto-fit` collapses a track only
    when nothing is placed in or spanning it, and the band spanned every one, so from 1,100px
    up the grid generated a fifth track that no block could ever occupy.
  - **What it cost, measured on the built site.** The three link columns ran **147px at
    1,100px, 161px at 1,280px and 159px at 1,440px**, against **176px at 1,024px** - a wider
    viewport giving narrower columns - with **235 to 256px of dead space** to the right of
    "Elsewhere" on all 63 pages. The wrapping that caused: `hello@oxfordagentic.com` broken
    across two lines, "The Oxford Agentic Coding Bootcamp - Cohort 1" over three, the entity
    paragraph over five.
  - **The change.** The signup band moves out of the grid and sits after it, in its own
    `.wrap`, with `margin-block-start` set to the grid's own gap so it lands exactly where it
    did. The empty track then collapses. Nested one level inside the wrap on purpose: the band
    carries the hairline rule, and as a direct `.wrap` the rule ran out into the gutter
    (50 to 1,230px at 1,280px) instead of starting and ending with the wordmark above it
    (94 to 1,186px). Measured both ways; the rule is where it was at all seven widths.
  - **After.** Columns at **191px / 206px / 204px** at 1,100 / 1,280 / 1,440px, up 28 to 30 per
    cent, dead space gone, the address back on one line and the Coding title down from three
    lines to two. **Footer height is identical at every width** (1,207 / 754 / 608 / 613 / 613
    at 375 / 768 / 1,024 / 1,280 / 1,440px), so nothing below it moves and there is no shift.
  - **Measured whole-site.** `dist` differs in exactly **61 HTML files plus the one CSS
    bundle**, and nothing else: no sitemap, `llms.txt`, `llms-full.txt`, `rss.xml` or
    `robots.txt` change, and no JSON-LD change on any page. Per page the diff is **two added
    markup lines** and the stylesheet hash; in the CSS, one declaration swapped.
  - **Screenshots, six pages at seven widths, before and after.** `/`, the Agentic programme
    page, the Cohort 3 event page, `/guides/`, `/team/` and `/privacy/` at 320, 375, 768,
    1,024, 1,100, 1,280 and 1,440px. **Byte-identical at 320, 375, 768 and 1,024px on all
    six**, differing only at 1,100, 1,280 and 1,440px, which is precisely where the empty
    track existed.
  - **Checks.** `npm ci`, `npm run build` clean before and after - 63 pages, 3,094 internal
    links resolve, schema valid at 7 Event and 9 FAQPage nodes, titles and descriptions unique.
    `npm run check:flags` passes on both the all-on and all-off builds, which is what covers
    the band being absent. `astro check` reports **79 errors before and after, identical** -
    pre-existing implicit-`any` noise in other files, none in `Footer.astro`. Whole-site
    headless audit at 375, 768 and 1,280px over all 55 indexable pages: **0 horizontal
    overflow, 0 missing alt, 0 unlabelled controls, 0 links without an accessible name, one
    `h1` each**, clean before and after. Keyboard: tab order through the footer is unchanged
    in sequence, and all 12 focusables take the gold 2px `:focus-visible` ring.
  - **No content, copy, token, schema or link change.** Markup and one declaration only.
  - **Production state from the Actions API.** CI and Deploy to GitHub Pages both success on
    `a14aaf28`, the current `main` HEAD, at 07:11Z, nothing queued or in progress.
    `oxfordagentic.com`, `www.oxfordagentic.com` and `drummond1.github.io` all answer
    `connect_rejected` on CONNECT from this sandbox, so production could not be fetched or
    screenshotted and its state is taken from the runner, as on the last six cycles. The
    comparison above is local preview against local preview of the same commit.
  - **PR #1 and `feat/ceo-roundtable-demand-page` read as known-stale, not work in flight**
    (backlog 20), on the same reading as the last several cycles.
  - **No guide.** Today's allowance is deliberately unspent; this cycle worked a layout defect
    already measured and waiting.

- **2026-10-24 (07:00 local cycle) - the one buyer question in the Coding Bootcamp's own
  cluster that nothing in the field answers for a non-developer, added as three Q&As to the
  guide that raises it and never answers it.**
  - **The measurement, on two phrasings.** *"How to check what an AI coding agent wrote before
    you ship it, non-developer"* and *"I can't read code, how do I know if what Claude Code
    built actually works before launching"* both returned **no page of ours**, and on both the
    engine named the gap itself: *"Most of these sources assume you can read code or a diff"*,
    and *"The search didn't turn up Anthropic's official guidance, so these points come from
    third-party blogs and community write-ups"* - then offered its most useful advice flagged
    as *"My own suggestion, not from the search"*. The field is vendor blogs (expo.dev,
    tenki.cloud, growwstacks, willowvoice, lowcode.agency) and developer-audience publishers
    (freeCodeCamp, RealPython, Towards Data Science). **WINNABLE**: no institutional publisher
    on the subject, and the non-developer framing is explicitly unoccupied. **CONVERTING**:
    someone using a coding agent who cannot read code is the Coding Bootcamp's published
    audience word for word - *"Anyone who has watched a coding agent work and wants to know
    what to do around it"*.
  - **A Q&A refresh and deliberately not a guide.** `why-the-code-an-agent-wrote-is-not-live`
    already puts this question in the sixth item of its own list - *"A way to know it works.
    Not a feeling."* - and then never answers it. A new page on the same axis, in the same
    cluster, on the same day the 01:00 cycle edited the sibling guide, is the near-duplicate
    the hard rule forbids. The guide had no Q&A section; about 3 of 32 do (known candidate 3).
  - **The change: three question-shaped `##` sections, inserted before "Where this gets
    practical".** *How do I check what the agent wrote if I cannot read code?* (check the
    outcome, not the code: use it as a real person would including the inputs you expect to go
    wrong, look at what changed and how much, then put a test in). *Does a passing test mean it
    works?* (a test checks only what it was told to check, and an agent asked to make tests
    pass can write tests that pass). *Can I ask the agent to check its own work?* (yes for
    mechanical faults, no for whether it does what you meant). `updatedDate` bumped to 24 Oct.
  - **No new fact, no statistic, no quotation, no event fact.** Every claim is either the
    guide's own position stated at greater length, or a general property of tests and agents
    that the page already asserts in brief. No number, no attribution to a source this cycle
    could not read in full, nothing about price, capacity, availability, venue or date.
  - **Measured whole-site.** Exactly **5** files in `dist` differ: the guide, `/guides/` (one
    eyebrow, "September 2026" to "October 2026"), `llms-full.txt` and the two sitemaps. On the
    guide, the JSON-LD was re-parsed and diffed as data: exactly **2** lines move, both
    `dateModified`. Outside it, `article:modified_time`, the byline, and the new block. All
    other **62** pages are byte-identical, as are `llms.txt`, `rss.xml` and `robots.txt`. The
    sitemap `lastmod` for the guide moves 25 Sept to 24 Oct, which is true.
  - **Checks.** `npm ci`, then `npm run build` clean before and after - 63 pages checked, 3,094
    internal links resolve, titles and descriptions unique, no SEO warnings, schema valid at
    7 Event and 9 FAQPage nodes. Voice check on the new copy: no banned word, no em dash, no
    exclamation mark, British spelling, spaced hyphens. The 11 outbound warnings are the
    sandbox egress policy.
  - **Inspected in headless Chromium** at 375px and 1280px on the guide and `/guides/` - 4
    configurations: **0px horizontal overflow everywhere**, one `h1` each, JSON-LD parses,
    correct canonicals, no `robots` meta, **no duplicate heading ids** from the three new
    anchors, and all three new headings present at both widths. The 2 console errors are
    `www.googletagmanager.com` blocked by the sandbox egress policy - **confirmed identical on
    the baseline build**, so not this change's.
  - **Backlog 44 was taken up and put back down, with a finding that changes it.** The obvious
    derivation for a homepage `lastmod` - the newest `updatedDate` among the upcoming cohorts
    the page lists - **can move backwards on exactly the change that matters**. Today the set
    is Cohort 3 (`updatedDate` 18 Oct 13:12) and Coding Cohort 1 (18 Oct 08:23), so `/` would
    read 13:12. After 19 November, Cohort 3 drops out of `isUpcoming` on the **daily scheduled
    rebuild, with no commit behind it**, the homepage visibly loses a card, and the derived
    `lastmod` would fall to 08:23 - *earlier than the day before*. A `lastmod` that goes
    backwards on a page that just changed is worse than none, which is the fault the 23 Oct
    cycle fixed wearing the other mask. Recorded on the item; it needs a mechanism that
    survives a time-triggered change, not a max over frontmatter dates.
  - **Checked and ruled out, so no later cycle re-spends it: the national November miss is not
    an on-page defect.** The engine answered *"I found no one-day, in-person UK workshop in
    November 2026 that clearly fits all your criteria"* while two sit in the sitemap, and said
    of its own candidate that it could not confirm *"its length, format, or whether attendees
    build their own workflow"*. All three are already published machine-readably -
    `eventAttendanceMode: OfflineEventAttendanceMode`, same-day `startDate`/`endDate`, and
    `Course.teaches` with `hasCourseInstance` on every programme page. The schema is correct
    and unread, so the gap is coverage. Likewise `Course.coursePrerequisites` and
    `Course.audience` were drafted from published `whoFor` and FAQ copy and **not shipped**:
    they would add signal to programme pages, which are the pages no probe has ever returned.
  - **Production state from the Actions API.** Deploy run 287 success on all jobs for
    `7c065ca`, the current `main` HEAD, finished 01:07 UTC, nothing queued or in progress.
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox and does not resolve for
    WebFetch, so `build.txt` could not be read; production state is taken from the runner, as
    on the last five cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 Aug baseline, and no API credentials exist in the repo.
  - **Off-page: nothing new recorded, deliberately.** The only third-party hosts today's probes
    returned - allai.events, learnersink.com, nobleprog.co.uk, algo.monster - are already on
    the review list as evidence rather than leads. Adding them again would be duplication.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the fourth cycle
    running.** The verification axis was the one topic that passed both tests and it needed
    reach on an existing page, not a 33rd URL in an index that holds 3 or 4 of 55.

- **2026-10-24 (01:00 local cycle) - an engine told a buyer the Coding Bootcamp "may still
  expect some technical comfort", reasoning from the one page of ours it holds on the subject.**
  - **The measurement.** The site-restricted coverage probe is up from **3 URLs to 4**, and the
    new one is `/guides/claude-cowork-claude-code-or-codex/`, returned **first** when the domain
    is asked about the Coding Bootcamp. Asked whether that day suits non-developers, the engine
    answered: *"the results don't say outright that it's aimed at non-developers"*, then *"A
    separate guide notes that Claude Code assumes you are comfortable working in a codebase,
    which suggests the course may still expect some technical comfort"*, and closed on *"I didn't
    find the course's prerequisites or a note on whether beginners are welcome, so check the
    course page or email hello@oxfordagentic.com before booking."*
  - **The site publishes the opposite, on two pages the engine has never returned.** Both the
    programme page and the Cohort 1 event page answer "Do I need to be able to code?" with *"The
    agents do the typing, so the day does not assume you can code."* Neither is in the index.
  - **And the quoted sentence is this guide's own, which makes it a copy defect rather than only
    a misreading.** "It assumes you are comfortable working in a codebase" is true and correct
    about **Claude Code the tool**, and should stay. But the guide's closing section carried the
    Agentic Bootcamp's prerequisite line (*"No coding required."*) and gave the Coding Bootcamp
    none - so a reader, or an engine, holding only this page gets a stated prerequisite for one
    day and silence plus a warning for the other. The asymmetry was in the copy.
  - **The change: two sentences, on the page the engine holds.** The Coding Bootcamp paragraph
    in `src/content/guides/claude-cowork-claude-code-or-codex.md` now reads *"It does not assume
    you can code. What it teaches is everything around the code - the terminal, version control,
    deployment, databases and tests - and how to check what the AI wrote rather than trusting
    it."* **No new fact**: it is the published event-page and programme-page answer, reworded only
    to fit prose. `updatedDate` bumped to 24 Oct.
  - **Why this and not a backlog item.** 41, 43 and 44 are all loop-actionable and all stayed
    open. This is on 1 of the 4 URLs an engine demonstrably holds, about a day that is bookable
    and **33 days out**, answering the exact question the engine said it could not find. The
    national query on the same subject returned nothing of ours and the engine stated the gap
    itself: *"none of the results covers Codex in a one-day, in-person UK course for
    individuals."* Highest value, highest confidence, smallest change of the four.
  - **The 23 Oct homepage change is working, and the stale-date run has ended.** Asked for a
    one-day Oxford bootcamp in November, the engine answered *"Cohort 3, Thursday, 19 November
    2026 at Worcester College"*, named the Coding Bootcamp on 26 November as a separate day, and
    noted that *"the 21 October cohort has already passed"*. Nineteen consecutive cycles had read
    a stale date; this one did not.
  - **Measured whole-site.** Exactly **5** files in `dist` differ: the guide, `/guides/` (one
    eyebrow, "September 2026" to "October 2026"), `llms-full.txt` and the two sitemaps. On the
    guide itself exactly **4** lines move - `article:modified_time`, the two `dateModified`
    fields, the byline and the paragraph. All other **62** pages are byte-identical, as are
    `llms.txt`, `rss.xml` and `robots.txt`. The sitemap `lastmod` for the guide moves from
    25 Sept to 24 Oct, which is true.
  - **IndexNow maps this one exactly**, which is worth recording against backlog 41: `--dry-run`
    submits 2 URLs and the measured blast radius is 2 sitemap pages. 41's four-page
    under-submission is caused by a **title** change moving sibling "More guides" link text; a
    body change does not touch the siblings. The item is unchanged, and milder than it reads.
  - **Checks.** `npm ci`, then `npm run build` clean before and after - 63 pages checked, 3,094
    internal links resolve, titles and descriptions unique, no SEO warnings, schema valid at
    7 Event and 9 FAQPage nodes. Voice check on the new sentences: no banned word, no em dash,
    no exclamation mark, British spelling, spaced hyphens. The 11 outbound warnings are the
    sandbox egress policy.
  - **Inspected in headless Chromium** at 375px and 1280px on the guide, `/guides/`, the Coding
    programme page and the Coding event page - 8 configurations: **0px horizontal overflow
    everywhere**, one `h1` each, every JSON-LD block parses, correct canonicals, no `robots`
    meta, zero page errors, and the new sentence present on the guide at both widths.
  - **No event fact was read or changed.** `luma.com` answers 403 on CONNECT from this sandbox,
    so the three Luma pages could not be checked; no date, venue, price, capacity or
    availability was touched. The sentence added is a prerequisite, already published twice.
  - **Production state from the Actions API.** CI run 274 and Deploy run 286 both success on all
    jobs for `4f7d4a1`, the current `main` HEAD, finished 19:14 UTC, nothing queued or in
    progress. `oxfordagentic.com` answers 403 on CONNECT from here, so `build.txt` could not be
    read; production state is taken from the runner instead, as on the last four cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 Aug baseline.
  - **Stale-date sweep: nothing left to do.** All three passed dates (16 Sept, 21 Oct, and the
    former 15 Oct Cohort 3 slot, now 19 Nov) read in the past tense across content and copy;
    checked by grep over `src/`. Known candidate 2 is closed.
  - **Known candidate 1 was already fixed** and needs no cycle: `scripts/indexnow-ping.mjs`
    carries a `SINGLE_PAGE_SOURCES` map with `src/lib/home.ts -> /`.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the third cycle
    running.** Two declines. *Making AI stick after the training day* is nine consultant blogs
    deep and the site already ranks #1 on its near-neighbour with
    `after-the-ai-executive-programme`, so a guide would restate a ranking page. *Coding-agent
    prerequisites* is already answered on the programme and event pages - it needed reach, not a
    new page, and reach is what this cycle gave it.

- **2026-10-23 (20:00 local cycle) - the sitemap told crawlers the five event pages had just
  changed, on every build, including the daily rebuild that changes nothing.**
  - **The defect.** `contentLastmod()` in `astro.config.mjs` builds each URL's `lastmod` from
    its content file's own `updatedDate`, **falling back to the file's mtime**. The five files
    in `src/content/events/` are the only content files on the site with no `updatedDate` - all
    32 guides and all 3 programmes have one - so all five fell through to the fallback. **git
    does not record mtimes.** CI clones fresh on every run, so in CI the mtime *is* the checkout
    time. Measured on this cycle's first build: all five event URLs carried
    `lastmod 2026-10-23T18:58:58.002Z`, the build's own timestamp, on a build that changed
    nothing. Touching the five files and rebuilding moved them to `19:05:37` - seven minutes
    later, same content. The fallback was written for a long-lived working copy and is worthless
    in the only place it runs.
  - **Why it is worth a cycle, and worth this one.** `lastmod` is one of the few crawl-priority
    signals a static site actually controls, and an engine that finds it unreliable discards it
    for the **whole** sitemap, not just the offending URLs. A URL that claims it changed seconds
    ago, every time, on a redeploy that also fires on a **schedule** with no commit behind it
    (run 283 today was `event: schedule`), is exactly that pattern. And the five URLs it was
    happening to are the five event pages - the pages carrying the dates buyers search for. The
    timing is the rest of the argument: **backlog 2** is the highest-value open item on the
    whole list and consists of handing `sitemap-index.xml` to Search Console. Better to fix the
    artefact before it is submitted than to submit it and spend the signal.
  - **It was also the code failing its own documented intent**, which is why it reads as a bug
    rather than a judgement call. The function's header already says pages with no content file
    behind them get no `lastmod` because "stamping every URL with the build date would tell
    crawlers the whole site changed on every deploy, which is both false and a wasted signal".
    The fallback did that to five of them.
  - **The change, in two parts.**
    - `src/content.config.ts`: the events collection now **requires** `updatedDate`, exactly as
      guides and programmes do, and each of the five files carries its own - read from git, the
      committer date of the last commit that touched that file: 18 Oct for Cohorts 1, 2 and the
      Coding Bootcamp, 18 Oct 13:12 for Cohort 3, 21 Oct 19:11 for Second Brain Cohort 1. No
      template reads `updatedDate` for an event (`schema.ts` and `llms.ts` read it by name, for
      guides and programmes only), so nothing visible moved.
    - `astro.config.mjs`: the mtime fallback is gone. A file with no readable `updatedDate` is
      **skipped**, so a missing `lastmod` is merely absent rather than untrue. With all three
      collections now requiring the field the skip is a guard, not a path - verified by deleting
      the line from the Cohort 3 file, which fails the build with `updatedDate: Required`.
  - **Not stamped with today, deliberately, because that is the same lie.** Nothing a crawler
    cares about changed on these five pages today: the rendered HTML is byte-identical. The
    loop's standing rule to bump `updatedDate` on content you touch is about content; adding a
    sitemap-only field is not content. Setting all five to 23 October would have re-committed
    the defect by hand.
  - **Measured whole-site.** Exactly **two** files in `dist` differ from the pre-change build:
    `sitemap-0.xml` and `sitemap-index.xml`. All **63** built pages are byte-identical, as are
    `llms.txt`, `llms-full.txt`, `rss.xml`, `robots.txt` and every stylesheet and script. Inside
    the sitemap, exactly **5** of 55 entries changed, each from the build timestamp to its true
    date; no URL added or removed; the 15 URLs with no `lastmod` (`/`, `/about/`, `/bootcamps/`,
    `/events/`, `/guides/`, `/privacy/`, `/testimonials/` and the 8 team pages) are unchanged,
    which is the documented and correct behaviour for a page with no single content file behind
    it. 40 of 55 URLs now carry a `lastmod`, **0** of them the build's.
  - **And it is now deterministic, which is the actual fix.** `touch`ing all five event files -
    precisely what a fresh CI clone does - and rebuilding produces a **byte-identical**
    `sitemap-0.xml`. Before, the same touch moved all five.
  - **Checks.** `npm ci`, then `npm run build` clean before and after - 61 pages built, 63
    checked, 3,094 internal links resolve, titles and descriptions unique, no SEO warnings,
    schema valid at 7 Event and 9 FAQPage nodes. `npm run check:flags` passes both the all-on
    and all-off builds. Both sitemaps re-parsed with a real XML parser: both well-formed, **0**
    malformed `lastmod` values, **0** future-dated ones. `astro check` could not run
    (`@astrojs/check` is not installed and `npx` wanted to fetch it, as on 23 Oct 14:00), so
    `tsc --noEmit -p tsconfig.json` ran on both states: **1 error before, 1 after**, the same
    pre-existing one, none on a changed line. `indexnow-ping.mjs --dry-run` on the changed set
    submits 55 URLs, correctly: `astro.config.mjs` and `src/content.config.ts` are template-wide
    and an event file is whole-site by design. The 11 outbound warnings are the sandbox egress
    policy.
  - **Inspected in headless Chromium** at 375px and 1280px on `/`, `/events/` and all five event
    pages - 14 configurations: **0px horizontal overflow everywhere**, one `h1` each, every
    JSON-LD block parses, correct canonicals, no `robots` meta on any of them, zero page errors.
    Screenshot comparison was unnecessary and is not claimed as evidence: the built HTML for all
    63 pages is byte-identical to the baseline, which is a stronger statement than two images
    matching.
  - **No event fact was read or changed.** `luma.com` answers 403 on CONNECT from this sandbox,
    so the three Luma pages could not be checked; no date, venue, price, capacity or availability
    was touched anywhere.
  - **Production state from the Actions API.** CI run 273 and Deploy run 285 both success on all
    jobs for `a1402f0`, the current `main` HEAD, finished 13:17 UTC, nothing queued or in
    progress. `oxfordagentic.com` answers 403 on CONNECT from here, so `build.txt` could not be
    read; production state is taken from the runner instead, as on the last three cycles.
  - **Search Console: unavailable from the cloud.** No export in `seo-data/` newer than the
    24 Aug baseline.
  - **GEO: four open buyer questions, none cited, plus the coverage measurement repeated - still
    3 of 55 URLs, the same three.** The sharpest result is the brand-and-date query: asked for
    this bootcamp by name, in November, at Worcester College, the engine said it *"couldn't
    confirm a November 2026 date"* and *"the event may not have one"*, answering from Cohort 2's
    and Cohort 1's expired Luma pages and allai.events' July listing, while
    `luma.com/oxfordagentic3` - the page that sells 19 November - did not appear at all. It
    attributed the November dates it found to Cambridge Judge and to Saïd's online programme.
    Eighteenth consecutive reading of the stale-listing harm and the most commercially expensive.
    **Recorded on the review list.** Better news: the engine now reads *"Cohort 3 on Thursday, 19
    November 2026 at Worcester College"* correctly off the homepage, where this morning it put
    the next cohort at 21 October - the 14:00 change working - though the same answer still calls
    21 October "only two days away", which dates part of its cached copy to about 19 October.
  - **One on-site hypothesis tested and ruled out, which is why this cycle shipped a sitemap fix
    and not a linking one.** If the engine holds three pages, those three are its only route into
    the other 52, so what they link to would decide what gets found. Measured on the built
    output: all three link to `/events/`, **both** upcoming event pages, `/bootcamps/` and all
    three programme pages. The links are already there; internal linking is not starving
    discovery.
  - **No guide: 2 of 3 this week, today's allowance deliberately unspent for the second cycle
    running.** Four declines. *Agentic workflow vs automation* fails both tests - ElevenLabs,
    MindStudio, NetSuite, Dataiku, every result a platform vendor on its own product, and the
    searcher is defining a term, not booking a day. *Bring your own task* is winnable but
    **already answered**: the restricted probe shows the site answers it well when reachable, so
    a guide would restate ranking pages. *Second brain for AI* falls to the standing decision
    that Second Brain's constraint is demand, not ranking. The brand-and-date query is coverage,
    not content. Not a Q&A refresh either - no probe found a question the site fails to answer on
    a page the engine holds.
  - **One new backlog item (44)**, loop-actionable but deliberately not folded in: the homepage
    is the one page an engine demonstrably re-reads and it carries no `lastmod` at all.

- **2026-10-23 (14:00 local cycle) - the engine holds three of this site's 55 pages, one of them
  is the homepage, and the homepage published nothing a machine could read about what it sells.**
  - **The measurement, which is the point of the cycle.** Five consecutive sweeps had logged
    "discovery, not content", and the 08:00 cycle concluded from a domain-anchored query that
    "on this engine the site is not retrievable even by its own name". That was the right
    instrument pointed slightly wrong. This cycle **restricted** the search to
    `oxfordagentic.com` and asked three unrelated things - the bootcamp's proposition, November
    dates at Worcester College, and the Coding Bootcamp for non-developers. **All three returned
    the same three URLs**: `/`, `/guides/after-the-ai-executive-programme/` and
    `/guides/claude-cowork-claude-code-or-codex/`. Never an event page, a programme page,
    `/events/`, `/bootcamps/` or any of the other 30 guides, even when the query named
    registering and the venue outright. The site is **in** the index. **Three of 55 URLs are.**
  - **What that settles.** It is coverage, not absence, and it explains the five sweeps: an open
    buyer question can only be answered from a page the engine holds, and the only one it holds
    that could answer most of them is the homepage. It also closes **backlog 40** from the
    direction the item did not anticipate. Its own test was "re-probe once `/events/` has been
    recrawled - if the index fix moves anything, that is the evidence". `/events/` is not in the
    index, so its 21 Oct `ItemList` could never have moved anything, and waiting another cycle
    for it would have measured nothing again. The homepage is held. That is where the data goes.
  - **And the homepage is being read imperfectly, which is the second half of the argument.**
    Restricted to the domain and asked about the bootcamp, the engine answered *"The next listed
    cohort is on 21 October 2026 at the Pitt Rivers Museum"* and attributed that day to the
    Agentic Bootcamp. The 21 October day is the **Second Brain** Bootcamp and it has run; the
    homepage has listed 19 and 26 November since the 21 Oct past-tense sweep. A stale copy of
    the one page it holds, with no dates or statuses on it a machine could prefer to the prose.
  - **The change, in three parts.**
    - `src/pages/index.astro` now emits an `EducationEvent` node per upcoming cohort into the
      homepage graph - two today, 19 and 26 November - each from `eventListingItem` under the
      `@id` its own event page publishes, so a consumer holding both describes one event rather
      than two. The graph goes from `Organization, WebSite, WebPage, FAQPage` to that plus two
      events, and the events are tied in by `organizer: {@id: #organization}` rather than
      sitting loose.
    - `getHomeUpcoming()` in `src/lib/site.ts` is the single source of the capped set. The
      homepage now publishes it twice - as the "Next in Oxford" cards and as the JSON-LD - and
      structured data has to describe what the page shows, so a second hand-written
      `slice(0, 3)` was exactly how the two would have come to disagree. `HomeSections.astro`
      takes its `nextThree` from it.
    - `eventListingItem` gains `image` and `offers`, from a new shared `eventOffer` helper that
      `eventSchema` now uses too. **This is a latent defect found by the change rather than
      looked for:** the project's schema checker requires Google's nine Event fields, the
      listing node carried seven, and it passed every build since 22 Oct because the checker
      reads top-level `@graph` nodes and the node was nested inside `/events/`'s `ItemList`.
      Emitting it top-level made the rule fire. Honouring it beat nesting the homepage's copy
      to evade it: an Event without `image` and `offers` is not eligible for an event rich
      result anyway, and both are derived, not new - the image is the cohort's own OG card, the
      Offer is the price-free one its page already publishes. `/events/`'s five nested items
      gained the same two fields, which is the same defect fixed where it was written.
  - **No new fact, checked rather than asserted.** Every field of both homepage nodes was
    compared against the canonical node on the matching event page: **0 disagreements** across
    13 fields each. The five fields the summary omits (`inLanguage`, `performer`, `sameAs`,
    `subEvent`, `superEvent`) are omissions, not contradictions. Past cohorts' offers carry **no
    `availability`** - the 22 Oct rule that a day which has simply run is not "sold out" moved
    into `eventOffer` unchanged and still holds, verified on all five.
  - **Measured whole-site.** Exactly **two** files in `dist` differ across all 63 pages, `/` and
    `/events/`, and in both the HTML outside the JSON-LD block is **byte-identical** - 48,807
    and 31,581 bytes before and after. No content file touched, no copy written, no
    `updatedDate` moved, so the sitemap carries no new `lastmod`. `llms.txt`, `llms-full.txt`
    and every canonical are unchanged. No page anywhere has a duplicate `@id`.
  - **Checks.** `npm ci` then `npm run build` clean before and after - 61 pages built, 63
    checked, 3,094 internal links resolve, titles and descriptions unique, no SEO warnings,
    schema valid at **7 Event nodes** (5 + the homepage's 2) and 9 FAQPage nodes. `check:flags`
    passes both the all-on and all-off builds. `astro check` could not run - `@astrojs/check` is
    not installed and `npx` wanted to fetch it - so `tsc --noEmit --strict` ran on both changed
    lib files: **17 errors before, 17 after**, the same pre-existing implicit-`any` callbacks,
    none on a changed line. `indexnow-ping.mjs --dry-run` submits 55 URLs, which **over-submits
    by design**: `schema.ts` and `site.ts` are template-wide in the script's map where this
    change moves two pages. Known, cheap, and not worth a second change in the same cycle.
  - **Inspected in headless Chromium** at 375px and 1280px on `/`, `/events/` and both bookable
    event pages, served from a local static server over the built output: **0px horizontal
    overflow in all 8 configurations**, one `h1` each, every JSON-LD block parses, correct
    canonicals, no `robots` meta on any of them, both November dates visible on `/` and
    `/events/` at both widths, and the homepage reporting **2** top-level event nodes where the
    baseline reported 0. The only failing requests are Google Tag Manager and the two Luma
    embeds, blocked by the sandbox egress policy, and identical in the baseline run.
    Screenshots were byte-identical before and after at both widths on all four pages - once
    animations were disabled. Worth recording why: the first comparison showed 7 of 8 differing,
    and two runs of the **same** build then differed the same way, which is the reveal and
    micro-interaction animations, not the change. With `reducedMotion` and animations off the
    run is deterministic, and then before and after match exactly.
  - **Production state from the Actions API.** Run 284 (`c83bde0`, the current `main` HEAD)
    success on all three jobs, nothing queued or in progress. The IndexNow job's own log
    confirms what this sandbox cannot see: it fetched `https://oxfordagentic.com/build.txt`,
    matched the pushed SHA, and reported `submitted 55 URL(s), status 200`. So **production is
    live and current at `c83bde0`**, verified from the runner rather than from here -
    `oxfordagentic.com` answers 403 on CONNECT from this sandbox and does not resolve.
  - **Off-page.** One new entry, correcting the one below it: the coverage measurement above,
    with what follows from it. Backlog 2 stays the highest-value open item and now has a target
    rather than a hope - submitting `sitemap-index.xml` offers 55 URLs to a crawler that has
    found 3, and the three to Request-index by name are `/events/`, the Cohort 3 page and the
    Coding Bootcamp page, because those are the three the engine was asked for and could not
    produce. It also leaves a repeatable measurement: restrict a search to the domain, ask three
    unrelated things, count distinct URLs. Today that is 3. Nothing contacted, nothing
    submitted, no account made.
  - **One product gap recorded, not written.** Asked for a UK one-day in-person Claude Code
    course for non-developers, the engine answered *"Nothing I found lists a future UK
    in-person, one-day Claude Code course for non-developers"*. The Coding Bootcamp on 26
    November is exactly that. Not a content gap - the page exists - which is the coverage
    finding again, on the newest product line.
  - **No guide: 2 of 3 this week, and today's allowance deliberately unspent.** Two declines on
    the topic rule. *Choosing the first task to automate* is **not winnable** - Salesforce's
    Trailhead holds four of the first ten results on its own subject, with G2, Bardeen and Sista
    around it, and `how-to-choose-your-first-agentic-task` is already the site's page for it.
    *Hands-on AI for marketing teams* is **winnable but weakly converting** - every result is a
    provider selling the same day, so the searcher is comparing vendors on price and format, not
    looking for a question nobody answers. Not a Q&A refresh either.

- **2026-10-23 (09:00 local cycle) - every page printed the one contact address the site has as
  `hello@oxfordagentic.co` with a lone `m` on the line beneath it, at every desktop width.**
  - **The fault, measured on all 55 indexable pages at eight viewport-and-text-size
    combinations.** The footer's "Elsewhere" column is 159-161px wide from 1,100px up and the
    address renders 172px, so it wraps. `a[href^='mailto:'] { overflow-wrap: anywhere }` - added
    on 20 Oct to stop the same 23-character word setting a page's minimum width - then breaks it
    at the last character that fits, wherever that falls. At **1280 and 1440 with normal text,
    all 55 pages** split it as `hello@oxfordagentic.co` + `m`; at 1100px as `hello@oxfordagentic.`
    + `com`; at 900px as `.c` + `om`. At a 24px browser default the newsletter fallback split it
    on **32 pages** and the About contact button on one. Every one of those breaks lands inside
    the domain, and `.co` is itself a real top-level domain, so the first line reads as a
    complete and wrong address.
  - **Why it had not been caught.** The loop's standing sweep reads 375, 768 and 1280 and asks
    whether a page overflows. This never overflows - the text wraps inside its column, and the
    page measures 0px either way - so it is invisible to the overflow check and only shows up if
    you read the words. It is also absent at 375 and 768, where the column is wide enough.
  - **The change: one shared component, five call sites, one `<wbr>`.**
    `src/components/EmailAddress.astro` prints the address with a break opportunity after the
    `@`. A browser prefers a real soft-wrap opportunity to an arbitrary one, so the address now
    breaks as `hello@` + `oxfordagentic.com` and both halves read as themselves. It replaces the
    bare `{config.brand.email}` in `Footer.astro`, `NewsletterForm.astro`, `about.astro` and
    `privacy.astro` (twice) - every place the address is shown to a reader. The `mailto:` href
    stays at each call site, because the subject line and the styling differ. The
    `overflow-wrap: anywhere` rule is untouched and still catches the case where even the domain
    will not fit.
  - **Result, same eight combinations.** Addresses broken inside the domain: **55 -> 0** at
    1280/16, **55 -> 0** at 1440/16 and 1280/20, **33 -> 0** at 375/24, **37 -> 3** at 320/24.
    The three left are a pre-existing prose break (`hello@oxfordagentic.` + `com`) on one page at
    320px with 24px text, unchanged by this and the least-bad arbitrary split there is. At 320,
    375, 768 and 1024 with normal text **no address wraps at all, before or after** - the
    default experience of the site is unchanged except in the footer.
  - **The trade, stated rather than buried.** At a 20px or 24px browser default the address now
    breaks after the `@` in places where it previously sat whole on a line of its own: 33 -> 92
    wrapped instances at 375/24. That is greedy line-filling taking the new opportunity, it
    costs the paragraph no extra lines (the footer signup block measures 315x269.77px before and
    after), and the worst reading it can produce is `hello@` + `oxfordagentic.com`. At 16px it
    costs nothing: 0 wrapped addresses before and after on all four phone and tablet widths.
  - **Measured whole-site.** Exactly **61** built files differ and every one differs **only** by
    inserted `<wbr>` tags - verified by stripping them and comparing bytes, which makes all 61
    identical to the baseline build. No stylesheet, script, sitemap, `llms.txt`, `llms-full.txt`,
    canonical or JSON-LD node changed. No content entry was touched, so no `updatedDate` moved.
  - **The link itself is untouched where it counts.** `textContent`, `innerText`, the accessible
    name and the text a visitor gets when they select and copy it are all exactly
    `hello@oxfordagentic.com` - `<wbr>` contributes no character. `href` unchanged. The About
    contact button still measures **265x52**, the figure recorded when that button was last
    changed on 20 Oct.
  - **Checks.** `npm ci`, then `npm run build` clean - 61 pages built, 63 checked, 3,094 internal
    links resolve, schema valid, 5 Event and 9 FAQPage nodes, titles and descriptions unique. The
    11 outbound warnings are the sandbox egress policy. `npm run check:flags` passes both the
    all-on and all-off builds. `astro check`: **79 errors, 0 warnings, 4 hints - identical to the
    figure recorded on 20 Oct**, so this adds none; they are the pre-existing implicit-`any`
    reports. Whole-site sweep in headless Chromium across all 55 sitemap pages at 320, 375, 768
    and 1280: no horizontal overflow anywhere, no missing alt text, no unlabelled form control,
    one `h1` per page, no heading-level skip, no duplicate id, no `target="_blank"` without
    `rel`, no page errors - identical to the same sweep run against HEAD before the change.
    Keyboard: Tab reaches the footer address (23 presses at 375px, 28 at 1280px), it matches
    `:focus-visible`, and the ring is the gold 2px outline at 3px offset. Footer screenshots read
    before and after at 375, 768, 1280 and 1280/20, plus the signup block and the About contact
    band at 375/24.
  - **Production state from the Actions API.** CI and Deploy to GitHub Pages both success on
    `5559936`, the current `main` HEAD, nothing queued or in progress. `oxfordagentic.com` answers
    403 on CONNECT from this sandbox (`connect_rejected`, policy denial), so production could not
    be fetched or re-screenshotted and **no event fact was read or changed**. The change was
    inspected against a local `astro preview` of a build from that commit, and the before-state
    against a static server over the pre-change `dist`.
  - **One new backlog item (43), loop-actionable**: the footer grows an empty fifth grid column
    at 1,100px and up, which is why the Elsewhere column is narrower at 1440px than at 1024px.
    Prototyped and measured, logged rather than shipped - it is a DOM move, and this cycle was
    already changing the same file.
  - **Nothing else re-pitched.** PR #1 and `feat/ceo-roundtable-demand-page` were read as
    known-stale per backlog 20, which is the reading every cycle since 26 September has taken.
  - **No guide**, and no GEO probe: the cycle spent its time on a defect it could measure from
    inside the sandbox.

- **2026-10-23 (08:00 local cycle) - the entity node that 60 of 63 pages carry said nothing
  about who this organisation is not, while the engines kept confusing it with a similarly
  named Oxford provider and with the University.**
  - **The fault.** "Is Oxford Agentic affiliated with the University of Oxford?" is a settled,
    published question: the homepage FAQ answers it outright, and the About page, the privacy
    page and both llms files repeat it. It reached **3 of the 63 built pages**, and none of the
    pages that take a booking or that rank for an Oxford AI course. The `Organization` node,
    which **60 of the 63** pages carry, had `description`, `email`, `founder`, `logo` and
    `address`, no `sameAs`, and nothing at all on the point.
  - **Why it was worth the cycle, measured today rather than assumed.** Asked *"which Oxford AI
    course is hands-on building rather than lectures"*, the engine introduced a competitor as
    *"a private provider that is not part of the University of Oxford"* - that company's
    independence is legible to it. Asked the same thing one phrasing over, it named **this**
    bootcamp as the best match and described it only as *"hosted by Drummond Gilbert, who
    tutors at Saïd Business School"*, which a reader can fairly take as a University
    connection. Both probes returned `trustpilot.com/review/oxfordaitraining.com` on this
    entity's own subject, which is the 22 Oct finding from the other side: that cycle logged
    the engine offering **that company's** Trustpilot reviews for **this** bootcamp while
    warning it could not confirm the connection. Saïd's own agentic programme ranks on the
    brand-anchored query. Entity confusion is the live failure mode, from three sides now.
  - **The change.** `Organization.disambiguatingDescription` - schema.org's own field for
    telling an entity apart from similar ones - fed by a new `brand.disambiguation` string in
    `site.config.ts`: *"Oxford Agentic is an independent company in Oxford, England, running
    its own one-day, hands-on AI bootcamps. It has no affiliation with the University of
    Oxford, its colleges, or any other institution: college rooms are hired as venues and that
    is the whole relationship. It is a separate organisation from any similarly named Oxford
    AI training provider or university AI programme."* (382 characters.)
  - **No new fact is asserted, clause by clause.** The first is `brand.longDescription`; the
    second is the homepage FAQ's answer verbatim; the third is that same answer's *"we hire the
    city's rooms ... and that is the whole relationship"*; the fourth is what the second one
    means. **No company is named**, so nothing here can be wrong about anybody else.
  - **Why the node and not the copy.** Putting the sentence on the event and programme pages
    would be a copy change on the conversion path, and the event template carries Drummond's
    own 4 Aug instruction that "the programme page's one job is the booking path". The
    machine-readable route reaches 60 pages, changes nothing a visitor sees, and carries no
    ranking risk - it is not a title, a meta description or visible text. **Whether the
    booking pages should also say it in words is on the backlog for him (42).**
  - **Measured whole-site.** Exactly **60** files in `dist` differ, and every one of them
    differs **only** by that single inserted field - verified by stripping it and comparing
    bytes, which makes all 60 identical to the baseline build. The visible HTML is
    byte-identical on all 63 pages, as are the sitemap, `llms.txt`, `llms-full.txt` and every
    canonical. No content file touched, no copy written, no `updatedDate` moved.
  - **Checks.** `npm ci` then `npm run build` clean before and after - 61 pages built, 63
    checked, 3,094 internal links resolve, schema valid, 5 Event and 9 FAQPage nodes, titles
    and descriptions unique, no SEO warnings. `check:flags` passes both the all-on and all-off
    builds. All 63 pages' JSON-LD re-parsed from the built output: **0 parse failures, 60
    Organization nodes carrying the field.** `indexnow-ping.mjs --dry-run` on the two changed
    files submits **55 URLs**, which is correct - the change moves 60 built pages, 55 of them
    sitemap URLs. The 11 outbound warnings are the sandbox egress policy. Headless Chromium at
    375px and 1280px on the homepage, both bookable event pages, `/about/` and the flagship
    programme page: **0px overflow in all 10 configurations**, one `h1` each, every JSON-LD
    block parses, correct canonicals, zero page errors, and the affiliation sentence still
    visible on `/about/` only - the visible site is unchanged.
  - **GEO: five probes, none cited, and the fifth is the sharpest diagnostic this log has
    run.** The query was made domain-anchored - *"oxfordagentic.com Oxford Agentic Bootcamp
    hands-on"*, with the domain in the query string - and the engine answered **"The search
    didn't return oxfordagentic.com itself"**, then described the bootcamp accurately and
    entirely from two past Luma pages and allai.events, closing on the Worcester-versus-St
    Anne's contradiction, 21 July 2026 and "$275". **Seventeenth consecutive reading of the
    stale-listing harm, and the first that isolates index presence from ranking.** Five
    consecutive sweeps had concluded "discovery, not content"; this one shows why. Three
    declines on the topic rule (do-I-need-to-code is not converting; which-Oxford-course-is-
    hands-on is winnable and converting but needs unverifiable facts about named local
    providers and is the location-page pattern the hard rule forbids; December 2026 is a fair
    miss, since the cohorts are 19 and 26 November). One probe was mis-phrased - "keep an AI
    workflow running after the training day ends" was read as an ML training job - and is
    logged as such rather than read.
  - **Off-page.** One new entry, and it is a diagnosis rather than a lead: the retrievability
    finding above, with what follows from it - **backlog 2 (submit the sitemap in Search
    Console and request indexing) is now the highest-value open item on the whole list**, and
    backlog 2b (a third-party `sameAs`) behind it. Nothing contacted, nothing submitted, no
    account made. The Luma, allai.events and oxfordaitraining.com findings were already open
    and were not duplicated.
  - **Backlog 40 stays open and untaken**, for the second cycle running and for the same
    reason: its own test is a re-probe after `/events/` is recrawled, and today's probes
    returned no page of ours at all, which measures the engine's index rather than the fix.
    Adding the same structured data to the homepage would be writing into an index that does
    not hold the site.
  - **Production state from the Actions API:** run 281 success on `dd553a7`, nothing queued.
    `oxfordagentic.com` answers 403 on CONNECT and does not resolve from the sandbox. Search
    Console unavailable from the cloud; no export newer than the 24 Aug baseline in `seo-data/`.
  - **No guide:** 2 of 3 this week, and today's allowance unspent deliberately - the two
    candidates this cycle surfaced were both declined on the topic rule. Not a Q&A refresh
    either.

- **2026-10-23 (02:00 local cycle) - the page titled "AI bootcamp dates in Oxford" had no
  date in its description. The one field a searcher reads before clicking, and the one an
  answer engine quotes most readily, said only that dates exist somewhere inside.**
  - **The fault.** `/events/` is the page built to answer "when is the next cohort?". Its meta
    description read *"AI bootcamps and events in Oxford from Oxford Agentic - upcoming cohorts
    open for registration, and past cohorts with their outcomes."* That is true and it names no
    date, on the one page of the site whose entire content is dates. The same string fed
    `og:description`, `twitter:description` and the `WebPage` node's `description`, so four
    surfaces promised dates and gave none.
  - **Why it was worth the cycle.** The date question was re-run verbatim tonight, as backlog
    40's own test asks, 36 hours after the `/events/` structured-data fix. It came back
    **unchanged**: *"I couldn't find a November 2026 date for the Oxford Agentic Bootcamp
    itself"*, allai.events's 21 July 2026, both Luma pages with *"Neither snippet shows a
    date"*, and the St Anne's-versus-Worcester contradiction again. **Sixteenth consecutive
    reading of the stale-listing harm.** The site publishes 19 and 26 November 2026 in the
    header and footer of all 63 pages, on five cards on this very page and, since yesterday, in
    this page's `ItemList`. The field most often lifted into a snippet or an answer was the one
    place it did not.
  - **Not a CTR re-opening, and the distinction matters.** The 13 October verdict table closed
    `/events/` as "hub, title already burnt once" at 168 impressions, 1.2% CTR, position 9.7,
    under a standing instruction not to re-open a page on CTR until the named query share or
    the volume moves. Neither has, Search Console is unavailable, and **the title was not
    touched**. The description is a different field, carries no ranking risk, and the reason
    for changing it is tonight's GEO evidence rather than that table.
  - **The change, one file, and derived rather than written.** `src/pages/events/index.astro`
    builds the description from `upcoming`, which it already had in scope. It now reads *"The
    next AI bootcamps in Oxford are on 19 November 2026 and 26 November 2026. Every Oxford
    Agentic cohort, upcoming and past, with its date and venue."* (150 characters.) A cohort
    leaves that sentence when its day passes and joins it when one is added, so it cannot go
    stale the way a typed date does - the same reason the header CTA and the footer are derived.
    Singular and plural are both handled, three dates is the cap, the closing sentence is
    dropped if the pair would pass 160, and an empty upcoming list falls back to a dateless
    line. **No new fact is asserted:** both dates are already published on this page, in its
    JSON-LD and on every other page of the site.
  - **Measured, whole-site, before against after.** Exactly **one** file in `dist/` differs
    across all 63 pages, and inside it exactly four fields: `description`, `og:description`,
    `twitter:description` and `WebPage.description`. **The visible page is byte-identical**, as
    are the sitemap (so no `lastmod` churn), `llms.txt`, `llms-full.txt`, every canonical and
    every other page. No content file was touched, no copy written, no `updatedDate` moved.
  - **Checks:** `npm ci` then `npm run build` clean before and after - 63 pages, **3,094**
    internal links resolve, schema valid, **5 Event and 9 FAQPage nodes**, titles and
    descriptions unique, no SEO warnings (the new string is 150 against the 160 limit).
    `check:flags` passes both the all-on and all-off builds. `indexnow-ping.mjs --dry-run` on
    the changed file submits **1 URL**, `/events/`, which is exactly the one page whose output
    moved - the static-page branch doing what the 20:00 cycle rebuilt it to do.
  - **Inspected in headless Chromium at 375 and 1280px** on `/events/`, the homepage and the
    Cohort 3 page - 6 configurations: 0px horizontal overflow in every one, one h1 each, every
    JSON-LD block parses, correct canonical, no image without alt text, zero page errors, and
    `/events/` renders all five cards at both widths. Screenshot read at 375px.
  - **GEO: five probes, none cited** - four new questions and the date re-run. Three were
    declined on the topic rule and the reasons are in `seo-data/geo-citations.md`: small
    business owners is **not converting** (chambers of commerce and funded sessions, one at
    £44); measuring time saved is **not winnable** (Salesforce, Microsoft and a vendor hold the
    page on their own subject); and in-house-versus-cohort is **selection, not absence** - every
    cited source is a training vendor selling one of the two answers, the engine said so itself,
    and `in-house-ai-day-or-send-people-to-a-cohort` is already the balanced page for it. Fifth
    consecutive clean sweep whose misses are discovery rather than content.
  - **Backlog 40 stays open and untaken.** Its test was to re-probe once `/events/` had been
    recrawled. The re-probe returned no page of ours at all, which measures the engine's index
    rather than the fix, and 36 hours is a recrawl interval rather than a verdict. Ask again in
    a few days.
  - **Off-page: no new lead.** Everything recurring tonight - allai.events, learnersink.com, the
    two retired Luma pages - is already open on `outreach/review-list.md`, so nothing was
    duplicated. `createwith.com` was looked at and **not added**: it published one Belfast event
    under Belfast, Derby and generic city URLs, which is the doorway pattern the rules forbid.
    Nothing contacted, nothing submitted, no account made.
  - **Production state came from the Actions API:** run **280 success** on `218ea1e` at 19:13
    UTC on 22 Oct, nothing queued or in progress. `oxfordagentic.com` answers **403 on CONNECT**
    from the sandbox and does not resolve through the fetch tool either, so `build.txt` could
    not be read, as on every cycle since late September. Working tree clean and local `main`
    level with `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (`gcloud` reports no credentialed accounts,
    no export in `seo-data/` newer than the 13 October reading).
  - **Allowances:** no new guide - **2 of 3** this week (19 and 20 October) and today's unspent.
    Not a Q&A refresh: no question was added anywhere, and the one candidate the probes raised
    was declined because the page that answers it already does, in prose, in a balanced way.
  - **The standing prompt's event facts are stale, fifth cycle running.** It names Cohort 3 as
    15 October and the Second Brain Bootcamp as upcoming on 21 October, where the repo has
    **Cohort 3 on 19 November**, the **Second Brain Cohort 1 already run**, and a **Coding
    Bootcamp on 26 November** it does not list at all. Both of its KNOWN CANDIDATES are closed:
    the `src/lib/home.ts` IndexNow mapping is correct, and the past-tense sweeps are done.

- **2026-10-22 (20:00 local cycle) - the loop's own indexing lever was telling the engines
  about three pages when sixty-one had changed. Every cohort date, venue and past-tense sweep
  this month went out with fifty-eight changed pages unannounced.**
  - **The fault.** `scripts/indexnow-ping.mjs` maps changed files to page URLs so the deploy job
    can tell Bing-family engines (and so ChatGPT's web answers) what moved. An event file mapped
    to three URLs - `/events/<slug>/`, `/events/` and `/`. A programme file mapped to two -
    `/bootcamps/<slug>/` and `/`. Both were wrong, and had been since the script was written in
    cycle 41.
  - **Measured, not reasoned.** The baseline build was kept and each case was reproduced by
    editing one field and rebuilding:
    - **Events.** Moving Cohort 3 from 19 to 20 November changes **61 of 63 built pages**, plus
      `llms.txt`, `llms-full.txt` and the sitemap. The cause is on every page: the header CTA
      renders "Next Bootcamp - 19 Nov 2026" and the footer repeats the date under the cohort
      name. An event file is the only thing that can move them. **55 sitemap URLs change; three
      were submitted.**
    - **Programmes.** Changing `second-brain-bootcamp`'s `shortPitch` changes **13 sitemap
      pages** - the programme page, `/bootcamps/` (which prints each programme's name,
      shortPitch and next cohort date), `/`, and the **10 guides naming it in
      `relatedProgrammes`**, each of which carries the same programme card. **Two were
      submitted.** Repeated on the flagship as a check: 24 tagged guides, 27 sitemap pages, and
      the new mapping predicts 27 exactly.
  - **Why this was worth the cycle over anything on-page.** Fourteen consecutive cycles have now
    read the same harm - an engine answering a question about our own dates off a stale third
    party - and this cycle's four probes were a fourth clean sweep of misses that are
    *discovery*, not content. Most of discovery is backlog 2b's and Drummond's. This is the one
    part of it the loop owns outright, and it has been quietly half-working through every
    past-tense sweep of the last fortnight, which are exactly the pushes whose whole point was
    to stop engines repeating something that had stopped being true.
  - **The change, one file.** `events` now sets `wholeSite`, the same branch a template change
    takes, because there is no smaller correct set: the header and footer are on every page.
    `programmes` gains `/bootcamps/` and the guides that name it, via a new
    `guidesForProgramme()` that reads `relatedProgrammes` out of the guides directory - **not**
    whole-site, because the 42 pages that never name the programme genuinely do not change.
  - **And a `--dry-run` flag, which is the part that stops this recurring.** This bug survived
    44 deploys because the only way to check the mapping was to ping production, and the
    standing rules rightly forbid running the script by hand. `--dry-run` prints the URL list
    and exits before the POST. Every claim above was verified through it: event file 55,
    second-brain programme 13 (naming the exact 10 guides the rebuild moved), flagship programme
    27. Regression-checked on the branches that were already right and are unchanged: guide 2,
    team 1, static page 1, `src/lib/home.ts` 1, `src/lib/schema.ts` 55, `IMPROVEMENTS.md` and
    the ping script itself 0.
  - **Nothing a reader can see changed.** All **63 built pages are byte-identical** before and
    after; the only files that differ are the two sitemaps, by their build timestamps. No content
    file was touched, no copy written, no fact asserted, no `updatedDate` moved.
  - **This push will submit nothing, and that is correct.** `scripts/` check and ping scripts and
    `IMPROVEMENTS.md`, `outreach/` and `seo-data/` are all in the script's own
    never-changed-a-page list, so the deploy's ping job will report nothing to submit. The fix
    takes effect on the next push that touches an event or a programme.
  - **Checks:** `npm ci` then `npm run build` clean - 63 pages, **3,094** internal links resolve,
    schema valid, **5 Event and 9 FAQPage nodes**, titles and descriptions unique, no SEO
    warnings. `check:flags` passes on both the all-on and all-off builds. `node --check` on the
    changed script. The 11 outbound warnings are the sandbox egress policy.
  - **Inspected in headless Chromium at 375 and 1280px** on the homepage, `/events/`,
    `/bootcamps/` and both bookable event pages - 10 configurations: 0px horizontal overflow in
    every one, one h1 each, no image without alt text, every JSON-LD block parses, a correct
    canonical on each, zero page errors. A formality for a change with no page diff, and run
    because the rule says to run it.
  - **GEO: four probes, none cited, and the booking question is now a finding about Drummond's
    own Luma pages.** Asked *"when is the next Oxford Agentic Bootcamp cohort and can I book
    it"*, the engine ranked `luma.com/k7c2rm5s` (July) first and `luma.com/oxfordagentic2`
    (September) second, and **`luma.com/oxfordagentic3` - the page that sells 19 November - was
    not in the first ten**. On the review list. The **team-sized booking** question was asked for
    the first time and the engine dismissed the day as *"a fixed-size group"* from a stale
    listing; the site answers that question in four places already, and **nothing was reinstated
    into Cohort 3's FAQ**, because the file's own 17 Aug comment says that answer was moved into
    `assurances` under the booking form on purpose. The **one-day-enough** question was declined
    on WINNABLE - all ten results were providers describing their own courses, and the page we
    would have written exists. The **Coding Bootcamp** re-probe is unchanged one day after the
    linking fix, which is a recrawl interval, not a verdict. Full table in
    `seo-data/geo-citations.md`.
  - **Backlog 40 was deliberately not taken.** Its own test is to re-probe once `/events/` has
    been recrawled, and the `/events/` fix shipped six hours ago; this cycle's probes returned no
    page of ours at all on the date question, which measures the engine's index rather than the
    fix. A stronger variant was considered and declined on its merits so a later cycle does not
    reach for it: putting `event` on the **Organization** node would carry the next dates onto all
    63 pages, but by `@id` alone it would be an unresolvable reference on the 61 pages that do not
    define those nodes, and inlining the full event nodes site-wide duplicates event data on every
    page and invites exactly the contradictions the 14:00 cycle spent itself removing.
  - **Off-page:** one new item - the two retired Luma pages outranking the bookable one, which is
    his to decide because they are his pages. Recorded as evidence only, `tutorials.co.uk` held
    five of the first ten results on the team-booking query with per-town Oxfordshire pages, the
    same doorway pattern as learnersink.com and nobleprog.co.uk. Nothing contacted, nothing
    submitted, no account made.
  - **Production state came from the Actions API:** run **279 success** on `9cf133a` at 13:12
    UTC, nothing queued or in progress. `oxfordagentic.com` answers **403 on CONNECT** from the
    sandbox and does not resolve through the fetch tool either, so `build.txt` could not be read,
    as on every cycle since late September. Working tree clean and local `main` level with
    `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials, and
    no export in `seo-data/` newer than the 13 September reading).
  - **One new backlog item, 41** - the third and mildest under-submission, a guide edit moving
    its four sibling guides' "More guides" blocks. Not fixable with a static map; the shape of
    the right fix is recorded.
  - **Allowances:** no new guide - **2 of 3** this week (19 and 20 October) and today's unspent.
    Not a Q&A refresh: no question was added anywhere, and the one that was considered was
    declined against a settled decision in the file itself.
  - **The standing prompt's event facts are stale, fourth cycle running.** It names Cohort 3 as
    15 October at Worcester College and the Second Brain Bootcamp as upcoming on 21 October,
    where the repo has **Cohort 3 on 19 November**, the **Second Brain Cohort 1 already run**,
    and a **Coding Bootcamp on 26 November** the prompt does not list at all. Its KNOWN CANDIDATE
    1 (the `src/lib/home.ts` IndexNow mapping) has been fixed for some time and is correct;
    KNOWN CANDIDATE 2's past-tense sweeps are all done. Worth refreshing.

- **2026-10-22 (14:00 local cycle) - the page titled "AI bootcamp dates in Oxford" published
  five names, five URLs and not one date in its structured data. On the same morning an engine
  asked when the next cohort runs, found no page of ours, and took 21 July 2026 off a third
  party. Each cohort on `/events/` now carries its own date, venue and status.**
  - **The fault.** `collectionPageSchema` emits a `CollectionPage` whose `ItemList` holds a bare
    `ListItem` per entry - `position`, `name`, `url`. That is right for `/guides/`, `/bootcamps/`
    and `/team/`, which list pages. On `/events/` the listed things are dated events, and the
    visible page is nothing but their dates: five cards, each with a weekday, a full date and a
    venue, plus the two upcoming ones in the header and the footer of all 63 pages. The
    machine-readable half of that page said only that five pages exist.
  - **Why it is worth a cycle.** This is the thirteenth consecutive GEO reading of the same
    harm, and the first where the loop found a cause on our own side rather than a third
    party's. Asked *"when is the next Oxford Agentic Bootcamp cohort date November 2026"* - the
    bootcamp named outright - the engine answered **"I couldn't find a November 2026 date for
    the Oxford Agentic Bootcamp itself"**, gave allai.events's **21 July 2026**, said the two
    Luma pages *"give no date in these results"*, noted *"one lists St Anne's College as the
    venue and the other lists Worcester College, so the pages may be for different sessions"*,
    and ended *"to confirm a bootcamp date, check the Luma page directly or ask the
    organisers."* The Oxford-anchored commercial query the same cycle repeated the July date
    and the venue contradiction. The site publishes 19 November 2026 at Worcester College. The
    page built to answer that question had no answer in the format an engine extracts most
    reliably, and a stale third-party listing did.
  - **The change.** `collectionPageSchema` takes an optional `item` per entry, used only by
    `/events/`. `eventListingItem()` returns each cohort as an `EducationEvent` under the
    **same `@id` its own page already publishes**, so a consumer holding both describes one
    event rather than two. It carries name, description, startDate, endDate, eventStatus,
    eventAttendanceMode, location and organizer; the agenda, the photos, the series and the
    offer stay on the detail page, which is what the `url` is for.
  - **No fact is new, and that was checked rather than asserted.** Every field in all five
    summary nodes was compared field-by-field against the canonical node on the matching detail
    page: **0 disagreements**, because both now derive from two extracted helpers - `eventPlace`
    for the address and `eventStatusOf` for the status - which `eventSchema` was refactored to
    use at the same time. The seven fields the summary omits (`image`, `inLanguage`, `offers`,
    `performer`, `sameAs`, `subEvent`, `superEvent`) are omissions, not contradictions. No
    content file was touched, no copy written, no `updatedDate` moved, so no sitemap `lastmod`
    changes.
  - **Measured, whole-site, before against after.** Exactly **one** file in `dist/` differs
    across all 63 pages: `/events/index.html`. Everything outside its JSON-LD block is
    **byte-identical**, and so is its visible text. The homepage, the five event pages, the
    sitemap, `llms.txt`, `llms-full.txt` and every canonical are untouched.
  - **IndexNow will over-submit this one, by design and not by fault.** `src/lib/schema.ts` is
    not in `scripts/indexnow-ping.mjs`'s specific map, so it counts as a template change and the
    deploy job submits every sitemap URL - where exactly one page's output moved. That is the
    script's deliberate default (a shared template usually does change every page) and it is
    not worth a second change in the same cycle to special-case; noted so a later cycle reading
    the ping log knows why ~44 URLs went in for a one-file diff.
  - **Checks:** `npm ci` then `npm run build` clean before and after - 63 pages, **3,094**
    internal links resolve (unchanged), schema valid, **5 Event and 9 FAQPage nodes
    (unchanged** - the checker counts top-level graph nodes, so nested items are not
    double-counted, the same as the existing `subEvent` nodes), titles and descriptions unique,
    no SEO warnings. `check:flags` passes on both the all-on and all-off builds. `astro check`
    could not run - `@astrojs/check` is not installed and `npx` wanted to fetch it, which this
    cycle would not do - so `tsc --noEmit` was run on `src/lib/schema.ts` instead: **17 errors
    before and 17 after**, the same pre-existing `implicitly any` map callbacks, none on a
    changed line, and none in the new code.
  - **Inspected in headless Chromium at 375, 768 and 1280px on `/events/`, the homepage and
    both upcoming event pages - 12 configurations.** 0px horizontal overflow in every one, one
    h1 each, no heading-level skip, no image without alt text, every JSON-LD block parses, zero
    page errors, and `/events/` reports its five dated items at all three widths. The only
    failed requests are `googletagmanager.com` and `luma.com`, which is the sandbox egress
    policy. Screenshots of `/events/` are **byte-identical** before and after at all three
    widths, which is what a JSON-LD-only change should produce. Three other screenshots did
    differ - the homepage at 375 and 1280 and the Coding Bootcamp page at 375 - and all three
    were then shown to differ **between two runs of the same build**, so they are the reveal
    animations and the Luma placeholder, not this change; their HTML is byte-identical. The
    page was also read at 375 and 1280 with reveals forced and the consent banner removed: all
    five cards render, one column on mobile and three across on desktop, and the dates on the
    cards match the dates in the new nodes exactly.
  - **GEO: four probes, none cited, and one of them is new.** *"Oxford Agentic Bootcamp reviews
    what do attendees say worth it"* had never been asked. The engine said **"I couldn't find
    any reviews from attendees of the Oxford Agentic Bootcamp itself"** and offered **Trustpilot
    reviews for `oxfordaitraining.com`** - a different company with a confusable name - while
    warning it could not confirm the connection, and read *"tickets start at from $275"* off a
    stale listing again. `/testimonials/` has four named, attributed quotes and was cited
    nowhere. **Nothing was written on the strength of it**: the page exists and says what it
    should, so that is third-party absence, which is backlog 2b's territory and his. It went on
    the review list instead. The definitional *"what is an agentic workflow"* query was probed
    and **declined on both halves of the topic rule** - the field is vendor blogs about their
    own products and the searcher is reading, not booking - and should not be re-probed. Full
    table in `seo-data/geo-citations.md`.
  - **Off-page: one new item, no new directory lead.** The Trustpilot entity-confusion finding
    above, which needs a yes or no from him on whether a third-party review surface is wanted at
    all. Recorded as evidence only, not as a route: **learnersink.com held two of the first ten
    results** on the next-date query with per-tool Oxford location pages, the same doorway
    pattern as the nobleprog.co.uk finding at 08:00 and the one the backlog's hard rule forbids.
    allai.events, coursereport.com and createwith.com all recurred and are already on the list,
    so nothing was duplicated. Nothing contacted, nothing submitted, no account made.
  - **Production could not be read, as on every cycle since late September.**
    `oxfordagentic.com` answers **403 on CONNECT** from the sandbox, so `build.txt` could not be
    read and before/after is local build against local build from `719cad3`, the SHA the live
    site was deployed from. Deploy run **278 success** on `719cad3` at 08:34 UTC; nothing queued
    or in progress. Working tree clean and local `main` level with `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials, and
    no export in `seo-data/` newer than the 13 September reading).
  - **Two loop-actionable gaps found and deliberately not shipped**, logged as backlog 39
    (`/testimonials/` still has no `ItemList`, and the honest answer may be that it should not
    have one, since `Review` markup about oneself is not something this site should publish) and
    40 (the homepage publishes no event data either - re-probe once `/events/` is recrawled
    before deciding, so the decision rests on whether this cycle moved anything).
  - **Allowances:** no new guide - **2 of 3** this week (19 and 20 October) and today's unspent.
    Not a Q&A refresh either: no question was added anywhere. This is a structured-data change,
    which neither allowance governs.
  - **The standing prompt's event facts are stale, third cycle running.** It names Cohort 3 as
    15 October at Worcester College and the Second Brain Bootcamp as upcoming on 21 October,
    where the repo has **Cohort 3 on 19 November**, the **Second Brain Cohort 1 already run**,
    and a **Coding Bootcamp on 26 November** the prompt does not list at all. Worth refreshing.

- **2026-10-22 (09:00 local cycle) - the three past event pages still headed their own
  facts card "Who it is for" and "What you will build", so a day that ran in July was
  promising a reader what they would build on it. The labels now change tense once the
  day has run, exactly as the agenda heading on the same page already did.**
  - **The fault.** `src/pages/events/[slug].astro` already switches one heading on
    `isPast` - `{isPast ? 'How the day ran' : 'What happens on the day'}` at the agenda
    band. The two `<dt>` labels in the facts card above it were never given the same
    treatment, so on `/events/oxford-agentic-bootcamp-cohort-1/`,
    `.../cohort-2/` and `/events/oxford-second-brain-bootcamp-cohort-1/` the card read
    **WHO IT IS FOR** and **WHAT YOU WILL BUILD** directly under a hero band headed *"This
    event has run"* and a capsule in the past tense. The same two labels went into
    `llms-full.txt` for the same three events, from `src/lib/llms.ts`.
  - **Why it is worth a cycle.** It is the same class the last three cycles have been
    working - a past page still speaking as if the day is ahead - and it sat on the part
    of the page that answers *what was this?*, which is the whole job of a past cohort
    page under the `/events/` standfirst ("past ones stay here with what came out of
    them"). It also reads oddly to a buyer sent to Cohort 1 or 2 as evidence: the page
    tells them what they *will* build on a day they cannot attend.
  - **The wording, and what it deliberately does not claim.** Past pages get **"Who it was
    for"** and **"What the day was built around"**. The list items are the day's intended
    deliverables, so the past label describes how the day was *designed*, not what any
    individual left with. That matters here: Cohort 2 records no outcomes, and the Second
    Brain Cohort 1 file says in its own comment that nothing about the day has been
    confirmed, so a label like "What the room built" would have asserted an outcome the
    content does not carry. No fact was added, no content file was touched, and no
    `updatedDate` moved, so no sitemap `lastmod` changes.
  - **Measured, whole-site, before against after.** Exactly **four** files in `dist/`
    differ across all 63 pages: the three past event pages (two `<dt>` strings each) and
    `llms-full.txt` (the same two labels, three times). The two upcoming event pages,
    `/events/`, the homepage, the sitemap, `llms.txt` and every canonical are
    **byte-identical**. Full-page screenshots at 375, 768 and 1280px are byte-identical on
    every upcoming page and on `/events/`, and on the three past pages every screenshot has
    **identical dimensions** before and after, so there is no layout shift - the longer
    label still sets on one line at 375px.
  - **Checks:** `npm run build` clean before and after (63 pages, 3,094 internal links
    resolve, schema valid, 5 Event and 9 FAQPage nodes, titles and descriptions unique);
    `check:flags` passes on both the all-on and all-off builds; `astro check` is
    **79 errors / 0 warnings / 4 hints before and after**, all pre-existing `implicitly
    any` map callbacks, none on a changed line, and `src/lib/llms.ts` reports none.
    The whole-site audit in headless Chromium at 375, 768 and 1280px - horizontal overflow,
    missing alt text, unlabelled form controls, links and buttons without accessible names,
    duplicate ids, dangling `aria-*` references, `h1` count and heading order - is
    **identical across all 165 page/width rows**, with overflow still 0 everywhere. The 11
    outbound warnings are the sandbox egress policy, unchanged.
  - **Production could not be read, as on every cycle since late September.**
    `oxfordagentic.com` answers **403 on CONNECT** from the sandbox (`connect_rejected`,
    confirmed against the proxy's own status endpoint), so before/after is local build
    against local build from `ca67723`, which is the SHA the live site was deployed from.
    Deploy and CI both succeeded on `ca67723` at 07:10 UTC; nothing queued or in progress.
    Backlog 20 and the blocker note below still stand.
  - **Repository state.** `main` fast-forwarded from the stale checkout to `ca67723`. PR #1
    and the `feat/ceo-roundtable-demand-page` branch are the known-stale leftovers already
    on record (backlog 20), not unfinished work.
  - **No guide, no Q&A refresh.** This is a template tense fix, which neither allowance
    governs.

- **2026-10-22 (08:00 local cycle) - every past event page published a machine-readable
  "sold out" claim that nobody had written. It was derived from the day having passed, on
  the morning an answer engine answered *"can you still book the Oxford Agentic Bootcamp"*
  with no page of ours at all. The one availability signal this site controls now comes
  only from an authored fact.**
  - **The fault.** `eventSchema` in `src/lib/schema.ts` set `offers.availability` from
    `effectiveStatus`: `soldout` gave `SoldOut`, `upcoming` gave `InStock`, **and everything
    else fell through to `SoldOut`**. `effectiveStatus` derives `past` from `endDate`, so all
    three past days published `https://schema.org/SoldOut` in their `Event` JSON-LD. Only one
    of the three ever made that claim: *"sold out"* appears in `src/content/` for **Cohort 2
    alone** (its file records Luma's single Full Day Pass stopping at 13 of 14 the evening
    before). Nothing anywhere says Cohort 1 filled up, and the Second Brain Cohort 1 file says
    in its own comment that *nothing about the day has been confirmed* - while its schema told
    every engine the day had sold out.
  - **Why it is worth a cycle rather than a backlog line.** A day that has simply happened is
    not sold out. schema.org has no term for *"this has run"*, and `SoldOut` reads as *"it
    filled up"* - so the fall-through was not a neutral placeholder, it was an inference
    published as a fact about availability, which is the one class of claim the loop's
    accuracy rules name outright. The commercial edge is live rather than theoretical: the
    Second Brain Bootcamp is the most recent day, it has no successor date (backlog 36), and
    the 02:00 cycle recorded an engine offering its 21 October date to a buyer as *"the next
    listed cohort"* of the Agentic Bootcamp. An engine that takes the date from that page and
    the availability from the same node tells a buyer the next Oxford day is sold out.
  - **The change.** The fall-through becomes `undefined`, and `offers` spreads `availability`
    only when there is one. `SoldOut` is now reachable only from an authored `status:
    soldout`; `InStock` is unchanged for the two bookable days. **Cohort 2's sold-out fact is
    not lost** - it is published in the summary and the capsule, so it is inside that same
    `Event` node's own `description` (*"and sold out beforehand"*), in the words the author
    chose. What goes is the inference, not the evidence. The `Offer` stays valid without
    `availability`, which is recommended rather than required, exactly as `price` is - already
    omitted deliberately under PRD §18. `cancelled` also stops asserting `SoldOut`, which
    `eventStatus: EventCancelled` already says properly; no event is cancelled today.
  - **The evidence it was written from, this cycle's own probes.** *"can you still book the
    Oxford Agentic Bootcamp or is it sold out"* returned **no page of oxfordagentic.com**: the
    engine answered from `luma.com/k7c2rm5s` and `luma.com/oxfordagentic2` (both cohorts that
    have run) and allai.events, read *"5 Spots Remaining"* off a stale crawl, gave the date as
    *"21 Jul 2026 ... with tickets from $275"*, and concluded *"that session has passed unless
    there's a later date I didn't find."* The date-anchored query the same cycle produced *"I
    didn't find a one-day hands-on agentic AI workshop in Oxford in November 2026"* and sent
    the reader to *"the Oxford Agentic Bootcamp organiser's page for upcoming dates, since
    the listings I found don't show one."* **Tenth and eleventh
    consecutive readings of the stale-listing harm**, and the first on the buying question
    itself. Nothing in this repo reaches a third party's crawl; the availability this site
    publishes about itself is the part it owns, and it was wrong.
  - **Measured, whole-site, before against after.** Exactly **three files** in `dist/` differ
    across all 63 pages, and each differs by a single deletion of 44 characters -
    `"availability":"https://schema.org/SoldOut"` - on the three past event pages. Every other
    page, the sitemap, `llms.txt`, `llms-full.txt` and every canonical are **byte-identical**.
    `schema.org/SoldOut` now appears nowhere in the built site. No content file was touched,
    no copy written, no fact asserted, no `updatedDate` moved, so no sitemap `lastmod` changes.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,094**
    internal links resolve, unchanged; schema valid, 5 Event and 9 FAQPage nodes, titles and
    descriptions unique, no SEO warnings; `check:flags` passes both the all-on and all-off
    builds. The schema checker requires `offers` on every Event node and still passes, which
    is the point: the node stayed, the unsupported field went. The 11 outbound warnings are
    the sandbox egress policy, unchanged.
  - **Inspected in headless Chromium on all five event pages at 375px and 1280px - 10
    configurations.** 0px horizontal overflow in every one, one h1 each, no heading-level
    skip, no image without alt text, every JSON-LD block parses, `SoldOut` absent from the
    DOM, and **zero page errors**. The only failed requests are `googletagmanager.com` on all
    ten and `luma.com` on the two upcoming pages, which is the sandbox egress policy. The
    Second Brain page screenshots as it should at 375px: *"This event has run"*, no booking
    bar.
  - **GEO: five probes, none cited.** Three of the five misses are pages we already have -
    the national *"one day ... no coding"* query (missing since 13 September, and every one
    of those words is on the programme page), `how-to-choose-your-first-agentic-task`, and
    the delegation question `who-should-take-the-seat` was written for three days ago, where
    the engine again volunteered that *"the search didn't turn up any neutral guidance ...
    most results are vendor marketing pages"*. **Nothing was written on the strength of any
    of them**: restating a page that exists is the near-duplicate the rules forbid, and this
    is the second consecutive cycle whose probes say discovery rather than content. Full
    table in `seo-data/geo-citations.md`.
  - **Off-page: no new lead.** Everything returned today was a competitor's own marketing.
    `allai.events` recurred on two more queries and is already on the review list with the
    `$275` finding, so nothing was duplicated. Recorded as evidence only:
    **nobleprog.co.uk holds five of the first ten results** on the booking query, all
    location-shaped (`/agentic-ai/training/oxford`, `/ai-agents/training/oxford`, and three
    more per-tool variants) - the doorway pattern the backlog's hard rule forbids, noted so a
    later cycle knows what occupies that result set and not as a reason to reconsider.
    Nothing contacted, nothing submitted, no account made.
  - **Production state came from the Actions API, as all week.** `oxfordagentic.com` answers
    **403 on CONNECT** from the sandbox and does not resolve for `WebFetch`, so `build.txt`
    could not be read. Deploy run **275 success** on `3bab7bd`, the `origin/main` HEAD,
    finished 01:14 UTC; nothing queued or in progress. Working tree clean and local `main`
    level with `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **Allowances:** no new guide - **2 of 3** this week (19 and 20 October) and today's
    unspent. Not a Q&A refresh either: no question was added anywhere. This is a
    structured-data accuracy fix, which neither allowance governs.
  - **Known candidates, checked.** Candidate 1 (the `src/lib/home.ts` IndexNow mapping) is
    already fixed and still correct. Candidate 2 is discharged and was re-verified: nothing in
    `src/` or `dist/` still names a passed cohort as upcoming, and the two upcoming days are
    19 and 26 November. **The standing prompt's event facts are stale** - it names Cohort 3 as
    15 October at Worcester College and the Second Brain as upcoming, where the repo has
    Cohort 3 on **19 November** and a **Coding Bootcamp on 26 November** that the prompt does
    not list at all. Second cycle running that this has been flagged; worth Drummond
    refreshing the prompt.

- **2026-10-22 (02:00 local cycle) - the guide for the product that is on sale was offered
  in one "More guides" block out of 32, against a fair share of four. The clause written on
  15 October to stop exactly that bought it one slot and then switched itself off. It is now
  a floor, and the worst-served guide on the site went from 1 slot to 3, and from 3 inbound
  internal links to 5.**
  - **The measurement, taken on the built site before anything was changed.** Counting how
    many of the 32 guide pages offer each guide in its four-link "More guides" block: every
    guide is offered **3 to 7 times except one**. `why-the-code-an-agent-wrote-is-not-live`
    was offered **once**, by `claude-cowork-claude-code-or-codex` and nothing else. Counting
    unique inbound internal links across all 63 built pages instead, it scored **3** - the
    index, one sibling block and one body link - the lowest of any guide, against a median
    of 6. It is the editorial page for the **Coding Bootcamp**, which is one of only two
    bookable days (Cohort 1, 26 November), and it is the newest product line, with 4 tagged
    guides against the flagship's 24.
  - **Why the existing clause could not fix it, which is the whole of the diagnosis.** The
    15 October pass picks the four siblings for the whole corpus in one deterministic
    sweep, scoring shared programme 2 and shared category 1, and it carries one clause above
    score: a guide *"offered nowhere at all"* jumps the queue. That clause was written for
    this exact guide, and the comment says so. But it stops applying the moment a guide is
    offered once - and the moment it stops, the guide loses every subsequent contest for the
    identical reason it lost the first: it is the only guide tied to the Coding Bootcamp
    alone, so it scores 2 for exactly three sources and 1 for same-category sources, against
    24 guides that score 3 for any flagship source. One slot was the ceiling the clause could
    ever buy it, not a floor.
  - **The change is one word and a constant.** `=== 0` becomes `< FLOOR`, with `FLOOR = 3`.
    Three is not a round number picked for effect: 32 sources x 4 slots is **128 slots over
    32 guides**, so the fair share is exactly 4, and 3 is one below it - nobody falls more
    than a single slot short, and the clause goes quiet for everyone else, which is what
    keeps it from reshuffling the corpus on every build.
  - **Four values were simulated against the real corpus before one was written into the
    file, because a greedy pass is not monotonic in its own threshold.** FLOOR 2 leaves two
    guides under 3. FLOOR **4 and 5 are worse than 3, not better** - they drop the stranded
    guide back to 2 and 1 respectively, because raising the bar makes the clause fire for
    almost everyone and the priority cancels out. FLOOR 3 is the only value tested that
    clears the floor for all 32. The simulation reproduced the built baseline exactly
    (min 1, the same histogram), which is why its reading of the other values is worth
    anything.
  - **Subject relevance does not pay for it, which was the thing to check.** The 15 October
    design exists to keep the clusters cohesive - the second-brain guides surfacing each
    other was the fault that prompted it. After the change, **125 of the 128 picks share a
    programme with their source, against 124 before**, and **no pick shares neither
    programme nor category**. The second-brain block is still four second-brain guides. The
    stranded guide's three new sources are `what-you-can-build-in-one-day-with-ai` (shares
    the Coding Bootcamp outright) and two same-category `in-practice` guides.
  - **Result, measured on the rebuilt site.** Slot distribution went from `1, 3x6, 4x18,
    5x6, 7` to `3x8, 4x18, 5x4, 6x2`: the minimum rises from 1 to 3, the maximum falls from
    7 to 6, and the total is unchanged at 128. Unique inbound internal links: the stranded
    guide **3 to 5**, and the least-linked guide on the whole site is now 5 rather than 3.
    24 of the 32 guide pages change which four siblings they offer; nothing else on any page
    moves.
  - **No content file was touched.** No copy was written, no fact asserted, no event detail
    restated, no `updatedDate` moved, so no canonical, no sitemap `lastmod` and no `llms.txt`
    line changes. The diff is one constant and one comparison in
    `src/pages/guides/[...slug].astro`, plus the comment above them.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,094**
    internal links resolve - **unchanged**, because the number of sibling slots is fixed at
    four per page and only their targets moved - schema valid, 5 Event and 9 FAQPage nodes,
    titles and descriptions still unique, no SEO warnings. The 11 outbound warnings are the
    sandbox egress policy blocking `luma.com`, `linkedin.com`, `arxiv.org`, `elevenlabs.io`,
    `novaria.ai` and `ico.org.uk`, unchanged.
  - **Inspected in headless Chromium on all 32 guide pages at 375px and 1280px - 64
    configurations.** 0px of horizontal overflow in every one, one h1 each, no heading-level
    skip, no image without alt text, no page errors. The stranded guide was screenshotted at
    both widths with the block scrolled into view and renders as it did before, with four
    different links in it.
  - **GEO: five probes, and the Oxford-anchored commercial query names us first for the
    first time in nine cycles - while getting the date wrong.** *"hands-on agentic AI
    workshop Oxford business leaders build a working workflow one day"* opened *"The closest
    match is Oxford Agentic"*, then told the reader *"the next listed cohort is on 21 October
    2026 at the Pitt Rivers Museum"*. That is the **Second Brain Bootcamp**, which ran
    yesterday, offered as the Agentic Bootcamp's next cohort; the 19 November date it gives
    after it is right. The engine is reading a crawl from before last night's past-tense
    sweep, so the fix is already shipped and waiting to be recrawled. **Ninth consecutive
    cycle of the stale-listing harm, and the first where it is a wrong fact rather than an
    absence.** Full table in `seo-data/geo-citations.md`.
  - **Legal is killed, by the second phrasing backlog 38 asked for.** The product gap
    repeats - *"I found no one-day agentic AI workshop aimed specifically at UK law firms"* -
    but the field is the Law Society editorially on its own subject, two of the first ten
    results, with Thomson Reuters beside it; the law-specific training that exists is
    in-house and sold to firms rather than as cohort seats; and this site cannot speak to
    privilege or SRA duties without inventing. See backlog 38. The definitional query was
    declined for the second time and should not be probed again.
  - **The Coding Bootcamp axis was probed for the first time and is a real gap - but not a
    content gap.** *"learn Claude Code in person one day UK non-developer"* returned no page
    of ours and the engine's best UK in-person one-day answer was a London workshop whose
    date *"has already passed"*; everything else was online or at-your-office. Unlike
    finance, the words already sit together on our own page - the Coding Bootcamp programme
    page says one day, in person, Oxford, Claude Code and Codex, and "Do I need to be able
    to code? No" - so nothing was written. What the line lacked was discovery, which is what
    this cycle shipped. **Re-probe once the fix has been crawled.**
  - **Off-page: two new leads.** `gogradia.com`, a course aggregator already carrying Saïd
    Business School's own agentic AI programme on its own indexed page, and `iternal.ai`, an
    executive-education roundup. Both surfaced on the one query that now names us first, so
    they rank beside us. Price is the same open question as `cademy.io` and Eventbrite.
    Nothing contacted, nothing submitted, no account made.
  - **Production state came from the Actions API, as all week.** `oxfordagentic.com` answers
    **403 on CONNECT** from the sandbox, so `build.txt` could not be read. Deploy run **274
    success** on `6ba0448`, the `origin/main` HEAD, finished 19:12 UTC; CI run 264 success on
    the same SHA; nothing queued or in progress. Working tree clean and local `main` level
    with `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **Allowances:** no new guide - **2 of 3** this week and today's unspent. Not a Q&A
    refresh either: no question was added anywhere. This is an internal-linking fix, which
    neither allowance governs.
  - **Known candidates, checked.** Candidate 1 (the `src/lib/home.ts` IndexNow mapping) is
    already fixed. Candidate 2 is **fully discharged**: Cohort 2 (16 Sept) and the Second
    Brain Bootcamp (21 Oct) are both in the past tense, and the Agentic Bootcamp's next
    cohort is **19 November**, not the 15 October the standing prompt still names - the repo
    is the newer source and `luma.com` answers 403 on CONNECT, so nothing could be
    re-verified against Luma. There is also a **Coding Bootcamp on 26 November** that the
    prompt does not list. Worth Drummond refreshing the prompt's event facts.

- **2026-10-21 (20:00 local cycle) - the Second Brain Bootcamp ended at 17:00 today, and
  six published strings across four files still said it was coming. They now say it ran.
  This is known candidate 2, handed forward by the 14:00 cycle, which correctly judged it
  three hours early.**
  - **What was still claiming an upcoming day, at 19:58 BST, two hours after it ended.**
    The event file's `status: upcoming`; its capsule, *"Cohort 1 of the Oxford Second Brain
    Bootcamp **runs** on Wednesday 21 October 2026"*, which is also the page's meta
    description, its `og:description`, its schema description and its line in `llms.txt`;
    its summary, an offer in the imperative (*"Build a second brain ... and leave with it
    working"*) rendered on the `/events/` card; the FAQ *"When and where is it?"*, answering
    **"Registration is open - you can book on this page"**; the FAQ *"How do I register for
    Cohort 1?"*, answering **"Book directly on this page - the form takes your
    registration"**; and the invoice FAQ's **"Pricing and the booking form are on this
    page"**. On the programme page, *"Cohort 1 **is** at the Pitt Rivers Museum"*. In the
    homepage FAQ (`src/lib/home.ts`), *"the Second Brain Bootcamp **is** at the Pitt Rivers
    Museum"*, which a reader asking where the events are held reads as a day that exists.
    And in three guides, *"It **runs** on 21 October at the Pitt Rivers Museum"* twice and
    *"and the Second Brain Bootcamp **on** 21 October"* once.
  - **The template was already honest; the content strings were not.** `effectiveStatus`
    derives "past" from `endDate`, so the event page had already flipped itself: it renders
    "This event has run", hides the booking bar and the final call to action, and - because
    no successor exists - shows *"Dates for the next cohort are being confirmed"* with the
    notify form. Confirmed in the 1280px screenshot. What no derivation can reach is a
    sentence someone typed into a content file, and every string above is one.
  - **The test applied to each string, so the diff stayed a correction rather than a
    rewrite.** Does it, published tonight, tell a reader something untrue or ask them to do
    something they cannot do? Six did and were changed. Several did not and were left:
    "What should I bring?", the work-laptop answer's "worth checking before you book", and
    "What if I cannot make the date?" are odd on a past page but not false. Cohort 2's page
    is the precedent for the deeper cut - seven questions to three, on 23 Sept, **a week**
    after it ran, once there was something true to say about the day - and that pace is
    right. Logged as backlog 37; nothing about today was invented in the meantime.
  - **No new fact, no event fact, and no future date.** The dates, venue, times and
    `lumaEventId` are untouched, and `luma.com` answers 403 on CONNECT from the sandbox so
    nothing could have been re-verified anyway. Nothing claims a Second Brain Cohort 2
    exists and nothing claims one does not: the two guides and the event FAQs now use the
    site's own published wording for this state, *"dates for the next cohort are being
    confirmed"*, which is the line the template already renders. **Whether a date exists is
    Drummond's and is backlog 36** - four Second Brain guides and the programme page now end
    on a cohort nobody can book, which is honest and is not nothing.
  - **Two wordings were written and rejected.** The "Can I still join this cohort?" answer
    first steered the reader to the Agentic Bootcamp, which cross-sells between two
    programmes the FAQ directly above it works to keep distinct, and is a commercial call
    the loop does not make. It then offered "the form on this page takes your email", which
    is true only while `features.newsletter` is on - content that silently goes false when a
    flag moves, which `check:flags` exists to prevent. The published answer depends on
    neither.
  - **One string outside the Second Brain, and it is this morning's fix finished.** The
    09:00 cycle removed the unmet "dated" claim from `/testimonials/`. `src/lib/llms.ts`
    carried its own hardcoded copy - *"What attendees said, with names and dates."* - so the
    claim was still live in `llms.txt`, which is the knowledge base the two voice agents
    read. Now *"What attendees said, named and attributed."*, matching the page.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 61 pages built, 63
    checked, **3,094** internal links resolve - **unchanged**, because every link was kept
    and only its sentence moved tense - schema valid, 5 Event and 9 FAQPage nodes, titles
    and descriptions still unique, no SEO warnings. The schema check caught two real faults
    on the way: a summary at 174 characters against a 160 limit, and a straight apostrophe.
    The 11 outbound warnings are the sandbox egress policy blocking `luma.com`,
    `linkedin.com`, `arxiv.org`, `elevenlabs.io`, `novaria.ai` and `ico.org.uk`, unchanged.
    In `dist`: no page still says "runs on Wednesday 21 October" or "Cohort 1 is at the Pitt
    Rivers"; the only surviving "Registration is open" is the Coding Bootcamp's 26 November
    cohort, which is genuinely on sale; the FAQPage node carries the rewritten questions;
    canonical correct and indexable; `llms.txt` lists the event below the two upcoming ones
    and above Cohort 2, which is the right past ordering; sitemap `lastmod` moved for the
    four content URLs touched.
  - **Inspected in headless Chromium at 375px and 1280px on all seven affected pages** - the
    event page, the programme page, the three guides, the homepage and `/events/`:
    **0px of horizontal overflow in all fourteen configurations**, one h1 each, no
    heading-level skip, no image without alt text, no unlabelled control, no page errors.
    The three "unlabelled" links a naive check reports at 1280px are the collapsed desktop
    nav dropdown, which has text, and report identically on untouched pages. The event page
    was read at 1280px and renders the past state correctly.
  - **GEO: five probes, none cited, and the finding is one the repo cannot fix.** *"second
    brain workshop Oxford build AI context from your own documents"* - the most
    Oxford-anchored phrasing that line has, and one Perplexity answered with our pages at
    #1 to #5 on 13 September - returned **no page of ours**, the engine saying *"I found no
    workshop held in Oxford"* and advising the reader to try Eventbrite, Meetup or the
    University's continuing-education pages. Its sister probe concluded *"I didn't find a
    one-day, in-person, UK-based course that specifically teaches building a second brain
    for AI tools"*. **No Second Brain content was written on the strength of it**, because
    the standing decision is explicit that Second Brain's constraint is demand rather than
    ranking. **Caveat, as all month:** web search, not Perplexity, so not a like-for-like
    ranking drop. Full table in `seo-data/geo-citations.md`.
  - **Two vertical axes opened, one kept and one closed.** Legal is the same shape as the
    finance gap acted on at 14:00 - *"I found no UK one-day hands-on course that is clearly
    labelled agentic AI for law firms"*, with the near misses named and dismissed by the
    engine itself - and is logged as **backlog 38** for a second phrasing before anything is
    written. Operations is **not** the same gap and must not be written on the strength of
    the finance result: BrainStation runs a full-day in-person agent course in London and
    Columbus runs "Agent in a Day UK", so the engine can answer that question. The
    after-the-training-day axis is declined - vendor and consultancy blogs own it, and two
    of our guides already carry our half.
  - **Off-page: one new lead and an eighth corroboration.** `cademy.io`, a UK course-booking
    directory providers list themselves on, surfaced carrying a third party's one-day course
    in Milton Keynes; it needs nobody's permission, which the editorial roundups above it on
    the list all do, but it may want a price, and prices live on Luma - so the entry says to
    check that first. And the stale-Luma item gains its eighth consecutive cycle, now on the
    **Second Brain** programme and on queries with **no date in them**, which rules out a
    Cohort 3 freshness artefact. Nothing contacted, nothing submitted, no account made.
  - **Production state came from the Actions API, as all week.** `oxfordagentic.com` answers
    **403 on CONNECT** from the sandbox, so `build.txt` could not be read. Deploy run **273
    success** on `f545349`, the `origin/main` HEAD, finished 13:09 UTC; nothing queued or in
    progress. Working tree clean and local `main` level with `origin/main` before any edit.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **Allowances:** no new guide - still **2 of 3 this week** and today's unspent. Not a Q&A
    refresh either: no question was added anywhere. This is a freshness and accuracy
    correction, which neither allowance governs.

- **2026-10-21 (14:00 local cycle) - an answer engine said twice, in two different
  phrasings, that it could not find a UK one-day hands-on agentic AI day for finance
  teams. That is the day we sell, and no page of ours joined "finance" to any of those
  words. Three Q&A sections on the vertical guide, which had not been touched since 23
  July.**
  - **What the probes said, in their own words.** *"agentic AI training for finance teams
    UK hands-on one day"* returned **no page of ours** and the answer opened: *"I found no
    UK one-day course that is clearly hands-on and focused on agentic AI for finance
    teams."* A second phrasing hours later - *"one day agentic AI workshop for finance
    directors UK build your own workflow no coding"* - also returned nothing of ours and
    named the near misses itself: a London hackathon as the best match, BDO's full day
    built around Copilot, and the University of Essex workshop, which *"says no coding
    required, but it runs over two days, not one, and is not finance-specific"*.
  - **Why the gap is real rather than a phrasing artefact.** Two phrasings, hours apart,
    same answer. And the cause is on our side: `agentic-ai-for-finance-teams` is a good
    in-practice guide about where agentic workflows help a finance month, and its only
    training sentence was the closing "a day at the Oxford Agentic Bootcamp". Nowhere on
    the site did "finance" sit next to one day, in person, no coding, UK or bring your own
    task. The programme page carries every one of those facts and never says finance.
  - **The topic probe passes on both halves, which is why this was written and the 08:00
    cycle's two axes were not.** WINNABLE: the field is providers writing about their own
    courses - aiawareness.ai is prompting with Copilot and ChatGPT rather than agents, ZHAW
    is Switzerland, BDO is Copilot, Essex is two days and not finance - plus one London
    event listing. No institutional publisher owns an editorial answer here, so it is not
    the Salesforce-and-NetSuite field that was correctly declined this morning. CONVERTING:
    a finance director typing that phrase is the buyer.
  - **Three questions, and the first one answers itself honestly.** *"Is there a one-day,
    hands-on agentic AI course for finance teams in the UK?"* says there is a one-day
    in-person build day in Oxford **and that it is not a finance-only course** - what is
    finance-specific is the task you bring, your own variance commentary, your own
    reconciliation triage, your own board pack. *"Can we build against real finance data on
    a day like that?"* uses the programme page's own published test (bring a task you would
    be comfortable describing to an external supplier) and adds the finance-shaped part: the
    pipeline is the deliverable, so it can be built against a redacted or representative
    extract and pointed at the real ledger once it is back inside your own controls.
    *"Does this need sign-off before anyone books?"* splits the two approvals - the spend is
    a manager's, the workflow in a finance process is the audit-trail conversation - which
    continues the paragraph directly above it rather than being bolted on.
  - **No new fact was invented and no event fact was touched.** Every claim is already
    published: one day, in person, Oxford, no coding, capped small, bring one real task,
    leave with it running, not recorded, you build on your own machine. **No date and no
    venue is restated** - the Q&As link pages that render those from the content files, so
    there is one source of truth, and `luma.com` does not resolve from the sandbox so
    nothing could have been re-verified anyway.
  - **Four new internal links, all from a vertical page to decision-stage pages:** the
    Agentic Bootcamp programme page, `in-house-ai-day-or-send-people-to-a-cohort`,
    `getting-an-ai-bootcamp-approved` and `getting-an-ai-workflow-past-it-and-legal`.
  - **One question was drafted and dropped.** "Is one day enough?" is already an h2 on
    `what-you-can-build-in-one-day-with-ai`, and a second copy of it on a vertical page is
    the near-duplicate the rules forbid. The sign-off question replaced it.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,158**
    internal links resolve against 3,154 - the four new ones - schema valid, 5 Event and 9
    FAQPage nodes, titles and descriptions still unique, no new SEO warnings. The 12
    outbound warnings are the sandbox egress policy blocking `luma.com`, `linkedin.com`,
    `arxiv.org`, `elevenlabs.io`, `novaria.ai` and `ico.org.uk`, unchanged. In dist:
    canonical correct, indexable, in the sitemap with `lastmod` moved to today, in
    `llms.txt` and `llms-full.txt`, one h1 and no heading-level skip. `seoTitle`,
    `description` and the capsule are untouched - the page's own job has not changed, only
    what it answers at the bottom.
  - **Inspected at four configurations in headless Chromium:** 375px, 1280px, and 320px and
    375px with the browser's default text raised to 24px through CDP `Page.setFontSizes`.
    **0px of horizontal overflow in all four**, one h1, no heading skip, no image without
    alt text, no unlabelled control, no page errors. The three "unlabelled" links a naive
    `innerText` check reports at 1280px are the collapsed desktop nav dropdown, which has
    text; they report identically on an untouched guide. The new section was screenshotted
    at 375px and 1280px and renders as the rest of the page does.
  - **GEO: five probes, none cited, and three of the misses are not yet a verdict.** The two
    finance probes are above. The other three test guides published in the last fortnight -
    `is-your-ai-workflow-saving-time-or-just-effort` (13 Oct),
    `in-house-ai-day-or-send-people-to-a-cohort` (11 Oct) and `who-should-take-the-seat`
    (19 Oct) - and all three are inside the indexing lag this log has recorded repeatedly.
    Re-probe in a few weeks rather than writing anything new for them; their fields are
    measurement blogs, vendor L&D content and providers' own "who is this for" pages. Full
    table in `seo-data/geo-citations.md`.
  - **Off-page: one new lead, and a negative finding worth not re-searching.**
    `learnsignal.com` owns the finance axis with three roundups including a "Best AI
    Training for Finance Professionals - 2026 Buyer's Guide". It is a competitor, and its
    own selling point is accreditation by ICAEW, ACCA and CIMA, which runs straight into the
    certificate decision Drummond has not made - so the entry says plainly that nothing
    about CPD, accreditation or certificates may be claimed on any finance route. The
    negative finding: **no institute directory of external AI training providers exists**
    that a search could turn up; the ICAEW Academy catalogue lists its own courses. Nothing
    contacted, nothing submitted, no account made.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers **403 on CONNECT** from the sandbox (confirmed against the proxy's own status
    endpoint, `connect_rejected`, policy denial), so `build.txt` could not be read. Deploy
    run **272 success** on `1dca33f`, the `origin/main` HEAD, finished 08:32 UTC; CI run 262
    success on the same SHA; nothing queued or in progress. Working tree clean and local
    `main` level with `origin/main` before any edit.
  - **Known candidate 2 is still not due, by about three hours.** The Second Brain Bootcamp
    runs **today** and ends at 17:00 BST, so the two guides carrying it in the present tense
    are correct as this cycle ships. The next cycle inherits it, and the honest version still
    needs Drummond: there is no second Second Brain cohort for a past-tense sentence to point
    at. Known candidate 1 (the `src/lib/home.ts` IndexNow mapping) is **already fixed** -
    `scripts/indexnow-ping.mjs` maps it to `/` only.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **Allowances:** no new guide - still **2 of 3 this week** and today's unspent. This is a
    Q&A refresh, the **2nd of the 2** allowed in a day (the 02:00 cycle spent the first).

- **2026-10-21 (09:00 local cycle) - the one page whose whole job is evidence promised a
  date it does not show. The claim went, because the evidence is a settled no.**
  - **What was wrong.** `/testimonials/` - "Outcomes" in the nav, and the only page a
    buyer can open to check that anyone has said anything - led with the subline
    **"Named, dated and attributed."** and carried the same three words in its meta
    description. Nothing on the page is dated. Four quotes, four names, four roles, no
    date anywhere except inside Fei Gan's own sentence ("the July 2026 AI Agentic
    Bootcamp"), which is hers rather than the page's. The description also rides into
    `og:description`, `twitter:description` and the `WebPage` node, so the unmet claim
    was in five places and was what a search engine and an answer engine read.
  - **The evidence exists; rendering it is a settled no.** Every testimonial content file
    carries a `date`, and Fei's carries `cohort: Cohort 1`. `Quote.astro` deliberately
    renders neither - backlog 23 records that the date under each name was removed on
    purpose because, with testimonials attached to a programme rather than an event, a
    July date sat under a quote on a September cohort's page and read as a
    contradiction. So putting dates back would re-open a decision, and backlog 23 is
    explicitly Drummond's wording call. The honest move was to drop the claim.
  - **Two strings, one file.** Subline: "Named, dated and attributed." -> **"Named and
    attributed."** Description: "...said afterwards - named, dated and attributed." ->
    **"...said afterwards - named and attributed, never anonymous."** 113 characters, so
    it stays inside the 160 the schema check measures, and it still says the thing worth
    saying next to a field full of anonymous "Finance Director, FTSE 250" quotes. A
    comment in the file records why "dated" went, so a later cycle does not put it back.
  - **Two wordings were written and rejected before this one.** "...the cohort they came
    to" would have reintroduced the same fault - three of the four cards do not name a
    cohort. "...in their own words" is not verifiable for all four: STATE.md 7b records
    that the first half of Shrestha Mullick's line cannot be traced to any document and
    was supplied by Drummond, so a blanket claim about exact wording is exactly the kind
    this loop must not publish.
  - **Nothing moved.** Full-page screenshots at 375px and 1280px before and after: same
    page height to the pixel (2694px at 375px), subline still two lines at 375 and one at
    1280, cards, monograms and reveal order unchanged. No content file touched, so no
    `updatedDate` and no sitemap `lastmod` moved.
  - **Checks:** `npm run build` clean - 61 pages, **3,154** internal links resolve, schema
    valid, 5 Event and 9 FAQPage nodes, titles and descriptions still unique. The 12
    outbound warnings are the sandbox egress policy blocking `luma.com`, `linkedin.com`,
    `arxiv.org`, `elevenlabs.io` and `ico.org.uk`, unchanged. `npm run check:flags` passes
    both the all-on and all-off builds. `npm run check` (astro check, with `@astrojs/check`
    installed `--no-save`) reports **79 errors, 0 warnings, 4 hints both before and after**
    - an unchanged pre-existing baseline of implicit-`any` content-collection parameters,
    which is also why CI does not run it.
  - **The sweep that found it, and found nothing else.** All **55** indexable pages at 375,
    768 and 1280px: 0px horizontal overflow, exactly one `h1` each, no heading-level skip,
    no `img` without `alt`, no form control without a label, no link or button without an
    accessible name, no page error. Re-run after the change: still 0 findings. A keyboard
    pass over 11 representative pages, 70 tabs each at 375 and 1280px, found **no focusable
    element without a visible outline or shadow**. Page weight at 375px tops out at 131KB
    (`/team/`); no image is served more than 2.2x its displayed width, and none is missing
    `width`/`height`, so there is nothing to win on media.
  - **Not shipped, and why.** `/testimonials/` has **no onward link at all** once it has
    quotes on it - the empty state offers "See the events", the populated state offers
    nothing, and every other page on the site ends in a call to action. That is a new
    call to action on a nav-level page, which this loop does not add on its own. Logged as
    backlog 35.
  - **Production could not be read, as on every cycle this week.** `oxfordagentic.com`
    answers **403 on CONNECT** from the sandbox (confirmed against the proxy's own status
    endpoint, `connect_rejected`, policy denial) and `drummond1.github.io` does not resolve,
    so `build.txt` could not be fetched and before/after had to be local build against local
    build. Deploy run **270 success** on `4e2b0ca`, the `origin/main` HEAD, finished 07:14
    UTC; CI run 261 success on the same SHA; nothing queued or in progress.
  - **Repository state.** `main` fast-forwarded from the stale local ref to `4e2b0ca`.
    PR #1 (backlog 20) and the `feat/ceo-roundtable-demand-page` branch are both the
    known-stale leftovers already on record, not unfinished work.
  - **The Second Brain Bootcamp is running today.** Its page is correctly still `upcoming`
    until 16:00 UTC - `effectiveStatus` keys off `endDate` - and no event fact was touched.
    `luma.com` does not resolve from the sandbox, so none could have been verified anyway.
  - **No guide, no Q&A refresh.** This is a copy-accuracy fix on an existing page, which
    neither allowance governs.

- **2026-10-21 (08:00 local cycle) - an invisible `#` was the last thing scrolling the site
  sideways. One declaration closed the overflow sweep that has run since 20 October: every
  indexable page is now 0px at every width and text size tested.**
  - **Backlog 34, measured, fixed and re-measured.** Reproduced first, exactly as logged:
    Chromium driven through CDP `Page.setFontSizes`, which is the browser's own text
    preference rather than a page zoom, so `rem` media queries behave as they do for a real
    visitor. At a 320px viewport with a 24px default font,
    `/guides/agentic-ai-glossary/` scrolled **21px** sideways and
    `/guides/how-to-choose-your-first-agentic-task/` **1px**, and in both cases the single
    element past the right edge was `a.heading-anchor` - the `#` that appears on hover so a
    section can be linked. It is `opacity: 0` until hovered, so an invisible element was
    moving the page.
  - **`display: inline-block`, and that is the whole of the fix.** The script appends the
    anchor straight after the heading text with no space between them, so as an inline box
    there was no point at which the line could break: the `#` and its 0.4em margin sat
    wherever the last word ended, even when that was past the right edge. An atomic inline
    can be moved to the next line, and only is when it will not otherwise fit.
  - **Four candidates were tried in the browser before one was written into the file.**
    `overflow-wrap: anywhere` on the anchor alone does nothing (still 21px) - the break
    needed is before its content, not inside it. `overflow-wrap: anywhere` on the anchored
    headings works, and so does a zero-width space inserted before the anchor, but both reach
    wider than the defect: the first changes how every heading in all 30 guides breaks its
    own words, the second puts an invisible character inside heading text, which is also the
    accessible name. `display: inline-block` produces **the same measurements as both** -
    identical article heights at every width tested - while touching nothing but the one
    element.
  - **Nothing about the rendering moved.** The anchor's x position and width are unchanged to
    the pixel at 375px and 1280px, and heading positions and heights are identical. Better
    than that: screenshots of the heading with the anchor forced visible are **byte-identical
    before and after** at both widths (sha256 `54b61c0e…` at 375px, `1da2d9b0…` at 1280px).
    The box is 2.7px taller because an inline-block's box is its line box rather than the
    font's content box, and the glyph sits on the same baseline, which is why the pixels
    match.
  - **The three states the backlog item asked about all hold.** Hover (`opacity` 0 -> 1,
    bronze `rgb(154, 123, 35)`), `:focus-visible`, and `[data-copied]`, which widens the box
    to 95.8px at 375px and 110.6px at 1280px for its " copied" label and still reports 0px of
    page overflow. Checked on both affected pages at both widths.
  - **The one visible cost, stated plainly.** At 320px with a 24px default font, exactly one
    heading per page gains a line - "Orchestration" on the glossary, one on the other guide -
    because the anchor wraps below it. Seven anchors on the glossary wrap in that
    configuration and six of them land on a line the heading already had. At 320px/16px,
    375px/16px, 375px/24px and 1280px nothing moves at all. The alternative was 21px of
    sideways scroll on the whole page, which is the same trade backlog 33 made for inline
    code.
  - **The sweep is closed.** All **55** indexable pages at 320px and 375px, at both a 16px and
    a 24px browser default: **0px of horizontal overflow in all 220 combinations.** This is
    the first clean reading since the sweep started on 20 October. The cookie banner's cut-off
    buttons (backlog 31) are unchanged and still Drummond's call - it is `position: fixed`, so
    it clips silently without adding to any page's scroll width.
  - **Checks:** `npm ci` then `npm run build` clean before and after, with **identical check
    output**: 63 pages, **3,154** internal links resolve, schema valid, 5 Event and 9 FAQPage
    nodes, titles and descriptions unique, no new SEO warnings. The 12 outbound warnings are
    the sandbox egress policy blocking `luma.com`, `linkedin.com`, `arxiv.org` and `ico.org.uk`
    and are unchanged. Affected pages at 375px and 1280px: one h1, no heading-level skip, no
    missing alt text, no unlabelled control, no page errors beyond the sandbox's own blocked
    tag-manager requests. No content file touched, so no `updatedDate` moved and no sitemap or
    canonical changed.
  - **GEO: five probes, and the stale-Luma harm has reached the commercial query.** Every
    previous corroboration came from a probe that named a date. This one did not - *"hands-on
    agentic AI course Oxford for business leaders"*, the plainest phrasing of what we sell -
    and **no page of ours came back**. `luma.com/k7c2rm5s` and `luma.com/oxfordagentic2`, both
    past, came third and fourth, and the engine described the business off them: *"an in-person
    event hosted by Oxford's Practical AI meetup ... the search results don't show its dates or
    price"*. Seventh consecutive cycle on this axis, first with no date in the query. **Caveat:**
    web search, not the Perplexity probes that had us at #2, #3 and #5 on this same query on 13
    September, so it is not a like-for-like ranking drop. Review-list item strengthened as its
    seventh axis. **Nothing in the repo can fix it** - all three listings are Drummond's.
  - **Two axes probed and both declined, which is the correct outcome.** *"What is an agentic
    workflow"* is Salesforce, NetSuite, Slack and GPTBots - platform vendors writing about
    their own product, the topic-probe rule's own example of a field to leave alone. *"We
    already have Copilot, is agentic AI training still worth it"* is a new and strongly
    CONVERTING axis - the searcher has the licence, the team and the budget - but the field is
    Caltech exec ed, two Microsoft partners, two consultancies and Microsoft's own
    marketplace. Not winnable through a Q&A block. Both logged so they are not re-probed in
    those words. The no-code axis came back as an off-page finding for the second cycle
    running: the engine said *"I found no UK one-day workshop that is strictly no-code for
    building AI agents"* and cited six event aggregators and vendor event pages, which is
    backlog 2b rather than a content gap.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers **403 on CONNECT** from the sandbox, so `build.txt` could not be read, and
    `luma.com` does not resolve, so **no event fact could be re-verified - none was touched.**
    Deploy run **269 success** on `5325d5e`, the `origin/main` HEAD, finished 01:08 UTC,
    nothing queued or in progress when this cycle started.
  - **Known candidate 2 is still not due, for a few more hours.** The Second Brain Bootcamp
    runs **today**, 21 October, so the two guides carrying it in the present tense are correct
    until the day ends. The 22 October cycle inherits it, and the honest version still needs
    Drummond: there is no second Second Brain cohort for a past-tense sentence to point at.
  - **Off-page: no new lead.** `createwith.com`, which returned on two unrelated probes today,
    is already on the review list from an earlier cycle; `eventbrite.co.uk` and the Luma
    listings are already there too. Nothing contacted, nothing submitted, no account made.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **No guide**: 2 of 3 this week and today's allowance unspent. Not a Q&A refresh either -
    this is a CSS fix, which neither allowance governs, and 1 of the day's 2 refreshes was
    spent by the 02:00 cycle.

- **2026-10-21 (02:00 local cycle) - the buyer's checklist asked "what if I book and then
  cannot make the date?" and then did not answer it. The question that decides whether a
  provider's "transferable" means anything now gets the three things worth asking.**
  - **Evidence: four probes, and the 20:00 cycle's diagnosis was half wrong.** That cycle
    queued booking risk as the top candidate and read it as a vocabulary gap - the answer
    published, the searcher's words absent. The words are not absent.
    `questions-to-ask-before-booking-ai-training` has carried the h2 **"9. What if I book
    and then cannot make the date?"** since at least 10 August, and three separate
    booking-risk phrasings still returned no page of ours. What the section lacked was an
    answer: two sentences telling the reader to ask, on a page whose own description
    promises "what a straight answer to each one sounds like". A fourth restatement of our
    terms in different words would have moved nothing, so none was written.
  - **WINNABLE and CONVERTING, checked rather than assumed.** Across the three probes every
    source returned was a provider's own T&Cs, a council training policy or a PDF -
    ecc.ac.uk, cherwell.gov.uk, spso.org.uk, datasciencedojo, lang.ox.ac.uk,
    safeguardingwarwickshire, sparsholt.ac.uk, hants.gov.uk. **No institutional publisher,
    no platform vendor, and no editorial answer anywhere in the field.** The searcher has
    already decided they want the seat and is weighing the risk of losing the fee, which is
    the strongest converting signal the GEO log records.
  - **What the field does, which is what makes our line worth reading.** Refunds keyed to
    notice (full over three weeks, 50% at ten working days, nothing under ten); transfers to
    a later cohort capped at one, or allowed within a term but never between terms; moves
    priced as a percentage of the fee - 20% inside five working days at one provider, 5% at
    31-60 days and 25% inside 30 at another; non-attendance charged outright at £100 for a
    full day; and the working-days-not-calendar-days trap explicit in two of them. **No
    provider is named and no figure of theirs is published** in the shipped copy - it goes
    in the GEO log as evidence. The section says what to ask and why it matters, which is
    the page's job, and our own answer was already in its closing paragraph.
  - **Three paragraphs, one new in-body link, no new fact.** The link is to
    `getting-an-ai-bootcamp-approved`, because fee risk is the approver's question too and
    that guide answers it in a line. The closing "for the record" paragraph gains five words
    - "let us know and we will move you" - lifted verbatim from the homepage FAQ, so our own
    answer is as concrete as the questions. Nothing about notice periods, expiry or
    substitution is claimed on our behalf, because the published terms do not say.
  - **Substitution is a real gap and was deliberately left unanswered.** "Can I send a
    colleague instead?" is standard in this market and splits both ways - nominate a
    colleague with 24 hours' notice, "always open to you to send a substitute", a place
    passed to a colleague but the date never moved, and Oxford University's own staff
    guidance asking people **not** to send someone in their place. Our terms say nothing
    either way, so the guide does not raise a question it cannot answer for itself. **One
    sentence from Drummond closes it**; it is in the report, not on a page.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,154**
    internal links resolve (was 3,153 - the one new in-body link), schema valid, 5 Event and
    9 FAQPage nodes, titles and descriptions unique, no new SEO warnings and no
    straight-apostrophe warning. The 12 outbound warnings are the sandbox egress policy and
    are unchanged. Verified in `dist`: canonical
    `https://oxfordagentic.com/guides/questions-to-ask-before-booking-ai-training/`, no
    `noindex`, in the sitemap and in both `llms.txt` and `llms-full.txt`, one h1 and 14 h2
    with no heading-level skip. `updatedDate` bumped from 18 October; `title`, `seoTitle`,
    `description` and `capsule` deliberately untouched - the description already promises
    exactly what the section now delivers, and the near-miss rule on rewriting a title
    without Search Console data stands. Headless Chromium against a local preview at 320px,
    375px and 1280px: one h1, no heading skip, no missing alt text, no unlabelled control
    on either phone width, **zero horizontal overflow at all three widths**, and zero again
    at 320px and 375px with the browser's default font raised to 24px through CDP
    `Page.setFontSizes`, so this page is not one of backlog 34's two. No page errors beyond
    the sandbox's own blocked tag-manager requests. The new paragraphs measure 3, 6 and 4
    lines on desktop and 6, 11 and 8 at 375px, inside the 3-16 line range the page's
    existing paragraphs already occupy. The three "unlabelled" controls counted at 1280px
    are the collapsed desktop dropdown's bootcamp links, which report no text while hidden;
    they are pre-existing and untouched.
  - **GEO: the date anchor harm is back, and yesterday's clean reading does not survive the
    re-probe.** The 20:00 cycle asked the next cycle to re-probe rather than assume either
    result. Re-probed: **no page of ours in the results**, the two past Luma listings first
    and second, the engine stating *"I didn't find any listing that confirms a Cohort 3 on
    19 November 2026"*, then reproducing the Worcester-versus-St-Anne's contradiction, the
    "5 Spots Remaining" off the July listing and allai.events' *"21 Jul 2026 ... tickets
    from $275"*. The 20 Oct clean answer stays logged as one phrasing on one day and is
    still the only clean reading the log records on this axis. Review-list item strengthened
    as its sixth axis. **Nothing in the repo can fix it** - all three listings are
    Drummond's.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers **403 on CONNECT** from the sandbox and does not resolve through the fetch tool,
    and `luma.com` does not resolve either, so `build.txt` could not be read and **no event
    fact could be re-verified - none was touched.** Deploy run **268 success** on `2ff673c`,
    the `origin/main` HEAD, finished 19:11 UTC, nothing queued or in progress when this
    cycle started.
  - **Known candidate 2 is still not due.** The Second Brain Bootcamp runs **today**, 21
    October, so the two guides carrying it in the present tense are correct for one more
    day. Moving them tonight would have made the site wrong rather than current. The 22
    October cycle inherits it, and the honest version needs Drummond: there is no second
    Second Brain cohort to point a past-tense sentence at.
  - **Off-page: no new lead, and that is the correct outcome.** The booking-risk field is
    council policies, provider PDFs and a Belgian university's no-show rules - nothing that
    lists training providers, nothing an engine treats as a buyer's guide. `allai.events`
    and the two Luma listings returned again and are already on the list. Nothing contacted,
    nothing submitted, no account made.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 September reading).
  - **No guide**: 2 of 3 this week and today's allowance unspent, kept rather than filled.
    This is a Q&A refresh, 1 of the 2 allowed in a day.

- **2026-10-20 (20:00 local cycle) - an invisible 20-character file path was scrolling a
  guide sideways on a narrow phone whenever the reader had enlarged their text. Inline code
  may now break when it will not otherwise fit.**
  - **Evidence: reproduced, then fixed, then re-measured.** Chromium driven through CDP
    `Page.setFontSizes`, which is the browser's own preference rather than a page-level
    override, so `rem` media queries scale the way they do for a real visitor. Before: at a
    320px viewport with a 24px default font, `/guides/second-brain-for-ai-vs-note-taking/`
    scrolled sideways by **35px**, and the single cause was
    `<code>Clients/Acme/Pricing</code>` measuring **325px** in a 320px window. A word with no
    space and no hyphen in it sets the page's minimum width, and the page is then wider than
    the screen. After: **0px** at every width and text size tested.
  - **`overflow-wrap: anywhere`, not `break-word`, and that is the whole of the fix.** Only
    `anywhere` shrinks the min-content width, which is what the page's scroll width is taken
    from; `break-word` would have wrapped the text and left the page just as wide. One rule,
    fifteen lines including the comment, no markup change.
  - **The check backlog 33 asked for was done before the rule went in.** The site has exactly
    **five** inline code spans on three pages - `Clients/Acme/Pricing` in the guide,
    `/team/josh-lawman/` and `/team/`, `/home-photos/` and `/home-original/` - and **no
    `<pre>`, `<kbd>` or `<samp>` anywhere in `dist`**, so there is no code block the rule can
    reach and nothing that needs to hold its line breaks. The item's worry was that a path
    might break where the break reads as part of the path: it breaks mid-segment
    (`Clients/Acme/Pr` + `icing`), which is the opposite, and a reader can see it is a wrap
    rather than a slash.
  - **Nothing moves at ordinary text sizes.** Measured on the built page: the code span is
    **217px on one line at both 375px and 1280px**, before and after, in the same 18px
    monospace. The screenshot at 1280px is indistinguishable from the old rendering. It
    breaks only in the 320px/24px case, where the alternative is the whole page moving.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,153**
    internal links resolve - unchanged, as a CSS-only change should be - schema valid, 5
    Event and 9 FAQPage nodes, titles and descriptions unique, no new SEO warnings. The 12
    outbound warnings are the sandbox egress policy blocking `luma.com` and are unchanged.
    Affected page inspected at 375px and 1280px: one h1, no heading-level skip, no missing
    alt text, no unlabelled control, no page errors.
  - **A full-site sweep came with it, and found the next defect.** All **55** indexable pages
    at 320px and 375px, at a 16px and a 24px default font: every combination now scrolls 0px
    except two guides at 320px/24px, where the cause is not code but the `#` heading anchor
    sitting past the right edge of a long heading. Logged as **backlog 34** with the
    measurements and deliberately left for another cycle rather than widening this one. It
    also corrects the 13 Oct note: the code span was the only page *measured*, not the only
    one overflowing.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers **403 on CONNECT** from the sandbox and `luma.com` does not resolve, so
    `build.txt` could not be read and **no event fact could be re-verified - none was
    touched.** Deploy run **267 success** on `4a66d30`, the `origin/main` HEAD, finished
    13:10 UTC, nothing queued or in progress when this cycle started.
  - **GEO: four probes, and the date anchor came back clean for the first time in ten
    cycles.** A query naming the programme, Oxford, 19 November 2026 and the format cited the
    homepage and got every fact right - Cohort 3, Thursday 19 November 2026, Worcester
    College - with no St Anne's contradiction, no "$275", no "5 Spots Remaining", and the
    engine volunteering that it found no pricing, which is the no-prices decision working.
    **This is a different engine from the Perplexity probes that logged the harm, so it does
    not refute them**; the review-list item stays open and the next cycle should re-probe the
    same anchor rather than assume either reading.
  - **The strongest content finding was deliberately not acted on.** Booking risk - "I have
    booked and now I cannot make the date" - is untested in 222 probe rows, WINNABLE (nine
    provider T&C pages, no institutional publisher, no editorial answer at all) and the most
    strongly CONVERTING axis the log records, because the searcher has already decided they
    want the seat. The field charges £20-£100 + VAT admin fees, caps transfers at 6-12 months
    and forfeits the fee for a no-show; **our published terms beat all of it** ("your place
    transfers to a future cohort at no charge", on all three upcoming event pages) and the
    answer did not know it. **Today's allowances were spent before this cycle began** - one
    guide at 02:00, both Q&A refreshes at 07:00 and 13:00 - so it is queued for the next
    cycle rather than written. A cycle does not lower the bar to fill a slot it does not have.
  - **Off-page:** one new named lead, `dreamsaicanbuy.com`, a twenty-provider UK roundup an
    engine cited for a converting buyer query, added to `outreach/review-list.md` with the
    thing that needs weighing first - its selling point is published prices, and price-off-
    the-site is a standing decision. Nothing contacted, nothing submitted, no account made.
  - **Search Console: unavailable from the cloud** (no browser session, no API credentials,
    and no export in `seo-data/` newer than the 13 Sept reading).
  - **No guide**: 2 of 3 this week, today's single guide spent by the 02:00 cycle. Not a Q&A
    refresh either - both of the day's two were spent by the 13:00 cycle. This cycle is a
    CSS fix, which neither allowance governs.

- **2026-10-20 (14:00 local cycle) - "Will this be out of date in six months?" is the
  objection to paying for any AI day, and the site had never written the words. The page
  that holds the answer - the pattern guide - now answers it in the searcher's vocabulary.**
  - **Evidence: the durability axis, untested in 218 probe rows, probed three ways plus one
    control.** "Obsolete" appeared nowhere in the GEO log, "out of date" twice and both times
    about stale notes in a second brain, "should I wait" and "too early" nowhere. No page of
    ours came back on any phrasing. WINNABLE by the ledger's test - the field is one
    Salesforce blog post served from three regional paths, a training vendor and a personal
    blog, with no institutional publisher and no platform vendor on its own product - and
    CONVERTING at the point where a buyer has already priced the day and is looking for a
    reason to defer. Today's guide allowance was spent by the 02:00 cycle, so this ships as
    a Q&A refresh: 2 of the 2 allowed in a day.
  - **The engine reached our conclusion and could not cite a page that makes it.** Its own
    answer was *"expect the button-level details to be outdated in six months, but the
    underlying skills ... should still apply"* and *"what holds up is adaptability ... the
    lasting part of a workshop is usually the general habits"*. That is
    `scout-drafter-reviewer-pattern`'s argument, published since 5 August and absent from the
    answer. Selection, not discovery, and the third cycle running on the same failure mode.
  - **The block takes the strongest hit in the field on the chin.** `tianpan.co` argues
    training programmes are structurally 6-12 months behind the models, and that techniques
    taught in early programmes were automated away by the models before the first cohort
    finished. That lands on a curriculum; it lands much less on a day that runs on the
    attendee's own task. So the three questions are: does what I learn go out of date in six
    months (some of it, and it is the part that matters least); if the models keep getting
    better, will one prompt not just do it (they have, and it has not, because the reasons
    for the split were never about the model being weak - and for a small job nobody depends
    on, let it); should I wait until the tools settle down (they are not going to, and
    waiting improves the half that was never the constraint).
  - **Every fact in it is already published**: the three things the pattern makes you write
    down, which are this page's own scout, drafter and reviewer sections; the three reasons
    for the split, also this page's; and "no tool is being sold", which is the published
    "not for" line on the homepage and on both Agentic surfaces. No price, no availability,
    no claim about another provider, and no new fact. Two in-body links, to
    `how-to-choose-your-first-agentic-task` and `when-ai-executive-cohorts-run`; the single
    programme link in the CTA was left alone, because no guide on this site links its
    programme twice.
  - **Two axes were probed the same cycle and neither produced a change.** *Independence*:
    the engine said it *"didn't find a UK workshop that explicitly says it sells no tools"*
    and that every provider's claim was a self-description - ours is published on four
    surfaces, so that is an off-page retrieval problem, not a content gap, and it got one
    sentence rather than a section. *Transferability*: the phrasing collided with model
    training and the engine answered on LoRA adapters and fine-tuned weights, which is logged
    so the axis is not re-probed in those words.
  - **Checks:** `npm ci` then `npm run build` clean. 61 pages built and 63 checked, **3,153**
    internal links resolve (was 3,151 - the two new in-body links), schema valid, 5 Event and
    9 FAQPage nodes, titles and descriptions unique, no new SEO warnings and no
    straight-apostrophe warning. The 12 outbound warnings are the sandbox egress policy and
    are unchanged. Verified in `dist`: canonical
    `https://oxfordagentic.com/guides/scout-drafter-reviewer-pattern/`, no `noindex`, in the
    sitemap and in both `llms.txt` and `llms-full.txt`, one h1, heading sequence h2 → h3 × 3
    → h2 with no skip. `updatedDate` bumped from 5 August; `title`, `seoTitle`, `description`
    and `capsule` deliberately untouched - the capsule already ends on "the pattern transfers
    to almost any repeated knowledge task", which is the same thesis, and the ledger's
    near-miss rule on rewriting a title without Search Console data still stands. Headless
    Chromium against a local preview at 320px, 375px and 1280px: one h1, no heading-level
    skip, no missing alt text, no unlabelled control, **zero horizontal overflow at all
    three widths**, no page errors beyond the sandbox's own blocked tag-manager requests.
    The one `opacity: 0` element is the lead-capture card, which reveals correctly on scroll.
    The three `h3` measure 21px Newsreader on desktop and 19.2px at 375px, identical to the
    treatment the ledger recorded for the two previous blocks. Screenshots read at both
    widths: each question wraps to two lines on a phone and still reads as a question.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers 403 on CONNECT from the sandbox and `luma.com` does not resolve, so `build.txt`
    could not be read and **no event fact could be re-verified - none was touched.** Deploy
    to GitHub Pages run **266 success** on `26bcd8e`, the `origin/main` HEAD, finished 08:57
    UTC, with nothing queued or in progress when this cycle started.
  - **Known candidate 1 is already done and should come off the brief:**
    `scripts/indexnow-ping.mjs` maps `src/lib/home.ts` to `/` alone, so a homepage FAQ edit
    no longer pings all 44 sitemap URLs. **Known candidate 2 is not yet due:** every published
    date is correct today - 16 September reads in the past tense, 19 November and 26 November
    in the future, and **21 October is tomorrow**, so the two Second Brain guides that carry
    it in the present tense are correct until then and must not be moved early.
  - **Off-page:** one new named lead, `lilachbullock.com`, a UK AI-training-provider roundup
    that returned on two unrelated probes in the same cycle. Added to
    `outreach/review-list.md` with the engine's own caveat - its author sells AI training, so
    it is a competitor-run roundup. Everything else returned is a competitor, US or
    Australian, or a 2024 funding page. Nothing contacted, nothing submitted, no account made.

- **2026-10-20 (09:00 local cycle) - Raising the browser's default text size pushed the
  menu button off the right edge of every page on a phone, and the menu button is the only
  way into the navigation there. The header row now wraps instead of overflowing.**
  - **Evidence: measured, not inferred.** Chromium driven through CDP `Page.setFontSizes`,
    which is the real browser preference rather than a page-level `font-size` override, so
    `rem` media queries scale with it the way they do for a visitor. At **24px** (Chrome's
    one-click "Very large" setting) on a 375px viewport, **all 55 indexable pages** scrolled
    sideways by 14px and the `.nav-toggle` sat at `right: 383` in a 375px window - the
    screenshot shows it sliced by the viewport edge. At 320px it was 69px. The cause is one
    rule: `.site-header__inner` is a non-wrapping flex row, and the wordmark beside it is
    `white-space: nowrap` and sized in `rem`, so the brand grows until it shoves the button
    out. Nothing is wrong at 16px or 20px, which is why 100-odd cycles of 375/768/1280
    screenshots never caught it.
  - **The fix is two declarations and it only acts when the row has run out of room.**
    `flex-wrap: wrap` plus a `row-gap` on `.site-header__inner`, and
    `margin-inline-start: auto` on `.nav-toggle` so it keeps its right-hand position on the
    wrapped row rather than dropping to the left. On one line the brand's existing auto
    margin already does that job and the pair changes nothing. Verified identical geometry
    (toggle position, header height, overflow) at 375/16, 375/20, 768/24, 1280/24 and
    1280/16, and the 375/16 and 1280/16 screenshots are visually unchanged.
  - **One page then still overflowed, so the same defect got its second cause.** With the
    header fixed, `/about/` was the last page scrolling sideways at 24px: its contact band
    prints `hello@oxfordagentic.com` as a button label, and the address has no space or
    hyphen to break on, so one 23-character word set a 397px minimum width in a 375px
    window. `a[href^='mailto:'] { overflow-wrap: anywhere }` lets it break only when it will
    not otherwise fit. The button measures **265x52 at 375, 768 and 1280 with normal text,
    byte-identical with the rule on and off**; at 24px it wraps to two lines and the whole
    address is on screen instead of half of it. A `.btn`-wide version of the rule was
    prototyped first and measured no better, so it was dropped rather than shipped.
  - **Result.** Zero horizontal overflow on all 55 pages at 320, 375, 768 and 1280 with
    normal text, and at 375 with the browser set to 24px; the menu button is fully on
    screen in **0 of 55 x 7 combinations off-screen**, against 55 before. Keyboard: three
    tabs to the toggle at both 16px and 24px, visible focus ring, Enter opens
    `aria-expanded="true"` with all 9 mobile-nav links on screen and no overflow, Enter
    closes it again.
  - **Checks:** `npm ci`, then `npm run build` clean - 61 pages, **3,151** internal links
    resolve, schema valid, 5 Event and 9 FAQPage nodes, titles and descriptions unique. The
    12 outbound warnings are the sandbox egress policy and are unchanged. `npm run
    check:flags` passes both the all-on and all-off builds. `astro check` reports **79
    errors, 0 warnings, 4 hints - identical to unmodified HEAD**, measured by stashing the
    diff and re-running, so this change adds none; they are pre-existing implicit-`any`
    reports. Full accessibility sweep re-run across 55 pages x 375/768/1280 and the 4
    non-sitemap pages: no missing alt text, no unlabelled control, no link or button without
    an accessible name, one h1 each, no heading-level skip, no page errors. Screenshots read
    at 375 (16px and 24px), 1280 and on the About contact band.
  - **Production state came from the Actions API, as it has all week.** `oxfordagentic.com`
    answers 403 on CONNECT from the sandbox, so the live site could not be fetched or
    re-screenshotted and **no event fact was re-verified or touched.** Deploy to GitHub Pages
    run on `3796983`, the `origin/main` HEAD, **success** at 07:09 UTC, nothing queued or in
    progress when this cycle started.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 (backlog 20), read as
    known-stale rather than unfinished work, and `feat/ceo-roundtable-demand-page`, which is
    the merged leftover of PR #2.
  - **Three residues of the same defect were found and deliberately not shipped** - backlog
    31, 32 and 33 below.

- **2026-10-20 (08:00 local cycle) - The page that answers "can a day really produce
  anything" has been live since 12 Oct and is cited on none of the three ways a buyer asks
  it. The argument was there; the words were not. Added a three-question block to
  `/guides/what-you-can-build-in-one-day-with-ai/`.**
  - **Evidence: the duration-sufficiency axis, untested in 151 probes, probed three times.**
    "Too short" appeared nowhere in the GEO log and "one day enough" once. No page of ours
    came back on any phrasing. WINNABLE by the ledger's test - the field is vendor workshop
    listings and university short-course pages, none of them answering the question - and
    CONVERTING at the hardest point there is: the searcher is deciding whether a one-day
    format can work at all, which is the objection to the whole proposition. Today's guide
    allowance was spent by the 02:00 cycle, so this ships as a Q&A refresh, which is where
    an objection belongs anyway.
  - **This is selection, not discovery, and the same matching problem as yesterday.** The
    page answers the substance in its first line ("A day is not long enough to build a
    product. It is more than long enough to get something real running"). But it is written
    in the vocabulary of *capability* - "what you can build" - and the searcher uses the
    vocabulary of *sufficiency*. Checked across the whole site: "too short" appeared nowhere,
    "watch demos" nowhere, "enough" once in a body sentence.
  - **The engine's own answer is the argument for writing it.** Probe 2 concluded *"one day
    is enough for an introduction, but not for hands-on skills"* and said why: *"The UK
    one-day courses I found aim at leaders who need to make decisions about AI, not at
    building it."* Every one-day course it could find was a strategy-overview day, so it
    generalised the format from the field. Our day is the counter-example and was absent from
    the answer.
  - **The block concedes the half that is true.** Probe 3: *"A workflow built in one day is
    usually a working draft that needs a week of refinement."* Probe 4: usage *"peaks in the
    week after training and then drifts back."* Both are true of our day and both are already
    published here, so the third question answers "no, a day is not enough if nothing happens
    afterwards" and says why the recipe matters more than the workflow it produced. Honest
    beats defensive, and it is the same move that worked on the paid-versus-free block.
  - **Every fact in it is already published**: one real task from your own work and a laptop;
    build cycles rather than talks with no block longer than twenty-five minutes of anyone
    talking at you (attributed to the Agentic Bootcamp, which is where it is published -
    *not* asserted of the Coding day, where it is not); someone walking the room; the day is
    not recorded; a demonstration instead of an outcome without a real task; "I understand
    it, I have just never built anything"; the formats compound rather than compete; and the
    page's own written recipe. No price, no number of places, no claim about another
    provider, and no new fact.
  - **The retention axis was probed the same cycle and DECLINED as a guide.** Nothing of ours
    came back, but what the field offers (name an owner, book a 30-day review, write the SOP,
    measure a baseline) is organisational follow-through that
    `how-to-run-an-ai-pilot-that-survives` and `is-your-ai-workflow-saving-time-or-just-effort`
    already cover between them, from sources the engine itself called *"reasonable defaults
    rather than proven benchmarks"*. Folded in as one question linking both. Do not re-pitch
    it as a guide without new evidence.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 63 pages, **3,151**
    internal links resolve (was 3,148 - the three new in-body links), schema valid, 5 Event
    and 9 FAQPage nodes, titles and descriptions unique, no new SEO warnings and no
    straight-apostrophe warning (the typographer curled the quoted line's marks; the 12
    outbound warnings are the sandbox egress policy). Verified in `dist`: canonical
    `https://oxfordagentic.com/guides/what-you-can-build-in-one-day-with-ai/`, no `noindex`,
    in the sitemap and in both `llms.txt` and `llms-full.txt`, one h1, heading sequence
    h2 → h3 × 3 → h2 with no skip. `updatedDate` bumped; `title`, `seoTitle`, `description`
    and `capsule` deliberately untouched - the page is eight days old, the three-question
    block carries the new vocabulary in its own headings, and the ledger's near-miss rule on
    rewriting a title without Search Console data still stands. Headless Chromium against a
    local preview at 375px and 1280px: one h1, no heading-level skip, 0 of 2 reveal blocks
    hidden, no missing alt text, no unlabelled control, no horizontal overflow, no page
    errors beyond the sandbox's own blocked tag-manager requests. The three `h3` measure
    21px Newsreader on desktop and 19.2px at 375px, identical to the
    `second-brain-for-ai-vs-note-taking` treatment the ledger recorded. Screenshots read at
    both widths: the longest question wraps to two lines on a phone and still reads as a
    question.
  - **Production state came from the Actions API.** `oxfordagentic.com` answers 403 on CONNECT
    from the sandbox and then does not resolve, and `luma.com` does not resolve either, so
    `build.txt` could not be read and **no event fact could be re-verified - none was
    touched.** Deploy to GitHub Pages run 263 **success** on `2025693`, the `origin/main`
    HEAD, finished 01:09 UTC on 20 Oct with nothing queued or in progress when this cycle
    started.
  - **The stale listings now substitute one product for another.** The date anchor was rotated
    onto the **Coding Bootcamp, 26 November 2026**. The same two past **Agentic** Luma
    listings came back first, allai.events third, no page of ours, and the engine then
    described the Agentic Bootcamp as though it were the day asked about - *"I couldn't
    confirm a 26 November 2026 date"*. Worcester / St Anne's repeated for the fifth time,
    **"5 Spots Remaining"** read off the past Cohort 1 listing again, **"$275"** again. The
    harm has widened from misdating one programme to standing in for a second programme that
    has a live listing of its own. Sixth line running. Backlog 2b, ten minutes of his time.
  - **Off-page:** no new route worth adding. `maven.com`, `happeningnext.com`, `allai.events`
    and `luma.com` are already listed; `tickettailor.com` is a fourth ticketing surface and
    was recorded against the open `humanitix.com` question rather than duplicated; the rest
    are competitors, and the two university routes are out of bounds under the
    unaffiliated-event constraint. The `allai.events` entry in `outreach/review-list.md`
    carries today's corroboration. Nothing contacted, nothing submitted, no account made.
  - **Search Console:** unavailable from the cloud checkout, and no export newer than the
    24 Aug baseline exists in `seo-data/`.
  - **For the next cycle, after tomorrow.** The Second Brain Bootcamp runs on **21 October**,
    and two guides carry it in the present tense - "It runs on [21 October at the Pitt Rivers
    Museum]" in `how-long-to-build-a-second-brain` and
    `is-it-safe-to-put-company-documents-in-a-second-brain`. Both go stale at 17:00 tomorrow,
    and unlike the Agentic line there is **no next Second Brain cohort** to point them at, so
    a straight date swap is not available: the honest rewrite is past tense plus the
    programme page, which is where the newsletter fallback the 19 Oct cycle built now lives.
    Not touched today, because both sentences are true today.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 (backlog 20), the
    bronze contrast token (21), Cohort 2's outcomes (22), the past-cohort quote heading (23),
    the team byline call (24), the Coding Bootcamp's paid-plan question (25), the event hero's
    doubled heading (26), lunch and travel (27), the two voice-page apostrophes (28),
    Jonathan Waddingham's former employer (29) and links in FAQ answers (30).
  - No new guide: **2 of 3 this week** (week of Mon 19 Oct), today's guide allowance already
    spent by the 02:00 cycle. This is a Q&A refresh, 1 of the 2 allowed in a day.

- **2026-10-20 (02:00 local cycle) - A buyer who wants the seat still has to be allowed to
  take it, and the site answered that in one sentence on one page. Written:
  `/guides/getting-an-ai-bootcamp-approved/`.**
  - **Evidence: the budget-approval axis, which the GEO log had never tested in 146 probes.**
    "expense" appeared nowhere in the log and "justify" once. Three phrasings, no page of ours
    in any of them. The field is two things, neither of them an answer: college and vendor
    course listings with a price attached, and generic "get your boss to pay for your AI
    education" posts written for multi-week American career-change courses. The closest thing
    to the question, a provider's own employer-pays template, stops at *"cover what the course
    teaches, how long it takes, what it costs and who will invoice"*. WINNABLE, because no
    institutional publisher owns it. CONVERTING as strongly as anything the log has tested:
    the searcher has already decided they want the day and is working out how to be allowed
    to go.
  - **The gap is one the format closes and generic training cannot.** Both engines gave the
    same advice - tie it to a priority the manager already owns, *"name concrete
    deliverables"*, swap *"I'll understand AI better"* for a specific output such as *"a pilot
    automation for a recurring manual task"*, and set a follow-up date, because *"training
    often fails without follow-up"*. A course that teaches a subject cannot tell a buyer what
    their deliverable will be. A day that runs against one real task the attendee brings
    already has one. So the guide's spine is that the three things the request needs - the
    task, the deliverable and the date - are the format rather than something to invent.
  - **Every fact in it is already published**: bring one real task from your own work that
    costs you meaningful time; "Who is it not for?" and its demonstration-instead-of-an-outcome
    line; the `outcomes` list (the workflow running, the scout/drafter/reviewer pattern, where
    the human judgement stays); Cohort 1's sixteen attendees and their recorded tasks; the day
    is not recorded; places are not refundable but transfer to a future cohort at no charge;
    no tool is being sold; an organisation can pay by invoice; 09:00 to 17:00; Thursday
    19 November at Worcester College. No price, no number of places, no claim about another
    provider, nothing about funding eligibility, levy or VAT.
  - **It tells the reader not to promise a number, which is the opposite of what the field
    does.** One engine flagged its own sources: *"Most of these are vendor sources with no
    independent ROI data"*, and one page reaches for a McKinsey GDP estimate for 2030 to
    justify a single workshop. The guide says promise the artefact, measure afterwards, and
    points at the published caution that effort moved around is not time saved.
  - **The payback axis was probed and declined as a guide.** Nothing of ours came back, but
    what the field offers there (usage targets, hours-saved benchmarks, a 5.3x ROI figure the
    engine itself called marketing) is measurement after the fact, which
    `is-your-ai-workflow-saving-time-or-just-effort` already covers. Folded in as one section
    rather than written separately.
  - **Checks:** `npm ci` then `npm run build` clean before and after. **63 pages** (was 62),
    **3,148** internal links resolve (was 3,086), schema valid, 5 Event and 9 FAQPage nodes,
    titles and descriptions unique, no SEO warnings and no straight-apostrophe warning (the 12
    outbound warnings are the sandbox egress policy). Verified in `dist`: canonical
    `https://oxfordagentic.com/guides/getting-an-ai-bootcamp-approved/`, no `noindex`, in the
    sitemap and in both `llms.txt` and `llms-full.txt`, `Article` and `BreadcrumbList` nodes
    present, `<title>` 50 characters with the suffix, description 149, capsule 60 words. The
    category mechanism gave it **six inbound internal links** on publication. Headless Chromium
    against a local preview at 375px and 1280px: one correct h1, no heading-level skips, 0 of 2
    reveal blocks hidden, no missing alt text, no unlabelled control, no horizontal overflow,
    no page errors beyond the sandbox's own blocked tag-manager requests. Screenshots read at
    both widths: the h1 wraps cleanly on a phone and the capsule reads as the standfirst.
  - **Production state came from the Actions API.** `oxfordagentic.com` does not resolve from
    the sandbox this cycle and `luma.com` does not either, so `build.txt` could not be read and
    **no event fact could be re-verified - none was touched.** Deploy to GitHub Pages run 262
    **success** on `2552223`, the `origin/main` HEAD, finished 19:13 UTC on 19 Oct with nothing
    queued or in progress when this cycle started.
  - **The next bookable day is invisible on its own date, and the stale listings now get the
    team wrong too.** A probe naming the programme, Oxford, 19 November 2026 and the format
    returned no page of ours, answered off Cohort 2's and Cohort 1's past Luma listings and
    allai.events, and concluded *"I couldn't confirm a session on 19 November 2026"* before
    offering Said Business School's £1,500 online programme instead. It also read **"5 Spots
    Remaining" off the past Cohort 1 listing** as live availability, repeated the **$275**
    price, repeated the Worcester / St Anne's contradiction, and - new this cycle - reported
    the team two ways, *"Josh Lawman replaces Thomson in another"*. So the stale listings are
    now inaccurate about a named real person as well as about the date, the venue, the
    currency and the availability. Fifth line running where a query naming our own event
    returns no page of ours. Nothing is missing from our pages; this is backlog 2b and ten
    minutes of Drummond's time.
  - **Off-page:** no new route worth adding - `allai.events`, `createwith.com` and
    `sbs.ox.ac.uk` are already on the list, and the MIT, ESMT and UK college short-course pages
    are competitors rather than listing surfaces. The `allai.events` entry in
    `outreach/review-list.md` carries today's corroboration and the new roster contradiction.
    The stale Luma listings are **nine days running**. Nothing contacted, nothing submitted,
    no account made.
  - **Search Console:** unavailable from the cloud checkout, and no export newer than the
    24 Aug baseline exists in `seo-data/`.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 (backlog 20), the bronze
    contrast token (21), Cohort 2's outcomes (22), the past-cohort quote heading (23), the team
    byline call (24), the Coding Bootcamp's paid-plan question (25), the event hero's doubled
    heading (26), lunch and travel (27), the two voice-page apostrophes (28), Jonathan
    Waddingham's former employer (29) and links in FAQ answers (30).
  - Guide count: **2 of 3 this week** (week of Mon 19 Oct), 1 of 1 today.

- **2026-10-19 (19:00 local cycle) - The guide that compares the ways to learn AI compared
  three of them and never mentioned the fourth, which is the one a buyer actually weighs the
  fee against: doing it yourself, for nothing. Added a three-question block to
  `/guides/ai-bootcamp-vs-course-vs-exec-education/`.**
  - **Evidence: the paid-versus-free axis, untested in 141 probes, probed twice.** Neither
    phrasing returned a page of ours. The field is blogs and vendors arguing about courses in
    general, and the engine said so itself: *"The sources were mostly about courses in general,
    so I didn't find direct comparisons of workshops versus self-study."* WINNABLE (no
    institutional publisher owns it) and CONVERTING (the searcher is deciding whether to pay at
    all). Today's guide allowance was already spent by the 13:00 cycle, so this ships as a Q&A
    refresh on an existing page, which is where the objection belongs anyway.
  - **The gap was a matching problem, not a content problem.** The page already carried the
    argument - "watching someone build is not building", "the friction that stops people is
    rarely the concept" - but the words a searcher uses for it (free, YouTube, self-study, do it
    myself) appeared nowhere on the site. One guide used "free" at all, in an unrelated sense.
    The page compared executive education, an online course and a bootcamp, and left the free
    option out of its own bullet list, so a reader weighing the fee against nothing found no
    column for it.
  - **The block answers the objection honestly rather than arguing with it.** "Is there anything
    in the day you could not find for free?" - very little, and the pattern we teach is
    published on this site; what a day buys is a finished thing, not withheld information. "You
    are disciplined, so why not just do it yourself?" - the test is not whether you could but
    whether you already have. "When is a paid day not worth it?" - when you have nothing real to
    bring, which is the programme page's own "Who is it not for?" answer. Every fact in it is
    already published: the scout/drafter/reviewer pattern, someone walking the room, the
    one-real-task format, and the "I understand it, I have just never built anything" line that
    was already in this guide's own opening section.
  - **An engine handed over the qualifying test unprompted:** *"ask whether you'll build and
    deploy real projects, whether someone reviews your work, and whether there's accountability
    to finish. If the answer to any of these is no, the programme is not worth paying for."*
    Our published format answers all three, which is why the block can afford to concede the
    content point.
  - **Two axes were declined, which is the other half of the cycle.** Solo-founder fit and
    year-end training budget both resolved to "it depends, check the provider", and what came
    back was funded regional schemes, US accelerators and pre-pay vendor offers. Filling either
    would mean stating eligibility rules or levy and VAT treatment, and VAT is on the
    never-state list. Logged, not written.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 62 pages, **3,086**
    internal links resolve (was 3,084 - the two new in-body links), schema valid, 5 Event and 9
    FAQPage nodes, titles and descriptions unique, no new SEO warnings (the 12 outbound warnings
    are the sandbox egress policy). Verified in the rendered page: one h1, no heading-level
    skips, the three questions render as `h3` under one `h2` - the same treatment
    `second-brain-for-ai-vs-note-taking` already uses, measured identical at 21px Newsreader -
    and the typographer turned the quoted line's marks curly, so the straight-apostrophe warning
    stays at zero. `updatedDate` bumped; `title`, `seoTitle`, `description` and `capsule`
    deliberately untouched, because this page ranks and the three-format thesis has not changed.
    Headless Chromium against a local preview at 375px and 1280px: one h1, no heading skip,
    0 of 2 reveal blocks hidden, no missing alt text, no horizontal overflow, no page errors
    beyond the sandbox's own blocked tag-manager requests.
  - **Production state came from the Actions API again.** The egress policy answers 403 to
    `oxfordagentic.com` on CONNECT and `luma.com` does not resolve, so `build.txt` could not be
    read and no event fact could be re-verified - none was touched. Deploy to GitHub Pages run
    261 **success** on `5b806a5`, the `origin/main` HEAD, finished 13:11 UTC with nothing queued
    or in progress when this cycle started.
  - **The event that runs in two days is invisible on its own date.** A query naming the
    programme, the city, 21 October 2026 and the format returned no page of ours and no Luma
    page of ours: *"I found no listing for a Second Brain bootcamp in Oxford on 21 October 2026
    ... The search results don't support that event existing."* Fourth line running to fail a
    query naming our own event. Nothing is missing from the page - it carries the date, venue,
    postcode and a valid `EducationEvent` - so this is backlog 2b and the stale Luma listings,
    which are now **eight days running** and still ten minutes of Drummond's time.
  - **Off-page:** no new route worth adding. `coursereport.com` returned again on an unrelated
    query, for Nucamp's multi-week US bootcamp, and its review-list entry now records that the
    second sighting firms up the doubtful verdict rather than softening it.
  - **Search Console:** unavailable from the cloud checkout, and no export newer than the
    24 Aug baseline exists in `seo-data/`.
  - Guide count: **1 of 3 this week** (week of Mon 19 Oct), 1 of 1 today - spent by the 13:00
    cycle. This is a Q&A refresh, 1 of the 2 allowed in a day.

- **2026-10-19 (13:00 local cycle) - The one question a buyer asks before booking a single
  seat is which of two people should take it, and four engines in two days said in their own
  words that nothing in the field answers it. Written: `/guides/who-should-take-the-seat/`.**
  - **Evidence: the delegation axis, re-probed on two phrasings the 07:00 cycle did not use.**
    The ledger's topic-probe rule has to be satisfied before a guide is written, and one
    cycle's four probes are a thin basis for publishing, so the axis was tested again rather
    than taken on trust. It held. Probe 1: *"The search didn't find anything that answers who
    should attend."* Probe 2: *"The search didn't turn up any direct evidence on which leader
    gets the most out of a hands-on workshop, or on who should decide attendance. The results
    are mostly vendor event listings"* - and of the one source that did argue a side, *"This
    is a vendor's marketing claim, not independent evidence."* Five probes, four phrasings,
    four admissions, no page of ours in any of them. WINNABLE (no institutional publisher owns
    it; the only pages addressing it sell the in-house version) and CONVERTING (the searcher
    is deciding who takes a paid seat).
  - **The guide argues from published facts, not from the engines' inference.** Its spine is
    the programme page's own "Who is it not for?" answer - anyone who cannot bring a real task
    should not come, because without one you get a demonstration instead of an outcome - which
    makes task ownership, not rank, the axis that decides. Three tests (whose morning the task
    eats, who can change the process on Monday, who will build the next one), then the two
    cases where it should be you (the adoption-and-governance material, and recalibrating what
    you approve), the case where it should be them, the one-seat fallback, and the two failure
    modes. Every fact in it is already on the site: the bring-one-task format, the five-level
    adoption journey from Cohort 1's agenda, Cohort 1's recorded tasks (lead generation,
    internal reporting, marketing content), the team-booking answer and the locked-down-laptop
    answer. No price, no number of places, no claim about any other provider.
  - **Twice now an engine has reached for our own format unprompted.** Yesterday: "Some
    sessions ask each participant to bring one real process ... That favors whoever owns the
    day-to-day workflow the AI would change." Today, of a Zurich workshop: its output is "A
    working AI workflow automation built during the session", which "points to the people who
    will run workflows day to day." Both inferred the rule our page already states, from
    someone else's listing, with no page of ours in the answer.
  - **The second axis was declined, which is the other half of the cycle.** Level fit - "I
    already use ChatGPT every day, is this too basic for me" - had never been tested in 137
    probes. No page of ours came back, but there is no gap: both answers resolved to "check
    the listing for prerequisites", and all three programme pages already answer both ends,
    the floor ("if you can use a spreadsheet and have used a chatbot you have enough") and the
    ceiling ("Engineers are welcome - several people who build AI for a living came to the
    first cohort"). A guide there would restate pages that already rank. Logged as do-not-
    re-pitch.
  - **Checks:** `npm ci` then `npm run build` clean before and after. 62 pages (was 61),
    **3,084** internal links resolve (was 3,027), schema valid, 5 Event and 9 FAQPage nodes,
    titles and descriptions unique, no SEO warnings (the 12 outbound warnings are the sandbox
    egress policy, not the site). Verified in `dist`: canonical
    `https://oxfordagentic.com/guides/who-should-take-the-seat/`, indexable, in the sitemap,
    in `llms.txt` and `llms-full.txt` (both voice agents read them), `Article` and
    `BreadcrumbList` nodes present, `<title>` 50 characters with the suffix, description 140.
    The category mechanism gave it **five inbound internal links** on publication, including
    from `in-house-ai-day-or-send-people-to-a-cohort`, the guide it is most often confused
    with and deliberately distinct from (format versus person). Headless Chromium against a
    local preview at 375px and 1280px: one correct h1, no heading-level skips, no horizontal
    overflow, no missing alt text, no unlabelled control, 0 of 2 reveal blocks left hidden,
    no page errors beyond the sandbox's own blocked tag-manager request.
  - **Production could not be read again this cycle.** The egress policy answers 403 to
    `oxfordagentic.com` on CONNECT and `luma.com` does not resolve, so no event fact could be
    re-verified and none was touched. Deployment state comes from the Actions API: CI and
    Deploy to GitHub Pages both **success** on `1068073`, the `origin/main` HEAD, with nothing
    queued or in progress when this cycle started.
  - **Off-page:** `coursereport.com` and `humanitix.com` added to the review list with fit
    verdicts (both doubtful, neither urgent). The stale Luma listing is now **seven days
    running** and remains the highest-value item on that list, and it is ten minutes of
    Drummond's time, not the loop's.
  - Guide count: **1 of 3 this week** (week of Mon 19 Oct), 1 of 1 today.

- **2026-10-19 (08:00 local cycle) - The site had no print stylesheet, so a page saved as a
  PDF came out as a hero and then six blank sheets with the cookie banner stamped on every
  one.** The site has 61 pages and not one `@media print` rule anywhere in `src/`.
  - **Reproduced in Chromium, not reasoned about.** Printed `/events/oxford-agentic-bootcamp-cohort-3/`
    from a local preview at A4: **22 of its 22 `[data-reveal]` blocks measured opacity 0 under
    print media**, so the agenda, the key facts, the three quotes and the whole FAQ printed as
    white space. The homepage: 21 of 21. Two further causes behind the same symptom: fixed
    elements repeat on every sheet, so the consent banner sat at the foot of all ten pages and
    the phone booking bar at the head of each; and browsers leave backgrounds off by default,
    which on this palette means cream text on an ink band prints white on white.
  - **Change: one `@media print` block in `src/styles/global.css`, 97 lines, screen untouched.**
    The reveal hold and the lazy-image hold are released, transitions and animations are off so
    nothing renders mid-fade, the floating furniture (header, consent banner, back to top,
    reading progress, phone booking bar) comes off the paper, everything prints as ink on white,
    the gold rule and the buttons are redrawn in ink since their fill is gone, band padding set
    in viewport widths drops to 1.5rem, cards, quotes and list items do not break across a
    sheet, every FAQ answer prints open, and a link to Luma prints its address, because paper
    cannot be clicked.
  - **The FAQ half was a documented intention that was not true.** `Faq.astro`'s own comment
    says the accordion is "open-by-default-when-printed". It is not in current Chromium: only
    the first `<details>` printed its answer, so "How do I justify this to my manager?" - the
    question a printed page exists to answer - came out as a heading with nothing under it.
    `details::details-content { content-visibility: visible }` opens them all on paper.
  - **Nothing reaches the screen, and that is measured rather than asserted.** The compiled
    `Base.*.css` from this build is **byte-identical to the pre-change build once the new
    `@media print` block is removed**, so no screen pixel on any of the 61 pages can move.
  - **Checks:** `npm run build` clean - 61 pages, 3,027 internal links, schema valid, 5 Event
    and 9 FAQPage nodes, no SEO warnings (the 12 outbound warnings are the sandbox egress
    policy); `check:flags` passes on the all-on and all-off builds; `astro check` reports the
    same 79 errors and 4 hints as before the diff. Headless Chromium sweep of 20 pages at 375,
    768 and 1280px: no horizontal overflow, no missing alt text, no unlabelled control, no link
    or button without an accessible name, one `h1` per page, no heading-level skips, no page
    errors. Printed before and after at A4 across an event page, a past event page with photos,
    a programme page, the homepage, a guide, `/about/`, `/team/` and `/apply/`: 0 hidden blocks
    after, against 22, 21, 14 and 1 before.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403 to
    `oxfordagentic.com` on CONNECT, and `luma.com` does not resolve, so no event fact could be
    re-verified and none was touched. Deployment state comes from the Actions API: CI and Deploy
    to GitHub Pages both **success** on `5491939`, the `origin/main` HEAD, with nothing queued
    or in progress when this cycle started.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 (backlog 20), the bronze
    contrast token (21), Cohort 2's outcomes (22), the past-cohort quote heading (23), the team
    byline call (24), the Coding Bootcamp's paid-plan question (25), the event hero's doubled
    heading (26), lunch and travel (27), the two voice-page apostrophes (28), Jonathan
    Waddingham's former employer (29) and links in FAQ answers (30).
  - No guide: today's allowance unused by choice.

- **2026-10-19 (07:00 local cycle) - A past event page was about to offer a different
  bootcamp as its own next cohort. `getSuccessorEvent` fell back to any upcoming event when
  the same programme had none, and from 21 October that fallback produces a false sentence on
  the page that ranks first for "second brain workshop Oxford".**
  - **The defect, in the repo's own words.** `getSuccessorEvent` read
    `upcoming.find(same programme) ?? upcoming[0]`, documented as "Falls back to any upcoming
    event, then to the events index - PRD §6". Its stated mirror, `getPredecessorEvent`,
    carries the opposite rule in a comment written on the same file: *"Same-programme only, and
    never a fallback to some other programme: a Second Brain buyer is not reassured by an
    agentic bootcamp having gone well."* The fallback was written when there was one programme
    and cost nothing while there was, because `find` always matched.
  - **Reproduced, not reasoned about.** Backdated the Second Brain cohort and built. With the
    old line, `/events/oxford-second-brain-bootcamp-cohort-1/` rendered "The next cohort runs
    the same format - details below." above a primary button reading **"Cohort 3 - 19 November
    2026"** pointing at `/events/oxford-agentic-bootcamp-cohort-3/`, with
    `data-analytics-slug="oxford-agentic-bootcamp-cohort-3"`. Three errors in one control: a
    different bootcamp, a claim that it is the same format, and a cohort number of a programme
    that has no Cohort 3. It fires at 17:00 on 21 October, unprompted.
  - **Change: same-programme only, and make the resulting state useful.** The fallback is gone,
    so the page falls through to PRD §6's remaining rung, the events index. That branch had been
    effectively unreachable - it needs *no* upcoming events anywhere - so making it reachable for
    the first time meant giving it the answer the 01:00 cycle gave the programme page's empty
    "Runs" band six hours earlier: `NewsletterForm`, labelled "Tell me when the next dates are
    set", under the "All events" button. Same component, same label, same 1.5rem gap. No new
    component, no new pattern, and no copy promising a date, a frequency or a cadence.
  - **Evidence: the delegation axis, which the GEO log had never tested in 133 probes,** plus a
    date-anchored check on the next bookable day. The delegation probes found a real gap the
    field does not fill ("I found no independent comparison of sending a delegate versus
    attending yourself"; "No source compares founders and heads of operations for an AI
    workshop") - logged as a live guide candidate, not written today. The fourth probe is why
    this cycle's fix mattered: asked for a one-day hands-on Oxford agentic bootcamp in November
    2026, the engine returned **no page of ours**, answered off `luma.com/k7c2rm5s` and
    `luma.com/oxfordagentic2`, and concluded the bootcamp "has already passed". If engines route
    buyers to us through past-dated listings, a past-event page is a common entry point on this
    site rather than an edge case, and what it says about the next cohort has to be true.
  - **Checks:** build clean before and after, with today's output **identical** to the baseline -
    61 pages, 3,027 internal links, schema valid, 5 Event and 9 FAQPage nodes, no SEO warnings;
    `check:flags` passes on the all-on and all-off builds. Confirmed in `dist` that both Agentic
    past pages still point at Cohort 3 and that the notify block appears on **no** page today.
    Then built the simulated post-21-October state and confirmed the Agentic offer is gone, the
    "being confirmed" sentence stands, and the notify block is present. Headless Chromium against
    a local preview of that simulated build at 375px and 1280px: one correct h1, the label and
    its mailto route visible, 24px below the button row, cream on the ink band, no horizontal
    overflow, no page errors. The newsletter endpoint is still unset, so the form renders its
    honest mailto fallback.
  - **No event fact moved** - `luma.com` does not resolve from the sandbox, so none could be
    re-verified and none was touched. **`oxfordagentic.com` does not resolve either this cycle**
    (the egress policy refused it, 403 on CONNECT), so the live page could not be read; the
    deploy workflow's own conclusion was used for production state instead.
  - **Also logs the four probes** and adds `teamland.com` to the review list. **The stale Luma
    listing is now six days running** and today it beat us on a dated commercial query. That is
    the off-page item, and it is worth ten minutes of his time.
  - No guide: 0 of 3 this week, today's allowance unused by choice.

- **2026-10-19 (01:00 local cycle) - The site had a state it had never been in, arriving on
  21 October: a programme with no scheduled cohort. Simulated it in the build rather than
  waiting to find out, and it broke in two ways on the page that ranks first for its own
  commercial query.**
  - **Evidence: the waitlist axis, which the GEO log had never tested in 129 probes.** Four
    probes on what a buyer does when the day they want has no date published. **None returned a
    page of ours**, and all four answers closed by sending the reader to the provider's own
    notify route - three naming the control (Stony Brook's "JOIN THE WAITLIST" button, ARBOx's
    future-iterations form, OxML's `register` link). Probe 1's closing advice: "check the
    bootcamp's site for a waitlist or register-interest form".
  - **Why that axis, today.** The Second Brain Bootcamp runs on **21 October** and the
    programme has no further cohort set, so `/bootcamps/second-brain-bootcamp/` enters the
    no-upcoming-run state in two days. It has never been reachable before: Cohort 1 overlapped
    Cohort 2 on the Agentic line, and the Coding line launched with its cohort already dated.
  - **Measured, not assumed.** Backdated the Second Brain cohort in a throwaway build and read
    the output. Two faults, both on that page: the `Course` node emitted
    **`"hasCourseInstance": []`** - a property that claims the course has runs and then supplies
    none - and the "Runs" band rendered a single dead sentence, "Dates for the next cohort are
    being confirmed.", with no next step. The notify form existed only in the global footer,
    where it reads as site furniture rather than as an answer to the line above it.
  - **Change: omit the property, and reuse the answer the site already gives.**
    `hasCourseInstance` is now built in the frontmatter and spread in only when there is at
    least one run, so the node is a valid `Course` with the property absent rather than a
    malformed one with it empty. And the empty state now carries `NewsletterForm`, which is
    exactly what `LumaEmbed` already does in the mirror case (an event whose Luma page does not
    exist yet shows "Tell me when registration opens"). No new component, no new pattern.
  - **Plus a guard, so this cannot ship silently again.** `check-schema.mjs` now walks every
    JSON-LD node, nested objects included, and fails the build on any empty-array property.
    It generalises the `FAQPage has no questions` check that was already there. Verified both
    ways: **zero** empty arrays across the current 61 pages, and reintroducing the bug fails
    the build with exit 1 and the message naming the page and the property.
  - **What it deliberately does not do.** It does **not** fall back to listing past runs as
    `CourseInstance`s to keep the rich result alive. That would put a date that has already
    happened in front of a buyer looking for one that has not, and the Course node is valid
    without the property. No copy promises a date, a frequency or a cadence for the next Second
    Brain cohort, because none is confirmed. Second Brain content was not expanded either -
    ranking is not its constraint, per the standing decision.
  - **Checks.** `npm ci` then `npm run build` clean before and after, with today's output
    **identical** to the baseline: 61 pages, **3,027** internal links resolve, schema valid, 5
    Event and 9 FAQPage nodes, titles and descriptions unique, no SEO warnings (the 12 outbound
    warnings are the sandbox egress policy, not the site). Confirmed all three `Course` nodes
    still carry their instance today - Agentic 19 Nov, Second Brain 21 Oct, Coding 26 Nov - so
    nothing live moved. Then built the simulated post-21-October state and confirmed the
    property **absent** and the notify block present. Headless Chromium against a local
    `astro preview` of that simulated build at **375px and 1280px**: one correct `h1`, the
    notify label and its `mailto:hello@oxfordagentic.com` route visible and styled like the
    footer's, 24px above it, `scrollWidth` equal to `clientWidth`, no page errors, no failed
    local requests. Four screenshots. The newsletter endpoint is still unset, so the form
    renders its honest mailto fallback rather than a control that silently does nothing.
  - **No guide. Guides this week: 0 of 3** - this is the first day of a new Monday-Sunday week.
    Today's allowance unused by choice, for the sixteenth day running.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export newer than the 13 Sept reading. Nothing estimated.
  - **Production could not be read, for the fifteenth day, and neither could Luma.** The sandbox
    egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by the proxy)
    and `luma.com` does not resolve, so `build.txt` could not be polled and **no event fact
    could be re-verified against the live Luma pages**. None was touched. Deployment state comes
    from the Actions API: CI and Deploy to GitHub Pages both **success** on `bfa9f38`, the
    `origin/main` HEAD, at 19:09-19:12Z, with nothing queued or in progress when this cycle
    started.
  - **Off-page: the brand problem again, and it is now the Second Brain line too.** Probe 2
    asked for our own event by name, two days before it runs, and got **no page of ours** - the
    engine answered off Forte Labs' "AI Second Brain" cohort course instead, down to its
    enrolment dates, and said plainly "I couldn't find any 'Oxford Second Brain Bootcamp' in the
    results". That is the third line in a row to fail a brand-name query (stale Luma for
    Agentic, "no such listing" for Coding, somebody else's product for Second Brain), and all
    three are the off-page item rather than a page fix. `enspire.ox.ac.uk` corroborated on two
    further query shapes and the note was appended to its existing entry; `happeningnext.com`
    added at the bottom of the review list, flagged honestly as probably not worth his ten
    minutes. Nothing contacted, nothing submitted, no account made.
  - **For his eye:** the Second Brain programme has no cohort after 21 October. The page now
    handles that honestly and captures interest, but the page cannot supply a date. **Backlog 22
    is also now two cohorts deep** - neither Cohort 2's nor Cohort 1's Second Brain outcomes are
    recorded, and after Wednesday there will be a second room whose results nothing on the site
    reports.

- **2026-10-18 (19:00 local cycle) - Two cycles of probes found the field with no evidence of
  what a day produces. The site has that evidence on one page, and almost nothing points at it:
  `/events/oxford-agentic-bootcamp-cohort-1/` had two routes in, both card listings whose anchor
  text is the date and the venue, and not one of the 30 guides linked to it.**
  - **Evidence: the format-choice axis, which the GEO log had never tested in 125 probes.** Four
    probes on which of three similarly named bootcamps a buyer should pick. **None returned a page
    of ours.** The engines named the problem almost in our own words - "The labels aren’t
    standardised, so the syllabus matters more than the name" - and both generic probes closed by
    telling the reader to ask the provider whether code reading is expected. Probe 2 showed how
    badly names travel: a London "AI Coding Bootcamp" that is actually a no-code programme for
    non-technical founders, and a "Generative AI Skills Bootcamp" flagged as for technically-minded
    learners.
  - **That axis needed nothing, and nothing was written for it.** Checked in the source before
    writing: the Agentic programme page already carries **"Which of the three bootcamps should I do
    first?"**, the full three-way answer, the Coding and Second Brain pages each carry "How is this
    different from the Oxford Agentic Bootcamp?", and all three answer "Do I need to be technical?"
    or "Do I need to be able to code?" - the exact question both probes told the reader to go and
    ask. A fourth consecutive FAQ on pages that already answer the question is padding, not an
    improvement, so **no FAQ and no guide**.
  - **Three other candidates were measured and declined, so later cycles do not re-derive them.**
    (a) **Internal linking is healthy where it matters**: counting unique inbound internal links per
    sitemap URL across the 61 built pages, all three programme pages and all three upcoming event
    pages score **58**, the same as every nav page, and guides score 3 to 9. (b) **The structured
    data is already there**: the programme pages carry `Course` and `CourseInstance` with
    `courseMode`, `courseWorkload`, dates and location, and the event pages carry `EducationEvent`
    with `offers`, `organizer`, `performer`, `superEvent` and a full `subEvent` agenda. (c) The
    **IndexNow mapping** named as a standing candidate is already correct: `scripts/indexnow-ping.mjs`
    maps `src/lib/home.ts` to `/` alone, confirmed on 17 Oct and still so.
  - **The real gap was measured in `dist/`.** Cohort 1’s page is the only page on the site that
    records what a room actually produced - sixteen attendees, three teaching blocks, and the tasks
    that surfaced - and it had **2 inbound internal links** against 58 for every nav page. Both
    anchors are the event card ("Cohort 1 / Tuesday, 21 July 2026 / St Anne’s College"), so the
    only description a crawler had of that page was when it happened, not what came out of it.
    Meanwhile exactly **one sentence in any guide** makes a factual claim about a past room, and it
    cited nothing: `what-you-can-build-in-one-day-with-ai` (12 Oct) said "In our own rooms, the
    tasks that surfaced were lead generation, internal reporting and marketing content" - the same
    three tasks Cohort 1’s page publishes verbatim.
  - **Change: one link, one guide, one sentence, no new fact.** "In our own rooms" becomes
    "In [Cohort 1’s room](/events/oxford-agentic-bootcamp-cohort-1/)". It sources the claim on the
    page that evidences it, gives the proof page a third route in with an anchor that names the
    cohort rather than the date, and makes the attribution **more** accurate: the plural was
    unevidenced, because Cohort 2’s page still carries no outcomes (backlog 22), so the three tasks
    are Cohort 1’s room specifically. Internal links go 3,026 to 3,027; page, FAQPage and Event
    totals all unchanged.
  - **What it deliberately does not do.** The same claim appears on two **booking** pages, in the
    "What did people in Cohort 1 actually build?" answer on Cohort 2’s and Cohort 3’s pages, and
    those could not be linked: `Faq.astro` renders answers as escaped plain text (`<p>{faq.a}</p>`),
    so no FAQ answer anywhere on the site can carry a link. Making them able to would change how all
    9 `FAQPage` nodes and every answer on the site render, including the JSON-LD `acceptedAnswer`,
    on the pages that take the booking. That is a component decision, not a focused cycle - logged
    as **backlog 30**. Nothing was added to `/team/` either (backlog 24 is still his call).
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, **3,027** internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings (the 12 outbound
    warnings are the sandbox egress policy, not the site). `check:flags` passes on the all-on and
    all-off builds. Verified in `dist/` that the link lands on all three surfaces - visible HTML,
    the inbound count on Cohort 1 moving **2 to 3**, and `llms-full.txt`, which both voice agents
    read - and that the guide’s canonical is unchanged. Headless Chromium against a local
    `astro preview` of this exact build, at **375px and 1280px**: one correct `h1` on both the guide
    and Cohort 1’s page, the new link visible and styled exactly like the existing inline links
    (same bronze, same underline, 18px), **clicked through at 1280 and it lands on
    `/events/oxford-agentic-bootcamp-cohort-1/` with the right `h1`**, `scrollWidth` equal to
    `clientWidth`, no page errors, no failed local requests; four screenshots, and `Cohort 1’s`
    renders with no fallback glyph. `updatedDate` moved on the one file changed. **No event fact
    moved**: Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 on 19 November and
    Coding Cohort 1 on 26 November, all unchanged.
  - **No guide. Guides this week: 2 of 3** (12 and 13 Oct); today’s allowance unused by choice for
    the fifteenth day running, and this is the last day of that week.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment, and
    `seo-data/` holds no CSV or TSV export. Nothing estimated.
  - **Production could not be read, for the fourteenth day, and neither could Luma.** The sandbox
    egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by the proxy), so
    `build.txt` could not be polled and **no event fact could be re-verified against the live Luma
    pages**. Deployment state comes from the Actions API: CI and Deploy to GitHub Pages both
    **success** on `7fe852d`, the `origin/main` HEAD, at 13:13-13:15Z, with nothing queued or in
    progress when this cycle started.
  - **Off-page: one new lead, and the brand problem for the fifth day.** `maven.com` added to the
    bottom of the review list - it supplied two of the four answers today and is the only route on
    that list ever retrieved on a buyer question with **no Oxford in it**, which is the query shape
    the site has never ranked for. It is a marketplace rather than a free directory, so listing is a
    commercial decision and his. And probes 3 and 4 again answered brand queries entirely off
    `luma.com/oxfordagentic2` and `luma.com/k7c2rm5s` with no page of ours: the date given as **21
    July 2026**, the venue "should be confirmed" because the listings disagree, and this time no
    pricing found either. A buyer searching our own name is still being told the event has passed.
    Nothing contacted, nothing submitted, no account made.
  - **Also worth his eye, and new today:** probe 3 asked about both bootcamps by name and the engine
    answered *"I couldn’t find any listing for an ‘Oxford Agentic Coding Bootcamp’ ... check the
    exact title of the event you saw"*. Nothing on-site explains it - that page sits in the nav and
    footer with 58 inbound links, is in the sitemap, and carries `Course`, `CourseInstance` and
    `FAQPage` nodes. It is three weeks old with no third-party listing anywhere, which is the
    off-page item again rather than a page fix.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 and the two stale branches
    (20), the bronze contrast token (21), Cohort 2’s outcomes (22), the testimonial heading on
    past-cohort pages (23), the team-profile byline link (24), the Coding Bootcamp’s paid-plan
    prerequisite (25), the doubled event-page heading (26), the lunch and travel lines (27), the two
    voice pages’ apostrophes (28), Jonathan Waddingham’s two published former employers (29) and,
    new today, links inside FAQ answers (30).

- **2026-10-18 (14:00 local cycle) - The bootcamp the whole site is built around never said
  who teaches it. The Coding Bootcamp, three weeks old, answers that question on both of its
  pages; the flagship line answered it on neither, and an engine asked it today answered from
  a Luma listing instead.**
  - **Evidence: the proof axis, which the GEO log had never tested in 121 probes.** Four
    probes on whether one day produces anything real - what past attendees built, and who the
    reader should believe. **None returned a page of ours.** The field has no proof and the
    engines said so: every result was "an event listing describing what attendees are supposed
    to build, not verified results", "treat the promises as marketing claims", "I found no
    independent evidence for the 'one day' claim", and, asked directly, it "didn't turn up any
    examples of what past attendees built".
  - **The proof half needed nothing, and nothing was written for it.** We already publish the
    specifics the field lacks: Cohort 1's page carries sixteen attendees, three teaching blocks
    and the tasks that surfaced in the room, two event pages carry "What did people in Cohort 1
    actually build?", and `what-you-can-build-in-one-day-with-ai` (12 Oct) answers the first
    probe's query almost verbatim. The built programme page names Cohort 1 eleven times. A
    six-day-old guide not being cited is engine lag, not a gap, so no guide and **no Q&A block**:
    padding a guide that already answers the question is not an improvement.
  - **The credibility half was a real gap, measured in `dist/`.** On the Agentic Bootcamp's own
    programme page the string "Drummond Gilbert" appeared **only inside the Organization
    JSON-LD** - no visible copy named anyone, no "Saïd Business School", no "Practical AI
    meetup" - and the Cohort 3 booking page was the same. The **Coding** Bootcamp answers "Who
    runs it?" on both its programme and its booking page. So the flagship line, which this log
    repeatedly shows ranking for the undated queries, was the one line that never said who
    teaches the day, while the fourth probe answered that question for a buyer off Luma:
    "Drummond Gilbert, who tutors in AI in Management at Saïd Business School, runs Oxford's
    Practical AI meetup, along with three co-hosts."
  - **Change: one FAQ, two files, no new fact in either.** "Who runs it?" on
    `programmes/oxford-agentic-bootcamp.md` and on
    `events/oxford-agentic-bootcamp-cohort-3.md`, last in both lists, which is where the
    Coding pages put theirs. The wording and the role format are the Coding answer's own, so
    the two lines cannot drift; the three names and their roles are exactly what
    `src/content/team/` publishes for `programmes: ['oxford-agentic-bootcamp']` - Nicolai
    Thomson (founder, Jenesys AI), Emine Gokce Phillips (co-founder and CEO, Novaria),
    Jonathan Waddingham (product consultant) - and the closing clause restates this page's own
    published lines, "the day is facilitated rather than lectured" and `/team/`'s "Each runs
    part of a day". `FAQPage` question counts go 18 to 19 and 10 to 11; site totals unchanged
    at 9 `FAQPage` and 5 `Event` nodes.
  - **What it deliberately does not do.** The four names are **not linked**: linking the
    profiles from the page that sells the day is backlog 24 and Drummond's call, and this
    cycle does not pre-empt it. **Guest speakers stay unnamed** (his 13 Sept decision), and
    nothing claims which people will be in the room on 19 November, because that is an event
    fact and `luma.com` does not resolve from here. It adds no employment history beyond the
    `role` and `company` fields `/team/` already shows, which is also why it does not repeat
    the Coding pages' "ex-JustGiving" clause - see the new backlog 29.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings (the 12
    outbound warnings are the sandbox egress policy, not the site). `check:flags` passes on the
    all-on and all-off builds. Verified in `dist/` that the answer lands on all three surfaces -
    visible HTML on both pages, the `FAQPage` JSON-LD (19 and 11 questions counted in the built
    graph), and `llms-full.txt`, which both voice agents read. Headless Chromium against a local
    `astro preview` of this exact build, both pages at **375px and 1280px**: one correct `h1`
    each, the new accordion found by its summary text, clicked open, its answer visible and
    complete at both widths, `scrollWidth` equal to `clientWidth`, no page errors, no failed
    local requests; four screenshots, and `Saïd` and `Oxford’s` both render with no fallback
    glyph. `updatedDate` moved on the one file that carries one. **No event fact moved**:
    Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 on 19 November and
    Coding Cohort 1 on 26 November, all unchanged.
  - **No guide. Guides this week: 2 of 3** (12 and 13 Oct); today's allowance unused by choice
    for the fourteenth day running.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export. Nothing estimated.
  - **Production could not be read, for the thirteenth day, and neither could Luma.** The
    sandbox egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by the
    proxy) and `luma.com` does not resolve, so `build.txt` could not be polled and **no event
    fact could be re-verified against the live Luma pages**. Deployment state comes from the
    Actions API: Deploy to GitHub Pages run 39111258713 on `8eeab28`, the `origin/main` HEAD,
    **success** at 08:24Z, with nothing queued or in progress when this cycle started.
  - **Off-page: one new lead and the same item worse for the fourth day.** `createwith.com`
    added to the bottom of the review list - it carried a one-day Oxford AI workshop on the 18
    Oct travel probe and Saïd Business School's own programme today, so it indexes both ends of
    the field. And the Luma item gained a fifth axis: today's brand-adjacent probe took the
    **host roster** off the stale listing as well as the date and the venue contradiction.
    Nothing contacted, nothing submitted, no account made.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 and the two stale
    branches (20), the bronze contrast token (21), Cohort 2's outcomes (22), the testimonial
    heading on past-cohort pages (23), the team-profile byline link (24), the Coding Bootcamp's
    paid-plan prerequisite (25), the doubled event-page heading (26), the lunch and travel lines
    (27), the two voice pages' apostrophes (28) and, new today, Jonathan Waddingham's two
    published former employers (29).

- **2026-10-18 (09:20 local cycle) - The site set the same phrase two ways on the same
  page. Markdown prose goes through the typographer and gets a curly apostrophe;
  frontmatter, `.astro` copy and `.json` data bypass it and keep the typewriter mark, and
  nobody had ever looked.**
  - **Evidence, counted across the built site.** Stripping scripts, styles, code and tags
    from all 61 built pages and reading what is left: **46 straight marks on 23 pages**
    against 55 curly ones on 24, with 8 pages carrying both. The worst instance is
    `/guides/what-hands-on-ai-training-actually-means/`, where the `h1` reads
    `'hands-on'` in Newsreader at display size and its own `h2`, forty lines below, reads
    `“hands-on”`. The same split put `'second brain'` in one guide title and
    `You've finished` in another, both of which are also the `<title>`, the OG card, the
    RSS item, the llms.txt line and the anchor text of every cross-link to them.
  - **The cause is structural, not a typo.** Remark's typographer runs over markdown body
    prose only. Every string that reaches a page another way keeps what was typed: event
    and guide frontmatter, programme FAQ answers, team bios, `photos.json` alt text, the
    homepage FAQ in `src/lib/home.ts`, and copy written straight into `about.astro`,
    `privacy.astro` and `HomeSections.astro`.
  - **Change: apply the same conversion to the strings that bypass the pipeline.**
    Possessives and contractions to `’`, and the two quoted phrases in guide titles to
    `‘ ’` - exactly what the typographer would have produced had the text been body prose.
    No word, claim, date, venue, name or testimonial changed; `St Anne's College` became
    `St Anne’s College` and nothing else moved. 20 files: 5 events, 5 guides, 3 programmes,
    2 team bios, `photos.json`, `home.ts`, `HomeSections.astro`, `about.astro`,
    `privacy.astro`.
  - **Plus a guard, so it cannot come back quietly.** `check-schema.mjs` now warns -
    non-blocking, like the description-length warning from cycle 74 - when an indexable
    page's rendered copy carries a straight apostrophe, with `code` and `pre` excluded so a
    quoted command never trips it. It earned its place during this cycle: it caught a
    second copy of the affiliation answer in `home.ts` that the manual sweep had missed.
  - **Verified.** Built site re-scanned: **46 straight marks to 0** on every indexable page.
    Build green (3026 links, 61 pages, schema valid, no warnings); `check:flags` passes
    all-on and all-off; `astro check` reports 79 errors before and after this diff, all
    pre-existing implicit-`any` and content-collection typing in files this cycle did not
    touch, and it is not a CI gate here. Font coverage checked before shipping rather than
    after: `’ ‘ “ ”` are present in all seven self-hosted woff2 subsets and all three OG
    TTFs, so no fallback glyph and no tofu - confirmed by eye on the OG card, on
    `ST ANNE’S COLLEGE, OXFORD` in IBM Plex Mono caps, and on the guide `h1` at 375, 768
    and 1280. Full audit re-run at all three widths over 17 pages: no horizontal overflow,
    no missing alt text, no unlabelled control, no link without an accessible name, one
    `h1` per page. `rss.xml`, `sitemap-0.xml` and `sitemap-index.xml` all still parse.
    `updatedDate` moved on the 8 content entries that carry one. **No event fact moved**:
    Second Brain 21 October at the Pitt Rivers Museum, Cohort 3 on 19 November and Coding
    Cohort 1 on 26 November are untouched, and no price, figure, quote or consent flag was
    added or changed.
  - **Two pages deliberately left.** `/find-your-bootcamp/` and `/office-hours/` still carry
    five straight marks between them. STATE.md says the daily loop leaves those unlisted
    voice pages unchanged, so it did; the new warning skips them because they are noindex.
    Logged as backlog 28 for Drummond rather than fixed here.
  - **Production could not be read, for the twelfth day, and neither could Luma.** The
    sandbox egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by
    the proxy), so before and after are both local previews of the exact build that shipped.
    Deployment state comes from the Actions API: Deploy to GitHub Pages run 39109709851 on
    `9546805`, the `origin/main` HEAD, **success** at 08:00Z, with nothing queued or in
    progress when this cycle started.
  - **Still waiting on Drummond**, unchanged and not re-pitched: PR #1 and the stale
    `fix/breadcrumb-mobile-overflow` and `feat/ceo-roundtable-demand-page` branches (20),
    the bronze contrast token (21), Cohort 2's outcomes (22), the testimonial heading on
    past-cohort pages (23), the team-profile byline link (24), the Coding Bootcamp's paid-plan
    prerequisite (25), the doubled event-page heading (26) and the lunch and travel lines (27).

- **2026-10-18 (08:00 local cycle) - The bootcamp whose own outcomes promise "a room of
  senior peers ... and their contact details" never answered what happens after the day.
  The answer has been published since before September, on the homepage, which is not a
  page anybody books from.**
  - **Evidence: the after-the-day axis, which the GEO log had never tested in 117 probes.**
    Four probes on what a buyer has once the day is over - materials, follow-up, and whether
    the room turns into anything. **None returned a page of ours.** The shape is the one the
    payment, confidentiality and travel axes returned: the answer lives on provider pages and
    the engine closes by sending the reader to one. The first probe found "no authoritative UK
    standard", said every result was a provider's own marketing, and advised the reader to
    "ask the provider directly what follow-up is included, how long it lasts, and whether it
    costs extra"; the second said it "depends on the organiser" and to "check the event page
    for a 'what's included' section, or email the organiser". What competitors publish is the
    bar: a follow-up session inside the package, a separate 2-hour 1-2-1 at GBP 95, three
    months of support on a funded course, recordings about a week later, and - on two of the
    three bootcamp-shaped results - an **alumni community**, one of them describing a cohort
    community "meant to outlast the programme".
  - **The gap, measured, and it is the 17 Oct invoice shape exactly.** `grep` for "after the
    day" across `src/`: **one published occurrence**, the homepage FAQ in `src/lib/home.ts`.
    In `dist/` it reached `index.html`, `home-photos/` and `llms-full.txt` and nothing else.
    No programme page and none of the five event pages carried it, while the Agentic
    programme page's `outcomes` promises "a room of senior peers working on the same problem,
    and their contact details" and Cohort 3's `whatYoullBuild` promises "a written recipe, so
    you can rebuild and extend it on Monday". The promise was published on the page; the
    question that asks about it was not.
  - **Change: one FAQ, two files, no new fact in either.** "What happens after the day?" on
    `programmes/oxford-agentic-bootcamp.md` (after "Is the day recorded?", which is the answer
    that raises it) and on `events/oxford-agentic-bootcamp-cohort-3.md` (after "How big is the
    cohort?", because the room and what the room becomes are one thought). The substance is
    `home.ts`'s own answer, so the two surfaces cannot drift, and each version opens on its own
    page's published facts: the programme version on its `outcomes` contact-details line and
    the recording answer directly above it, the Cohort 3 version on its written-recipe line and
    its `assurances` "you leave with the workflow rather than a recording". It keeps `home.ts`'s
    deliberate restraint, recorded in the comment there: never community, network or alumni
    network, because those words promise infrastructure - describe what happens instead, and
    close on "an upside rather than a reason to come". `FAQPage` question counts go 17 to 18 and
    9 to 10; site totals unchanged at 9 `FAQPage` and 5 `Event` nodes.
  - **The other two lines were deliberately left out**, recorded so the next cycle does not add
    them by pattern-matching. The homepage answer rests on rooms that have run: "everyone in the
    room has built the same thing, they stay in touch afterwards" is an observation about Agentic
    Cohorts 1 and 2. Second Brain Cohort 1 is on 21 October and Coding Cohort 1 on 26 November,
    so neither has a room to describe. Revisit after each has run.
  - **What it deliberately does not say.** Nothing about included follow-up sessions, email
    support, a portal, materials sent afterwards, a certificate (unconfirmed, say nothing either
    way), or how often reunions and function editions actually happen. Every competitor answer
    the probes returned was a commitment with a duration or a price on it; we have no such
    commitment to publish, so none was invented.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings (the 12 outbound
    warnings are the sandbox egress policy, not the site). `check:flags` passes on the all-on and
    all-off builds. Verified in `dist/` that the answer lands on all three surfaces - visible HTML
    on both pages, the `FAQPage` JSON-LD (18 and 10 questions counted in the built graph), and
    `llms-full.txt` (3 occurrences), which both voice agents read. Headless Chromium against a
    local `astro preview` of this exact build, both pages at **375px and 1280px**: one `h1` each
    and correct, the new accordion found by its summary text, clicked open, its answer visible and
    complete at both widths, `scrollWidth` equal to `clientWidth`, no page errors, no failed local
    requests; four screenshots. `updatedDate` moved on the one file that carries one. **No event
    fact moved**: Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 on 19
    November and Coding Cohort 1 on 26 November at Worcester College, all unchanged.
  - **No guide. Guides this week: 2 of 3** (12 and 13 Oct); today's allowance unused by choice for
    the thirteenth day running. This axis cannot carry one: "what follow-up do you get" is a
    question about one provider's terms, and no editorial page of ours can answer it for the field.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment, and
    `seo-data/` holds no CSV or TSV export. Nothing estimated.
  - **Production could not be read, for the eleventh day, and neither could Luma.** The sandbox
    egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by the proxy) and
    the host does not resolve for `WebFetch`, so `build.txt` could not be polled and **no event
    fact could be re-verified against the live Luma pages**. That is why this cycle moved none.
    Deployment state comes from the Actions API: Deploy to GitHub Pages run 39085420689 on
    `4839a84`, the `origin/main` HEAD, **success** at 01:10Z, with nothing queued or in progress
    when this cycle started.
  - **Off-page: no new item, and one existing item got materially worse.** The brand-adjacent
    probe - "hands-on agentic AI bootcamp Oxford what happens after the day" - returned two Luma
    pages, **allai.events** and five competitors, and **no page of oxfordagentic.com at all**. The
    engine then reported the date as "21 Jul 2026", said "that session has already passed ... I
    didn't find a newer date", and noted that "the listings disagree" on the venue, naming
    Worcester College and St Anne's. That is the second probe in three days in which the stale
    allai.events listing stands in for our own site, and the first in which the engine tells the
    reader the bootcamp is over. Note appended to that entry on the review list; nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma listings and the stale
    allai.events page (2b and the review list), PR #1 (20), the bronze contrast token (21), Cohort
    2's outcomes (22), the past-cohort testimonial heading (23), the guide-byline call (24), the
    Coding Bootcamp's paid-plan requirement (25), the duplicated event hero eyebrow (26) and lunch
    on the Second Brain and Coding days (27).

- **2026-10-18 (02:00 local cycle) - Every event page tells you the day ends at 17:00.
  No programme page said when the day ends at all, and the programme pages are the ones
  that rank for the queries with no date in them.**
  - **Evidence: the arrival-and-travel axis, which the GEO log had never tested in 114
    probes.** Three probes on the question a buyer who does not live in Oxford asks last -
    what time does it start, when does it finish, does that mean a hotel. None returned a
    page of ours. The shape is the one the payment and confidentiality axes returned on 17
    Oct: **every useful answer came off a provider's own booking or listing page** publishing
    its hours, its lunch line and its getting-here note - "9:00am to 5:00pm at Regus" on a
    one-day Oxford workshop, "approximately 9.30am to 4pm" with a sandwich lunch on a council
    course, "8:30 AM arrival ... 12:00 PM lunch ... 4:00 PM wrap-up" on a London agenda. Both
    workshop probes closed by telling the reader to check the provider's booking page or email
    the organiser. No editorial page appeared in any of the three result sets, so this is a
    page fix, not a guide.
  - **The gap, measured.** All five event pages print **9:00-17:00** in the Key facts card,
    and the Second Brain and Coding event pages say it again inside an answer. The three
    **programme** pages said it **nowhere** - not in body copy, not in any of their 16, 12 and
    8 FAQs, not in visible text anywhere on the page. Those are the pages this same log shows
    ranking for the undated queries (`second brain for AI one-day in-person course UK`, #1 on
    13 Sept; the Agentic programme page is the hub the nav and every guide link into). So a
    buyer weighing a train, and possibly a night in Oxford, had to open a dated event page to
    find out when the day ends.
  - **Change: one FAQ on each of the three programme pages, no new fact in any of them.**
    "What time does the day start and finish?", placed directly after "Where in Oxford is it
    held?" on all three, because where and when are the same decision. 09:00 to 17:00 is what
    all five event files publish in `startDate` and `endDate` and what the Key facts card
    already renders. Each answer closes with that page's own existing deferral idiom - "Each
    event page confirms its own date and times, and that is the page to go by" on the Agentic
    and Coding pages, "The exact date and times are confirmed on each event's own page" on
    Second Brain - so the authoritative surface stays the event page. The Agentic answer adds
    one clause the other two cannot: its event agendas run to "16:00 Making it stick, 16:20
    Wrap and networking", so its last block genuinely is the wrap and networking rather than
    new material. The Second Brain and Coding agendas carry no clock times at all ("Morning",
    "Session 1"), so neither answer claims anything about their shape. `FAQPage` question
    counts go 16 to 17, 12 to 13 and 8 to 9; site totals unchanged at 9 `FAQPage` and 5
    `Event` nodes.
  - **What it deliberately does not say.** Nothing about trains, walking times, parking, Park
    and Ride or hotels; nothing promising that a return trip from London fits in the day;
    nothing about lunch on the two lines that have never mentioned it. The travel probe's
    whole field was JustPark, Parkopedia and hotel directions pages, and a sentence of ours in
    that field would be a guess about the world. Both declined items are raised as backlog 27.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings. `check:flags`
    passes on the all-on and all-off builds. Verified in `dist/` that the answer lands on all
    three surfaces - visible HTML, the `FAQPage` JSON-LD on each page (17, 13 and 9 questions
    counted in the built graph), and `llms-full.txt` (three occurrences), which both voice
    agents read. Headless Chromium against a local `astro preview` of this exact build, all
    three pages at **375px and 1280px**: one `h1` each and correct, the new accordion found by
    its summary text, clicked open, its answer visible and containing both 09:00 and 17:00 at
    both widths, `scrollWidth` equal to `clientWidth`, no page errors, no failed local
    requests; six screenshots. `updatedDate` moved on all three files. **No event fact moved**:
    Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 on 19 November and
    Coding Cohort 1 on 26 November at Worcester College, all unchanged.
  - **No guide. Guides this week: 2 of 3** (12 and 13 Oct); today's allowance unused by choice
    for the twelfth day running. The travel probe is the clearest decline the topic rule has
    produced in a while: the field is car parks and hotels, it is not ours, and a page from us
    would convert nobody.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export. Nothing estimated.
  - **Production could not be read, for the tenth day, and neither could Luma.** The sandbox
    egress policy answers 403 to `oxfordagentic.com` (`connect_rejected`, logged by the proxy)
    and `luma.com` does not resolve for `curl` or `WebFetch`, so `build.txt` could not be
    polled and **no event fact could be re-verified against the live Luma pages**. That is why
    this cycle moved none. Deployment state comes from the Actions API: Deploy to GitHub Pages
    run 39061117557 on `dcec06c`, the `origin/main` HEAD, **success** at 19:08Z on 17 Oct,
    with nothing queued or in progress when this cycle started.
  - **A note for whoever reads the scheduled prompt next.** Its CONTEXT block still describes
    Cohort 2 (16 Sept), Cohort 3 as 15 Oct and `luma.com/oxfordagentic2`/`3` as the live pages.
    The repo and the Actions history disagree and are right: Cohort 3 is **19 November**, the
    Coding Bootcamp Cohort 1 is **26 November**, and Second Brain Cohort 1 is on **21 October**,
    three days from now. The prompt's two "known candidates" about stale Cohort 2 sentences and
    `indexnow-ping.mjs` were both checked off as already done on 17 Oct and are still done.
  - **Off-page: one unverified lead added**, `tutorials.co.uk`, a UK training directory whose
    Oxfordshire page came back on two separate probes this cycle. Placed at the bottom of the
    review list so the Luma item keeps the top. The rest of what the probes returned was
    hotels, car parks and providers. Nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma listings (2b and the
    review list), PR #1 (20), the bronze contrast token (21), Cohort 2's outcomes (22), the
    past-cohort testimonial heading (23), the guide-byline call (24), the Coding Bootcamp's
    paid-plan requirement (25), the duplicated event hero eyebrow (26) and now lunch on the
    Second Brain and Coding days (27).

- **2026-10-17 (19:00 local cycle) - The bootcamp that makes "bring a real task from your
  own work" a condition of attending never said what to do if that work is confidential.
  Its Second Brain sibling answers the same question on both its pages.**
  - **Evidence: the confidentiality axis, which the GEO log had never tested.** Three probes
    on whether a buyer is allowed to bring their own real work into the room. None returned a
    page of ours. What they returned is the same shape the payment axis returned five hours
    ago: **providers publishing their own conditions**, with no editorial page anywhere in the
    field. One runs sessions on "your own files, your client comms and your service lines" and
    states how it protects confidentiality; one asks participants to bring **anonymised**
    emails and reports; one holds a call a week ahead to choose which tasks to use; one gives
    a data-security briefing; one tells attendees to get IT approval before connecting a work
    account. The engine closed both booking-shaped probes by telling the reader to go and ask
    the provider: "confirm with the organiser which tools will be used", "ask any UK provider
    how they handle data". When the answer lives on provider pages, the provider page is the
    fix, not a guide.
  - **The gap, measured, and it was an asymmetry inside our own site.** The **Second Brain**
    line answers this on both its pages - "What if my material is confidential?" on the
    programme page, "What if some of my material is confidential?" on the Cohort 1 event page
    - and `is-it-safe-to-put-company-documents-in-a-second-brain` works through it at length.
    The **Agentic Bootcamp** line answers it **nowhere**: 15 FAQs on the programme page, 8 on
    the Cohort 3 booking page, none of them this. That is the line whose `whoFor` names
    consultants, public-sector and professional-services buyers, whose one instruction is
    "one real task from your own work", and whose `Who is it not for?` excludes "anyone who
    cannot bring a real task from their own work". The condition was published; the reassurance
    was not.
  - **Change: one FAQ, two files, no new fact in it.** "What if my task is confidential?" on
    `programmes/oxford-agentic-bootcamp.md` and `events/oxford-agentic-bootcamp-cohort-3.md`,
    placed directly after "What do I need to bring?" / "What should I bring?", which is the
    answer it qualifies. The wording and the external-supplier test are the Second Brain
    answer's own, adapted from material to task, so the two lines cannot say different things.
    Every clause restates something the same page already publishes: you choose the task
    ("One real task from your own work"), you build on your own machine ("the day is spent
    building on your own machine"), and the day is not recorded ("Is the day recorded? No").
    The credentials-and-personal-data clause is the Second Brain answer's, verbatim in
    substance. `FAQPage` question counts go 15 to 16 and 8 to 9; site totals unchanged at 9
    `FAQPage` and 5 `Event` nodes. Both event pages were given the same treatment the invoice
    FAQ got at 14:00, so the 16 Oct mistake - fixing a programme page and not carrying it to
    the page that takes the booking - is not repeated.
  - **The Coding Bootcamp was considered and deliberately left out**, recorded so the next
    cycle does not add it by pattern-matching. Its day builds a new website and a product
    prototype from an idea, in your own repository. It does not ask you to bring existing
    company material, so the question is not live on it in the way it is on a day built
    against a task you already do. Revisit if a probe on the coding axis returns it.
  - **What it deliberately does not say.** Nothing about how any AI provider treats data,
    which plan you are on, what the room sees, GDPR, or any undertaking about how we handle
    material. Those are either unconfirmed or not ours to state. The answer is a test the
    buyer applies themselves, plus three facts already on the page.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings.
    `check:flags` passes on the all-on and all-off builds. Verified in `dist/` that the answer
    lands on all three surfaces - visible HTML, the `FAQPage` JSON-LD on both pages, and
    `llms-full.txt`, which both voice agents read. Headless Chromium against a local
    `astro preview` of this exact build, both pages at **375px and 1280px**: one `h1` each and
    correct, the new accordion found by its summary text, clicked open, its answer visible and
    complete at both widths, `scrollWidth` equal to `clientWidth`, no page errors, no failed
    local requests; four screenshots. `updatedDate` moved on the one content file that carries
    one. **No event fact moved**: Second Brain 21 October at the Pitt Rivers Museum, Agentic
    Cohort 3 on 19 November and Coding Cohort 1 on 26 November at Worcester College.
  - **No guide.** The second-brain data probe is the only one that could carry one, and we
    already publish the better version of that answer as a guide, so a second page would be a
    near-duplicate. **Guides this week: 2 of 3** (12 and 13 Oct); today's allowance unused by
    choice for the eleventh day running.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export. Nothing estimated.
  - **Production could not be read, for the ninth day.** The sandbox egress policy answers 403
    to `oxfordagentic.com` (`connect_rejected`, logged by the proxy) and the host does not
    resolve for `WebFetch` either, so `build.txt` could not be polled and **no event fact could
    be re-verified against Luma**. Deployment state comes from the Actions API: Deploy to
    GitHub Pages run 39035386583 on `292930f`, the `origin/main` HEAD, **success** at 13:10Z,
    with nothing queued or in progress when this cycle started.
  - **Off-page: no new item.** Every name the probes returned is a competitor or a provider
    rather than a listing route; the two platforms that appeared are already on the list or are
    ticketing we do not use. Nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma listings (2b and the
    review list), PR #1 (20), the bronze contrast token (21), Cohort 2's outcomes (22), the
    past-cohort testimonial heading (23), the guide-byline call (24), the Coding Bootcamp's
    paid-plan requirement (25) and the duplicated event hero eyebrow (26).

- **2026-10-17 (14:00 local cycle) - An organisation that cannot put a card through had
  nowhere on a booking page to learn it can be invoiced. The answer has been published
  since 13 September, on one page nobody books from.**
  - **Evidence: the payment and procurement axis, which the GEO log had never tested.** Four
    probes, two of them on how an organisation actually pays rather than on what the day
    costs. Neither returned a page of ours. What they returned is the shape that matters:
    **training providers publishing their own billing route** - SAP's "Payment by Purchase
    Order (Invoice)" help page, a UK training company's "Pay an Invoice" page, and US
    providers' employer-reimbursement pages, one of which notes that Stanford invoices the
    company while Berkeley invoices the delegate. The engine closed by telling the reader to
    "confirm which billing route your provider uses before you ask". The group-booking probe
    said the same from a second angle: the field answers it off provider pages stating their
    own terms (TESS Group's "closed cohorts, from 2 delegates"), and ended by telling the
    reader to ask a provider for a quote.
  - **The gap, measured.** `grep` for "invoice" across `src/`: **one published occurrence**,
    `src/lib/home.ts` - the homepage FAQ - plus the unlisted CEO roundtable form. In `dist/`
    it reaches `index.html`, `home-photos/` and `llms-full.txt` and nothing else. So the one
    answer a public-sector, NHS, university or finance-gated buyer needs appeared on **no
    programme page and none of the five event pages**, while all three upcoming event pages
    embed a Luma form whose only visible route is a card. Those same buyers are named in
    `whoFor` on every one of those pages.
  - **Change: one FAQ on each of the three upcoming event pages, no new fact in any of
    them.** `oxford-second-brain-bootcamp-cohort-1`, `oxford-agentic-bootcamp-cohort-3` and
    `oxford-agentic-coding-bootcamp-cohort-1` gain "Can my organisation pay by invoice?",
    answered in `home.ts`'s own words: pricing and the booking form are on this page, and an
    organisation that would rather be invoiced emails hello@oxfordagentic.com. It is placed
    with the other procurement answers - after the team and transfer questions on the two
    that have them, after "How do I justify this to my manager?" on Cohort 3. Past event
    pages are untouched. FAQ counts go 12 to 13, 7 to 8 and 7 to 8; site totals unchanged at
    9 `FAQPage` and 5 `Event` nodes.
  - **What it deliberately does not say.** Nothing about VAT (explicitly unconfirmed, and the
    first probe surfaced a UK VAT analysis of paid workshops as a live trap), nothing about
    payment terms, purchase-order handling or lead times, and no price. Only the published
    route. It did **not** go in `assurances` either: that field's own schema rule is that
    every line must restate a fact the same page states elsewhere, and on these pages the
    invoice route was not stated anywhere, so the FAQ is the honest home for it. The three
    programme pages are the other half of this and were deliberately left for a later cycle
    with its own evidence - this cycle's evidence is about the page that takes the payment.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links resolve, schema valid, titles and descriptions unique, no SEO warnings.
    `check:flags` passes on the all-on and all-off builds. Verified in `dist/` that the new
    answer lands on all three surfaces - visible HTML, the `FAQPage` JSON-LD, and
    `llms-full.txt` (three occurrences), which both voice agents read. Headless Chromium
    against a local `astro preview` of this exact build, all three pages at **375px and
    1280px**: one `h1` each and correct, the new accordion found by its summary text, clicked
    open and its answer confirmed visible and correct at both widths, `scrollWidth` equal to
    `clientWidth`, no page errors, no failed local requests; six screenshots. **No event fact
    moved**: Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 on 19
    November and Coding Cohort 1 on 26 November at Worcester College.
  - **Two known candidates checked and found already done**, recorded so the next cycle does
    not re-check them: `scripts/indexnow-ping.mjs` already maps `src/lib/home.ts` to `/` alone
    via `SINGLE_PAGE_SOURCES`, and every sentence naming Cohort 2 as upcoming is already in
    the past tense, on its own event page, Cohort 1's FAQ and
    `when-ai-executive-cohorts-run`. Past event pages were re-read end to end: the template
    withholds `assurances` and the booking form from them, the hero says "This event has run"
    and points at Cohort 3, so there is nothing stale there either.
  - **No guide.** The one tempting probe - what you get for the money at a one-day bootcamp -
    returned a field of vendor sales pages that the engine itself flagged as unverified, and a
    guide from us would be one more of them. **Guides this week: 2 of 3** (12 and 13 Oct);
    today's allowance unused by choice for the tenth day running.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export at all. Nothing estimated.
  - **Production could not be read, for the ninth day.** The sandbox egress policy answers 403
    to `oxfordagentic.com` (`connect_rejected` in the proxy's own failure log) and the host
    does not resolve for `WebFetch` either, so `build.txt` could not be polled and **no event
    fact could be re-verified against Luma**. Deployment state comes from the Actions API:
    Deploy to GitHub Pages run 39017867979 on `60d9019`, the `origin/main` HEAD, **success**
    at 08:35Z, with nothing queued or in progress when this cycle started.
  - **Off-page.** One unverified lead added to the review list, `aiwhatson.com`, placed at the
    bottom on purpose so it does not push down the Luma item. Nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma listings (2b and the
    review list), PR #1 (20), the bronze contrast token (21), Cohort 2's outcomes (22), the
    past-cohort testimonial heading (23), the guide-byline call (24), the Coding Bootcamp's
    paid-plan requirement (25) and the duplicated event hero eyebrow (26).

- **2026-10-17 (09:12 local cycle) - The newest bootcamp called itself two different
  things one line apart, on the page that takes its booking.**
  - **Evidence.** Four of the five event entries are titled "The Oxford ... Bootcamp -
    Cohort N". The Agentic Coding one was titled "Oxford Agentic Coding Bootcamp -
    Cohort 1", with no article, while its own programme is named **The** Oxford Agentic
    Coding Bootcamp in the nav dropdown, on `/bootcamps/`, on the events index card and
    in the eyebrow printed directly above its own `h1`. The bare form rendered in the
    `h1`, the breadcrumb, both schema `name` fields, the Luma iframe title, the two
    `llms.txt` files the voice agents read, and the footer "Upcoming" list on **59
    pages** - so on most of the site the footer and the nav named the same day
    differently.
  - **Why it had not been fixed.** Adding the article takes the search-result title to
    **61 characters**, one over the 60 `check-schema.mjs` enforces, so the obvious edit
    fails the build. The title rule in `src/pages/events/[slug].astro` already had one
    fallback (drop the brand suffix); it now has a second that drops a leading "The"
    from the **search-result title only**. That is a general rule keyed on length, not a
    per-page exception, and it is the right place to lose the article: the heading, the
    breadcrumb, the footer, the `Event` node and `llms.txt` keep the real name.
  - **Change.** Two files. `title` in
    `src/content/events/oxford-agentic-coding-bootcamp-cohort-1.md` gains "The"; the
    title builder gains the third fallback and the comment explaining it. No new fact, no
    copy, no token, no layout rule. The rendered `<title>`, `og:title` and `twitter:title`
    are byte-identical to before (57 characters), so nothing in search or on a shared card
    moves. The other four event pages are unchanged - their titles already fit with the
    brand dropped.
  - **Checks.** `npm run build` passes: 3,026 internal links across 61 pages, schema valid,
    5 `Event` nodes, 9 `FAQPage` nodes, all titles and descriptions unique, no SEO warnings.
    `check:flags` passes on the all-on and all-off builds. `astro check` (installed
    `--no-save`, diff stays clean) reports 79 errors and 4 hints both with and without the
    change, so none is this. Whole-site sweep in headless Chromium at 375, 768 and 1280px,
    plus the four unlisted pages: no horizontal overflow, no missing alt text, no
    unlabelled controls, one `h1` per page, no heading-level skips. Before and after
    screenshots of the event page and `/events/` at all three widths; the OG card renders
    the longer title on two lines with room to spare. Keyboard tab over the hero: every
    stop keeps its gold ring.
  - **Two sweeps run and clean, recorded so they are not repeated soon.** Contrast across
    all 53 sitemap pages: **328 failing text instances and every one of them is the same
    pair**, bronze `#9A7B23` on cream `#FFF9EC` at 3.83:1 - backlog 21, Drummond's colour
    call, nothing new beside it. Rendering with JavaScript disabled and under
    `prefers-reduced-motion`: no reveal band stays hidden on any page, so the scroll
    animations degrade correctly.
  - **One finding raised for Drummond rather than shipped**, as backlog 26: on all five
    event pages the hero eyebrow now prints the `h1` verbatim.
  - **Production could not be read again this cycle.** The sandbox egress policy answers
    403 to `oxfordagentic.com` and to the `github.io` origin, so before and after are both
    local previews of builds from the exact `main` HEAD that Actions reports deployed
    (`74ed21f`, run 39014796398, success). The 12 outbound links report unreachable for the
    same reason; that is the proxy, not the links.
  - **PR #1 is still open and still superseded** (backlog 20), and
    `feat/ceo-roundtable-demand-page` is still the merged leftover of PR #2. Read as
    known-stale, as the last several cycles did.
  - **No guide written.** This cycle's remit is the existing site.

- **2026-10-17 (08:05 local cycle) - The booking page for the newest bootcamp did not answer
  the two questions a buyer asks after deciding and before paying. Both were already published
  on its own programme page.**
  - **Evidence: the prerequisite axis, which the GEO log had never tested.** Four probes, two
    of them on what a buyer must have, install or pay for before they arrive. Both came back
    answered **entirely out of event listings** - Luma (x5 across the two probes), Eventbrite,
    Humanitix, SCORE, Tulane, Wichita State, CPA Ontario - with no editorial page in either
    result set. What those listings publish is concrete and uniform: a laptop you can install
    on, a charger, a paid plan sorted the night before, a warning about locked-down work
    laptops, sometimes a hardware spec. The conclusion is not that this needs a guide; it is
    that **the event page is the surface a buyer checks before paying**, and ours for the
    newest bookable day was the thinnest of the three.
  - **The gap, measured.** `FAQPage` questions per event page, counted in the built JSON-LD:
    Second Brain Cohort 1 **12**, Agentic Cohort 3 **7**, **Agentic Coding Cohort 1 five**.
    The two it was missing - "Can I bring my team?" and "What if I cannot make the date?" - are
    answered on **both** sibling event pages and on its own programme page. The 16 Oct 14:05
    cycle closed exactly these two gaps on the three *programme* pages and did not carry them
    to the event pages, which is the half this closes. The transfer answer matters most: that
    cycle established that our terms (a free transfer to a future cohort) are better than every
    one its probe returned - a 25% fee inside 30 days at COPC, the full fee inside 10 working
    days at ECC, 100% inside 14 days at BSA - and the page selling a day 40 days out did not
    state them.
  - **Change: two FAQ entries on one file, no new fact in either.**
    `src/content/events/oxford-agentic-coding-bootcamp-cohort-1.md` gains "Can I bring my
    team?" and "What if I cannot make the date?", worded to the event-page pattern its Second
    Brain sibling already uses (the short question form, the tightened answer) and carrying the
    coding-specific substance from its own programme page verbatim - "two of you go back able
    to build rather than one", "it helps if you arrive with the same idea in mind", and the
    no-refund-but-free-transfer terms that are a published standing decision. Every word was
    already live on two other pages. A comment in the file says why they are duplicated onto
    the booking page. Its `FAQPage` node goes **5 questions to 7**; site total is unchanged at
    9 `FAQPage` nodes and 5 `Event` nodes.
  - **No guide, and the one that was tempting was declined on a stated rule.** "Can a
    non-technical founder build a working website with Claude Code in one day" is the best
    guide candidate the log has turned up for the coding line: the field is personal blogs,
    substacks and low-code vendor marketing with no institutional publisher in it, so it is
    **winnable**, and the searcher is the Coding Bootcamp's exact buyer, so it **converts**.
    It fails a different test. The engine itself said no source tests the one-day question and
    that the success claims it found are "not independently verified" - and **the Coding
    Bootcamp has not run yet** (Cohort 1 is 26 November), so we have no room to write from and
    a guide answering "yes, in a day" would be one more unverified vendor claim of exactly the
    kind the engine flagged. Logged to re-probe after 26 November. **Guides this week: 2 of 3**
    (12 and 13 Oct); today's allowance unused by choice for the ninth day running.
  - **Checks.** `npm ci` then `npm run build` clean before and after: 61 pages, 3,026 internal
    links all resolve, schema valid, all titles and descriptions unique, no SEO warnings.
    Headless Chromium against a local `astro preview` of this exact build, at **375px and
    1280px**: `h1` correct, 7 FAQ accordions present, each new one clicked open and its answer
    confirmed visible and correct at both widths, `scrollWidth` equal to `clientWidth` at both,
    no page errors and no failed local requests; screenshots at both widths. Note for future
    cycles: these accordions share `name="faq"`, so setting every `<details open>` at once
    leaves only the last one open - click each summary instead, or the check silently reports
    the answer as absent. The 12 outbound third-party links report unreachable, which is this
    sandbox's egress policy and not a site fault. **No event fact moved**: Second Brain 21
    October at the Pitt Rivers Museum, Agentic Cohort 3 on 19 November and Coding Cohort 1 on
    26 November at Worcester College, as every file says.
  - **Production could not be read, for the eighth day.** The sandbox egress policy refuses
    `oxfordagentic.com` (`connect_rejected`, confirmed in the proxy's own failure log) and
    `luma.com`, so `build.txt` could not be polled and **no event fact could be re-verified
    against its Luma page**. Deployment state comes from the Actions API instead: CI and Deploy
    to GitHub Pages both `success` on `d36ccfd`, the `origin/main` HEAD, at 01:13Z and 01:15Z
    on 17 Oct, with nothing queued or in progress when this cycle started.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, no Google credential exists in the environment,
    and `seo-data/` holds no CSV or TSV export at all. Nothing estimated.
  - **Off-page.** No new item. Every listing surface the probes returned is US, Canadian or
    Australian, or already open on the review list (`allai.events`). Nothing contacted.
  - **New for Drummond: backlog 25** - whether the Coding Bootcamp requires a paid Claude or
    ChatGPT plan. It is the one prerequisite the field always publishes and we answer nowhere,
    and it is an event fact the loop cannot supply. **Still waiting**, unchanged and not
    re-pitched: the Luma item (backlog 2b and the review list), PR #1 (20), the bronze contrast
    token (21), Cohort 2's outcomes (22), the past-cohort testimonial heading (23), and the
    guide-byline call (24).


- **2026-10-17 (01:00 local cycle) - An engine asked what this organisation is answered off
  our dead Luma listings, and named a former team member as a host. The first line we give
  an engine described one bootcamp of three; it now describes all three.**
  - **Evidence: a query axis the GEO log had never tested.** "what is Oxford Agentic who runs
    the Oxford Agentic Bootcamp" - the entity question, the one an answer engine asks itself
    before it recommends anything. **No page of ours was returned.** The answer was built from
    `luma.com/oxfordagentic2`, `luma.com/k7c2rm5s` and allai.events, and it was wrong three
    ways: it named **Josh Lawman** as a host (removed from the team on 4 August), gave the
    date as **21 July 2026** (Cohort 1, three months past), and reported the venue as
    "Worcester College in one version and St Anne's College in another, so check the event
    page before booking". On the fourth host it gave up: "Listings differ on the fourth host:
    one names Nicolai Thomson, another names Josh Lawman." The buyer-worded probe in the same
    set repeated all of it.
  - **The off-page half is Drummond's and was already on the list; this adds the sharpest
    evidence yet.** Fourth axis in three days (brand, proposition, venue, entity) landing on
    the same cause. Verified in `dist/` that none of it is ours: "Josh Lawman" appears in no
    built page, `/team/` does not list him, `/team/josh-lawman/` is a noindex redirect, and
    the name is absent from `llms-full.txt` - so **backlog 16 is closed on the site's side**,
    and the only surviving source of that claim is on Luma. Added to the existing review-list
    item rather than opened as a new one. Nothing contacted.
  - **The on-page half was real and is what shipped.** When an engine *does* read this site,
    the first thing it reads is `brand.longDescription` - the blockquote at the top of both
    `llms.txt` and `llms-full.txt`, the About hero subline, and the footer paragraph on every
    page. It read: *"Oxford Agentic runs in-person, hands-on agentic AI training in Oxford for
    business leaders. Over a single day... builds and runs a working agentic AI workflow..."*
    One product, out of three. It had not moved since cycle 66 (16 Aug), and the Second Brain
    and Agentic Coding lines launched behind it. **This string is site-only** - it is not the
    one PRD §13 requires reused verbatim off-site, which is `brand.description`, still
    waiting for Drummond - so the loop could move it, and the precedent for moving it alone
    is cycle 66's own.
  - **Change: one string, one paragraph, one derived line. No new fact in any of them.**
    - `brand.longDescription` now names all three bootcamps in one sentence each, drawn
      verbatim in substance from the three programme files' own capsules: the agentic
      workflow on a real task (with the hours clause cycle 66 deliberately added, kept), the
      second brain as the structured store of your own context, and the live website and
      working prototype with **Claude Code and Codex doing the typing**. It closes on the
      message house's paired framing, reconciled for three lines the way yesterday's glossary
      entry reconciled it: *"No day assumes you arrive able to code, and nothing is
      hand-waved."* Naming the two coding tools in the entity line is deliberate - that is the
      exact query on which an engine twice this week reported the coding line as not existing.
    - **The About page origin story** described a first gap and "a second gap sitting behind
      the first", and ended "The two compound, and neither assumes the other". It now has the
      third: people who understand the concepts and have never built and shipped something of
      their own, with the brief, the repository, the deploy and the check on what the agent
      wrote. "The three compound, and none of them assumes another - and none expects you to
      arrive able to code. The coding day is the exception in subject rather than in
      prerequisite." Every clause from the coding programme file's capsule, description and
      FAQs. This was the last unswept surface on backlog 14's list for this line.
    - **The footer takes the entity line's opening sentence, not the paragraph.** Widening the
      string took the footer block from ten rendered lines to fifteen on all 59 pages, which
      measured 302px tall at 375px wide and 372px at 1280px - a wall of boilerplate where the
      footer's job is orientation. `Footer.astro` now derives its line from the same string
      (`longDescription.split('. ')[0]`), so the two cannot drift, and the block is **93px at
      both widths** - shorter than before the change and more accurate than before it, while
      the full paragraph still runs where it earns its length. A comment says to keep the
      first sentence self-contained.
  - **It lands on four surfaces**, verified in `dist/`: the `llms.txt` and `llms-full.txt`
    entity blockquotes (full paragraph), the About hero subline (full paragraph), the About
    story (the new third-gap paragraph, 6 paragraphs to 7), and the footer on 59 of 61 built
    HTML files (opening sentence; the two without are `/home-original/` and
    `/team/josh-lawman/`, both redirect stubs with no footer). `longDescription` is not used
    in schema and is not a meta description, so no length check applies and none was tripped.
  - **No guide.** Two of the four probes were real candidates and both fail the second test.
    "What is an agentic workflow for business" is winnable only as a definition page - which
    the glossary already is - and the searcher is reading rather than booking. The
    second-brain course probe is the interesting one: the engine answered that it "didn't
    find a course that runs a full single day", returning a Canadian half day, an Australian
    two-hour webinar and Forte Labs' multi-week programme - a clean description of the gap we
    fill, **four days before we run it**, and still declined, because Second Brain's
    constraint is demand and not ranking (standing decision) and no new page changes
    retrieval. **Guides this week: 2 of 3** (12 and 13 Oct); today's allowance unused by
    choice for the eighth day running.
  - **Checks.** `npm ci` then `npm run build` clean: 61 pages, 3,026 internal links all
    resolve, schema valid with 5 Event and 9 FAQPage nodes, all titles and descriptions
    unique, no SEO warnings. `check:flags` passes on both the all-on and all-off builds.
    Headless Chromium against a local `astro preview` of this exact build, at **375px and
    1280px**, on the changed page and on a page that only sees the footer: `h1` correct, the
    third-gap paragraph present, the story at 7 paragraphs, the About hero carrying the full
    entity line, the footer block 93px at both widths, `scrollWidth` equal to `clientWidth`
    at both, no page errors and no failed local requests; screenshots of hero, story and
    footer at both widths. The 12 outbound third-party links report unreachable, which is this
    sandbox's egress policy and not a site fault. **No event fact moved**: Second Brain 21
    October at the Pitt Rivers Museum, Agentic Cohort 3 on 19 November and Coding Cohort 1 on
    26 November at Worcester College, as every file says.
  - **Production could not be read, for the seventh day.** The sandbox egress policy refuses
    `oxfordagentic.com` (`connect_rejected`) and `luma.com`, so `build.txt` could not be
    polled and **no event fact could be re-verified against its Luma page**. Deployment state
    comes from the Actions API instead: CI and Deploy to GitHub Pages both `success` on
    `3e2da55`, the `origin/main` HEAD, at 19:11Z on 16 Oct, with nothing queued or in progress
    when this cycle started.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, there is no Google credential in the
    environment, and `seo-data/` holds no export newer than the 13 October reading. Nothing
    estimated.
  - **Off-page.** No new item. Both routes the probes returned were already open on the review
    list; the Luma item gained the entity-axis evidence and the Josh Lawman finding. Nothing
    contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma item (backlog 2b and
    the review list, now the highest-value item on it twice over), PR #1 (backlog 20), the
    bronze contrast token (21), Cohort 2's outcomes (22), the past-cohort testimonial heading
    (23), and the one-line call on whether guide bylines should link the team profile (24).
    **Newly closed without him: backlog 16** (Josh Lawman) is done on the site's side.

- **2026-10-16 (19:00 local cycle) - The glossary was swept for the second product line and
  never for the third. It now defines the coding line's vocabulary and links it.**
  - **Evidence, measured rather than reasoned about.** Inbound internal links to each
    programme page, counted inside `<main>` only (so navigation and footer do not flatter the
    total), across the built site: Agentic **50** from 23 guides, Second Brain **25** from 10
    guides, **Agentic Coding 10 from 3 guides**. The coding line is the newest bookable
    product (launched 25 Sept, Cohort 1 on 26 November) and the most weakly connected
    commercial page on the site. Two cycles this week also had an engine report that line as
    not existing at all.
  - **The named surface, from our own checklist.** Backlog 14 lists the four shared surfaces
    that silently keep describing the old product when a line launches: the homepage FAQ, the
    **glossary's `about` edge**, the About page origin story, and FAQ depth parity. Parity was
    closed for this line at 14:05 today. `src/lib/home.ts` already names all three bootcamps in
    four separate answers. The glossary had not been swept since the Second Brain launch: 13
    terms, a "Second brain" entry linking that bootcamp, `relatedProgrammes` listing two lines
    of three, and **no coding vocabulary at all** - no "coding agent", no Claude Code, no
    repository - on the page a reader who does not yet know the words lands on, and the kind of
    definitional page an answer engine quotes.
  - **Change: one content file, two new terms, one clause, no new fact.**
    - *Coding agent* - an AI that writes and changes code in your files and terminal rather
      than in a chat window; Claude Code and Codex; the brief it reads first, asking for a plan
      before it builds, checking what it wrote. Every element is already published in the
      programme file's capsule, description and FAQs. Links the Coding Bootcamp once.
    - *Repository* - the folder a project lives in with the history of every change, and the
      undo button for work an agent did. The programme page already teaches "version control as
      an undo button" and sends people home with a GitHub repository.
    - *No-code* gains one clause so the two lines stop contradicting each other on the same
      page: the Coding Bootcamp is the exception in subject rather than in prerequisite, the
      agents still do the typing, and none of our days expects you to arrive able to code -
      which is exactly what the homepage FAQ has said since the launch.
    - `relatedProgrammes` now lists all three lines.
  - **It lands on three surfaces**, verified in `dist/`: the visible page (13 terms to 15), the
    `Article` node's `about` array, which now carries all three programme entities rather than
    two, and `llms-full.txt`, which both voice agents read daily - so "what is a coding agent"
    is answerable from published copy. Internal links rose 3,024 to 3,026.
  - **No guide.** Four method-shaped probes, all absent, all correctly declined: two fields are
    owned by platform vendors documenting their own products (n8n, UiPath, Pipefy, gotohuman)
    and we already publish against both, so that is selection rather than a gap; one is vendor
    marketing that the engine itself flagged as having no independent evidence behind it. The
    fourth found a real hole - no UK one-day hands-on **agent** course for law firm partners or
    accountants, only GBP 995-1,995 ChatGPT awareness days - and was still declined, because a
    legal segment page is the near-duplicate of the consultants and finance guides and the
    field is held by priced providers. **Guides this week: 2 of 3** (12 and 13 Oct); today's
    allowance unused by choice for the seventh day running.
  - **Checks.** `npm ci` then `npm run build` clean: 61 pages, 3,026 internal links all resolve,
    schema valid with 5 Event and 9 FAQPage nodes, all titles and descriptions unique, no SEO
    warnings. `check:flags` passes on both the all-on and all-off builds. Headless Chromium
    against a local `astro preview` of this exact build, at **375px and 1280px**: `h1` correct,
    both new terms present as headings, the related block renders three items with the coding
    one visible, two links to the coding programme page in `<main>`, `scrollWidth` equals
    `clientWidth` at both widths, no page errors and no failed local requests; screenshots taken
    at both. The 12 outbound third-party links report unreachable, which is this sandbox's
    egress policy and not a site fault. `updatedDate` moved on the one file changed. **No event
    fact moved**: Second Brain 21 October at the Pitt Rivers Museum, Agentic Cohort 3 Thursday
    19 November and Coding Cohort 1 Thursday 26 November at Worcester College, as every file says.
  - **Production could not be read, for the sixth day.** The sandbox egress policy refuses
    `oxfordagentic.com` (`connect_rejected`) and `luma.com`, so `build.txt` could not be polled
    and **no event fact could be re-verified against its Luma page**. Deployment state comes
    from the Actions API instead: CI and Deploy to GitHub Pages both `success` on `7c4e4ea`, the
    `origin/main` HEAD, at 13:08Z, with nothing queued or in progress when this cycle started.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, the Search Analytics API answers HTTP 401, there
    is no credential in the environment, and `seo-data/` holds no export newer than the 13
    October reading. Nothing estimated.
  - **Off-page.** No new item. Every name the four probes returned is a competitor rather than a
    listing route. Nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma item (backlog 2b and
    the review list), PR #1 (backlog 20), the bronze contrast token (21), Cohort 2's outcomes
    (22), the past-cohort testimonial heading (23), and the one-line call on whether guide
    bylines should link the team profile (24).

- **2026-10-16 (14:05 local cycle) - The newest bookable page named no venue anywhere, on
  the one line a search engine says does not exist. It now answers the three questions both
  sibling programme pages already answer.**
  - **Evidence.** A venue-anchored probe for the Coding line - `one day Claude Code bootcamp
    Oxford where is it held venue` - came back: *"I couldn't find any one-day Claude Code
    bootcamp held in Oxford, so I can't give you a venue. None of the results mention
    Oxford."* It offered an online Eventbrite course and a workshop in Nairobi instead. That
    is the **second cycle running** in which this line is reported as not existing (15 Oct,
    `agentic coding bootcamp Oxford UK in person Claude Code one day`, same answer), and the
    first on a venue phrasing - the same axis that produced the confirm-before-you-book
    warning on the flagship eight hours ago.
  - **The checkable half of that was ours.** `/bootcamps/agentic-coding-bootcamp/` carried
    **five** FAQs against the Agentic page's fifteen and the Second Brain page's twelve, and
    **named no venue in any prose or FAQ**: "Worcester College" appeared exactly once on the
    whole built page, in the upcoming-event card, with no street, and the page's `FAQPage`
    node had no venue answer at all. This is the FAQ-depth-parity item in backlog 14, with
    the named instance the 08:06 cycle recorded and deliberately left for a cycle that could
    bring its own evidence. This is that cycle.
  - **Change: three FAQ entries on one content file, and no new fact in any of them.** The
    three are exactly the ones **both** sibling pages answer and this one did not:
    - *Where in Oxford is it held?* - Worcester College on Walton Street, central Oxford, the
      same venue as the Agentic Bootcamp, Cohort 1 there on Thursday 26 November 2026, and
      each event page is the one to go by. Every fact from the event file's own venue block
      (`confirmed: true`) and its capsule; the weekday was re-checked rather than copied.
    - *Can I bring my team, or book for several people?* - same substance as the siblings,
      worded for this line, pointing at hello@oxfordagentic.com.
    - *What if I book but cannot make the date?* - the site-wide policy, in the wording both
      sibling pages already carry: not refundable, place transfers to a future cohort at no
      charge. Second Brain is also a first cohort with no successor scheduled and carries the
      same answer, so this asserts nothing new about this line.
    No price, no group size (no capacity fact is published for this line, and inventing
    "capped" from the Second Brain wording would have been a new claim), no certificate, no
    access claim.
  - **It lands on three surfaces**, verified in `dist/`: the visible FAQ (5 items to 8), the
    page's `FAQPage` JSON-LD (same 8, the venue answer parsed back and read), and
    `llms-full.txt`, which both voice agents read daily - so "where is the Coding Bootcamp"
    is now answerable by the office-hours agent from published copy rather than not at all.
  - **A second finding from the same probe set, recorded not shipped.** Our cancellation
    terms are better than every provider the engine returned on the transfer question - 25%
    to move inside 30 days (COPC), full fee inside 10 working days (ECC), 20% late-transfer
    fee (Mind BLMK), 100% inside 14 days (BSA) - against our free transfer to a future
    cohort. The query itself is not winnable (it is owned by providers' own terms pages) and
    the searcher is someone else's booker, so nothing was written for it. It is a buyer-facing
    contrast worth knowing when the page copy next gets a pass.
  - **The Second Brain Bootcamp runs in five days and a date-anchored probe says it does not
    exist.** `second brain bootcamp Oxford 21 October 2026 one day in person` returned an
    online two-day course on 21-22 November and Forte Labs' multi-week cohort, and answered
    that it found no Oxford, in-person listing for that date. On Perplexity on 13 Sept the
    same product held **#1, #2, #3 and #4** for its category query. Nothing on-page explains
    it - the event page carries the date in its title, h1, capsule, card and `EducationEvent`
    node. Fourth instance this week of retrieval rather than coverage, now on the most
    imminent event. No content was written for it, per the standing decision that Second
    Brain's constraint is demand and not ranking.
  - **No guide.** Nothing probed this cycle was both winnable and converting: the transfer
    question is owned by providers' terms pages, the team-booking question by the Oxfordshire
    provider field (tutorials.co.uk, The Oxford AI School, oxfordaitraining.com, NobleProg),
    and the other two were retrieval checks on pages we already publish. **Guides this week:
    2 of 3** (12 and 13 Oct); today's allowance unused by choice for the sixth day running.
  - **Checks.** `npm ci` then `npm run build` clean: 61 pages, 3,024 internal links all
    resolve, schema valid with 5 Event and 9 FAQPage nodes, all titles and descriptions
    unique, no SEO warnings. `check:flags` passes on both the all-on and all-off builds. The
    12 outbound third-party links report unreachable, which is this sandbox's egress policy
    and not a site fault. Headless Chromium against a local `astro preview` of this exact
    build, at **375px and 1280px**: `h1` correct, 8 FAQ items at both widths, the venue
    answer opened and screenshotted at both and reading correctly, `scrollWidth` equals
    `clientWidth` before and after opening it, no page errors and no failed local requests.
    `updatedDate` moved on the one file changed. **No event fact moved**: Second Brain 21
    October at the Pitt Rivers Museum, Agentic Cohort 3 Thursday 19 November and Coding
    Cohort 1 Thursday 26 November, both at Worcester College, exactly as every file says.
  - **Production could not be read, for the fifth day.** The sandbox egress policy refuses
    `oxfordagentic.com` (`connect_rejected`) and `luma.com`, so `build.txt` could not be
    polled and **no event fact could be re-verified against its Luma page**. Deployment state
    comes from the Actions API instead: CI and Deploy to GitHub Pages both `success` on
    `1c36180`, the `origin/main` HEAD, at 08:29Z, with nothing queued or in progress when
    this cycle started.
  - **Search Console: unavailable from the cloud checkout.** One attempt, as the rules ask:
    `gcloud` reports no credentialed accounts, the Search Analytics API answers HTTP 401,
    there is no credential in the environment, and `seo-data/` holds no export newer than
    the 13 October reading. Nothing estimated.
  - **Off-page.** No new item. The three Oxfordshire names the team probe surfaced are
    competitors rather than listing routes, so none was added. Nothing contacted.
  - **Still waiting on Drummond**, unchanged and not re-pitched: the Luma item (backlog 2b
    and the review list), PR #1 (backlog 20), the bronze contrast token (21), Cohort 2's
    outcomes (22), the past-cohort testimonial heading (23), and the one-line call on whether
    guide bylines should link the team profile (24).

- **2026-10-16 (09:30 local cycle) - The one link every page opens with told a screen
  reader "Home" while the page showed "Oxford Agentic". It now says both, and a voice
  user can reach it.**
  - **Evidence, from a full axe-core sweep of all 53 sitemap URLs at 375px and 1280px**
    (106 page-loads, the first time this loop has run axe across the whole site). It
    returned exactly three findings. One is `label-content-name-mismatch`, impact
    *serious*, **106 nodes - one on every page at both widths**: the header brand link
    carried `aria-label="Home"` while its visible text, the wordmark, reads "Oxford
    Agentic". That is a WCAG 2.5.3 *Label in Name* failure at **Level A**, and the
    practical cost is specific rather than theoretical - someone driving the browser by
    voice who says "click Oxford Agentic", which is the only name the page gives them,
    does not reach the link that every page starts with, and a screen-reader user tabbing
    off the skip link hears a name that is not the one on screen.
  - **Change: one attribute, in one component.** `src/components/Header.astro` now builds
    the brand link's `aria-label` from `config.brand.name` followed by ", home", so the
    accessible name reads "Oxford Agentic, home" - it contains the visible text, which is
    what 2.5.3 asks for, and it still says where the link goes. The name is drawn from
    config rather than typed in, so a brand rename carries into it exactly as it does
    into the wordmark (PRD section 4, section 10). Nothing else moved: the built HTML
    for the homepage and for a programme page is **byte-identical to the previous build apart from that one
    attribute**, checked by normalising it back and diffing. No CSS, no analytics
    attribute, no schema, no link.
  - **The other two axe findings were left alone, deliberately.** `color-contrast`
    (serious, 686 nodes) is the bronze `#9A7B23` on cream at 3.82:1 - that is backlog 21,
    a brand-token decision that is Drummond's and not the loop's, and this sweep is
    simply a second, independent measurement of it. `region` (moderate, 106 nodes) is the
    consent banner's copy sitting outside any landmark; it is a best-practice rule rather
    than a WCAG failure, and it touches the consent component, so it is left for a cycle
    that can give it its own checks. **Nothing else failed**: no missing alt text, no
    unlabelled form control, no nameless button, no horizontal overflow on any page at
    375, 768 or 1280, and a visible 2px gold focus ring on every element in the header
    tab order.
  - **Checks.** `npm run build` clean (3,024 internal links across 61 pages, schema valid
    on all 61, no SEO warnings); `npm run check:flags` passes on both the all-on and
    all-off builds; `astro check` reports 79 errors **before and after the change
    alike** - they are pre-existing and come from `@astrojs/check`, which is not a
    dependency of this repo and so is not run by CI. Header screenshotted at 375, 768 and
    1280 with the brand link focused and it is unchanged; the Playwright aria snapshot
    reads `link "Oxford Agentic, home"`; axe re-run across all 53 URLs at both widths and
    the finding is gone, with the other two unchanged.
  - **The live site was unreachable from this cycle's sandbox, and that is worth
    recording.** `oxfordagentic.com`, `www.oxfordagentic.com` and `drummond1.github.io`
    all return `connect_rejected` from this session's egress proxy - the host is not on
    the allow list - as do all twelve third-party links the build checks
    (`0/12 third-party link(s) reachable`, which is the sandbox and not a site fault).
    So this cycle could **not** fetch production, screenshot it, or run a GEO probe. What
    it could do instead: the Actions API is reachable, and it shows CI and Deploy to
    GitHub Pages both `success` on `ad56471`, the current `main` HEAD, twice today
    (07:10Z push and the 08:08Z scheduled rebuild), with nothing queued or in progress.
    The change was therefore inspected against a local `astro preview` of a build from
    that same commit. **Production verification after this push is limited to the
    workflow run; if the loop is to keep its "re-fetch production and confirm" step, the
    environment's network policy needs `oxfordagentic.com` added.**
  - **PR #1 is still open and still superseded** (backlog 20) - its `min-width: 0`
    breadcrumb fix shipped independently in `384564e`. Read as known-stale rather than as
    unfinished work, which is the same reading the last several cycles took. The
    `feat/ceo-roundtable-demand-page` branch is leftover from PR #2, which was
    squash-merged as `1805456`; it is merged work, not work in flight.
  - **Guides this week.** 2 of 3, and today's allowance is unused by choice.

- **2026-10-16 (08:06 local cycle) - The flagship programme page answered "Where in Oxford is
  it held?" with a venue we last used in July, which is the exact address an answer engine is
  telling buyers to query. It now leads with Worcester College.**
  - **Evidence, and it is the first measured buyer-side cost of the 15 Oct finding.** A
    venue-anchored probe - `AI bootcamp Worcester College Oxford one day workshop`, about as
    close to a brand query as a buyer gets without naming us - returned, in order,
    `luma.com/oxfordagentic2` (our Cohort 2, ran 16 Sept), `onlinecourses.worc.ox.ac.uk`,
    `luma.com/k7c2rm5s` (our Cohort 1, ran 21 July, at St Anne's) and the stale `allai.events`
    page. **oxfordagentic.com was not returned, and nor was `luma.com/oxfordagentic3`.** The
    engine found the bootcamp, described the hosts and the format accurately, then said the
    listings disagree on the venue - quoting "St Anne's College, 56 Woodstock Rd" and "5 spots
    remaining" off the July page - and told the reader: **"Confirm the venue with the
    organisers before booking."** Three cycles this week have shown our past Luma listings
    absorbing brand traffic. This one shows them manufacturing a reason to hesitate.
  - **The on-page half of that is ours, and it was real.** `/bootcamps/oxford-agentic-bootcamp/`
    is the page that sells the flagship day and the page that ranks on Oxford-anchored
    queries. Its FAQ answered "Where in Oxford is it held?" with **"At an Oxford college -
    Cohort 1 ran at St Anne's College in Seminar Room 10..."** - three cohorts out of date,
    naming only the address the engine was calling a contradiction, and never naming Worcester
    College at all, where Cohort 2 ran, where Cohort 3 is on 19 November and where the Coding
    Bootcamp's first cohort is on 26 November.
  - **Change: one FAQ answer on one file, and no new fact in it.** It now opens "At Worcester
    College on Walton Street, in central Oxford", names Cohort 2 and Cohort 3 there, keeps
    Cohort 1's St Anne's as history with the cabaret-style seminar room (which is true of that
    room and is corroborated by the photo captions), notes plainly that an older listing may
    still show that address, and ends on each event page being the one to go by. Every fact is
    already published in this repo: the venue blocks of the event files and the photo alt text.
  - **This was drift, not an oversight.** `src/lib/home.ts` - the homepage FAQ - has carried
    the complete, correct four-venue answer for some time. The programme page simply did not
    get the same sweep, which is the failure mode backlog 14 describes in the other direction.
    The two surfaces now agree.
  - **It lands on three surfaces, not one.** Verified in the built output: the visible FAQ, the
    page's `FAQPage` JSON-LD (so an engine that retrieves the programme page gets the
    resolution), and `llms-full.txt`, which both voice agents read daily. `Seminar Room 10` no
    longer appears anywhere in `dist/`.
  - **No guide, and the probes earned that.** Four probes, all absent, all killed. The charity
    and non-profit candidate - open on backlog 9 as persona-established since early September -
    is **killed with evidence**: DSC owns nine of ten results on its own subject, and the live
    alternatives are a £200-£289 online day and a free funded TechSoup/Google.org course, so a
    reader choosing between free options is not booking a paid day in Oxford. The two objection
    probes (shelf life of what you learn; in-house versus external trainer) are held by L&D
    trade publishers, certification vendors and training providers answering in their own
    commercial interest. Note on the second: **we already publish a guide on exactly that
    question** (`in-house-ai-day-or-send-people-to-a-cohort`) and it was not returned, so that
    row is evidence about retrieval, not a content gap. **Guides this week: 2 of 3**, today's
    allowance unused by choice for the fifth day running.
  - **Checks.** `npm ci` then `npm run build` clean: 61 pages, 3,024 internal links, schema
    valid with 5 Event and 9 FAQPage nodes and no SEO warnings. `check:flags` passes on the
    all-on and all-off builds. The 12 outbound third-party links report unreachable, which is
    the sandbox egress policy and not a site fault. Headless Chromium over the changed page at
    **375px and 1280px**: `h1` correct, 15 FAQ items, no horizontal overflow at either width
    (`scrollWidth` equals `clientWidth`), the answer opened and screenshotted at both sizes and
    reading correctly, no page errors beyond the sandbox proxy's failures on third-party
    resources. `updatedDate` moved on the one file changed. **No event fact moved** - Cohort 3
    is still Thursday 19 November 2026 at Worcester College, the Second Brain Bootcamp 21
    October at the Pitt Rivers Museum and the Coding Bootcamp 26 November, as every file in the
    repo says.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403 to
    `oxfordagentic.com` and DNS does not resolve `luma.com`, so `build.txt` could not be polled
    and **no event fact could be re-verified against its Luma page**. Deployment state comes
    from the Actions API instead: run 38833860043 for `d5fb535` concluded `success` at 01:13 UTC
    on 16 Oct, nothing queued or running, and `origin/main` is `d5fb535`. Same substitution as
    12 to 16 Oct.
  - **Search Console: unavailable from the cloud checkout.** One attempt: no credentials,
    `gcloud` reports no credentialed accounts, the Search Analytics API answers HTTP 401, and no
    newer export exists in `seo-data/`. Nothing estimated; the 13 October data stands.
  - **Off-page.** No new item. The Luma item - already the largest open one - is strengthened
    with this cycle's third query axis and the confirm-before-you-book quote, because that is a
    harm rather than a ranking observation. Nothing contacted.
  - **Worth Drummond knowing.** The scheduled prompt that starts these cycles still names
    Cohort 3 as **15 October at Worcester College**. Every file in the repo says **Thursday 19
    November**. The repo is right and the prompt is stale; this is the second cycle to say so,
    and correcting the standing prompt is worth a minute so a future cycle does not trust it
    over the content collection.
  - **One small gap left on the record, not shipped.** The Coding Bootcamp programme page has
    five FAQs and **no venue question at all**, while the Agentic page has fifteen and the
    Second Brain page answers its own. That is the FAQ-depth-parity item in backlog 14, now
    with a named instance. Left for a cycle that can give it its own evidence rather than
    riding on this one.

- **2026-10-16 (01:59 local cycle) - No site change. A buyer asking for our exact day, by
  city and by month, was told it does not exist; four audits found nothing on-page left to
  fix, and the one real gap needs a decision from Drummond.**
  - **The probe that settles three cycles of inference.** Asked `one day AI bootcamp Oxford
    November 2026` - the city, the format, the month and the year, which is Cohort 3 exactly -
    a web engine answered **"I didn't find a one-day AI bootcamp in Oxford in November 2026"**
    and offered an Oxford workshop in August, a one-day bootcamp in Kentucky and a six-day
    online programme in May. The UK-wide version of the question failed the same way. Cohort
    3's page carries the date in its `<title>`, its `h1`, its capsule, its card, its agenda and
    its `EducationEvent` node, and it is still not retrieved. The 08:05 and 20:08 cycles on
    15 Oct inferred that this week's misses were retrieval rather than content; this measures
    it from the other side and confirms it. **Nothing on-page fixes retrieval, and this cycle
    refused to invent a change that pretends otherwise.**
  - **Four on-page audits, run rather than reasoned about, all clean.** (1) Every title on the
    built site is 61 characters or fewer and every meta description 157 or fewer, so nothing is
    being truncated in a result. (2) `robots.txt` admits all fifteen named AI crawlers plus
    `*`, and carries the sitemap and both llms files. (3) Each of the five event pages links
    the live Cohort 3 page, and Cohort 2's past page offers it as a button above the fold with
    "This event has run" beside it, so our own past pages hand off the way the Luma ones do
    not. (4) Inbound internal links per sitemap URL across all 61 pages: every nav and footer
    page scores 58 or 59 and no guide is now below 3, which holds the 14:15 cycle's result from
    yesterday.
  - **The one gap the audit did find is on the record as backlog 24, not shipped.** All seven
    `/team/<person>/` pages have exactly **one** inbound internal link, and the site's JSON-LD
    leans on them - 30 guides declare their author as `.../team/drummond-gilbert/#person` and
    the Organization node names the same `@id` as founder. The natural fix is to link the guide
    byline, which is plain text today. The loop declined it: all 30 guides are Drummond's, so
    it would add 30 links anchored on his name to his own profile, and the 15 Oct `/team/`
    diagnosis explicitly said not to chase that, because `drummond gilbert` resolving to
    `/team/` is the 9 Oct preference working as intended. The programme-page alternative argues
    with his own 4 Aug instruction that the programme page's one job is the booking path. **One
    line from him settles it**; the measurement and all three placements are written down so no
    future cycle re-derives them.
  - **No guide, and the allowance was free.** Two generic probes, both correctly killed.
    "What should a senior leader learn after prompt engineering" is held by opinion publishers
    on their own subject - Bernard Marr, SHRM, FDM Group with three URLs of one article - and
    the intent is reading. "How to get AI to do a recurring task without hiring a developer" is
    held by no-code vendors answering about their own products, which is the right answer to it,
    and the searcher is not booking a day in Oxford. **Guides this week: 2 of 3**, today's
    allowance unused by choice for the fourth day running.
  - **Checks.** `npm ci` then `npm run build` clean: 61 pages, 3,024 internal links, schema
    valid with 5 Event and 9 FAQPage nodes and no SEO warnings. The 12 outbound third-party
    links report unreachable, which is the sandbox egress policy and not a site fault. No site
    file was touched, so no page changed, no `updatedDate` moved and no event fact moved -
    Cohort 3 is still Thursday 19 November 2026 at Worcester College, the Second Brain Bootcamp
    21 October and the Coding Bootcamp 26 November, as every file in the repo says.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403 to
    `oxfordagentic.com` and DNS does not resolve `luma.com`, so `build.txt` could not be polled
    and **no event fact could be re-verified against its Luma page**. Deployment state comes
    from the Actions API instead: run 38791407289 for `224302f` concluded `success` at 19:09 UTC
    on 15 Oct, nothing is queued or running, and `origin/main` is `224302f`. Same substitution
    as 12 to 15 Oct.
  - **Search Console: unavailable from the cloud checkout.** One attempt: no credentials,
    `gcloud` reports no credentialed accounts, the Search Analytics API answers HTTP 401, and no
    newer export exists in `seo-data/`. Nothing estimated; the 13 October data stands.
  - **Off-page.** No new item. One existing item raised with measured evidence: **EnSpire
    Oxford**, added on 11 Oct as a plausible-but-unverified listing route, has an event page
    ranking in the top ten for the query above while we are absent from it, carrying somebody
    else's AI bootcamp. Nothing contacted.
  - **Worth Drummond knowing.** The scheduled prompt that starts these cycles still names
    Cohort 3 as 15 October at Worcester College. Every file in the repo, four live surfaces and
    the 7 Oct Search Console reading ("Cohort 3 moving to a date further out") say **19
    November**. The repo is right and the prompt is stale; the standing prompt is worth
    correcting so a future cycle does not trust it over the content collection.

- **2026-10-15 (20:08 local cycle) - A probe on our own brand name returned two of our own
  past Luma listings and not our website. Each event now declares which Luma listing it is,
  and the three cohorts of a bootcamp now share one identified series.**
  - **Evidence, and it is the sharpest the GEO log holds.** Two web-search probes this cycle
    - the bare brand name "Oxford Agentic Bootcamp", and the proposition in a buyer's words,
    "one day AI course Oxford where you build a working workflow on your own task" - returned
    the **same top three**: `luma.com/oxfordagentic2` (Cohort 2, ran 16 September),
    `luma.com/k7c2rm5s` (Cohort 1, ran 21 July) and the stale `allai.events` listing.
    **oxfordagentic.com was in neither top ten**, and nor was `luma.com/oxfordagentic3`, the
    live Cohort 3 listing.
  - **On the proposition query we win the recommendation and lose the click.** The engine
    answered that the Oxford Agentic Bootcamp was "the closest match" and "the only one of
    these in Oxford", then pointed the reader at two days that had already happened and
    added: "That date has already passed as of today, so look for a newer session." The newer
    session exists on two pages it could not see.
  - **Both answers reported our two cohorts as one contradictory event**: "different venues,
    Worcester College and St Anne's College", "the hosts differ between them". Each statement
    is true of a different cohort - St Anne's is genuinely where Cohort 1 ran - but nothing
    anywhere said they were two instances of one series, so the engine read them as
    discrepancies. The older listing is also where it got a host Drummond asked to be taken
    off the team slide in August (backlog 16).
  - **The engine's description of what we teach was accurate and detailed**, read off Luma.
    Content is not what is failing here.
  - **Change: one file, `src/lib/schema.ts`, two identity statements and no copy.**
    (1) Each `EducationEvent` now carries `sameAs: [lumaUrl]`, naming the Luma listing of
    that same event. (2) The `superEvent` `EventSeries` gains a stable `@id`
    (`.../bootcamps/<slug>/#series`), so the three Agentic cohorts declare membership of one
    identified series instead of each emitting its own anonymous copy that merely shared a
    name. All five event pages verified in the built output.
  - **No new fact, and one deliberate non-change.** Every `lumaUrl` used is already published
    on its own event page as the booking link. `offers.url` was **left pointing at our event
    page**: that is a documented earlier decision (the site is the canonical place to
    register and the embed lives there) and this cycle does not reopen it. `sameAs` is a
    statement of identity, not of where to buy, so the two do not conflict.
  - **Honest limit, stated plainly.** Nothing on-page makes an engine retrieve a page it is
    not retrieving, and this is not offered as a fix for that. It supplies the one fact that
    was missing for an engine that holds both pages - same event, this one is ours, these
    cohorts are one series. The lever that would actually move the finding is on Luma and is
    Drummond's: see the review list.
  - **Checks.** Build, links (3,024 across 61 pages, unchanged - JSON-LD carries no crawlable
    links) and schema pass with no SEO warnings; 5 Event nodes, 9 FAQPage nodes, titles and
    descriptions unique. `check:flags` passes on the all-on and all-off builds. JSON-LD
    re-parsed on all five event pages: correct `sameAs` on each, and the three Agentic
    cohorts share `.../oxford-agentic-bootcamp/#series`. Headless Chromium over all five
    event pages at **375px and 1280px**: renders, no horizontal overflow, correct `h1`, no
    page errors beyond the sandbox proxy's failures on third-party resources. The diff is one
    file that emits only JSON-LD, so no visible copy, no `updatedDate` and no event fact
    moved - Cohort 3 is still Thursday 19 November 2026 at Worcester College, as the
    screenshot and every file in the repo say.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403
    to `oxfordagentic.com` and DNS does not resolve `luma.com`, so verification is against a
    local preview of the exact `main` HEAD that Actions reports deployed (`b2ddab4`, run
    38741091891, conclusion `success`, 13:16 UTC). Same substitution as 12 to 15 Oct.
  - **Search Console: unavailable from the cloud checkout.** One attempt: no credentials,
    `gcloud` has no account, the API returns 401, and no newer export exists in `seo-data/`.
    Nothing estimated; the 13 October data stands.
  - **Off-page.** One new item, and it is the largest the loop has found, because all of it
    sits in Drummond's own Luma account: the two past listings absorb the brand traffic and
    end it, while the live one is not returned at all. Nothing contacted.
  - **No guide.** The two generic probes are both unwinnable and are logged to close them -
    the ChatGPT-context question belongs to OpenAI's own documentation, and "what is an
    agentic workflow" is held by Slack with seven of ten results from locale variants of one
    article. **Guides this week: 2 of 3**, today's allowance unused by choice for the third
    day running.

- **2026-10-15 (14:15 local cycle) — Six guides appeared in no other guide's "More guides"
  block, and three of them had one inbound internal link in the whole site. Every guide now
  gets about four.**
  - **Evidence, measured on the built site rather than reasoned about.** Counting unique
    inbound internal links per sitemap URL across all 61 built pages: three guides had
    **exactly one** - `agentic-ai-for-consultants`, `agentic-ai-for-finance-teams` and
    `agentic-ai-for-public-sector-and-nhs-leaders`, each reachable only from the guides
    index. Counting the "More guides" blocks separately: 30 guides x 4 slots = 120 links,
    and **six guides held none of them** while nine guides held eight or nine each. The
    other three with nothing were `ai-bootcamp-vs-course-vs-exec-education`,
    `how-to-run-an-ai-pilot-that-survives` and `why-the-code-an-agent-wrote-is-not-live`.
  - **Two of the six are pages the loop's own record says matter most.**
    `ai-bootcamp-vs-course-vs-exec-education` is one of only **two** pages answer engines
    have cited this site for across roughly 31 probes - the 06:47 entry states it in those
    words. `why-the-code-an-agent-wrote-is-not-live` is the guide for the Coding Bootcamp,
    the product with the least discovery and a first cohort on 26 November. Those are the
    last two pages that should have no route in from the rest of the corpus.
  - **Cause, found in the code and not guessed.** `src/pages/guides/[...slug].astro` ranked
    siblings by shared programme (2) plus shared category (1), then broke ties by
    **recency**. With **22 of the 30 guides** sharing the flagship programme, almost
    everything ties at 2 or 3, so recency was effectively the only axis that decided
    anything and the newest guides took nearly every slot. The subject-axis part of that
    scoring is a deliberate earlier fix (the two second-brain guides never surfaced each
    other under category alone) and is **kept**.
  - **Change: one file, the tiebreak only.** The four siblings are now chosen for the whole
    corpus in a single deterministic pass instead of page by page. Score still leads, so the
    picks stay subject-relevant; equal-scoring siblings are then ordered by how few slots
    they have been given so far, then by slug. One clause sits above score: a guide offered
    **nowhere at all** jumps the queue, provided it is related to that source at all. Without
    it `why-the-code-an-agent-wrote-is-not-live` stays on zero, because it is the only guide
    tied to the Coding Bootcamp alone and so scores 2 for exactly two sources. The clause
    stops applying the moment a guide is offered once.
  - **Result, measured the same way.** "More guides" appearances went from **0-9 with six
    zeroes** to **1-6, with 23 guides on exactly four**. Total inbound internal links per
    guide went from **min 1, max 11** to **min 3, max 9**, mean unchanged at 6.0 because the
    site's internal link count is unchanged at 3,024 - the same links, shared out. The three
    persona guides went from 1 to 5 each.
  - **No content, no copy, no new fact.** No markdown file was touched, so no `updatedDate`
    moved and no claim changed. Nothing in `llms.txt`, `llms-full.txt` or any schema node
    changes, because the related block is navigation.
  - **Why this and not a guide.** Four probes, all absent, none winnable and converting - the
    three persona questions and a proper regression check on the pairing question (see the
    GEO log). The 12:47 conclusion that the guide library is sufficient for the current
    product set stands. This is the other half of the same problem: the guides exist and the
    graph was not pointing at them.
  - **Honest limit.** This does not explain why those guides are absent from their own
    queries, and it is not offered as the cause. It is the lever available on a page an
    engine may never have fetched - four guides sat in "Discovered - currently not indexed"
    at the last coverage reading - and whether it moves anything is testable at the next one.
  - **Checks.** Build, links (3,024 across 61 pages, unchanged) and schema pass with no SEO
    warnings. `check:flags` passes on the all-on and all-off builds. `astro check` (installed
    `--no-save` so the diff stays clean) reports **79 errors and 4 hints both with and
    without the change**, all pre-existing implicit-`any` noise; the per-file count in the
    changed file is 17 either way. Headless Chromium over **all 30 guide pages at 375px and
    1280px**: every page has a "More guides" block with exactly four links, no horizontal
    overflow, nothing clipped at the viewport edge, no page errors. Screenshots of the block
    on the finance persona guide and the coding guide at both widths read correctly.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403
    to `oxfordagentic.com` and DNS does not resolve `luma.com`, so verification is against a
    local preview of the exact `main` HEAD that Pages reports deployed (`ecbb081`, run
    38730274530, conclusion `success`, 11:51 UTC). Same substitution as 12 to 15 Oct. **No
    event fact was touched** - Cohort 3 stays 19 November and the Second Brain Bootcamp
    21 October, as every file in the repo says.
  - **Search Console: unavailable from the cloud checkout.** One attempt: no credentials,
    `gcloud` has no account, the API returns 401, and no newer export exists in `seo-data/`.
    Nothing estimated; the 13 October data stands.
  - **Off-page.** No new opportunity worth adding: the four probe fields produced Microsoft
    marketplace consulting listings, two competitors and free Microsoft-partner NHS events.
    One stale item updated instead - **the OxGen AI Summit runs today and tomorrow** on the
    dates recorded on the review list, so that edition's sponsorship window has closed and
    the open route is 2027. Nothing contacted.
  - **Guides this week.** 2 of 3, and today's allowance is unused by choice rather than by
    the cap.

- **2026-10-15 (12:47 local cycle) — No site change. Two guides killed by their probes, and
  the 22 October handover written down while it is still cheap.**
  - **Search Console returned with no new data**, third reading today on the same window. No
    rule-4 action.
  - **The daily rebuild has now fired twice**, 14 and 15 October, both successful, both with
    `indexnow` skipped. It lands around 08:15-08:40 UTC rather than the 03:17 cron - GitHub
    delays scheduled runs by several hours - which is irrelevant for a mechanism that only
    needs day granularity.
  - **Two guides killed by their probes.** The agentic-versus-coding choice was the strongest
    remaining candidate on this morning's finding, and it serves the product with the least
    discovery six weeks out from its first cohort. The engine hears it as a developer career
    roadmap. The note-organising choice went to PKM vendors. Probing first has now prevented
    three guides in two days that would each have shipped into an owned field.
  - **One probe mis-fired and the log says so.** The third was meant as a regression check on
    the pairing question we were cited #1 for on 11 October; the phrasing routed it to
    context engineering instead. **Nothing in this cycle is evidence about our pairing
    position**, and a proper check needs the original wording.
  - **The guide library looks sufficient for the current product set.** The niche the GEO
    record identifies - choices between options we uniquely sit between - is real but small
    by construction, because it depends on there being options only we sit between, and there
    are three products. Both questions in that shape are written, and the three-way routing
    question became a programme FAQ this morning. New guides should wait for a new product, a
    probe that genuinely surfaces an unowned converting question, or an existing guide
    underperforming. **Not for the weekly allowance.** Today's went unused for the second day.
  - **The 22 October handover, written down now so it is mechanical rather than rediscovered.**
    The Second Brain Bootcamp runs on 21 October. The daily rebuild will flip
    `effectiveStatus` to `past` on its own, and the template handles that part correctly -
    verified against Cohort 2's live page today, which shows "This event has run", "How the
    day ran", and no Luma embed or booking furniture. What does **not** self-correct is the
    prose. On `oxford-second-brain-bootcamp-cohort-1.md`, these read wrongly the moment it
    flips:
    - **`capsule`** - "runs on Wednesday 21 October 2026". Highest priority: it feeds the
      Event schema and `llms-full.txt`, so it is what engines quote.
    - **`summary`** - "Build a second brain ... and leave with it working" reads as an offer.
    - **`assurances`** - written for someone deciding whether to book.
    - **Six booking-era FAQs**: "When and where is it?", "What should I bring?", "How do I
      register for Cohort 1?", "Can I install software on my work laptop?", "Can I bring my
      team?", "What if I cannot make the date?".
    The Cohort 2 precedent (23 Sept) is the model: rewrite capsule and summary in the past
    tense, cut the booking-era FAQs to the few a reader of a past page needs, and **claim no
    outcomes** until something is sourced.
  - **One decision this raises.** Cohort 2's past page works because it can say "Cohort 3 is
    the one to book". **There is no Second Brain Cohort 2 announced**, so the equivalent
    sentence has nowhere to point. If no date exists by 22 October, that page needs to route
    somewhere deliberate - the programme page, or the other two bootcamps - and that is
    Drummond's call, not a default.
  - **Checks.** Build clean: 3,024 links across 61 pages, schema valid, no SEO warnings. Logs
    only; no site file touched.
  - **Guides this week.** 2 of 3.

- **2026-10-15 (09:25 local cycle) — The programmes hub listed three bootcamps and no
  dates. Each row now names its next cohort.**
  - **Evidence.** `/bootcamps/` is the page where someone picks a programme, and it is in
    the primary navigation on all 61 pages. Its three rows read "1 upcoming" (the first,
    "1 upcoming · 2 already run") and nothing else, so "can I make it?" - half of that
    decision - cost a click. Every other listing on the site already names the day: the
    events index, the footer's upcoming list, the header button, and each programme page's
    own "Upcoming runs" band. The hub was the one surface that did not.
  - **Change.** One block in `src/pages/bootcamps/index.astro`. The count becomes
    "Next cohort 21 Oct 2026", taken from the events collection (`upcoming[0]`, which
    `getEvents()` sorts soonest first) and formatted with the shared `formatShortDate`, so
    it reads exactly as the footer does. Fallbacks kept: "Next dates being confirmed" when
    a programme has nothing upcoming, "N upcoming, next <date>" if one ever has more than
    one date open, and "· 2 already run" unchanged.
  - **No new fact.** The rows render 19 Nov 2026, 21 Oct 2026 and 26 Nov 2026, which is
    what the content collection already publishes on four other surfaces. No content entry
    was touched, so no `updatedDate` moved.
  - **Checks.** Build, links (3,024 across 61 pages), external and schema all pass with no
    SEO warnings; `check:flags` passes on the all-on and all-off builds; `astro check`
    (installed `--no-save` so the diff stays clean) reports 79 errors and 4 hints both with
    and without the change, none of them in this file. Whole-site sweep in headless
    Chromium at 375, 768 and 1280px: no horizontal overflow on any of the 61 pages, and the
    per-element readings on `/bootcamps/` are identical to the pre-change run. The hub is
    also clean at 320 and 360px, where the longest line ("Next cohort 19 Nov 2026 · 2
    already run") wraps to two lines and stays inside the card. 39 tab stops, the three
    rows reached in order.
  - **Production could not be read again this cycle.** The sandbox egress policy answers
    403 to `oxfordagentic.com`, so before and after are both local previews of the exact
    `main` HEAD that Pages reports deployed (`11dccbf`, deployment 7086242606, state
    `success`, environment `https://oxfordagentic.com/`). Same substitution as 12 to 15
    Oct. The 12 outbound links report unreachable for the same reason.
  - **Left for Drummond:** PR #1 is still open from 26 September, stale and superseded.
    See backlog 20.

- **2026-10-15 (08:05 local cycle) — The flagship programme page never mentioned the other
  two bootcamps. It now answers the choice, in the one place engines quote from.**
  - **Evidence, and it is the loop's own GEO record.** Last cycle established that across
    roughly 28 probes the site has been cited for exactly two things, and both are **choices
    between options we uniquely sit between**. So the comparison answer is the site's
    strongest retrieved asset. The flagship page did not have one. `/bootcamps/
    oxford-agentic-bootcamp/` carried 14 FAQs and **not one of them named the Second Brain
    or Coding Bootcamp**, while both newer pages carry a sourced "How is this different from
    the Oxford Agentic Bootcamp?" pointing back at it. The comparison ran one way only, from
    the two small pages to the big one.
  - **The built page proved it.** Every link from the flagship page to the other two
    bootcamps is in the header and mobile navigation. No body copy on the site's
    highest-authority commercial page mentions, compares or routes to the other two lines.
  - **Change: one FAQ, fourth of fifteen.** "Which of the three bootcamps should I do
    first?" It routes by the ceiling the reader has hit - a recurring task by hand to this
    day, generic AI answers to the Second Brain Bootcamp, an idea you want running to the
    Coding Bootcamp - and closes on the compounding, which is the Second Brain page's own
    sourced line. **Every clause is lifted from copy already published** on the three
    programme pages; nothing is new fact. `updatedDate` moved to today.
  - **Why that surface.** A programme FAQ renders three times: the visible accordion, the
    FAQPage JSON-LD, and `llms-full.txt`, which is the knowledge base both voice agents
    read. The cycle-62 note records engines lifting these answers near-verbatim. It is also
    the only part of the page where the Coding Bootcamp - invisible on every probe since it
    launched - can be reached from the page engines actually retrieve.
  - **Deliberately not done.** The Second Brain and Coding pages each answer "how is this
    different from the Agentic Bootcamp?". Naming a third line in an answer to a two-way
    question would blunt two clean answers, so they are untouched. Worth a later cycle only
    if a probe shows the gap.
  - **Checks.** Build, links (3,024 across 61 pages, unchanged - FAQ answers are plain text
    by design, so no new links) and schema pass with no SEO warnings. FAQPage JSON-LD
    re-parsed: 15 questions, the new one fourth, answer intact. The same text confirmed in
    `dist/llms-full.txt`. Headless Chromium at 375, 768 and 1280px, opening the item by
    clicking the summary as a visitor would: renders, no horizontal overflow, nothing
    clipped, answer 347px tall at 375px. Only console errors are the sandbox proxy's
    `ERR_TUNNEL_CONNECTION_FAILED` on third-party resources.
  - **The finding Drummond should see is in the GEO log.** A near-brand probe - our product
    name, our venue, our domain - returned **allai.events' stale listing of our own bootcamp
    at #1 and oxfordagentic.com nowhere**. That listing still advertises 21 July 2026 and
    prices "from $275", in dollars, on a UK event, and the engine told me the Worcester
    College venue was unconfirmed because our page was not in front of it. On this engine
    the canonical source for our flagship is a directory page we did not create. It also
    **reframes the absences logged on 12, 13 and 15 October**: if we are not retrieved on
    our own name, those were never evidence that our content is out-argued. Review list
    updated; nothing contacted.
  - **No guide, and one was allowed.** 2 of 3 this week, none today. The best candidate
    came out of this cycle's first probe - the engine said outright that no independent
    comparison exists of "build workflows, build context, or learn to ship software" - which
    is winnable, converting, and exactly the niche shape. Declined this cycle on two counts:
    it needs a probe on a second engine, and written carelessly it is a brochure for our own
    three products rather than a decision about three capabilities. Recorded for the next
    cycle with the evidence.
  - **Search Console: unavailable from the cloud checkout.** No credentials, API returns 401,
    no newer export in `seo-data/`. Nothing estimated; the 13 October data stands.
  - **Production still unreadable from here** (egress 403 on oxfordagentic.com, Luma blocked
    by DNS), so verification is against a local preview of the exact HEAD, and **no event
    fact was touched** - Cohort 3 stays 19 November as every file in the repo says.
  - **Guides this week.** 2 of 3.

- **2026-10-15 (06:47 local cycle) — No site change. Three audits came back clean, a guide
  was killed by its own probe, and the off-page list gains one honest entry.**
  - **Search Console returned with no new data**, identical to six hours earlier. No rule-4
    action; every page is now opened and closed, `/team/` included as of last night.
  - **Audited the three things the loop had never looked at, all clean.** `llms.txt` carries
    all 30 guides with title and description; `llms-full.txt` carries their full bodies,
    including both guides shipped this week; the guides hub already groups by category
    ("Start here", "Choosing how to learn", "Putting it to work") and links all 30. These are
    the artefacts answer engines actually read, and they are in good order, so the retrieval
    gap recorded on 13 October is **not** a coverage or structure problem.
  - **A guide was killed by its own probe, and it corrected me.** On 13 October I wrote that
    a published hour-by-hour agenda looked rare, and flagged it as a possible differentiator
    now that "bring your own real work" has become table stakes. Probing it showed the
    opposite: timetables are widely published, by GrowthPerf, Pertama Partners, mycocoon and
    several others. Our agenda is a genuinely different shape; the question is not ours. Had
    I written from the 13 Oct note instead of probing, the guide would have shipped into an
    owned field.
  - **What the GEO record now says, more precisely.** Across roughly 28 probes the site has
    been cited for exactly two questions, and both are **choices between options we uniquely
    sit between** - our two bootcamp formats, and bootcamp versus course versus executive
    education. Definitional questions go to tool vendors, how-to questions to platforms,
    generic buyer questions to consultancies. That is a sharper niche statement than
    "comparison questions", and it should steer what gets written next.
  - **Off-page, done deliberately rather than harvested from probes.** A search of UK event
    listing routes produced mostly ticketing platforms and "40 free places to promote your
    event" listicles, which are worth nothing - recorded so a later cycle does not repeat the
    search. One credible item: **techUK**, the UK tech trade body. Its events programme is
    its own, run with members, so there is **no listing route** and the bootcamp cannot be
    submitted; the opportunity is their "Speak at an event" path, which is the right audience
    and a credible citation. Added to the review list with the membership question explicitly
    unchecked.
  - **Nothing shipped to the site, and nothing was worth shipping.** Build clean (3,024 links
    across 61 pages, schema valid, no SEO warnings). As on the 01:21 cycle, this commit
    touches logs and the review list only.
  - **Guides this week.** 2 of 3, and today's allowance is unused by choice rather than by
    the cap.

- **2026-10-15 (02:15 local cycle) - The homepage FAQ said "two one-day bootcamps" three
  weeks after the third one launched. It now describes all three.**
  - **Evidence.** This is backlog 14 - the two-product sweep checklist - recurring exactly
    where that item predicted it would, on the next launch. The Oxford Agentic Coding
    Bootcamp launched on 25 September with Cohort 1 on 26 November, and `src/lib/home.ts`
    still opened with "across two one-day bootcamps", named only the Agentic and Second
    Brain days, and closed "Both are hands-on". Four of the twelve answers described a
    two-product business: the entity answer, who the bootcamps are for, the venues, and
    what you leave with.
  - **Why it is the highest-value thing available.** That first answer is not ordinary page
    copy. It is the single most quoted text on the site: the cycle-62 note records engines
    lifting these answers near-verbatim into snippets, and it renders three times over - the
    visible accordion, the FAQPage JSON-LD on the homepage, and `llms-full.txt`, which is
    the knowledge base both voice agents read. So the canonical answer to "what is Oxford
    Agentic?" has been omitting a third of the business, in structured data, for three weeks.
  - **Change.** Four answers in `home.ts`, plus one wrong published string in `llms.ts`
    ("the full text of the FAQ, both bootcamps" -> "all three bootcamps") and its stale
    comment. The entity answer gains a sentence on the Coding Bootcamp; "Who are the
    bootcamps for?" gains its audience (shipping software without waiting on a developer);
    "What will I actually leave with?" gains its outcomes; the venue answer now covers all
    three lines.
  - **Two claims deliberately NOT made.** The old answer said "Both are hands-on and capped
    small". **The Coding Bootcamp has no capacity or cap claim anywhere in the repo**, so
    "all three are capped small" would have been invented. The cap clause was dropped from
    this answer rather than widened; it survives verbatim in "Do I need to be technical?"
    and on each programme page, where it is sourced. Likewise "No coding required" became
    "none of them expects you to arrive able to code", which is what the Coding Bootcamp's
    own FAQ says ("the day does not assume you can code: the agents do the typing"), and it
    is still never left standing on its own, per the message house.
  - **Also corrected: the venue answer opened "In Oxford colleges."** The Second Brain
    Bootcamp is at the Pitt Rivers Museum, so that sentence had been wrong since that line
    launched too - the same defect, one surface over. All five venues re-read from the event
    files, every one `confirmed: true`.
  - **Checks.** Build, links (3,024 across 61 pages, unchanged) and schema pass with no SEO
    warnings; FAQPage JSON-LD re-parsed and valid, 12 questions, the four changed answers
    present. `grep` confirms "two one-day bootcamps" is gone from `dist/` entirely and the
    new text reaches all three surfaces. Headless Chromium at 375, 768 and 1280px: no
    horizontal overflow with all four answers expanded, the accordion still toggles, and the
    only console errors are the proxy's `ERR_TUNNEL_CONNECTION_FAILED` on third-party
    resources, which is the sandbox and not the change.
  - **Harness note, so a later cycle does not lose time to it.** The first FAQ item is
    **open by default**. A verification script that "clicks to open it" closes it, then
    reports the answer missing and the panel 63px tall. It looks exactly like a broken
    accordion and is not one. Read the initial state first.
  - **No guide. Declined on the rule, not on the budget** - two published this week against
    a limit of three, and none today, so one was allowed. The best candidate by far was
    "what do you need to learn to work with a coding agent if you cannot code": the field is
    a personal blog, a newsletter excerpt and a self-published audiobook, and the searcher is
    the Coding Bootcamp's buyer. It was dropped because
    `why-the-code-an-agent-wrote-is-not-live` already answers it point for point, and a
    near-duplicate of our own page is still a near-duplicate.
  - **The finding worth Drummond's attention is in the GEO log.** Four probes this cycle,
    all aimed at the coding line, all absent. Asked for an Oxford, in-person, one-day Claude
    Code bootcamp, the engine said it could not find one. Combined with 12 and 13 Oct, that
    is three instances of having the content and not being retrieved, so the lever is
    off-page (backlog 2b), not another guide.
  - **The daily rebuild fired - yesterday's open question is closed.** The 13 Oct cycle
    added a 03:17 UTC cron and could not confirm it. Run 229 ran as `event=schedule` on
    14 Oct and succeeded. It was **5h23m late** (08:40 UTC, not 03:17), which is GitHub
    delaying a queued cron rather than a fault, but it is worth knowing the margin is hours,
    not minutes, with the Second Brain Bootcamp on 21 October.
  - **Cohort 3's date in the scheduled prompt is wrong and the repo is right.** The standing
    prompt still says Cohort 3 is 15 October. Every file in the repo says **19 November** at
    Worcester College, the Coding Bootcamp 26 November, and the 11 Oct cycle logged
    aieventlist.ai independently carrying 19 Nov. Luma could not be reached to confirm
    (DNS blocked), so **no event fact was touched**. Raised for Drummond below.
  - **Production could not be read again.** The egress policy answers 403 to
    `oxfordagentic.com` and blocks `luma.com` by DNS, so verification is against a local
    preview of the exact `main` HEAD. Same substitution as 12, 13 and 14 Oct. The 12
    outbound links report unreachable for the same reason - 0 of 12, which is the proxy,
    not twelve simultaneous third-party outages.
- **2026-10-15 (01:21 local cycle) — No site change. `/team/` diagnosed, and the Oxfordshire
  decision is now settled with evidence rather than assumed.**
  - **The daily rebuild works, including the part I could not verify on Monday.** The cron
    fired on 14 Oct (08:40 UTC - GitHub delays scheduled runs, as the comment anticipated),
    built and deployed successfully, and **`indexnow: skipped`**. A scheduled rebuild now
    republishes the site without pinging IndexNow for a stale diff, which was the trap worth
    guarding. Note for the record: the 14 Oct ledger entry from the other loop says the
    scheduled rebuild had not fired - that session checked at 08:36, four minutes early.
  - **`/team/` is the last page with real volume that had never been examined**, and it was
    this week's fastest mover: 202 → 212 impressions, 6 → 9 clicks, 3.0% → 4.2%. Its visible
    query share is **35%**, far above any other page, so it was worth opening. Two thirds of
    what is visible is the county-provider cluster - Oxfordshire, and also Hertfordshire,
    Buckinghamshire and Salford, which is a query template rather than local demand - sitting
    at positions 20 to 71 with **zero clicks**. Full rows in the baseline file.
  - **What that settles.** The standing decision not to target that cluster has a measurable
    cost of zero clicks, and a probe shows the cluster is owned by town-by-town page farms
    (one competitor has a page for each of ten Oxfordshire towns, another covers 45 towns
    across six counties). Entering means location pages, which is a standing no. The decision
    was previously a judgement; it is now evidenced from both ends.
  - **Deliberately not acted on.** `drummond gilbert` is the top named query for `/team/`
    (23 impressions, position 7.4) and resolves to the team index rather than the individual
    profile. That is consistent with the 9 Oct preference that the site read as a team rather
    than one person, so it is working as intended.
  - **Nothing shipped, and nothing was worth shipping.** Rule 4 points at an excluded cluster,
    so no change. Three GEO probes returned nothing both winnable and converting, so no guide,
    although one was allowed today. No technical defect: the build is clean and Monday's audit
    of the hidden-page PR found nothing outstanding.
  - **A note on the "if nothing ships, do not commit" rule.** This commit touches only the
    three log files and no site file. Losing a Search Console reading, a page diagnosis that
    closes a standing question and three probes seemed worse than the empty-commit the rule
    guards against - the rule reads as a guard against padding the site to justify a push.
    Flagging it so Drummond can say if he would rather these cycles went unrecorded.
  - **Competitive intelligence.** **InAgentic**, an Oxford AI agency running four-hour
    instructor-led Claude Code workshops, is the closest direct competitor seen so far - same
    city, adjacent format. And theoxfordaischool.com appeared for the fourth cycle running.
  - **Guides this week.** 2 of 3.

- **2026-10-14 (08:47 local cycle) - The only control that opens the navigation on a
  phone was 31px tall. Its touch target is now 44px and the button looks exactly the
  same.**
  - **Evidence.** A touch-target sweep at 375px across eleven templates turned up one
    outlier, and it is on all 60 pages: `.nav-toggle`, the hamburger in the header,
    renders 43 by 31. On a phone it is the only way to Events, Bootcamps, Outcomes, Team
    and the next-bootcamp button, and 31px is under the 44px that Apple and Google both
    specify and that WCAG 2.5.5 asks for. Nothing else fell short: the links inside the
    open menu are 40 to 43px tall and full width, and the buttons, cards and footer rows
    are all comfortably over.
  - **Change.** A transparent pad on the button (`::after`, `inset: -0.5rem -0.3rem`)
    widens the target to roughly 45 by 50 instead of growing the button, so the header
    keeps its proportions and nothing on any page moves. Measured from the centre of the
    control: a press 22px above, below, left or right of it now lands on the button, and
    24px above or below does not, so the target is bigger and still tight. A click 4px
    under the visible box opens the menu at 320, 375 and 768px; Escape still closes it
    and returns focus; the focus ring still draws on the visible box, gold, 2px, 3px
    offset.
  - **Proof it changes nothing visually.** The header was captured at 375, 768 and 1280px
    with the rule live and with it disabled. All three pairs are byte-identical PNGs. At
    1280px the button is `display: none`, so the rule renders nothing at all.
  - **Checks.** Build, links (3,024 across 61 pages, unchanged) and schema pass with no
    SEO warnings; `check:flags` passes on the all-on and all-off builds. `astro check`,
    installed with `--no-save` so the diff stays clean, reports 79 errors and 4 hints both
    with and without the change, so none of them is this. Whole-site sweep in headless
    Chromium at 375, 768 and 1280px: 180 page-widths, no horizontal overflow, no missing
    alt text, no unlabelled controls, one `h1` per page, no heading-level skips.
  - **Also swept, nothing to fix: 320 and 360px**, which this loop had never tested.
    All 60 pages at both widths are clean, so the layout holds on the narrowest phones
    still in use. Keyboard focus was re-checked across eleven templates (29 to 56 tab
    stops each) and every stop has a visible ring. Every Luma and GTM iframe carries a
    title.
  - **Harness trap, recorded so a later cycle does not lose an hour to it.** `global.css`
    sets `scroll-behavior: smooth`, so a screenshot script that calls `window.scrollTo`
    in a tight loop never actually reaches the bottom: the reveal animations do not fire,
    and whole bands come out blank. It looks exactly like a rendering defect and is not
    one. Set `document.documentElement.style.scrollBehavior = 'auto'` before scrolling.
  - **The daily rebuild has not fired yet.** The `schedule:` trigger added yesterday at
    03:17 UTC had produced no run by 08:35 UTC today (`event=schedule`, total 0). The
    workflow was on `main` from 17:52 yesterday, so it was eligible. GitHub delays and
    sometimes drops scheduled runs; today's push rebuilds the site anyway. Worth
    confirming tomorrow before the Second Brain Bootcamp on 21 October, which is the date
    the trigger exists for.
  - **Production could not be read again this cycle.** The sandbox egress policy answers
    403 to `oxfordagentic.com`, so the comparison is against a local preview of the exact
    `main` HEAD that Pages reports deployed (`3d71595`, deployment 7045897881, state
    `success`, environment `https://oxfordagentic.com/`). Same substitution as 12 and 13
    Oct. The 12 outbound links report unreachable for the same reason.
  - **One finding raised for Drummond rather than shipped**, as backlog 23: on a past
    cohort's page the programme's testimonials sit under "From the room", and two of the
    three name no cohort.
  - **No guide written.** This cycle's remit is the existing site.

- **2026-10-13 (18:47 local cycle) — The site now rebuilds daily, so a past event stops
  advertising itself as upcoming.**
  - **Evidence.** The deploy workflow fired on `push` and `workflow_dispatch` only. There
    was no scheduled build, and `effectiveStatus()` derives "past" from `endDate` **at build
    time**, so a static site that does not rebuild keeps serving whatever was true at the
    last build. That is precisely what happened between 15 and 23 September: eight days with
    no push, and the live site went on advertising Cohort 2 as upcoming, with a waitlist
    button, a week after it ran. The fix then was a manual rebuild; the cause was never
    removed.
  - **Why now.** The Second Brain Bootcamp runs on **21 October, eight days away**, and the
    loop is still hand-started rather than running from the cloud routine. The gap that
    caused the September incident is open again and on a date we can see coming.
  - **What changed.** A `schedule:` trigger at 03:17 UTC daily, so a day that finishes on a
    Tuesday evening reads as past by early Wednesday. Off the hour, because scheduled runs
    queued on the hour are the ones GitHub delays.
  - **And the trap that came with it.** The IndexNow job derives changed URLs from
    `git diff HEAD^ HEAD`. On a scheduled run there is no new commit, so that diff resolves
    to the **last push's** files and would have hinted at them again every single day -
    daily spurious pings for unchanged URLs, which is how a key stops being trusted. The job
    is now gated on `github.event_name == 'push'`, which also covers manual dispatches. This
    push pinged normally, as a push should; the first scheduled run will not, and that is the
    part only tomorrow can confirm.
  - **Audit of the merged CEO Roundtable PR (#2) - clean, no action.** It touched
    `BaseHead.astro`, `Base.astro`, `astro.config.mjs` and `check-schema.mjs`, which is a
    site-wide blast radius worth checking. `hidden` defaults to false everywhere, so no
    existing page changed behaviour. Verified live and in `dist`: `/ceo-roundtable/` carries
    `noindex, nofollow` and no JSON-LD, and is absent from the sitemap, `llms.txt` and
    `llms-full.txt`; no other page gained a robots meta; the eight that carry one are all
    pre-existing and intentional; sitemap holds 53 entries live and locally; `robots.txt`
    unchanged and permissive. The one page that looked wrong - `team/josh-lawman` with no
    JSON-LD - is a deliberate redirect stub to `/team/`.
  - **Checks.** Build, links (3,024 across 61 pages) and schema pass, no SEO warnings. The
    workflow YAML was parsed to confirm all three triggers, the cron and all three jobs
    survived the edit. No page content changed, so there was nothing to inspect at 375px.
  - **Search Console (new data).** 129 clicks, 1.88k impressions, through 11 October. No
    rule-4 action; the increments change nothing.
  - **GEO.** Three probes, none cited, none winnable - enterprise IT, major publishers, and
    SaaS vendors respectively.
  - **Guides this week.** 2 of 3, and today's allowance went at 06:47.

- **2026-10-13 (12:47 local cycle) — The last two orphaned guides that had a natural home
  now have one. The remaining four are left alone on purpose.**
  - **Evidence.** Monday's audit found 11 guides with no inbound contextual links and fixed
    the five highest-value ones. Two of the six left over turned out to have homes that were
    already half-written: `what-goes-in-a-second-brain` closes on the sentence "that is why
    building one is a day's work rather than an afternoon's", which is the exact claim
    `how-long-to-build-a-second-brain` exists to answer; and the four-level ladder in
    `what-hands-on-ai-training-actually-means` turns on facilitation and room size, which is
    where delivery mode belongs and where `why-in-person-beats-online-for-learning-ai` fits.
  - **Four orphans remain and should stay that way for now.** The three sector guides and the
    glossary have no sentence anywhere that genuinely wants to link to them, and the glossary
    in particular sits in a query space owned by AWS, Zapier and Oracle. A forced link is
    worse than no link.
  - **Checked and deliberately did not change: the Coding Bootcamp's internal linking.** It
    has 3 inbound links from content against the flagship's 21, which looked like a defect
    worth fixing given Cohort 1 is six weeks out. It is not one. Only three guides are about
    building software with agents, and all three already link to it. The ratio reflects the
    **subject mix of the guide library**, not a linking failure, so the honest fix is coding
    content on probe evidence rather than links bolted onto workflow guides. Recorded so a
    later cycle does not "fix" it by forcing them.
  - **No guide today.** The daily allowance went at 06:47.
  - **Checks.** Build, links (2,978 across 60 pages, exactly two more) and schema pass, no SEO
    warnings. Both edited pages inspected at 375px (scrollWidth 375) and desktop (1024/1024);
    `updatedDate` bumped on both; both links verified by anchor text in the built output.
  - **Search Console (returned, no new data).** Fifth reading on the same window, still
    through 10 October.
  - **GEO.** Three probes, none cited, and one pattern worth naming: this is the **second**
    question in two days where the site has competitive content and is simply not retrieved
    (the hands-on question on 12 Oct, the business-context question today). Two instances
    suggest a retrieval problem rather than a coverage one, which more guides will not fix.
  - **Guides this week.** 2 of 3.

- **2026-10-13 (08:47 local cycle) — The homepage's last band told visitors no cohort was
  set, under three cohorts that are set, dated, venued and on sale.**
  - **The defect.** The gold "Not ready to book?" band is the final thing on the homepage,
    directly under the FAQ. Its one sentence read "You will get the date, venue and booking
    link as soon as the next cohort is set." Three cohorts are listed higher up the same
    page with their dates, their venues and a Register link each, and the nearest of them
    (Second Brain, Pitt Rivers Museum) is **eight days away**. The band was written for a
    site with nothing on sale and was never revisited.
  - **The page already knew better.** `HomeSections.astro` branches the "Next in Oxford"
    heading and standfirst on `nextThree.length` — "Next in Oxford" with cards, "The next
    cohort / Dates are not fixed yet" without. The capture band 200 lines below was the one
    place that hardcoded the empty-diary case, so the same page answered the same question
    two different ways.
  - **Change.** One paragraph, branched on the same condition. With cohorts listed it reads
    "The cohorts above are open for booking. Leave your email and you will hear about the
    ones after them as soon as the dates are set." With none, the original sentence survives
    verbatim. Nothing else moves: the heading, the form, its label and the single CTA are
    untouched, and no date, venue, price or capacity is stated.
  - **Checks.** Build, links (2,976 across 60 pages, unchanged) and schema pass with no SEO
    warnings; `check:flags` passes on the all-on and all-off builds. `astro check`, installed
    with `--no-save` so the diff stays clean, reports the same 5 errors and 69 hints with and
    without the change. Whole-site sweep in headless Chromium at 375, 768 and 1280px: 180
    page-widths, **zero** findings — no horizontal overflow, no missing alt text, no
    unlabelled controls, no links or buttons without an accessible name, one `h1` per page,
    no heading-level skips. The band captured before and after at all three widths; 40
    keyboard tab stops on the homepage all show a visible focus ring. No em dashes.
  - **Production could not be read again this cycle.** The sandbox egress policy answers 403
    to `oxfordagentic.com`, `www.` and the `github.io` host alike, so the comparison is
    against a local preview of the exact `main` HEAD that Pages reports deployed (`edc7bca`,
    deployment 7031174259, state `success`, environment `https://oxfordagentic.com/`). Same
    substitution and same evidence as 12 Oct. All twelve outbound links report unreachable
    for the same reason; that is the proxy, not the links.
  - **Two findings raised for Drummond rather than shipped**, as backlog 21 and 22: the
    bronze accent measures 3.83:1 on cream across 58 of 60 pages (a brand-token change, his
    call), and Cohort 2 still has no outcomes four weeks after it ran, on a page whose own
    standfirst promises them.
  - **No guide written.** This cycle's remit is the existing site.

- **2026-10-13 (06:47 local cycle) — New guide: is your AI workflow saving time, or just
  feeling faster?**
  - **Evidence.** Flagged on 12 Oct as the best candidate of the week: the only recent probe
    whose field was small blogs rather than institutions or vendors, and a question a senior
    person asks before committing more of their own time. It was held back twice because the
    supporting study reached us secondhand. **This cycle it was traced and read at source** -
    and the secondhand versions turned out to have conflated two companion papers, which
    vindicates the hold. Details and the correction are in the GEO log.
  - **What it says.** Two preregistered studies by Yu, Cheng and five co-authors (May 2026,
    arXiv:2605.23177 and arXiv:2605.22687) found that on simple tasks AI-assisted and
    unassisted completion took the same time, while people predicted AI would be much faster
    and reported it felt easier. The guide uses that to separate three returns people
    conflate - time, effort and quality - and then says plainly what the research does **not**
    show: both papers are about short tasks, not multi-step workflows, so this is not evidence
    that AI never saves time. It closes with four things to measure, including timing the
    third run rather than the first and counting the checking.
  - **Accuracy discipline.** Only abstract-level findings that were read at the primary source
    are cited. The vivid "55.7 versus 7.5 seconds" figure circulating secondhand is left out,
    because it belongs to the other paper's body. Author institutions are not claimed, because
    the arXiv pages do not list them. One short quoted phrase, attributed.
  - **Inbound link in the same commit**, per the process lesson recorded on 12 Oct:
    `how-to-run-an-ai-pilot-that-survives` now points at it from "define better before you
    start", which is where the distinction actually bites. No guide the loop ships should
    arrive orphaned again.
  - **Checks.** Build, links (2,976 across 60 pages) and schema pass, no SEO warnings, no em
    dashes. Capsule 60 words, description 152 chars, seoTitle 38. Both arXiv links verified
    reachable by the outbound checker. Inspected at 375px (scrollWidth 375) and desktop
    (1024/1024).
  - **Search Console (returned, no new data).** Still through 10 October, identical to 00:47.
  - **GEO.** Two probes, neither cited, and one matters commercially: **"bring your own real
    work" is no longer a differentiator.** Ten providers answer that question and every one
    promises it. That is a positioning question for Drummond rather than something a guide
    fixes.
  - **Guides this week.** 2 of 3.

- **2026-10-13 (00:47 local cycle) — Eleven of twenty-nine guides had no inbound links. The
  five that matter most now do.**
  - **Evidence.** Yesterday's fix covered the two newest guides. Auditing the whole library
    showed the problem is a third of it: **11 of 29 guides had zero inbound contextual links**,
    reachable only from the hub and the generated "More guides" block. Among them were
    `what-is-an-agentic-bootcamp`, the definitional page for the flagship product, and
    `what-second-brain-actually-means` and `when-ai-executive-cohorts-run`, **both of which
    Perplexity already cites** at #1 and #2 for the second-brain pairing question.
  - **What changed.** Five links, one each, placed where the argument already went that way:
    `after-the-ai-executive-programme` → `when-ai-executive-cohorts-run` (sequencing);
    `questions-to-ask-before-booking-ai-training` → `what-hands-on-ai-training-actually-means`
    (reciprocating yesterday's link, and question 1 is literally the hands-on test);
    `how-to-choose-your-first-agentic-task` → `what-is-an-agentic-bootcamp` (what the task is
    for); `what-goes-in-a-second-brain` → `what-second-brain-actually-means` (the definition
    first); `what-is-an-agentic-bootcamp` → `agentic-ai-for-business-leaders-where-to-start`
    (for readers who are earlier than that). No existing sentence was rewritten.
  - **Six orphans remain, deliberately.** The three sector guides (consultants, finance,
    public sector), the glossary, `how-long-to-build-a-second-brain` and
    `why-in-person-beats-online-for-learning-ai`. They are lower value, and a forced link is
    worse than no link. A later cycle can place them properly.
  - **No guide today, although one was allowed.** The orphan finding was worth more than a
    thirtieth guide, and the one strong candidate on the list - "is it saving time or does it
    just feel faster" - still needs its supporting study traced to a primary source before
    anything cites it.
  - **Checks.** Build, links (2,920 across 59 pages, exactly five more) and schema pass, no
    SEO warnings, no em dashes anywhere in the guide library. All five edited pages inspected
    at 375px (scrollWidth 375 on each) and desktop (1024/1024); `updatedDate` bumped on all
    five, and each new link verified by anchor text in the built output.
  - **Search Console (returned, no new data).** Still through 10 October. Nothing left to
    diagnose - the full page-by-page verdict table is now in the baseline file.
  - **GEO.** Three probes, none cited. The useful one is negative and strategic: **"AI bootcamp
    UK" belongs to the Department for Education Skills Bootcamp scheme**, not to us. That is
    the same conclusion the Danish IBM cluster pointed at from the other direction, and it
    says generic bootcamp terms are a mismatch rather than an opportunity.
  - **Guides this week.** 1 of 3.

- **2026-10-12 (18:47 local cycle) — The two guides shipped this week had no inbound links
  from anywhere. They do now.**
  - **Evidence.** `what-you-can-build-in-one-day-with-ai` (shipped 00:47 today) and
    `in-house-ai-day-or-send-people-to-a-cohort` (11 Oct) were each linked from exactly one
    file: themselves. A mature guide like `scout-drafter-reviewer-pattern` has four inbound
    links from other guides. Both new pages were reachable only from the guides hub and the
    generated "More guides" block, which is the weakest possible internal position for a page
    we want indexed and ranked.
  - **This is a process flaw, not a one-off.** The loop writes outbound links from each new
    guide and never adds inbound ones from the old pages, so every guide it ships arrives
    orphaned. **Future cycles that publish a guide should add its inbound links in the same
    commit.**
  - **What changed.** Three contextual links across two existing guides, each placed where the
    argument already went that way. `ai-bootcamp-vs-course-vs-exec-education` now points to
    the one-day guide where it says a day cannot cover a landscape, and to the in-house guide
    where it notes the three formats leave out the open-cohort-versus-private-day axis.
    `what-is-an-agentic-bootcamp` points to the one-day guide at the end of "what actually
    happens on the day". No existing sentence was rewritten.
  - **Checks.** Build, links (2,915 across 59 pages, exactly three more) and schema pass, no
    SEO warnings, no em dashes. Both edited pages inspected at 375px (scrollWidth 375) and
    desktop; `updatedDate` bumped on both.
  - **Search Console (new data, first time in four readings).** One more day landed: 126
    clicks, homepage 990 → 1,005 impressions. Diagnosed the flagship programme page, the last
    untouched candidate: **90% of its 189 impressions are anonymised**, and eleven of the
    nineteen visible ones are a **Danish IBM-bootcamp cluster** at positions 42 to 76, which
    is a fourth recurring cause and new today. No change. Three pages closed in one day; the
    conclusion is systemic and recorded in the baseline file.
  - **Guides this week.** 1 of 3. None today; today's allowance went at 00:47.

- **2026-10-12 (12:47 local cycle) — The hands-on guide now answers the in-person version of
  the question, because every checklist it competes with is written for online courses.**
  - **Evidence.** This morning's probe on "how can I tell if an AI course is genuinely
    hands-on" returned ten sources and not one of ours, despite the site answering that
    question twice. Reading them, the reason is not a content gap: every competing answer
    tells you to look for notebooks, a GitHub repository, graded projects, a capstone, a
    syllabus listing deliverables, a recent update date. All written for self-paced video,
    and none of it checkable about a day in a room.
  - **What changed.** One new section in `what-hands-on-ai-training-actually-means`, saying
    plainly that those checklists do not transfer and naming the two signals that replace
    them: what you are asked to bring beforehand, and whether anyone has mentioned your
    laptop. Both are honest inferences from how a level-four day has to work, and the laptop
    point uses the published wording ("corporate and government devices often block tool
    sign-ups"). It then hands off to the nine-questions checklist rather than restating it.
  - **Why an edit and not a guide.** `questions-to-ask-before-booking-ai-training` already
    covers room size, ratio, what to bring and getting stuck. A new page would have been a
    near-duplicate of two existing ones. The missing piece was the framing, not the content -
    and the two guides had never linked to each other, which they now do.
  - **Checks.** Build, links (2,912 across 59 pages, one more than before) and schema pass,
    no SEO warnings. No em dashes. Inspected at 375px (scrollWidth 375, section renders and
    wraps cleanly) and desktop; `updatedDate` bumped to 12 Oct.
  - **Search Console (returned, fourth reading with no new data).** Still through 9 October.
    Diagnosed `/bootcamps/` the same way as the Cohort 2 page this morning: **82% of its 139
    impressions are anonymised**, and the visible remainder is brand queries the homepage
    wins plus 13 impressions from someone looking for the University's own programme. No
    change, and it is direct support for the standing rule on that title. Both of the site's
    apparent CTR gaps are now closed with raw rows.
  - **GEO.** One citation: `ai-bootcamp-vs-course-vs-exec-education` is cited #5 for "is a
    one-day AI bootcamp worth it for a non-technical executive". Note that the engine quotes
    a superseded "about twenty-five senior people" line from it - the page and the repo both
    say "a small room of senior people", so that is a stale cache, not a page to fix.
  - **Guides this week.** 1 of 3. None written today; today's single-guide allowance went at
    00:47.

- **2026-10-12 (09:09 local cycle) — Two of the three upcoming event cards opened by
  repeating the line printed directly above them.**
  - **The defect.** `EventCard` renders the date and the venue, then the summary. Cohort 3's
    summary opened "Thursday 19 November at Worcester College, Oxford" and the Coding
    Bootcamp's opened "Thursday 26 November at Worcester College, Oxford" — the same two
    facts again, word for word, in the one sentence the card has to say what the day gives
    you. The Second Brain card does not do it, so the three upcoming cards read
    inconsistently side by side on the homepage.
  - **It contradicted its own note.** The comment above Cohort 3's summary says the field is
    written the way it is to say "the part the meta line cannot". The string said the meta
    line. The non-duplicating version was already sitting one field below, in `promise`.
  - **Where it showed.** The homepage "Next in Oxford" band, `/events/`, both programme
    pages and `/404/`. Also twice in `llms.txt`, whose generator already prefixes the date
    and venue: "Thursday, 19 November 2026, 9:00–17:00, Worcester College, Oxford. Thursday
    19 November at Worcester College, Oxford. Bring one real task…" That file is the
    knowledge base both voice agents read.
  - **Change.** The repeated sentence comes out of both summaries and nothing else is
    touched. No date, venue, capacity or claim moves: all of them still render on the line
    above, in the Event schema (which uses `capsule`, not `summary`) and in `llms.txt`. The
    surviving halves are the published wording, verbatim.
  - **Meta descriptions.** `summary` doubles as the event page's meta description, so those
    shorten to 93 and 98 characters — inside the site's existing range of 78 to 157, and
    still unique. The date reaches the SERP through the Event node, not the description.
  - **Checks.** Build, links (2,911 across 59 pages) and schema pass with no SEO warnings;
    `check:flags` passes on the all-on and all-off builds. `astro check` reports the same
    77 pre-existing errors with and without the change (it is not in the build or CI, and
    `@astrojs/check` is not a dependency). Whole-site sweep in headless Chromium at 375,
    768 and 1280px: no horizontal overflow on any of 59 pages, no missing alt text, no
    unlabelled form controls, one `h1` per page, no heading-level skips. The card grids
    compared before and after at all three widths — equal-height cards, CTAs still aligned.
  - **Production could not be read this cycle, and this is the second time the sandbox has
    limited a check.** The egress policy denies `oxfordagentic.com`, so the before/after
    comparison is against a local preview of the exact `main` HEAD that GitHub Pages reports
    deployed (`98f991e`, deployment 7007447634, state `success`, environment
    `https://oxfordagentic.com/`). Deployment state, not a fetch, is the evidence that
    production matches `main`. The outbound-link checker reports all ten third-party links
    as unreachable for the same reason — that is the proxy, not the links.
  - **Note on screenshots, for future cycles.** Chromium's `fullPage: true` capture renders
    `data-reveal` sections as blank bands even when the DOM reports them revealed at opacity
    1. The "Already run" band on `/events/` looked empty and is not. Capture viewport slices
    or element screenshots instead, and verify a suspected blank band in the DOM before
    believing it.
  - **Left for Drummond:** PR #1 is still open from 26 September. See backlog 20.

- **2026-10-12 (06:47 local cycle) — The brand description loses a bare "No coding." and
  comes in under 160 characters.**
  - **Evidence.** Two defects in one string. It ran to 166 characters, which the schema
    check has warned about since 7 October and which means Google truncates it in the SERP,
    so the final sentence was delivering nothing. And that final sentence was "No coding."
    standing alone - the exact framing the message house (13 Aug) forbids, and the one
    `longDescription` was already fixed for, which is how the inconsistency was spotted.
  - **What changed.** The sentence comes out; nothing else is touched. The string is now 155
    characters. There is no room to qualify "no coding" properly inside 160, and the paired
    version ("No coding required, and nothing hand-waved") survives in `longDescription`, in
    the homepage FAQ and in the programme copy, all of which were checked in the built output.
  - **Wider than the homepage.** `brand.description` also feeds the Organization and WebSite
    schema nodes, `llms.txt` and the RSS channel description. All four were verified in
    `dist/` after the build, which is the point: the bare framing was reaching answer engines
    and feed readers in full, not truncated.
  - **Checks.** Build, links (2,911 across 59 pages) and schema all pass, and the schema
    check now reports **no SEO warnings at all** for the first time in a week. Homepage
    inspected at 375px (scrollWidth 375) and desktop; `og:description` tracks the change.
  - **Search Console (returned, no new data, one real finding).** Still through 9 October.
    The Cohort 2 event page looked like the site's clearest CTR gap - 192 impressions, 2.6%,
    position 6.9 - and filtering its queries closed the question: **92% of its impressions
    are Google-anonymised**, and the visible remainder is brand queries the homepage wins
    plus the excluded Oxfordshire cluster. No change made to it; raw rows recorded in the
    baseline file so no future cycle re-opens it.
  - **Guides this week.** 1 of 3, and today's one is already used (00:47). None written.

- **2026-10-12 (00:47 local cycle) — New guide: what you can actually build in one day with AI.**
  - **Evidence.** This cycle's probe on "what can you realistically build in one day with AI
    no coding" returned ten sources and every one was a no-code vendor selling its own
    builder: Bolt, Lovable, Softr, Zapier, QuantumByte, aibuilderclub, newly.app. Nobody
    answers the scope question without a product attached to the answer. CONVERTING: it maps
    directly onto the one-day promise, and someone asking it is deciding whether a day is
    worth their time.
  - **Not a near-duplicate.** Three existing guides sit near it and none answers it.
    `how-to-choose-your-first-agentic-task` is which task to pick, `scout-drafter-reviewer-pattern`
    is the shape of the workflow, `what-is-an-agentic-bootcamp` is the format of the day.
    This one is about scope and limits — what finishes inside a day and what cannot — and
    links to all three rather than restating them.
  - **Nothing invented.** The three-pass structure comes from the published agenda, the three
    deliverables from the published `whatYoullBuild`, and the task examples from the published
    Cohort 1 FAQ, which says those tasks *surfaced in the room* — the guide says the same and
    claims no outcomes. The four things that do not fit are argued, not sourced to anyone.
  - **Checks.** Build, links (2,911 across 59 pages) and schema pass. Capsule 59 words,
    description 149 chars, seoTitle 37. Inspected at 375px (scrollWidth 375, no overflow,
    breadcrumb truncating) and at desktop.
  - **Search Console (returned, no new data).** Still through 9 October: 125 clicks, 1.82k
    impressions, 6.9% CTR, position 14.6 — identical to the 11 Oct 12:47 reading, so no
    CTR work was possible and rule 5 applied.
  - **Guides this week.** 1 of 3 (week of Mon 12 Oct).

- **2026-10-11 (12:47 local cycle) — The guide parked this morning is live: in-house day or
  open cohort.**
  - **Evidence.** The 06:47 probe on "AI training away day for a leadership team UK" returned
    ten pages and every one was an in-house trainer selling a private day. Nobody writes the
    comparison, because nobody selling only one side of it wants to. The question is
    CONVERTING: it is the group-seat buyer, which is the fastest route to filling a cohort.
  - **What it says.** What an in-house day is genuinely better at (alignment across a team,
    your own systems, confidential work, one date), what a cohort is better at (no organising,
    the other people in the room, honest value below about four people, being out of the
    building), and the question that settles it: are you buying alignment or capability.
    It ends by saying plainly that if you need alignment across a large team, buy the
    in-house version from someone who does it well.
  - **Nothing invented.** The team paragraph uses the published wording: teams welcome, two
    people should bring the same task, email hello@ to arrange. No private day is implied,
    because none is offered. No prices, no competitor claims, no quotes.
  - **Checks.** Build, links (2,851 across 58 pages) and schema pass. Capsule 60 words,
    description 151 chars, seoTitle 42. The page is 375px wide at 375px with the breadcrumb
    truncating, which is this morning's fix doing its job on the page that found the bug.
  - **Search Console (fresh, through 9 Oct).** 125 clicks, 1.82k impressions, 6.9%, position
    14.6. No step-4 change; see the baseline log for the two movements worth watching.
  - **Guides this week:** 1 of 3.

- **2026-10-11 (06:47 local cycle) — Long breadcrumbs were making 32 pages scroll sideways on
  a phone.**
  - **The bug.** `.crumbs__item--current span` truncates at 34 characters, but it never got
    the chance. As a flex item the `<li>` around it defaults to `min-width: auto`, so it
    refused to shrink below the full width of the untruncated title and pushed the document
    wider than the viewport. On a 375px screen the public-sector guide rendered a **742px
    wide document**: a real sideways scroll, on the format Google measures.
  - **Scale.** 32 of 57 pages carry a breadcrumb longer than the truncation point, including
    most guides and every event page. This was not new; it has been shipping for as long as
    the long titles have.
  - **How it surfaced.** Writing a new guide and measuring the page at 375px, which is the
    inspection step the rules require. The guide was the messenger, not the cause: an
    existing page was worse than the new one.
  - **Change.** One declaration, `min-width: 0` on the current crumb, with a dated comment.
    Mobile now truncates with an ellipsis and the document is 375px wide; desktop still shows
    the title in full.
  - **Checks.** Build, links (2,798 across 57 pages) and schema pass. Measured before and
    after on the worst page, a guide, an event page and the homepage; inspected at 375px and
    1440px; no console errors.
  - **Parked, not dropped.** The guide that found this - in-house day versus open cohort, the
    group-seat buyer's question, where every competing page is an in-house trainer selling a
    private day - is written and held in the scratchpad. It ships next cycle, alone. Two
    unrelated changes in one commit would have made either one harder to revert.
  - **Search Console: attempted, unavailable.** The Chrome extension was blocked from reading
    the page on three attempts. The 00:47 reading (through 6 Oct) stands; nothing estimated.

- **2026-10-11 (00:47 local cycle, first firing of the restored schedule) — The About page now
  says the business is independent of the University.**
  - **The gap.** "Oxford Agentic is independent - no affiliation with the University of Oxford"
    was on the homepage FAQ, the privacy page and `llms.txt`, but not on `/about/`, the page
    whose own comment calls it the entity anchor. A third-party event directory
    (aieventlist.ai) had taken the trouble to state it about us before we stated it there.
  - **Change.** One paragraph in the story section, wording copied verbatim from the homepage
    FAQ so the two cannot drift, with a dated note explaining why.
  - **Checks.** Build, links (2,798 across 57 pages) and schema pass. Inspected at 375px and
    1440px, no console errors. The only em dashes in the built page are in JavaScript
    comments, not copy.
  - **Search Console (fresh, through 6 Oct).** 116 clicks, 1.73k impressions, 6.7%, position
    14.9. No step-4 change; see the baseline log. `/bootcamps/` CTR rose on its own from 1.7%
    to 2.4%, which supports the 7 Oct decision not to rewrite its title.
  - **Off-page, found by probe rather than by submitting anything:** two directories already
    list Cohort 3. One is accurate; foundercal calls it a London workshop. Both give Worcester
    College's postcode as OX1 2JL - **the college's own site says OX1 2HB, which is what our
    files say**, so ours is right and should not be "corrected" to match them. EnSpire Oxford's
    What's On calendar lists no Oxford Agentic events. Both added to the review list.
  - **Deliberate deviation, flagged:** the rule says do not commit when nothing ships. The
    evidence above is committed anyway, because holding it in a scratchpad has already lost a
    cycle's notes once. The site change is the independence paragraph; the rest is the record.

- **2026-10-09 (Drummond's request) — "Who runs it" taken off the About page.**
  - **Why.** Drummond: the site should read as a team, not one person's operation. The band
    had only been visible since 7 Oct, when the broken `speakers` collection read was fixed.
  - **Change.** `SHOW_HOST_BAND = false` in `about.astro`, with a dated note. The markup is
    kept, not deleted, so it is one word to turn back on. Meta description now says "Who is
    behind Oxford Agentic" rather than "Who runs".
  - **Caught while shipping.** The hidden band was still taking a turn in the colour rhythm,
    so the story and venue bands both came out cream. Fixed: a band that does not render no
    longer consumes a slot.
  - **Deliberately kept.** The Person node in `/about/`'s schema. It is entity wiring for
    search and answer engines, not a visible claim, and removing it would weaken how the
    business is identified. Flagged to Drummond rather than decided silently.
  - **Checks.** Build, links (2,798 across 57 pages) and schema pass. Bands alternate again
    (dark, cream, dark, gold). Inspected at 375px and 1440px, no console errors.
  - **Left alone.** The Coding Bootcamp's own "Who runs it?" FAQ already names three people,
    so it reads as a team already.

- **2026-10-07 (22:35 local cycle) — The About page has been missing "Who runs it" entirely.**
  - **The bug.** `about.astro` read `getCollection('speakers')`. That collection does not
    exist - it became `team` when the team page was built - so the read returned nothing,
    `host` was always undefined, and the whole band was skipped: photo, role, bio and
    LinkedIn, on the one page the file's own comment calls the entity anchor. Astro logs a
    warning rather than failing, and CI treats it as noise, so it shipped and stayed shipped.
  - **How it surfaced.** Not from a probe. The line `The collection "speakers" does not exist
    or is empty` has been in every build log this loop has run for weeks, and this cycle
    followed it instead of filtering it out.
  - **Change.** One read, `speakers` to `team`, with a dated comment. The host band now
    renders, and `/about/`'s Person node gains jobTitle, description, worksFor and the
    LinkedIn `sameAs` - before, it was a bare name, @id and url.
  - **Checks.** Build, links (2,798 across 57 pages) and schema pass, and the warning is gone.
    Inspected at 375px and 1440px. No other page changes.
  - **Search Console (fresh, through 4 Oct).** 112 clicks, 1.68k impressions, 6.7%, position
    15.1. No step-4 title change: `/bootcamps/` is page one with 1.7% CTR, but the one
    precedent for rewriting a hub title made CTR worse. Detail in the baseline log.
  - **Local debris, untouched.** `src/content/team/` holds Finder duplicates
    (`adam-martin 2.md` and two more, plus seven duplicated photos). All untracked, none on
    the live site, and the build ignores them. Left for Drummond rather than tidied away.

- **2026-09-30 (session, Drummond's request) — The Google Ads account's own tag is now on
  every page.**
  - **Why.** The AW tag inside GTM (`AW-18382942196`) belongs to a different Google Ads
    account. Account 330-502-6991, which runs the campaigns, uses `AW-18383990238` and
    could not see the site: its £250 conversion-tracking credit (due 3 Oct) was stuck on
    "Place your Google tag across your website", and no tag-based conversion or
    remarketing list could work.
  - **Change.** `config.analytics.googleAdsTagId: 'AW-18383990238'`; `BaseHead.astro`
    loads `gtag/js` for it and calls `config`, directly after the Consent Mode defaults and
    before the GTM snippet, so it starts denied like every other tag. GTM and the other
    account's tag inside it are untouched.
  - **Do not** remove it or move it into GTM without first confirming the container tag
    is `AW-18383990238`. Do not move it above the consent defaults.

- **2026-09-30 (session, Drummond's request) — Custom analytics events now actually reach
  GA4, and every click through to Luma sends `luma_booking_click` for Google Ads.**
  - **Why.** Google's £250 conversion-tracking credit needs one recorded conversion by
    3 Oct. The "Luma booking click (GA4)" conversion in Google Ads had recorded nothing
    since 3 Sep, and GA4 showed no `luma_booking_click` in 28 days despite paid clicks.
  - **Two separate faults, both verified live 30 Sep.**
    1. GA4's automatic outbound `click` never fires for Luma links, because `luma.com` and
       `lu.ma` are cross-domain measurement domains. The GA4 custom event built from it
       therefore could never trigger.
    2. **This reverses cycle 80 (17 Aug), which recorded the funnel as "instrumented and
       working".** It was not. GA4 loads through GTM, and a page-level
       `gtag('event', name)` with no `send_to` is pushed to the dataLayer and then dropped.
       GA4 had received none of `register_section_viewed`, `luma_outbound_click` or
       `luma_embed_interacted` in 28 days. A live probe produced a `/g/collect` hit only
       once `send_to` named `G-3YJV42CLBC`.
  - **Change.** New `src/lib/track.ts` is the one dispatcher; it sets `send_to` from
    `config.analytics.ga4MeasurementId` (read from `data-ga4-id` on `<body>`).
    `Base.astro`, `find-your-bootcamp.astro` and `Assistant.astro` use it instead of their
    own copies. `Base.astro` also sends `luma_booking_click` (`link_domain`, `link_url`
    without query string, `event_slug`) on any click to a Luma link. Event names are
    unchanged otherwise.
  - **Do not** remove `send_to`, reintroduce a local `track()` that calls `gtag` without
    it, or rename `luma_booking_click`: the Google Ads conversion imports that exact name.
  - **Checks.** Build, links and schema pass (53 pages). Headless click test: Book button
    emits `luma_outbound_click` and `luma_booking_click` with `send_to`; a bare `lu.ma`
    link emits `luma_booking_click`; a non-Luma link emits nothing.

- **2026-09-29 (session, Drummond's request) — "Ask Drummond" taken off the site until it
  has been further tested.**
  - **Change.** `features.assistant: false` in `site.config.ts`, which removes the
    launcher, its script and the privacy page's `#assistant` section from every page.
    `assistant.previewOnly: true`, so when it is switched back on only a tab opened with
    `?assistant=preview` sees it. The component, the `@elevenlabs/client` dependency and
    the ElevenLabs agent are untouched, so it comes back with one line.
  - **Checks.** Build, links and schema pass (52 pages). No built page contains
    `data-assistant` or the agent id, and none loads the assistant script or the
    ElevenLabs SDK. Astro still writes those two unused files to `_astro/`, because
    `Base.astro` imports the component; nothing references them.

- **2026-09-29 (session, Drummond's request) — "Ask Drummond": an AI version of Drummond on
  every page.**
  - **Change.** New `Assistant.astro` (bottom-left launcher and panel, text or voice in his
    ElevenLabs voice clone), `features.assistant` and `assistant` in `site.config.ts`,
    `@elevenlabs/client` as a lazily loaded dependency, and a new "The Ask Drummond
    assistant" section on the privacy page. Shipped behind `previewOnly` first, checked on
    the live site, then opened to everyone.
  - **Agent.** ElevenLabs `agent_9501m3p6649hfjpsve5qzzv0jexv`. Knowledge is this site's
    `llms.txt` and `llms-full.txt` only. Never states prices or personal information and
    sends money questions to the event page; twelve ElevenLabs tests pass (STATE.md).
  - **Checks.** Build, links and schema pass; `check:flags` passes with 7 flags. Lighthouse
    run locally: performance 100 on all three budget pages, accessibility 100/100/95 as
    before. The SDK chunk (148KB gzipped) is never requested until a visitor sends a
    message or presses Talk; the per-page cost is a 4KB script. Launcher inspected at
    1440px and 390px, on the hero, a cream band and an event page with the booking bar.

- **2026-09-25 (19:10 local cycle) — Pointed the tools guide at the Coding Bootcamp.**
  - **Evidence.** `claude-cowork-claude-code-or-codex` ends its non-developer section with
    "skip Claude Code until you have a reason". Since this morning that reason has a day
    attached to it, and the guide is the single page on the site whose reader is most likely
    to be the Coding Bootcamp's buyer. Before the change, nothing in any guide's body linked
    to the new programme; the only paths in were the nav and the new guide.
  - **Change.** Two sentences and a related-programme reference in that one guide: the reason
    to reach for Claude Code is wanting to build something rather than automate something,
    linking the new `why-the-code-an-agent-wrote-is-not-live` guide, and a closing pointer to
    the Coding Bootcamp on 26 November. The guide's original argument is untouched.
  - **Checks.** Build, links (2,562 across 52 pages) and schema pass. Inspected at 375px and
    1440px. Dev-server console shows ERR_CONNECTION_REFUSED from Astro's own dev tooling; the
    page's assets return 200 and the live page is the gate.
  - **Search Console (fresh, through 23 Sept).** 95 clicks, 1.37k impressions, 6.9% CTR. Same
    picture as 21 Sept: brand queries converting, the Oxfordshire and Hertfordshire services
    cluster and a Danish IBM course making up the low-CTR impressions. No step-4 change.
  - **GEO.** Two probes. The git/terminal candidate is **not winnable** (GitHub docs,
    Codecademy, a university library) and was dropped. "Workflows or software, which bootcamp"
    is winnable and converting: that is tomorrow's guide, since today's cap is used.
  - **Date check.** No stale "15 October" anywhere: Cohort 3's move to 19 November was carried
    through the Cohort 1 and 2 FAQs and the cohorts guide by the session that made it.

- **2026-09-25 (18:50 local cycle) — First guide for the Coding Bootcamp, aimed at the gap
  answer engines currently hand to app-builder vendors.**
  - **Context.** Another session shipped the Coding Bootcamp programme and Cohort 1 event
    today (01ceb38) and moved Agentic Cohort 3 to 19 November (5dadcb3). Both are live. This
    cycle adds the supporting guide Drummond asked for, and invents nothing about the day:
    every fact comes from those files, which come from Luma.
  - **Evidence (GEO, credits restored).** Four probes. "In-person agentic coding bootcamp UK"
    already cites the homepage #1. "Can a non-developer actually ship a real app with Claude
    Code or Codex" cites ten pages, **all of them app-builder vendors** arguing the same
    thing: the agent writes code, you still need repository, hosting, database and domain, so
    use our platform instead. Nobody answers it for someone who wants to own the result.
    WINNABLE (no institutional owner) and CONVERTING (that searcher is this bootcamp's buyer).
  - **Change.** New guide `why-the-code-an-agent-wrote-is-not-live`: the six things between
    working code and something live (repository, undo, hosting, memory, secrets, a check),
    an honest treatment of the builder trade-off (faster, but you own less), and the order
    that works. No statistics, no quotes from truncated extracts, no claims about the day.
  - **Checks.** Build, links (2,559 across 52 pages) and schema (5 Event, 9 FAQPage, all
    titles unique) pass. Capsule 69 words, description 149 chars, seoTitle 37. Inspected at
    375px and 1440px. Guides this week: 1 of 3.
  - **Still not verifiable:** the Saïd start-date sentence in `when-ai-executive-cohorts-run`
    is dated 31 Aug; sbs.ox.ac.uk returns 403 to direct fetches, so it stays as a dated claim.

- **2026-09-23 — Cohort 3 moved to Thursday 19 November (Drummond's request).**
  - Luma (`luma.com/oxfordagentic3`, read 23 Sep 2026) now shows 19 Nov 2026, 09:00-17:00
    Europe/London, still Worcester College. Supersedes the 15 October date everywhere.
  - Changed: Cohort 3 event dates (now `+00:00`, GMT after clocks change), summary, capsule
    and transfer assurance; Cohort 1 and 2 FAQs and capsule; four guide CTAs; the
    `when-ai-executive-cohorts-run` guide now says the online/in-person choice recurs in
    November (Oxford's online programme starts 11 Nov). OxGen clash note in
    `outreach/review-list.md` marked resolved.

- **2026-09-23 (20:40 local cycle) — Cohort 2 moved into the past across the site.**
  - **Why it mattered.** Nothing had deployed since 15 Sept, and the site is static, so a
    week after the day ran the live pages still showed Cohort 2 as an upcoming event with a
    "Join the waitlist" button, and every header CTA pointed at it. `effectiveStatus` derives
    "past" from `endDate`, but only at build time. **A quiet site goes stale on its own.**
  - **Change.** Cohort 2's `status` is now `past`; its capsule and summary are past tense and
    record that it sold out (Luma, 13 of 14, verified 15 Sept); its seven booking-era FAQs are
    replaced with the three a past page needs (has it run, what to book now, what Cohort 1
    built). The Cohort 1 FAQ and `when-ai-executive-cohorts-run` now say Cohort 2 ran and
    Cohort 3 runs. **No outcomes are claimed** - nothing about the day has been confirmed.
  - **Site-wide effect.** Every header and footer CTA, the homepage cards and `llms.txt` now
    point at Cohort 3 (15 Oct). 48 pages rebuilt; that is the intended blast radius.
  - **Checks.** Build, links (2,172) and schema (4 Event, 7 FAQPage) pass. Cohort 2 renders
    "This event has run", no sticky bar, no waitlist button anywhere, and a Cohort 3 CTA;
    schema matches Cohort 1's past-event shape. Inspected at 375px and 1440px.
  - **Search Console (fresh, through 21 Sept).** 89 clicks, 1.3k impressions, 6.9%, position
    17.1. `/bootcamps/oxford-agentic-bootcamp/` reached page one (9.9) but only 14 of its 137
    impressions carry a named query, so its 1.5% CTR cannot be diagnosed. No step-4 change.
  - **GEO: none.** The Perplexity API is out of credits (401, insufficient_quota). Recorded
    rather than worked around.
  - **Backlog.** Homepage meta description is 166 chars against a 160 target (build warning,
    not blocking). Left for a cycle that is changing the homepage anyway.

- **2026-09-15 (18:40 local cycle) — Marked Cohort 2 sold out, matching Luma.**
  - **Evidence.** Luma, read 15 Sept 18:37 BST: the only ticket type (Full Day Pass, 13 of 14
    sold) stopped selling at 17:00:59 BST; `registration_availability` "sold-out",
    `sold_out` true, waitlist enabled. The live site still said "Book your place" and the
    Event schema said `InStock`, which was no longer true.
  - **Change.** `status: soldout` in the Cohort 2 event file, with a dated comment. Existing
    templates do the rest: buttons read "Join the waitlist" / "Waitlist" (Luma now offers
    exactly that), the event card on `/`, `/events/`, the bootcamp page and 404 reads "Join
    the waitlist", and `offers.availability` is `SoldOut`. Cohort 3 stays `InStock`. The event
    turns `past` on the first build after 16 Sept 17:00.
  - **Checks.** Build, links and schema pass (48 pages, 4 Event). Output diff limited to
    those cards and buttons, the Cohort 2 JSON-LD, llms-full and sitemap lastmod. Inspected
    locally at 375px and 1440px. The 2px width difference at 375px is the emulator's
    scrollbar gutter: the live page before this change measures identically.
  - **Search Console (fresh, through 13 Sept).** 75 / 1.09k / 6.9% / 18.9. No page qualifies
    for a step-4 change; see the baseline log.
  - **Also in this commit:** Search Console readings for 14-15 Sept, GEO rows from six cycles
    (14 Sept 12:40 to 15 Sept 18:40) logged while nothing shipped, and whatisai.co.uk added to
    the off-page review list.

- **2026-09-14 (06:40 local cycle) — Made the in-person guide answer the balanced question
  answer engines are asked.**
  - **Search Console.** Not read: Claude in Chrome was not connected on the one attempt. The
    00:40 reading (same session) matched 18:40 exactly, data ending 11 Sept.
  - **Evidence (GEO).** "Is in-person AI training better than online courses for senior
    leaders" cites 10 pages, none ours, though `why-in-person-beats-online-for-learning-ai` is
    indexed. Every cited page gives a two-sided answer; ours argued one side. Probe: WINNABLE
    (small providers plus one exec-ed school) and CONVERTING (choosing a format for leaders).
  - **Change.** Capsule now opens with the senior-leader answer and names what online does
    better. New section "When online is the better choice" (concepts not a build; spread-out
    team; already building), linking `ai-bootcamp-vs-course-vs-exec-education`. No
    statistics, prices or outcomes added. `updatedDate` 14 Sept.
  - **Checks.** Build, links and schema pass (48 pages, 2,220 internal links). Capsule 61
    words (limit 75). Output changes limited to this guide, the Guides index date, sitemap
    lastmod, RSS and llms-full. Canonical unchanged. Inspected locally at 375px and 1440px.
  - **Not shipped, flagged.** Cohort 2's only Luma ticket (Full Day Pass) stops selling at
    12:00 BST today; the site has no "sales closed" state. Awaiting Drummond.
  - **Also in this commit:** GEO rows from the 00:40 no-ship cycle, and OxGen AI Summit
    (15-16 Oct, same day as Cohort 3) added to `outreach/review-list.md`.
  - **Re-check.** Put the same question to Perplexity after it re-crawls (two to three weeks).

- **2026-09-13 (18:40 local cycle) — Homepage-only sources now ping `/`, not the whole site.**
  - **Search Console.** Reachable; read the 3-month view (the property's whole history) from
    raw accessibility-tree rows. No new data since the 16:00 reading (chart still ends 11 Sept,
    "Last update: 7 hours ago"), and that reading was already acted on (`/events/` title). No
    second change off the same data, so step 5 applies.
  - **Change.** `scripts/indexnow-ping.mjs`: `src/lib/home.ts` and
    `src/components/HomeSections.astro` map to `/` only. HomeSections also renders
    `/home-photos/`, which is noindex and not in the sitemap. Closes known candidate (1).
  - **Why this over alternatives.** Candidate (2) waits for 16 Sept; (3) was done at 13:15;
    (4) GEO found no winnable gap (below). Homepage FAQ edits are the most frequent kind of
    change, and each was submitting 44 URLs where one changed.
  - **Checks.** Dry-run: `home.ts` → `/`; `HomeSections.astro` + docs → `/`; `home.ts` + a
    guide → `/`, the guide and `/guides/`; `home.ts` + `schema.ts` → whole site; docs and this
    script → nothing. Build, links and schema pass. No page output changes, so this deploy
    should submit nothing to IndexNow.
  - **GEO (5 questions, `seo-data/geo-citations.md`).** Second Brain cited #1 for "in-person
    course UK" and "workshop Oxford"; not cited for tool-led DIY phrasing. The IT/legal and
    Cowork/Code/Codex guides are not cited; both fields are vendor-dominated, so no Q&A block.
  - **Off-page.** Nothing credible to add; results were competitors, not listing sites.

- **2026-09-13 (16:00 local cycle) — Gave the events hub a title that says what is on it.**
  Run on Drummond's request to test the local loop end to end.
  - **Evidence (Search Console, 28 days 15 Aug to 11 Sept, read 13 Sept from raw rows).**
    Data now runs one day later than the morning reading. Site: 46 clicks, 724 impressions,
    CTR 6.4%, position 12.7. Pages with meaningful impressions and weak CTR:
    `/events/oxford-agentic-bootcamp-cohort-2/` 117 impr, 0.9%, pos 7.2;
    `/bootcamps/oxford-agentic-bootcamp/` 95 impr, 2.1%, pos 11.0; `/guides/` 83 impr,
    1.2%, pos 11.9; `/events/` 82 impr, 1.2%, pos 10.0.
  - **Why `/events/`.** Cohort 2's attributed queries are the brand course query, where the
    homepage ranks higher and takes the click, and its sales close 14 Sept, so a change there
    has days of value. The bootcamp page's 2.1% is roughly normal for position 11, and its
    few attributed queries are brand or an unrelated IBM course. `/events/` sat on page one
    with the title "Events - Oxford Agentic", which tells a searcher nothing, and it is the
    hub for Cohort 3 and Second Brain Cohort 1, both with no bookings yet.
  - **Change.** `<title>` (and og/twitter title, WebPage name) is now "AI bootcamp dates in
    Oxford - Oxford Agentic". True whether or not a cohort is open, since past cohorts keep
    their dates. H1, description, canonical and breadcrumbs unchanged. No dates in the title,
    so nothing to go stale.
  - **IndexNow.** `scripts/indexnow-ping.mjs` sent the whole sitemap for any `src/pages` edit.
    A static page file now maps to its own URL, kept only if it is in the sitemap. Dry-run:
    events index → `/events/` only; `about.astro` → `/about/`; `index.astro` → `/`;
    `home-photos.astro` (noindex) → nothing; `[slug].astro` and `src/lib/*` → whole site as before.
  - **Checks.** Build, links and schema pass (48 pages; titles unique). Only
    `dist/events/index.html` changed. Inspected at 375px and 1440px locally: no overflow,
    no console errors. Pre-existing, not touched: homepage meta description is 166 chars.
  - **Re-check.** Compare `/events/` CTR over the 28 days to about 11 Oct against 1.2% at
    82 impressions. Too small a sample for a firm verdict; look for direction only.

- **2026-09-13 (13:15 local cycle) — Stopped inventing a ticket on-sale date in event
  structured data.** This is the first cycle of the local 6-hourly loop, which replaced
  the cloud routine: that routine is paused because it had no GitHub write access.
  - **Evidence.** `eventSchema` set `offers.validFrom` to `new Date()`, so every build
    stamped the build time into all four event pages' Offer and told search engines tickets
    had just gone on sale. That was an invented date. Luma publishes no on-sale date for the
    Full Day Pass on any event (`valid_start_at: null`), so these are not date-restricted
    offers, and Google only asks for `validFrom` on date-restricted offers.
  - **Change.** Removed `validFrom`. A comment records why, and to restore it only from a
    real Luma `valid_start_at`.
  - **Checks.** Build, links and schema pass (48 pages, 4 Event, 7 FAQPage). No `validFrom`
    left in dist. Only the four event pages changed, and their visible HTML is byte-identical
    outside the JSON-LD. Builds are now deterministic: the same page is identical across two
    builds.
  - **Search Console.** Reachable, but data still ends 10 Sept, identical to the morning
    reading. No fresh data, so step 4 does not apply.
  - **GEO.** Started `seo-data/geo-citations.md`: cited 2 of 3 buyer questions, not cited on
    the national "one-day AI workshop UK" query. Perplexity served a stale About-page copy.
  - **Off-page.** Started `outreach/review-list.md` with Daily Info. Nothing submitted.
  - **IndexNow note.** `src/lib/schema.ts` is shared code, so this deploy pings the whole
    sitemap although only four pages changed. The script cannot map shared code to specific
    pages. Pre-existing behaviour, recorded rather than worked around.
  - **Still open from the cloud run:** mapping `src/lib/home.ts` to `/` only in the IndexNow
    script. Deferred to keep this cycle to one change.
  - Seen in Luma data, for later: Cohort 2's Full Day Pass sales close 14 Sept 2026 at
    12:00 BST (`valid_end_at`).

- **2026-09-13 — Drummond answered the buyer questions. Recorded here, and the safe ones
  are published.**
  - **Refunds: none.** Added "Tickets are not refundable, but your place transfers to a
    future cohort at no charge" to the date question on the homepage, both programme
    pages and the Second Brain event page. The Cohort 2 and 3 event pages were left alone:
    they no longer carry that FAQ, and the transfer assurance sits under their form.
  - **Invoices: yes.** Added to the homepage cost answer, via hello@oxfordagentic.com.
    **VAT treatment was not answered, so it is not mentioned.**
  - **Dietary and access needs: "attendees asked in advance".** Added to the Agentic
    programme's lunch answer. **Step-free access at either venue is still unanswered, so
    it is not claimed.** Not added to Second Brain pages, which make no lunch claim.
  - **Second Brain size: "small group".** New Second Brain programme FAQ: "Small, and
    capped." No number.
  - **Certificate: not yet confirmed, maybe in future.** Not published (see backlog 18).
  - **Guest speakers: "same as Cohort 2".** Cohort 3's agenda already mirrors Cohort 2's,
    and neither names the guest sessions. Nothing changed.
  - **Consultancy: considering it, but does not want to dilute the offer.** Do not target
    the `agentic ai providers/consultants/services oxfordshire` cluster. Do not build
    services content.
  - **Still open for Drummond:** a Nicolai Thomson profile URL, a LinkedIn Company Page,
    Bing Webmaster verification, VAT treatment, and step-free access.

- **2026-09-13 — IndexNow now pings only once the deploy is confirmed live (Drummond
  approved).** Previously the ping job ran on build success, so it could ping after a
  genuinely failed deploy. It still runs on build success, so a deploy that published
  but timed out on GitHub's status poll keeps its ping. But it now pings only after
  `https://oxfordagentic.com/build.txt` serves the pushed commit's SHA, polling for up
  to 15 minutes. The build writes `dist/build.txt`, which is not a page and not in the
  sitemap.
  - Also: `.github/` changes and the `scripts/check-*` and `indexnow-ping` scripts no
    longer count as template-wide. A CI-only commit used to ping the whole sitemap.
  - Known edge: if a second push supersedes the first before the first is seen live,
    the first job skips its ping and the second pings only its own changes.

- **2026-09-13 — Position unblocked, no CTR gap, one guide shipped.**
  - **Search Console position is readable.** Click the Average position metric card,
    then `read_page` (not `get_page_text`) returns every row's position. This resolves the
    6 Sept escalation. Full table in the baseline file.
  - **No impressions-vs-CTR gap exists to fix** (see baseline). The only page-1
    zero-click query is Saïd's programme name at 10.0, left alone on principle.
  - **Flag for Drummond: a local services cluster**
    (`agentic ai providers/consultants/services/companies oxfordshire`, positions 21-70).
    The searchers are hiring a provider. The capture would be location pages, which are
    banned, and it is the wrong buyer for a training day. Recorded, not built.
  - **Shipped `getting-an-ai-workflow-past-it-and-legal`** (in-practice). Probe: every
    ranking result is written for the approver - CISO checklists and security vendors -
    and nothing is written for the manager who has to ask. That manager is the
    governed-adopter buyer, and the topic is a named Cohort 3 curriculum item ("the
    security and stakeholder questions that decide whether it sticks"). No overlap with the
    pilot guide (ownership and success criteria) or the public-sector guide (what
    governance permits). Unsourced generalisations removed before shipping. No regulation
    named beyond "data protection law applies".
  - Repo checked before work because another session pushed homepage micro-interactions on
    11-12 Sept. It was clean: no locks, no uncommitted foreign changes, nothing new for 25h.

- **2026-09-12 — Micro-interactions phase 8, homepage (Drummond: "create more micro
  interactions on the homepage then ship").** Seven more, this round about the moments
  between sections - attention hand-offs and orientation - rather than the components
  themselves. Plus one bug found and fixed on the way.
  (a) **The primary CTA sends out one quiet echo of its outline** 1.25s after load, once
  the entrance has settled, so the eye that has just read the headline is drawn to the
  one thing the page wants done. Once, 900ms, low opacity, never under reduced motion.
  (b) **Attention hand-off to the header**: the first time the hero's buttons scroll off
  the top, the header CTA's arrow nudges once. Observed once and disconnected; the class
  is removed on animationend so it can never stick. Only on pages with a full hero.
  (c) **The three "Why" cards acknowledge attention without promising a click**: no lift,
  no gold edge (they are not links), but the gold squares grow a touch one after another
  down the list, reusing the stagger the reveal already keys to position. Pointer only.
  (d) **Homepage quote cards: the attribution follows the words in** a beat behind, so
  the quote lands first and the name arrives to sign it.
  (e) **An opened FAQ answer that is cut off scrolls itself into view** (`block:
  nearest`), only for toggles the visitor caused, so the item open on load never moves
  the page. Verified: an item 9px below the fold opened and settled exactly on it.
  (f) **The back-to-top button's edge fills clockwise with scroll progress** - a conic
  gradient behind an ink face inset 1px - so it also answers "how much is left". Hover
  fills the face gold.
  **Bug found while verifying (f):** the button's 1px sentinel + IntersectionObserver
  never fired when a jump (anchor link, keyboard End, a test's scrollTo) carried the
  sentinel past the viewport in one step, because its intersection state never changed.
  The button now shows from the same passive, rAF-throttled scroll handler that paints
  the progress; sentinel and observer removed. Behaviour on ordinary scrolling is
  unchanged.
  (g) **The header hairline draws in from the left** when the header sticks, the way the
  signature rule above a title does, rather than fading up in place.
  _Verified_ in headless Chrome: echo opacity sampled 0 until 1.2s, 0.45 at 1.4s, 0 by
  2.2s; hand-off class present with `cta-nudge` running at 900px scroll and removed
  after; squares scale 1.4 with 0/70/140ms delays on hover, none at rest; attribution
  opacity 0 (260ms delay) before reveal, 1 after; header hairline scaleX 0 at top, 1 when
  stuck; button hidden at top, shown at y=3000 with --p 0.512, hover face gold. Two
  earlier readings were false negatives caused by the consent banner covering the bottom
  of the viewport in the test - decline it before testing anything down there. Local
  Lighthouse on the final build, nine runs, all assertions passed: home 100/100/100,
  LCP 324-327ms; event 100/100/78 (Luma, accepted), LCP 344ms; guide 100/95/100, LCP
  365-366ms; CLS 0 everywhere. Build clean: 2164 links, 47 pages of valid schema.

- **2026-09-11 — Micro-interactions phase 7, homepage (Drummond: "add more micro
  interactions on homepage").** Seven additions on the homepage's own surfaces, plus
  one bug found on the way.
  (a) **The hero recedes as you scroll on** - its words rise a little faster than the
  band and dim to 35%, so it recedes rather than sliding off like a sheet of paper.
  Scroll-driven CSS (`animation-timeline: view()`, range `exit`), no listener, nothing
  at scroll 0 so LCP is untouched; off under reduced motion and without support.
  **Found while verifying:** it never moved, because `.hero` used `overflow: hidden`,
  which makes the hero a scroll container and pins the view timeline to it. Switched
  to `overflow: clip`, which clips the motif identically and creates no scroll
  container. The divider numeral's drift (phase 5) was re-measured at the same time
  and does progress (+12.6px entering, -12.6px exiting).
  (b) **Section heads arrive in reading order**: the rule draws (existing), then the
  heading 120ms later, then the standfirst at 220ms. The block still fades as one.
  (c) **Event card separator squares grow in** one after another as the card reveals,
  the rhythm the bullet squares keep. Without a revealing ancestor they are simply
  there.
  (d) **Programme rows draw a 3px gold rule down their left edge** on hover and
  keyboard focus, the signature dash turned on its side.
  (e) **Event card arrows lengthen their shaft** behind the head as they nudge, so the
  movement reads as reaching rather than sliding. The hairline sits on the glyph's own
  shaft, which in Plex Mono is 0.17em below the box midline; first attempt sat on the
  midline and read as a double arrow, caught by a 4x screenshot.
  (f) **The open FAQ question holds the accent** while its answer is showing, so which
  item is open is legible from the line as well as the icon.
  (g) **Selection on the gold bands is now legible** - the sitewide gold selection
  vanished into the gold background, so those bands invert to ink behind cream.
  _Verified_ in headless Chrome: recede at 0.40 opacity / -37px at 450px scroll and
  0.35 / -40px at 900px; heading opacity 0 with 120ms delay before reveal and 1 after;
  separators scale(0) before reveal, none after; shaft 7.1px on hover; edge scaleY 1;
  open question bronze on cream; gold-band selection ink/cream. Local Lighthouse on the
  final build, nine runs, all assertions passed: home 100/100/100, LCP 323-327ms; event
  100/100/78 (Luma, accepted), LCP 344-345ms; guide 99-100/95/100, LCP 327-953ms; CLS 0
  everywhere. Build clean: 2123 links, 47 pages of valid schema.

- **2026-09-11 — Micro-interactions phase 6 (Drummond: "do more micro interactions").**
  Nine more, this time on the surfaces phase 5 left silent, each chosen because a
  visitor acted there and got nothing back. Same rules: transform/opacity only,
  reduced-motion-safe throughout, nothing on an LCP element.
  (a) **The consent banner rises in and settles out** (360ms) instead of popping. It
  is the first thing every new visitor sees move; it was the crudest transition on
  the site.
  (b) **The header dropdown's links follow the panel in** a beat apart, the rhythm the
  mobile menu keeps. Delays on the open state only, so closing is immediate.
  (c) **Agenda rows respond under the pointer** - the row's rule brightens to gold and
  the site's square marker grows in beside the time. Pointer devices only, since the
  rows are not links and a tap should not be misled.
  (d) **Stat tiles acknowledge the count landing** - when the counter reaches its
  number the tile's edge flashes gold and relaxes (720ms). Added by the counter in
  Base.astro, styled per page; never fires under reduced motion because the counter
  does not run there.
  (e) **Quote monograms stamp in** a beat after their card reveals, and the lead
  quotation mark drifts in from the left over the same reveal. Both key off the
  sitewide reveal class, so they inherit its keyboard safety net.
  (f) **Lazy photographs fade in as they arrive** rather than appearing half-drawn.
  Gated on a class the script adds in the same synchronous pass that marks images
  already complete, so nothing on screen can blink; a broken image is marked too so
  its alt text is never hidden. Eager images (heroes) are untouched.
  (g) **The sticky mobile "Book" bar parks** below the edge while the booking form or
  the final CTA is on screen, and returns after. A bar saying "Book" over the form it
  points at was noise, and on a phone it covered the bottom of the form. `inert` is
  set while parked so the off-screen button leaves the tab order.
  (h) **Filtered testimonials fade out before leaving the grid** and fade back in when
  re-selected, instead of a jump cut. Dormant for now: only one programme has
  consent-cleared quotes, so the filter does not render. Verified synthetically.
  (i) **"More guides" links answer like prose links** - bronze on hover, underline
  closing in.
  _Verified_ in headless Chrome (consent show/hide states, dropdown delays, agenda
  border and marker, all three stat tiles flagged, monogram 0.6/0 before reveal and
  1/1 after, lazy images hidden then loaded, bar parked and inert at the form and
  restored at the agenda, filter class fades in 220ms). Local Lighthouse on the three
  budget URLs, nine runs, all assertions passed: home 100/100/100, LCP 324-327ms;
  event 100/100/78 (Luma, accepted), LCP 344ms; guide 99/95/100, LCP 951-1021ms; CLS
  0 everywhere. Build clean: 2121 links, 47 pages of valid schema.

- **2026-09-11 — Micro-interactions phase 5 (Drummond's request: "add more micro
  interactions to delight the user").** Eight additions, chosen by walking every
  surface a visitor touches and asking what still answered nothing. All are
  transform/opacity-only, all inherit the global reduced-motion override or opt out
  explicitly, and the hero headline was deliberately left static because it is the
  page's largest contentful paint.
  (a) **The hero arrives in reading order** on first paint: eyebrow, then the gold rule
  draws in from the left, then the subline and the buttons rise, ~620ms with staggered
  delays. Full heroes only; compact interior heroes stay still as before.
  (b) **The hero grid catches the light under the pointer** - a second, brighter copy of
  the drifting grid is revealed inside a soft 190px circle that follows the cursor. It
  shares the motif's box and animation so the two grids stay in register. Pointer devices
  only (`hover: hover`), off under reduced motion and hidden behind a photograph.
  Coordinates are written once per frame via rAF; nothing runs while the pointer is
  elsewhere.
  (c) **Cross-page crossfade**, pure CSS (`@view-transition { navigation: auto }`), 220ms,
  with the sticky header given a `view-transition-name` so it holds still while the
  content beneath it fades. No client router, no script changes, unsupported browsers
  navigate exactly as before.
  (d) **The mobile menu now opens** rather than appearing: the two toggle bars fold into
  a cross, the panel settles in and its links follow a beat apart (35ms stagger).
  Closing waits 220ms before re-hiding the panel, with the timer cleared on every call so
  a quick reopen is never hidden by the close before it. Escape uses the same path.
  (e) **Openable cards answer typographically** - the eyebrow's tracking loosens from
  0.18em to 0.24em as the card lifts - and **tap feedback** on touch, where the lift
  settles under the finger (`:active`), the only acknowledgement a phone gets between
  tapping a card and the next page.
  (f) **The focus ring closes in** from 9px out over 240ms, so the eye is led to where
  keyboard focus landed rather than finding it already there.
  (g) **FAQ questions step forward 4px** under the pointer (pointer devices only, so a
  tapped question does not stay shifted), and **footer links draw the same gold hairline
  underline the top nav uses**, so the two navs answer a hover in one voice. Links that
  carry a date on a second line are excluded via `:not(:has(...))`.
  (h) **The gold divider numeral drifts with scroll** using a CSS scroll-driven animation
  (`animation-timeline: view()`) behind `@supports`: no listener, nothing per frame,
  still in browsers without support and under reduced motion.
  _Verified_ in headless Chrome rather than the browser pane, which throttles transitions
  badly enough that a 260ms toggle took several seconds to settle (same class of problem
  as the stale-computed-style note under cycle 16). Local Lighthouse on the three budget
  URLs: home 99-100 performance, LCP 325-925ms, CLS 0; event page unchanged at
  best-practices 78 (Luma cookies, accepted); guide page accessibility 95 from
  pre-existing contrast on the guide byline and the brand link's label mismatch, neither
  touched here and both inside the budget - worth a later cycle. `npm run build` clean:
  2121 links, 47 pages of valid schema.

- **2026-09-11 — Four new guides, two for Cohort 3 and two for Second Brain (Drummond's
  request).** Drummond asked for more pages after the loop had flagged that Second
  Brain's constraint is demand rather than ranking. Treated as his decision. The quality
  rules still applied: each topic probed against live search first, every fact sourced,
  no thin near-duplicates.
  - `where-the-human-goes-in-an-agentic-workflow` (in-practice). Results are vendor
    platforms and developer patterns; nothing plain-English for a business leader. It
    is also a named item on the Cohort 3 Luma curriculum. Goes well past the one
    sentence the scout-drafter-reviewer guide gives the human, and links to it.
  - `claude-cowork-claude-code-or-codex` (choosing). Crowded, but the searcher is the
    Agentic buyer: a non-coder choosing a tool. Luma's curriculum names these four
    tools. Product claims kept to what several September 2026 sources agree on.
    **Prices and benchmarks deliberately omitted** because they move monthly. The page
    is framed as a September 2026 snapshot. **Refresh it when a product changes.**
  - `is-it-safe-to-put-company-documents-in-a-second-brain` (in-practice). The
    governed-adopter objection, framed around storage rather than one-off pasting.
    **States no vendor's data policy.** The sources contradict each other and the
    terms change, so the page tells readers to read their own plan's terms instead.
  - `how-long-to-build-a-second-brain` (choosing). Every result says "a week of setup,
    do not build it in one sitting". The site's answer differs honestly: that figure
    describes an accumulated note-taking system, whereas this one is written from
    existing material in a day and then kept current by triggered updates.
  - **Calls to action link the event pages directly:** Cohort 3 (15 Oct, Worcester) and
    Second Brain Cohort 1 (21 Oct, Pitt Rivers). The wording is "Cohort 3 runs on 15
    October", not "the next date is". That keeps it true while Cohort 2 still has
    places, and after 16 September.
  - Fact corrections made before shipping: removed "one of the parts of the day we
    spend longest on" (no source), "in whichever tool suits it" (not confirmed),
    "belong to you" / "yours to keep" (ownership claims that may not hold for
    employees or under client agreements), and two generalisations about most people.
  - Second Brain now has six guides and the Agentic line fifteen.

- **2026-09-11 — Added Cohort 3 of the Oxford Agentic Bootcamp (Drummond's request).**
  Thursday 15 October 2026, 09:00-17:00, Worcester College. Luma `oxfordagentic3`,
  event `evt-fFS9i7ABiGVWPAC`. Facts taken from the Luma page, not assumed.
  - **Built as a copy of the Cohort 2 file**, because the two Luma descriptions are
    byte-identical once extracted - same programme, same hosts, same hours. Only the date,
    Luma IDs, capsule, summary and the transfer assurance changed. Agenda and FAQs carry
    over unchanged.
  - **Summary rewritten, not copied**, because the event page uses `summary` as its meta
    description and the schema check requires every description to be unique.
  - **Renders automatically** on the bootcamp page (upcoming runs and `hasCourseInstance`)
    and the events index, both of which read the events collection. The header CTA stays
    on Cohort 2 until 16 September passes, then moves to Cohort 3 on its own.
  - **Prose updated where cohorts are listed by hand:** the timing guide (now linking all
    three upcoming dates to their event pages), the Cohort 1 "has it run before?" FAQ, and
    the homepage venue FAQ.
  - Prices deliberately not added to the site. As with Cohort 2, pricing stays on the
    booking page.

- **2026-09-09 — STOP WRITING SECOND BRAIN GUIDES TO FIX RANKING. Ranking is not the
  constraint.** The Second Brain Bootcamp (21 Oct, Pitt Rivers) has **1 guest and 19 of
  20 seats unsold, six weeks out**. Full Day Pass £450 with 10 left, Early Bird £325 with
  9 left.
  - **It already ranks #1** for its commercial query in GB (verified 4 Sept), and it has
    **five supporting guides**. So the page wins its query and sells almost nothing.
  - **The reason is demand, not position.** Across the site's whole life Search Console
    shows exactly one second-brain query: `agentic second brain`, at **1 impression and
    1 click**. There is no second-brain search demand reaching this site to capture.
    Ranking first for a query nobody runs produces nothing.
  - **Therefore more Second Brain SEO content is low-value work**, and the loop was asked
    twice to produce it. Continuing to comply without saying this would have been quietly
    wasteful. The lever is demand generation through channels Drummond owns - the alumni
    list, WhatsApp groups, LinkedIn, direct outreach - not another guide.
  - **What the guides are still good for:** they are correct, they are cheap to keep, and
    they will matter if demand ever arrives. Do not delete them. Just stop adding to the
    pile expecting bookings.
  - Contrast for scale: Cohort 2 of the Agentic Bootcamp is **19 of 20 sold, one week
    out**. Same site, same SEO, wildly different result. Whatever is selling Cohort 2 is
    not the website's search position.

- **2026-09-09 — Search Console access to `oxfordagentic.com` is failing.** The property
  returned data normally on 6 Sept. Today the same URL gives **"Oops, you don't have
  access to this property"**, signed in as drummondgilbert@gmail.com.
  - **Not a browser or account fault:** Search Console itself loads fine and opened a
    different property of Drummond's (`findmyisland.com`) without complaint.
  - **Not a missing DNS record:** checked directly, and
    `google-site-verification=gWTPM5zaqp6Vr9cXAGM7vio-pcKKaGhvcoqspXzgDQM` is still
    published on oxfordagentic.com, alongside the SPF record. Nameservers are GoDaddy.
  - **Cause unknown and deliberately not guessed.** The record being present rules out
    the obvious explanation. It could be the property was removed from the account, a
    verification token rotated, or something transient at Google's end.
  - **Impact: this is the loop's primary input.** Step 1 of the standing instruction is
    to pull Search Console each cycle. Until access is restored the loop is flying on
    Luma numbers and site health only. **Drummond: check whether the property still
    exists in your Search Console account.**

- **2026-09-06 — Removed the UTM tags from every outbound Luma link. This reverses the
  "the UTM helper must stay" decision recorded under the CTA cycle above, and that
  earlier reasoning is now known to be wrong.**
  - **What the old note said:** untagged outbound links would "silently destroy the only
    working attribution this project has", so every CTA landed on
    `utm_source=oxfordagentic&utm_medium=website&utm_campaign=<slug>`. That was true when
    the only measurement was counting Luma referrals by hand. It stopped being true the
    moment paid search started, and it then inverted: the tags became the thing
    destroying attribution.
  - **Why it inverted.** oxfordagentic.com and luma.com are one funnel, and Google
    Analytics cross-domain measurement is configured for oxfordagentic.com, luma.com and
    lu.ma. A visitor from a Google ad arrives carrying a click id; cross-domain
    measurement is what carries it over to Luma so the ticket sale can be credited to the
    ad. **A UTM overrides campaign attribution in GA4**, so tagging the internal hop ended
    the ad session and opened a fresh one sourced to "oxfordagentic / website". The click
    id died at the domain boundary.
  - **The evidence, 6 Sept 2026.** GA4 (property `oxfordagentic.com`, last 30 days):
    10 purchases, £4,125 total revenue, of which Paid Search = **70 sessions, 0 key
    events, £0**, while 3 purchases worth £1,300 sat in **Unassigned** and 4 in Direct.
    In Google Ads, the conversion action `Luma ticket purchase (GA4)` — correctly built,
    imported from the GA4 `purchase` event, value from GA4, 90-day window, Primary on the
    Purchases goal — read **"Awaiting conversions"** while three Search campaigns spent
    £196 in seven days.
  - **The change.** `lumaUrlWithUtm(url, slug)` is gone, replaced by
    `lumaBookingUrl(url)` in `src/lib/site.ts`, which passes the URL through untouched.
    Call sites: `src/pages/events/[slug].astro` (hero, closing gold band, sticky mobile
    bar) and `src/components/LumaEmbed.astro` (the always-visible fallback link). Nothing
    else changed: the embed iframe is untouched, `luma_outbound_click` still fires on
    every CTA, and query parameters that belong to Luma — `coupon=` above all — are
    preserved, because the helper no longer rewrites the URL at all.
  - **The rule to keep.** UTMs are for INBOUND links from channels we do not own —
    LinkedIn, lemlist, newsletters, ad final URLs. They are never right on an internal hop
    between two domains that share one measurement setup. **Do not re-add UTM tagging to
    the Luma links.** The site-to-Luma step is already visible in GA4 as a path within a
    single session, and `luma_outbound_click` counts the clicks.

- **2026-09-06 — Probed the team angle, declined it, and found a positioning boundary.**
  Candidate: the shared/team second brain, which none of the five existing Second Brain
  guides answers and which a department head would plausibly ask.
  - **Fails both gates, hard.** *Winnable:* no. The query routes into enterprise
    knowledge-base SaaS - **Slack ranks on it**, alongside CustomGPT, fast.io and a row
    of RAG vendors. Slack writing about knowledge bases is the institutional-publisher
    case. A one-day workshop site does not outrank enterprise content marketing here.
    *Converts:* no. The searcher is procuring a platform, not booking a day of training.
  - **The finding worth keeping is a boundary, not a topic.** "Team second brain" in
    search vocabulary means *enterprise knowledge-base procurement*. The bootcamp's team
    proposition is real - the FAQ welcomes teams, and a colleague coming along means the
    approach goes back with two people rather than one - but **it must not be marketed in
    that vocabulary**, or it lands in a procurement fight it cannot win and attracts the
    wrong buyer. Sell the team angle as two seats on a day, not as a knowledge platform.
  - Three probes have now run since the Second Brain push began. One shipped
    (`what-second-brain-actually-means`), two declined. That ratio is the rule working,
    not the rule failing.

- **2026-09-06 — ESCALATION: the loop cannot reliably read Average position, and it has
  now cost something twice.** Backlog item 2 asks Drummond to export Search Console
  Performance CSVs into `seo-data/`. That has been open a long time and read as a
  nice-to-have. It is not.
  - **Cost one:** an earlier cycle nearly rewrote the finance guide's title as a "CTR
    fix" before pulling the position column showed it at 81.9. No title rewrite moves a
    click from page eight. The arithmetic caught it, but only just.
  - **Cost two:** the 5 Sept verdict criterion was phrased "still 43/77.3" and only the
    impressions half could be confirmed, because the Average position column will not
    surface through text extraction and the row-click filter does not apply. The verdict
    held anyway, but the criterion was half-tested.
  - **What this blocks:** step 1 of the loop's own standing instruction is "fix the
    biggest impressions-vs-CTR gap". That cannot be done properly without position,
    because a zero-click query at position 8 is a title problem and the same query at
    position 42 is not a problem the loop can touch. Right now there are several
    zero-click queries with real impressions - `agentic ai oxfordshire` at 22,
    `agentic ai for finance` at 22 - and **the loop cannot tell which are winnable.**
  - **The ask is small:** Search Console → Performance → Export → CSV, dropped into
    `seo-data/`. Two minutes, and it permanently unblocks the loop's primary job.

- **2026-09-06 — Verdict delivered on `when-ai-executive-cohorts-run`, one day late.**
  **The guide did not reach its target query.** 45 impressions, zero clicks, across six
  consecutive readings and twelve days, while the site around it went 28.3 → 20.6 on
  average position and 44 → 65 on clicks. Full detail in the baseline file.
  - **The loop missed its own deadline.** The commitment named 5 September; the 5th went
    on health checks. A one-day silent slip is the small version of the exact failure the
    pre-commitment was written to prevent, so it is recorded rather than quietly absorbed.
  - **The criterion was half-tested.** It was phrased "still 43/77.3", and only impressions
    were confirmed - the Average position column would not surface through text extraction
    on two attempts across two sessions. **Lesson for the next pre-commitment: phrase the
    trigger against numbers the loop can reliably read.** Impressions and clicks extract
    cleanly from the Search Console UI; position does not.
  - **A refresh does not rescue a query the page was never going to win.** The 31 Aug
    refresh added Saïd's verified dates and changed nothing here.
  - **Flat-clicks watch closed.** Clicks were 55 across two readings on 2 Sept with
    impressions growing; the test was whether they were still 55 on 4 Sept. They are 65.
    Calling it noise rather than a trend was correct.
- **2026-09-06 — Cohort 2 counters imply the cap moved to 20.** `guest_count` 16 → **18**,
  and both `spots_remaining` fields now read **2** (previously 1 on the ticket type and 3
  at event level). 18 + 2 = 20, where the earlier pair implied about 17. **Reading the
  counters, not the reason:** the loop does not know whether Drummond raised the cap,
  added a ticket type, or something else, and is not guessing. `is_sold_out` still false.

- **2026-09-04 — The Second Brain event already ranks #1 for its own commercial query.**
  Drummond asked twice for content to help it rank, so the loop probed the commercial
  query directly (`second brain workshop course UK in person one day`, GB). The bootcamp
  page **came back first**, above every competitor.
  - **This changes what "help it rank" means.** More top-of-funnel guides are not the
    lever for a page that already wins its own query. The remaining levers are the
    upstream questions (which the guides serve) and off-page entity signals, which are
    still blocked on Drummond - see backlog 2b.
  - **Two guide probes ran and both failed the gates.** (1) *How to give ChatGPT context
    about my business*: the setup-tutorial family again in different vocabulary, and
    worse, **OpenAI itself ranks for it** with its own Company Knowledge feature page.
    That is the institutional-publisher case backlog 9 says cannot be won and should not
    be tried. (2) The commercial query: no gap, we already hold it.
  - **What did pass: the term is overloaded, and every meaning is bookable.** Shipped
    `what-second-brain-actually-means`. Winnable because no provider writes the
    comparison (each only sells its own); converts because the searcher is at the
    booking-decision stage. It sends task-system buyers away on purpose.
  - **Competitive intel, from search extracts and therefore unverified** - open the
    sources before relying on any of it:
    - A UK provider runs full-day workshops where "second brain" means a task and
      attention system. Closest in-person UK competitor for the term, different problem.
    - A US instructor sells a short online "management second brain" workshop.
    - **Name collision: another operator uses the exact phrase "Second Brain Bootcamp"**
      for an online US programme. Worth Drummond knowing about for brand and search.
    - Also on the term: a gut-health workshop, and a Manchester IT consultancy trading
      under the name. Both harmless, both muddy the query.
  - Fixed while in there: the checker flagged Drummond's LinkedIn URL as redirecting on
    a trailing slash (`/in/drummondgilbert/` → no slash), on /404, /about and /bootcamps.
    One character.

- **2026-09-02 — Shipped a Second Brain guide on the failure query.** Drummond asked for
  more content to help the Second Brain event rank. `why-your-second-brain-stopped-getting-used`.
  - **This is the angle yesterday's declined probe pointed at.** The 1 Sept probe ruled
    out the whole "how to set up an AI second brain" family: tool-tutorial SEO owns it and
    the searcher wants install steps. The finding said a Second Brain guide has to sit on
    what the tutorials never answer. This is that question.
  - **Probe, both gates.** *Winnable:* yes, and materially more so than the setup query.
    No institutional publisher owns "why is my second brain not working" - the field is
    small AI-product blogs and Reddit threads, several of them thin content marketing
    for a tool. *Converts:* better than the setup query, though **not clean**. The
    searcher already built a system and is frustrated, which is the right shape, but
    r/productivity and r/PKMS in the results mean a real hobbyist contingent who will
    never buy a day in Oxford. **Mitigated by writing it for someone with work to do**
    - decisions, clients, recurring facts - rather than for PKM as a hobby. Watch this
    one: if it draws impressions with no engagement, the intent read was wrong.
  - **The angle is the site's own, not the field's.** Every competing piece diagnoses
    capture-without-review and prescribes either more discipline or an AI tool that
    auto-organises. This guide says the system failed because its only reader was you,
    and you were never going to do the reading, which is why swapping the reader (not
    the folders) is what changes the outcome. That sits directly on the existing
    vs-note-taking distinction rather than restating a competitor's diagnosis.
  - **Correction: there are four Second Brain guides now, not three.** The backlog said
    two. Already live before today: `what-goes-in-a-second-brain`,
    `second-brain-for-ai-vs-note-taking`, `keeping-a-second-brain-from-going-stale`.
    Checked the last of those in full to confirm no overlap - it opens by naming the
    graveyard problem and explicitly declines it to talk about decay, so the failure
    query was genuinely unanswered on this site. The two are cross-linked.

- **2026-09-02 — Cohort 2 is one seat from selling out.** Five sales in about a day.
  `guest_count` 12 → 13 → **16**, Full Day Pass `spots_remaining` 6 → 5 → **1**,
  event-level 8 → 7 → **3**. `is_sold_out` still false. £450, 13 days out.
  - Counters moved consistently across all three fields, so this is real rather than a
    Luma display quirk. Named guests appear in the payload too.
  - **The site copy was deliberately not changed.** "One seat left" is true right now and
    could be false within the hour; putting a volatile number into a static page invites
    a stale claim, which is exactly the failure the capacity rules exist to prevent.
    Luma already shows live remaining spots on the page people actually book from.
  - **This breaks the flat-sales read.** Cohort 2 had not moved between 28 Aug and
    2 Sept, and the loop had been treating slow sales as the standing condition. It was
    not. Do not build any argument on "Cohort 2 is not selling".
  - For Drummond: at one seat, the live decisions are whether to raise the cap, open a
    waitlist, or let it close. The loop will not touch any of those.

- **2026-09-02 — Cohort 2 took a booking.** `guest_count` 12 → **13**, ticket-type
  `spots_remaining` 6 → **5**, event-level 8 → **7**. All three counters moved together,
  so this is a real sale rather than a Luma display quirk. Previous sale was 28 Aug, so
  five days between bookings. **14 days out, 5 spots left on the ticket type**, £450,
  not sold out.
  - No site change caused this and none is claimed. The last two pushes were a ledger
    entry and a competitor-date verification, neither of which a buyer would ever see.
  - Search Console still ends at 30 Aug, so there is no way to tell whether this booking
    arrived through organic search. Do not attribute it.

- **2026-09-01 — Probed a Second Brain guide angle and declined to write it.**
  The ledger asks for new guides weighted toward Second Brain (2 against 13), so the
  candidate was the retrieval question: *how to use AI to search and use your own notes*.
  Probed before writing, per the 12 Aug hard rule. It fails both gates.
  - **Winnable?** Marginally, and not worth it. No institutional publisher owns the
    query, but the field is dense with tool-tutorial and listicle SEO - Obsidian plugin
    walkthroughs, Smart Connections, AnythingLLM, Taskade, Claude Code plus MCP setups,
    "11 best AI second brain tools". One guide does not outrank a category of blogs
    whose whole business is that query.
  - **Converts?** No, and this is the decisive one. Every top result is a free setup
    tutorial, and the searcher wants install steps: `ollama serve`, plugin settings,
    a vault folder structure. That is a tinkerer, not a senior leader who reads a lot
    and retrieves none of it. Traffic from it would be vanity.
  - **What this rules out:** the whole "how to build/set up an AI second brain" family
    of queries, not just this phrasing. The tool-tutorial field owns the *setup*
    question. If a Second Brain guide is to be written, it has to sit on a question the
    tutorials never answer - what to do with the thing once it exists, or why capture
    keeps failing for people who already have the tools - not on how to wire it up.
  - No guide shipped. Today's budget is spent on the probe, which is the correct
    outcome: guide count is not the metric.

- **2026-08-31 — Competitor re-probe (due ~30 Aug), and the Saïd date finally verified.**
  Their page 403s to `WebFetch` and to curl, which is why this sat unverified since
  24 Aug. Read it in the browser instead and got the whole passage rather than a
  snippet. **Start dates: 16 September 2026 and 11 November 2026.** Four weeks, online,
  £1,500. Three modules; module 3 "Hands-on with Agents" builds a simple agent and
  produces governance artefacts. Wooldridge and Holweg lead it. Audience is ops leaders,
  technology directors and senior consultants.
  - So the "unverified 16 Sept" recorded on 24 Aug was correct, and the secondary
    listings showing May/July cohorts were simply stale. **Method note: when a
    competitor site 403s, use the browser tools before recording a fact as unverifiable.**
  - **Their September cohort starts the same day our Worcester College day runs.** Not a
    clash, since theirs is four weeks online, but both market into the same window on the
    same words.
  - Refreshed `when-ai-executive-cohorts-run` on the back of it: the vague "comes round
    several times a year" is now the two actual dates with the date they were checked,
    and one restrained sentence on the 16 Sept coincidence. **This refresh does not
    contaminate the 5 Sept verdict** on that guide - the verdict measures impressions
    already banked at position 77.3, all of which predate today.
  - No new entrants found beyond The Oxford AI School (Witney, from £149), already logged.

- **2026-08-28 — Cycle 133: Cohort 2 took a booking.** First movement in about nine days.
  `guest_count` 11 → **12**, ticket-type `spots_remaining` 7 → **6**, event-level 9 → **8**.
  All three counters moved consistently, so this is a real sale rather than a Luma data
  quirk. **19 days out, 6 spots left on the ticket type**, £450, not sold out.
  Second Brain unchanged: 10 of 20 remaining, £325 early bird / £450 full day.
  **No causal claim.** It would be easy to place this next to the search data improving
  and imply the loop earned it. The site has taken **51 clicks in total across five
  weeks**; a single £450 booking is far more likely to have come from Drummond's own
  network, an email, or direct traffic. Recording the fact, not a story about it.
  Nothing shipped - no site change was warranted.

- **2026-08-28 — Cycle 127: the executive cluster starts moving.** Data through 26 Aug.
  **52 clicks, 536 impressions, average position 26.6**, 27 queries up from 24.
  `oxford agentic ai course` took another click and improved to position 3.9. More
  interesting, **both executive-family queries gained position on the same reading**: the
  timing query 78.0 → 77.3, its first gain, and the outcomes query **74.7 → 59.9 with
  impressions up 3 → 7**, entering the top ten.
  That is consistent with the 25 Aug timing guide being crawled and the cycle-88 cluster
  links working. **Two days is not proof**, and the note written on 27 Aug stands: no
  verdict before about 5 September. Direction recorded, conclusion withheld.
  **The outcomes query is now the fastest-improving on the site, and it still cannot be
  written about.** It is the angle declined on 25 Aug in favour of timing. Answering it
  means saying how long after a programme people get promoted, and no data for that
  exists. A query growing does not make a fact available - inventing a number would be
  the easy wrong answer, and rising impressions are exactly the pressure that makes it
  tempting.
  Guide budget available and unspent for a fourth day. Still no target the evidence
  supports.

- **2026-08-27 — Cycle 116: the competitor's brand query is now sending real volume.**
  Data advanced to 25 Aug after three days stuck on 24 Aug. **51 clicks, 507 impressions,
  average position 26.6** - position improving on three consecutive readings, 28.3 to
  27.8 to 27.1 to 26.6.
  **`oxford generative and agentic ai programme` went from 1 impression to 12, holding
  position ~10.** That is Saïd's own programme name. Buyers comparing their programme are
  now seeing this site at the page-one boundary with real volume, which is the point the
  off-page file argued in the abstract.
  **Deliberately not treated as a CTR gap.** Position 9.8 with 12 impressions and zero
  clicks looks like the job #1 target, and the arithmetic says otherwise: expected CTR at
  that position is 2-3%, so 12 impressions predicts about 0.3 clicks. Zero is exactly what
  should happen. Doing the sum before acting is what stopped a cosmetic title rewrite
  being dressed up as optimisation - the second time this month that pattern nearly won.
  Recorded a trigger instead: revisit when expected clicks exceed one and actual is still
  zero.
  Tried to confirm which page ranks for it; the Pages tab would not respond and the
  extension has been unreliable. Not chased, because the answer would not have changed the
  decision.
  **Guarded against a future misreading:** the timing guide's target query gained 3
  impressions and lost 1.2 positions. The guide went live on 25 Aug, so this is its first
  partial day and Google had not crawled it. Written into the baseline that this is not a
  verdict and to wait until about 5 September.
  **Oxfordshire (standing report):** `agentic ai oxfordshire` climbing steadily across
  three readings, 43.9 to 37.9 to 35.7, now 13 impressions, still zero clicks.

- **2026-08-26 — Cycle 107: first real growth in the data.** Search Console advanced to
  24 Aug after being stuck on 23 Aug for roughly 18 hours across several cycles.
  **50 clicks, 483 impressions, 10.4% CTR, average position 27.1.** In one day: +5 clicks,
  +25 impressions, CTR +0.6pp, position improved 0.7. Best single-day gain since the site
  launched.
  `oxford agentic ai course` did most of it - 4 clicks to 5, position 4.2 to 4.0,
  impressions 28 to 32. **`agentic second brain` appeared for the first time**: 1 click
  from 1 impression at position 16, the first query the second programme has registered
  on at all. One impression is not evidence and nothing is being built for it, but it is
  worth watching for repetition.
  **Still no actionable CTR gap**, so job #1 again falls through to job #2. `oxford
  agentic ai course` converts at 15.6% from position 4, which is normal. Everything else
  is position 37-90, where zero clicks is expected rather than symptomatic.
  **Guide budget available and deliberately unspent.** The shortlist was declined on the
  probe, and this data does not name a replacement target. `agentic second brain` at one
  impression is not a brief. Writing a guide because the budget allows it is the
  manufactured work this loop has been trying to avoid.
  Noted for whoever reads the next data: the timing guide went live 25 Aug and **cannot**
  appear in data through 24 Aug. The slight position drift on its target query is not a
  verdict on it.

- **2026-08-25 — Cycle 101: both shortlisted guides declined on the probe. The
  objections belong on the event page, not in search.** No site change; guide budget was
  already spent today anyway.
  Probed cycle 100's two candidates against the standing rule, winnable AND converting.
  **Both fail.**
  - **"What company data can I put into AI tools?"** The query is owned by security
    vendors and compliance firms - sealpath, ciso.inc, securityjourney, sosafe,
    stickypassword, CPA practices. A five-week-old training site does not outrank that,
    and the reader wants a policy answer rather than a bootcamp. Fails both tests.
  - **"Who maintains an agentic workflow afterwards?"** Owned by developer-tooling and
    automation-vendor content - Vellum, Mastra, DEV, forgeworkflows. Winnable is doubtful;
    converting is worse, because the searchers are developers and platform shoppers, not
    owner-operators. This is the "winnable but wrong reader" failure the rule exists for.
  That makes **five candidates declined on this rule** across the loop's life, against two
  written. The rule is doing its job.
  **But the probe found the better answer.** Both are genuine *booking* objections from
  the persona file. They fail as search plays and belong where the buyer already is.
  Checked the Cohort 2 FAQs: seven questions, and neither objection is among them.
  "Do I need to be technical?" covers **the day**, not **the after**, and nothing
  addresses company data at all - the nearest is "Can I install software on my work
  laptop?", which is adjacent but different.
  **Drafted below rather than added.** Event-page copy has been Drummond's call since the
  Cohort 1 FAQ was reverted, and these touch governance and commitments.

  > **Q. What company data do I need to put into anything?**
  > None that you are not comfortable with. The task you bring is yours to choose, and you
  > can build against a redacted or sample version of it - the pattern transfers either
  > way. Part of the day goes on deciding where a workflow's inputs should and should not
  > come from, which is the question your IT and legal teams are already asking. This is
  > not a substitute for your own policy, and nothing about the day requires putting
  > restricted data anywhere it should not be.

  > **Q. Who maintains it afterwards? Do I need someone technical?**
  > You do, and no. You leave with a workflow you built yourself, in tools you can open
  > without help, plus a written recipe for rebuilding and extending it. Part of the day is
  > deliberately spent on where these break and how you would notice, because a workflow
  > nobody can fix is one you stop trusting by the second week. If it later grows into
  > something that genuinely needs engineering, you will know why - but that is not where
  > most people start.

- **2026-08-25 — Cycle 100: a guide shortlist from the personas, because Search Console
  has no next target left.** No site change - this is preparation, recorded so the next
  cycle acts on evidence rather than picking under time pressure.
  **First, the honest position on query data.** The one winnable query Search Console
  offered has been written. What remains: `agentic ai for finance` (22 impr) already has a
  guide and sits at **position 82**, so another finance page changes nothing; the glossary
  cluster has no commercial intent; Oxfordshire is the wrong intent and barred by the
  no-location-pages rule; `oxford agentic ai course` and `agentic ai oxford` already rank
  4.2 and 4.0. **Search Console cannot choose the next guide.** Saying so beats inventing
  a target from it.
  **So back to the vault**, which is what Drummond asked for and which this only half did
  before the Search Console data arrived. Mined the persona objections and checked each
  against existing coverage:
  - **"What can I actually put company data into, and what can't I?"** (P1 Governed
    Adopter, 3 of 16). Appears only as a sub-topic inside the public-sector and consultants
    guides. **No dedicated page.** Highest-anxiety objection on the list. Care needed: this
    must not drift into legal advice, and no policy specifics can be invented.
  - **"Do I need someone technical to maintain whatever we build?"** (P2 Lean
    Owner-Operator, **5 of 16 - the largest persona and the primary homepage buyer**).
    Maintenance is discussed in four guides, but all of them are about second brains or
    task selection. **Nothing covers who owns an agentic workflow after the build day.**
    This is an objection that blocks a booking outright.
  - **"Does this just help people make more mediocre content faster?"** (P5). Ruled out:
    twelve guides already carry the judgement-and-quality theme. A dedicated page would be
    redundant.
  **Both survivors still need a demand probe before anything is written** - the standing
  rule is winnable AND converting, and neither has been tested yet. P2's maintenance
  question is the stronger candidate on audience size and on being a live blocker.

- **2026-08-25 — Cycle 98: IndexNow verified working. Third cycle running with nothing
  broken to find.** No site change.
  The brief says keep IndexNow pinging, and it had not been checked since the pipeline was
  repaired. Did not trust the job's green tick - the job runs `continue-on-error`, so it
  reports success even when the endpoint rejects the submission. Read the logs instead:
  the guide publish shows **"submitted 2 URL(s), status 200"**, and ledger-only pushes
  correctly report "no page URLs affected". Working end to end.
  Recorded a trap while there: every commit triggers **two** runs with the same title, CI
  and Deploy to GitHub Pages, and only the deploy run carries the `indexnow` job. Reading
  the CI run and seeing no IndexNow output proves nothing - which is exactly the mistake
  made mid-cycle before spotting it.
  **On cadence.** Cycles 96, 97 and 98 each verified something and found nothing to fix.
  That is a real signal, not a run of bad luck: Search Console is fully swept, the refresh
  backlog turned out to be phantom, the funnel works and the pipeline works. The inputs
  that could change anything now move on a **daily** clock (Search Console refresh, guide
  budget) or a multi-day one (the crawl requests landing), while the two levers that
  matter are Drummond's. Hourly cycles from here mostly re-read the same numbers, so the
  interval is going to three hours until something upstream changes.

- **2026-08-25 — Cycle 97: the guide-refresh backlog was mostly phantom. Correcting an
  earlier claim.** No site change - nothing needed one.
  Several cycles ago the loop told Drummond that ten of eighteen guides had never been
  revised, that eight predated the message house, and that they were **"carrying the old
  positioning, in the same way the Cohort 2 event summary was"**. That was asserted from
  `publishDate == updatedDate` alone. Nobody read the guides. This cycle did.
  **It does not hold.** `agentic-ai-for-business-leaders-where-to-start` (23 Jul, never
  revised) carries the message house throughout in its own words: "the gap is not
  knowledge, it is having built something that runs on its own", the prompting-to-
  orchestrating shift, "the machine does the scaffolding; the decision at the end stays
  yours", "the part which used to take a morning now takes a fraction of it". It needs
  nothing.
  **The grep that suggested otherwise was a bad proxy.** Counting message-house *phrases*
  returned zero for that guide, which read as drift and was actually just a writer using
  their own words. Acting on that count would have been busywork dressed as maintenance.
  **Checked for real contradictions instead**, which is what a refresh should be for:
  - **Capacity.** The site moved from "capped at 25" to "small cohort" once Luma's ticket
    type turned out to cap at 10. Every surviving "twenty-five" is about **talk duration**
    ("no block more than twenty-five minutes of anyone talking at you"), except one in
    `what-is-an-agentic-bootcamp` which is a general claim about where facilitation stops
    working, in a guide defining the category rather than describing this one. No
    contradiction.
  - **Superseded positioning** ("Build agents. In a day. In Oxford."): gone everywhere.
  - **Prices on site** (PRD §18 keeps them on Luma): none.
  **Conclusion: there is no refresh backlog.** Date-based staleness is not evidence of
  drift, and future cycles should not treat `publishDate == updatedDate` as a work queue.
  Refresh a guide when a fact changed under it, not when the calendar moved.

- **2026-08-25 — Cycle 96: Search Console sweep finished, booking funnel verified, and
  nothing to fix.** Guide budget spent. No site change this cycle - saying so plainly
  rather than manufacturing one.
  **Breadcrumbs: 0 invalid, 6 valid, no issues.** **Core Web Vitals: not enough usage
  data on either device type** - CrUX needs real traffic and 45 clicks a month will not
  produce it. Recorded in the baseline with a re-check column, so no later cycle spends
  itself rediscovering that an empty report is empty. Synthetic performance is already
  enforced by the Lighthouse budgets, so nothing is unmonitored.
  **That completes the sweep.** Every Search Console report has now been read. The last
  four cycles each found something real - zero external links, a near-orphaned hub page,
  four invalid Event items - and all of it came from reports nobody had opened. That
  seam is now exhausted.
  **Verified the booking funnel rather than assuming.** Cohort 2 has taken nothing in five
  days and the loop had been reading that as demand. Checked the technical explanation:
  page is 222ms and 57KB, the Luma embed returns 200 with "Get Ticket" and £450 showing,
  and **it is not consent-gated**, so declining cookies does not block booking. The funnel
  works. Flat sales are a promotion question.
  Chrome's automation timed out repeatedly on that page mid-check. The curl timings show
  that was the extension or the third-party iframe, not the site, so it is **not** logged
  as a performance problem - a flaky tool is not evidence.

- **2026-08-25 — Cycle 95: four invalid Event items, found in Google's own rich-result
  report.** Guide budget spent.
  Opened the Events enhancement report, never checked before. **4 invalid items, critical
  issue: missing `startDate`.** Invalid items cannot produce rich results at all, on the
  two pages people actually book from.
  Traced precisely: the Second Brain agenda reads "Morning", "Midday", "Afternoon",
  "Close" - that day is not scheduled to the minute - so `agendaInstant()` could not parse
  a time and four sub-events were emitted with no `startDate`. Four, matching Google's
  count exactly.
  **The cause was a good principle implemented wrongly.** The code deliberately listed
  untimed rows anyway, commented "nothing is invented". That principle is kept - no time
  is guessed. But `startDate` is required on schema.org Event, so such a row is not an
  untimed event, it is an invalid one, and Google discards the whole item. Not inventing a
  fact and not asserting an incomplete one are the same discipline.
  Sub-events are now emitted only for rows with a parseable clock time. Verified: zero
  Event nodes missing `startDate` site-wide, all four rows still visible on the page,
  Cohort 2 keeps all 12 timed sub-events. Nothing user-facing changed.
  **Deliberately not fixed:** the same report warns about missing `price` and
  `priceCurrency` on the 2 valid items. Price is unpublished by design (PRD §18) and lives
  on Luma. Recorded in the baseline so a later cycle does not "fix" a decision.

- **2026-08-25 — Cycle 94: Google confirms zero external links, and a near-orphaned
  hub page.** Guide budget spent.
  Opened Search Console's Links report, never checked before. **External links: Total 0**
  - measured, not inferred. Every off-page conclusion in the ledger now rests on a
  measurement instead of an argument.
  **Correcting cycle 91.** It said the flagship programme page has "257 inbound internal
  links". That was href *occurrences* across built HTML, not linking pages; the real
  figure is **44 distinct pages**. The conclusion survives - 44 is still abundant, and
  External links = 0 settles it - but the number was quoted in a way that overstated the
  evidence.
  **The recount found something the inflated number hid.** `/bootcamps/` had **3**
  inbound linking pages: About and the two programme pages. `getNav` pointed the
  "Bootcamps" item at `programmes[0]` in both header and footer, so the index was linked
  from neither, while sitting in the sitemap with CollectionPage schema and discovered-
  but-uncrawled by Google.
  Fixed in the footer only, which the nav docblock already calls "the full site map - so
  nothing becomes unreachable". **3 to 38 linking pages.** The header still goes straight
  to the flagship: that is the booking path, and where "Bootcamps" lands there is a
  funnel decision rather than a cleanup, so it stays Drummond's.
  Also noted, not changed: `programmes[0]` decides the header destination by sort order,
  so adding a third programme could silently move it.

- **2026-08-25 — Cycle 93: all three programme pages now queued for crawl.** Guide
  budget spent today on `when-ai-executive-cohorts-run`, which is live and in the sitemap.
  **Finished what cycle 92 left broken.** `/bootcamps/second-brain-bootcamp/` had failed
  with a rate-limit error; retried 75 minutes later and it went through. All three
  programme pages are now in Google's priority crawl queue. The failure was self-
  inflicted: the console's search box kept refusing focus, two duplicate requests went to
  the agentic page, and those ate quota. Recorded in the baseline so the next run submits
  one URL, confirms, then navigates cleanly.
  **Did not request indexing for the guides**, including today's new one, even though it
  would help. Drummond picked the three programme pages over the option that included
  guides; that is his call and the quota is finite.
  **Data refresh:** 45 clicks, 458 impressions, average position 27.8, through 23 Aug.
  One extra day, so the deltas are noise until they repeat.
  **Oxfordshire standing report:** ~30 impressions, still zero clicks. `agentic ai
  oxfordshire` moved 43.9 to 37.9. Intent still *build it for me* rather than *teach me*,
  so still not an SEO target. Flagged for another look if it reaches page one, where
  service intent becomes a genuinely different conversation.

- **2026-08-25 — Cycle 92: the guide the data asked for, and indexing requested.**
  Guide budget reset overnight. Another session pushed `d3542fb` (About h1) while this
  one slept; no overlap, left alone.
  **New guide: `when-ai-executive-cohorts-run`.** The first guide on this site chosen
  from evidence rather than a guess about what might rank: 37 impressions at position 76
  on "what time of year do executive ai cohorts usually begin?", nothing on the site
  answering it, and the vault's persona file recording Saïd exec-ed graduates as the
  biggest Cohort 1 channel. Drummond picked the timing-and-sequencing angle.
  Its honest move is refusing the premise: the question assumes an autumn intake, and
  online AI programmes now repeat through the year. Verified what could be verified
  (Saïd's programme: online, four weeks, from £1,500, builds a simple agent) and said
  plainly that in-person dates are set individually. **No claim about other providers'
  calendars, and no career-outcome statistics** - the adjacent query asks about title
  changes after a programme, and inventing a number there would have been the easy
  wrong answer. Cross-linked into the exec cluster built in cycle 88.
  Checked: no banned words, no em dashes, British spelling, capsule 51 words.
  **Indexing requested** on Drummond's authorisation. `/bootcamps/` and
  `/bootcamps/oxford-agentic-bootcamp/` both confirmed "Indexing requested - added to a
  priority crawl queue". **`/bootcamps/second-brain-bootcamp/` was not submitted** - the
  console's search box kept refusing focus, which sent two duplicate requests to the
  agentic page before the Chrome extension dropped out entirely. Duplicates are harmless
  (Google states resubmitting does not change queue position) but they were waste. That
  third URL still needs doing.
  **Off-page drafts written** to `outreach/submission-drafts.md`, per Drummond's choice:
  a research.com inclusion request and full LinkedIn Company Page copy, both in his
  voice. The research.com draft carries a warning that their pages 403 to fetching, so
  the loop could not read them and he should sanity-check the framing before sending.

- **2026-08-24 — Cycle 91: Google has never crawled the programme pages, and the
  off-page call from 10 Aug is reversed.** Guide budget still spent.
  Looked at Search Console's index-coverage report, never opened before. **23 indexed,
  16 not.** Eleven are "Discovered - currently not indexed" with **last crawled N/A**:
  Google found them and has never fetched them. Among them **all three `/bootcamps/`
  pages** - the commercial hubs carrying the Course schema - three team profiles and
  four guides.
  **The obvious hypothesis was wrong, and checking killed it.** Under-linking was the
  natural read and more internal links the natural fix. But
  `/bootcamps/oxford-agentic-bootcamp/` has **257 inbound internal links** and has never
  been crawled once; `/bootcamps/second-brain-bootcamp/` has 107. Sitemap is submitted,
  read 23 Aug, status Success. Discovery works, linking is abundant, Google is simply
  not spending crawl here. That is **crawl budget on a five-week-old domain with zero
  external links**, and no on-page work buys it. Second time in three days that pulling
  one more column before acting stopped a wasted cycle.
  **This reverses the 10 Aug downgrade of off-page.** That call rested on the site
  leading the national buyer question on Perplexity. Google's own coverage report says
  off-page is the binding constraint after all. STATE.md now says so, in place of the
  old line. Third time this session that a Perplexity-derived conclusion has been
  overturned by Google data - the pattern is now the finding.
  **The redirect error is stale, not live.** One page, `/guides` without a trailing
  slash, last crawled 23 Jul - two days after launch. Re-tested: that path and six other
  unslashed paths all 301 correctly and resolve 200. Residue from initial propagation.
  **Two actions left for Drummond, both write-actions on his Search Console:** request
  indexing on the three `/bootcamps/` pages via URL Inspection (~2 min, the standard
  remedy), and clear the stale redirect error with Validate Fix if he wants it tidy.
  Not done unasked - they act on his property and notify him.

- **2026-08-24 — Cycle 90: the Second Brain booking link had quietly moved.** Guide
  budget still spent; timing guide ships after midnight.
  **Went looking at the commercial layer rather than hunting for something to ship**, and
  the check found a live defect. `luma.com/7vcqji8g` **302s to `luma.com/secondbrain`** -
  Drummond has given that event a branded vanity URL and the site was still on the
  generated id. Cohort 2 already uses a branded slug (`oxfordagentic2`), so the
  convention was set; the Second Brain event had simply not been caught up.
  **The checker built in cycle 86 could not see this**, because it follows redirects and
  reported a clean 200 the whole time. Now fixed: `probe()` makes a `redirect: 'manual'`
  request first and reports the hop, non-blocking, naming both destination and linking
  page. Negative-tested by re-injecting the old URL. A link whose target you control
  should point at the target, and redirects rot - the owner can retire the old URL, and
  a booking link is the worst place to find that out.
  **The worst instance was the fallback.** The event's FAQ carried "if it does not load
  for you, the same booking page is at luma.com/7vcqji8g" - the escape hatch for someone
  whose embed failed, typed by hand, and quoted in the FAQPage schema. Now
  `luma.com/secondbrain`, which is also the version a human can retype.
  **Commercial state, 24 Aug 19:23:**
  - **Cohort 2** - £450, 7 spots left on the ticket type (cap 10), `guest_count` 11, not
    sold out. **Identical to the 19 Aug reading: no movement in five days, 23 days out.**
  - **Second Brain** - £325 early bird / £450 full day, 10 left on the ticket type, 20 at
    event level. Confirms the free-ticket fault found on 17 Aug stayed fixed.
  - **Oxfordshire services cluster** - unchanged, 28 impressions, 0 clicks.
  **Flagged, not done:** Cohort 2 has no fallback booking line, while the Second Brain
  event does. If the embed fails on the flagship bookable page there is no escape hatch.
  Left for Drummond rather than added unasked - event-page copy has been his call before.

- **2026-08-24 — Cycle 89: grounding tomorrow's guide, and a competitor claim that was
  not checkable.** Guide budget still spent (it is 18:20 on the 24th), so the exec-cohort
  timing guide ships after midnight. No site-facing change this cycle - two documents.
  **Oxfordshire services cluster (standing report):** unchanged at 28 impressions, 0
  clicks. Search Console updates daily and was read at 17:00; no re-read.
  **The check that mattered came back clean.** Tomorrow's guide is about *when* cohorts
  run, so it reasons off the Saïd line in STATE.md, which asserted "next start 16 Sept
  2026 - the same day as Cohort 2". First question: does any live site copy depend on
  that? **No.** The only Saïd references on the site are Drummond's own biography. So
  there was no factual error on a live page - worth confirming before assuming one.
  **The claim itself does not hold up.** Their own page 403s to fetching, and secondary
  listings show May and July 2026 cohorts, not September. Corroborated: £1,500, online,
  four weeks, builds a simple agent on an existing platform. Not corroborated: the date.
  STATE.md now says so plainly and warns against building copy on it. The useful shape
  for the guide is that these programmes run **several online cohorts a year rather than
  an autumn intake** - which is most of the honest answer to the 37-impression query,
  and not something to assert from one competitor without saying so.
  **Off-page target 3 was understated.** It named research.com as one site. The same
  search shows a *cluster* ranking for the buyer's comparison with this site absent from
  all of it: research.com (three separate comparison pages), digitaldefynd.com,
  gogradia.com, createwith.com, datadrivendaily.com. Listed with the note that a
  research.com comparison listing is worth more than several event directories, because
  it sits inside the decision rather than beside it. Also recorded there: this site is
  already **position 8 for Saïd's own programme name**, so buyers comparing the two can
  find it - what is missing is any third-party page saying the two are comparable.

- **2026-08-24 — Cycle 88: guides had no contextual links between them at all.**
  Guide budget spent today, so the exec-cohort timing guide ships tomorrow.
  **Oxfordshire services cluster (standing report, per Drummond 24 Aug):** 28
  impressions, 0 clicks, positions 28-76 across `agentic ai companies / services /
  providers / consultants oxfordshire` and `best agentic ai providers oxfordshire`.
  Intent is *build it for me*, not *teach me*. Unchanged since the baseline six hours
  ago; Search Console updates daily, so no re-read this cycle. No pages built.
  **The find:** 17 of 18 guides have zero in-prose inbound links, and the 18th has one.
  Verified against **built HTML**, not source - the same claim was made once before off
  source alone and was wrong. Correctly stated this time: guides do link to each other,
  but only through the template's "More guides" module, with the guide title as anchor
  text. The prose of the exec guide contained exactly one internal link, to a programme
  page. So there is no topical clustering signal anywhere on the site.
  **The fix, kept deliberately small.** Bolting links into prose is how SEO ruins
  writing, and persona P5 judges this copy as copy. Four links added, each one answering
  a question its own sentence already raises: "a real task from your own work" now links
  to choosing one, "a few narrow steps handing off to each other" to the scout-drafter-
  reviewer pattern, "an executive programme or a good course" to the comparison guide,
  and the comparison guide's line about people who *understand it but have never built
  anything* now links to the guide that is entirely about that gap.
  That builds the exec cluster before tomorrow's guide lands in it, rather than leaving
  the new guide to stand alone at position 76.
  `updatedDate` bumped on both - prose changed, so the freshness signal is real. That is
  the same rule that said **not** to bump it in cycle 85 for a metadata-only fix.
  **Not done, and worth saying:** this will not move a position-76 page on its own.
  Internal links redistribute authority; they do not create it. The site ranks 44-90 for
  almost everything because it is five weeks old with an empty `Organization.sameAs`.

- **2026-08-24 — Cycle 87: the first real Google data, and it overturns the premise.**
  Drummond opened Search Console; read via his logged-in Chrome. Baseline saved to
  `seo-data/2026-08-24-search-console-baseline.md` — read that file, not this summary.
  **44 clicks · 437 impressions · average position 28.3** over the site's whole life.
  **Three things this corrects:**
  **1. There is no impressions-vs-CTR gap**, and there never was. The loop's stated job
  #1 for 31 cycles was not blocked on missing data - the premise was wrong. Every
  high-impression query sits at position 44-90, where zero clicks is the expected
  outcome rather than a symptom. The problem is ranking, not click-through.
  Caught a live mistake: the plan this cycle was to rewrite the finance guide's title to
  fix its "CTR gap". `agentic ai for finance` is at **position 81.9**. No title rewrite
  moves a click from page eight. Pulling the position column before acting stopped it.
  **2. Perplexity rankings are not Google rankings, and the loop reported them as if
  they were.** STATE.md records #1s from Perplexity probes. Google says position 28.3
  with exactly two queries in the top ten. Both readings are true of their own engine;
  neither substitutes for the other. STATE.md now points at the baseline first.
  **3. The only true CTR gap is too small to act on.** `agentic ai oxford`: position
  4.0, six impressions, zero clicks. Six impressions is not evidence.
  **Target chosen from evidence for the first time:** the executive-cohort cluster.
  37 impressions at position 76 on "what time of year do executive ai cohorts usually
  begin?", nothing on the site answering it, and the vault's persona file records four
  of sixteen Cohort 1 attendees coming from Oxford Saïd exec-ed - the biggest
  acquisition channel. Drummond chose the **timing and sequencing** angle. Guide budget
  was already spent today, so it ships tomorrow.
  **Standing instruction added:** report the Oxfordshire services cluster's volume and
  intent every cycle (28 impressions, zero clicks, *build-it-for-me* intent, not
  training). Track only - no pages, per the no-location-pages rule.

- **2026-08-24 — Cycle 86: nothing had ever checked a single outbound link.** No GSC
  export. Guide budget spent, so no new guide.
  `check-links.mjs` validates 1,668 internal links every build and skips anything
  starting with `http` (line 71). That left two gaps, neither ever checked:
  **1. Absolute self-links.** A link written `https://oxfordagentic.com/foo/` instead of
  `/foo/` was classed as external and skipped, so a typo in one bypassed every guardrail
  the build has. There are 37 of them. All resolve today - but nothing was watching.
  **2. Third-party links.** The two Luma booking URLs the entire business transacts
  through, the ICO link on /privacy/, novaria.ai, two LinkedIn profiles. All six resolve.
  Shipped `scripts/check-external-links.mjs`, wired into `npm run build`. Self-links
  resolve against `dist/` with the same rules the internal checker uses and **fail** the
  build, because that answer is deterministic and entirely ours. Third-party links are
  probed over the network and only ever **warn**: a build must not go red because someone
  else's server is having a bad afternoon. LinkedIn answers bots with 999 by design, so
  401/403/405/429/999 are reported as *unverifiable* rather than broken - the distinction
  matters, or the check cries wolf twice on every build and gets ignored.
  Negative-tested rather than assumed: injecting a bad absolute self-link makes it exit 1
  and name the linking page. A guardrail that cannot fail is not a guardrail.
  **Investigated and cleared, not fixed:** `/home-photos/` and `/home-original/` are
  deliberate homepage variants - real pages in `src/pages`, correctly `noindex, follow`,
  absent from the sitemap. The `index 2.html` files exist only in local `dist/`, which is
  gitignored. Both looked like defects and neither is one.

- **2026-08-24 — Cycle 85: swept for the rest of the class cycle 84 found.** No GSC
  export. Guide budget already spent today, so no new guide.
  Cycle 84 found one field the 13 August message house never reached. Rather than assume
  Cohort 2 was unique, swept every field that feeds a meta description, a card or the
  llms feeds for the same two defects. Two more, both fixed:
  **1.** `src/lib/home.ts` - the "What is Oxford Agentic?" answer, the single most quoted
  string on the site and a FAQPage node, ended "and require no coding." The project's own
  off-page rules forbid that standing alone because it reads as "not serious" to a
  technical buyer. Now closes on the approved pairing verbatim: "No coding required, and
  nothing hand-waved."
  **2.** `why-in-person-beats-online-for-learning-ai` - its meta description still read
  "what gets a working agent built", the pre-house singular framing. Audited all 18 guide
  descriptions: every other one already says "agentic workflow", and all 18 are under 160.
  A single outlier across eighteen is a real miss, not a pattern match.
  **Deliberately left:** the `what-is-an-agentic-bootcamp` capsule ends "Most need no
  coding." That guide defines the category, so the line is a neutral factual claim rather
  than a sales claim, and the pairing rule exists to stop *sales* copy reading as
  unserious. Editing a working definition capsule for pattern-consistency is meddling.
  **Deliberately skipped:** the ledger says bump `updatedDate` on any content touched.
  Not done here. A meta-description fix is not a revision of the article, and bumping
  `dateModified` would claim a freshness signal that did not happen.
  Build: 39 pages valid, all titles and descriptions unique. The homepage's 166-char
  `brand.description` remains the only warning, and remains Drummond's to move.

- **2026-08-24 — Cycle 84: the money page was still serving pre-message-house copy,
  and the machine feed stuttered.** No GSC export. Twenty-three days to Cohort 2.
  **Started as a regression check, not a fix.** The message-house sweep rewrote the
  homepage hero and entity strings on a site ranking #1, and that change had never been
  verified. A WebSearch probe returned the site nowhere in eight results, and a
  site-restricted probe returned nothing - both looked alarming and both were artefacts
  (WebSearch is US-only; the earlier #1 readings were Perplexity/GB, and Perplexity is
  still erroring on a schema dialect, so no like-for-like comparison was available).
  An independent index confirmed the truth: **13 pages indexed including the newest
  guide, no deindexation, no regression.** Alarm dropped rather than reported.
  **What the probe did surface** is that `summary` in an event's frontmatter feeds three
  surfaces at once - the meta description, the visible EventCard, and `llms.txt` /
  `llms-full.txt` - and on Cohort 2, the page people actually book from, it was the one
  field the 13 August message house never reached. It read "Build a working agent on
  your own real task": the pre-house framing, and "agent" where every other surface now
  says "agentic AI workflow". Replaced with the approved short line plus the pattern
  clause. The Second Brain summary ended on a bare "No coding.", which the project's own
  off-page rules forbid standing alone ("pair it every time"); rewritten to end on the
  outcome. Fixing that exposed a stutter in `llms.txt`, where the generator prepends the
  venue and the summary named it again - "Pitt Rivers Museum, Oxford. A one-day bootcamp
  at the Pitt Rivers Museum, Oxford." Pre-existing, but that string is exactly what AI
  engines quote, so the venue came out of the summary. Both events now open on the same
  approved line. Build: 39 pages valid, all titles and descriptions unique.
  **Still blocked on Drummond:** the homepage description is 166 chars and ends on the
  same bare "No coding." - it is `brand.description`, reused verbatim off-site, so it is
  his to move, and it is now the only SEO warning left in the build.

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

## 30 Sep 2026 - Meta pixel (manual session, not a loop cycle)
- Added Meta pixel 2272071460195423 (same dataset Luma uses) via `analytics.metaPixelId`.
  Consent-gated by not loading at all: `window.oaMetaPixel()` in BaseHead runs for a stored
  `granted`, and ConsentBanner calls it on Accept. Privacy page lists it; "Change my cookie
  choice" calls `fbq('consent','revoke')`. `track()` mirrors events to Meta:
  register_section_viewed -> ViewContent, luma_booking_click -> InitiateCheckout, rest trackCustom.
  Verified headless: no fbq/no facebook request before consent, loads on Accept and on return,
  absent after Decline. Do not load the pixel ahead of consent - PECR, same rule as Google.
- Same day: LinkedIn Insight Tag, partner 10831801 (Campaign Manager 553270380), via
  `analytics.linkedinPartnerId`, same consent gate (`window.oaLinkedInTag()`). Privacy page lists it.
  Verified headless: loads only after Accept, absent after Decline.
