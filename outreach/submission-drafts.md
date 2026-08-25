# Ready-to-send off-page drafts

Written 25 August 2026 in Drummond's voice, per `drummond-voice`. **Nothing here is sent
by the loop.** These exist so sending is a copy-paste job.

Both target the same gap: `Organization.sameAs` is empty, so the entity has no
third-party corroboration anywhere. Search Console's index-coverage report on 24 Aug
confirmed why that matters more than it looked - eleven pages including all three
programme pages are "Discovered, currently not indexed", which is crawl budget on a
five-week-old domain, and external links are what buys it.

---

## 1. research.com - request inclusion in the Oxford AI course comparisons

**Why this one first.** Three of their pages rank for the exact comparison a buyer makes
("Best Oxford AI Courses for Agentic AI", "Oxford AI Courses Compared by Cost and
Duration", "Best Oxford Generative AI Courses"). A listing there sits *inside* the
decision rather than beside it, which is worth more than several event directories.

**Before sending, check one thing.** Their pages returned 403 to automated fetching, so
the loop could not read what is actually on them. Open one and confirm the framing below
still fits - particularly whether they already list any in-person courses.

**Find the contact:** their site footer, or editorial@research.com if listed. If there is
a "suggest a course" form, use that instead and paste the description from
`off-page-listings.md`.

> **Subject:** An in-person Oxford AI course for your comparison pages
>
> Hi [FirstName],
>
> Your Oxford AI course comparisons rank for exactly the question the people I teach are
> asking, and I would like to be considered for inclusion.
>
> I run the Oxford Agentic Bootcamp: a one-day, in-person course where senior people
> build a working agentic AI workflow against a real task from their own work. The next
> cohort is 16 September at Worcester College, Oxford. I also teach Management and AI at
> Oxford's Saïd Business School.
>
> It sits in a different column from the multi-week online programmes, which is what
> makes it useful in a comparison rather than just another entry.
>
> Is there a submission process for these pages, or are they editorial? Happy to send
> details in whatever format is easiest.
>
> Best,
> Drummond
>
> Drummond Gilbert
> https://oxfordagentic.com
> E: hello@oxfordagentic.com

**If they reply asking for details,** send the medium description and fact table from
`off-page-listings.md` verbatim. Consistent entity strings are the whole point.

---

## 2. LinkedIn Company Page

**Why.** It is the fastest external link Drummond fully controls, and the page URL goes
straight into `brand.social` in `site.config.ts`, after which the loop wires it into
`Organization.sameAs` automatically. That is the empty field turning into a real one.

**Create at:** linkedin.com/company/setup/new

| Field | Value |
|---|---|
| Name | Oxford Agentic |
| LinkedIn URL | linkedin.com/company/oxford-agentic |
| Website | https://oxfordagentic.com |
| Industry | Professional Training and Coaching |
| Company size | 2-10 employees |
| Type | Privately held |
| Location | Oxford, United Kingdom |

**Tagline** (120 characters):

> Hands-on agentic AI training in Oxford for business leaders. No coding required, and nothing hand-waved.

**About:**

> The tools improve every month. The ability to actually build with them does not improve
> on its own, and the distance between the two is what widens.
>
> Oxford Agentic runs one-day, in-person bootcamps in Oxford for founders, directors and
> senior professionals who already use AI daily and have hit the ceiling of prompting
> alone. You bring one real task from your own work. You leave with a working agentic AI
> workflow running against it, plus the pattern behind it, so you can build the next one
> yourself.
>
> Three build cycles rather than three lectures, in a small room, with someone on hand
> when you get stuck. Part of the day goes on where these workflows break, how you would
> notice, and what to leave alone. No coding required, and nothing hand-waved.
>
> Two programmes:
>
> The Oxford Agentic Bootcamp, where you build an agentic workflow against a task you
> already do by hand every week.
>
> The Oxford Second Brain Bootcamp, where you build the structured store of your own
> context that AI tools can draw on, so the answers stop coming back generic.
>
> Run by practitioners who build with these tools for a living rather than commentators
> on them.
>
> Next cohorts and full details: https://oxfordagentic.com

**Specialties:** agentic AI, AI training, executive education, AI workflows, AI
automation, second brain, prompt engineering, AI adoption, Oxford

**After it exists:** send the URL and the loop adds it to `brand.social`, which puts it
into `Organization.sameAs` on every page.
