const SUPPORTED_LEVELS = new Set(['N5', 'N4'])

function normalizeLevels(levels) {
  const normalized = [...new Set(levels)]

  if (!normalized.length) {
    throw new Error('Select at least one JLPT level')
  }

  for (const level of normalized) {
    if (!SUPPORTED_LEVELS.has(level)) {
      throw new Error(`Unsupported JLPT level: ${level}`)
    }
  }

  return normalized
}

function shuffle(items, random) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  return result
}

export function filterKanjiByLevels(items, levels) {
  if (!Array.isArray(items)) throw new Error('Kanji items must be an array')

  const selected = new Set(normalizeLevels(levels))
  return items.filter(item => selected.has(item.jlpt))
}

export function createQuizSession(items, options = {}) {
  if (!Array.isArray(items)) throw new Error('Kanji items must be an array')

  const random = options.random ?? Math.random
  if (typeof random !== 'function') throw new Error('random must be a function')

  let levels = normalizeLevels(options.levels ?? ['N5'])
  let pool = []
  let bag = []
  let current = null
  let phase = 'idle'
  let questionNumber = 0

  function refillBag(previousId = current?.id ?? null) {
    bag = shuffle(pool, random)

    if (bag.length > 1 && previousId && bag.at(-1)?.id === previousId) {
      ;[bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]]
    }
  }

  function rebuildPool() {
    pool = filterKanjiByLevels(items, levels)

    if (!pool.length) {
      throw new Error(`No kanji available for levels: ${levels.join(', ')}`)
    }

    current = null
    phase = 'idle'
    questionNumber = 0
    refillBag(null)
  }

  function next() {
    const previousId = current?.id ?? null
    if (!bag.length) refillBag(previousId)

    current = bag.pop()
    phase = 'question'
    questionNumber += 1

    return current
  }

  function reveal() {
    if (!current) throw new Error('Cannot reveal before selecting a question')
    phase = 'answer'
    return current
  }

  function setLevels(nextLevels) {
    levels = normalizeLevels(nextLevels)
    rebuildPool()
    return getState()
  }

  function reset() {
    rebuildPool()
    return getState()
  }

  function getState() {
    return {
      phase,
      current,
      levels: [...levels],
      questionNumber,
      poolSize: pool.length,
      remainingInCycle: bag.length,
    }
  }

  rebuildPool()

  return {
    next,
    reveal,
    reset,
    setLevels,
    getState,
  }
}

export const QUIZ_LEVELS = Object.freeze(['N5', 'N4'])
