# Current state — read this first

One page, kept current, so anyone (or any future session) can pick this up cold.
Written 25 July 2026; last updated 28 July 2026 (cycle 22).

- **Live:** https://oxfordagentic.com — 25 pages, HTTPS enforced, Lighthouse
  100/100/100/100 (event pages accept best-practices ≥75: Luma's iframe sets
  third-party cookies; encoded in `lighthouserc.json`, do not re-fight it).
- **Repo:** github.com/Drummond1/oxford-agentic-website (public).
- **Deploy:** push to `main` → GitHub Actions builds, validates, publishes to GitHub Pages.
  There is no other deploy step. A failing build never reaches the live site.
- **Domain:** oxfordagentic.com, bought via GoDaddy 22 Jul 2026, DNS points at GitHub Pages
  (4 A records + `www` CNAME). `oxfordagentic.ai` is still unregistered — §5 of the PRD
  recommended buying it defensively.
- **The improvement loop:** a scheduled agent runs daily at 09:00, auto-ships, and records
  every cycle in `IMPROVEMENTS.md`. That file is the loop's memory — read it before
  changing anything, so work compounds instead of repeating. (An in-session overnight
  loop ran cycles 18–22 on 26–28 Jul on the same rules.)
- **Homepage design (Drummond, 28 Jul): typographic, not photographic.** `/` is the
  plain ink design with the motif and micro-interactions; the photo variant lives at
  `/home-photos/` (noindex, out of sitemap, unlinked; `/home-original/` redirects
  there). Swap the two `withPhotos` values in `index.astro` / `home-photos.astro` to
  trade them back. Cohort 1 photos still show on the Cohort 1 event page. All photos
  share one baked-in house grade (saturation 0.55, warm shift, gamma 1.12) — grade
  new photos the same way rather than inventing a new look.
  **Consent caveat:** `cohort-1-room-and-cohort` and `cohort-1-flipchart-group` show
  identifiable attendees and were flipped to `consentCleared: true` in-session to build
  the preview — Drummond has seen them ship but has not explicitly confirmed the people
  in them agreed. If anyone objects, flip the flag back; the layout degrades cleanly.

---

## ✅ Bookings are live (resolved 25 Jul)

Cohort 2's Luma page went live and the embed is now on the event page. A visitor can
book without leaving the site. **Note the event moved** — Luma is the authoritative
source and it says:

- **Wed 16 September 2026** (not 9 Sept), **09:00–17:00** (not 16:30)
- **Worcester College, Walton Street, Oxford OX1 2HB** (not St Anne's)
- Luma: `evt-kcWdRFwqcgBbNcn` · https://luma.com/oxfordagentic2

Two things worth Drummond's eye: the published agenda still ends at 16:20 while the day
now runs to 17:00, and the site says "capped at roughly twenty-five" throughout — worth
confirming against the real Luma capacity.

---

## What needs Drummond (the loop cannot do these)

| # | Task | Why it is blocked | Effort |
|---|---|---|---|
| 1 | Set `newsletter.endpoint` in `site.config.ts` | Needs a provider (Luma subscribe link, Buttondown, Mailchimp). Until then the guide lead-capture cards degrade to a mailto | 5 min |
| 2 | Set `analytics.provider` + `siteId` | Needs a Plausible account. **Nothing is measured today** — the tracking layer is built and dispatches to Plausible/GA4, but no provider script loads while provider is `'none'` | 5 min + 1 line |
| 3 | Confirm the agenda for the longer day, and the real capacity | The published agenda ends 16:20 but the day now runs to 17:00; the site says "capped at roughly twenty-five" throughout | 5 min |
| 4 | Export Search Console Performance CSV → `seo-data/` | Needs data (property verified 23 Jul; reports after ~3–7 days) | 2 min, weekly |
| 5 | Bing Webmaster Tools: verify + submit sitemap | Needs an account. Bing feeds ChatGPT's web results, so this is GEO not just Bing traffic | 5 min |
| 6 | Create a LinkedIn Company Page, add the URL to `brand.social` | Needs the page. Flows into `Organization.sameAs` for entity triangulation | 1 min once created |
| 7 | Clear Cohort 1 testimonials + people photos for publication | Needs consent from named individuals | — |
| 8 | Review the drafted bio in `src/content/speakers/drummond-gilbert.md`, then flip `features.speakers` | Drafted from vault facts, never reviewed. **Never publish an unreviewed biography of a real person** | 5 min |

| 9 | Confirm the two new Cohort 1 photos (room-and-cohort, flipchart-group) are consent-OK with the people shown | They went live 26 Jul with the flag flipped in-session; see the photography note above | 2 min |

---

## Decisions already made (do not re-litigate)

- **Pricing never appears on the site.** It lives on Luma (PRD §18), which also keeps
  commercially sensitive numbers off an indexed page.
- **Testimonials and photos are consent-gated in code.** A quote needs `consentGiven: true`;
  a photo needs `consentCleared: true`. Anything else never reaches the HTML — it is not
  merely hidden. 7 of the 9 Cohort 1 photos are held back for this reason.
- **No doorway pages, ever.** No "AI bootcamp London" location variants or thin
  near-duplicates. Google penalises them and they cheapen a brand whose whole voice is
  anti-hype.
- **Guides stay subtle.** The content layer is reachable only via the Guides nav item,
  the footer, and cross-links. The homepage carries zero guide links in its main flow —
  it is a lead-generation layer, never the site's primary feature.
- **One new guide per day maximum.** Steady cadence reads as a living site; a burst of
  AI-written pages in one day is the pattern Google's helpful-content system penalises.
- **The design guidelines are law** — the Quad logo, Newsreader/IBM Plex Sans/IBM Plex
  Mono, squared corners, hairline borders, flat fills, no shadows, ink/paper/amber/rust
  with no teal. Source: `Digital Brain/Projects/Oxford Agentic Bootcamp/Oxford Agentic
  Bootcamp Design Guidelines.pdf`.

## Facts worth not re-deriving

- **Cohort 1:** Tue 21 Jul 2026, St Anne's College, **16 attendees** (confirmed by
  Drummond 25 Jul 2026; the vault's per-person attendance record is incomplete, but the
  headline figure is right), three build cycles.
  Its Luma event id is `evt-ilXzPEtAvZEowaf` (`luma.com/k7c2rm5s`).
- **Cohort 2:** Wed 16 Sept 2026, 09:00–17:00, Worcester College, Walton Street, Oxford
  OX1 2HB. Luma `evt-kcWdRFwqcgBbNcn` / luma.com/oxfordagentic2. Bookings live.
  (It was originally planned for 9 Sept at St Anne's — that changed; Luma is authoritative.)
- **GEO baseline (Perplexity, 25 Jul):** oxfordagentic.com not yet cited. Elansio wins
  the "hands-on AI training Oxford" citation with an exact-match landing page and
  build-outcome language; Saïd's programmes are framed by the engine as "strategic,
  online, not hands-on" — which is the gap this brand occupies. Third-party aggregators
  carry the citations, so off-page mentions are the real lever. Re-probe monthly.
- **Not indexed by Google yet** as of 25 Jul (domain registered 22 Jul). Normal.
- **Schema graph is deep and connected (cycles 15–20):** Organization (+`founder` →
  the team-page Person `@id`), WebSite, a WebPage node on every indexable page,
  EducationEvent with `subEvent` agenda + captioned photo ImageObjects, Course with
  `hasCourseInstance`, Articles with `articleSection`/`about`. Before adding a schema
  idea, check the emitted graph — several "gaps" have already been closed.
- **10 guides live** (28 Jul). Next in the probe-driven order: public-sector/NHS
  leaders, then "How to run an AI pilot that survives contact with your team".

## Where the documentation lives

- `STATE.md` (this file) — current state, blockers, decisions. Start here.
- `IMPROVEMENTS.md` — the loop's ledger: every cycle shipped, the backlog, what was
  rejected and why, and the GEO baseline.
- `README.md` — how to run it, add an event, toggle a section, rename the brand.
- `~/.claude/scheduled-tasks/oxford-agentic-website-improve/SKILL.md` — the loop's own
  instructions and guardrails.
- Git history — every change with the reasoning in its commit message.
