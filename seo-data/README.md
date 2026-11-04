# Search data for the improvement loop

## Start here: `search-console-latest.md`

Written by a scheduled job, every day, from the Search Console API. It is the
first thing a cycle should read when it needs search evidence — no browser, no
sign-in, no session. `search-console-latest.json` beside it holds the full rows
for anything the summary leaves out.

Both files are **generated**. Do not edit them; the next run overwrites them.
What a number *means* is judgement and belongs in `IMPROVEMENTS.md`.

The job is `.github/workflows/search-console-export.yml`, which runs
`scripts/fetch-search-console.mjs`. It authenticates as a Google service
account, so it needs the `GSC_SERVICE_ACCOUNT_KEY` repository secret. **Without
that secret the job still succeeds and writes nothing** — a missing key is a
configuration state, not a failure, so this can never turn a build red. If the
files are not in the tree, the secret has not been set up yet; see task 4 in
`STATE.md` for the three steps, and work under rule 5 in the meantime.

Run it locally against a key on disk:

```
GSC_SERVICE_ACCOUNT_KEY_FILE=/path/to/key.json node scripts/fetch-search-console.mjs
```

### What the summary contains, and why

| Section | What it is for |
| --- | --- |
| Site totals, this window vs the previous one | Is anything moving at all |
| Pages by impressions, with a CTR delta | Rule 4's candidate list. The delta column exists because `/events/` fell from 2% to 1.3% after a title change and it took weeks to notice |
| Query mix per page | **The section that stops bad edits.** Every low-CTR page investigated so far was explained by its query mix — Google-anonymised rows, brand queries the homepage already wins, or an excluded cluster — and none of that is visible in a page total |
| Top queries site-wide | Demand shape |
| Daily totals | Spotting a stalled Google pipeline before reading a flat window as flat performance |

Windows are 28 days. Google's data lags two to three days and the summary names
the first incomplete date, so treat the last few days as provisional.

## History

There is deliberately **one** pair of files, overwritten each run, rather than a
dated file per day: git already keeps every previous version, so
`git log -p seo-data/search-console-latest.md` is the trend record and the tree
stays small.

## The other files here

- `2026-08-24-search-console-baseline.md` — the hand-written reading log and the
  reasoning attached to it. Read it before trusting any GEO claim; Perplexity
  rankings and Google rankings diverge sharply and the loop conflated them until
  24 Aug 2026.
- `geo-citations.md` — rotating generative-engine probes, newest first.

## Manual CSV exports

Still supported and no longer necessary. If you do drop a Search Console CSV in
here, `seo-data/*.csv` is git-ignored, so that data stays on your machine and
never reaches the public repo. **Only the CSVs are ignored** — the markdown and
JSON files in this folder are tracked and published, so never put anything
confidential in them.
