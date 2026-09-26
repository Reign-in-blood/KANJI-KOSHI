import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const REVISION = 'c42fd9fa3777bfc1775446f7c418d549dfd6e4cf'
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1']
const TARGET = resolve('data/upstream/openjlpt/kanji')
const BASE_URL = `https://raw.githubusercontent.com/evanclan/OpenJLPT/${REVISION}/data/json/kanji`

await mkdir(TARGET, { recursive: true })

for (const level of LEVELS) {
  const url = `${BASE_URL}/${level}.json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`OpenJLPT download failed for ${level}: HTTP ${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) throw new Error(`OpenJLPT ${level}: root is not an array`)

  for (const entry of data) {
    if (entry.level !== level.toUpperCase()) {
      throw new Error(`OpenJLPT ${level}: unexpected level on ${entry.character}`)
    }
  }

  await writeFile(resolve(TARGET, `${level}.json`), `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`Synced ${level.toUpperCase()}: ${data.length} kanji`)
}

console.log(`Pinned OpenJLPT revision: ${REVISION}`)
console.log('Run npm run build:data, then npm run validate:data.')
