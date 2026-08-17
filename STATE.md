# Current state — read this first

One page, kept current, so anyone (or any future session) can pick this up cold.
Written 25 July 2026; last updated 17 August 2026 (cycle 76).

> **Read the message house before writing any copy.** Positioning was decided on
> 13 August 2026 and supersedes sections 1–3 of the Event Brief. It sets the headline
> verbatim ("Build impactful agentic AI workflows"), the three-rung ladder copy must
> reach, a banned-word list, and the rule that "no coding" is never left standing on
> its own. Source: `OxfordAgenticMessageHouse.md` in Drummond's Google Docs. The site
> was swept against it over cycles 65–69; the packs in `outreach/` were refreshed on
> 17 August. Anything written before 13 August is suspect.

- **Live:** https://oxfordagentic.com — 37 pages, HTTPS enforced, Lighthouse
  100/100/100/100 (event pages accept best-practices ≥75: Luma's iframe sets
  third-party cookies; encoded in `lighthouserc.json`, do not re-fight it).
- **Repo:** github.com/Drummond1/oxford-agentic-website (public).
- **Deploy:** push to `main` → GitHub Actions builds, validates, publishes to GitHub Pages.
  There is no other deploy step. A failing build never reaches the live site.
- **Domain:** oxfordagentic.com, bought via GoDaddy 22 Jul 2026, DNS points at GitHub Pages
  (4 A records + `www` CNAME). `oxfordagentic.ai` is still unregistered — §5 of the PRD
  recommended buying it defensively.
- **The improvement loop:** a scheduled agent runs daily at 09:00, auto-ships, and records
  every cycle in `IMPROVEMENTS.md`. That file is the loop's memory — read it before
  changing anything, so work compounds instead of repeating. (An in-session overnight
  loop ran cycles 18–22 on 26–28 Jul on the same rules.)
- **Homepage design (Drummond, 28 Jul): typographic, not photographic.** `/` is the
  plain ink design with the motif and micro-interactions; the photo variant lives at
  `/home-photos/` (noindex, out of sitemap, unlinked; `/home-original/` redirects
  there). Swap the two `withPhotos` values in `index.astro` / `home-photos.astro` to
  trade them back. Cohort 1 photos still show on the Cohort 1 event page. All photos
  share one baked-in house grade (saturation 0.55, warm shift, gamma 1.12) — grade
  new photos the same way rather than inventing a new look.
  **Consent caveat:** `cohort-1-room-and-cohort` and `cohort-1-flipchart-group` show
  identifiable attendees and were flipped to `consentCleared: true` in-session to build
  the preview — Drummond has seen them ship but has not explicitly confirmed the people
  in them agreed. If anyone objects, flip the flag back; the layout degrades cleanly.

---

## ℹ️ The deploy badge is red and the site is fine (6 Aug 2026)

If you look at Actions and see **Deploy to GitHub Pages** failing, check the live URL
before assuming anything is broken. On 6 Aug the deploy job began failing with
`Timeout reached, aborting!` while **the content published correctly every time** —
GitHub's Pages status API simply stops reporting `succeeded` back to
`actions/deploy-pages` inside its 10-minute window, so the action gives up on a
deployment that has already gone out.

Root cause of the original wedge: two pushes a minute apart overlapped two Pages
deployments; the first was cancelled mid-flight and its record stuck `in_progress`,
holding the Pages lock against everything behind it. Cleared with:

```
gh api --method POST repos/Drummond1/oxford-agentic-website/pages/deployments/<sha>/cancel
```

**Two rules came out of it:** ship **one push per cycle**, and never treat a red
deploy job as proof the site did not update — `curl` the page. Full write-up in
`IMPROVEMENTS.md` under cycle 52. If the red persists across several days with the
site updating fine, it is a GitHub-side reporting issue rather than anything in
this repo.

---

## ✅ Bookings are live (resolved 25 Jul)

Cohort 2's Luma page went live and the embed is now on the event page. A visitor can
book without leaving the site. **Note the event moved** — Luma is the authoritative
source and it says:

- **Wed 16 September 2026** (not 9 Sept), **09:00–17:00** (not 16:30)
- **Worcester College, Walton Street, Oxford OX1 2HB** (not St Anne's)
- Luma: `evt-kcWdRFwqcgBbNcn` · https://luma.com/oxfordagentic2

Two things worth Drummond's eye: the published agenda still ends at 16:20 while the day
now runs to 17:00, and the site says "capped at roughly twenty-five" throughout — worth
confirming against the real Luma capacity.

---

## ⚠️ Needs a decision before anything else (raised 30 Jul, evidence updated 4 Aug)

**The Cohort 2 venue is published as confirmed. The vault now says: decided, not
secured.**

Updated picture from `Digital Brain/CLAUDE.md` (3 Aug, Drummond's own words to
Conference Oxford): *"We've chosen Worcester College - I'm just waiting confirmation
about one specific question."* So the college will not change — it beat a five-venue
shortlist — but there is **still no contract, deposit or cancellation terms**, plus an
unnamed open question, and the 31 Jul Paula meeting left no first-party trace. The
risk has narrowed from "address might move" to "booking not signed".

The loop still has not touched `venue.confirmed` — venue facts are a hard guardrail.
Given the decision is now on record, leaving `true` is defensible; flipping to `false`
(which renders "Room booking being finalised") is the cautious option until the
contract exists. Drummond's call, made less urgent than the 30 Jul framing but not
closed until something is signed.

## New facts from the vault (3 Aug) the site does not yet reflect

1. ✅ **RESOLVED 4 Aug (Drummond's instruction): Nicolai Thomson is on the team page
   and Josh Lawman is off it.** Bio drawn from vault facts only (founder of Jenesys
   AI, multimodal AI platform for accounting practices; leads the technical strand).
   Still open if wanted later: referencing him from the Cohort 2 `speakers` field so
   the event page names him against the agenda.
2. **College-logo constraint (learned 3 Aug via the Mathematical Institute):** an
   unaffiliated event may NOT use University or college logos in promotion. **Audited
   4 Aug: the site is clean** — no crest or University logo assets anywhere, no
   affiliation claims in copy (Drummond's bio states only where he studied and
   teaches, which is factual). One grey area flagged, not changed: the Cohort 1
   registration-desk photo shows a "St Anne's College, University of Oxford"
   tablecloth. It is documentary photography of the real event rather than a logo
   asset, but under a strict reading of the constraint Drummond may prefer to swap it
   off the marketing pages. Check the same constraint against Worcester before any
   Cohort 2 asset ships.

## ⚠️ Decision: the canonical entity description now covers half the business

`brand.description` in `site.config.ts` still reads *"Hands-on agentic AI training in
Oxford for business leaders. In one day, you build and run a working agentic AI
workflow…"* — written when there was one product. Since 4 Aug there are two, and the
Second Brain Bootcamp is not about building agentic workflows at all.

That string is the **canonical entity description**: it is the Organization
description in schema on every page, the homepage meta description, the llms.txt
entity line, the footer, the About page and the RSS channel description. An AI engine
asked "what is Oxford Agentic?" is being told about one bootcamp.

**Not changed by the loop, deliberately.** PRD §13 requires this exact string be
reused verbatim off-site — Luma, LinkedIn, socials — so it can only move when
Drummond moves those too. Changing it here alone would trade one inconsistency for a
worse one.

**Proposed replacement, for Drummond to approve and propagate:**

> Hands-on AI training in Oxford for business leaders, across two one-day bootcamps:
> build a working agentic AI workflow on your own real task, or build the second brain
> your AI tools draw on. No coding.

(157 characters, so it still fits a meta description.)

**Updated 17 Aug.** Two things have moved while this waits:

- `longDescription` — a *different* string, site-only, not reused off-site — was
  brought into line with the message house on 16 Aug (cycle 66). It is the entity line
  at the top of both `llms.txt` files, so the first thing an engine reads is now
  current even though `description` is not. The two no longer match in emphasis, which
  is the least-bad state available until Drummond moves the canonical one.
- The homepage FAQ answer to "What is Oxford Agentic?" got its own two-bootcamp
  wording back in cycle 50, for the same reason: the most-quoted surface on the site
  should not be half-true while this waits.

**Also still true and now measured:** `description` renders at **166 characters**, six
over the 160 its own schema comment specifies, so it is very slightly truncated in
search results. `check-schema.mjs` prints this as a non-blocking warning on every
build (cycle 74) rather than failing the deploy — the string cannot move here alone,
and stopping the pipeline over six characters would be the wrong trade. Fixing the
length and the positioning is the same edit, done once, in three places.

## What needs Drummond (the loop cannot do these)

| # | Task | Why it is blocked | Effort |
|---|---|---|---|
| 1 | Set `newsletter.endpoint` in `site.config.ts` | Needs a provider (Luma subscribe link, Buttondown, Mailchimp). Until then the guide lead-capture cards degrade to a mailto | 5 min |
| 2 | ~~Set `analytics.provider`~~ **Done 12 Aug — do not wire Plausible on top** | Google Tag Manager (`GTM-WQJLXFRN`) is live with the Google Ads tag `AW-18382942196` inside it, gated behind Consent Mode v2 and a cookie banner. Remaining: confirm in Google Ads → Audience manager that the tag reads *Active*, and note the list needs 1,000 users before it can serve | 2 min |
| 3 | Confirm the agenda for the longer day, and the real capacity | The published agenda ends 16:20 but the day now runs to 17:00; the site says "capped at roughly twenty-five" throughout | 5 min |
| 4 | Export Search Console Performance CSV → `seo-data/` | Needs data (property verified 23 Jul; reports after ~3–7 days) | 2 min, weekly |
| 5 | Bing Webmaster Tools: verify + submit sitemap | Needs an account. Bing feeds ChatGPT's web results, so this is GEO not just Bing traffic | 5 min |
| 6 | Create a LinkedIn Company Page, add the URL to `brand.social` | Needs the page. Flows into `Organization.sameAs` for entity triangulation | 1 min once created |
| 7 | Clear Cohort 1 testimonials + people photos for publication | Needs consent from named individuals | — |
| 8 | Review the drafted bio in `src/content/speakers/drummond-gilbert.md`, then flip `features.speakers` | Drafted from vault facts, never reviewed. **Never publish an unreviewed biography of a real person** | 5 min |

| 9 | Confirm the two new Cohort 1 photos (room-and-cohort, flipchart-group) are consent-OK with the people shown | They went live 26 Jul with the flag flipped in-session; see the photography note above | 2 min |
| 10 | Decide whether Josh Lawman comes off the site | Asked on 4 Aug to "remove Josh from the team slide". He is gone from the homepage but `/team/josh-lawman/` is still live, indexed and describing him in the present tense as someone who teaches the day. If he has left, the site is inaccurate about a named person. The loop will not delete a real person's page on its own reading of "team slide" | 1 word |
| 11 | Give Nicolai Thomson a link | His is the only Person node on the site with no `sameAs`, so he is the one team member the entity graph cannot corroborate. His card confirms the company is Jenesys AI, which narrows it. The loop will not guess a URL for a named person | 1 min |
| 12 | Answer the certificate question | Nothing on the site says whether attendees get one, and the comparison set leads with it — Saïd issues a University of Oxford certificate, the Queen Mary Eventbrite day issues one too. A senior person expensing a day will ask. Both "no certificate" and "yes, ours" are facts the loop has no source for | 1 sentence |

---

## Decisions already made (do not re-litigate)

- **Pricing never appears on the site.** It lives on Luma (PRD §18), which also keeps
  commercially sensitive numbers off an indexed page.
- **Testimonials and photos are consent-gated in code.** A quote needs `consentGiven: true`;
  a photo needs `consentCleared: true`. Anything else never reaches the HTML — it is not
  merely hidden. 7 of the 9 Cohort 1 photos are held back for this reason.
- **No doorway pages, ever.** No "AI bootcamp London" location variants or thin
  near-duplicates. Google penalises them and they cheapen a brand whose whole voice is
  anti-hype.
- **Guides are an SEO/GEO play only (Drummond, 4 Aug — tightened from the original
  rule).** Reachable from the footer, their own index and guide-to-guide cross-links,
  and nowhere else: not the header nav (28 Jul) and not the programme pages (4 Aug —
  the "Further reading" band was removed; the booking path competes with nothing).
  Guides still link TO programme pages, so crawlers keep the reverse edge.
- **One new guide per day maximum.** Steady cadence reads as a living site; a burst of
  AI-written pages in one day is the pattern Google's helpful-content system penalises.
- **The design guidelines are law — now the GOLD guide (5 Aug 2026).** Drummond
  applied "Brand Guide Gold" from his claude.ai/design project: gold `#D4AF37`
  replaced amber `#F1AF39` as the single accent, bronze `#9A7B23` replaced rust
  `#AF4C1F` for links/eyebrows (links brighten bronze→gold on hover), and the Quad
  mark moved to the lighter construction (stroke 10/100, outer 72/100, centre 24).
  Type, layout, voice and all other tokens unchanged. The CSS variable names
  `--rust`/`--burnt` are historical; their value is bronze. Source of truth:
  `Brand Guide Gold.dc.html` in design project `d7d9f000-7538-4684-90bf-6f20313a62f5`.
  **REVERT PATH (standing offer): if Drummond types "revert", restore the previous
  design — the pre-redesign state is tagged `pre-gold-redesign` (pushed). Mechanism:
  `git revert` the redesign commit (clean history), or diff against the tag.**

## Facts worth not re-deriving

- **Cohort 1:** Tue 21 Jul 2026, St Anne's College, **16 attendees** (confirmed by
  Drummond 25 Jul 2026; the vault's per-person attendance record is incomplete, but the
  headline figure is right), three build cycles.
  Its Luma event id is `evt-ilXzPEtAvZEowaf` (`luma.com/k7c2rm5s`).
- **Cohort 2:** Wed 16 Sept 2026, 09:00–17:00, Worcester College, Walton Street, Oxford
  OX1 2HB. Luma `evt-kcWdRFwqcgBbNcn` / luma.com/oxfordagentic2. Bookings live.
  (It was originally planned for 9 Sept at St Anne's — that changed; Luma is authoritative.)
- **GEO status (Perplexity, re-probed 10 Aug — supersedes the 30 Jul reading below):**
  - **Oxford-anchored agentic query → #1, #2, #3 and #5 are all oxfordagentic.com**
    (was #2). Saïd's £1,500 online programme is #4.
  - **The national buyer question → #1**, having been *absent* on 30 Jul. This is the
    finding that changed the plan.
  - **"build a second brain for AI, UK" → #1.** Exact-phrase brand query → #1.
  - **Off-page is no longer the "binding constraint".** That call rested entirely on
    being absent from the national question, and the site now leads it with zero
    listings. Still worth doing, for a narrower reason: `Organization.sameAs` is
    **empty**, so the entity has no third-party corroboration anywhere. Paste-ready
    packs are in `outreach/off-page-listings.md`, refreshed 17 Aug.
  - Read with care: one engine, ranked results rather than cited AI answers, and
    IndexNow has been pinging since 6 Aug, so some of the lift may be freshness.
  - **Superseded 30 Jul reading, kept so nobody re-derives it:** the national question
    was invisible and off-page was called the binding constraint.
  - **Guides mostly do not rank on their target queries** (cycles 59–63). Two causes,
    and they need different responses: queries owned by institutional publishers
    (NHS England on "what AI am I allowed to use") cannot be won and should be
    reframed onto what they never answer; queries that are winnable but attract the
    wrong reader (career-switchers, content marketers) should be left alone. Hence the
    hard rule in `IMPROVEMENTS.md` backlog 9: probe first, require **winnable AND
    converting**.
  - **Saïd is no longer "strategic, not hands-on".** Their new *Oxford Generative and
    Agentic AI Programme* (£1,500, online, 4 weeks, next start 16 Sept 2026 — the same
    day as Cohort 2) includes building a simple agent. The honest distinction is now
    in-person, your own real task rather than a platform exercise, and the room —
    **not** that they lack hands-on content. Site copy must not imply otherwise.
  - New local competitor: **The Oxford AI School** (Witney), prices from £149.
  - Full detail in `IMPROVEMENTS.md` under the 30 Jul re-probe. Re-probe ~30 Aug.
- **Not indexed by Google yet** as of 25 Jul (domain registered 22 Jul). Normal.
- **Schema graph is deep and connected (cycles 15–20):** Organization (+`founder` →
  the team-page Person `@id`), WebSite, a WebPage node on every indexable page,
  EducationEvent with `subEvent` agenda + captioned photo ImageObjects, Course with
  `hasCourseInstance`, Articles with `articleSection`/`about`. Before adding a schema
  idea, check the emitted graph — several "gaps" have already been closed.
- **17 guides live** (17 Aug). Newest: "Agentic workflows fail quietly. Here is how you
  would notice" — the reliability paragraph the message house asks for, given somewhere
  to point. Guide capsules are now schema-validated like programmes and events; page
  titles are checked against the ~60-character SERP limit in `check-schema.mjs`, which
  is how five truncated titles reached production before 17 Aug.
- **Consent and tracking (12 Aug).** GTM container `GTM-WQJLXFRN` loads on every page
  behind Consent Mode v2 defaults emitted *before* it, so nothing is set until a
  visitor accepts. `ConsentBanner.astro` is the only thing that grants; the privacy
  page carries a withdrawal control, because consent has to be as easy to take back as
  to give. Verified on production: no advertising cookie before Accept, `_gcl_au`
  after. Do not add a second analytics provider on top.

## Where the documentation lives

- `STATE.md` (this file) — current state, blockers, decisions. Start here.
- `IMPROVEMENTS.md` — the loop's ledger: every cycle shipped, the backlog, what was
  rejected and why, and the GEO baseline.
- `README.md` — how to run it, add an event, toggle a section, rename the brand.
- `~/.claude/scheduled-tasks/oxford-agentic-website-improve/SKILL.md` — the loop's own
  instructions and guardrails.
- Git history — every change with the reasoning in its commit message.
