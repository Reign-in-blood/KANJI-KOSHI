# Data audit

## Current generated kanji source

KANJI KŌSHI currently uses a pinned OpenJLPT snapshot for the machine-readable kanji layer.

Revision: `c42fd9fa3777bfc1775446f7c418d549dfd6e4cf`

| JLPT | OpenJLPT entries |
| --- | ---: |
| N5 | 79 |
| N4 | 166 |
| N3 | 367 |
| N2 | 367 |
| N1 | 1232 |
| Total | 2211 |

OpenJLPT documents its JLPT level assignments as coming from Jonathan Waller / Tanos community lists. Kanji details are enriched from KANJIDIC2 / EDRDG. These level assignments are not official JLPT lists.

## Legacy KANJI KŌSHI CSV

The previous `data/source/kanjis.csv` contains 283 unique kanji:

- N5: 103
- N4: 180

Its classification differs materially from OpenJLPT.

For N5, all 79 OpenJLPT N5 kanji occur in the legacy file, but 24 legacy N5 kanji are classified as N4 by OpenJLPT or otherwise outside its N5 set.

For N4, 142 characters have the same N4 assignment in both datasets. The remaining characters include classification shifts between N5/N4 and higher levels.

This is expected because modern JLPT level assignments are unofficial and different community lists disagree.

## Reference PDFs/XLSX

Files under `data/source/` are retained for comparison and historical traceability. They are not used directly at runtime.

The older CSV conversion removed useful okurigana markers such as `ひと.つ` -> `ひとつ`. The generated dataset therefore preserves OpenJLPT/KANJIDIC2 reading notation instead of deriving readings from the legacy CSV.

## French meanings

The OpenJLPT kanji snapshot supplies English meanings. French meanings are intentionally not copied from the reference PDFs into the generated public dataset. A separately licensed/open French enrichment source should be added before French meanings become canonical.
