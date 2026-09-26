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

Core tests:

```bash
npm test
```

## Current V1 scope

KANJI KŌSHI currently targets **JLPT N5 and N4 only**.

The generated kanji layer contains:

- N5: 79 kanji
- N4: 166 kanji
- Total: 245 kanji
- French meanings: 245/245

The data architecture stays extensible to N3, N2 and N1 later, but those levels are intentionally not shipped or loaded in the current V1 dataset.

Modern JLPT kanji-by-level lists are unofficial. See `docs/data-audit-n5-n4.md` for the comparison between the previous GuideDuJaponais-derived list and the current OpenJLPT candidate classification.

Validate current data:

```bash
npm run validate:data
```

Rebuild from the pinned local snapshots:

```bash
npm run build:data
```

Refresh the active N5/N4 upstream snapshots and rebuild:

```bash
npm run sync:data
```

## Structure

- `src/core/` - quiz logic, timers, local persistence
- `src/data/` - runtime data loading
- `src/ui/` - interface rendering and interactions
- `src/styles/` - application styles
- `data/source/` - historical/reference PDFs, XLSX and CSV files
- `data/upstream/` - pinned third-party machine-readable N5/N4 datasets
- `data/generated/` - normalized application-ready N5/N4 data
- `legacy/` - previous prototype kept as reference
- `public/` - static assets served as-is

The current Vite page is intentionally minimal while the V1 interface is being designed.

See `THIRD_PARTY_NOTICES.md` for dataset attribution and licensing.
