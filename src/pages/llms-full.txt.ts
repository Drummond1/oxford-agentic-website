import type { APIRoute } from 'astro';
import { renderLlmsFullTxt } from '../lib/llms';

export const GET: APIRoute = async () =>
  new Response(await renderLlmsFullTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
