import { getCollection, type CollectionEntry } from 'astro:content';
import config from '../../site.config';

export { config };

export type EventEntry = CollectionEntry<'events'>;
export type ProgrammeEntry = CollectionEntry<'programmes'>;

/** Absolute URL for a site-relative path. Trailing slashes are enforced. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || clean.includes('.') ? clean : `${clean}/`;
  return `${config.brand.domain}${withSlash}`;
}

export const paths = {
  home: () => '/',
  events: () => '/events/',
  event: (slug: string) => `/events/${slug}/`,
  programmes: () => '/bootcamps/',
  programme: (slug: string) => `/bootcamps/${slug}/`,
  speakers: () => '/speakers/',
  speaker: (slug: string) => `/speakers/${slug}/`,
  testimonials: () => '/testimonials/',
  guides: () => '/guides/',
  guide: (slug: string) => `/guides/${slug}/`,
  about: () => '/about/',
};

/* ------------------------------------------------------------------ *
 * Events
 * ------------------------------------------------------------------ */

/**
 * A live event's status is derived, not trusted. Frontmatter can say
 * `upcoming` for an event whose date has passed — the site must not.
 */
export function effectiveStatus(event: EventEntry, now = new Date()): EventEntry['data']['status'] {
  if (event.data.status === 'cancelled') return 'cancelled';
  if (event.data.endDate < now) return 'past';
  return event.data.status === 'past' ? 'upcoming' : event.data.status;
}

export function isUpcoming(event: EventEntry, now = new Date()): boolean {
  const status = effectiveStatus(event, now);
  return status === 'upcoming' || status === 'soldout';
}

export async function getEvents(): Promise<EventEntry[]> {
  const all = await getCollection('events', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.startDate.getTime() - b.data.startDate.getTime());
}

/** Upcoming first (soonest first), then past (most recent first) — PRD §6. */
export async function getEventsForIndex(now = new Date()) {
  const all = await getEvents();
  const upcoming = all.filter((e) => isUpcoming(e, now));
  const past = config.features.pastEvents
    ? all.filter((e) => !isUpcoming(e, now)).reverse()
    : [];
  return { upcoming, past };
}

/** The single soonest upcoming event — powers the header CTA. */
export async function getNextEvent(now = new Date()): Promise<EventEntry | undefined> {
  const { upcoming } = await getEventsForIndex(now);
  return upcoming[0];
}

/**
 * For a past event page: the next run of the SAME programme, so the page still
 * converts. Falls back to any upcoming event, then to the events index — PRD §6.
 */
export async function getSuccessorEvent(event: EventEntry, now = new Date()) {
  const { upcoming } = await getEventsForIndex(now);
  return upcoming.find((e) => e.data.programme.id === event.data.programme.id) ?? upcoming[0];
}

export async function getEventsForProgramme(programmeId: string, now = new Date()) {
  const all = await getEvents();
  const mine = all.filter((e) => e.data.programme.id === programmeId);
  return {
    upcoming: mine.filter((e) => isUpcoming(e, now)),
    past: config.features.pastEvents ? mine.filter((e) => !isUpcoming(e, now)).reverse() : [],
  };
}

export async function getProgrammes(): Promise<ProgrammeEntry[]> {
  const all = await getCollection('programmes');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Testimonials are filtered by consent BEFORE anything else. PRD §21: names may
 * not appear until the "can we quote you?" ask comes back yes.
 */
export async function getTestimonials(programmeId?: string) {
  if (!config.features.testimonials) return [];
  const all = await getCollection('testimonials', ({ data }) => data.consentGiven);
  const filtered = programmeId ? all.filter((t) => t.data.programme.id === programmeId) : all;
  return filtered.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Photos are consent-gated the same way testimonials are (PRD §21): anything
 * showing an identifiable attendee stays out of the build until cleared.
 */
export async function getPhotos(tag?: string, eventId?: string) {
  const all = await getCollection('photos', ({ data }) => data.consentCleared);
  return all
    .filter((p) => (tag ? p.data.tags.includes(tag as never) : true))
    .filter((p) => (eventId ? p.data.event?.id === eventId : true))
    .sort((a, b) => a.data.order - b.data.order);
}

/* ------------------------------------------------------------------ *
 * Section visibility — PRD §11
 * ------------------------------------------------------------------ */

export type SectionKey = keyof typeof config.features | 'agenda' | 'faq' | 'photos' | 'whatYoullBuild';

/**
 * A section renders only if the global flag allows it, the page has not
 * overridden it, and it actually has content. "No empty shells" is the rule.
 */
export function showSection(key: SectionKey, opts: { hidden?: readonly string[]; hasContent?: boolean } = {}): boolean {
  const { hidden = [], hasContent = true } = opts;
  if (hidden.includes(key)) return false;
  if (key in config.features && !config.features[key as keyof typeof config.features]) return false;
  return hasContent;
}

/**
 * Assigns dark/cream backgrounds by POSITION among the sections that actually
 * rendered, so removing one never produces two touching same-colour bands.
 * Gold divider bands are neutral: they reset the alternation.
 */
export function createRhythm(startWith: 'dark' | 'cream' = 'cream') {
  let index = 0;
  return {
    next(): 'dark' | 'cream' {
      const isEven = index % 2 === 0;
      index += 1;
      return isEven ? startWith : startWith === 'dark' ? 'cream' : 'dark';
    },
    /** A gold band sits outside the alternation and restarts it. */
    resetAfterGold(nextIs: 'dark' | 'cream' = 'dark') {
      startWith = nextIs;
      index = 0;
    },
  };
}

/* ------------------------------------------------------------------ *
 * Navigation — recomputed from flags, never hardcoded (PRD §6, §11)
 * ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export async function getNav(): Promise<NavItem[]> {
  const programmes = await getProgrammes();
  const items: NavItem[] = [{ label: 'Events', href: paths.events() }];

  if (programmes.length > 0) {
    items.push({
      label: 'Bootcamps',
      href: paths.programme(programmes[0].data.slug),
      children: programmes.map((p) => ({ label: p.data.name, href: paths.programme(p.data.slug) })),
    });
  }

  if (config.features.speakers) items.push({ label: 'Speakers', href: paths.speakers() });
  if (config.features.testimonials) items.push({ label: 'Outcomes', href: paths.testimonials() });
  if (config.features.guides) items.push({ label: 'Guides', href: paths.guides() });
  items.push({ label: 'About', href: paths.about() });

  return items;
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

const LONDON = 'Europe/London';

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: LONDON,
    ...opts,
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return formatDate(date, { weekday: undefined, month: 'short' });
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: LONDON }).format(date);
}

export function formatTimeRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: LONDON }).format(d);
  return `${fmt(start)}–${fmt(end)}`;
}

export function venueLine(venue: EventEntry['data']['venue']): string {
  return [venue.name, venue.city].filter(Boolean).join(', ');
}

/* ------------------------------------------------------------------ *
 * Luma — PRD §9
 * ------------------------------------------------------------------ */

/** Every outbound Luma link is UTM-tagged so referrals reconcile weekly. */
export function lumaUrlWithUtm(url: string, eventSlug: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set('utm_source', 'oxfordagentic');
  parsed.searchParams.set('utm_medium', 'website');
  parsed.searchParams.set('utm_campaign', eventSlug);
  return parsed.toString();
}

export function lumaEmbedSrc(lumaEventId: string): string {
  return `https://luma.com/embed/event/${lumaEventId}/simple`;
}
