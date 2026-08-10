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
    a: `${config.brand.name} runs in-person, hands-on AI training in Oxford for business leaders, across two one-day bootcamps. The Oxford Agentic Bootcamp is where you build and run a working agentic AI workflow on a real task from your own work. The Oxford Second Brain Bootcamp is where you build the structured store of your own context that AI tools draw on. Both are hands-on, capped small, and require no coding.`,
  },
  {
    q: 'Who are the bootcamps for?',
    a: 'Senior people who already use AI and now want to build with it: founders, directors, C-suite, consultants, and senior public-sector, NHS and university staff. The Oxford Agentic Bootcamp is for building working AI workflows; the Oxford Second Brain Bootcamp is for building the store of your own context those tools draw on. Both suit anyone who has done an executive AI course and wants the hands-on follow-through.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. Nothing on the day requires code. Everything is facilitated in the room, and the cohort is kept small so nobody spends the day stuck on setup.',
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
    a: 'Yes. Teams are welcome, and bringing a colleague means the same pattern goes back to work with two of you rather than one. Email hello@oxfordagentic.com and we will arrange it.',
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
