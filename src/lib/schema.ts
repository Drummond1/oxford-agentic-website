import config from '../../site.config';
import {
  absoluteUrl,
  effectiveStatus,
  isoDuration,
  paths,
  type EventEntry,
  type ProgrammeEntry,
} from './site';

/**
 * Structured data — PRD §12.
 *
 * Everything here derives from site.config and content frontmatter, so a brand
 * rename propagates into schema in the same build. `scripts/check-schema.mjs`
 * re-parses the emitted JSON-LD after every build.
 */

/** Stable @id for the Organization so every page references one entity node. */
export const ORG_ID = `${config.brand.domain}/#organization`;

export function organizationSchema(founder?: { name: string; slug: string }) {
  /*
   * `sameAs` means "a page that unambiguously identifies THIS entity". A personal
   * LinkedIn profile (linkedin.com/in/…) identifies a person, not the organisation
   * — and the same URL is already the Person node's `sameAs` via the team file.
   * Claiming it in both places tells an engine the org and the person are one
   * entity, which is the opposite of the triangulation the whole schema layer is
   * for. Company pages (linkedin.com/company/…) are the org's own identity and
   * belong here; they pass this filter untouched.
   *
   * The link still renders in the footer, where a human reads it correctly.
   */
  const sameAs = Object.values(config.brand.social)
    .filter(Boolean)
    .filter((url) => !/linkedin\.com\/in\//i.test(url as string));

  /*
   * The founder edge, sourced from the team collection's `isHost` entry rather
   * than a string here — people facts live in content, not code. The @id
   * matches the Person node on the team page, so the two references resolve to
   * one entity. When the team section is flagged off that page does not exist,
   * so only the name is asserted.
   */
  const founderNode = founder
    ? {
        founder: {
          '@type': 'Person',
          name: founder.name,
          ...(config.features.team
            ? {
                '@id': `${absoluteUrl(paths.teamMember(founder.slug))}#person`,
                url: absoluteUrl(paths.teamMember(founder.slug)),
              }
            : {}),
        },
      }
    : {};

  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: config.brand.name,
    url: `${config.brand.domain}/`,
    description: config.brand.description,
    /*
     * schema.org's own field for telling this entity apart from similar ones,
     * which is the live failure mode rather than a hypothetical: the probes in
     * `seo-data/geo-citations.md` keep returning a similarly named Oxford AI
     * provider's review page, and Saïd Business School's own agentic programme,
     * on this organisation's subject. See the note on `brand.disambiguation`.
     */
    disambiguatingDescription: config.brand.disambiguation,
    email: config.brand.email,
    ...founderNode,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: config.brand.locality,
      addressRegion: config.brand.region,
      addressCountry: config.brand.country,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${config.brand.domain}/#website`,
    url: `${config.brand.domain}/`,
    name: config.brand.name,
    description: config.brand.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-GB',
  };
}

/**
 * A WebPage node for every page, so each URL is a first-class entity rather
 * than existing only as the `mainEntityOfPage` string of its Article or the
 * `url` of its Event. `isPartOf` ties it to the WebSite node, which ties to the
 * Organization — one connected graph per page, which is the entity-consistency
 * signal AI engines triangulate on (PRD §13).
 */
export function webPageSchema(page: {
  title: string;
  description: string;
  path: string;
  ogImage: string;
  publishedTime?: Date;
  modifiedTime?: Date;
}) {
  const url = absoluteUrl(page.path);
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${config.brand.domain}/#website` },
    primaryImageOfPage: { '@type': 'ImageObject', url: page.ogImage },
    inLanguage: 'en-GB',
    ...(page.publishedTime ? { datePublished: page.publishedTime.toISOString() } : {}),
    ...(page.modifiedTime ? { dateModified: page.modifiedTime.toISOString() } : {}),
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  if (faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/**
 * Event schema — the one that earns Google's event rich results.
 *
 * `offers.url` points at OUR event page, not Luma: the site is the canonical
 * place to register, and the embed lives there.
 */
/**
 * Compose a real datetime for an agenda row from the event's own date and
 * offset, so "09:15" becomes a precise instant rather than a bare label.
 * Returns null for anything that is not a HH:MM time, so a free-text agenda
 * row simply carries no timestamp instead of an invented one.
 */
function agendaInstant(eventStart: Date, time: string): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;

  // Rebuild from the event's own ISO string to inherit its UTC offset exactly.
  const iso = eventStart.toISOString();
  const base = new Date(iso);
  const [, hh, mm] = match;
  // Event dates are authored with a London offset; derive the day in that zone.
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(base);

  const offset = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    timeZoneName: 'longOffset',
  })
    .formatToParts(base)
    .find((part) => part.type === 'timeZoneName')?.value;

  const suffix = offset?.replace('GMT', '') || '+00:00';
  const composed = `${day}T${hh.padStart(2, '0')}:${mm}:00${suffix || '+00:00'}`;
  return Number.isNaN(Date.parse(composed)) ? null : composed;
}

/**
 * The venue, as a Place. Shared so the event page and the events index describe
 * one address rather than two that have to be kept in step by hand.
 */
function eventPlace(event: EventEntry) {
  return {
    '@type': 'Place',
    name: event.data.venue.name,
    address: {
      '@type': 'PostalAddress',
      ...(event.data.venue.street ? { streetAddress: event.data.venue.street } : {}),
      addressLocality: event.data.venue.city,
      addressRegion: config.brand.region,
      ...(event.data.venue.postcode ? { postalCode: event.data.venue.postcode } : {}),
      addressCountry: config.brand.country,
    },
  };
}

/** Cancelled is authored; everything else is scheduled, past days included. */
function eventStatusOf(event: EventEntry) {
  return effectiveStatus(event) === 'cancelled'
    ? 'https://schema.org/EventCancelled'
    : 'https://schema.org/EventScheduled';
}

/**
 * The price-free Offer every page that describes a cohort publishes.
 *
 * `availability` is only ever asserted from a fact somebody authored.
 *
 * It used to fall through to SoldOut for every other case, which meant every
 * past day published a machine-readable "sold out" claim. Two of the three
 * never made that claim anywhere: nothing on the site says Cohort 1 filled up,
 * and the Second Brain Cohort 1 file records that nothing about the day is
 * confirmed. A day that has simply happened is not sold out - schema.org has
 * no term for "this has run", and SoldOut reads as "it filled up".
 *
 * Cohort 2 did sell out, and that fact is not lost: it is published in the
 * summary and the capsule, so it is inside the node's `description`, in the
 * words the author chose. What goes is the inference, not the evidence.
 *
 * The Offer stays valid without it - `availability` is recommended rather than
 * required, as `price` is, which is already omitted deliberately (PRD §18).
 *
 * No `validFrom`. It used to be `new Date()`, which stamped every build time
 * into the offer and told search engines tickets had just gone on sale. Luma
 * publishes no on-sale date for these passes (`valid_start_at` is null), so
 * they are not date-restricted offers, which is the only case Google asks for
 * validFrom. Add it back only from a real Luma `valid_start_at`.
 *
 * Shared, so the cohort's own page and every page that lists it cannot come to
 * disagree about whether a day is open - the same reason `eventPlace` and
 * `eventStatusOf` above are shared.
 */
function eventOffer(event: EventEntry, url: string) {
  const status = effectiveStatus(event);
  const availability =
    status === 'soldout'
      ? 'https://schema.org/SoldOut'
      : status === 'upcoming'
        ? 'https://schema.org/InStock'
        : undefined;

  return {
    '@type': 'Offer',
    url,
    ...(availability ? { availability } : {}),
    category: 'Paid',
  };
}

/**
 * One cohort as the events index lists it: when it is, where it is, and which
 * page is the whole of it.
 *
 * `/events/` is titled "AI bootcamp dates in Oxford" and every card on it shows
 * a date and a venue, but its `ItemList` published five names and five URLs and
 * not one date. So the page an engine would read to answer "when is the next
 * cohort?" carried, machine-readably, no answer - while a third-party listing
 * with a July date did. Twelve consecutive GEO probes have recorded an engine
 * taking a passed date off someone else's crawl; this closes the half of that
 * which is ours.
 *
 * The `@id` is the one the cohort's own page already publishes, so a consumer
 * holding both describes one event rather than two. Nothing here is a new fact:
 * every field is on the detail page and on the card. The agenda, the photos and
 * the series stay on the detail page, which is what the `url` is for.
 *
 * `image` and `offers` are here because Google requires them on an Event, and
 * because this node is now also emitted at the top level of the homepage's
 * graph. Nested inside an `ItemList`, as `/events/` emits it, the project's own
 * schema checker never reached it - it reads top-level `@graph` nodes - so a
 * node missing two required fields passed every build since it was written. An
 * Event without them is not eligible for an event rich result, and both are
 * derived rather than new: the image is the cohort's own OG card, and the Offer
 * is the price-free one its page already publishes, from the same helper.
 */
export function eventListingItem(event: EventEntry, ogImage: string) {
  const url = absoluteUrl(paths.event(event.data.slug));

  return {
    '@type': 'EducationEvent',
    '@id': `${url}#event`,
    name: event.data.title,
    description: event.data.capsule,
    startDate: event.data.startDate.toISOString(),
    endDate: event.data.endDate.toISOString(),
    eventStatus: eventStatusOf(event),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [ogImage],
    location: eventPlace(event),
    organizer: { '@id': ORG_ID },
    offers: eventOffer(event, url),
    url,
  };
}

export function eventSchema(
  event: EventEntry,
  programme: ProgrammeEntry,
  ogImage: string,
  photos: Array<{ url: string; caption: string }> = [],
) {
  const url = absoluteUrl(paths.event(event.data.slug));
  const eventStatus = eventStatusOf(event);

  /*
   * The published agenda, as machine-readable sub-events. An assistant asked
   * "what does the day look like?" can read the actual schedule rather than
   * guessing from prose.
   *
   * Only rows with a parseable clock time become sub-events. This used to emit
   * every row and simply omit the timestamp where there was none, on the
   * principle that nothing should be invented. That principle is right and is
   * kept: no time is guessed. But `startDate` is required on schema.org Event,
   * so a row without one is not an untimed event, it is an **invalid** one, and
   * Google rejects the whole item rather than the missing field. Search Console
   * reported exactly four invalid Event items on 25 Aug 2026 - the Second Brain
   * agenda, whose rows read "Morning", "Midday", "Afternoon" and "Close"
   * because that day genuinely is not scheduled to the minute.
   *
   * Those rows still render in the visible agenda. They just stop making a
   * machine-readable claim that cannot be completed. Not inventing a fact and
   * not asserting an incomplete one are the same discipline.
   */
  const subEvents = event.data.agenda.flatMap((item, index) => {
    const startsAt = agendaInstant(event.data.startDate, item.time);
    if (!startsAt) return [];

    const next = event.data.agenda[index + 1];
    const endsAt = next ? agendaInstant(event.data.startDate, next.time) : event.data.endDate.toISOString();

    return [
      {
        '@type': 'Event',
        name: item.title,
        ...(item.detail ? { description: item.detail } : {}),
        startDate: startsAt,
        ...(endsAt ? { endDate: endsAt } : {}),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: event.data.venue.name },
        superEvent: { '@id': `${url}#event` },
      },
    ];
  });

  return {
    '@type': 'EducationEvent',
    '@id': `${url}#event`,
    name: event.data.title,
    description: event.data.capsule,
    startDate: event.data.startDate.toISOString(),
    endDate: event.data.endDate.toISOString(),
    eventStatus,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    // Real photography first-class: each frame carries its caption (the alt
    // text), so an engine citing the image knows what it shows.
    image: [
      ogImage,
      ...photos.map((photo) => ({ '@type': 'ImageObject', url: photo.url, caption: photo.caption })),
    ],
    url,
    /*
     * `sameAs` names the Luma listing of this same event.
     *
     * Added 15 Oct 2026 from a GEO probe, not from theory. Asked our own
     * proposition back ("one day AI course Oxford where you build a working
     * workflow on your own task") a web engine answered that the Oxford
     * Agentic Bootcamp was the closest match and the only one in Oxford, then
     * cited two Luma listings and a third-party directory page - and not
     * oxfordagentic.com. Both Luma listings are past cohorts, so the engine
     * read their two venues and two host lists as contradictions in one event
     * and told the reader the date had passed and to look for a newer session.
     *
     * Nothing here fixes retrieval. What it does is give an engine that holds
     * both pages the one fact it was missing: that the Luma listing and this
     * page are the same event, and which of them is ours. Each cohort's URL is
     * already published on its own page as the booking link, so this asserts
     * no new fact.
     */
    ...(event.data.lumaUrl ? { sameAs: [event.data.lumaUrl] } : {}),
    inLanguage: 'en-GB',
    location: eventPlace(event),
    organizer: { '@id': ORG_ID },
    performer: { '@id': ORG_ID },
    superEvent: {
      '@type': 'EventSeries',
      // A stable @id, so the cohorts of one bootcamp declare membership of one
      // identified series rather than each carrying its own anonymous copy of
      // it. Three Agentic cohorts previously emitted three unlinked
      // EventSeries nodes that happened to share a name.
      '@id': `${absoluteUrl(paths.programme(programme.data.slug))}#series`,
      name: programme.data.name,
      url: absoluteUrl(paths.programme(programme.data.slug)),
    },
    ...(subEvents.length > 0 ? { subEvent: subEvents } : {}),
    ...(event.data.capacity ? { maximumAttendeeCapacity: event.data.capacity } : {}),
    // Price lives on Luma and is deliberately not published here — PRD §18.
    // `eventOffer` above holds the availability and validFrom reasoning.
    offers: eventOffer(event, url),
  };
}

/**
 * A programme as a `Course`, with a `CourseInstance` per scheduled cohort.
 *
 * Shared because the homepage publishes this node too, from 24 October 2026.
 * Restricted to this domain, the engine holds `/` and two guides and nothing
 * else, so every fact it quotes about these bootcamps it reads off the
 * homepage - while the three rich `Course` nodes sat only on
 * `/bootcamps/<slug>/`, a page it has never returned. The cost is measured:
 * asked for a November cohort of this bootcamp it offered Oxford Saïd's
 * four-week online programme instead, and earlier probes closed on not being able to
 * confirm "its length, format, or whether attendees build their own workflow"
 * and on not finding "the course's prerequisites". `courseMode`,
 * `courseWorkload` and a dated instance at a named Oxford venue are the first
 * three of those, machine-readably, on the page that gets read.
 *
 * The `@id` is the one the programme's own page already publishes, so a
 * consumer holding both describes one course rather than two. That is also why
 * both pages emit the identical node from this one function rather than each
 * page's own view of it: two descriptions under one `@id` that disagree are
 * worse than one of them not existing. Nothing here is a new fact - `teaches`
 * is the published `outcomes` list, `description` the published capsule, and
 * the instances are the published cohorts.
 *
 * `hasCourseInstance` is omitted rather than empty when a programme has no
 * scheduled run: `hasCourseInstance: []` claims the course has instances and
 * then supplies none, which is malformed, and the node is still a valid
 * `Course` without it.
 */
export function courseSchema(programme: ProgrammeEntry, upcoming: EventEntry[]) {
  const url = absoluteUrl(paths.programme(programme.data.slug));

  /* Google's course rich result reads the dates, workload and mode off each
     instance. */
  const instances = upcoming.map((event) => ({
    '@type': 'CourseInstance',
    name: event.data.title,
    url: absoluteUrl(paths.event(event.data.slug)),
    courseMode: 'onsite',
    // Computed from the published start and end times, never asserted.
    courseWorkload: isoDuration(event.data.startDate, event.data.endDate),
    startDate: event.data.startDate.toISOString(),
    endDate: event.data.endDate.toISOString(),
    location: {
      '@type': 'Place',
      name: event.data.venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.data.venue.city,
        addressCountry: config.brand.country,
      },
    },
  }));

  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: programme.data.name,
    description: programme.data.capsule,
    url,
    provider: { '@id': ORG_ID },
    inLanguage: 'en-GB',
    teaches: programme.data.outcomes,
    courseMode: 'onsite',
    /* Both come straight off the programme's own published copy - `whoFor` is
       the "Who is this for?" list a reader sees, and `prerequisites` restates
       that page's own FAQ answers (see the note on the field). Nothing is
       asserted here that the page does not say in prose. */
    ...(programme.data.whoFor.length > 0
      ? { audience: { '@type': 'Audience', audienceType: programme.data.whoFor } }
      : {}),
    ...(programme.data.prerequisites ? { coursePrerequisites: programme.data.prerequisites } : {}),
    ...(instances.length > 0 ? { hasCourseInstance: instances } : {}),
  };
}

export function personSchema(speaker: {
  name: string;
  slug: string;
  role: string;
  company?: string;
  bio: string;
  links: { linkedin?: string; x?: string; website?: string };
}) {
  const sameAs = Object.values(speaker.links).filter(Boolean);
  return {
    '@type': 'Person',
    '@id': `${absoluteUrl(paths.teamMember(speaker.slug))}#person`,
    name: speaker.name,
    jobTitle: speaker.role,
    description: speaker.bio,
    url: absoluteUrl(paths.teamMember(speaker.slug)),
    ...(speaker.company ? { worksFor: { '@type': 'Organization', name: speaker.company } } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function articleSchema(guide: {
  title: string;
  slug: string;
  description: string;
  publishDate: Date;
  updatedDate: Date;
  authorName: string;
  authorSlug: string;
  ogImage: string;
  /** The programmes this guide supports — becomes `about`, tying Article to Course. */
  about?: Array<{ name: string; path: string }>;
}) {
  return {
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    articleSection: 'Guides',
    datePublished: guide.publishDate.toISOString(),
    dateModified: guide.updatedDate.toISOString(),
    image: [guide.ogImage],
    author: { '@id': `${absoluteUrl(paths.teamMember(guide.authorSlug))}#person`, '@type': 'Person', name: guide.authorName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${absoluteUrl(paths.guide(guide.slug))}#webpage` },
    inLanguage: 'en-GB',
    ...(guide.about && guide.about.length > 0
      ? {
          about: guide.about.map((item) => ({
            '@type': 'Thing',
            name: item.name,
            url: absoluteUrl(item.path),
          })),
        }
      : {}),
  };
}

/**
 * A listing page and the things it lists.
 *
 * The same twenty lines were written inline on the guides index and the events
 * index and nowhere else, so /bootcamps/, /team/ and /testimonials/ - three
 * pages that are just as much listings - carried no ItemList at all. That is
 * the recurring shape in this codebase: a treatment applied by hand in two
 * places and silently absent from the rest. Sharing it is what stops a sixth
 * listing page inheriting the gap.
 */
export function collectionPageSchema(
  name: string,
  path: string,
  items: Array<{ name: string; path: string; item?: Record<string, unknown> }>,
) {
  return {
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${config.brand.domain}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((entry, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: entry.name,
        url: absoluteUrl(entry.path),
        // Optional, because most listings here list pages. Where the listed
        // thing is an entity in its own right - a dated cohort - the list can
        // carry it instead of only pointing at it.
        ...(entry.item ? { item: entry.item } : {}),
      })),
    },
  };
}

/** Wraps the page's nodes into a single @graph so entities cross-reference. */
export function graph(nodes: Array<Record<string, unknown> | null>) {
  return JSON.stringify(
    { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) },
    null,
    0,
  );
}
