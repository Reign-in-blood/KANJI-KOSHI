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

## Kanji data

The generated kanji layer currently contains 2211 entries across N5-N1:

- N5: 79
- N4: 166
- N3: 367
- N2: 367
- N1: 1232

French meanings are available for 1992 entries (90.09%). Missing French meanings fall back to English.

Validate current data:

```bash
npm run validate:data
```

Rebuild from the pinned local snapshots:

```bash
npm run build:data
```

Refresh all pinned upstream data and rebuild:

```bash
npm run sync:data
```

## Structure

- `src/core/` - quiz logic, timers, local persistence
- `src/data/` - runtime data loading
- `src/ui/` - interface rendering and interactions
- `src/styles/` - application styles
- `data/source/` - historical/reference PDFs, XLSX and CSV files
- `data/upstream/` - pinned third-party machine-readable datasets
- `data/generated/` - normalized application-ready data
- `legacy/` - previous prototype kept as reference
- `public/` - static assets served as-is

The current Vite page is intentionally minimal while the V1 interface is being designed.

See `THIRD_PARTY_NOTICES.md` for dataset attribution and licensing.
