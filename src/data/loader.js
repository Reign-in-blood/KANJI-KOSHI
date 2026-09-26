const JLPT_LEVELS = new Set(['N5', 'N4', 'N3', 'N2', 'N1'])
const KANJI_DATA_URL = new URL('../../data/generated/kanji.json', import.meta.url)

let kanjiDataPromise

async function fetchKanjiPayload() {
  const response = await fetch(KANJI_DATA_URL)

  if (!response.ok) {
    throw new Error(`Unable to load kanji data (HTTP ${response.status})`)
  }

  const payload = await response.json()

  if (!Array.isArray(payload.items)) {
    throw new Error('Invalid kanji data: items must be an array')
  }

  return payload
}

export function loadKanjiPayload() {
  if (!kanjiDataPromise) {
    kanjiDataPromise = fetchKanjiPayload().catch(error => {
      kanjiDataPromise = undefined
      throw error
    })
  }

  return kanjiDataPromise
}

export async function loadKanji() {
  const payload = await loadKanjiPayload()
  return payload.items
}

export async function getKanjiByLevels(levels = ['N5']) {
  const selected = new Set(levels)

  for (const level of selected) {
    if (!JLPT_LEVELS.has(level)) {
      throw new Error(`Unknown JLPT level: ${level}`)
    }
  }

  const kanji = await loadKanji()
  return kanji.filter(entry => selected.has(entry.jlpt))
}

export function clearKanjiCache() {
  kanjiDataPromise = undefined
}
