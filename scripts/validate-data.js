import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const SOURCE = resolve('data/source')
const GENERATED = resolve('data/generated/kanji.json')
const JLPT_LEVELS = new Set(['N5', 'N4', 'N3', 'N2', 'N1'])

function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"'
        i += 1
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''))
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''))
    rows.push(row)
  }

  return rows
}

function countBy(rows, index) {
  return rows.reduce((result, row) => {
    const key = row[index] || '(empty)'
    result[key] = (result[key] || 0) + 1
    return result
  }, {})
}

function validateColumns(name, rows, expected, errors) {
  rows.forEach((row, index) => {
    if (row.length !== expected) {
      errors.push(`${name}: line ${index + 1} has ${row.length} columns; expected ${expected}`)
    }
  })
}

function validateJlpt(name, rows, index, errors) {
  rows.forEach((row, line) => {
    if (!JLPT_LEVELS.has(row[index])) {
      errors.push(`${name}: line ${line + 1} has invalid JLPT level "${row[index]}"`)
    }
  })
}

function duplicateKeys(rows, keyFn) {
  const seen = new Map()
  rows.forEach((row, index) => {
    const key = keyFn(row)
    if (!key) return
    if (!seen.has(key)) seen.set(key, [])
    seen.get(key).push(index + 1)
  })
  return [...seen.entries()].filter(([, lines]) => lines.length > 1)
}

const [kanjiText, hiraganaText, vocabText, generatedText] = await Promise.all([
  readFile(resolve(SOURCE, 'kanjis.csv'), 'utf8'),
  readFile(resolve(SOURCE, 'hiragana.csv'), 'utf8'),
  readFile(resolve(SOURCE, 'vocabulairen4.csv'), 'utf8'),
  readFile(GENERATED, 'utf8'),
])

const kanji = parseCsv(kanjiText)
const hiragana = parseCsv(hiraganaText)
const vocabulary = parseCsv(vocabText)
const generated = JSON.parse(generatedText)

const errors = []
const warnings = []

validateColumns('kanjis.csv', kanji, 6, errors)
validateColumns('hiragana.csv', hiragana, 3, errors)
validateColumns('vocabulairen4.csv', vocabulary, 5, errors)
validateJlpt('kanjis.csv', kanji, 1, errors)
validateJlpt('vocabulairen4.csv', vocabulary, 1, errors)

for (const [key, lines] of duplicateKeys(kanji, row => row[2])) {
  errors.push(`kanjis.csv: duplicate character ${key} on lines ${lines.join(', ')}`)
}

for (const [key, lines] of duplicateKeys(hiragana, row => row[1])) {
  errors.push(`hiragana.csv: duplicate kana ${key} on lines ${lines.join(', ')}`)
}

for (const [key, lines] of duplicateKeys(vocabulary, row => `${row[2]}|${row[3]}`)) {
  warnings.push(`vocabulairen4.csv: repeated reading/written form "${key}" on lines ${lines.join(', ')}`)
}

const lastVocabularyPage = Number(vocabulary.at(-1)?.[0])
const rowsOnLastPage = vocabulary.filter(row => Number(row[0]) === lastVocabularyPage).length
if (Number.isFinite(lastVocabularyPage) && rowsOnLastPage < 5) {
  warnings.push(
    `vocabulairen4.csv: last source page (${lastVocabularyPage}) has only ${rowsOnLastPage} row(s); source may be incomplete`,
  )
}

let frenchCoverage = 0

if (!Array.isArray(generated.items)) {
  errors.push('data/generated/kanji.json: items must be an array')
} else {
  const seenCharacters = new Set()
  const generatedCounts = {}

  for (const entry of generated.items) {
    if (!entry.character || typeof entry.character !== 'string') {
      errors.push('data/generated/kanji.json: entry without a character')
      continue
    }
    if (!JLPT_LEVELS.has(entry.jlpt)) {
      errors.push(`data/generated/kanji.json: ${entry.character} has invalid JLPT level ${entry.jlpt}`)
    }
    if (seenCharacters.has(entry.character)) {
      errors.push(`data/generated/kanji.json: duplicate character ${entry.character}`)
    }
    seenCharacters.add(entry.character)

    if (!Array.isArray(entry.onReadings) || !Array.isArray(entry.kunReadings)) {
      errors.push(`data/generated/kanji.json: ${entry.character} has invalid readings`)
    }
    if (!Array.isArray(entry.meanings?.en) || entry.meanings.en.length === 0) {
      errors.push(`data/generated/kanji.json: ${entry.character} has no English meaning`)
    }
    if (!Array.isArray(entry.meanings?.fr)) {
      errors.push(`data/generated/kanji.json: ${entry.character} has invalid French meanings`)
    } else if (entry.meanings.fr.length) {
      frenchCoverage += 1
    }

    generatedCounts[entry.jlpt] = (generatedCounts[entry.jlpt] || 0) + 1
  }

  if (generated.total !== generated.items.length) {
    errors.push(
      `data/generated/kanji.json: total=${generated.total}, actual=${generated.items.length}`,
    )
  }

  for (const level of JLPT_LEVELS) {
    if ((generated.counts?.[level] ?? 0) !== (generatedCounts[level] ?? 0)) {
      errors.push(`data/generated/kanji.json: count mismatch for ${level}`)
    }
  }
}

console.log('KANJI KŌSHI data validation')
console.log('--------------------------')
console.log(`Legacy kanji CSV: ${kanji.length} rows | ${JSON.stringify(countBy(kanji, 1))}`)
console.log(`Hiragana CSV:     ${hiragana.length} rows | ${JSON.stringify(countBy(hiragana, 0))}`)
console.log(`Vocabulary CSV:   ${vocabulary.length} rows | ${JSON.stringify(countBy(vocabulary, 1))}`)
console.log(
  `Generated kanji:  ${generated.items?.length ?? 0} rows | ${JSON.stringify(generated.counts ?? {})}`,
)
console.log(`French meanings:  ${frenchCoverage}/${generated.items?.length ?? 0}`)
console.log('PDF/XLSX files in data/source are reference material and are not modified by validation.')

if (warnings.length) {
  console.log('\nWarnings:')
  warnings.forEach(message => console.log(`- ${message}`))
}

if (errors.length) {
  console.error('\nErrors:')
  errors.forEach(message => console.error(`- ${message}`))
  process.exitCode = 1
} else {
  console.log('\nStructural validation passed.')
}
