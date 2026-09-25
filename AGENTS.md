# AGENTS.md

## Project
KANJI KŌSHI is a lightweight web app for Japanese character revision.

Core use case:
- Show a kanji, hiragana, or katakana.
- Give the user a short time to recall it.
- Reveal the answer.
- Move to the next character.
- Allow filtering by JLPT level where relevant.

## Current stack
- HTML
- CSS
- Vanilla JavaScript
- CSV data files
- GitHub Pages for the online test version

Keep the project lightweight. Do not introduce a framework or backend unless there is a clear need.

## Git workflow
- Never work directly on `master`.
- `master` is the stable/reference branch.
- `dev` is the integration branch.
- Use `feature/<name>` branches for significant changes.
- Keep commits focused and readable.
- After every commit made remotely on GitHub, always give the user the exact Git commands needed to pull that commit locally.

## Development rules
- Preserve working behavior while refactoring.
- Separate UI, quiz logic, timers, settings, and data loading when practical.
- Load data once and reuse it in memory rather than refetching it for every question.
- Keep the interface responsive and usable on desktop and mobile.
- Avoid unnecessary dependencies.
- Do not modify data content silently; data corrections must be explicit.

## Naming
Displayed product name: **KANJI KŌSHI**

Technical slug/repository name: `KANJI-KOSHI`
