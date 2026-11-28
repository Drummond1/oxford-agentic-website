/**
 * The Day Hub: the unlisted attendee page for one cohort's day (DRU-17, 22 Nov 2026).
 *
 * One cohort = one file in `src/content/day/<id>.ts` default-exporting a `DayCohort`.
 * `src/pages/day/[cohort].astro` globs that folder, so a future cohort (oab5) is a
 * new file and nothing else: no route, no component and no code change.
 *
 * The shape mirrors the Oxford Agentic plugin's `config/sessions.json` (id, title,
 * lead, start, end, slides_url, skill), plus the three things the plugin does not
 * hold yet: prompts, files and a fallback.
 *
 * Missing facilitator links are `null`, never a guessed URL. The page shows
 * `comingSoon` in their place.
 */

export type DayLinkKey = 'whatsapp' | 'preDayForm' | 'feedbackForm' | 'luma' | 'claudeDownload' | 'n8nGuide' | 'nextEvent';

export interface DayTimetableRow {
  /** 24-hour "HH:MM", Europe/London. */
  start: string;
  /** Short name. The banner reads this alone. */
  title: string;
  /** Printed after the title in the timetable only: "Break - tea and coffee in the room". */
  detail?: string;
  /** Who leads. Empty for doors, breaks, lunch and the finish. */
  lead?: string;
  /** How the banner words the lead after "with", when `lead` does not read well there. */
  leadInline?: string;
  /** `session` rows may carry a block under Today. `finish` ends the day. */
  kind: 'doors' | 'session' | 'break' | 'finish';
  /** Links the row to a `sessions` entry. */
  session?: string;
}

export interface DayFile {
  label: string;
  url: string;
}

export interface DayPrompt {
  label?: string;
  text: string;
}

export interface DaySession {
  id: string;
  title: string;
  lead: string;
  start: string;
  end: string;
  room: string;
  slides_url: string | null;
  prompts: DayPrompt[];
  files: DayFile[];
  /** The plugin skill to run, for example "workflow-discovery". Shown only when `pluginStep` is on. */
  skill: string | null;
  /** The "If something's blocked" line. */
  fallback: string | null;
}

export interface DayStep {
  id: string;
  title: string;
  /** Inline `[text](url)` and `[text]({linkKey})` are supported. A null link prints the text plus `comingSoon`. */
  body: string;
  /** Shown only when the cohort's `pluginStep` is on. */
  onlyWithPlugin?: boolean;
}

export interface DayRouteStep {
  text: string;
  /** A photo of the turn: doors and signs only, never people. */
  photo?: { src: string; alt: string };
}

export interface BannerLine {
  strong: string;
  rest: string;
}

export interface DayCohort {
  id: string;
  /** ISO date of the day, Europe/London. */
  date: string;
  timezone: 'Europe/London';
  pageTitle: string;
  h1: string;
  dateLine: string;
  intro: string;
  /** False until the 27 Nov call names one owner for the plugin. Hides that step and the skill rows. */
  pluginStep: boolean;
  /** Printed in place of any link that is not known yet. */
  comingSoon: string;
  links: Record<DayLinkKey, string | null>;
  setup: { heading: string; intro: string };
  steps: DayStep[];
  gettingThere: {
    heading: string;
    paragraphs: string[];
    routeHeading: string;
    routeSteps: DayRouteStep[];
    routeEmpty: string;
    late: BannerLine;
  };
  wifi: { heading: string; body: string };
  whatsapp: { heading: string; body: string };
  colleague: { heading: string; body: string };
  today: { heading: string; intro: string; timetableNote: string; sessionEmpty: string };
  /** False while the times between start and finish are unconfirmed: the page shows `today.timetableNote`. Nothing shows when true. */
  timetableConfirmed: boolean;
  timetable: DayTimetableRow[];
  sessions: DaySession[];
  /** Items may open with a **bold** lead. */
  onTheDay: { heading: string; items: string[] };
  keepGoing: {
    heading: string;
    intro: string;
    feedbackHeading: string;
    feedbackBody: string;
    nextHeading: string;
    nextBody: string;
  };
  /** `{steps}` is filled with "five" or "six" from the visible step count. */
  banner: {
    before: BannerLine;
    early: BannerLine;
    doors: BannerLine;
    after: BannerLine;
    now: string;
    next: string;
    with: string;
    at: string;
  };
}

/* ------------------------------------------------------------------ time */

export interface LondonNow {
  /** "YYYY-MM-DD" */
  date: string;
  /** Minutes since midnight. */
  minutes: number;
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "09:15" to "9:15am", "11:00" to "11am", "13:15" to "1:15pm". */
export const clock12 = (hhmm: string): string => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
};

export type BannerState =
  | { kind: 'before' }
  | { kind: 'early' }
  | { kind: 'doors' }
  | { kind: 'session'; now: DayTimetableRow; next: DayTimetableRow | null }
  | { kind: 'after' };

/**
 * Where the day is, given the London wall-clock time. Pure, so the page script and a
 * test can share it.
 *
 * Doors open at the `doors` row; before it is "early", between it and the first
 * non-doors row is "doors", then each row runs until the next starts, and the
 * `finish` row ends the day. Any later date is "after".
 */
export function bannerState(cohort: Pick<DayCohort, 'date' | 'timetable'>, now: LondonNow): BannerState {
  if (now.date < cohort.date) return { kind: 'before' };
  if (now.date > cohort.date) return { kind: 'after' };

  const rows = cohort.timetable;
  const doors = rows.find((r) => r.kind === 'doors');
  const finish = rows.find((r) => r.kind === 'finish');
  const first = rows.find((r) => r.kind !== 'doors');
  if (doors && now.minutes < toMinutes(doors.start)) return { kind: 'early' };
  if (finish && now.minutes >= toMinutes(finish.start)) return { kind: 'after' };
  if (first && now.minutes < toMinutes(first.start)) return { kind: 'doors' };

  let index = -1;
  rows.forEach((r, i) => {
    if (r.kind !== 'doors' && r.kind !== 'finish' && toMinutes(r.start) <= now.minutes) index = i;
  });
  if (index < 0) return { kind: 'doors' };
  const next = rows.slice(index + 1).find((r) => r.kind !== 'finish') ?? null;
  return { kind: 'session', now: rows[index], next };
}

/* ------------------------------------------------------------------ text */

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Inline links for cohort copy: `[text](https://...)`, `[text](/path/)` or
 * `[text]({whatsapp})` (a key in `links`). Everything else is escaped. A link whose
 * value is null prints its text plainly and puts the cohort's `comingSoon` note at the end of the
 * line. `**bold**` is supported.
 */
export function richText(source: string, cohort: Pick<DayCohort, 'links' | 'comingSoon'>): string {
  let out = '';
  let last = 0;
  let missing = false;
  const plain = (t: string) => escapeHtml(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  for (const match of source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    out += plain(source.slice(last, match.index));
    const [whole, text, target] = match;
    const key = target.match(/^\{(\w+)\}$/)?.[1] as DayLinkKey | undefined;
    const href = key ? cohort.links[key] : target;
    if (href) {
      const external = /^https?:/.test(href);
      out += `<a href="${escapeHtml(href)}"${external ? ' rel="noopener"' : ''}>${escapeHtml(text)}</a>`;
    } else {
      out += escapeHtml(text);
      missing = true;
    }
    last = (match.index ?? 0) + whole.length;
  }
  out += plain(source.slice(last));
  return missing ? `${out} <span class="day-soon">${escapeHtml(cohort.comingSoon)}</span>` : out;
}
