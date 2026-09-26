# Data model

KANJI KŌSHI separates reference/source material, upstream datasets and application-ready generated data.

## Current scope

V1 actively supports **N5 and N4 only**.

The schema is intentionally level-agnostic so N3, N2 and N1 can be added later without redesigning the data model.

## Directories

- `data/source/`: historical/reference PDFs, XLSX and CSV files. Never silently modify these.
- `data/upstream/openjlpt/`: pinned N5/N4 JLPT-level and kanji-detail source.
- `data/upstream/kanjidic2/`: pinned French meaning enrichment for active N5/N4 kanji.
- `data/generated/`: normalized data consumed by the application.
- `src/data/`: runtime loaders only.

## Kanji

```js
{
  id: "kanji-食",
  character: "食",
  jlpt: "N5",
  strokes: 9,
  grade: 2,
  frequency: 328,
  onReadings: ["ショク", "ジキ"],
  kunReadings: ["く.う", "く.らう", "た.べる", "は.む"],
  meanings: {
    en: ["eat", "food"],
    fr: ["manger", "nourriture"]
  }
}
```

The runtime helper prefers French and falls back to English if a future entry lacks a French meaning.

## Kana

```js
{
  id: "hiragana-あ",
  type: "hiragana",
  character: "あ",
  romaji: "a",
  group: "base"
}
```

## Vocabulary

Vocabulary is not normalized yet. Existing vocabulary CSV files remain reference data until a dedicated vocabulary layer is implemented.

## Rules

- Active V1 levels: N5 and N4.
- Modern JLPT kanji-by-level lists are unofficial; the generated dataset records its source.
- Readings and meanings stay as arrays.
- Okurigana markers are preserved.
- Legacy page numbers are source metadata only and never drive quiz behavior.
- Source/reference content is never silently corrected.
- Runtime code reads generated data, not PDF/XLSX/legacy CSV layouts.
