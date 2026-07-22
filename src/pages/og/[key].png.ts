import type { APIRoute, GetStaticPaths } from 'astro';
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

  for (const programme of programmes) {
    entries.push({
      path: paths.programme(programme.data.slug),
      options: { eyebrow: config.brand.name, title: programme.data.name, meta: 'Oxford' },
    });
  }

  if (showSection('guides')) {
    entries.push({
      path: paths.guides(),
      options: { eyebrow: `${config.brand.name} — Guides`, title: 'Writing on agentic AI', meta: 'Oxford' },
    });
  }

  return entries.map(({ path, options }) => ({ params: { key: keyFor(path) }, props: { options } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage((props as { options: OgOptions }).options);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
