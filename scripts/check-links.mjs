#!/usr/bin/env node
/**
 * Internal link checker — PRD §11, §16.
 *
 * The point of this is the flags-off acceptance test: switching a section off
 * must not leave a single link pointing at a route that no longer builds. It
 * walks the built HTML and resolves every internal href against dist/.
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

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

/** Resolve a site-relative path to a file that the host would actually serve. */
async function resolves(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return exists(path.join(DIST, 'index.html'));

  const rel = clean.replace(/^\//, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, `${rel.replace(/\/$/, '')}.html`),
  ];

  for (const candidate of candidates) {
    if (await exists(candidate)) return true;
  }
  return false;
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
    if (!(await resolves(href))) failures.push(`${pageUrl} → ${href}`);
  }
}

if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} broken internal link(s):\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('');
  process.exit(1);
}

console.log(`✓ links: ${checked} internal links across ${files.length} pages all resolve`);
