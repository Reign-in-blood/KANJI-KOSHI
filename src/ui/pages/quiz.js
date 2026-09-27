import { kanaToRomaji } from '../../core/romaji.js'
import { renderMultipleChoiceQuizPage } from './quiz-runner.js'
import { getMeaningLabel, meaningsOverlap } from './quiz-helpers.js'

function getMeaningAnswer(item) {
  return {
    key: item.id,
    label: getMeaningLabel(item),
  }
}

function formatReadings(readings = []) {
  return readings.length ? readings.join(' · ') : '—'
}

function formatRomaji(item) {
  const readings = [...(item.onReadings ?? []), ...(item.kunReadings ?? [])]
  const romanized = [...new Set(readings.map(kanaToRomaji).filter(Boolean))]

  return romanized.length ? romanized.join(' · ') : '—'
}

function getReadingDetails(item) {
  return [
    { label: 'ON', value: formatReadings(item.onReadings) },
    { label: 'KUN', value: formatReadings(item.kunReadings) },
    { label: 'Rōmaji', value: formatRomaji(item) },
  ]
}

export function renderQuizPage(root) {
  return renderMultipleChoiceQuizPage(root, {
    eyebrow: 'Quiz · Signification',
    title: 'Que signifie ce kanji ?',
    prompt: 'Choisis la signification correcte.',
    subjectClass: 'quiz-kanji',
    getSubjectLabel: item => item.character,
    getSubjectDetails: getReadingDetails,
    getAnswer: getMeaningAnswer,
    isDistractorAllowed: (candidate, subject) => !meaningsOverlap(candidate, subject),
  })
}
