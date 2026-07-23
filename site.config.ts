/**
 * SINGLE SOURCE OF BRAND TRUTH.
 *
 * PRD §4: no brand, programme or event name may be hardcoded in components,
 * layouts or copy. Renaming the parent brand must require editing exactly one
 * file — this one (plus domain-level redirects).
 *
 * PRD §20 acceptance test: change `brand.name` here and every page title,
 * schema block, OG image and llms.txt updates in one build.
 */

export interface SiteConfig {
  brand: Brand;
  features: Features;
  redirects: Redirect[];
  analytics: Analytics;
  newsletter: Newsletter;
}

export interface Brand {
  /** The canonical entity string. Used identically everywhere — PRD §13. */
  name: string;
  /** Short descriptor used after the em-dash in <title>. */
  tagline: string;
  /**
   * The canonical entity description. PRD §13 requires exactly ONE of these,
   * reused verbatim on the site, in schema, on Luma, on LinkedIn and in socials.
   *
   * Keep it under 160 characters. It doubles as the homepage meta description,
   * and a description that gets truncated in a search result is not the same
   * string everywhere — which is the whole point of having one.
   */
  description: string;
  /**
   * The longer form, for places with room to breathe: the homepage hero
   * subline, the footer, llms.txt. Still one canonical statement, expanded —
   * it must not contradict `description`.
   */
  longDescription: string;
  /** Canonical origin, no trailing slash. PRD §21: domain NOT yet purchased. */
  domain: string;
  /** Where the brand physically operates — entity consistency signal. */
  locality: string;
  region: string;
  country: string;
  email: string;
  /** sameAs links for Organization schema. Omit anything not live yet. */
  social: {
    luma?: string;
    linkedin?: string;
    x?: string;
  };
}

export interface Features {
  speakers: boolean;
  testimonials: boolean;
  guides: boolean;
  newsletter: boolean;
  pastEvents: boolean;
}

export interface Redirect {
  from: string;
  to: string;
}

export interface Analytics {
  /** 'plausible' | 'ga4' | 'none' — provider-agnostic per PRD §21. */
  provider: 'plausible' | 'ga4' | 'none';
  /** Plausible: the domain. GA4: the measurement id. */
  siteId: string;
  /** Self-hosted or proxied Plausible script origin. */
  scriptSrc?: string;
}

export interface Newsletter {
  /**
   * Provider-agnostic POST endpoint — PRD §15. Swap the endpoint, not the
   * component. Empty string renders the form in a disabled "coming soon" state.
   */
  endpoint: string;
  method: 'POST' | 'GET';
  /** Name of the email field the provider expects. */
  fieldName: string;
}

/**
 * The brand name is declared once and interpolated into everything that
 * mentions it, so PRD §20's rename test really is a single-field change.
 */
const BRAND_NAME = 'Oxford Agentic';

const config: SiteConfig = {
  brand: {
    name: BRAND_NAME,
    tagline: 'Practical agentic AI training in Oxford',
    description:
      'Hands-on agentic AI training in Oxford for business leaders. In one day, ' +
      'you build and run a working agentic AI workflow on a real task from your own work. No coding.',
    longDescription:
      `${BRAND_NAME} runs in-person, hands-on agentic AI training in Oxford for business leaders. ` +
      'Over a single day in a small cohort, every attendee builds and runs a working agentic AI ' +
      'workflow on a real task from their own work. No coding required.',
    // PRD §21 — NOT YET PURCHASED. Recommendation: oxfordagentic.com canonical,
    // oxfordagentic.ai bought defensively and 301'd here. One-line change.
    domain: 'https://oxfordagentic.com',
    locality: 'Oxford',
    region: 'Oxfordshire',
    country: 'GB',
    email: 'hello@oxfordagentic.com',
    social: {
      luma: 'https://luma.com/oxfordagentic',
      linkedin: 'https://www.linkedin.com/in/drummondgilbert/',
    },
  },

  /**
   * Section visibility — PRD §11. Flipping any of these to false must remove
   * the section, its nav entry, its routes, its sitemap/llms.txt entries and
   * every internal link to it, and must re-balance the dark/cream rhythm.
   * `npm run build` runs the link checker over the result.
   */
  features: {
    // V1.1 — no cleared speaker profiles yet.
    speakers: false,
    // V1.1 — Cohort 1 NPS survey went out 22 Jul 2026; nothing consent-cleared.
    testimonials: false,
    // Live: three seed guides published (long-tail SEO/GEO capture).
    guides: true,
    // Live: drives the Cohort 2 "notify me" state while its Luma page is pending.
    newsletter: true,
    pastEvents: true,
  },

  /**
   * Rename safety net — PRD §4. Changing a programme or event slug must not
   * break URLs: add the old path here and it 301s to the new one.
   * Emitted to the host in `public/_redirects` (Netlify) and `vercel.json`.
   */
  redirects: [],

  analytics: {
    // PRD §21: not yet set up. Set provider + siteId once the account exists;
    // nothing else in the codebase needs to change.
    provider: 'none',
    siteId: 'oxfordagentic.com',
  },

  newsletter: {
    // PRD §15/§21 default: Luma calendar subscribe. Swap for Buttondown/Mailchimp
    // by replacing this endpoint — the form component is provider-agnostic.
    endpoint: '',
    method: 'POST',
    fieldName: 'email',
  },
};

export default config;
