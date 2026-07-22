import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { faviconSvg } from '../lib/marks';

/** Same mark, rasterised for iOS home screens. */
export const GET: APIRoute = () => {
  const png = new Resvg(faviconSvg(180), { fitTo: { mode: 'width', value: 180 } }).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
