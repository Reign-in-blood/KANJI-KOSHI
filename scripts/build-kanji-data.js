import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const LEVEL_FILES = ['n5', 'n4', 'n3', 'n2', 'n1']
const LEVEL_ORDER = new Map([
  ['N5', 0],
  ['N4', 1],
  ['N3', 2],
  ['N2', 3],
  ['N1', 4],
])
const OPENJLPT_REVISION = 'c42fd9fa3777bfc1775446f7c418d549dfd6e4cf'
const UPSTREAM_DIR = resolve('data/upstream/openjlpt/kanji')
const OUTPUT_FILE = resolve('data/generated/kanji.json')

function assertEntry(entry, file) {
  if (!entry || typeof entry !== 'object') throw new Error(`${file}: invalid entry`)
  if (typeof entry.character !== 'string' || !entry.character) {
    throw new Error(`${file}: entry without character`)
  }
  if (!LEVEL_ORDER.has(entry.level)) {
    throw new Error(`${file}: ${entry.character} has invalid level "${entry.level}"`)
  }
  if (!Array.isArray(entry.onyomi) || !Array.isArray(entry.kunyomi) || !Array.isArray(entry.meanings)) {
    throw new Error(`${file}: ${entry.character} has invalid readings/meanings`)
  }
}

const items = []
const counts = {}
const seen = new Map()

for (const levelFile of LEVEL_FILES) {
  const filename = `${levelFile}.json`
  const source = JSON.parse(await readFile(resolve(UPSTREAM_DIR, filename), 'utf8'))
  if (!Array.isArray(source)) throw new Error(`${filename}: root must be an array`)

  counts[levelFile.toUpperCase()] = source.length

  for (const entry of source) {
    assertEntry(entry, filename)

    if (seen.has(entry.character)) {
      throw new Error(
        `Duplicate kanji ${entry.character}: ${seen.get(entry.character)} and ${entry.level}`,
      )
    }
    seen.set(entry.character, entry.level)

    items.push({
      id: `kanji-${entry.character}`,
      character: entry.character,
      jlpt: entry.level,
      strokes: entry.strokes ?? null,
      grade: entry.grade ?? null,
      frequency: entry.freq ?? null,
      onReadings: entry.onyomi,
      kunReadings: entry.kunyomi,
      meanings: {
        en: entry.meanings,
      },
      source: {
        dataset: 'OpenJLPT',
        revision: OPENJLPT_REVISION,
      },
    })
  }
}

items.sort((a, b) => {
  const levelDifference = LEVEL_ORDER.get(a.jlpt) - LEVEL_ORDER.get(b.jlpt)
  if (levelDifference) return levelDifference

  const frequencyDifference = (a.frequency ?? Number.MAX_SAFE_INTEGER) -
    (b.frequency ?? Number.MAX_SAFE_INTEGER)
  if (frequencyDifference) return frequencyDifference

  return a.character.localeCompare(b.character, 'ja')
})

const output = {
  schemaVersion: 1,
  source: {
    dataset: 'OpenJLPT',
    repository: 'evanclan/OpenJLPT',
    revision: OPENJLPT_REVISION,
    license: 'CC BY-SA 4.0',
    jlptLevelAssignments: 'Jonathan Waller / Tanos community lists (unofficial)',
    kanjiDetails: 'KANJIDIC2 / EDRDG',
  },
  counts,
  total: items.length,
  items,
}

await mkdir(resolve('data/generated'), { recursive: true })
await writeFile(OUTPUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8')

console.log(`Generated ${items.length} kanji -> data/generated/kanji.json`)
console.log(counts)
