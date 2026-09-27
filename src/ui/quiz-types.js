export const QUIZ_TYPE_ORDER = ['kanji', 'romaji', 'meaning', 'kun', 'on']

export const QUIZ_TYPES = {
  kanji: { label: 'Kanji', shortLabel: 'Kanji' },
  romaji: { label: 'Rōmaji', shortLabel: 'Rōmaji' },
  meaning: { label: 'Français', shortLabel: 'FR' },
  kun: { label: 'KUN', shortLabel: 'KUN' },
  on: { label: 'ON', shortLabel: 'ON' },
}

export const DEFAULT_QUIZ_MODE = {
  source: 'kanji',
  target: 'meaning',
}

export function getQuizTargets(source) {
  if (!QUIZ_TYPES[source]) return []
  return QUIZ_TYPE_ORDER.filter(type => type !== source)
}

export function getQuizDetailTypes(source, target) {
  if (!QUIZ_TYPES[source] || !QUIZ_TYPES[target] || source === target) return []
  return QUIZ_TYPE_ORDER.filter(type => type !== source && type !== target)
}

export function createQuizRoute(source, target) {
  if (!QUIZ_TYPES[source] || !QUIZ_TYPES[target] || source === target) {
    throw new Error(`Invalid quiz mode: ${source} → ${target}`)
  }

  return `quiz-${source}-${target}`
}

export function parseQuizRoute(route) {
  if (route === 'quiz') return { ...DEFAULT_QUIZ_MODE }
  if (route === 'quiz-symbol') return { source: 'meaning', target: 'kanji' }

  const match = /^quiz-([a-z]+)-([a-z]+)$/.exec(route)
  if (!match) return null

  const [, source, target] = match

  if (!QUIZ_TYPES[source] || !QUIZ_TYPES[target] || source === target) {
    return null
  }

  return { source, target }
}

export function normalizeQuizRoute(route) {
  const mode = parseQuizRoute(route)
  return mode ? createQuizRoute(mode.source, mode.target) : null
}
