#!/usr/bin/env node
/**
 * Stale forward-tense cohort dates in rendered copy.
 *
 * Everything the event template derives from the collection self-heals: a
 * cohort's status, its meta description, its hero band, the footer's "Upcoming"
 * list and `llms.txt` all read `effectiveStatus`, which computes "past" from
 * `endDate`. What does not self-heal is a date typed into prose - a guide's
 * closing paragraph, a `home.ts` answer, an FAQ answer in event frontmatter.
 * Those keep claiming a day is still to come for as long as nobody notices.
 *
 * This is not hypothetical and it is not new. Measured on 5 November 2026, an
 * answer engine holding this site named the Second Brain cohort's *passed*
 * 21 October date as "the next listed in-person date". The event template's own
 * comment writes the next instance down by name: the two on-sale summaries
 * "become wrong the morning after each day runs, on 19 and 26 November". So the
 * failure has a date on it, and until now it had no detector - the same shape as
 * backlog 66 and 77, where the defect was fixed and the thing that would have
 * caught it was not.
 *
 * Hard fail, on the reasoning the title-length check already uses: a wrong date
 * on the page that takes the booking is worse than a blocked deploy, and the fix
 * is always available - put the sentence in the past tense. A false positive
 * costs one skipped cycle, which is the cheaper side of that trade.
 *
 * A second check rides the same page walk and is warn-only: a long-month date
 * with no four-digit year near it. Its evidence, its window and why it must
 * never fail are documented where it is implemented, below.
 *
 * Pass `--now=2026-11-20` to prove it fires. That is the flag's only purpose.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const EVENTS = path.resolve('src/content/events');

const nowArg = process.argv.find((a) => a.startsWith('--now='));
const now = nowArg ? new Date(nowArg.slice('--now='.length)) : new Date();
if (Number.isNaN(now.getTime())) {
  console.error(`✗ dates: --now is not a date I can read`);
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** One frontmatter scalar, unquoted. Enough for the four keys read here. */
function field(src, key) {
  return src.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]?.trim();
}

/*
 * Only the long-month forms, "19 November" and "19 November 2026", because they
 * are what prose uses. The abbreviated "19 Nov 2026" is the footer's and the
 * cards', both derived from the collection, so including it would only add ways
 * to be wrong about surfaces that cannot go stale.
 */
const LONG = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London',
});

const pastCohorts = [];
for (const name of (await readdir(EVENTS)).filter((f) => f.endsWith('.md'))) {
  const src = await readFile(path.join(EVENTS, name), 'utf8');
  const endDate = field(src, 'endDate');
  const startDate = field(src, 'startDate');
  if (!endDate || !startDate) {
    console.error(`✗ dates: ${name} has no startDate/endDate to read`);
    process.exit(1);
  }
  if (new Date(endDate) >= now) continue;
  const full = LONG.format(new Date(startDate));            // 21 October 2026
  const short = full.replace(/ \d{4}$/, '');                 // 21 October
  pastCohorts.push({ file: name, cohort: field(src, 'cohort'), full, short });
}

/*
 * A window around the date is flagged when it claims the date in the future,
 * says nothing to mark the day as gone, and is about one of ours. The last
 * condition is what keeps the guard off other people's dates: a guide names the
 * Oxford online programme's own 16 September and 11 November start dates, and
 * 16 September is also Cohort 2's, so date-matching alone reads a true sentence
 * about somebody else's course as a stale claim about ours.
 *
 * The window is the clause the date sits in - bounded by the nearest sentence
 * end, and capped at 90 characters either side. A sentence is the natural unit
 * and was the first attempt, but a key-facts table and a "who it is for" list
 * carry no full stop between their rows, so whole panels collapsed into one
 * 600-character "sentence" and any forward-tense word anywhere in the panel
 * attached itself to a date rows away. The cap is what makes the match local.
 */
/*
 * `is on` and `are on` were literal, so any word between the verb and its
 * preposition slipped the list. Measured on the built site on 16 November 2026,
 * one hand-authored sentence does exactly that - the Coding programme page's
 * "Where in Oxford is it held?" answer, "Cohort 1 is there on Thursday
 * 26 November 2026" - and it was the only one of 32 tense-blind date windows
 * that is neither a derived card (which self-heals) nor deliberately
 * tense-neutral prose. On 27 November that sentence is false, the card beside
 * it has already gone, and the old pattern returned nothing: `is there on`
 * matched neither `is on` nor anything else in either list, so the answer read
 * as a day still on offer to every human and to no check. This was backlog 102,
 * recorded on 15 November when the instance that exposed it was rewritten away
 * for other reasons; the instance above is a second, independent one.
 *
 * So one optional word is allowed between the verb and `on`, which also covers
 * "is held on" and "is also on" without enumerating adverbs, and `not` is
 * excluded because "is not on 16 September" denies a date rather than claiming
 * it.
 *
 * `at` is deliberately NOT accepted next to `is`/`are`, and that is measured
 * rather than argued. Accepting it fails this build today, on a true sentence:
 * the Agentic programme page's "Cohorts 2, 3 and 4 are all at Worcester College
 * on Walton Street - 16 September, 19 November and 3 December 2026", which the
 * 15 November cycle wrote in that shape precisely so it would stay true as each
 * date passes. A venue fact survives its dates; a scheduling claim does not, and
 * `at` is how the first one is written. Later horizons add two and then three
 * copies of that same false positive and no real finding at any of them. Since this gate is
 * a hard fail, a pattern that blocks deploys on correct copy is worse than one
 * blind spot, so the widening stops at `on`.
 *
 * Measured before shipping, by running both patterns over all 58 indexable
 * pages at seven horizons (16 and 20 and 27 November, 4 December, 29 January,
 * 5 February and 1 March): finding sets identical today and on 20 November
 * (0 and 6), and from 27 November onwards exactly one finding added - the
 * sentence above - with none lost at any horizon.
 */
const FORWARD =
  /\b(runs?|takes|takes? place|will|next|upcoming|book|opens?|starts?|begins?)\b|\b(?:is|are)(?:\s+(?!not\b)\w+)?\s+on\b/i;
const PAST = /\b(ran|took place|has run|have run|had run|was|were|passed|closed|previous|previously|earlier|last year|already)\b/i;
const OURS = /\b(cohort|bootcamp)\b/i;
const WINDOW = 90;

/*
 * Which tense applies to THIS date, when the window holds both.
 *
 * The first version of this rule tested `PAST` against the whole window and
 * skipped on a hit, which reads as "something here says the day has gone". That
 * is true of a window describing one day, and false of a window describing
 * several - and the site has a page whose whole subject is several. Measured on
 * the built site on 15 November 2026, `/guides/when-ai-executive-cohorts-run/`
 * publishes, in one sentence:
 *
 *   "in 2026 the Oxford Agentic Bootcamp ran on 16 September and runs again on
 *    19 November, the Coding Bootcamp takes its first cohort a week after that
 *    on 26 November, all three at Worcester College, and the Second Brain
 *    Bootcamp ran on 21 October at the Pitt Rivers Museum."
 *
 * Every clause is true today. On 20 November the "runs again on 19 November"
 * clause is false, and on 27 November so is the 26 November one - and the old
 * rule stayed silent on both, because `ran` (which governs 16 September, a
 * different cohort) sat inside the same window and exempted them. Eleven other
 * instances failed correctly at --now=2026-11-20 and this page was not among
 * them. So the guard's blind spot was exactly the page a buyer asking when the
 * next cohort runs would land on.
 *
 * The fix is to ask which tense word GOVERNS the date rather than which ones
 * are near it, and in prose of this shape the governing verb precedes its date:
 * "ran on 16 September", "runs again on 19 November", "takes its first cohort
 * ... on 26 November", "Took place on 16 September 2026". So the nearest tense
 * word before the date wins, and a past verb further back no longer speaks for
 * a date it does not govern.
 *
 * Where no tense word precedes the date inside the window, the old
 * whole-window reading stands. That is not laziness: it is what catches the
 * derived listings, where the marker is a bare "Upcoming" heading rows above a
 * date, and dropping it would lose instances that fail correctly today.
 */
function governingTense(before, window) {
  const pastAt = lastIndexOfMatch(before, PAST);
  const forwardAt = lastIndexOfMatch(before, FORWARD);
  if (pastAt === -1 && forwardAt === -1) {
    return PAST.test(window) ? 'past' : FORWARD.test(window) ? 'forward' : 'none';
  }
  return pastAt > forwardAt ? 'past' : 'forward';
}

/** Where the last match of `re` starts in `text`, or -1. */
function lastIndexOfMatch(text, re) {
  const global = new RegExp(re.source, `${re.flags.replace('g', '')}g`);
  let at = -1;
  for (const match of text.matchAll(global)) at = match.index;
  return at;
}

/*
 * The warn-only check: a long-month date in rendered copy with no four-digit
 * year anywhere near it.
 *
 * The evidence is an answer engine's own words about a third-party listing of
 * us, read on 11 November 2026: "It's also past, and the listing doesn't give a
 * year." That is a retrieval engine saying out loud that a year-less date is one
 * it will not place. The sweep it prompted found eleven of our own booking
 * sentences written that way, every one a guide closer, and they were fixed that
 * evening by a one-off script rather than by anything in this build - so the
 * next closer somebody typed would have been bare again.
 *
 * Why 400 characters, and why either side: it is the window that sweep measured
 * with, and the one that separated the eleven defective instances from the ten
 * sound ones. The ten are sound because their year is genuinely nearby rather
 * than in the same clause - three event pages carry it in a key-facts panel a
 * few hundred characters away, and a guide names the Oxford online programme's
 * dates inside a clause that already says "for 2026".
 *
 * Warn, never fail, which is the opposite of the check above. A hard fail would
 * block every deploy on those ten correct instances, and tightening the window
 * until they passed would start missing the real ones. A bare date reads a
 * little worse to one kind of reader; it is not a wrong fact on a booking page.
 */
const MONTHS =
  'January|February|March|April|May|June|July|August|September|October|November|December';
const LONG_DATE = new RegExp(`\\b(\\d{1,2}) (${MONTHS})\\b(?: (\\d{4}))?`, 'g');
const YEAR_NEARBY = /\b(19|20)\d{2}\b/;
const YEAR_CONTEXT = 400;

const errors = [];
const warnings = [];
let pagesRead = 0;
let datesSeen = 0;
let datesWithYear = 0;
let datesWithYearNearby = 0;

for (const file of await walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const page = `/${path.relative(DIST, file).replace(/index\.html$/, '')}`;
  if (html.includes('http-equiv="refresh"')) continue;
  // noindex pages are the lead-gen and voice pages, which STATE.md reserves to
  // Drummond. Flagging copy the loop is told not to touch would only be noise.
  if (html.includes('name="robots" content="noindex')) continue;
  pagesRead += 1;

  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/\s+/g, ' ');

  for (const cohort of pastCohorts) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(cohort.short, from);
      if (at === -1) break;
      from = at + cohort.short.length;

      const before = text.slice(Math.max(0, at - WINDOW), at);
      const after = text.slice(from, from + WINDOW);
      const window = `${before.slice(before.lastIndexOf('. ') + 1)}${cohort.short}${
        after.includes('. ') ? after.slice(0, after.indexOf('. ') + 1) : after
      }`;

      if (!OURS.test(window)) continue;
      // `before` is the window's own left half, so the governing verb is looked
      // for inside the same 90 characters the rest of the rule reasons about.
      if (governingTense(window.slice(0, window.indexOf(cohort.short)), window) !== 'forward') continue;
      errors.push(
        `${page}: names ${cohort.cohort ?? cohort.file}'s passed ${cohort.full} as still to come — "${window.trim()}"`,
      );
    }
  }

  for (const match of text.matchAll(LONG_DATE)) {
    datesSeen += 1;
    if (match[3]) {
      datesWithYear += 1;
      continue;
    }
    const at = match.index;
    const around = text.slice(Math.max(0, at - YEAR_CONTEXT), at + match[0].length + YEAR_CONTEXT);
    if (YEAR_NEARBY.test(around)) {
      datesWithYearNearby += 1;
      continue;
    }
    warnings.push(
      `${page}: "${match[0]}" carries no year within ${YEAR_CONTEXT} characters — "${text
        .slice(Math.max(0, at - 60), at + match[0].length + 60)
        .trim()}"`,
    );
  }
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} stale forward-tense date(s):\n`);
  for (const error of errors) console.error(`  ${error}`);
  console.error('\n  Each one is a date that has passed, written as a day still on offer.');
  console.error('  Put the sentence in the past tense, or point it at the next cohort.\n');
  process.exit(1);
}

// Printed after the hard gate above and before the pass line: visible in every
// build log, never able to stop one.
if (warnings.length > 0) {
  console.log(`\n! ${warnings.length} year-less date warning(s) — not blocking:\n`);
  for (const warning of warnings) console.log(`  ${warning}`);
  console.log('');
}

console.log(
  `✓ dates: ${pagesRead} indexable pages carry no passed cohort date written as upcoming (${pastCohorts.length} past cohort(s) checked)`,
);
console.log(
  `✓ dates: ${datesSeen} long-month date(s) in rendered copy — ${datesWithYear} carry a year, ${datesWithYearNearby} carry one within ${YEAR_CONTEXT} characters, ${warnings.length} carry none`,
);
