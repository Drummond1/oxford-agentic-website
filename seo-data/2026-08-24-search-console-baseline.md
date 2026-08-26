# Search Console baseline — 24 August 2026

First real Google data the loop has ever had. Read via Drummond's logged-in Search
Console on 24 Aug 2026; property `sc-domain:oxfordagentic.com`; range 22 Jul – 22 Aug
2026 (the site's whole life — the domain was registered 22 Jul).

**Totals: 44 clicks · 437 impressions · 10.1% CTR · average position 28.3.**

## Every query with 5+ impressions

| query | clicks | impressions | position |
|---|---|---|---|
| what time of year do executive ai cohorts usually begin? | 0 | 37 | 76.2 |
| oxford agentic ai course | 4 | 27 | 4.3 |
| agentic ai for finance | 0 | 22 | 81.9 |
| agentic slang | 0 | 13 | 75.2 |
| agentic terms | 0 | 12 | 86.2 |
| agentic ai oxfordshire | 0 | 10 | 43.9 |
| agentic dictionary | 0 | 8 | 64.5 |
| agentic ai companies oxfordshire | 0 | 6 | 69.2 |
| agentic ai oxford | 0 | 6 | 4.0 |
| agentic ai services oxfordshire | 0 | 5 | 54.0 |

Tail (1–4 impressions each, all 0 clicks): agentic ai keywords (74.2), best agentic ai
providers oxfordshire (28.3), introduktion til ibm agentic ai bootcamp (65.3), how long
after an executive ai program do graduates usually see a title change? (74.7), agentic ai
for finance and accounting (89.7), agentic ai providers oxfordshire (30.5), how to
pronounce agentic ai (60.0), mem.ai second brain (74.0), agentic ai consultants
oxfordshire (76.0), oxford generative and agentic ai programme (8.0), agentic ai for
finance operations (72.0), agentic ai glossary (83.0). 22 queries total.

## What this overturns

**1. There is no impressions-vs-CTR gap.** The loop's stated job #1 for 31 cycles.
It was never blocked on missing data — the premise was wrong. Every high-impression
query sits at position 44–90, where zero clicks is the expected outcome, not a
symptom. The problem is ranking, not click-through.

This caught a real mistake mid-cycle: the plan was to rewrite the finance guide's title
and description to fix its "CTR gap". `agentic ai for finance` is at **position 81.9**.
No title rewrite moves a click from page eight. Pulling the position column before
acting is what stopped it.

**2. Perplexity rankings are not Google rankings, and the loop reported them as if
they were.** The GEO block below records #1s on Perplexity. Google says average
position 28.3 and 44 clicks in a month, with exactly two queries in the top ten
(`oxford agentic ai course` 4.3, `agentic ai oxford` 4.0). Both readings are true of
their own engine. Do not let one stand in for the other again.

**3. The one real CTR gap is too small to act on.** `agentic ai oxford`: position 4.0,
six impressions, zero clicks. Ranks well, converts nothing. Six impressions is not
evidence. Watch it; do not redesign anything around it.

## What the data says to write

**The executive-cohort cluster is the winnable target**, and it converges from three
directions:
- 37 impressions on `what time of year do executive ai cohorts usually begin?` at
  position 76. You do not accumulate 37 impressions from page eight unless the query
  has real volume, and nothing on the site answers it.
- Same family: `how long after an executive ai program do graduates usually see a title
  change?`. Both are long conversational questions — AI-assistant-shaped.
- `oxford generative and agentic ai programme` ranks **position 8** — Saïd's own
  programme name.
- The vault's persona file: **four of sixteen Cohort 1 attendees came from the Oxford
  Saïd AI executive-education cohort**, documented there as the single biggest
  acquisition channel.

Measured demand, the best-converting audience, and an existing adjacent guide
(`after-the-ai-executive-programme`). Drummond chose the **timing and sequencing**
angle on 24 Aug.

## What to deliberately not chase

**The glossary pulls junk.** `agentic slang` (13), `agentic terms` (12), `agentic
dictionary` (8), `agentic ai keywords` (4), `how to pronounce agentic ai` (2) — 39
impressions, zero clicks, no commercial intent. About 9% of all impressions are people
wanting a definition, not a bootcamp. The instinct to answer them with more definitional
content is a trap.

**The Oxfordshire cluster is a business signal, not an SEO one.** `agentic ai
companies / services / providers / consultants oxfordshire` — 28 impressions combined,
zero clicks. The intent is *someone build this for me*, not *teach me*. That is inbound
demand for a service Oxford Agentic does not sell. Standing instruction is no location
pages, and the intent is wrong for the product regardless. **Drummond asked on 24 Aug
for this to be tracked every cycle** — report volume and intent so he can see whether real
service demand is building. Do not build pages for it.


## Index coverage — read 24 August 2026, 20:30

**23 indexed · 16 not indexed.** Sitemap submitted 23 Jul, last read 23 Aug, status
Success, 35 pages discovered. Discovery is working fine.

| reason | pages | source |
|---|---|---|
| Discovered – currently not indexed | 11 | Google systems |
| Page with redirect | 3 | Website |
| Redirect error | 1 | Website |
| Crawled – currently not indexed | 1 | Google systems |

### The 11 Google has never fetched (last crawled: N/A)

`/bootcamps/` · `/bootcamps/oxford-agentic-bootcamp/` ·
`/bootcamps/second-brain-bootcamp/` · `/guides/agentic-ai-for-consultants/` ·
`/guides/ai-bootcamp-vs-course-vs-exec-education/` ·
`/guides/scout-drafter-reviewer-pattern/` ·
`/guides/what-hands-on-ai-training-actually-means/` · `/team/drummond-gilbert/` ·
`/team/emine-gokce-phillips/` · `/team/jonathan-waddingham/` · (one more on page 2)

**All three programme pages are in that list.** Those carry the Course schema and are
the commercial hubs. Google has never looked at them.

### The hypothesis this killed

The obvious read was under-linking, and the obvious fix was more internal links. It is
wrong. Inbound internal links in the built site:

| page | inbound links | crawled? |
|---|---|---|
| /bootcamps/oxford-agentic-bootcamp/ | **257** | never |
| /team/ | 141 | indexed |
| /bootcamps/second-brain-bootcamp/ | **107** | never |
| /bootcamps/ | 3 | never |

A page with 257 internal links pointing at it has not been crawled once. Internal
linking is not the constraint, and cycle 88's cluster work will not fix this. Checking
before acting is what stopped a wasted cycle - the second time in three days that
pulling one more column killed the plan.

**Diagnosis: crawl budget on a domain registered 22 July with zero external links.**
Not a technical fault. Not fixable on-page.

### The "Redirect error" is stale, not live

One page: `https://oxfordagentic.com/guides` (no trailing slash), last crawled 23 Jul -
two days after the domain went live. Re-tested 24 Aug: that URL and six other
non-trailing-slash paths all 301 correctly to the slashed version and resolve 200. It
is residue from initial DNS/Pages propagation. **Not clicked "Validate fix"** - that
acts on Drummond's property and emails him, and a failed validation would be noise.
His call.

### What actually moves this

1. **Request indexing** on the three `/bootcamps/` pages via URL Inspection. Standard
   remedy for discovered-not-crawled, about two minutes. Not done here - it is a write
   action on his Search Console.
2. **One external link.** `Organization.sameAs` is empty. Crawl budget on a new domain
   is bought with external links and time, and nothing else on this list substitutes.


---

## Update — 25 August 2026, 15:30

**45 clicks · 458 impressions · 9.8% CTR · average position 27.8** (22 Jul – 23 Aug).
Up from 44 / 437 / 28.3 the previous day. One extra day of data, so treat every delta
below as noise until it repeats.

| query | clicks | impressions | position | vs 24 Aug |
|---|---|---|---|---|
| what time of year do executive ai cohorts usually begin? | 0 | 38 | 76.3 | +1 impression |
| oxford agentic ai course | 4 | 28 | 4.2 | stable |
| agentic ai for finance | 0 | 22 | 81.9 | unchanged |
| agentic slang | 0 | 13 | 75.2 | unchanged |
| agentic ai oxfordshire | 0 | 12 | **37.9** | **+2 impr, +6 positions** |
| agentic terms | 0 | 12 | 86.2 | unchanged |
| agentic ai oxford | 0 | 6 | 4.0 | unchanged |

**Indexing requested (Drummond's authorisation, 25 Aug).** All three programme pages are
now in Google's priority crawl queue: `/bootcamps/`,
`/bootcamps/oxford-agentic-bootcamp/`, `/bootcamps/second-brain-bootcamp/`.
The third failed first time with "We had a problem submitting your indexing request" -
a rate limit, reached because the console's search box kept refusing focus and two
duplicate requests went to the agentic page. It succeeded on retry 75 minutes later.
**Lesson for next time: submit one URL, confirm, then navigate cleanly before the next.**
Google states resubmitting does not change queue position, so duplicates are pure waste
against a small daily quota.
Guides were **not** submitted - Drummond chose the three programme pages specifically
over the option that included them.

**Oxfordshire services cluster (standing report).** ~30 impressions across the six
variants, still zero clicks. `agentic ai oxfordshire` is the one that moved: position
43.9 to 37.9. Intent is unchanged and still wrong for the product - *build it for me*,
not *teach me*. No pages built. Worth another look if it reaches page one, because a
query at position 10 with service intent is a different conversation from one at 38.


---

## Links report — read 25 August 2026, 16:35

**External links: Total 0.** Measured by Google, not inferred. Every off-page conclusion
in this file now rests on a direct measurement rather than an argument.

**Internal links: total 69.** Top linked, from Google's crawled subset only:
`/` (14), `/about/` (14), `/events/oxford-agentic-bootcamp-cohort-2/` (14), `/guides/`
(11), `/events/` (10), `/team/` (6). No programme page appears, which is consistent with
them being linked mostly from pages Google has not crawled.

### Correcting cycle 91

Cycle 91 said `/bootcamps/oxford-agentic-bootcamp/` has "257 inbound internal links".
That number was **href occurrences across all built HTML**, not linking pages. The
correct figure is **44 distinct linking pages** (258 occurrences, because nav, footer,
cards and prose all link it from the same page). The conclusion is unchanged and now
better supported - 44 pages is abundant, and External links = 0 confirms the diagnosis
outright - but the evidence was quoted in a way that overstated it.

### What that recount actually found

`/bootcamps/` had **3 inbound linking pages**: `/about/` and the two programme pages.
Cause: `getNav` pointed the "Bootcamps" item at `programmes[0]`, the first programme
page, in both header and footer, so the index was never linked from either. It sits in
the sitemap carrying CollectionPage schema and Google had discovered it without crawling
it.

Fixed by pointing the **footer** item at the index, which the nav docblock already
describes as "the full site map - so nothing becomes unreachable". **3 to 38 linking
pages.** The header still goes straight to the flagship programme: that is the booking
path, and where "Bootcamps" lands in the header is a funnel decision rather than a
cleanup.

Left alone deliberately: `programmes[0]` decides the header destination by sort order,
so adding a programme could silently move it. Worth knowing, not worth changing unasked.


---

## Events rich-result report — read 25 August 2026, 17:40

**4 invalid Event items, 1 critical issue: missing `startDate`.** 2 valid.
Invalid items cannot generate rich results at all.

Traced to the **Second Brain event page**: its agenda rows read "Morning", "Midday",
"Afternoon" and "Close", because that day is genuinely not scheduled to the minute.
`agendaInstant()` cannot parse those, so `eventSchema` emitted four `Event` nodes with no
`startDate`. Exactly four, matching Google's count.

The original code did this on purpose - the comment read "Rows without a parseable time
are still listed, just without a timestamp, nothing is invented". The principle is right
and is kept. The implementation was wrong: `startDate` is **required** on schema.org
Event, so a row without one is not an untimed event, it is an invalid one, and Google
rejects the entire item rather than the missing field.

Fixed by emitting sub-events only for rows with a parseable clock time. The four rows
still render in the visible agenda; they simply stop making a machine-readable claim that
cannot be completed. Verified after: zero Event nodes missing `startDate` site-wide, all
four rows still on the page, Cohort 2 keeps all 12 of its timed sub-events.

**Deliberately not fixed:** the report warns "Missing field 'price'" and
"'priceCurrency' (in 'offers')" on the 2 valid items. Price is not published on the site
by design (PRD §18) - it lives on Luma. That is a decision, not a defect. Do not "fix" it
in a later cycle.

The remaining appearance warnings (address in location, endDate, offers, image,
eventStatus, performer, organizer, 4 items each) were all on the same four invalid
sub-events and go with them.


---

## Sweep complete — 25 August 2026, 18:45

Every Search Console report is now checked. Recording the empty ones so no later cycle
spends a cycle rediscovering that they are empty.

| report | result | re-check when |
|---|---|---|
| Performance | 45 clicks, 458 impr, avg position 27.8 | daily-ish |
| Index coverage | 23 indexed, 16 not; 11 discovered-not-crawled | after the crawl requests land |
| Links | **External: 0.** Internal: 69 | after any external link exists |
| Events | 4 invalid, fixed cycle 95 | after the fix is recrawled |
| Breadcrumbs | **0 invalid, 6 valid, no issues** | only if breadcrumb code changes |
| Core web vitals | **Not enough usage data (both device types)** | needs real traffic; do not re-check for months |
| Sitemaps | submitted, read 23 Aug, Success, 35 pages | if the sitemap changes shape |

Core Web Vitals needs CrUX data, which needs real traffic; 45 clicks a month will not
produce it. Synthetic performance is already enforced by the Lighthouse budgets in the
build, so nothing is unmonitored.

## Booking funnel verified working — 25 August 2026

Cohort 2 has taken no bookings in five days, and the loop had been reading that as
demand. Checked the technical explanation before continuing to assume that:

- Live event page: **TTFB 198ms, 222ms total, 57KB.** Fast.
- Booking iframe present: `luma.com/embed/event/evt-kcWdRFwqcgBbNcn/simple`, **200,
  77KB**, rendering "Get Ticket", "£450" and a waitlist option.
- **The embed is not consent-gated.** Declining cookies does not block booking, which was
  worth confirming given the banner ships on every page.

So the funnel works. Flat sales are a demand and promotion question, not a broken button.
Chrome's automation timed out repeatedly on this page during the check; the curl timings
above show that was the extension or the third-party iframe, not the site. **Do not
record the site as slow.**


---

## IndexNow verified working — 25 August 2026

The brief says "keep IndexNow pinging on deploys", and the pipeline had not been checked
since it was repaired weeks ago. Checked end to end rather than trusting the job's green
tick, which is misleading here: the job runs `continue-on-error`, so it reports success
even if the endpoint rejects the submission.

- **Guide publish (`1293274`): `indexnow: submitted 2 URL(s), status 200`.** Accepted.
- **Ledger-only push (`b97c3ee`): "no page URLs affected by this push; nothing to
  submit".** Correct - those commits touch no pages.

Note for anyone reading run logs: every commit triggers **two** workflow runs with the
same title - `CI` (build, validate and audit) and `Deploy to GitHub Pages`. Only the
deploy run has the `indexnow` job. Looking at the CI run and finding no IndexNow output
means nothing.

**Nothing to fix. Do not re-verify unless the deploy workflow changes.**


---

## Update — 26 August 2026, 14:00 (data through 24 Aug)

**50 clicks · 483 impressions · 10.4% CTR · average position 27.1.** First genuine
movement since the baseline: +5 clicks, +25 impressions, CTR up 0.6pp, position improved
0.7 in a single day. 24 queries, up from 22.

| query | clicks | impr | position | vs 23 Aug |
|---|---|---|---|---|
| oxford agentic ai course | **5** | 32 | **4.0** | +1 click, +4 impr, position 4.2 to 4.0 |
| agentic second brain | **1** | 1 | 16.0 | **new, and it converted** |
| what time of year do executive ai cohorts usually begin? | 0 | 39 | 76.8 | +1 impr, position slightly worse |
| agentic ai for finance | 0 | 22 | 81.9 | unchanged |
| agentic ai oxfordshire | 0 | 12 | 37.9 | unchanged |

**`agentic second brain` is the interesting one** - the first query the Second Brain
programme has registered on, at position 16, and it took the click. One impression is not
evidence, so nothing is being built for it. Watch whether it repeats.

**Still no actionable impressions-vs-CTR gap.** `oxford agentic ai course` converts at
15.6% from position 4, which is normal for that position. Everything else sits at 37-90
where zero clicks is the expected outcome, not a symptom. The diagnosis from cycle 91
holds: this is a ranking and crawl-budget problem, not a click-through one.

The timing guide went live on 25 Aug, so it cannot show in data through 24 Aug. Do not
read the position drift on that query as a verdict on it - too early by at least a week.

**Oxfordshire services cluster (standing report):** unchanged. `agentic ai oxfordshire`
12 impressions at 37.9, `agentic ai companies oxfordshire` 6 at 69.2, remainder in the
tail. Zero clicks throughout. Intent unchanged.
