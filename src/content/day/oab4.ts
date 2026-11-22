/**
 * Day Hub content for the Oxford Agentic Bootcamp, Cohort 4: Thursday 3 December 2026.
 * Served at /day/oab4/ - unlisted (noindex, nofollow), out of the sitemap, linked from nowhere.
 *
 * DRU-17, written 22 Nov 2026. The words are the copy file
 * `Projects/Oxford Agentic Bootcamp/Marketing/website/DRU-17-copy-2026-11-22.md` (tone check 100/100),
 * used word for word. Where the copy file shows a [PLACEHOLDER], attendees see `comingSoon`
 * (or nothing) and the note is kept here as a comment.
 *
 * Facts come from the Cohort 4 drafts in the vault. Where they disagree the newest wins:
 *   OAB4-wayfinding-and-cover-note-DRAFT-2026-11-22.md (J1b, newest, attendee-facing)
 *   OAB4-facilitator-brief-and-run-sheet-DRAFT-2026-11-19.md (s1, s3)
 *   OAB4-one-week-joining-blast-DRAFT-2026-11-18.md
 *
 * To add a cohort (for example oab5): copy this file to `oab5.ts`, change `id`, the date and the
 * words. The route picks it up. Nothing else changes.
 */
import type { DayCohort } from '../../lib/day';

const cohort: DayCohort = {
  id: 'oab4',
  date: '2026-12-03',
  timezone: 'Europe/London',

  pageTitle: 'Your day - Oxford Agentic Bootcamp, 3 December',
  h1: 'Your day at the Oxford Agentic Bootcamp',
  dateLine: 'Thursday 3 December 2026 · Nash Suite, Worcester College, Walton Street, Oxford OX1 2HB · 9:15am to 5pm',
  intro:
    "Arrive set up, and spend the day building a working workflow on your own task. Everything for the day is here: what to set up before you come, what's on and when, every slide and prompt, and help if you get stuck. Keep this page open on the day.",

  // PLACEHOLDER (copy file, step 4): hidden by default. Switch on only if the 27 Nov call names one
  // owner for the plugin (run sheet s1). When it is off the steps renumber and the heading and the
  // banner say "five" instead of "six".
  pluginStep: false,

  comingSoon: 'Coming Tue 1 Dec',

  links: {
    // PLACEHOLDER: OAB4 WhatsApp invite link - the group is not yet created.
    whatsapp: null,
    // PLACEHOLDER: pre-day form link - which form is TBC (the C3 form reused, or the OAB4 copy).
    preDayForm: null,
    // PLACEHOLDER: OAB4 feedback form link - to be built and tested by Mon 30 Nov (run sheet s1).
    feedbackForm: null,
    luma: 'https://luma.com/oxfordagentic4',
    // PLACEHOLDER: fact-checker to confirm. The copy prints "claude.ai/download"; that address redirects
    // to https://claude.com/download (the build's outbound-link check, 22 Nov), so the link points there.
    claudeDownload: 'https://claude.com/download',
    // PLACEHOLDER: one n8n guide link from Emine, coming Tue 1 Dec. Run sheet s1 rule: one link only.
    n8nGuide: null,
    // The site's own Cohort 5 event page (Thursday 28 January 2027). No price, no code, no seat count.
    nextEvent: '/events/oxford-agentic-bootcamp-cohort-5/',
  },

  setup: {
    heading: '{Steps} steps before the day',
    intro: 'Doing these before Thursday means the morning goes on building, not setting up. Tick each one as you go - your ticks are saved on this device only.',
  },

  steps: [
    {
      id: 'laptop',
      title: 'Bring a laptop, not a tablet',
      body: "You'll be building on it all day. If your work laptop is locked down or blocks guest Wi-Fi, bring a personal one if you have one.",
    },
    {
      id: 'plan',
      title: 'Get a paid AI plan',
      body: 'Please sign up for Claude Pro or Max. ChatGPT Plus also works, but more of the demos will be in Claude. If your organisation only allows Microsoft Copilot, please tell us before the day so we can plan around it.',
    },
    {
      id: 'app',
      title: 'Install the Claude desktop app',
      body: 'Download it from [claude.ai/download]({claudeDownload}) and sign in with the account that has your paid plan.',
    },
    {
      id: 'plugin',
      title: 'Install the Oxford Agentic plugin',
      body: "We'll email you the plugin. In Claude, go to Customise, then Plugins, then Upload, and choose the file. Then type /readiness-check and follow what it says.",
      onlyWithPlugin: true,
    },
    {
      id: 'n8n',
      title: 'Doing the n8n build? Set up n8n first',
      body: '[Follow the set-up guide]({n8nGuide}) before the day, so the afternoon goes on building rather than connecting accounts.',
    },
    {
      id: 'task',
      title: 'Pick one real task',
      body: "Choose one task you do every week that you'd like to hand to an agent, and write it down in a sentence. It's what you'll build on in the afternoon. If you haven't filled in the pre-day form yet, please can you [do it here]({preDayForm}).",
    },
  ],

  gettingThere: {
    heading: 'Getting there',
    paragraphs: [
      'Please arrive between 8:45 and 9am. Doors open at 8:30am, we start at 9:15am and finish at 5pm.',
      "Come in through the Porters' Lodge on Walton Street, Oxford OX1 2HB. One of us will meet you there and walk you over to the Nash Suite.",
    ],
    routeHeading: 'Route from the Lodge to the Nash Suite',
    // PLACEHOLDER: numbered steps with a photo of each turn - photos taken Thu 26 Nov (wayfinding plan
    // step 1). Until then the page shows `routeEmpty`. Add { text, photo: { src, alt } } entries here;
    // photos show doors and signs only, never people.
    routeSteps: [],
    routeEmpty: 'Photos of the route are coming after Thursday 26 November.',
    late: {
      strong: 'Arriving after 9:10?',
      rest: "The route photos will be pinned in the WhatsApp group. If you can't find us, call the number in your Final checks email.",
    },
  },

  wifi: {
    heading: 'Wi-Fi',
    body: "The College Wi-Fi is The Cloud, and you sign up on arrival - there's no way to register in advance. If your work laptop blocks guest networks, please check with your IT team before the day, or bring a personal laptop. If the Wi-Fi drops, a phone hotspot works, and you can pair up with your neighbour.",
  },

  whatsapp: {
    heading: 'The cohort WhatsApp group',
    body: "Please [join the group]({whatsapp}) if you haven't yet. It's where we'll coordinate on the day.",
  },

  colleague: {
    heading: 'Bringing a colleague?',
    body: 'The College caters by name, so please can they register on [the Luma page]({luma}) by midday on Wednesday 2 December.',
  },

  today: {
    heading: 'Thursday 3 December',
    intro: 'Each session has its slides, prompts and files below. Use the copy button on a prompt, then paste it into Claude.',
    // PLACEHOLDER: if Worcester holds the contract times, lunch moves to 13:00-14:00 and the afternoon
    // shifts - run sheet s3, right-hand column. Confirm before merge.
    timetableNote: 'Times follow the timetable sent to the College (16 Nov).',
    sessionEmpty: 'Slides and prompts for this session are coming on Tuesday 1 December.',
  },

  // PLACEHOLDER: the leads are the proposed owners in run sheet s3 - confirm on the 27 Nov call.
  timetable: [
    { start: '08:30', kind: 'doors', title: 'Doors open', detail: 'coffee and pastries' },
    { start: '09:15', kind: 'session', session: 'welcome', title: 'Welcome and introductions', lead: 'Drummond' },
    {
      start: '09:45',
      kind: 'session',
      session: 'use-case',
      title: 'Finding your use case, then context and projects',
      lead: 'Jonathan and Nicolai',
    },
    { start: '10:45', kind: 'break', title: 'Break', detail: 'tea and coffee in the room' },
    // PLACEHOLDER: the second part's name from Nicolai - "artefacts" or "harness", one name only.
    // Until then the title reads "Skills" alone.
    { start: '11:00', kind: 'session', session: 'skills', title: 'Skills', lead: 'Nicolai' },
    { start: '12:15', kind: 'break', title: 'Lunch in the Dining Hall' },
    { start: '13:15', kind: 'session', session: 'adoption', title: 'Adoption and governance', lead: 'Emine' },
    { start: '14:15', kind: 'session', session: 'n8n', title: 'Workflows with n8n', lead: 'Emine' },
    {
      start: '15:00',
      kind: 'session',
      session: 'build',
      title: 'Build session',
      detail: 'your own task, with one of us at each table',
      lead: 'All four of us',
      leadInline: 'all four of us',
    },
    { start: '16:30', kind: 'session', title: 'What you built', lead: 'Jonathan' },
    { start: '16:40', kind: 'session', title: 'Feedback', lead: 'Drummond' },
    { start: '16:50', kind: 'session', title: 'Close and next steps', lead: 'Drummond' },
    { start: '17:00', kind: 'finish', title: 'Finish' },
  ],

  // Per session: slides, prompts, files and a fallback. All empty until the facilitators' material
  // arrives (all four by Tue 1 Dec: slides as PDF, prompts as text, files). Never invent a URL.
  // `skill` is the plugin skill for that session and shows only when `pluginStep` is on.
  sessions: [
    { id: 'welcome', title: 'Welcome and introductions', lead: 'Drummond', start: '09:15', end: '09:45', room: '', slides_url: null, prompts: [], files: [], skill: null, fallback: null },
    {
      id: 'use-case',
      title: 'Finding your use case, then context and projects',
      lead: 'Jonathan and Nicolai',
      start: '09:45',
      end: '10:45',
      room: '',
      slides_url: null,
      prompts: [],
      files: [],
      skill: null,
      fallback: 'If Google Docs is blocked on your laptop, use the Word version of the worksheet.',
    },
    { id: 'skills', title: 'Skills', lead: 'Nicolai', start: '11:00', end: '12:15', room: '', slides_url: null, prompts: [], files: [], skill: null, fallback: null },
    { id: 'adoption', title: 'Adoption and governance', lead: 'Emine', start: '13:15', end: '14:15', room: '', slides_url: null, prompts: [], files: [], skill: null, fallback: null },
    {
      id: 'n8n',
      title: 'Workflows with n8n',
      lead: 'Emine',
      start: '14:15',
      end: '15:00',
      room: '',
      slides_url: null,
      prompts: [],
      files: [],
      skill: null,
      // PLACEHOLDER: Emine's fallback - run sheet s5 says "import the JSON"; the file comes with her
      // material on Tue 1 Dec. Hidden until then.
      fallback: null,
    },
    {
      id: 'build',
      title: 'Build session',
      lead: 'All four of us',
      start: '15:00',
      end: '16:30',
      room: '',
      slides_url: null,
      prompts: [],
      files: [],
      skill: null,
      fallback: "If your work tools won't connect, use the practice data - the files are under Files.",
    },
  ],

  onTheDay: {
    heading: 'On the day',
    items: [
      "**Lunch** is in the College Dining Hall, and we'll walk over together.",
      '**Tea and coffee** are in the room.',
      "**Need to take a call?** Tell one of us and we'll find you a quiet spot.",
      "**Anything else** - ask any of us, or use I'm stuck below.",
    ],
  },

  keepGoing: {
    heading: 'After the day',
    intro: 'Slides and files from each session will be added here after the day, so this is the one link to keep.',
    feedbackHeading: 'Two minutes of feedback',
    feedbackBody:
      '[It takes under two minutes]({feedbackForm}), and only the recommendation question is required. We read every answer and use it to shape the next cohort.',
    nextHeading: "What's next",
    nextBody: '[The next Oxford Agentic Bootcamp]({nextEvent}) is on Thursday 28 January 2027, in Oxford.',
  },

  banner: {
    before: {
      strong: 'The day is Thursday 3 December.',
      rest: "Start with the {steps} set-up steps under Get ready - it's what keeps the morning for building.",
    },
    early: { strong: "Today's the day.", rest: 'Doors open at 8:30am, and we start at 9:15am.' },
    doors: { strong: 'Doors are open.', rest: 'Coffee is in the room. We start at 9:15am.' },
    after: { strong: 'Thank you for coming.', rest: 'Slides and files from each session are under Keep going.' },
    now: 'Now:',
    next: 'Next:',
    with: 'with',
    at: 'at',
  },
};

export default cohort;
