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
 *  - every internal URL the graph references resolves to a page the host serves
 *  - every event fact is in the HTML, not only inside the Luma iframe
 */
import { readFile, readdir, stat } from 'node:fs/promises';
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

/**
 * Resolve a site-relative path to the file the host would actually serve, or
 * null. Deliberately the same three candidates, in the same order, as
 * `resolveFile` in `scripts/check-links.mjs`, so the two checkers cannot come
 * to disagree about what this host serves: a directory with no `index.html` is
 * not a page, which is why `stat` alone would be too generous.
 */
async function isFile(target) {
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

async function resolvesInDist(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return isFile(path.join(DIST, 'index.html'));

  const rel = clean.replace(/^\//, '');
  for (const candidate of [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel.replace(/\/$/, '')}.html`),
  ]) {
    if (await isFile(candidate)) return true;
  }
  return false;
}

/**
 * Every string in a JSON-LD node that is an absolute URL on this site, nested
 * objects and arrays included, as [dottedPath, url] pairs.
 *
 * Why this needs its own walk rather than riding on either link checker: both
 * of them read HTML attributes and neither one opens a `ld+json` block.
 * `check-links.mjs` matches `href="..."` and then returns early on anything
 * matching `^https?:`, and `check-external-links.mjs` matches
 * `href="https://..."`. So on 14 November 2026 this site published **1,293**
 * absolute internal URLs inside its graphs, across **27 distinct keys** and 64
 * pages, and not one of them was checked by anything. They are not decoration:
 * `@id` is what binds Organization, WebSite, WebPage, Event, Course, FAQPage
 * and BreadcrumbList into one entity an engine can resolve, `item` is a
 * breadcrumb crumb, and `url`, `logo.url`, `image.url`,
 * `primaryImageOfPage.url` and `offers.url` are addresses a consumer
 * dereferences. A reference to a path that no longer builds costs the rich
 * result silently - the page still renders, the JSON still parses, and every
 * other rule in this file still passes.
 *
 * The count was 1,293 with **zero** failures, so this ships as a guard rather
 * than as a fix. What makes it worth a cycle anyway is the rate of change
 * beneath it: `src/lib/schema.ts` was edited on 13 November and twice on
 * 14 November, and `site.config.ts` carries a `redirects` list precisely
 * because slugs here do move.
 *
 * It checks the PATH ONLY, and the fragment is dropped on purpose. A JSON-LD
 * fragment names a node inside the graph - `#organization`, `#webpage`,
 * `#event`, `#faq`, `#series`, `#person` - and is not required to match any
 * element id in the document. Asserting it against the DOM reports 626 failures
 * on a correct site; that was this check's own first draft, and it is recorded
 * here so a later cycle does not "tighten" the rule back into it.
 */
function* internalUrlRefs(value, origin, trail = '') {
  if (Array.isArray(value)) {
    for (const [i, item] of value.entries()) yield* internalUrlRefs(item, origin, `${trail}[${i}]`);
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const here = trail ? `${trail}.${key}` : key;
      if (typeof child === 'string') {
        if (child.startsWith(origin)) yield [here, child];
      } else yield* internalUrlRefs(child, origin, here);
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
/* Publication dates seen carrying a numeric offset, printed on the pass line so a
   later cycle reads a drop as a regression rather than as nothing happening. */
let datedNodes = 0;
/* Internal URL references inside the graph that resolve, printed on the pass
   line for the same reason: a drop should read as a regression. */
let graphRefs = 0;
/* Well-formed breadcrumb trails, printed on the pass line for the same reason
   again: 56 of the 66 built pages carry one, and a drop reads as a regression. */
let breadcrumbTrails = 0;

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

      /*
       * Publication dates must carry a NUMERIC offset, not `Z`.
       *
       * Stricter than the Event rule above on purpose. That one asks only for a
       * timezone, and `Z` satisfies it - which is exactly the form this site
       * published until 14 November 2026, when `toISOString()` was restating an
       * authored `2026-10-19T14:15:00+01:00` as `2026-10-19T13:15:00.000Z` on
       * every guide's `WebPage` and `Article` node. Both name one instant, so a
       * rule that accepts `Z` cannot see the regression coming back. The site's
       * own authored form, which `src/content.config.ts` enforces in as many
       * words, is London local time with the offset written out; anything
       * authored between midnight and 01:00 BST also publishes the WRONG
       * CALENDAR DAY in the `Z` form, disagreeing with the date the page shows.
       */
      for (const key of ['datePublished', 'dateModified']) {
        const value = node[key];
        if (typeof value !== 'string') continue;
        if (/[+-]\d{2}:\d{2}$/.test(value)) {
          datedNodes += 1;
        } else {
          errors.push(
            `${page}: ${node['@type']} ${key} "${value}" has no numeric UTC offset — publish London local time, e.g. "2026-10-19T14:15:00+01:00"`,
          );
        }
      }

      if (node['@type'] === 'FAQPage') {
        faqNodes += 1;
        if (!Array.isArray(node.mainEntity) || node.mainEntity.length === 0) {
          errors.push(`${page}: FAQPage has no questions`);
        }
      }

      /*
       * Breadcrumb SHAPE, which is a different question from the one the graph
       * reference rule below answers.
       *
       * That rule walks 160 `itemListElement.item` URLs and proves each goes
       * somewhere. It cannot see a trail that resolves perfectly and is still
       * wrong as a list: positions out of order, a crumb with no label, or a
       * final crumb that names a different page from the one the reader is on.
       * Google reads this node to replace the URL in a search result, so a trail
       * ending somewhere other than this page advertises the wrong page.
       *
       * The three predicates do not all carry the same weight, and it is worth
       * saying which is which so a later cycle does not mistake cheap insurance
       * for the point of the rule.
       *
       * `position` and `name` are near-tautological TODAY: `breadcrumbSchema`
       * in `src/lib/schema.ts` numbers the items from the array index itself, so
       * they can only fail if that generator changes. They are here because it
       * is the kind of thing that does change - numbering from an explicit field,
       * or building a trail by splitting a path - and the rule should already be
       * standing when it does.
       *
       * The last-crumb check is the one with teeth now. Trails are NOT derived
       * from the URL: `Base.astro` prepends Home and every page hands in the rest
       * by hand, at fourteen call sites across nine route files. The final entry's
       * `path` is therefore typed, and nothing until this rule compared it with
       * the page it ends up on. A route that gains a level, a page copied from a
       * neighbour, or a canonical that moves while the hand-typed trail does not,
       * all land here.
       *
       * Presence is deliberately NOT legislated, in either direction. Ten of the
       * 66 built pages carry no `BreadcrumbList` and all ten are right to lack
       * one: the homepage is the root (`Base.astro` emits the node only when the
       * trail is longer than Home), `/404.html` and the two redirect stubs are not
       * pages in a hierarchy, and the ad-only pages carry no JSON-LD at all by the
       * rule above. Two of the trails that DO exist sit on noindex pages,
       * `/apply/` and `/second-brain-interest/`, where a breadcrumb cannot produce
       * a rich result. Those are inert rather than wrong - the node is still part
       * of a graph a language model may read, and a malformed list is malformed
       * wherever it sits - so this rule validates any trail it finds and leaves
       * whether those two pages should carry one as a separate question.
       */
      if (node['@type'] === 'BreadcrumbList') {
        const items = node.itemListElement;
        if (!Array.isArray(items) || items.length === 0) {
          errors.push(`${page}: BreadcrumbList has no itemListElement`);
        } else {
          breadcrumbTrails += 1;
          items.forEach((item, i) => {
            if (item.position !== i + 1) {
              errors.push(
                `${page}: BreadcrumbList item ${i + 1} has position ${JSON.stringify(item.position)} — positions must run 1..${items.length} in order`,
              );
            }
            if (typeof item.name !== 'string' || item.name.trim() === '') {
              errors.push(`${page}: BreadcrumbList item ${i + 1} has no name`);
            }
            if (typeof item.item !== 'string' || item.item === '') {
              errors.push(`${page}: BreadcrumbList item ${i + 1} has no item URL`);
            }
          });
          const last = items[items.length - 1];
          if (canonical && typeof last?.item === 'string' && last.item !== canonical) {
            errors.push(
              `${page}: BreadcrumbList ends at "${last.item}" but this page's canonical is "${canonical}" — the last crumb must be the page itself`,
            );
          }
        }
      }

      /*
       * Every internal URL in the graph resolves to a page the host serves.
       *
       * The origin comes off this page's own canonical link rather than from a
       * constant, so the rule follows the domain instead of having to be kept
       * in step with it. `canonical` is already required above, so it is there.
       */
      if (canonical) {
        const origin = new URL(canonical).origin;
        for (const [trail, url] of internalUrlRefs(node, origin)) {
          if (await resolvesInDist(url.slice(origin.length))) {
            graphRefs += 1;
          } else {
            errors.push(
              `${page}: ${node['@type']} JSON-LD references "${url}" at "${trail}" — nothing at that path is served from dist/`,
            );
          }
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
  `✓ schema: ${files.length} pages valid — ${eventNodes + nestedEventNodes} Event node(s) (${eventNodes} top-level, ${nestedEventNodes} nested entity), ${faqNodes} FAQPage node(s), ${datedNodes} offset-bearing publication date(s), ${graphRefs} resolving internal graph reference(s), ${breadcrumbTrails} well-formed breadcrumb trail(s), all titles and descriptions unique`,
);
