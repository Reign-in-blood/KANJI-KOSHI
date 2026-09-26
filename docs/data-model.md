# Data model

KANJI KŌSHI separates reference/source material, upstream datasets and application-ready generated data.

## Directories

- `data/source/`: historical/reference PDFs, XLSX and CSV files. Never silently modify these.
- `data/upstream/openjlpt/`: pinned JLPT-level and kanji-detail source.
- `data/upstream/kanjidic2/`: pinned French meaning enrichment derived from KANJIDIC2.
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

The runtime helper prefers French and falls back to English when no French KANJIDIC2 meaning is available.

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

- JLPT levels are supported generically from N5 through N1.
- Modern JLPT kanji-by-level lists are unofficial; the generated dataset records its source.
- Readings and meanings stay as arrays.
- Okurigana markers are preserved.
- Legacy page numbers are source metadata only and never drive quiz behavior.
- Source/reference content is never silently corrected.
- Runtime code reads generated data, not PDF/XLSX/legacy CSV layouts.
