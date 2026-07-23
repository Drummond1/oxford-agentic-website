# Drop Search Console exports here

The improvement loop reads any `.csv` in this folder as its search signal.

**How to export (2 minutes, weekly-ish):**
1. Search Console → **Performance** → set the date range to the last 28 days.
2. Click **Export** (top right) → **Download CSV**.
3. Unzip and drop the files in here. `Queries.csv` is the one that matters;
   `Pages.csv` is useful too. Keep the filenames as Google gives them.

The loop looks for queries with impressions but a poor average position or CTR,
and turns the biggest gaps into content or title/meta work.

This folder is git-ignored — the data stays on your machine and never reaches
the public repo.
