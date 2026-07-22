#!/usr/bin/env node
/**
 * JSON-LD and page-level SEO validation — PRD §12, §16.
 *
 * This is not a full schema.org validator; it is the set of checks that would
 * actually cost us a rich result or an AI citation if they regressed:
 *  - the JSON-LD parses at all
 *  - every page carries the Organization entity
 *  - Event nodes have the fields Google requires for event rich results
 *  - titles and meta descriptions are present and unique across the site
 *  - every event fact is in the HTML, not only inside the Luma iframe
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const errors = [];
const titles = new Map();
const descriptions = new Map();
let eventNodes = 0;
let faqNodes = 0;

const files = await walk(DIST);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = `/${path.relative(DIST, file).replace(/index\.html$/, '')}`;

  // ---- Title and meta description ----
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const noindex = html.includes('name="robots" content="noindex');

  if (!title) errors.push(`${page}: missing <title>`);
  if (!description) errors.push(`${page}: missing meta description`);
  if (!canonical) errors.push(`${page}: missing canonical URL`);
  if (description && description.length > 200) {
    errors.push(`${page}: meta description is ${description.length} chars (keep it under ~160)`);
  }

  // Uniqueness only matters for indexable pages.
  if (!noindex) {
    if (title) {
      if (titles.has(title)) errors.push(`${page}: duplicate <title> — also on ${titles.get(title)}`);
      else titles.set(title, page);
    }
    if (description) {
      if (descriptions.has(description)) {
        errors.push(`${page}: duplicate meta description — also on ${descriptions.get(description)}`);
      } else descriptions.set(description, page);
    }
  }

  // ---- One h1 per page ----
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) errors.push(`${page}: expected exactly one <h1>, found ${h1s}`);

  // ---- JSON-LD ----
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) {
    errors.push(`${page}: no JSON-LD block`);
    continue;
  }

  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      errors.push(`${page}: JSON-LD does not parse — ${error.message}`);
      continue;
    }

    const nodes = parsed['@graph'] ?? [parsed];
    const types = nodes.map((node) => node['@type']);

    if (!types.includes('Organization')) errors.push(`${page}: JSON-LD has no Organization node`);

    for (const node of nodes) {
      if (node['@type'] === 'EducationEvent' || node['@type'] === 'Event') {
        eventNodes += 1;
        const required = ['name', 'startDate', 'endDate', 'location', 'organizer', 'eventStatus', 'eventAttendanceMode', 'image', 'offers'];
        for (const key of required) {
          if (!node[key]) errors.push(`${page}: Event JSON-LD missing "${key}"`);
        }
        if (node.location && !node.location.address?.addressLocality) {
          errors.push(`${page}: Event location needs a PostalAddress with addressLocality`);
        }
        // Timezone-bearing dates, or the event shows at the wrong hour.
        for (const key of ['startDate', 'endDate']) {
          if (node[key] && !/[Zz]|[+-]\d{2}:\d{2}$/.test(node[key])) {
            errors.push(`${page}: Event ${key} has no timezone offset`);
          }
        }
      }

      if (node['@type'] === 'FAQPage') {
        faqNodes += 1;
        if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
          errors.push(`${page}: FAQPage has no questions`);
        }
      }
    }
  }

  // ---- Event facts must be in the HTML, not only in the iframe (PRD §9.5) ----
  if (page.startsWith('/events/') && page !== '/events/') {
    const text = html.replace(/<[^>]+>/g, ' ');
    if (!/\d{1,2}\s+\w+\s+20\d{2}/.test(text)) {
      errors.push(`${page}: no human-readable date found in the page HTML`);
    }
    if (!/Oxford/.test(text)) errors.push(`${page}: no venue city found in the page HTML`);
  }
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} schema/SEO problem(s):\n`);
  for (const error of errors) console.error(`  ${error}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ schema: ${files.length} pages valid — ${eventNodes} Event node(s), ${faqNodes} FAQPage node(s), all titles and descriptions unique`,
);
