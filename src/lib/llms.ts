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

  if (showSection('speakers')) {
    const speakers = await getCollection('speakers');
    pages.push({ title: 'Speakers', path: paths.speakers(), description: 'Who teaches and hosts.' });
    for (const speaker of speakers) {
      pages.push({
        title: speaker.data.name,
        path: paths.speaker(speaker.data.slug),
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
    `- [llms-full.txt](${absoluteUrl('/llms-full.txt')}): the complete text of every page on this site.`,
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
    `Website: ${config.brand.domain}/`,
    `Contact: ${config.brand.email}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '---',
    '',
  ];

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
