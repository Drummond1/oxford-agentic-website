import config from '../../site.config';
import { absoluteUrl, effectiveStatus, paths, type EventEntry, type ProgrammeEntry } from './site';

/**
 * Structured data — PRD §12.
 *
 * Everything here derives from site.config and content frontmatter, so a brand
 * rename propagates into schema in the same build. `scripts/check-schema.mjs`
 * re-parses the emitted JSON-LD after every build.
 */

/** Stable @id for the Organization so every page references one entity node. */
export const ORG_ID = `${config.brand.domain}/#organization`;

export function organizationSchema() {
  const sameAs = Object.values(config.brand.social).filter(Boolean);
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: config.brand.name,
    url: `${config.brand.domain}/`,
    description: config.brand.description,
    email: config.brand.email,
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
export function eventSchema(event: EventEntry, programme: ProgrammeEntry, ogImage: string) {
  const status = effectiveStatus(event);
  const url = absoluteUrl(paths.event(event.data.slug));

  const availability =
    status === 'soldout'
      ? 'https://schema.org/SoldOut'
      : status === 'upcoming'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut';

  const eventStatus =
    status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled';

  return {
    '@type': 'EducationEvent',
    '@id': `${url}#event`,
    name: event.data.title,
    description: event.data.capsule,
    startDate: event.data.startDate.toISOString(),
    endDate: event.data.endDate.toISOString(),
    eventStatus,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [ogImage],
    url,
    inLanguage: 'en-GB',
    location: {
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
    },
    organizer: { '@id': ORG_ID },
    performer: { '@id': ORG_ID },
    superEvent: {
      '@type': 'EventSeries',
      name: programme.data.name,
      url: absoluteUrl(paths.programme(programme.data.slug)),
    },
    ...(event.data.capacity ? { maximumAttendeeCapacity: event.data.capacity } : {}),
    // Price lives on Luma and is deliberately not published here — PRD §18.
    offers: {
      '@type': 'Offer',
      url,
      availability,
      category: 'Paid',
      validFrom: new Date().toISOString(),
    },
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
    '@id': `${absoluteUrl(paths.speaker(speaker.slug))}#person`,
    name: speaker.name,
    jobTitle: speaker.role,
    description: speaker.bio,
    url: absoluteUrl(paths.speaker(speaker.slug)),
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
}) {
  return {
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishDate.toISOString(),
    dateModified: guide.updatedDate.toISOString(),
    image: [guide.ogImage],
    author: { '@id': `${absoluteUrl(paths.speaker(guide.authorSlug))}#person`, '@type': 'Person', name: guide.authorName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: absoluteUrl(paths.guide(guide.slug)),
    inLanguage: 'en-GB',
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
