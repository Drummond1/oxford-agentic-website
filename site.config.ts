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
  secondBrainInterest: SecondBrainInterest;
  ceoRoundtable: CeoRoundtable;
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
  /**
   * The entity-disambiguation line, for `Organization.disambiguatingDescription`
   * — schema.org's own field for telling an entity apart from similar ones.
   * It asserts nothing new: every clause is already published on the homepage
   * FAQ, the About page and in llms.txt. Must not contradict `description`.
   */
  disambiguation: string;
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
   * GA4 measurement id, when GA4 runs inside the GTM container. Custom events
   * are sent with send_to set to this, because GTM's Google tag drops a
   * page-level gtag('event') that names no destination. See src/lib/track.ts.
   */
  ga4MeasurementId?: string;
  /**
   * The Google Ads account's own Google tag (AW-…), loaded directly after the
   * Consent Mode defaults. Separate from GTM because the AW tag inside the
   * container belongs to a different Ads account. See BaseHead.astro.
   */
  googleAdsTagId?: string;
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
  /**
   * Meta (Facebook/Instagram) pixel id, for Meta ads retargeting and
   * attribution. Same dataset Luma uses at calendar level, so site visits and
   * Luma purchases land in one audience. Loaded only after the visitor accepts
   * cookies; see oaMetaPixel in BaseHead.astro.
   */
  metaPixelId?: string;
  /**
   * LinkedIn Insight Tag partner id, for LinkedIn website retargeting and
   * conversions. Consent-gated like the Meta pixel; see oaLinkedInTag in
   * BaseHead.astro.
   */
  linkedinPartnerId?: string;
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

export interface SecondBrainInterest {
  /**
   * n8n production webhook behind /second-brain-interest/. One row per email in
   * the Google Sheet "Second Brain Bootcamp - Interest Register", and an email
   * to the owner on every stage. Empty = the form shows its email fallback.
   */
  endpoint: string;
}

export interface CeoRoundtable {
  /** Working name of the format. Display only; the URL never changes. */
  name: string;
  /** Seats in the first cohort. Scarcity copy reads from here, never a literal. */
  seats: number;
  /** "within X" in the thank-you state. */
  replyWithin: string;
  /** n8n production webhook that stores the application. Empty = error state with email fallback. */
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
  /**
   * The ElevenLabs agent behind the unlisted /office-hours/ page ("Oxford
   * Agentic - Office Hours (hidden page)"): answers questions about what the
   * bootcamps teach, from sanitised Cohort 1 and 2 teaching notes, and only
   * steers to a bootcamp when a visitor shows interest.
   */
  officeHoursAgentId: string;
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
    /*
     * The entity description: the Organization and WebSite schema nodes, the
     * llms.txt entity line and the RSS channel.
     *
     * It was the homepage meta description too until 29 Oct 2026, when that page
     * started composing its own from this string's lead sentence plus the next
     * cohort's derived date. An entity description should not carry a cohort
     * date; a page description should. See the note in `src/pages/index.astro`.
     *
     * It ended "No coding." until 12 Oct 2026. Two problems, one edit. The message
     * house is explicit that this framing is never left standing alone - the same
     * rule that made `longDescription` below say "No coding required, and nothing
     * hand-waved" - and the sentence had been left bare here, in the one place
     * Google actually renders. It also pushed the string to 166 characters, past
     * the 160 the schema check warns at, so in a SERP it was being truncated and
     * delivering nothing anyway. There is no room to qualify it properly inside
     * 160 characters, so it comes out; the paired version survives in
     * `longDescription`, on the homepage itself and in the programme copy.
     */
    description:
      'Hands-on agentic AI training in Oxford for business leaders. In one day, ' +
      'you build and run a working agentic AI workflow on a real task from your own work.',
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
     *
     * Widened 17 Oct 2026 to all three bootcamps. It had described only the
     * agentic-workflow line since cycle 66 (16 Aug), while the Second Brain
     * and Agentic Coding lines launched behind it, so the first thing an engine
     * read about this entity covered a third of what it sells. An entity-axis
     * probe that day ("what is Oxford Agentic who runs the Oxford Agentic
     * Bootcamp") returned no page of ours at all and answered off two past Luma
     * listings instead. This string is site-only - it is NOT the one PRD §13
     * requires reused verbatim off-site, so the loop can move it; `description`
     * above still waits for Drummond. Add it to the backlog-14 launch checklist:
     * when a line launches, this is a fifth surface that silently keeps
     * describing the old product.
     */
    longDescription:
      `${BRAND_NAME} runs in-person, hands-on AI training in Oxford for business leaders, across three ` +
      'one-day bootcamps, each in a small cohort. Build and run a working agentic AI workflow on a real ' +
      'task from your own work, so the routine runs itself and the hours go back into the work only you ' +
      'can do. Build a second brain: the structured store of your own context that AI tools draw on. Or ' +
      'ship a live website and a working prototype, with Claude Code and Codex doing the typing. No day ' +
      'assumes you arrive able to code, and nothing is hand-waved.',
    /*
     * Why this field exists, from measurement rather than theory.
     *
     * The independence fact is settled and published - the homepage FAQ answers
     * "Is Oxford Agentic affiliated with the University of Oxford?" outright,
     * and the About page, the privacy page and both llms files repeat it. But it
     * reached 3 of the 63 built pages, and none of the pages that take a booking
     * or that rank for an Oxford AI course. The Organization node, which 60 of
     * the 63 pages carry, said nothing about it at all.
     *
     * What that costs, measured on 23 Oct 2026. Asked which Oxford AI course is
     * hands-on rather than lectures, an engine put this bootcamp forward as the
     * best match and described it only as "hosted by Drummond Gilbert, who
     * tutors at Saïd Business School" - a sentence a reader can fairly take as a
     * University connection. The same answer introduced a competitor as "a
     * private provider that is not part of the University of Oxford", so that
     * company's independence was legible to the engine and this one's was not.
     * The same two probes returned that competitor's Trustpilot page twice on
     * this entity's own subject, which is the confusion the 22 Oct cycle logged
     * from the other side: the engine offered its reviews for this bootcamp
     * while warning it could not confirm the connection.
     *
     * No new fact is asserted. Clause by clause: the first is `longDescription`,
     * the second is the homepage FAQ's answer verbatim, the third is that same
     * answer's "we hire the city's rooms ... and that is the whole relationship",
     * and the fourth is what the second one means. No company is named, so
     * nothing here can be wrong about anybody else.
     */
    disambiguation:
      `${BRAND_NAME} is an independent company in Oxford, England, running its own one-day, ` +
      'hands-on AI bootcamps. It has no affiliation with the University of Oxford, its colleges, ' +
      'or any other institution: college rooms are hired as venues and that is the whole ' +
      'relationship. It is a separate organisation from any similarly named Oxford AI training ' +
      'provider or university AI programme.',
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
    ga4MeasurementId: 'G-3YJV42CLBC',
    googleAdsTagId: 'AW-18383990238',
    // 30 Sep 2026: "Oxford Agentic Pixel" in business portfolio 1561371971778554.
    metaPixelId: '2272071460195423',
    // 30 Sep 2026: Insight Tag for Campaign Manager account 553270380.
    linkedinPartnerId: '10831801',
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

  // 27 Oct 2026: register-interest page for the next Second Brain Bootcamp (noindex).
  // n8n workflow "Second Brain Bootcamp - Register Interest" (L7nyyL4vnCC5TW5b).
  secondBrainInterest: {
    endpoint: 'https://drummondgilbert.app.n8n.cloud/webhook/second-brain-register-interest',
  },

  // 13 Oct 2026: ad-only demand-validation page at /ceo-roundtable/ (noindex, not linked).
  ceoRoundtable: {
    name: 'Oxford Agentic CEO Roundtable',
    seats: 16, // ASSUMPTION - confirm with Drummond
    replyWithin: 'five working days', // TBC
    // n8n workflow "CEO Roundtable Applications" - inactive until Drummond publishes it.
    endpoint: 'https://drummondgilbert.app.n8n.cloud/webhook/ceo-roundtable-apply',
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
    // Added 30 Sept 2026 for the unlisted /office-hours/ page.
    officeHoursAgentId: 'agent_1701m3se2rwsfss9dda6e8az3vpc',
  },
};

export default config;
