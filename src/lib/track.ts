/**
 * One dispatcher for every custom analytics event on the site.
 *
 * Components declare intent with data-analytics-event (or call this directly);
 * this sends it to whichever provider is on.
 *
 * GA4 loads through GTM: the Google tag lives inside the container, not on the
 * page. In that set-up a page-level gtag('event', name) with no send_to is
 * queued in the dataLayer and then dropped - nothing reaches GA4. Verified on
 * 30 Sep 2026: GA4 had received none of register_section_viewed,
 * luma_outbound_click or luma_embed_interacted in 28 days, and a live probe
 * produced a /g/collect hit only once send_to named the measurement id. So every
 * event names its destination explicitly. Do not remove send_to.
 *
 * The id comes from config.analytics.ga4MeasurementId via data-ga4-id on <body>.
 */
type Props = Record<string, string>;

export function track(name: string, props: Props = {}) {
  const w = window as unknown as {
    plausible?: (n: string, o?: { props: Props }) => void;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.plausible?.(name, { props });
  const ga4 = document.body?.dataset.ga4Id;
  w.gtag?.('event', name, ga4 ? { ...props, send_to: ga4 } : props);
  // Meta pixel exists only after cookie consent. Two events map to Meta's
  // standard events so they can seed retargeting audiences and ad optimisation;
  // the rest go as custom events.
  if (w.fbq) {
    const std = META_STANDARD[name];
    if (std) w.fbq('track', std, props);
    else w.fbq('trackCustom', name, props);
  }
}

const META_STANDARD: Record<string, string> = {
  register_section_viewed: 'ViewContent',
  luma_booking_click: 'InitiateCheckout',
};

const LUMA_HOST = /^(www\.)?(lu\.ma|luma\.com)$/;

/**
 * True for a link to a Luma event or checkout page. The embed iframe is not a
 * link, so this only ever matches the Book buttons and the fallback link.
 */
export function lumaLink(target: EventTarget | null): URL | null {
  const a = (target as HTMLElement | null)?.closest?.<HTMLAnchorElement>('a[href]');
  if (!a) return null;
  try {
    const url = new URL(a.href);
    return LUMA_HOST.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
}
