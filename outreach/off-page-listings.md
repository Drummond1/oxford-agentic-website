# Off-page listing pack - Cohort 2

**Why this file exists.** The 30 July GEO re-probe (see `IMPROVEMENTS.md`) found that
oxfordagentic.com now ranks #2 for Oxford-anchored AI-training queries but is absent
from the national question a buyer actually asks. Every citation in that answer came
from an aggregator or an off-site provider page - Eventbrite appeared three times. The
on-page work has hit its ceiling; third-party listings are the remaining lever, and
they are Drummond's to pull.

This is copy-and-paste material to make that ten minutes rather than an afternoon.
**Nothing here is published by the loop.** Every fact comes from
`src/content/events/oxford-agentic-bootcamp-cohort-2.md`; nothing is invented.

Anything the loop cannot know is marked `[NEEDS: …]`.

---

## The facts, in one place

| Field | Value |
|---|---|
| Event | The Oxford Agentic Bootcamp - Cohort 2 |
| Date | Wednesday 16 September 2026 |
| Time | 09:00–17:00 BST |
| Venue | Worcester College, Walton Street, Oxford, OX1 2HB |
| Format | In person, one day |
| Capacity | 25 |
| Booking | https://luma.com/oxfordagentic2 |
| Site | https://oxfordagentic.com/events/oxford-agentic-bootcamp-cohort-2/ |
| Organiser | Oxford Agentic, Oxford, United Kingdom |
| Contact | hello@oxfordagentic.com |
| Price | `[NEEDS: the Luma price, including any early-bird rate]` |

**Consistency matters more than polish here.** Use the name "Oxford Agentic" and the
venue string exactly as above on every listing. Matching entity strings across sites is
the thing AI engines triangulate on; a listing that says "Oxford Agentic Ltd" or
"Worcester College Oxford" without the street is a weaker signal than the same words
repeated.

---

## Short description (≤140 characters, for cards and directory rows)

> A one-day, hands-on agentic AI bootcamp in Oxford. Build a working agent on a real
> task from your own work. No coding.

## Medium description (~60 words, for most listing forms)

> Cohort 2 of the Oxford Agentic Bootcamp runs on Wednesday 16 September 2026 at
> Worcester College, Oxford. It is a one-day, in-person course for business leaders:
> you bring one real task from your own work and leave having built and run a working
> agentic AI workflow against it. Capped at 25. No coding required.

## Long description (for Eventbrite and anywhere with room)

> **Build agents. In a day. In Oxford.**
>
> Most people who come to this have done the reading. They have sat through the
> sessions, they can talk about agentic AI credibly, and they still could not build
> one if you asked them to tomorrow. That gap is what the day closes.
>
> You bring one real task from your own week. By the time you leave, you have a working
> agentic AI workflow running against it, plus the pattern behind it - a scout step, a
> drafter step and a reviewer step handing off to each other - so you can build the
> next one yourself.
>
> **What you leave with**
> - A working agentic pipeline running against a real task from your own work
> - A review step that checks the output, so the pipeline compounds rather than
>   single-shots
> - A written recipe for the workflow, so you can rebuild and extend it on Monday
>
> **Who it is for**
> - Founders, directors and C-suite building with AI rather than reading about it
> - Graduates of Oxford AI executive education who want the hands-on follow-through
> - Consultants, and senior NHS, university and public-sector staff
> - Anyone who uses AI daily but has never chained several steps together
>
> **How the day runs.** Three build cycles rather than three lectures, in a room capped
> at twenty-five so somebody can walk over when you get stuck. No stretch of talk runs
> past twenty-five minutes. Nothing on the day requires code.
>
> Wednesday 16 September 2026, 09:00–17:00, Worcester College, Walton Street, Oxford.
> Full details and the agenda: https://oxfordagentic.com/events/oxford-agentic-bootcamp-cohort-2/

---

## Where to list it, in order of likely return

1. **Eventbrite** - cited three separate times in the national AI-search answer, which
   makes it the single highest-value listing. Category: Science & Tech → Business.
2. **LinkedIn Company Page**, then the event on it. This also fills the last gap in
   `Organization.sameAs` on the site - add the page URL to `brand.social` in
   `site.config.ts` and the loop will wire it into schema automatically.
3. **UK AI and tech event aggregators** - the ones that surfaced in the probe were
   general listing sites rather than niche AI directories, so breadth beats
   selectivity here.
4. **Oxfordshire business and chamber listings** - lower reach, but they reinforce the
   Oxford entity association that is already working.

## Two things to get right on every listing

- **Link to the site page, not straight to Luma.** The site page is the canonical
  entity with the schema on it; Luma is where the transaction happens. The site page
  carries the booking embed anyway, so nobody loses a click.
- **Do not paraphrase the description differently each time.** Reuse the blocks above
  verbatim. Variation reads as thoroughness to a human and as three different
  half-matching entities to a machine.

---

## Tone rules, if you write anything new

British spelling. Spaced hyphen ( - ), never an em dash. No exclamation marks, no
emoji, no "revolutionary", "unlock", "transform" or "supercharge". Never publish a
price anywhere except the listing's own price field and Luma. Say the concrete thing:
"you leave with a working agent running against your own task" beats any adjective.
