import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import config from '../../site.config';

/**
 * Build-time Open Graph image generation — PRD §10, §12.
 *
 * 1200×630, ink ground, the Quad lockup, amber rule, Newsreader title,
 * IBM Plex Mono eyebrow — the same brand faces as the site. Everything comes
 * from site.config + page data, so a brand rename regenerates every card in the
 * same build (PRD §20). Fonts are the committed TTFs, so CI needs no network.
 */

const fontDir = path.join(process.cwd(), 'src/assets/fonts');
const serif = fs.readFileSync(path.join(fontDir, 'Newsreader-Regular.ttf'));
const mono = fs.readFileSync(path.join(fontDir, 'IBMPlexMono-SemiBold.ttf'));

const INK = '#051817';
const CREAM = '#FFF9EC';
const GOLD = '#F1AF39';
const MUTED = '#C9D2CE';

export interface OgOptions {
  /** Courier-caps line above the title. Defaults to the brand name. */
  eyebrow?: string;
  title: string;
  /** Date/venue line for events; short descriptor elsewhere. */
  meta?: string;
}

type Node = {
  type: string;
  props: Record<string, unknown> & { children?: Node | Node[] | string };
};

const el = (type: string, props: Record<string, unknown>): Node => ({ type, props }) as Node;

function template({ eyebrow, title, meta }: OgOptions): Node {
  // Long titles step down a size so they never overflow the card.
  const titleSize = title.length > 74 ? 56 : title.length > 46 ? 68 : 82;

  return el('div', {
    style: {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: INK,
      padding: '72px 80px',
      fontFamily: 'Newsreader',
    },
    children: [
      // Top lockup: the Quad mark (cream square, amber centre — the dark
      // variant) beside the eyebrow.
      el('div', {
        style: { display: 'flex', alignItems: 'center', gap: '20px' },
        children: [
          el('div', {
            style: {
              display: 'flex',
              width: '42px',
              height: '42px',
              border: `8px solid ${CREAM}`,
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [el('div', { style: { width: '14px', height: '14px', backgroundColor: GOLD } })],
          }),
          el('div', {
            style: {
              fontFamily: 'IBM Plex Mono',
              fontSize: '24px',
              letterSpacing: '3.6px',
              color: GOLD,
              textTransform: 'uppercase',
            },
            children: eyebrow ?? config.brand.name,
          }),
        ],
      }),
      el('div', {
        style: { display: 'flex', flexDirection: 'column' },
        children: [
          // The amber rule (96×7 per the guidelines).
          el('div', { style: { width: '96px', height: '7px', backgroundColor: GOLD, marginBottom: '28px' } }),
          el('div', {
            style: { fontSize: `${titleSize}px`, color: CREAM, lineHeight: 1.1, letterSpacing: '-1px' },
            children: title,
          }),
          ...(meta
            ? [
                el('div', {
                  style: {
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '25px',
                    letterSpacing: '2px',
                    color: MUTED,
                    marginTop: '30px',
                    textTransform: 'uppercase',
                  },
                  children: meta,
                }),
              ]
            : []),
        ],
      }),
    ],
  });
}

export async function renderOgImage(options: OgOptions): Promise<Buffer> {
  const svg = await satori(template(options) as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Newsreader', data: serif, weight: 400, style: 'normal' },
      { name: 'IBM Plex Mono', data: mono, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return Buffer.from(png);
}

/** The route an OG image lives at, derived from the page path. */
export function ogPathFor(pagePath: string): string {
  const key = pagePath.replace(/^\/|\/$/g, '') || 'index';
  return `/og/${key.replace(/\//g, '--')}.png`;
}
