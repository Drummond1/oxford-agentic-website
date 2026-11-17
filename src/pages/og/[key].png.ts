import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import config from '../../../site.config';
import { homeHeadline } from '../../lib/home';
import { renderOgImage, type OgOptions } from '../../lib/og';
import {
  formatDate,
  getEvents,
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
 *
 * Every separator below is a spaced hyphen, never an em dash. The house style
 * has none, `Base.astro` joins a page title to the brand with ' - ', and
 * `events/[slug].astro` builds the identical eyebrow with ' - '. These cards
 * were the last surface publishing em dashes in visible copy, and no text
 * check can see them, because they live inside a PNG. Fixed 17 November 2026,
 * and guarded at the bottom of this function.
 */

const keyFor = (pagePath: string) => (pagePath.replace(/^\/|\/$/g, '') || 'index').replace(/\//g, '--');

export const getStaticPaths: GetStaticPaths = async () => {
  /*
   * Every event that gets a page needs a card, so this reads the collection
   * rather than the listing helper.
   *
   * `getEventsForIndex` drops past events when `features.pastEvents` is off,
   * because that flag governs what the listings SHOW. It does not govern which
   * pages exist: `src/pages/events/[slug].astro` builds from `getEvents()`, so
   * all five cohorts keep their page whatever the flag says. Reading the
   * listing helper here therefore skipped the three past cohorts' cards in the
   * all-flags-off build, leaving each of those pages pointing `og:image` and
   * `primaryImageOfPage.url` at a PNG that was never written.
   *
   * With the flag on, which is production today, the set is identical and no
   * byte of `dist` moves. Found on 14 November 2026 by the graph-reference rule
   * added to `scripts/check-schema.mjs` in the same commit.
   */
  const events = await getEvents();
  const programmes = await getProgrammes();
  const programmeById = new Map(programmes.map((p) => [p.id, p]));

  const entries: Array<{ path: string; options: OgOptions }> = [
    {
      path: paths.home(),
      /*
       * The hero's own headline, imported rather than repeated. This card said
       * "Build agents. In a day. In Oxford." until 17 November 2026 - the
       * positioning the message house replaced on 13 August, still being shown
       * to everyone who shared the site. See `homeHeadline` in src/lib/home.ts.
       */
      options: { title: homeHeadline, meta: config.brand.tagline },
    },
    {
      path: paths.events(),
      options: { eyebrow: `${config.brand.name} - Events`, title: 'Every cohort, past and upcoming', meta: 'Oxford' },
    },
    {
      path: paths.about(),
      options: { eyebrow: `${config.brand.name} - About`, title: config.brand.tagline, meta: 'Oxford, United Kingdom' },
    },
  ];

  for (const event of events) {
    const programme = programmeById.get(event.data.programme.id);
    entries.push({
      path: paths.event(event.data.slug),
      options: {
        eyebrow: [programme?.data.name, event.data.edition ?? event.data.cohort].filter(Boolean).join(' - '),
        title: event.data.title,
        meta: `${formatDate(event.data.startDate, { weekday: 'short' })} - ${venueLine(event.data.venue)}`,
      },
    });
  }

  entries.push({
    path: paths.programmes(),
    options: { eyebrow: `${config.brand.name} - Bootcamps`, title: 'One day. Your own real task.', meta: 'Oxford' },
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
      options: { eyebrow: `${config.brand.name} - Team`, title: 'The people who run it', meta: 'Oxford' },
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
      options: { eyebrow: `${config.brand.name} - Guides`, title: 'Writing on agentic AI', meta: 'Oxford' },
    });

    // A card per guide, so a shared article gets its own headline rather than
    // the generic index card.
    const guides = await getCollection('guides', ({ data }) => !data.draft);
    for (const guide of guides) {
      entries.push({
        path: paths.guide(guide.data.slug),
        options: { eyebrow: `${config.brand.name} - Guide`, title: guide.data.title, meta: config.brand.locality },
      });
    }
  }

  /*
   * The guard the em-dash sweep earned. Card text is painted into a PNG, so no
   * check over `dist` can read it: the stale strings above survived every text
   * check the repo has. This one runs at build time, on the strings themselves,
   * and fails the build rather than shipping a card nobody can grep.
   */
  for (const { path, options } of entries) {
    for (const [field, value] of Object.entries(options)) {
      if (typeof value === 'string' && /[\u2014\u2013]/.test(value)) {
        throw new Error(`og card ${path}: ${field} uses an en or em dash. House style is a spaced hyphen.`);
      }
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
