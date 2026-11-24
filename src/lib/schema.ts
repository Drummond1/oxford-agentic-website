import config from '../../site.config';
import {
  absoluteUrl,
  effectiveStatus,
  isoDuration,
  londonIso,
  londonOffset,
  paths,
  type EventEntry,
  type Facilitator,
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

/**
 * A facilitator as a reference to the `Person` node their own profile publishes.
 *
 * Identity and the name the page prints, and deliberately nothing else: the role
 * and the bio live on the one `Person` node at `/team/<slug>/#person`, so a
 * consumer follows the reference rather than reading a second, thinner copy that
 * can drift from it. Shared by `performer` on an `EducationEvent` and
 * `instructor` on a `CourseInstance`, which name the same people for the same
 * day and were written twice before 18 Nov 2026.
 */
function personReference(person: Facilitator) {
  const url = absoluteUrl(paths.teamMember(person.slug));
  return { '@type': 'Person', '@id': `${url}#person`, name: person.name, url };
}

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
    /* London local time with the offset spelled out, like every other date this
       file publishes. `toISOString()` here restated an authored
       `2026-10-19T14:15:00+01:00` as `2026-10-19T13:15:00.000Z`, which is the
       same instant and the wrong wall clock - and for anything authored in the
       first hour of a British Summer Time day it is also the wrong calendar
       day, which is what the visible date on the page states. */
    ...(page.publishedTime ? { datePublished: londonIso(page.publishedTime) } : {}),
    ...(page.modifiedTime ? { dateModified: londonIso(page.modifiedTime) } : {}),
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

/**
 * The FAQ node, and the one thing it has never said: whose it is.
 *
 * Measured on the built site, 25 Oct 2026. Of the ten top-level node types
 * this site emits, FAQPage was the only one that named no URL at all. Article
 * is bound to its page by `mainEntityOfPage`, CollectionPage by `url` and
 * `isPartOf`, every identified node by its `@id`, and BreadcrumbList carries
 * absolute URLs inside its own items. The FAQ node carried `@type` and
 * `mainEntity` and nothing else: 91 questions across 9 pages, with nothing in
 * them naming the page, the site or the organisation.
 *
 * It is the node holding this site's highest-stakes sentences - that we are not
 * part of the University of Oxford, that the day assumes no code, which venue
 * each cohort is in - and those are the facts answer engines keep getting wrong
 * off third-party listings. A consumer that lifts this node out of the graph
 * should be able to say which page said it.
 *
 * Nothing is asserted. Both values derive from the page's own canonical path,
 * and `#webpage` is the `@id` that page's own WebPage node already publishes.
 * The page itself stays a WebPage: adding FAQPage to its `@type` would claim
 * the FAQ is the page's main content, which on none of these nine pages it is.
 */
export function faqSchema(faqs: Array<{ q: string; a: string }>, path: string) {
  if (faqs.length === 0) return null;
  const url = absoluteUrl(path);
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    isPartOf: { '@id': `${url}#webpage` },
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

  const suffix = londonOffset(base);
  const composed = `${day}T${hh.padStart(2, '0')}:${mm}:00${suffix}`;
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
 *
 * `sameAs` was added 25 Oct 2026, and it is the one identity fact this node was
 * missing. The detail page has carried it since 15 Oct for a documented reason:
 * it names the Luma listing of this same event, so an engine holding both knows
 * they are one thing and which of them is ours. That reason applies here more
 * strongly than it does there, because the detail pages are not what gets read.
 * A search carrying the domain itself on 25 Oct returned no page of
 * oxfordagentic.com and answered off `luma.com/k7c2rm5s` (Cohort 1, July)
 * and `luma.com/oxfordagentic2` (Cohort 2, September) - both passed - giving a
 * buyer a July date, two different colleges as the venue, and "tickets from
 * $275", a price in the wrong currency for a day that has run. That is the
 * twenty-fourth consecutive probe to read this bootcamp off an expired listing,
 * and `luma.com/oxfordagentic3`, the page that sells 19 November, has never
 * appeared in one. The homepage is the page every probe that returns anything
 * of ours returns, and it was the page saying nothing about which listing is
 * live. It is an identity statement, not agenda, photos or series, so it does
 * not reopen the reduction above; and it asserts nothing new, because the URL
 * is already the visible booking link on the cohort's page and already in that
 * page's own Event node under this same `@id`.
 *
 * On a passed cohort it does the same work in the other direction: it binds
 * `luma.com/oxfordagentic2` to a page whose `eventStatus`, dates and prose all
 * say the day ran in September, which is the correction those probes need.
 */
export function eventListingItem(event: EventEntry, ogImage: string) {
  const url = absoluteUrl(paths.event(event.data.slug));

  return {
    '@type': 'EducationEvent',
    '@id': `${url}#event`,
    name: event.data.title,
    description: event.data.capsule,
    startDate: londonIso(event.data.startDate),
    endDate: londonIso(event.data.endDate),
    eventStatus: eventStatusOf(event),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [ogImage],
    location: eventPlace(event),
    organizer: { '@id': ORG_ID },
    /*
     * Who performs the day: the organisation, and only the organisation.
     *
     * Added 18 Nov 2026, and it is the minimum version of this gap rather than
     * the full one. Before it, `/` and `/events/` published ten
     * `EducationEvent` nodes carrying an `organizer` and no `performer` at all,
     * under the same `@id` the cohort's own page uses for a node that names the
     * Organization and then its facilitators. The two did not contradict each
     * other, but one of them said nothing whatever about who delivers the day,
     * and `courseSchema`'s own comment below holds the stance this follows: two
     * descriptions under one `@id` want to agree.
     *
     * The facilitators are deliberately not here. The homepage already names
     * them by the route Google documents for course data - `instructor` on each
     * `CourseInstance` - so repeating the same four `Person` references in this
     * node would publish those people twice in one page's graph. This node is
     * the lighter description of an event by design, and its history is of
     * being quietly over-fed: `image` and `offers` both arrived late, as the
     * comment above records. The Organization is the one performer fact the
     * heavier node has asserted since it was written, so nothing new is said
     * here, and nothing is said that this node's own `organizer` does not
     * already name.
     */
    performer: [{ '@id': ORG_ID }],
    offers: eventOffer(event, url),
    url,
    ...(event.data.lumaUrl ? { sameAs: [event.data.lumaUrl] } : {}),
  };
}

export function eventSchema(
  event: EventEntry,
  programme: ProgrammeEntry,
  ogImage: string,
  photos: Array<{ url: string; caption: string }> = [],
  facilitators: Facilitator[] = [],
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
    const endsAt = next ? agendaInstant(event.data.startDate, next.time) : londonIso(event.data.endDate);

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
    startDate: londonIso(event.data.startDate),
    endDate: londonIso(event.data.endDate),
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
    /*
     * Who performs the day: the organisation, and then the people the page
     * itself names under "Who runs it?".
     *
     * Until 17 Nov 2026 the Organization was the only performer, while every
     * on-sale event page named three or four facilitators in prose and the site
     * published a full `Person` node for each one at `/team/<slug>/#person`.
     * So the graph held both halves of "who teaches this" and joined neither:
     * an engine reading the Event learned that a company runs it, and an engine
     * reading the profile learned a biography with no event attached. The
     * 13 Nov GEO probe is the cost - asked how this site relates to the
     * University of Oxford, the engine had to infer our people from a Luma host
     * list, because nothing here tied a named person to a named day.
     *
     * Each entry asserts nothing the page does not already say in words. The
     * name is the team file's own, not a label made from the slug, and the
     * reference resolves to the one Person node for that person rather than
     * restating their role or bio here, so the two cannot drift.
     *
     * Guarded on `features.team`, for the reason `personSchema` is: with the
     * flag off, `/team/` does not build and these would be references to pages
     * nothing serves, which is the fault the graph-reference rule in
     * `scripts/check-schema.mjs` exists to catch. Flag off, the Organization
     * stands alone exactly as before.
     */
    performer: [
      { '@id': ORG_ID },
      ...(config.features.team ? facilitators.map(personReference) : []),
    ],
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
export function courseSchema(
  programme: ProgrammeEntry,
  upcoming: EventEntry[],
  facilitatorsByEvent: Map<string, Facilitator[]> = new Map(),
) {
  const url = absoluteUrl(paths.programme(programme.data.slug));

  /* Google's course rich result reads the dates, workload and mode off each
     instance. */
  const instances = upcoming.map((event) => {
    const eventUrl = absoluteUrl(paths.event(event.data.slug));

    return {
      '@type': 'CourseInstance',
      /*
       * The cohort's own identifier, added 23 Nov 2026, and the gap it closes is
       * on the homepage rather than across pages.
       *
       * `/` publishes both of these nodes in one graph: `eventListingItem` emits
       * a top-level `EducationEvent` under `<event url>#event` for each upcoming
       * cohort, and the `Course` nodes beside it carried a `CourseInstance` for
       * the same cohort with a name, a URL and no identifier. So one page
       * described one day twice, as two nodes nothing joined. `CourseInstance`
       * and `EducationEvent` are both `Event` subtypes and this is the same day,
       * so the honest statement is that they are one thing.
       *
       * This is the stance `eventListingItem` above already states in as many
       * words - "the `@id` is the one the cohort's own page already publishes, so
       * a consumer holding both describes one event rather than two" - and it is
       * the fifth and last listing on this site to publish bare items, after
       * `/events/` (23 Oct), the guides' `Article.about` (26 Oct), `/bootcamps/`
       * and `/guides/` (22 Nov).
       *
       * It also repairs the premise of a decision made on 18 November.
       * `eventListingItem` declines to name the facilitators because "the
       * homepage already names them by the route Google documents for course data
       * - `instructor` on each `CourseInstance`". That is only true if the two
       * nodes are one node, and until this line they were not: the Event node has
       * no `instructor` and the instance had no address, so nothing said the four
       * `Person` references belong to the day the Event node describes. The `@id`
       * is what makes that reasoning sound.
       *
       * Safe because the two agree, and that was measured on the built homepage
       * before this was written rather than assumed: every property the two nodes
       * share - `name`, `url`, `startDate`, `endDate` and `location` - is
       * byte-identical, because both are derived from this cohort's own
       * frontmatter. What each adds is complementary rather than contradictory:
       * `courseMode`, `courseWorkload` and `instructor` here, and `eventStatus`,
       * `offers`, `image`, `sameAs`, `organizer` and `performer` there. So the
       * rule this function is held to - two descriptions under one `@id` want to
       * agree - is met rather than tested.
       *
       * It cannot drift: it is derived from the same `paths.event(slug)` call
       * `url` below is built from, and `#event` is the fragment the cohort's own
       * page and `eventListingItem` already mint, not a new convention.
       */
      '@id': `${eventUrl}#event`,
      name: event.data.title,
      url: eventUrl,
      courseMode: 'onsite',
      // Computed from the published start and end times, never asserted.
      courseWorkload: isoDuration(event.data.startDate, event.data.endDate),
      startDate: londonIso(event.data.startDate),
      endDate: londonIso(event.data.endDate),
      /*
       * Who teaches this cohort, added 18 Nov 2026 and the same join the
       * `performer` list made on event pages the day before - but on the two
       * surfaces that matter more, because the homepage publishes every `Course`
       * node and `/` is the one page restricted-domain probes have ever returned.
       *
       * Before this, the graph on `/` said who organises the days and nothing
       * about who runs them: `eventListingItem`, the lighter event node this page
       * and `/events/` carry, has no `performer` at all, and the `CourseInstance`
       * nodes beside it had no `instructor`. So the 13 November probe's cost - an
       * engine asked how this site relates to the University of Oxford, inferring
       * our people from a Luma host list - was still unpaid on the page it reads,
       * a day after it was paid on the pages it does not.
       *
       * Nothing new is asserted. The names come from the cohort's own `speakers`,
       * which is the roster its page prints under "Who runs it?", and the
       * programme page that owns this `@id` names the same people in the same
       * order in its own answer. `instructor` is Google's documented property for
       * this on `CourseInstance`, so it is also the field a course rich result
       * reads rather than a field of our own choosing.
       *
       * Guarded on `features.team` for the reason `performer` is: with the flag
       * off `/team/` does not build, and these would reference `Person` nodes
       * nothing serves. Omitted rather than empty when a cohort names nobody,
       * on the same ground as `hasCourseInstance` below.
       */
      ...(config.features.team && (facilitatorsByEvent.get(event.id) ?? []).length > 0
        ? { instructor: (facilitatorsByEvent.get(event.id) ?? []).map(personReference) }
        : {}),
      /* The same Place the event page and the events index publish, from the same
         frontmatter, rather than a second reduced copy of it. This node used to
         drop the street and the postcode, which are published on the event page
         and in its `EducationEvent`, so one venue was described two ways and the
         weaker description sat on the page engines actually return. Nothing new is
         asserted: `eventPlace` reads the same `venue` fields. */
      location: eventPlace(event),
    };
  });

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

/**
 * The series a programme's cohorts already declare membership of, published on
 * the page that owns its `@id`.
 *
 * `eventSchema` above emits, on every event page, a `superEvent` stub whose
 * `@id` is `<programme url>#series`, and says why: "a stable `@id`, so the
 * cohorts of one bootcamp declare membership of one identified series rather
 * than each carrying its own anonymous copy of it". That reasoning is sound and
 * the fragment is correct. What was missing is the other half of it: the
 * programme page at that URL published `Organization`, `WebSite`, `WebPage`,
 * `Course`, `FAQPage` and `BreadcrumbList`, and **no node claiming to be the
 * series**. So the series existed only as identical stubs on the pages of the
 * cohorts that belong to it, and the page an engine would read to learn what
 * the series is said nothing about it.
 *
 * Eighth instance of the shape this ledger has been closing since 22 November -
 * `CollectionPage` joined to its `WebPage`, each `CourseInstance` given the
 * cohort's own Event `@id`, the founder's `worksFor` given the organisation's -
 * and the same test applies: one direction of the edge resolved and the one
 * coming back did not.
 *
 * Nothing new is asserted. `name` and `url` are the two properties the stubs
 * already carry, read from the same `programme.data.name` and the same
 * `paths.programme(slug)` call, so the node and the stubs cannot drift. No
 * price, date, venue, capacity, name, number or outcome is added here.
 *
 * `subEvent` references each scheduled cohort by the `@id` the cohort's own page
 * publishes, which is also the `@id` the `Course` node on this same page gives
 * its `CourseInstance` for that cohort - so these resolve on this page rather
 * than pointing away from it, and the series enumerates its cohorts rather than
 * merely being named. It is omitted rather than empty between cohorts, for the
 * reason `hasCourseInstance` is: `subEvent: []` claims the series has instances
 * and then supplies none.
 *
 * `EventSeries` is not `Event` or `EducationEvent`, so `isEventNode` in
 * `scripts/check-schema.mjs` does not count it and the Event-node totals are
 * unchanged by design - assert that on the built site rather than assume it.
 */
export function eventSeriesSchema(programme: ProgrammeEntry, upcoming: EventEntry[]) {
  const url = absoluteUrl(paths.programme(programme.data.slug));
  const cohorts = upcoming.map((event) => ({
    '@id': `${absoluteUrl(paths.event(event.data.slug))}#event`,
  }));

  return {
    '@type': 'EventSeries',
    '@id': `${url}#series`,
    name: programme.data.name,
    url,
    organizer: { '@id': ORG_ID },
    ...(cohorts.length > 0 ? { subEvent: cohorts } : {}),
  };
}

/**
 * The `@id` and `url` here address the person's own team page, so both have to
 * follow the flag that decides whether that page exists.
 *
 * `organizationSchema` above already does this, and says why in as many words:
 * "When the team section is flagged off that page does not exist, so only the
 * name is asserted." The founder edge was guarded and this node, which names
 * the same people by the same URL, was not - so with `features.team` off,
 * `/about/` published a `Person` whose `@id` and `url` both pointed at a route
 * that does not build. The other call site, `src/pages/team/[...slug].astro`,
 * only renders when the flag is on, so the guard is inert there.
 *
 * Found on 14 November 2026 by the graph-reference rule in
 * `scripts/check-schema.mjs`, which was added in the same commit: the
 * all-flags-off build failed on exactly these two references and on nothing
 * else in this file. The remaining assertions - name, job title, description,
 * `sameAs` - are facts about the person rather than addresses on this site, so
 * they stand either way.
 */
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
    ...(config.features.team ? { '@id': `${absoluteUrl(paths.teamMember(speaker.slug))}#person` } : {}),
    name: speaker.name,
    jobTitle: speaker.role,
    description: speaker.bio,
    ...(config.features.team ? { url: absoluteUrl(paths.teamMember(speaker.slug)) } : {}),
    /*
     * `worksFor` named an organisation and gave no address for it, so on the two
     * pages that publish Drummond's `Person` node - `/about/` and his team page -
     * the graph said this person works for *some* organisation called "Oxford
     * Agentic", while the same page's `Organization` node at `ORG_ID` named this
     * same person as its `founder` by resolvable `@id`. One edge resolved and the
     * one coming back did not.
     *
     * So when the company is this organisation, the node takes this site's own
     * Organization `@id`. Identity only: `name` is unchanged, and `ORG_ID` is the
     * constant the `Organization` node is already minted from, so it cannot drift.
     * No flag guard, unlike the `@id` and `url` above: that node addresses the
     * person's team page, which `features.team` can remove, whereas the
     * `Organization` node is published on every page whatever the flags say.
     *
     * The other five companies stay anonymous and should. Jenesys AI, Novaria,
     * GenieOS, Coppice Labs and Accelerated Impact Ops are other people's
     * organisations; this site publishes no `@id` for any of them, and minting one
     * here would be asserting an identity we do not own. The comparison is an exact
     * match against `config.brand.name`, so a company string that does not match
     * falls back to the anonymous node, which is the behaviour this replaces and
     * therefore the safe direction.
     */
    ...(speaker.company
      ? {
          worksFor: {
            '@type': 'Organization',
            ...(speaker.company === config.brand.name ? { '@id': ORG_ID } : {}),
            name: speaker.company,
          },
        }
      : {}),
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
    /*
     * An identifier, so the hub can reference the article instead of naming it.
     *
     * This node bound to its page through `mainEntityOfPage` alone and carried no
     * `@id`, so there was no address for another page to point at. `/guides/` is
     * the hub for all 32 of them and its `ItemList` published 32 bare `ListItem`s -
     * a position, a name and a URL - which is the shape `/events/` was fixed out of
     * on 23 October and `/bootcamps/` on 22 November. The hub could not be fixed
     * the same way while the thing it lists had nothing to be referenced by.
     *
     * `#article` follows the fragment convention every other node here already
     * uses - `#webpage`, `#event`, `#course`, `#faq`, `#person`, `#series` - and it
     * is derived from the same path `mainEntityOfPage` is built from, so it cannot
     * drift from the page it names. Identity only: no property of this node
     * changed, and nothing is asserted that the guide did not already publish.
     */
    '@id': `${absoluteUrl(paths.guide(guide.slug))}#article`,
    headline: guide.title,
    description: guide.description,
    articleSection: 'Guides',
    // See the note on `webPageSchema`: London local time with its offset, which
    // is the string `src/content.config.ts` insisted the frontmatter be written in.
    datePublished: londonIso(guide.publishDate),
    dateModified: londonIso(guide.updatedDate),
    image: [guide.ogImage],
    author: { '@id': `${absoluteUrl(paths.teamMember(guide.authorSlug))}#person`, '@type': 'Person', name: guide.authorName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${absoluteUrl(paths.guide(guide.slug))}#webpage` },
    inLanguage: 'en-GB',
    /*
     * `about` names the programme the guide supports, and until now it named it
     * as an anonymous `Thing`: a type that says nothing, with no `@id`. So every
     * guide published the string "The Oxford Agentic Bootcamp" and a URL, and
     * nothing tied either to the `Course` node that `/bootcamps/<slug>/` and the
     * homepage already publish under `<url>#course`.
     *
     * That is the one join worth making on this corpus today. The GEO log records
     * an engine holding three URLs of this site - the homepage and two guides -
     * and answering date questions off third-party listings that have expired.
     * The homepage carries all three `Course` nodes with their `hasCourseInstance`
     * dates and venues; the guides carried a blank node pointing at a page the
     * engine does not hold. Giving `about` the identifier the Course already
     * publishes lets a consumer holding a guide and the homepage resolve them to
     * one course rather than two unrelated things.
     *
     * Identity only, the same class as the `@id` on `FAQPage` and the `sameAs` on
     * the event listing. `name` and `url` are unchanged and the `@id` is derived
     * from the same path, so nothing is asserted here that the site does not
     * already publish on the programme's own page.
     */
    ...(guide.about && guide.about.length > 0
      ? {
          about: guide.about.map((item) => ({
            '@type': 'Course',
            '@id': `${absoluteUrl(item.path)}#course`,
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
 *
 * `@id` is `<url>#webpage`, the identifier `webPageSchema` already mints for
 * the same URL, because this node and that one are the same page. Until
 * 23 November 2026 they were two. `/guides/`, `/bootcamps/`, `/events/` and
 * `/team/` each published a `WebPage` under `<url>#webpage` carrying the page's
 * name, description, image and language, and beside it an anonymous
 * `CollectionPage` carrying the item list. So the hub for 32 guides, the page
 * where a buyer picks a programme and the page an engine reads for dates each
 * described themselves twice, and the `ItemList` belonged to no page a consumer
 * could resolve.
 *
 * Sixth instance of one shape, and the first five are fixed: `/events/` on
 * 23 October, the guides' `Article.about` on 26 October, `/bootcamps/` and
 * `/guides/` on 22 November, `CourseInstance` on 23 November. It is also the
 * instance the last of those predicted - a node that names something with its
 * own identifier and does not use it, found outside the `ItemList` family that
 * census was counting.
 *
 * The merge is safe because the two nodes agree on what they share, and that
 * was measured on the built pages before this line was written: `url` and
 * `isPartOf` are byte-identical on all four, both being derived from the same
 * path and the same domain constant. `CollectionPage` is a subtype of
 * `WebPage`, so a consumer merging them gets one node of both types, which is
 * what these pages are.
 *
 * The one property that disagreed was `name`: the `WebPage` publishes the
 * page's title, this node published a short label - "Guides", "Bootcamps",
 * "Events", "Team" - so a merged node would have carried two names for one
 * page. The label is dropped rather than reconciled, because it is already
 * published where it belongs: it is the leaf of each of these pages'
 * `BreadcrumbList`, with the same URL beside it. Nothing is lost, and the
 * `name` parameter goes with it.
 *
 * One caveat for whoever adds the fifth caller. `BaseHead` emits no `WebPage`
 * node on a noindex or hidden page, so a noindex listing would publish this
 * `@id` with nothing beside it: still a correct name for the page, but with no
 * title, description or image at it. All four callers are indexable, checked
 * on the built site. A noindex listing wants its own look at this.
 */
export function collectionPageSchema(
  path: string,
  items: Array<{ name: string; path: string; item?: Record<string, unknown> }>,
) {
  const url = absoluteUrl(path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
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
