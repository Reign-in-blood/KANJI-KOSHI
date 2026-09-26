# KANJI KŌSHI

Lightweight web application for timed Japanese character revision.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Data commands

Validate all current data layers:

```bash
npm run validate:data
```

Rebuild the application-ready kanji file from the pinned local OpenJLPT snapshot:

```bash
npm run build:data
```

Refresh the OpenJLPT snapshot from the pinned upstream revision, then rebuild:

```bash
npm run sync:openjlpt
npm run build:data
npm run validate:data
```

## Structure

- `src/core/` - quiz logic, timers, local persistence
- `src/data/` - runtime data loading
- `src/ui/` - interface rendering and interactions
- `src/styles/` - application styles
- `data/source/` - historical/reference PDFs, XLSX and CSV files
- `data/upstream/` - pinned third-party datasets
- `data/generated/` - normalized application-ready data
- `legacy/` - previous prototype kept as reference
- `public/` - static assets served as-is

The current Vite page is intentionally minimal while the V1 interface is being designed.

See `THIRD_PARTY_NOTICES.md` for dataset attribution and licensing.
