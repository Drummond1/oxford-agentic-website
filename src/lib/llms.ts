import config from '../../site.config';
import {
  absoluteUrl,
  effectiveStatus,
  formatDate,
  formatTimeRange,
  getEventsForIndex,
  getProgrammes,
  getTestimonials,
  paths,
  showSection,
  venueLine,
} from './site';
import { getCollection } from 'astro:content';
import { homeFaqs } from './home';

/**
 * llms.txt / llms-full.txt — PRD §13.
 *
 * Both are generated from the same collections the pages render from, so a
 * flagged-off section disappears from them automatically and they can never
 * drift from the site.
 */

export interface PageRef {
  title: string;
  path: string;
  description: string;
}

/** Every public page, in the order a reader would want them. */
export async function publicPages(): Promise<PageRef[]> {
  const { upcoming, past } = await getEventsForIndex();
  const programmes = await getProgrammes();

  const pages: PageRef[] = [
    { title: config.brand.name, path: paths.home(), description: config.brand.description },
    {
      title: 'Events',
      path: paths.events(),
      description: 'Every cohort, upcoming and past, with dates and venues.',
    },
    {
      title: 'Bootcamps',
      path: paths.programmes(),
      description: 'The repeating programmes and what each one covers.',
    },
  ];

  for (const programme of programmes) {
    pages.push({
      title: programme.data.name,
      path: paths.programme(programme.data.slug),
      description: programme.data.shortPitch,
    });
  }

  for (const event of [...upcoming, ...past]) {
    pages.push({
      title: event.data.title,
      path: paths.event(event.data.slug),
      description: `${formatDate(event.data.startDate)}, ${venueLine(event.data.venue)}. ${event.data.summary}`,
    });
  }

  if (showSection('testimonials')) {
    pages.push({ title: 'Outcomes', path: paths.testimonials(), description: 'What attendees said, with names and dates.' });
  }

  if (showSection('guides')) {
    const guides = await getCollection('guides', ({ data }) => !data.draft);
    pages.push({ title: 'Guides', path: paths.guides(), description: 'Writing on agentic AI for business leaders.' });
    for (const guide of guides) {
      pages.push({ title: guide.data.title, path: paths.guide(guide.data.slug), description: guide.data.description });
    }
  }

  if (showSection('team')) {
    const speakers = await getCollection('team');
    pages.push({ title: 'Team', path: paths.team(), description: 'The people who run the bootcamp.' });
    for (const speaker of speakers) {
      pages.push({
        title: speaker.data.name,
        path: paths.teamMember(speaker.data.slug),
        description: `${speaker.data.role}${speaker.data.company ? `, ${speaker.data.company}` : ''}.`,
      });
    }
  }

  pages.push({
    title: 'About',
    path: paths.about(),
    description: `Who runs ${config.brand.name}, why it exists, and where it happens.`,
  });

  return pages;
}

export async function renderLlmsTxt(): Promise<string> {
  const pages = await publicPages();
  const { upcoming } = await getEventsForIndex();

  const lines = [
    `# ${config.brand.name}`,
    '',
    `> ${config.brand.longDescription}`,
    '',
    `${config.brand.name} is based in ${config.brand.locality}, ${config.brand.region}, United Kingdom. ` +
      `All events are in person in ${config.brand.locality}. Contact: ${config.brand.email}.`,
    '',
    // The disambiguation AI engines most need (the market conflates Oxford
    // providers with the university - see the 30 Jul GEO probe): independence,
    // stated as a fact of the entity, matching the homepage FAQ's wording.
    `${config.brand.name} is independent: it has no affiliation with the University of Oxford, ` +
      `its colleges, or any other institution. Events are held in hired Oxford venues.`,
    '',
  ];

  if (upcoming.length > 0) {
    lines.push('## Next events', '');
    for (const event of upcoming) {
      lines.push(
        `- [${event.data.title}](${absoluteUrl(paths.event(event.data.slug))}): ` +
          `${formatDate(event.data.startDate)}, ${formatTimeRange(event.data.startDate, event.data.endDate)}, ` +
          `${venueLine(event.data.venue)}. ${event.data.summary}`,
      );
    }
    lines.push('');
  }

  lines.push('## Pages', '');
  for (const page of pages) {
    lines.push(`- [${page.title}](${absoluteUrl(page.path)}): ${page.description}`);
  }

  lines.push(
    '',
    '## Full text',
    '',
    // Describe what is actually in there. It carries the FAQ, the programmes,
    // the events, the people and every guide in full — not the prose of the
    // homepage and About pages, which is rendered in components rather than
    // held as content. Claiming "every page" was a promise the file did not keep.
    `- [llms-full.txt](${absoluteUrl('/llms-full.txt')}): the full text of the FAQ, ` +
      `both bootcamps, every cohort, the people who run them, and all guides.`,
    '',
  );

  return lines.join('\n');
}

export async function renderLlmsFullTxt(): Promise<string> {
  const { upcoming, past } = await getEventsForIndex();
  const programmes = await getProgrammes();
  const programmeById = new Map(programmes.map((p) => [p.id, p]));

  const out: string[] = [
    `# ${config.brand.name} — full site text`,
    '',
    `> ${config.brand.longDescription}`,
    '',
    `Location: ${config.brand.locality}, ${config.brand.region}, United Kingdom.`,
    `Affiliation: independent - no affiliation with the University of Oxford, its colleges, or any other institution.`,
    `Website: ${config.brand.domain}/`,
    `Contact: ${config.brand.email}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '---',
    '',
  ];

  /*
   * The homepage FAQ, first, because it answers the entity-level questions
   * everything below assumes: what this is, who it is for, the two bootcamps and
   * how they differ, the independence point.
   *
   * It was missing entirely until cycle 62, which was the most expensive omission
   * in this file. The 10 Aug GEO probe showed engines lifting these exact answers
   * near-verbatim into result snippets, so they are the highest-value text on the
   * site for this purpose — and the one surface an engine reading llms-full.txt
   * could not see. They live in home.ts precisely so every consumer shares one
   * copy; this is now the third, alongside the accordion and the FAQPage node.
   */
  out.push('## Frequently asked questions', '');
  for (const faq of homeFaqs) {
    out.push(`### ${faq.q}`, '', faq.a, '');
  }
  out.push('---', '');

  for (const programme of programmes) {
    out.push(
      `## Programme: ${programme.data.name}`,
      '',
      `URL: ${absoluteUrl(paths.programme(programme.data.slug))}`,
      `Last updated: ${formatDate(programme.data.updatedDate, { weekday: undefined })}`,
      '',
      programme.data.capsule,
      '',
      programme.data.description,
      '',
    );

    if (programme.data.outcomes.length > 0) {
      out.push('What you leave with:', ...programme.data.outcomes.map((o) => `- ${o}`), '');
    }
    if (programme.data.whoFor.length > 0) {
      out.push('Who it is for:', ...programme.data.whoFor.map((w) => `- ${w}`), '');
    }
    for (const faq of programme.data.faqs) {
      out.push(`### ${faq.q}`, '', faq.a, '');
    }
    out.push('---', '');
  }

  for (const event of [...upcoming, ...past]) {
    const programme = programmeById.get(event.data.programme.id);
    const status = effectiveStatus(event);

    out.push(
      `## Event: ${event.data.title}`,
      '',
      `URL: ${absoluteUrl(paths.event(event.data.slug))}`,
      `Programme: ${programme?.data.name ?? '—'}`,
      `Status: ${status}`,
      `Date: ${formatDate(event.data.startDate)}`,
      `Time: ${formatTimeRange(event.data.startDate, event.data.endDate)} (Europe/London)`,
      `Venue: ${[event.data.venue.name, event.data.venue.street, event.data.venue.city, event.data.venue.postcode]
        .filter(Boolean)
        .join(', ')}${event.data.venue.confirmed ? '' : ' (room booking being finalised)'}`,
      ...(event.data.capacity ? [`Capacity: capped at ${event.data.capacity}`] : []),
      '',
      event.data.capsule,
      '',
    );

    if (event.data.whoFor.length > 0) {
      out.push('Who it is for:', ...event.data.whoFor.map((w) => `- ${w}`), '');
    }
    if (event.data.whatYoullBuild.length > 0) {
      out.push('What you will build:', ...event.data.whatYoullBuild.map((w) => `- ${w}`), '');
    }
    if (event.data.agenda.length > 0) {
      out.push(
        'Agenda:',
        ...event.data.agenda.map((a) => `- ${a.time} ${a.title}${a.detail ? ` — ${a.detail}` : ''}`),
        '',
      );
    }
    if (event.data.outcomes.length > 0) {
      out.push('Outcomes:', ...event.data.outcomes.map((o) => `- ${o.stat} ${o.label}`), '');
    }
    for (const faq of event.data.faqs) {
      out.push(`### ${faq.q}`, '', faq.a, '');
    }
    out.push('---', '');
  }

  const testimonials = await getTestimonials();
  if (testimonials.length > 0) {
    out.push('## Outcomes and testimonials', '');
    for (const t of testimonials) {
      out.push(
        `"${t.data.quote}" — ${t.data.name}, ${t.data.role}${t.data.company ? `, ${t.data.company}` : ''}` +
          `${t.data.cohort ? ` (${t.data.cohort}, ${formatDate(t.data.date, { weekday: undefined })})` : ''}`,
        '',
      );
    }
    out.push('---', '');
  }

  /*
   * The people. Also missing until cycle 62, and it matters for the same reason
   * the About page carries the Person schema: engines establish an entity by
   * triangulating it across sources, and a training business whose full text
   * names nobody is harder to place than one that does.
   */
  if (showSection('team')) {
    const team = await getCollection('team');
    if (team.length > 0) {
      out.push('## People', '');
      for (const person of [...team].sort((a, b) => a.data.order - b.data.order)) {
        out.push(
          `### ${person.data.name}`,
          '',
          `URL: ${absoluteUrl(paths.teamMember(person.data.slug))}`,
          `Role: ${person.data.role}${person.data.company ? `, ${person.data.company}` : ''}`,
          '',
          person.data.bio,
          '',
        );
      }
      out.push('---', '');
    }
  }

  if (showSection('guides')) {
    const guides = await getCollection('guides', ({ data }) => !data.draft);
    for (const guide of guides) {
      out.push(
        `## Guide: ${guide.data.title}`,
        '',
        `URL: ${absoluteUrl(paths.guide(guide.data.slug))}`,
        `Updated: ${formatDate(guide.data.updatedDate, { weekday: undefined })}`,
        '',
        guide.data.capsule,
        '',
        guide.body ?? '',
        '',
        '---',
        '',
      );
    }
  }

  return out.join('\n');
}
