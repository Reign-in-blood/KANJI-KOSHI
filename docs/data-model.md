# Data model

Raw source files stay in `data/source/`. Runtime code must not depend on spreadsheet layout or legacy page groupings.

## Kanji

```js
{
  id: "kanji-食",
  type: "kanji",
  character: "食",
  jlpt: "N5",
  onReadings: ["ショク"],
  kunReadings: ["たべる"],
  meanings: ["manger", "nourriture"]
}
```

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

```js
{
  id: "vocab-...",
  type: "vocabulary",
  reading: "あいさつ",
  written: "挨拶",
  jlpt: "N4",
  meanings: ["salutation"]
}
```

## Rules

- Support JLPT levels generically from N5 through N1.
- Store readings and meanings as arrays at runtime.
- Keep source grouping/page numbers only as optional source metadata.
- Do not silently correct source content.
- Validation and normalization happen before data reaches quiz logic.
