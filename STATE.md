# Current state — read this first

One page, kept current, so anyone (or any future session) can pick this up cold.
Written 25 July 2026; last updated 19 August 2026 (cycle 79).

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

## 🎙️ Find your bootcamp - unlisted voice page, since 30 Sept 2026

> **/find-your-bootcamp/** - noindex, out of the sitemap and llms.txt, linked from nowhere.
> Only Drummond links or promotes it; the daily loop leaves it unlinked and unchanged.

- **What it is.** A dark, gold stage with one large "Press to talk" orb. Visitors talk (or type) to AI
  Drummond in his cloned voice (ElevenLabs `eleven_v4`), who asks two or three questions and picks
  one of the three upcoming days. The agent calls its `show_bootcamp` client tool and the page reveals
  that bootcamp - its reason, what you leave with, and the Luma booking iframe. Visitors can also
  pick a day by hand from the three cards. A direct link like `#coding-bootcamp` opens that day.
- **The agent.** *Oxford Agentic - Bootcamp Finder (hidden page)*, `agent_8601m3raa78necethhgpvz71hf05`
  (id in `site.config.ts` → `assistant.finderAgentId`). Duplicated from the Ask Drummond agent, so it
  keeps the origin lock (oxfordagentic.com only - it will not connect on localhost) and caps. Voice
  runs over WebSocket (WebRTC sends no Origin and every call failed). Tuned for speed on 30 Sept:
  claude-haiku-4-5, eleven_v4_turbo, speculative turns, and the no-prices / no-personal-info /
  no-internal-detail guardrail in streaming mode (checks while it speaks; a breach ends the call). Knowledge:
  llms.txt, llms-full.txt, plus a finder brief written from the vault with no prices, figures or names.
  13 tests attached ("OA finder - ..." and the applicable "OA web - ..." ones).
- **When a cohort passes** it drops off the page automatically (`isUpcoming`). The agent's prompt lists
  the three dates and keys by hand - update it, the finder brief and `choices` in the page together
  when a new cohort goes on sale.
- Independent of `features.assistant`, which stays off.

---

## 🎓 Office hours - unlisted voice page, since 30 Sept 2026

> **/office-hours/** - noindex, out of the sitemap and llms.txt, linked from nowhere. Only Drummond promotes it.

- **What it is.** "Ask anything we teach." Same gold orb stage as the finder, but for questions: visitors
  (and past attendees) talk or type to AI Drummond about what the bootcamps teach and how the days work. Four
  question chips, then the booking panel (hidden until used), then a compact six-module "What we teach" grid
  where each "Ask →" sends that question. Copy trimmed to the essentials and checked at 375px on 30 Sept.
- **The steer.** First answer only teaches, ending with a light question about the visitor's work. As soon as
  they describe a task or goal (usually message 2-3) it recommends one bootcamp in a sentence and calls
  `show_bootcamp`, which opens that day's Luma form directly under the voice stage; if it still can't tell by
  message 4 it asks which ceiling they've hit, and it must recommend before message 6. Workflow and outreach
  problems default to the Agentic Bootcamp. Belt and braces: if the agent names a bootcamp and says "below"
  without calling the tool, the page opens that panel itself (`revealFromSpeech`). Tuned 30 Sept after
  Drummond went eight turns with no recommendation.
- **In-call controls (1 Oct).** Mute mic button (shows "Paused", keeps the call alive with `sendUserActivity`
  every 15s); thumbs up/down under each answer (`sendFeedback` + GA `office_answer_rated`); "Copy transcript";
  the ~570KB ElevenLabs SDK is warmed on hover/focus and at browser idle so the first tap connects faster.
  Agent side: background voice detection on (finder too), `turn_timeout` 45s, `silence_end_call_timeout`
  240s, and a prompt rule to check in once at most when the visitor goes quiet - a real call had ~15
  self-interruptions from someone else's phone call and repeated "Are you still there?".
- **Micro-interactions (1 Oct).** Gold ripple and haptic tick on orb press; orb leans toward the cursor
  (desktop); "we teach." underlines itself; status lines slide in, "Thinking"/"Connecting" get animated dots;
  captions arrive word by word; chips drift in and flash gold when sent; thumbs pop; copy draws a tick; pick
  card sheen plus arrow nudge; syllabus modules rise in on scroll with a cursor spotlight. Hover only on fine
  pointers, press states on touch, all off under prefers-reduced-motion.
- **Trimmed (1 Oct, "less is more").** Removed the idle "browser will ask for your mic" hint (only a blocked
  mic is flagged), the "Live captions" label and placeholder, the booking panel's eyebrow and "Book your
  place" label, "not Drummond" from the fine print, and dead code. Starter chips hide once the visitor asks.
- **Guardrail scope (both voice agents).** Blocks only Oxford Agentic's own prices and figures, personal
  details and internal information. A visitor's own data (e.g. prospects' company revenue) is allowed - the
  old wording ended one of Drummond's calls when he mentioned it.
- **The agent.** *Oxford Agentic - Office Hours (hidden page)*, `agent_1701m3se2rwsfss9dda6e8az3vpc`
  (`site.config.ts` → `assistant.officeHoursAgentId`). Same voice, model, speed settings, origin lock
  and streaming guardrail as the finder. Knowledge: sanitised Cohort 1 and Cohort 2 teaching notes
  (primary - content only, no attendee names, prices or figures; the C2 afternoon was not recorded,
  so it is marked planned), the finder brief, and llms-full.txt. Never names attendees or the C1 guest
  AI engineer. Evals: no price, no personal info, answered well. 17 tests attached ("OA office - ..."
  plus the shared safety tests), including one that the steer lands on the right bootcamp.
- **When a cohort runs**, add its teaching notes to the knowledge base and the syllabus if it changes.

---

## ⏸️ "Ask Drummond" - an AI version of Drummond - OFF since 29 Sept 2026

> **Taken off the site on 29 Sept 2026, the day it launched.** Drummond asked for it to be
> removed "until it has been further tested". `features.assistant` is false, so no page
> carries the launcher, its script or the privacy section. `assistant.previewOnly` is
> true, so switching it back on shows it only to a tab opened with `?assistant=preview`
> until he opens it to everyone. Only Drummond switches it back on. The ElevenLabs agent
> is unchanged. Everything below describes it as built and holds for when it returns.

Asked for by Drummond: "a version of me that people can ask questions about the bootcamp",
subtle, never revealing personal information, and sending every money question to the
event page. What shipped:

- **What visitors see.** A small ink "Ask Drummond · AI" button in the bottom-left corner
  (Back to top owns the right). It appears once the visitor scrolls past the top of the
  hero - never on arrival, where the hero's booking button owns that corner - and never
  while the cookie banner is up. It opens a squared, hairlined panel: type, or press
  Talk to hear the answers in Drummond's own cloned voice. On phones it is a bottom sheet,
  and on event pages it sits above the booking bar rather than on it.
- **Where the agent lives.** ElevenLabs (Drummond's workspace), agent
  *Oxford Agentic - AI Drummond (website)*, id `agent_9501m3p6649hfjpsve5qzzv0jexv`. Its
  prompt, voice ("Drummond Voice", his professional clone), model and caps are set there,
  not in this repo.
- **What it knows is this site.** Its knowledge base is `/llms.txt` (always in view) and
  `/llms-full.txt` (searched), both re-synced by ElevenLabs daily. **Anything published on
  this site is something AI Drummond can say, and nothing else is.** That is the privacy
  design, and it is why the existing rules matter twice over now: no prices, no discount
  codes, no personal details on any page.
- **Money.** It never gives a price, early-bird rate, discount, code, refund term or places
  left. It names the event and links its page, where the booking form shows the price.
  Refused three times over: the prompt, a blocking guardrail on every reply ("No prices or
  personal information"), and a knowledge base with no prices in it.
- **Locked down.** Only accepts conversations from oxfordagentic.com (origin required);
  100 conversations a day, 5 at once, 8 minutes each; every client override off except
  text-only; prompt-injection guardrail on. Transcripts kept 90 days; voice audio is not
  recorded. The privacy page section `#assistant` says exactly this - change it in the
  same commit if a setting changes.
- **Tested.** Twelve ElevenLabs tests named "OA web - ..." (price, a quoted price, discount
  codes, personal details, attendees, prompt injection, AI disclosure, university
  affiliation, next-event facts, repeating a visitor's text in his voice, off-topic, and a
  multi-turn simulation of a finance director pushing for a figure). All pass. Re-run them
  after any change to the prompt.
- **The code.** `src/components/Assistant.astro` is the site's own UI, not ElevenLabs'
  widget (1.5MB, its own font, rounded, and its pill sat on the mobile booking bar). The
  SDK, `@elevenlabs/client`, is a separate chunk fetched only on the first message or
  press of Talk, so a visitor who never uses it downloads about 4KB. Model output is
  rendered as text nodes only, and the only links it can make are to this site.
- **Switches.** `features.assistant` in `site.config.ts` removes it entirely.
  `assistant.previewOnly: true` hides it from everyone except a tab that has opened a page
  with `?assistant=preview` - use that to try a change on the live site first.
  `assistant.greeting` must match the agent's first message in ElevenLabs.
- **Not done, by choice or by plan.** ElevenLabs transcript redaction is enterprise-only,
  so it is off and visitors are asked not to share personal details. The ElevenLabs
  shareable "talk to" page is blocked by the domain lock, deliberately.

---

## 🟠 Cohort 2 capacity: three different numbers (corrected 19 Aug 2026)

**This corrects the 17 Aug note, which read one number and missed two.** Luma reports
capacity at two levels and the earlier reading only caught the ticket type:

| Where | Reading |
|---|---|
| Ticket type "Full Day Pass" (£450) | 3 registered, **7 remaining** - so that type is capped at 10 |
| Event overall (`ticket_info`) | **9 remaining**, `guest_count` 11 - so the event allows about 20 |
| The site | `capacity: 25`, "capped at roughly twenty-five" throughout |

So the 17 Aug claim that "sales stop at ten" was right about the ticket type and wrong
about the event: the event itself has room for roughly twenty. The practical effect is
still real, because there is only one ticket type - **it exhausts at ten while the
event has capacity left**, unless another release is added.

Still unexplained from outside: `guest_count` 11 against 3 registered on the only
ticket type, which implies registrations not attached to it - comps, a guest list, or a
type since removed. The dashboard will show it.

**Site copy unchanged.** Twenty-five may well be the room's real capacity, with Luma
configured more conservatively on purpose. Capacity is a confirmed fact and the loop
does not lower a published one on an inference drawn from a scrape.

**Second Brain, same check, now priced** - the 17 Aug "free" problem is fixed. Two
types: Early Bird £325 and Full Day £450, ten each, none sold yet. Its event-level cap
therefore looks like twenty rather than the thirty read on 17 Aug, which was taken
before the ticket types existed.

---

## ✅ The Second Brain Bootcamp was free on Luma (found 17 Aug, fixed by 19 Aug)

Read from the live Luma page for `luma.com/7vcqji8g`:

```
"ticket_info": {"price":null,"is_free":true,"is_sold_out":false,"spots_remaining":30}
"ticket_types": [{"cents":null,"currency":null}]
```

**Resolved.** As of 19 Aug the page reports `is_free: false` with two ticket types,
Early Bird at £325 and Full Day at £450. Kept as a record of the failure mode: an
event can go live on Luma, be linked from the site and be fully bookable while no
price has been set on it, and nothing on either side flags that.

What it looked like when found - no price set, `is_free` **true**, open with 30 spots
and 0 registrations, so anyone booking the 21 October day paid nothing. It also made a
site FAQ untrue for two days: "Pricing is shown on the booking page for each event".

**The standing rules this produced, which still apply:** price never goes on the site,
it lives on Luma by decision. A scarcity claim has to be checked on the live page the
day it ships, so no static "eight places left" - the message house bans it outright,
and the numbers here have moved twice in two days, which is the argument. Capacity is
a confirmed fact: the loop reads it, reports it, and does not publish it on inference.
Backlog 15 - the Second Brain page cannot answer "how big is the cohort?" - stays open
until Drummond states the number.

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

The agenda-versus-hours worry recorded here in July was checked on 17 Aug and is not a
contradiction — agenda entries are start times, and Luma's `end_at` matches the site.
The capacity question turned out to be real and is now the red note at the top of this
file: Luma's only ticket type implies a limit of ten, not twenty-five.

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
| 3 | **Check the Cohort 2 ticket limit on Luma** | Registered + remaining comes to 10 on the only ticket type, while the site says 25. If the limit is real, sales stop at ten. See the red note above. The agenda half of this task is resolved - it was never a contradiction | 2 min |
| 4 | Export Search Console Performance CSV → `seo-data/` | Needs data (property verified 23 Jul; reports after ~3–7 days) | 2 min, weekly |
| 5 | Bing Webmaster Tools: verify + submit sitemap | Needs an account. Bing feeds ChatGPT's web results, so this is GEO not just Bing traffic | 5 min |
| 6 | Create a LinkedIn Company Page, add the URL to `brand.social` | Needs the page. Flows into `Organization.sameAs` for entity triangulation | 1 min once created |
| 7 | 🔴 **Four Cohort 1 quotes are LIVE. Two of the four people do not know** | **Shipped 17–18 Aug (cycles 81–82) on Drummond's explicit instruction, caveats accepted.** Live: Fei Gan, Kirsten Samuel, Dr Zeynep Hizir, Shrestha Mullick. **Zeynep and Kirsten are the safe two** — Drummond already published both, with these exact words and attributions, in the 13–14 Aug email campaign, and Zeynep's began as a post she wrote and published herself. **Fei and Shre are the two to square:** neither has seen the page, and Fei's `role` reads "Cohort 1 attendee" because the vault has never held her job title. One email each. `consentGiven: false` removes any of them cleanly | 2 emails |
| 7b | 🔴 **Confirm Shrestha Mullick's quote with her, or replace it** | **The only quote on the site whose exact words cannot be traced to a document.** Wording supplied by Drummond 18 Aug; the second half is verbatim from her 23 Jul email, the first half ("It was a really good session") is not in that email, the Gmail thread or WhatsApp via Beeper — presumably said in person. She also **agreed on 30 Jul** to write a proper testimonial and was blocked by an assessment that ended **11 Aug**, so she has been free to write it for a week. Getting the real one closes both halves of this | 1 email |
| 7c | Ask Kirsten Samuel whether the site can say what she did, not just what she said | Her quote is the weakest part of her evidence. She came to Cohort 1, referred a contact in July, and has since bought seats for her own team — a repeat customer who became a corporate buyer. That sequence is worth more than the sentence, and the site cannot use it without her word. **Do not write purchase detail into the public repo** — that belongs in the vault | 1 email |
| 7b | Capture Zeynep Hizir's LinkedIn post text | She published a Cohort 1 testimonial publicly, on her own initiative, ~2 Aug — the first one to exist, from a Saïd DipAI alumna, while Cohort 2 was selling. **The vault records the fact of it and not one word of the text**, so it cannot be used. Pull the post text, then it is a second testimonial file | 5 min |
| 8 | Review the drafted bio in `src/content/speakers/drummond-gilbert.md`, then flip `features.speakers` | Drafted from vault facts, never reviewed. **Never publish an unreviewed biography of a real person** | 5 min |

| 9 | Confirm the two new Cohort 1 photos (room-and-cohort, flipchart-group) are consent-OK with the people shown | They went live 26 Jul with the flag flipped in-session; see the photography note above | 2 min |
| ~~10~~ | ~~Josh Lawman~~ **Done 17 Aug** | His page and content entry were removed, and the team page count derives from the collection so it corrected itself to four | — |
| 11 | Give Nicolai Thomson a link | His is the only Person node on the site with no `sameAs`, so he is the one team member the entity graph cannot corroborate. His card confirms the company is Jenesys AI, which narrows it. The loop will not guess a URL for a named person | 1 min |
| 12a | Name the two guest sessions on the Cohort 2 agenda | Two of twelve agenda slots read "Guest session" with no name, on the page selling a £450 day. Naming even one turns an unknown into a reason to book, and `speakers` already exists on the event schema and references the team collection. The loop will not attach a real person to a slot Drummond has not confirmed them for | 1 min |
| 12 | Answer the certificate question | Nothing on the site says whether attendees get one, and the comparison set leads with it — Saïd issues a University of Oxford certificate, the Queen Mary Eventbrite day issues one too. A senior person expensing a day will ask. Both "no certificate" and "yes, ours" are facts the loop has no source for | 1 sentence |

---

## Decisions already made (do not re-litigate)

- **`/apply/` is a qualifying application form, hidden on purpose (Drummond, 23 Sept 2026).**
  Six stepped screens: which day, role, AI experience, outcomes, budget band and who pays,
  then name, email and phone. Noindex, out of the sitemap, linked only from the footer base
  row. Do not add it to the header, the event pages or the booking path. Budget asks for
  bands and never states a price. **Applications currently arrive by email**: with
  `applications.endpoint` empty in `site.config.ts`, the answers open pre-filled in the
  visitor's own mail app, addressed to hello@oxfordagentic.com. Paste a form-service
  endpoint (Formspree, Basin, a Zapier hook) into that field and it posts directly instead.
  The privacy page's `#applications` paragraph describes it; change both together.

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
  - **Off-page IS the binding constraint. This reverses the 10 Aug call below.**
    On 10 Aug the loop downgraded off-page because the site led the national buyer
    question on Perplexity with zero listings. Google's index-coverage report on 24 Aug
    says the opposite, and Google is the one rationing: **11 pages are "Discovered -
    currently not indexed" with last-crawled N/A**, meaning Google found them and has
    never fetched them. Among them: **all three `/bootcamps/` pages** - the commercial
    hubs carrying the Course schema - all three team profiles, and four guides.
    It is not a discovery fault (sitemap submitted, read 23 Aug, status Success, 35
    pages) and **not an internal-linking fault** - `/bootcamps/oxford-agentic-bootcamp/`
    carries **257 inbound internal links** and has still never been crawled. That is
    crawl budget on a five-week-old domain with **no external links at all**, and no
    amount of on-page work buys it. `Organization.sameAs` is still **empty**.
    Paste-ready packs are in `outreach/off-page-listings.md`.
  - Read with care: one engine, ranked results rather than cited AI answers, and
    IndexNow has been pinging since 6 Aug, so some of the lift may be freshness.
  - **Superseded 30 Jul reading, kept so nobody re-derives it:** the national question
    was invisible and off-page was called the binding constraint.
  - **There is no guide-refresh backlog** (checked 25 Aug 2026). Ten guides have
    `publishDate == updatedDate` and eight predate the message house, and an earlier cycle
    called them "carrying the old positioning". Reading them says otherwise: they carry it
    in their own words. Checked for real contradictions - capacity claims, the superseded
    "Build agents. In a day. In Oxford.", prices on site - and found none. Every surviving
    "twenty-five" refers to talk duration, not room size. **Do not treat an unchanged
    `updatedDate` as a work queue.** Refresh when a fact changed under a guide.
  - **Guides mostly do not rank on their target queries** (cycles 59–63). Two causes,
    and they need different responses: queries owned by institutional publishers
    (NHS England on "what AI am I allowed to use") cannot be won and should be
    reframed onto what they never answer; queries that are winnable but attract the
    wrong reader (career-switchers, content marketers) should be left alone. Hence the
    hard rule in `IMPROVEMENTS.md` backlog 9: probe first, require **winnable AND
    converting**.
  - **Saïd is no longer "strategic, not hands-on".** Their new *Oxford Generative and
    Agentic AI Programme* (£1,500, online, 4 weeks) includes building a simple agent
    on an existing platform. **Verified 31 Aug 2026** by reading their
    own page in a browser (it 403s to `WebFetch` and to curl, so a plain fetch will keep
    failing - use the browser tools). Start dates listed: **16 September 2026 and
    11 November 2026**. Four weeks, online, £1,500, three modules, the third of which
    ("Hands-on with Agents") builds a simple agent and produces governance artefacts.
    Led by Mike Wooldridge and Matthias Holweg. Aimed at ops leaders, technology
    directors and senior consultants. So the earlier "unverified 16 Sept" was right after
    all, and the programme runs several online cohorts a year rather than one autumn
    intake. **Their September cohort starts the same day our Worcester College day runs.**
    Not a clash - theirs is four weeks online - but both market into the same window with
    the same vocabulary. The honest distinction is now
    in-person, your own real task rather than a platform exercise, and the room —
    **not** that they lack hands-on content. Site copy must not imply otherwise.
  - New local competitor: **The Oxford AI School** (Witney), prices from £149.
  - Full detail in `IMPROVEMENTS.md` under the 30 Jul re-probe. Re-probed 31 Aug 2026. Re-probe ~30 Sept.
- **Search Console access restored 11 Sept 2026** after being refused 9-11 Sept (cause
  never established; the DNS verification record was present throughout). Latest
  reading, data through 8 Sept: **68 clicks, 942 impressions, average position 19.3.**
  Index coverage: 29 indexed, 13 not indexed.
- **Events rich-result report shows 4 invalid items, and they are stale.** All four fail
  on "Missing field 'startDate'" and lack every other Event field too, which is the shape
  of the old agenda sub-events. A scan of every built page on 11 Sept found 33 Event nodes
  and **none without `startDate`**; commit `3eb995d` fixed this earlier. Google has not
  re-checked (validation "Not Started"). **Action for Drummond:** Search Console → Events
  → "Missing field 'startDate'" → Validate Fix. The drill-down would not open through
  browser automation.
- **Second Brain Bootcamp: ranking is NOT its constraint (9 Sept 2026).** 1 guest, 19 of
  20 seats unsold, six weeks out, while ranking #1 for its commercial query with five
  supporting guides. Search Console has recorded exactly one second-brain query in the
  site's life, at 1 impression. **Do not commission more Second Brain SEO content
  expecting bookings.** The lever is demand generation, not position.
- **Google baseline. Latest reading 6 Sept 2026 (data through 4 Sept): 65 clicks,
  845 impressions, average position 20.6** over the site's whole life. Started at
  44 clicks / 437 impressions / position 28.3 on 24 Aug.
  - **The flat-clicks watch is closed.** Clicks sat at 55 across two readings while
    impressions grew; the check was whether they were still 55 on 4 Sept. They are 65.
    It was noise, not a pattern.
  - **`when-ai-executive-cohorts-run` did not reach its target query.** Verdict delivered
    6 Sept, one day late, and the lateness is recorded rather than smoothed over. Twelve
    days after publication the query had 45 impressions and **zero clicks**, across six
    consecutive readings, while the site climbed from position 28.3 to 20.6 around it.
    A 31 Aug refresh did not rescue it. **Do not re-open this query.** Full reasoning,
    including the half-tested position criterion, in the baseline file.
  - Google's data pipeline stalled 31 Aug to 1 Sept: six consecutive pulls all ended at
    29 Aug. It caught up overnight. Expect this and do not read a flat window as flat
    performance without checking the end date on the chart. Full table and analysis in
  `seo-data/2026-08-24-search-console-baseline.md` — **read it before trusting the GEO
  block above**, which records Perplexity rankings, not Google ones. The two diverge
  sharply and the loop conflated them until 24 Aug.
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
