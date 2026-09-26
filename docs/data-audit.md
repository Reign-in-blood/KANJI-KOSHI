# Data audit

## Generated kanji source

KANJI KŌSHI uses a pinned OpenJLPT snapshot for N5-N1 level assignments and kanji data, enriched with French meanings from KANJIDIC2.

OpenJLPT revision: `c42fd9fa3777bfc1775446f7c418d549dfd6e4cf`

| JLPT | Entries |
| --- | ---: |
| N5 | 79 |
| N4 | 166 |
| N3 | 367 |
| N2 | 367 |
| N1 | 1232 |
| Total | 2211 |

OpenJLPT documents its JLPT level assignments as coming from Jonathan Waller / Tanos community lists. These assignments are not official JLPT lists.

## French meanings

French meanings are derived from KANJIDIC2 data exposed by `jkindrix/japanese-language-data`, revision `04014e06019fc9d4af76e6dbb64ec709fe863c4d`.

- French meanings available: 1992 / 2211
- Coverage: 90.09%
- Missing French meanings: 219

For entries without a French meaning, the application falls back to the English KANJIDIC2/OpenJLPT meanings.

A cross-check between the two machine-readable sources found no JLPT-level mismatches and no ON/KUN reading mismatches for the 2211 selected kanji at the pinned revisions.

## Legacy KANJI KŌSHI CSV

The previous `data/source/kanjis.csv` contains 283 unique kanji:

- N5: 103
- N4: 180

Its classification differs materially from the Waller/OpenJLPT classification.

For N5, all 79 OpenJLPT N5 kanji occur in the legacy file, but 24 additional characters were classified N5 in the legacy source.

For N4, 142 characters have the same N4 assignment in both datasets. Other characters move between N5, N4 or higher levels depending on the source.

This is expected because modern JLPT level assignments are unofficial and community lists disagree.

## Reference PDFs/XLSX

Files under `data/source/` are retained for comparison and historical traceability. They are not used directly at runtime.

The older CSV conversion removed useful okurigana markers such as `ひと.つ` -> `ひとつ`. The generated dataset preserves the machine-readable KANJIDIC2/OpenJLPT notation.
