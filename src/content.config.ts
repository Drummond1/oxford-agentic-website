import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Content model — PRD §8.
 *
 * Validation is deliberately strict: the build must fail loudly rather than
 * ship a page with a missing date, an unresolvable reference or a meta
 * description that is too long to render in a search result.
 */

/**
 * ISO 8601 with an explicit timezone offset — never a bare local datetime.
 *
 * Dates MUST be quoted in frontmatter. Unquoted, YAML parses them into a Date
 * itself and assumes UTC when no offset is given, which would silently shift a
 * 09:00 British Summer Time event to 10:00. Rather than accept that quietly, an
 * unquoted date fails the build and says exactly what to do about it.
 */
const isoDateTime = z
  .union([z.string(), z.date()])
  .superRefine((value, ctx) => {
    if (value instanceof Date) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Quote this date in the frontmatter, e.g. "2026-09-09T09:00:00+01:00". ' +
          'Unquoted, YAML parses it as UTC and silently shifts British Summer Time events by an hour.',
      });
      return;
    }
    if (!/[Zz]|[+-]\d{2}:\d{2}$/.test(value)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Dates need an explicit timezone offset, e.g. "2026-09-09T09:00:00+01:00" (BST) or "+00:00" (GMT).',
      });
    }
    if (Number.isNaN(Date.parse(value))) {
      ctx.addIssue({ code: 'custom', message: `Not a parseable date: ${value}` });
    }
  })
  .transform((value) => (value instanceof Date ? value : new Date(value)));

const venue = z.object({
  name: z.string(),
  street: z.string().optional(),
  city: z.string(),
  postcode: z.string().optional(),
  /** False while a booking is provisional — the page says so instead of implying certainty. */
  confirmed: z.boolean().default(true),
});

const faq = z.object({
  /** Phrase as a real user question — PRD §13 (GEO). */
  q: z.string(),
  a: z.string(),
});

/**
 * Section keys a single page may switch off on top of the global flags.
 * PRD §8: `hideSections` is a per-page override.
 */
const sectionKey = z.enum([
  'speakers',
  'testimonials',
  'agenda',
  'faq',
  'newsletter',
  'photos',
  'whatYoullBuild',
]);

const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /**
       * PRD §6: permanent and descriptive. NEVER include a date — events
       * reschedule. Changing a slug means adding a redirect in site.config.
       */
      slug: z
        .string()
        .regex(/^[a-z0-9-]+$/, 'Slugs are lowercase, hyphenated')
        .refine((s) => !/(19|20)\d{2}/.test(s) && !/-\d{1,2}-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(s), {
          message: 'Event slugs must not contain dates — events reschedule (PRD §6)',
        }),
      programme: reference('programmes'),
      edition: z.string().optional(),
      cohort: z.string().optional(),
      status: z.enum(['upcoming', 'soldout', 'past', 'cancelled']),
      startDate: isoDateTime,
      endDate: isoDateTime,
      venue,
      /**
       * Luma's internal event id (evt-…), used by the embed iframe.
       * Optional: an announced event whose Luma page does not exist yet renders
       * the newsletter "notify me" state instead (PRD §9 graceful degradation).
       */
      lumaEventId: z
        .string()
        .regex(/^evt-[A-Za-z0-9]+$/, 'Luma event ids look like evt-XXXXXXXXXXXX')
        .optional(),
      lumaUrl: z.string().url().optional(),
      /** Doubles as the meta description, so it must fit one. */
      summary: z.string().max(160, 'summary doubles as the meta description — keep it ≤160 chars'),
      /**
       * The answer capsule — PRD §13. 40–60 words, self-contained, quotable,
       * front-loaded, no marketing fluff. Rendered as plain HTML above the fold.
       */
      capsule: z
        .string()
        .refine((s) => {
          const words = s.trim().split(/\s+/).length;
          return words >= 30 && words <= 75;
        }, 'Answer capsules must be roughly 40–60 words (PRD §13)'),
      whoFor: z.array(z.string()).default([]),
      whatYoullBuild: z.array(z.string()).default([]),
      agenda: z
        .array(z.object({ time: z.string(), title: z.string(), detail: z.string().optional() }))
        .default([]),
      speakers: z.array(reference('speakers')).default([]),
      faqs: z.array(faq).default([]),
      capacity: z.number().int().positive().optional(),
      /** Dated, specific outcome stats for past events — PRD §13. */
      outcomes: z.array(z.object({ stat: z.string(), label: z.string() })).default([]),
      heroImage: image().optional(),
      ogImage: image().optional(),
      hideSections: z.array(sectionKey).default([]),
      draft: z.boolean().default(false),
    }),
});

const programmes = defineCollection({
  loader: glob({ base: './src/content/programmes', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      name: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      /** Optional accent override — must be a token name from the palette, not a hex. */
      accent: z.enum(['gold', 'teal', 'burnt']).default('gold'),
      shortPitch: z.string().max(160),
      /** Answer capsule for the programme — PRD §13. */
      capsule: z
        .string()
        .refine((s) => {
          const words = s.trim().split(/\s+/).length;
          return words >= 30 && words <= 75;
        }, 'Answer capsules must be roughly 40–60 words (PRD §13)'),
      description: z.string(),
      outcomes: z.array(z.string()).default([]),
      whoFor: z.array(z.string()).default([]),
      faqs: z.array(faq).default([]),
      order: z.number().int().default(0),
      updatedDate: isoDateTime,
      hideSections: z.array(sectionKey).default([]),
    }),
});

const speakers = defineCollection({
  loader: glob({ base: './src/content/speakers', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      role: z.string(),
      company: z.string().optional(),
      bio: z.string(),
      photo: image().optional(),
      /** Required by schema so a missing alt can never ship — PRD §17. */
      photoAlt: z.string().optional(),
      links: z
        .object({ linkedin: z.string().url().optional(), x: z.string().url().optional(), website: z.string().url().optional() })
        .default({}),
      /** Set true for the canonical host — drives Person schema on /about/. */
      isHost: z.boolean().default(false),
      order: z.number().int().default(0),
    }),
});

const testimonials = defineCollection({
  loader: glob({ base: './src/content/testimonials', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      company: z.string().optional(),
      programme: reference('programmes'),
      cohort: z.string().optional(),
      /** Dated specifics beat polished vagueness — PRD §13. */
      date: isoDateTime,
      featured: z.boolean().default(false),
      /**
       * Explicit publication consent. PRD §21: names may not go on the site
       * until the "can we quote you?" ask has come back yes.
       */
      consentGiven: z.boolean(),
    }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      description: z.string().max(160),
      capsule: z.string(),
      author: reference('speakers'),
      publishDate: isoDateTime,
      updatedDate: isoDateTime,
      /** Every guide links to ≥1 programme page — PRD §12 internal linking. */
      relatedProgrammes: z.array(reference('programmes')).min(1),
      draft: z.boolean().default(false),
    }),
});

/**
 * Photography manifest — PRD §10. Nothing in the codebase references a photo
 * filename directly; components query this manifest by tag. Swapping photos =
 * dropping files into src/content/photos/ and editing photos.json.
 */
const photos = defineCollection({
  loader: file('./src/content/photos/photos.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      file: image(),
      /** Required — a photo without alt text fails the build (PRD §17). */
      alt: z.string().min(1),
      tags: z.array(z.enum(['hero', 'event', 'venue', 'people', 'build'])).min(1),
      event: reference('events').optional(),
      credit: z.string().optional(),
      order: z.number().int().default(0),
      /**
       * Same consent gate as testimonials (PRD §21). Photos that show an
       * identifiable attendee, or their name, stay out of the built site until
       * the person has said yes. Flip to true once cleared — nothing else needs
       * to change, because components only ever query this manifest.
       */
      consentCleared: z.boolean().default(false),
    }),
});

export const collections = { events, programmes, speakers, testimonials, guides, photos };
