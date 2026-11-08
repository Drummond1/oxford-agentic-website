#!/usr/bin/env node
/**
 * Internal link checker — PRD §11, §16.
 *
 * The point of this is the flags-off acceptance test: switching a section off
 * must not leave a single link pointing at a route that no longer builds. It
 * walks the built HTML and resolves every internal href against dist/.
 *
 * Three things are checked per internal href: that the path resolves to a file
 * the host would actually serve, that a same-page `#anchor` exists on the page
 * carrying it, and that a fragment on a cross-page link exists on the page it
 * lands on. The third matters because a renamed heading id turns a deep link
 * into a silent top-of-page landing rather than a 404, so nothing else catches
 * it: `/privacy/#applications` and `/privacy/#interest` are a cross-file
 * contract STATE.md records in words, and the homepage's booking link lands on
 * `#register` on an event page.
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

// A directory is not a thing the host serves, so `stat` alone is too generous:
// it would pass a link to any folder in dist/ that has no index.html.
async function isFile(target) {
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

/**
 * Resolve a site-relative path to the file the host would actually serve, or
 * null. Returns the path rather than a boolean so the caller can look inside it
 * for a fragment.
 */
async function resolveFile(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') {
    const root = path.join(DIST, 'index.html');
    return (await isFile(root)) ? root : null;
  }

  const rel = clean.replace(/^\//, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel.replace(/\/$/, '')}.html`),
  ];

  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

const files = await walk(DIST);
const failures = [];
let checked = 0;

// Anchors that exist on the page they point into.
const idsByFile = new Map();

for (const file of files) {
  const html = await readFile(file, 'utf8');
  idsByFile.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const pageUrl = `/${path.relative(DIST, file).replace(/index\.html$/, '')}`;

  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];

    // External, mail, tel, data and protocol-relative links are out of scope.
    if (/^(https?:|mailto:|tel:|data:|\/\/|#)/.test(href)) {
      // A same-page anchor still has to exist.
      if (href.startsWith('#') && href.length > 1) {
        checked += 1;
        if (!idsByFile.get(file)?.has(href.slice(1))) {
          failures.push(`${pageUrl} → ${href} (no element with that id)`);
        }
      }
      continue;
    }

    checked += 1;
    const target = await resolveFile(href);
    if (target === null) {
      failures.push(`${pageUrl} → ${href}`);
      continue;
    }

    // A fragment on a cross-page link has to exist on the page it lands on.
    // Only HTML targets carry ids, so anything else is out of scope.
    const fragment = href.split('#')[1];
    if (fragment && idsByFile.has(target) && !idsByFile.get(target).has(fragment)) {
      failures.push(
        `${pageUrl} → ${href} (no element with that id on /${path
          .relative(DIST, target)
          .replace(/index\.html$/, '')})`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} broken internal link(s):\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('');
  process.exit(1);
}

console.log(`✓ links: ${checked} internal links across ${files.length} pages all resolve`);
