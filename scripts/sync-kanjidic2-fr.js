import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const REVISION = '04014e06019fc9d4af76e6dbb64ec709fe863c4d'
const SOURCE_URL =
  `https://raw.githubusercontent.com/jkindrix/japanese-language-data/${REVISION}/data/core/kanji.json`
const OPENJLPT_DIR = resolve('data/upstream/openjlpt/kanji')
const OUTPUT_FILE = resolve('data/upstream/kanjidic2/fr-meanings.json')
// V1 scope.
const LEVELS = ['n5', 'n4']

const targetCharacters = new Set()

for (const level of LEVELS) {
  const entries = JSON.parse(await readFile(resolve(OPENJLPT_DIR, `${level}.json`), 'utf8'))
  entries.forEach(entry => targetCharacters.add(entry.character))
}

const response = await fetch(SOURCE_URL)
if (!response.ok) {
  throw new Error(`KANJIDIC2 French source download failed: HTTP ${response.status}`)
}

const source = await response.json()
if (!Array.isArray(source.kanji)) {
  throw new Error('KANJIDIC2 French source: expected a kanji array')
}

const meanings = {}

for (const entry of source.kanji) {
  if (!targetCharacters.has(entry.character)) continue

  const french = entry.meanings?.fr
  if (Array.isArray(french) && french.length) {
    meanings[entry.character] = french
  }
}

const output = {
  metadata: {
    source: 'KANJIDIC2 via jkindrix/japanese-language-data',
    repository: 'jkindrix/japanese-language-data',
    revision: REVISION,
    upstream: 'KANJIDIC2 / EDRDG',
    license: 'CC BY-SA 4.0',
    scope: 'KANJI KŌSHI V1: N5 and N4 only',
    sourceVersion: source.metadata?.source_version ?? null,
    upstreamDictionaryDate: source.metadata?.upstream_dict_date ?? null,
    coverageOfOpenJlptKanji: Object.keys(meanings).length,
    targetOpenJlptTotal: targetCharacters.size,
  },
  meanings,
}

await mkdir(resolve('data/upstream/kanjidic2'), { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

console.log(
  `French meanings: ${Object.keys(meanings).length}/${targetCharacters.size} kanji -> ` +
    'data/upstream/kanjidic2/fr-meanings.json',
)
