# AGENTS.md

## Project
KANJI KŌSHI is a lightweight web app for timed Japanese character revision: kanji, hiragana and katakana, with JLPT filtering where relevant.

## Stack
- Vite
- HTML
- CSS
- Vanilla JavaScript
- Local learning data
- GitHub Pages for online testing

Do not introduce a framework or backend without a clear need.

## Structure
- `src/core/`: quiz logic, timers, persistence
- `src/data/`: runtime data loading/normalization
- `src/ui/`: interface
- `src/styles/`: styles
- `data/source/`: raw/source learning data
- `legacy/`: old prototype, kept as reference

## Git workflow
- Never work directly on `master`.
- `master` is stable/reference.
- `dev` is the integration branch.
- Use `feature/<name>` for significant changes.
- Keep commits focused and readable.
- After every remote GitHub commit, give the user the exact Git commands needed to pull it locally.

## Development rules
- Preserve working behavior while refactoring.
- Keep UI, quiz logic, timers, settings and data loading separated.
- Load learning data once and reuse it in memory.
- Design for desktop and mobile from the start.
- Avoid unnecessary dependencies.
- Never alter learning-data content silently; corrections must be explicit.

## Naming
Displayed name: **KANJI KŌSHI**

Technical repository/slug: `KANJI-KOSHI`
