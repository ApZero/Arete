# Arete — Quote Visor

A minimalist, installable PWA that reads Stoic quotes from an Excel file in the repo.

## Files

- `index.html` — the whole app (vanilla JS, no build step)
- `quotes.xlsx` — your quote database, **edit this manually and commit**
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` — PWA install support

## Editing quotes.xlsx

The app reads **every sheet** in the workbook and merges them, so you can organize
quotes into as many sheets as you like (by batch, by author, by theme — doesn't matter,
the app doesn't care about sheet names). Each sheet needs these columns, exact header
names, first row:

| column | required | notes |
|---|---|---|
| `author` | yes | e.g. `Marcus Aurelius` |
| `book` | yes | e.g. `Meditations` |
| `reference` | no | chapter/number, e.g. `Book II, 1` |
| `quote` | yes | the quote text (English) |
| `date_added` | yes, for "latest batch" to work | use `YYYY-MM-DD`, same date for a whole batch |
| `tags` | no | comma-separated, e.g. `control, mind, strength` |
| `quote_es` | no | Spanish translation of the quote |
| `book_es` | no | Spanish translation of the book title |
| `tags_es` | no | comma-separated Spanish tags |

**How "latest batch" works:** the app finds the single most recent `date_added` value
across all rows and treats every row with that exact date as "the last batch." So when
you add new quotes, give them all the same (new) date so they group together.

**Multi-language:** author names aren't translated. If `quote_es` / `book_es` / `tags_es`
are blank, the app falls back to English automatically for that row — so you can
translate quotes gradually, no need to do it all at once.

## Important: the app does NOT write back to the Excel file

This is a static site. Any filtering/browsing happens client-side. If you want to add or
edit quotes, edit `quotes.xlsx` locally (Excel, Numbers, Google Sheets export, etc.) and
push the commit — same workflow as your other Excel-sourced apps. The deployed app will
pick up the new file automatically (the service worker fetches `quotes.xlsx`
network-first, so it stays current when online, and falls back to the last cached copy
offline).

## Deploying

1. Push this folder to a GitHub repo.
2. Enable GitHub Pages (Settings → Pages → deploy from branch, root).
3. Visit the Pages URL on your phone, "Add to Home Screen."

## Updating the service worker

If you change `index.html`, `manifest.json`, or the icons, bump `CACHE_VERSION` in
`sw.js` (e.g. `stoa-v1` → `stoa-v2`) so installed devices pick up the change. You don't
need to bump it for `quotes.xlsx` changes — that file is always fetched fresh when
online.

## App behavior notes

- **Next (random)** — picks any quote at random from the current filter.
- **Similar** — picks a random quote sharing the most tags with the one on screen.
- **Dropdown (top right)**:
  - toggle to hide author/book/reference/tags in the card (for quiet, unattributed reading)
  - toggle English/Spanish
  - tag filter — select multiple tags; the app first shows quotes matching *all*
    selected tags, and only falls back to partial matches if nothing matches fully
  - "New quotes (latest batch)" — jumps to quotes from the most recent `date_added`
