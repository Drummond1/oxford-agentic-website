import type { APIRoute } from 'astro';
import config from '../../site.config';

/**
 * PRD §12: allow all major crawlers, and allow the AI crawlers EXPLICITLY.
 *
 * Naming them rather than relying on the wildcard is deliberate. Some of these
 * agents treat an absent named rule as ambiguous, and being cited by AI
 * assistants is a primary goal here, not a side effect.
 */
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'DuckDuckBot',
  'meta-externalagent',
  'CCBot',
];

export const GET: APIRoute = () => {
  const body = [
    '# Every crawler is welcome, including AI crawlers.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    ...aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${config.brand.domain}/sitemap-index.xml`,
    '',
    '# Plain-text summaries for language models:',
    `# ${config.brand.domain}/llms.txt`,
    `# ${config.brand.domain}/llms-full.txt`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
