# Off-page review list - for Drummond to approve

Backlink, directory, partnership and mention opportunities found by the SEO/GEO loop.
**Nothing here has been contacted, submitted, signed up for or paid for.** Every item needs
Drummond's approval before anything happens. Add new finds at the top and do not duplicate.

The longer-standing listing targets and their copy already live in
`outreach/off-page-listings.md`: Eventbrite, a LinkedIn Company Page, course-roundup and
comparison sites, UK AI and tech event aggregators, and Oxfordshire business and chamber
listings. Drafts are in `outreach/submission-drafts.md`. They are not repeated here.

## Open

- **Our own two past Luma listings outrank the live one, and outrank our website** - found
  15 Oct 2026 by answer-engine probe. **Highest-value off-page item the loop has found, and
  the whole of it is in Drummond's own account.**
  - On a web engine, two queries - the bare brand name "Oxford Agentic Bootcamp", and the
    proposition in a buyer's words ("one day AI course Oxford where you build a working
    workflow on your own task") - returned the same top three: **luma.com/oxfordagentic2**
    (Cohort 2, ran 16 September), **luma.com/k7c2rm5s** (Cohort 1, ran 21 July) and the stale
    allai.events page. **oxfordagentic.com appeared in neither top ten**, and neither did
    **luma.com/oxfordagentic3**, the live Cohort 3 listing for 19 November.
  - On the second query the engine recommended the bootcamp in as many words - "the closest
    match", "the only one of these in Oxford" - and then sent the reader to two events that
    have already happened, adding: "That date has already passed as of today, so look for a
    newer session."
  - It also read the two listings as one contradictory event: "different venues, Worcester
    College and St Anne's College", "the hosts differ between them". Both are true of two
    different cohorts, but nothing told the engine they were two.
  - **Why this is Drummond's and not the loop's.** All three Luma pages are his. The site
    change this cycle (`sameAs` on each event, one shared `EventSeries`) is the most the
    repo can say. What would actually move it is on Luma: pointing the two past listings at
    the Cohort 3 listing or at oxfordagentic.com, so the indexed pages that currently absorb
    our brand traffic pass it on rather than ending it.
  - **Not checked:** the Luma pages were NOT loaded. DNS does not resolve `luma.com` from the
    sandbox, so everything above comes from the search results and from URLs this repo
    already publishes. Confirm against the live pages before acting.
  - Needs: Drummond's decision, and about ten minutes in Luma. Nothing contacted or changed.
  - **Strengthened 16 Oct 2026 (08:06 cycle) with a third query axis and the first measured
    buyer-side harm.** A venue-anchored probe - "AI bootcamp Worcester College Oxford one day
    workshop" - again returned `luma.com/oxfordagentic2` and `luma.com/k7c2rm5s` and not
    oxfordagentic.com. This time the engine did not merely send the reader to a past date: it
    said the listings disagree on the venue, quoted "St Anne's College, 56 Woodstock Rd" and
    "5 spots remaining" off the July listing, and told the reader **"Confirm the venue with
    the organisers before booking."** That is a hesitation manufactured out of two of our own
    pages, about a venue that has been settled since September. It raises the value of the
    ten minutes in Luma above anything else on this list.
  - **Strengthened again 17 Oct 2026 (01:00 cycle) with a fourth query axis - the entity
    question - and the first harm that touches a named person.** Asked "what is Oxford
    Agentic who runs the Oxford Agentic Bootcamp", the engine returned
    `luma.com/oxfordagentic2`, `luma.com/k7c2rm5s` and allai.events, and **no page of ours**.
    Working only from those, it named **Josh Lawman as a host of the bootcamp** - he was
    removed from the team on 4 August - and could not resolve the roster at all: "Listings
    differ on the fourth host: one names Nicolai Thomson, another names Josh Lawman." It gave
    the date as 21 July 2026 and repeated the venue contradiction.
  - **The site is clean on this and cannot fix it.** Verified in `dist/` the same cycle:
    "Josh Lawman" appears in no built page, `/team/` does not list him, `/team/josh-lawman/`
    is a noindex redirect to `/team/`, and the name is absent from `llms-full.txt`. The only
    remaining source of the claim is the Luma listings, which are Drummond's. A past listing
    that misattributes a current role to a named real person is a different order of problem
    from a stale date, and it is the second thing the ten minutes in Luma would fix.

- **techUK - "Speak at an event"** - found 15 Oct 2026 by deliberate off-page search.
  - techUK is the UK technology trade body. Its events page
    (https://www.techuk.org/events, loaded 15 Oct 2026) lists conferences, roundtables and
    briefings in London and Manchester, and the two "Get involved" routes are **Speak at an
    event** (https://www.techuk.org/get-involved/promote-your-expertise/speak-at-an-event)
    and Sponsor an event.
  - **It is not a listing route.** The programme is techUK's own events, run with members, so
    there is no "submit your event" path and the bootcamp cannot be listed there. Recorded so
    nobody tries. The speaking route is the opportunity: a slot in front of that audience is
    both the right seniority and a credible citation.
  - **Not checked:** whether speaking requires techUK membership, what membership costs, or
    their editorial and commercial policy. Only the events page was loaded; the speak-at-an-
    event page itself was not opened.
  - Needs: Drummond's decision. Nothing contacted.

- **allai.events carries a stale listing of the Oxford Agentic Bootcamp** - found
  15 Oct 2026 by answer-engine probe, not by us submitting anything.
  - URL as returned: https://allai.events/event/the-oxford-agentic-bootcamp
  - The listing shows **21 July 2026** - Cohort 1, which ran nearly three months ago - and
    publishes a price band. It is the third third-party directory found carrying our events
    without us having submitted anything, after aieventlist.ai and foundercal.com.
  - Why it matters: it is a live citable mention of the entity, which the Organization node
    still lacks entirely (backlog 2b), but it is currently advertising a day that has
    already happened. Either getting it updated to 19 Nov or getting it taken down is worth
    more than leaving it.
  - **Not checked:** the page was NOT loaded. The sandbox egress policy blocks outbound
    fetches this cycle, so everything above comes from the search result itself. Confirm the
    URL resolves and the date before acting.
  - **Raised in priority 15 Oct 2026 (08:05 cycle).** A near-brand probe - "Oxford Agentic
    Bootcamp Worcester College one-day bootcamp oxfordagentic.com" - returned this listing
    **first and returned oxfordagentic.com not at all**. So on that engine the stale page is
    not merely a third-party mention, it is the source that stands in for our own site, and
    the engine reported the Worcester College venue as unconfirmed on the strength of it.
  - **The price is shown in dollars**, "from $275", on a UK event with a past date. Wrong
    currency and a dead date on the page an engine treats as canonical is a commercial
    problem as well as an SEO one.
  - Needs: Drummond's decision - ask for an update to 19 Nov or ask for removal. Nothing
    contacted.

- **explainx.ai - "Top 10 AI Workshops for Professionals in 2026"** - found 12 Oct 2026
  by answer-engine probe.
  - URL: https://explainx.ai/blog/top-ai-workshops-professionals-2026 (HTTP 200, checked
    12 Oct 2026). Cited by Perplexity for "is a one-day AI bootcamp worth it for a
    non-technical executive", the same answer that cites one of our guides at #5.
  - Why: a comparison roundup that an answer engine already draws on for a converting buyer
    question, and it explicitly covers one-to-five-day workshop formats rather than
    multi-week bootcamps, which is our shape.
  - **Not checked:** whether it accepts suggestions, its editorial or commercial policy, or
    any cost. The page was loaded to confirm it resolves; nothing beyond that.
  - Needs: Drummond's decision. Nothing contacted.

- **Cohort 3 is already listed on two third-party directories, one of them wrong** - found
  11 Oct 2026 by answer-engine probe, not by us submitting anything.
  - `aieventlist.ai/en/events/oxford-agentic-bootcamp-oxford-2026-11/` - **accurate**: 19 Nov,
    Worcester College, the four facilitators, and it states we are independent of the
    University. No action needed; good coverage.
  - `foundercal.com/events/the-oxford-agentic-bootcamp-fFS9i7ABiGVWPAC` - **says the city is
    London** ("Workshop in London", "City: London gb") while the venue line says Worcester
    College. It also publishes the price band and gives the postcode as OX1 2JL.
  - **Both directories have the postcode wrong (OX1 2JL).** Worcester College's own site
    gives OX1 2HB, which is what our event files say. Ours is right; do not "correct" it.
  - Needs: Drummond's decision on asking foundercal for a correction. Nothing contacted.

- **EnSpire Oxford "What's On"** (https://enspire.ox.ac.uk/whats-on) - found 11 Oct 2026.
  - Oxford's enterprise community calendar. Currently lists the Oxford Moonshot, Oxford
    Climate Ventures, the Saïd Entrepreneurship Forum and the Oxfordshire business
    Marketplace. None of our events appear.
  - **Measured evidence, added 16 Oct 2026, and it raises this item.** A web-search probe of
    `one day AI bootcamp Oxford November 2026` - city, format, month and year, which is Cohort
    3 exactly - returned ten results, **oxfordagentic.com was not among them**, and
    `enspire.ox.ac.uk/event/ai-product-management-bootcamp` was. So this calendar's event pages
    rank for the query our own bookable day should own, carrying somebody else's AI bootcamp.
    That is the first evidence that the route is worth something rather than merely plausible.
  - **Not checked:** whether it accepts third-party listings, any cost, or editorial policy.
    Only the "What's On" index was loaded, on 11 Oct; the event page above was seen in search
    results only.
  - Needs: Drummond's decision. Nothing contacted.

- **whatisai.co.uk - "Best AI Courses for Business Leaders in 2026"** - found 15 Sept 2026.
  - URL: https://whatisai.co.uk/best-ai-courses-for-business-leaders/ (loads, 15 Sept 2026).
    Cited #3 by Perplexity for "best AI course for business leaders in Oxford", the only
    non-Saïd source in that answer. Has a contact page: https://whatisai.co.uk/contact-connect/.
  - Why: a UK roundup that answer engines already cite for the exact buyer question.
  - **Not checked:** whether it accepts suggestions, its editorial policy, or any cost.
  - Needs: Drummond's decision. Nothing contacted.

- **OxGen AI Summit (Oxford Generative AI Summit 2026)** - found 14 Sept 2026.
  - 15-16 Oct 2026, Jesus College Cheng Kar Shun Digital Hub, Oxford. Dates checked against
    the Eventbrite listing's structured data on 14 Sept 2026. Its site,
    https://www.oxgensummit.org/, has a "Sponsorship opportunities" section. **Cost and terms
    not checked.**
  - Why: its own listing describes 200+ leaders from enterprise, startups, government and
    academia in Oxford, which overlaps the bootcamp buyer. Possible mention, partnership or
    attendee-offer route.
  - **Clash resolved (23 Sep 2026):** Cohort 3 moved from Thu 15 Oct to Thu 19 Nov, so this no longer clashes.
  - **Time-check, 15 Oct 2026:** on the dates recorded here the summit is running today and
    tomorrow, so the sponsorship and partnership window for this edition has closed. The
    route that is still open is the 2027 edition, or an approach to the organisers after it
    while they are between editions. The dates were not re-verified this cycle - the sandbox
    egress policy blocks outbound fetches - so confirm before acting.
  - Needs: Drummond's decision. Nothing contacted or submitted.

- **Daily Info (Oxford what's-on listings)** - found 13 Sept 2026.
  - Has an organiser page at https://www.dailyinfo.co.uk/list-event, titled "List your event
    on Daily Info" (loads, checked 13 Sept 2026).
  - **Cost and terms not checked.**
  - Why: it is a long-standing local Oxford listings site, so a listing would be a local
    third-party mention of the events. It fits the in-person Oxford positioning without being
    a location page.
  - Needs: Drummond's decision, then an account and submission. Neither has been done.
