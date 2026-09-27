import { getKanjiMeanings } from '../../data/loader.js'

function normalizeText(value) {
  return value.trim().toLocaleLowerCase('fr')
}

export function getVisibleMeanings(item) {
  return getKanjiMeanings(item, 'fr').filter(Boolean).slice(0, 3)
}

export function getMeaningLabel(item) {
  return getVisibleMeanings(item).join(' · ')
}

export function meaningsOverlap(candidate, subject) {
  const subjectMeanings = new Set(getKanjiMeanings(subject, 'fr').map(normalizeText))

  return getKanjiMeanings(candidate, 'fr').some(meaning =>
    subjectMeanings.has(normalizeText(meaning)),
  )
}
