import config from '../../site.config';

/**
 * The homepage FAQ, shared by every homepage variant.
 *
 * It lives here rather than in a page because two things need it at once: the
 * <Faq> accordion in the markup, and the FAQPage node in the JSON-LD graph. A
 * copy in each page would eventually answer the same question two ways, and
 * the version crawlers read is the one nobody proofreads.
 *
 * Questions are phrased the way a person would actually ask them — PRD §13.
 */
export const homeFaqs = [
  {
    /*
     * This answer used to be `config.brand.description` verbatim. That string is
     * the canonical entity description reused off-site (PRD §13) and still
     * describes the agentic day alone — so once the Second Brain Bootcamp
     * launched, the single most quoted answer on the site described half the
     * business. The entity string is Drummond's to change, because it must move
     * in step with Luma and LinkedIn; this answer is site copy, and being
     * complete matters more here than being identical.
     */
    q: `What is ${config.brand.name}?`,
    a: `${config.brand.name} runs in-person, hands-on AI training in Oxford for business leaders, across two one-day bootcamps. The Oxford Agentic Bootcamp is where you build and run a working agentic AI workflow on a real task from your own work. The Oxford Second Brain Bootcamp is where you build the structured store of your own context that AI tools draw on. Both are hands-on and capped small. No coding required, and nothing hand-waved.`,
  },
  {
    q: 'Who are the bootcamps for?',
    a: 'Senior people who already use AI daily and have hit the ceiling: good output from a chat window, and still doing the work by hand tomorrow. Founders, directors and C-suite in Oxford and London; senior NHS, university and public-sector staff; consultants and independent operators; product and operations leaders. Engineers and people who build AI for a living are welcome too, and several came to the first cohort. The Oxford Agentic Bootcamp is for building working AI workflows; the Oxford Second Brain Bootcamp is for building the store of your own context those tools draw on.',
  },
  {
    /*
     * "No coding required" is never left as the only framing. On its own it
     * reads to a senior technical buyer as "not serious", and engineers do come:
     * the pairing is what lets one of them forward this page to their COO.
     */
    q: 'Do I need to be technical?',
    a: 'No, and that is not the only thing worth saying about it. Nothing on the day requires code, everything is facilitated in the room, and the cohort is kept small so nobody spends the day stuck on setup. Nothing is hand-waved either: part of the day goes on where these workflows break, how you would notice, and what you constrain so a bad run cannot do damage. Engineers are welcome, and some of the room usually builds AI for a living.',
  },
  {
    q: 'Who is it not for?',
    a: 'People who want a conceptual overview of AI - this is a build day, not a briefing. Anyone who cannot bring a real task from their own work, because the whole day runs against one and without it you get a demonstration instead of an outcome. Anyone expecting a vendor or platform pitch, because no tool is being sold. And anyone who cannot install software on their own laptop: corporate and government devices often block tool sign-ups, so it is worth checking before you book rather than at 09:30 on the day.',
  },
  {
    q: 'Where in Oxford are the events held?',
    a: "In Oxford colleges. Cohort 1 of the Oxford Agentic Bootcamp ran at St Anne's College on 21 July 2026, in a seminar room laid out cabaret-style for small-group work. Cohort 2 is at Worcester College on Walton Street, in central Oxford. Each event page confirms its own venue and date.",
  },
  {
    q: 'Is Oxford Agentic affiliated with the University of Oxford?',
    a: 'No. Oxford Agentic is independent - no affiliation with the University of Oxford, its colleges, or any other institution. We hire the city\'s rooms because they are good rooms, and that is the whole relationship. The name promises the city and the standard of the day rather than a university credential: you leave with something running, which is the point.',
  },
  {
    q: 'What will I actually leave with?',
    a: 'Something running, built during the day from your own material. At the Oxford Agentic Bootcamp that is a working agentic AI workflow against a real task from your own work, plus the pattern behind it - scout, drafter, reviewer - so you can build the next one yourself. At the Oxford Second Brain Bootcamp it is a populated second brain your AI tools can draw on, with the architecture and maintenance routine to keep it useful.',
  },
  {
    /*
     * The format objection, and the one the comparison set makes unavoidable: a
     * buyer looking at this is also looking at three-week online programmes and
     * multi-day courses, and will reasonably ask what a single day can do that
     * those cannot. Nothing on the site answered it (cycle 58 — checked all 41
     * FAQs). The answer is not "we fit more in"; it is that the scope is
     * deliberately narrower, so naming what the day leaves out is the argument
     * rather than an admission.
     */
    q: 'Is one day really enough?',
    a: 'It is enough for one thing done properly, which is what the day is scoped to. It is not a survey of the field: no tour of the AI landscape, no model comparisons, no governance policy. You bring one real task, you build against it in facilitated cycles with someone on hand when you get stuck, and you leave with it running plus the pattern underneath it, which is the part that transfers to the next task. The alternative is not a better day. It is a longer course you attend and then never apply.',
  },
  {
    q: 'Can I bring my team?',
    a: 'Yes. Teams get more out of it than individuals do, and if two of you come, bring the same task. Email hello@oxfordagentic.com and we will arrange it.',
  },
  {
    /*
     * Mentioned once, near the end, as an upside. Deliberately not sold as a
     * reason to book, and deliberately not called a community, a network or an
     * alumni network — those words promise infrastructure. Describe what
     * actually happens instead.
     */
    q: 'What happens after the day?',
    a: 'You leave with the group. Everyone in the room has built the same thing, they stay in touch afterwards, and you hear first when the next one is on - reunions and build sessions, editions for particular functions, and the free meetups. Some are paid and some are free. It is an upside rather than a reason to come.',
  },
  {
    q: 'What if I book but cannot make the date?',
    a: 'Your place transfers to a future cohort at no charge. A date that no longer works should not mean a lost seat - just let us know and we will move you.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pricing is shown on the booking page for each event, along with any early-bird rate. Open the event you are interested in and the booking form sits on that page.',
  },
];
