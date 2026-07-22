import config from '../../site.config';

/**
 * The favicon and logo are generated from site.config rather than committed as
 * static assets, so a brand rename redraws them in the same build (PRD §4, §20).
 */

/** Initials from the brand name — "Oxford Agentic" → "OA". */
export function initials(): string {
  return config.brand.name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase())
    .slice(0, 3)
    .join('');
}

/** Gold dash over the monogram, on dark green. */
export function faviconSvg(size = 64): string {
  const mark = initials();
  const fontSize = mark.length > 2 ? 24 : 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="${config.brand.name}">
  <rect width="64" height="64" rx="10" fill="#051817"/>
  <rect x="18" y="17" width="28" height="3.5" fill="#F1AF39"/>
  <text x="32" y="47" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="#FFF9EC">${mark}</text>
</svg>`;
}

/** Wider lockup used as Organization.logo in schema. */
export function logoSvg(): string {
  const [first, ...rest] = config.brand.name.split(' ');
  const second = rest.join(' ').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 128" width="512" height="128" role="img" aria-label="${config.brand.name}">
  <rect width="512" height="128" fill="#051817"/>
  <rect x="32" y="61" width="34" height="4" fill="#F1AF39"/>
  <text x="80" y="76" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#FFF9EC">${first}</text>
  <text x="${80 + first.length * 23}" y="75" font-family="'Courier New', Courier, monospace" font-weight="700" letter-spacing="4" font-size="27" fill="#FFF9EC">${second}</text>
</svg>`;
}
