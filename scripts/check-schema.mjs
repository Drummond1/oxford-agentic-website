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

/**
 * Every empty-array property in a JSON-LD node, nested objects included, as
 * [dottedPath, value] pairs. Yields nothing for a well-formed node.
 */
function* emptyArrays(value, trail = '') {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) yield* emptyArrays(item, `${trail}[${i}]`);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const here = trail ? `${trail}.${key}` : key;
      if (Array.isArray(child) && child.length === 0) yield [here, child];
      else yield* emptyArrays(child, here);
    }
  }
}

/** The two types this site ever publishes for a cohort. */
function isEventNode(value) {
  return value?.['@type'] === 'EducationEvent' || value?.['@type'] === 'Event';
}

/**
 * Event nodes nested inside another node, as [dottedPath, node] pairs.
 *
 * `nodes` below is `@graph` only, so for two years every check in this file saw
 * exactly the top level and nothing under it. That is not a theoretical gap:
 * `eventListingItem`'s own comment in `src/lib/schema.ts` records that a node
 * missing `image` and `offers` "passed every build since it was written", and
 * the 25 October cycle fixed the data without adding the detector - the same
 * shape as the quote guard and the link checker, where the defect was fixed and
 * the thing that would have caught it was not.
 *
 * What is nested, measured on all 66 built pages: 34 nodes, of which 29 are
 * `subEvent` children - agenda rows, which correctly carry a name, a time and a
 * place and none of `organizer`, `eventStatus`, `image` or `offers`, and must
 * stay exempt - and 5 are the entity-level cohorts inside `/events/`'s
 * `ItemList`. Those five are the reason this matters: `/events/` is the page an
 * engine reads to answer "when is the next cohort", its `ItemList` was given
 * dates on 13 November precisely because twelve consecutive GEO probes recorded
 * engines taking a passed date off someone else's crawl, and nothing validated
 * the result.
 *
 * Two independent tests, and today they agree exactly on all 34: skip anything
 * reached through a `subEvent` key, and require both `@id` and `url`, which is
 * what a node claiming to be an entity in its own right carries. All 5 entities
 * have both; none of the 29 agenda rows has either. A nested node with neither
 * is left alone rather than guessed at.
 */
function* nestedEventEntities(value, trail = '', viaSubEvent = false, depth = 0) {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) {
      yield* nestedEventEntities(item, `${trail}[${i}]`, viaSubEvent, depth + 1);
    }
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (depth > 0 && !viaSubEvent && isEventNode(value) && value['@id'] && value.url) {
    yield [trail, value];
  }
  for (const [key, child] of Object.entries(value)) {
    const here = trail ? `${trail}.${key}` : key;
    yield* nestedEventEntities(child, here, viaSubEvent || key === 'subEvent', depth + 1);
  }
}

/** Roughly what Google renders before it cuts a title. */
const TITLE_LIMIT = 60;
/** The documented meta-description target; over this warns, over 200 fails. */
const DESCRIPTION_TARGET = 160;

const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
let eventNodes = 0;
// Counted apart from the top level so the pass line explains its own total:
// this detector took the figure from 7 to 12 on the day it shipped.
let nestedEventNodes = 0;
let faqNodes = 0;

const files = await walk(DIST);

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = `/${path.relative(DIST, file).replace(/index\.html$/, '')}`;

  // Astro's redirect stubs (site.config `redirects`) are meta-refresh pages
  // with no content of their own — content-page checks do not apply to them.
  if (html.includes('http-equiv="refresh"')) continue;

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

  /*
   * Title length was not checked at all, which is how five pages — three of them
   * event pages, including the one people book from — ended up truncated in
   * search results. Entities are decoded first so an apostrophe is measured as
   * the one character a reader sees rather than the six in the markup.
   *
   * Hard fail rather than a warning: unlike a long description, which Google
   * often rewrites anyway, a cut title loses the words the page was written to
   * rank for, and the fix is always available — shorten it.
   */
  if (title && !noindex) {
    const shown = title
      .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&apos;/g, "'");
    if (shown.length > TITLE_LIMIT) {
      errors.push(`${page}: <title> is ${shown.length} chars, over the ~${TITLE_LIMIT} a search result shows`);
    }
  }

  /*
   * Descriptions between the documented target and the hard limit are reported
   * without failing. The threshold above stays at 200 because the one page
   * currently in this band is the homepage, whose description is the canonical
   * entity string reused verbatim on Luma and LinkedIn — it cannot move here
   * alone, and blocking every deploy until it does would be the wrong trade.
   */
  if (description && description.length > DESCRIPTION_TARGET && description.length <= 200) {
    warnings.push(`${page}: meta description is ${description.length} chars (target ${DESCRIPTION_TARGET})`);
  }

  /*
   * Straight apostrophes in rendered copy. Markdown prose is run through the
   * typographer, so body text gets a curly apostrophe; frontmatter strings,
   * page copy written in .astro files and data in .json bypass it and keep the
   * typewriter mark. That put 'hands-on' in a guide's Newsreader h1 directly
   * above “hands-on” in its own body — the same phrase set two ways on one
   * page. Warn rather than fail: the deploy is not worth stopping over a
   * glyph, and a quoted terminal command could legitimately carry one.
   */
  /*
   * The same fault with the other mark, and it reached the live site: on
   * 4 November three frontmatter strings were still set in typewriter double
   * quotes - two guide capsules and a programme FAQ question - and one of them
   * sat directly beneath an h1 that used real ones. They were found only
   * because a cycle swept every built page for a `"` by hand, which is a check
   * that has to be remembered rather than one that runs. The guard above was
   * written for the apostrophe alone, so the double-quote half of exactly the
   * same defect class stayed unguarded. Both marks are now read off the same
   * stripped prose, on the same warn-never-fail terms: a straight double quote
   * is legitimate in an inch measurement or a quoted command, so this must not
   * gate a deploy. The count today is zero, which is what makes it a guard
   * against the next frontmatter string rather than a to-do list.
   */
  if (!noindex) {
    const prose = html
      .replace(/<(script|style|code|pre)[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
    const marks = [
      ['apostrophe', /\S{0,24}(?:&#(?:39|x27);|')\S{0,16}/],
      ['double quote', /\S{0,24}(?:&(?:quot|#34|#x22);|")\S{0,16}/],
    ];
    for (const [name, pattern] of marks) {
      const straight = prose.match(pattern);
      if (straight) {
        warnings.push(`${page}: straight ${name} in rendered copy — ${straight[0].trim()}`);
      }
    }
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

  // Ad-only pages (noindex, nofollow) carry no JSON-LD on purpose.
  const adOnly = html.includes('name="robots" content="noindex, nofollow"');
  if (adOnly) {
    if (html.includes('application/ld+json')) errors.push(`${page}: ad-only page must not carry JSON-LD`);
    continue;
  }

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

    /*
     * One set of Event rules, read by the top level and by every nested entity,
     * so the two cannot come to disagree about what an event node must carry.
     * `where` is empty for a top-level node, which keeps those messages exactly
     * as they have always read, and names the path for a nested one.
     */
    const checkEventNode = (node, where) => {
      const required = ['name', 'startDate', 'endDate', 'location', 'organizer', 'eventStatus', 'eventAttendanceMode', 'image', 'offers'];
      for (const key of required) {
        if (!node[key]) errors.push(`${page}: Event JSON-LD${where} missing "${key}"`);
      }
      if (node.location && !node.location.address?.addressLocality) {
        errors.push(`${page}: Event${where} location needs a PostalAddress with addressLocality`);
      }
      // Timezone-bearing dates, or the event shows at the wrong hour.
      for (const key of ['startDate', 'endDate']) {
        if (node[key] && !/[Zz]|[+-]\d{2}:\d{2}$/.test(node[key])) {
          errors.push(`${page}: Event${where} ${key} has no timezone offset`);
        }
      }
    };

    for (const node of nodes) {
      if (isEventNode(node)) {
        eventNodes += 1;
        checkEventNode(node, '');
      }

      for (const [trail, nested] of nestedEventEntities(node)) {
        nestedEventNodes += 1;
        checkEventNode(nested, ` at ${trail}`);
      }

      if (node['@type'] === 'FAQPage') {
        faqNodes += 1;
        if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
          errors.push(`${page}: FAQPage has no questions`);
        }
      }

      // An empty array claims a property and then supplies no value for it.
      // Omit the property instead. Generalises the FAQPage check above, and
      // added after `hasCourseInstance: []` was found waiting for the first
      // programme to run out of scheduled cohorts.
      for (const [key] of emptyArrays(node)) {
        errors.push(`${page}: ${node['@type']} JSON-LD has an empty array at "${key}" — omit the property instead`);
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

// Printed after the pass line so they are visible without ever gating a deploy.
if (warnings.length > 0) {
  console.log(`\n! ${warnings.length} SEO warning(s) — not blocking:\n`);
  for (const warning of warnings) console.log(`  ${warning}`);
  console.log('');
}

console.log(
  `✓ schema: ${files.length} pages valid — ${eventNodes + nestedEventNodes} Event node(s) (${eventNodes} top-level, ${nestedEventNodes} nested entity), ${faqNodes} FAQPage node(s), all titles and descriptions unique`,
);
