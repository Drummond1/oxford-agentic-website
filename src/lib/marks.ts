import config from '../../site.config';

/**
 * Brand marks, generated from config so a rename redraws them (PRD §4, §20).
 *
 * The logo is "The Quad" from the design guidelines: an Oxford quad seen in
 * plan — a square outline with a solid amber square at its centre. Geometric
 * first, collegiate second. The guidelines are strict about it:
 *   - outer square only ever ink, cream or amber
 *   - centre only ever amber (or ink when it sits ON amber)
 *   - never rotated, skewed, gradient-filled or shadowed
 *   - never smaller than 24px on screen
 * These functions are the single source of the mark's geometry.
 */

const INK = '#051817';
const CREAM = '#FFF9EC';
const GOLD = '#F1AF39';

/** Proportions of the mark within a 100×100 box — see the guidelines' construction. */
const OUTER = { x: 8, y: 8, size: 84, stroke: 16 };
const CENTRE = { size: 27 };

/**
 * The Quad, as SVG child elements, sized to fill a `box`×`box` square at (0,0).
 * `stroke` draws the outer square; `centre` fills the middle square.
 */
export function quadPaths(stroke: string, centre: string, box = 100): string {
  const s = box / 100;
  const o = OUTER;
  const c = (box - CENTRE.size * s) / 2;
  return (
    `<rect x="${o.x * s}" y="${o.y * s}" width="${o.size * s}" height="${o.size * s}" ` +
    `fill="none" stroke="${stroke}" stroke-width="${o.stroke * s}"/>` +
    `<rect x="${c}" y="${c}" width="${CENTRE.size * s}" height="${CENTRE.size * s}" fill="${centre}"/>`
  );
}

/** Standalone Quad SVG on a transparent ground, for arbitrary placement. */
export function quadSvg(variant: 'on-dark' | 'on-cream' | 'on-amber' = 'on-dark', size = 64): string {
  const stroke = variant === 'on-cream' ? INK : variant === 'on-amber' ? INK : CREAM;
  const centre = variant === 'on-amber' ? INK : GOLD;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${config.brand.name}">${quadPaths(stroke, centre)}</svg>`;
}

/**
 * Favicon: the Quad on a dark rounded tile — cream square, amber centre.
 * The mark is inset so it keeps its clearspace and never closes up at 16px.
 */
export function faviconSvg(size = 64): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${config.brand.name}">
  <rect width="64" height="64" rx="10" fill="${INK}"/>
  <g transform="translate(12 12)">${quadPaths(CREAM, GOLD, 40)}</g>
</svg>`;
}

/**
 * The horizontal lockup used as Organization.logo in schema (PRD §12):
 * the Quad, then the wordmark in the serif brand face. Dark ground.
 */
export function logoSvg(): string {
  const name = config.brand.name;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 128" width="520" height="128" role="img" aria-label="${name}">
  <rect width="520" height="128" fill="${INK}"/>
  <g transform="translate(32 40)">${quadPaths(CREAM, GOLD, 48)}</g>
  <text x="100" y="76" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="44" fill="${CREAM}">${name}</text>
</svg>`;
}
