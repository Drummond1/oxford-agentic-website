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
  applications: Applications;
  assistant: Assistant;
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
  team: boolean;
  testimonials: boolean;
  guides: boolean;
  /**
   * Whether Guides appears in the HEADER nav. The section itself is governed by
   * `guides` above; this only controls top-nav placement. While false, Guides
   * stays reachable from the footer, cross-links, sitemap and llms.txt — flip
   * to true to put it back in the header when the content earns the slot.
   */
  guidesInHeaderNav: boolean;
  newsletter: boolean;
  pastEvents: boolean;
  /**
   * "Ask Drummond", the AI version of Drummond in the bottom-left corner.
   * Settings live in `assistant` below. Off removes the launcher, its script
   * and every trace of it from the HTML.
   */
  assistant: boolean;
}

export interface Redirect {
  from: string;
  to: string;
}

export interface Analytics {
  /** 'plausible' | 'ga4' | 'gtm' | 'none' — provider-agnostic per PRD §21. */
  provider: 'plausible' | 'ga4' | 'gtm' | 'none';
  /** Plausible: the domain. GA4: the measurement id. GTM: the GTM-XXXXXXX container id. */
  siteId: string;
  /** Self-hosted or proxied Plausible script origin. */
  scriptSrc?: string;
  /**
   * Ask before setting advertising or analytics cookies.
   *
   * Consent Mode v2 defaults are emitted inline, ahead of the container, so a
   * visitor who has not chosen is denied by default rather than tracked and
   * apologised to afterwards. Google also requires these signals before it will
   * add a UK or EEA visitor to a remarketing audience, so turning this off does
   * not buy more data. It buys an empty audience and a PECR problem.
   *
   * Only meaningful for 'gtm' and 'ga4'.
   */
  requireConsent?: boolean;
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

export interface Applications {
  /**
   * Where the /apply/ form sends applications. Provider-agnostic, like the
   * newsletter: any service that accepts a form POST and answers JSON
   * (Formspree, Basin, Web3Forms, a Zapier catch hook) drops in here.
   *
   * Empty string is an honest fallback, not a dead form: the answers are
   * written into an email to `brand.email` in the visitor's own mail app, and
   * the page tells them to press send rather than claiming it went.
   */
  endpoint: string;
}

export interface Assistant {
  /**
   * The ElevenLabs agent that answers as AI Drummond. Public by design, like
   * any embed id: ElevenLabs only accepts conversations for it from
   * oxfordagentic.com, with daily and concurrency caps set on the agent.
   *
   * Everything about what it says - prompt, voice, guardrails, caps - lives on
   * the agent in ElevenLabs, not here. Its knowledge is this site's own
   * llms.txt and llms-full.txt, re-synced daily, so anything published there
   * is something it can say.
   */
  agentId: string;
  /**
   * While true, the launcher only appears for a visitor who opens a page with
   * `?assistant=preview` (remembered for that browser tab). Lets a change to
   * the agent be tried on the live site before everyone sees it.
   */
  previewOnly: boolean;
  /**
   * Shown in the panel before anything connects. Keep it identical to the
   * agent's first message in ElevenLabs: the panel hides that first message
   * when it arrives, so a visitor never reads the same greeting twice.
   */
  greeting: string;
  /**
   * The ElevenLabs agent behind the unlisted /find-your-bootcamp/ page
   * ("Oxford Agentic - Bootcamp Finder (hidden page)"): a voice-first version
   * of AI Drummond whose one job is to match a visitor to a bootcamp, then
   * put that bootcamp's Luma booking form on the page through its
   * show_bootcamp client tool. Same origin lock, caps and guardrails as the
   * agent above; its knowledge adds a finder brief with no prices, figures
   * or personal details in it. Independent of `features.assistant`.
   */
  finderAgentId: string;
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
    /*
     * The entity line at the top of llms.txt and llms-full.txt, the About hero
     * subline and the footer. It is the first thing an AI engine reads about
     * this organisation, which is why the two message-house points that were
     * missing from it matter more here than anywhere else.
     *
     * It used to end "No coding required." and stop. The message house is
     * explicit that this framing is never left standing alone - to a senior
     * technical buyer it reads as "not serious" - so it is now paired with
     * "nothing hand-waved". It also stopped at what you build, which is rung
     * one of the ladder; the hours and what they are for are the point, and an
     * engine summarising this entity should have them.
     *
     * Still consistent with `description`, which it is required not to
     * contradict: same day, same cohort, same task, expanded rather than
     * restated.
     */
    longDescription:
      `${BRAND_NAME} runs in-person, hands-on agentic AI training in Oxford for business leaders. ` +
      'Over a single day in a small cohort, every attendee builds and runs a working agentic AI ' +
      'workflow on a real task from their own work, so the routine work runs itself and the hours ' +
      'go back into the work only they can do. No coding required, and nothing hand-waved.',
    // PRD §21 — NOT YET PURCHASED. Recommendation: oxfordagentic.com canonical,
    // oxfordagentic.ai bought defensively and 301'd here. One-line change.
    domain: 'https://oxfordagentic.com',
    locality: 'Oxford',
    region: 'Oxfordshire',
    country: 'GB',
    email: 'hello@oxfordagentic.com',
    /*
     * Shown in the footer, and the source of `Organization.sameAs`.
     *
     * Two rules learned the hard way:
     *
     * 1. Only URLs that identify the ORGANISATION reach `sameAs`. A personal
     *    linkedin.com/in/… profile is filtered out in schema.ts — it identifies
     *    Drummond, is already the Person node's sameAs via the team file, and
     *    claiming it here merges the two entities. A linkedin.com/company/…
     *    page is the org's own identity and flows through untouched.
     * 2. Every URL here must resolve. `luma.com/oxfordagentic` was listed until
     *    31 Jul and had been returning 404 — a dead link in every page footer,
     *    and after the sameAs filter it was the only identity the Organization
     *    claimed. A broken sameAs is worse than none. Removed rather than
     *    repointed at the Cohort 2 event URL, which identifies an event, not the
     *    organisation, and would go stale in September.
     *
     * The Organization currently claims NO third-party identity. A LinkedIn
     * Company Page, or a real Luma calendar URL, is the fix — drop it in here.
     */
    social: {
      linkedin: 'https://www.linkedin.com/in/drummondgilbert',
    },
  },

  /**
   * Section visibility — PRD §11. Flipping any of these to false must remove
   * the section, its nav entry, its routes, its sitemap/llms.txt entries and
   * every internal link to it, and must re-balance the dark/cream rhythm.
   * `npm run build` runs the link checker over the result.
   */
  features: {
    // Live: the four people who run the bootcamp.
    team: true,
    // On since 17 Aug 2026 (Drummond). Four consented Cohort 1 quotes as of 18 Aug.
    //
    // This flag does more than reveal quote bands: it also builds
    // `/testimonials/`, puts "Outcomes" in the header and footer nav, and files
    // the page in the sitemap. That is why it stayed off while the collection was
    // empty — on with nothing consented, it ships a thin indexable page whose
    // whole body reads "quotes are being collected".
    //
    // So it tracks the consented-quote count, not the collection count. If every
    // quote is ever withdrawn, turn this off in the same edit.
    testimonials: true,
    // Live: three seed guides published (long-tail SEO/GEO capture).
    guides: true,
    // Off 28 Jul (Drummond): the top nav leads with people over content until
    // the guides are human-authored. Team takes the header slot; Guides stays
    // in the footer. One flip restores it.
    guidesInHeaderNav: false,
    // Live: drives the Cohort 2 "notify me" state while its Luma page is pending.
    newsletter: true,
    pastEvents: true,
    // "Ask Drummond", an AI version of him that answers questions from this site
    // (see `assistant` below and STATE.md). Launched 29 Sept 2026 and taken off
    // the same day at Drummond's request until it has been further tested. Only
    // Drummond switches it back on; `previewOnly` below is set so that it
    // returns for `?assistant=preview` tabs first.
    assistant: false,
  },

  /**
   * Rename safety net — PRD §4. Changing a programme or event slug must not
   * break URLs: add the old path here and it 301s to the new one.
   * Emitted to the host in `public/_redirects` (Netlify) and `vercel.json`.
   */
  redirects: [
    // 28 Jul: the reference homepage variant swapped designs and was renamed
    // to say what it now holds. Anyone holding the old URL still lands right.
    { from: '/home-original/', to: '/home-photos/' },
    // 17 Aug: Josh Lawman taught Cohort 1 and declined Cohort 2 (27 Jul, his own
    // words). His page had stayed live and indexed, describing him in the present
    // tense as someone who runs part of the day. Removed on Drummond's instruction;
    // the URL redirects rather than 404s, because it has been indexed since July.
    { from: '/team/josh-lawman/', to: '/team/' },
  ],

  analytics: {
    /*
     * Google Tag Manager, added 11 Aug 2026 to enable Google Ads remarketing.
     *
     * The container is the only thing on the site; the Google Ads tag
     * (AW-18382942196) lives inside it, so ad tags can be changed without a
     * deploy. Consent Mode v2 defaults are emitted ahead of the container by
     * BaseHead, and ConsentBanner is the only thing that grants.
     */
    provider: 'gtm',
    siteId: 'GTM-WQJLXFRN',
    requireConsent: true,
  },

  newsletter: {
    // PRD §15/§21 default: Luma calendar subscribe. Swap for Buttondown/Mailchimp
    // by replacing this endpoint — the form component is provider-agnostic.
    endpoint: '',
    method: 'POST',
    fieldName: 'email',
  },

  applications: {
    // 23 Sept 2026: no provider chosen yet, so applications arrive by email.
    endpoint: '',
  },

  assistant: {
    // "Oxford Agentic - AI Drummond (website)" in Drummond's ElevenLabs workspace.
    agentId: 'agent_9501m3p6649hfjpsve5qzzv0jexv',
    // True since 29 Sept 2026: when `features.assistant` goes back on, only a
    // tab opened with `?assistant=preview` sees it until Drummond has tested it.
    previewOnly: true,
    greeting:
      "Hi, I'm an AI version of Drummond. I can answer questions about the bootcamps from what's on this site - what would you like to know?",
    // Added 30 Sept 2026 for the unlisted /find-your-bootcamp/ page.
    finderAgentId: 'agent_8601m3raa78necethhgpvz71hf05',
  },
};

export default config;
