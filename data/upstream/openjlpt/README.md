# OpenJLPT snapshot

This directory contains a pinned snapshot of the kanji JSON files from OpenJLPT.

- Repository: evanclan/OpenJLPT
- Revision: `c42fd9fa3777bfc1775446f7c418d549dfd6e4cf`
- License: CC BY-SA 4.0
- Levels: N5 through N1
- Snapshot counts: N5 79, N4 166, N3 367, N2 367, N1 1232 (2211 total)

OpenJLPT states that JLPT level assignments are based on Jonathan Waller's Tanos community lists and that kanji details are enriched from KANJIDIC2 / EDRDG. The JLPT organization does not publish official modern kanji-by-level lists.

See `NOTICE.md` and `LICENSE` in this directory for upstream attribution and license terms.

Do not edit the snapshot files by hand. Update them with `npm run sync:openjlpt`, then rebuild generated data.
