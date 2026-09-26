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

## Structure

- `src/core/` — quiz logic, timers, local persistence
- `src/data/` — runtime data loading and normalization
- `src/ui/` — interface rendering and interactions
- `src/styles/` — application styles
- `data/source/` — raw/source learning data
- `legacy/` — previous prototype kept as reference
- `public/` — static assets served as-is

The current Vite page is intentionally minimal while the V1 interface is being designed.
