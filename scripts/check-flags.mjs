#!/usr/bin/env node
/**
 * The section-visibility acceptance test — PRD §11, §20.
 *
 * Builds the site twice, once with every feature flag on and once with every
 * flag off, and runs the link and schema checks over both. Either build must be
 * a coherent, complete-feeling site with zero broken links.
 *
 * It edits site.config.ts in place and always restores it, including on failure.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const CONFIG = 'site.config.ts';
const original = await readFile(CONFIG, 'utf8');

/** Rewrite just the `features` block, leaving the rest of the file untouched. */
function withFlags(source, value) {
  return source.replace(/(\n  features: \{)([\s\S]*?)(\n  \},)/, (_, open, body, close) => {
    const rewritten = body.replace(/^(\s*)(\w+):\s*(true|false),/gm, `$1$2: ${value},`);
    return `${open}${rewritten}${close}`;
  });
}

function run(label) {
  console.log(`\n──── ${label} ────`);
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
}

let failed = false;

try {
  for (const [label, value] of [
    ['all flags ON', true],
    ['all flags OFF', false],
  ]) {
    await writeFile(CONFIG, withFlags(original, value));

    // Confirm the rewrite actually took, rather than silently testing nothing.
    const written = await readFile(CONFIG, 'utf8');
    const block = written.match(/\n  features: \{([\s\S]*?)\n  \},/)?.[1] ?? '';
    const flags = [...block.matchAll(/^\s*(\w+):\s*(true|false),/gm)];
    if (flags.length === 0 || flags.some(([, , v]) => v !== String(value))) {
      throw new Error(`could not set all flags to ${value} — check the features block format`);
    }

    run(`${label} (${flags.length} flags)`);
  }
} catch (error) {
  failed = true;
  console.error(`\n✗ flag acceptance test failed: ${error.message}`);
} finally {
  await writeFile(CONFIG, original);
  console.log(`\n${CONFIG} restored.`);
}

if (failed) process.exit(1);
console.log('\n✓ flags: both the all-on and all-off builds pass link and schema checks');
