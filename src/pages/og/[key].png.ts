import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import config from '../../../site.config';
import { renderOgImage, type OgOptions } from '../../lib/og';
import {
  formatDate,
  getEventsForIndex,
  getProgrammes,
  paths,
  showSection,
  venueLine,
} from '../../lib/site';

/**
 * One 1200×630 card per page, generated at build time (PRD §10, §12).
 *
 * The card set is derived from the same helpers the pages use, so a flagged-off
 * section produces no orphan cards and a brand rename regenerates all of them.
 */

const keyFor = (pagePath: string) => (pagePath.replace(/^\/|\/$/g, '') || 'index').replace(/\//g, '--');

export const getStaticPaths: GetStaticPaths = async () => {
  const { upcoming, past } = await getEventsForIndex();
  const programmes = await getProgrammes();
  const programmeById = new Map(programmes.map((p) => [p.id, p]));

  const entries: Array<{ path: string; options: OgOptions }> = [
    {
      path: paths.home(),
      options: { title: 'Build agents. In a day. In Oxford.', meta: config.brand.tagline },
    },
    {
      path: paths.events(),
      options: { eyebrow: `${config.brand.name} — Events`, title: 'Every cohort, past and upcoming', meta: 'Oxford' },
    },
    {
      path: paths.about(),
      options: { eyebrow: `${config.brand.name} — About`, title: config.brand.tagline, meta: 'Oxford, United Kingdom' },
    },
  ];

  for (const event of [...upcoming, ...past]) {
    const programme = programmeById.get(event.data.programme.id);
    entries.push({
      path: paths.event(event.data.slug),
      options: {
        eyebrow: [programme?.data.name, event.data.edition ?? event.data.cohort].filter(Boolean).join(' — '),
        title: event.data.title,
        meta: `${formatDate(event.data.startDate, { weekday: 'short' })} — ${venueLine(event.data.venue)}`,
      },
    });
  }

  entries.push({
    path: paths.programmes(),
    options: { eyebrow: `${config.brand.name} — Bootcamps`, title: 'One day. Your own real task.', meta: 'Oxford' },
  });

  for (const programme of programmes) {
    entries.push({
      path: paths.programme(programme.data.slug),
      options: { eyebrow: config.brand.name, title: programme.data.name, meta: 'Oxford' },
    });
  }

  if (showSection('team')) {
    entries.push({
      path: paths.team(),
      options: { eyebrow: `${config.brand.name} — Team`, title: 'The people who run the day', meta: 'Oxford' },
    });

    /*
     * A card per person, for the same reason each guide gets one: a shared
     * profile should carry the name of whoever is being shared. Announcing a
     * new facilitator is one of the few things anyone actively posts about this
     * site, and until now that post rendered the generic homepage card with no
     * person on it — the single share where the name is the whole point.
     */
    for (const member of await getCollection('team')) {
      entries.push({
        path: paths.teamMember(member.data.slug),
        options: {
          eyebrow: config.brand.name,
          title: member.data.name,
          meta: [member.data.role, member.data.company].filter(Boolean).join(', '),
        },
      });
    }
  }

  if (showSection('guides')) {
    entries.push({
      path: paths.guides(),
      options: { eyebrow: `${config.brand.name} — Guides`, title: 'Writing on agentic AI', meta: 'Oxford' },
    });

    // A card per guide, so a shared article gets its own headline rather than
    // the generic index card.
    const guides = await getCollection('guides', ({ data }) => !data.draft);
    for (const guide of guides) {
      entries.push({
        path: paths.guide(guide.data.slug),
        options: { eyebrow: `${config.brand.name} — Guide`, title: guide.data.title, meta: config.brand.locality },
      });
    }
  }

  return entries.map(({ path, options }) => ({ params: { key: keyFor(path) }, props: { options } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { options: OgOptions }).options);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
