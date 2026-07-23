import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import config from '../../site.config';
import { absoluteUrl, paths, showSection } from '../lib/site';

/**
 * RSS feed for the guides.
 *
 * A second machine-readable surface alongside llms.txt: feed readers, newsletter
 * tools and several crawlers consume RSS directly, and it gives the guides a
 * distribution channel that does not depend on search.
 *
 * Hand-rolled rather than pulling in a dependency — the feed is small and the
 * escaping requirements are trivial.
 */

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const guides = showSection('guides')
    ? (await getCollection('guides', ({ data }) => !data.draft)).sort(
        (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
      )
    : [];

  const items = guides
    .map((guide) => {
      const url = absoluteUrl(paths.guide(guide.data.slug));
      return [
        '    <item>',
        `      <title>${escape(guide.data.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escape(guide.data.capsule)}</description>`,
        `      <pubDate>${guide.data.publishDate.toUTCString()}</pubDate>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(config.brand.name)} — Guides</title>`,
    `    <link>${absoluteUrl(paths.guides())}</link>`,
    `    <description>${escape(config.brand.description)}</description>`,
    '    <language>en-GB</language>',
    `    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
