# Oxford Agentic — website

The marketing site for **Oxford Agentic**, the parent brand for a family of in-person AI events in Oxford. Its one job is to drive registrations on Luma event pages.

Astro, statically generated, ~zero client JavaScript. Content lives in this repo as markdown — there is no CMS.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # builds, then checks links and JSON-LD
```

---

## The three things you will actually do

### 1. Add an event

Copy an existing file in `src/content/events/`, change the frontmatter, push. That is the whole workflow.

```yaml
title: The Oxford Agentic Bootcamp — Cohort 3
slug: oxford-agentic-bootcamp-cohort-3   # permanent; NEVER put a date in it
programme: oxford-agentic-bootcamp        # must match a file in src/content/programmes/
cohort: Cohort 3
status: upcoming                          # upcoming | soldout | past | cancelled
startDate: "2027-01-14T09:00:00+00:00"    # quoted, with a timezone offset
endDate: "2027-01-14T16:30:00+00:00"
venue:
  name: St Anne's College
  city: Oxford
  confirmed: false                        # false while the booking is provisional
lumaEventId: evt-XXXXXXXXXXXX             # omit until the Luma page exists
lumaUrl: https://luma.com/xxxxxxxx
summary: …                                # ≤160 chars — this is the meta description
capsule: …                                # 40–60 words — see "Answer capsules" below
```

**Two traps the build will catch for you:**

- **Quote your dates, and include the offset.** `"2027-01-14T09:00:00+00:00"`, not `2027-01-14T09:00:00`. Unquoted, YAML parses the date itself and assumes UTC — which silently moves a 09:00 British Summer Time event to 10:00. The build fails with an explanatory message rather than shipping the wrong time.
- **Never put a date in a slug.** Events reschedule; URLs should not. `…-cohort-3`, not `…-january-2027`. The schema rejects slugs containing years or month names.

**Finding the `lumaEventId`.** The embed needs Luma's internal id, not the short URL slug. On the event's Luma page:

```bash
curl -s https://luma.com/YOUR-SLUG | grep -o '"api_id":"evt-[A-Za-z0-9]*"' | head -1
```

Leave `lumaEventId` out until the Luma page exists. The event page then shows a "registration opens shortly" panel with email capture instead of a broken iframe, and the hero CTA changes from *Register below* to *Get notified* so the page never promises something it cannot deliver.

**When an event has run.** Change nothing. Status is derived from the end date, so the page switches itself to the past state, swaps the embed for a "this event has run" panel, and links to the next cohort of the same programme automatically. Optionally add `outcomes:` (dated, specific figures) and tag photos to it.

### 2. Turn a section on or off

`site.config.ts` → `features`:

```ts
features: {
  speakers: false,      // V1.1 — no cleared profiles yet
  testimonials: false,  // waiting on consent (see below)
  guides: false,
  newsletter: true,
  pastEvents: true,
}
```

Switching one off removes the section, its nav entry, its routes, its sitemap and `llms.txt` entries, and every internal link to it — and re-balances the alternating dark/cream rhythm so you never get two same-coloured bands touching. Individual pages can override with `hideSections:` in their frontmatter.

Verify with the acceptance test, which builds the site twice — everything on, then everything off — and link-checks both:

```bash
npm run check:flags
```

### 3. Rename the brand or a programme

**Brand:** change `BRAND_NAME` in `site.config.ts`. That one string rewrites every page title, the schema `Organization`, all OG images, the favicon monogram, `llms.txt` and the footer entity block. Then point the new domain at the host and 301 the old one.

**Programme or event display name:** edit `name` / `title` in its content file. Display names are decoupled from slugs, so nothing breaks.

**A slug:** change it, then add the old path to `redirects` in `site.config.ts`:

```ts
redirects: [{ from: '/events/old-slug/', to: '/events/new-slug/' }],
```

---

## Things that are deliberate

**Pricing is not on this site.** It lives on Luma. That keeps commercially sensitive numbers off an indexed page and means one place to change them.

**Testimonials and photos are consent-gated.** A testimonial needs `consentGiven: true`; a photo needs `consentCleared: true`. Anything else is invisible to the build — it is not merely hidden in CSS, it never reaches the HTML. Photos showing an identifiable attendee, or their name, are held back until that person has said yes.

**Answer capsules.** Every event, programme and guide opens with a 40–60 word, self-contained, plain-HTML summary. These exist to be lifted verbatim by an AI assistant answering "what is the Oxford Agentic Bootcamp?" — so front-load the facts and leave the marketing out. The build enforces the length.

**Every fact appears in the HTML, not just the Luma iframe.** Crawlers cannot read iframes. The key-facts card and the `Event` JSON-LD carry the date, time, venue and capacity independently. `npm run check:schema` fails the build if an event page has no human-readable date or city in its own markup.

**Dated specifics over adjectives.** "16 attendees, Cohort 1, 21 July 2026" earns citations; "hugely successful" does not.

---

## Layout of the repo

```
site.config.ts              Brand, feature flags, redirects, analytics, newsletter
src/content.config.ts       Content schemas — the build fails loudly on bad data
src/content/
  events/                   One file per dated event
  programmes/               One file per repeating format
  speakers/  testimonials/  guides/
  photos/                   Images + photos.json manifest
src/lib/
  site.ts                   Event resolution, nav, band rhythm, formatting, Luma URLs
  schema.ts                 JSON-LD builders
  llms.ts                   llms.txt and llms-full.txt
  og.ts  marks.ts           OG cards, favicon and logo, generated from config
src/pages/                  Routes; flagged sections use [...slug] so they can be excluded
scripts/                    check-links, check-schema, check-flags
```

**Swapping photography.** Drop files into `src/content/photos/`, give them descriptive names, and add entries to `photos.json`. Nothing in the codebase references a filename — components query the manifest by tag (`hero`, `event`, `venue`, `people`, `build`). Originals go in at any size; the build emits responsive WebP/AVIF. Alt text is required by the schema, so a photo without it fails the build. Every photo slot degrades to a type-and-colour treatment when no tagged photo exists.

---

## Checks

| Command | What it guards |
| --- | --- |
| `npm run build` | Content schemas, then internal links, then JSON-LD and per-page SEO |
| `npm run check:flags` | The all-on and all-off builds both stay coherent |
| `npx @lhci/cli autorun` | Lighthouse budgets: ≥95 performance / SEO / accessibility, 100 best practices |

CI runs all three on every push and pull request.

---

## Deploying

Static output in `dist/`. Vercel or Netlify free tier, build command `npm run build`, publish directory `dist`. Deploys on push to `main`.

**Before launch:**

1. **Buy the domain** and set `brand.domain`. Recommendation: `oxfordagentic.com` canonical, `oxfordagentic.ai` bought defensively and 301'd to it. Not yet purchased as of 22 July 2026.
2. **Set up analytics** and fill in `analytics` — `provider: 'plausible'` plus the site id. The tracking layer is already wired; nothing loads while the provider is `none`.
3. **Set the newsletter endpoint** in `newsletter.endpoint`. Empty, the form falls back to an honest mailto link rather than a control that silently does nothing.
4. **Confirm the Cohort 2 venue** and set `confirmed: true`; add `lumaEventId` once that page exists.
5. **Clear testimonials and photos** with the people in them, then flip the flags.
