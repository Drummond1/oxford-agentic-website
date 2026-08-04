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
    q: `What is ${config.brand.name}?`,
    a: config.brand.description,
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
    q: 'What will I actually leave with?',
    a: 'Something running, built during the day from your own material. At the Oxford Agentic Bootcamp that is a working agentic AI workflow against a real task from your own work, plus the pattern behind it - scout, drafter, reviewer - so you can build the next one yourself. At the Oxford Second Brain Bootcamp it is a populated second brain your AI tools can draw on, with the architecture and maintenance routine to keep it useful.',
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
