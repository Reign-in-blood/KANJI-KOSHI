import { kanaToRomaji } from '../../core/romaji.js'
import { getKanjiMeanings } from '../../data/loader.js'
import { getQuizDetailTypes, QUIZ_TYPES } from '../quiz-types.js'
import { renderMultipleChoiceQuizPage } from './quiz-runner.js'
import { getMeaningLabel } from './quiz-helpers.js'

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function getTypeValues(item, type) {
  if (type === 'kanji') return item.character ? [item.character] : []
  if (type === 'meaning') return getKanjiMeanings(item, 'fr').filter(Boolean)
  if (type === 'on') return item.onReadings ?? []
  if (type === 'kun') return item.kunReadings ?? []

  if (type === 'romaji') {
    return unique(
      [...(item.onReadings ?? []), ...(item.kunReadings ?? [])]
        .map(kanaToRomaji)
        .filter(Boolean),
    )
  }

  return []
}

function getTypeLabel(item, type) {
  if (type === 'kanji') return item.character
  if (type === 'meaning') return getMeaningLabel(item)

  const values = getTypeValues(item, type)
  const limit = type === 'romaji' ? 4 : 3
  return values.slice(0, limit).join(' · ')
}

function valuesOverlap(candidate, subject, type) {
  const subjectValues = new Set(
    getTypeValues(subject, type).map(value => value.trim().toLocaleLowerCase('fr')),
  )

  return getTypeValues(candidate, type).some(value =>
    subjectValues.has(value.trim().toLocaleLowerCase('fr')),
  )
}

function getDetailValue(item, type) {
  if (type === 'kanji') return item.character || '—'

  if (type === 'meaning') {
    const meanings = getKanjiMeanings(item, 'fr').filter(Boolean)
    return meanings.length ? meanings.slice(0, 3).join(' · ') : '—'
  }

  const values = getTypeValues(item, type)
  return values.length ? values.join(' · ') : '—'
}

function getCorrectionDetails(item, source, target) {
  return getQuizDetailTypes(source, target).map(type => ({
    type,
    label: QUIZ_TYPES[type].label,
    value: getDetailValue(item, type),
  }))
}

function getSubjectClass(type) {
  if (type === 'kanji') return 'quiz-kanji'
  if (type === 'meaning') return 'quiz-meaning-subject'
  if (type === 'romaji') return 'quiz-reading-subject quiz-romaji-subject'
  return 'quiz-reading-subject'
}

function getOptionClass(type) {
  if (type === 'kanji') return 'quiz-option-symbol'
  if (type === 'romaji') return 'quiz-option-romaji'
  if (type === 'on' || type === 'kun') return 'quiz-option-reading'
  return ''
}

function getPrompt(source, target) {
  if (source === 'kanji' && target === 'meaning') return 'Que signifie ce kanji ?'
  if (source === 'meaning' && target === 'kanji') return 'Quel kanji correspond à cette signification ?'
  if (target === 'kanji') return 'Quel kanji correspond à cet élément ?'
  if (target === 'meaning') return 'Quelle signification française correspond à cet élément ?'
  if (target === 'romaji') return 'Quelle transcription en rōmaji correspond à cet élément ?'
  if (target === 'kun') return 'Quelle lecture KUN correspond à cet élément ?'
  if (target === 'on') return 'Quelle lecture ON correspond à cet élément ?'
  return 'Choisis la réponse correspondante.'
}

export function renderQuizPage(root, mode = { source: 'kanji', target: 'meaning' }) {
  const { source, target } = mode
  const sourceLabel = QUIZ_TYPES[source].label
  const targetLabel = QUIZ_TYPES[target].label

  return renderMultipleChoiceQuizPage(root, {
    eyebrow: `Quiz · ${sourceLabel} → ${targetLabel}`,
    title: `${sourceLabel} → ${targetLabel}`,
    prompt: getPrompt(source, target),
    subjectClass: getSubjectClass(source),
    optionClass: getOptionClass(target),
    getSubjectLabel: item => getTypeLabel(item, source),
    getSubjectDetails: item => getCorrectionDetails(item, source, target),
    getAnswer: item => ({
      key: item.id,
      label: getTypeLabel(item, target),
    }),
    isItemEligible: item =>
      getTypeValues(item, source).length > 0 &&
      getTypeValues(item, target).length > 0,
    isDistractorAllowed: (candidate, subject) =>
      !valuesOverlap(candidate, subject, target),
  })
}
