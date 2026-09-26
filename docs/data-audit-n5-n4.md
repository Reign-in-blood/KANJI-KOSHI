# N5/N4 source audit

## Scope

KANJI KŌSHI V1 currently focuses on N5 and N4 only.

Two classifications are available:

1. The legacy `data/source/kanjis.csv`, derived from GuideDuJaponais reference material.
2. The pinned OpenJLPT dataset, whose modern JLPT assignments come from Jonathan Waller / Tanos community lists.

The JLPT does not publish a current official kanji-by-level list, so disagreements between community datasets are expected.

## Counts

| Source | N5 | N4 | Total |
|---|---:|---:|---:|
| Legacy GuideDuJaponais-derived CSV | 103 | 180 | 283 |
| OpenJLPT candidate | 79 | 166 | 245 |

Shared characters: **243**

## Present only in the legacy N5/N4 list

40 characters:

`乗 低 便 働 光 分 区 合 回 声 太 好 寒 市 引 弱 所 暑 暗 村 林 森 民 池 洗 産 県 短 耳 菜 薬 説 軽 進 遠 都 門 頭 顔 首`

These characters are not deleted from the historical source. They simply are not classified as N5/N4 by the pinned OpenJLPT snapshot.

## Present only in OpenJLPT N5/N4

2 characters:

`公 死`

## Same character, different N5/N4 level

22 characters are N5 in the legacy list but N4 in OpenJLPT:

`会 口 古 多 安 少 店 手 新 目 社 空 立 花 言 買 足 週 道 飲 駅 魚`

## Current implementation decision

- Keep all historical PDF/XLSX/CSV files untouched.
- Store only OpenJLPT N5/N4 machine-readable snapshots under `data/upstream/`.
- Build a 245-entry candidate runtime dataset under `data/generated/kanji.json`.
- Preserve source metadata and attribution.
- Do not treat the OpenJLPT level assignment as official JLPT truth.
- Revisit disputed classification only if the product needs a different pedagogical list.

This separation allows the quiz engine to be developed now without destroying or rewriting the original reference material.
