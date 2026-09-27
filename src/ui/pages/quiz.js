import { renderMultipleChoiceQuizPage } from './quiz-runner.js'
import { getMeaningLabel, meaningsOverlap } from './quiz-helpers.js'

function getMeaningAnswer(item) {
  return {
    key: item.id,
    label: getMeaningLabel(item),
  }
}

export function renderQuizPage(root) {
  return renderMultipleChoiceQuizPage(root, {
    eyebrow: 'Quiz · Signification',
    title: 'Que signifie ce kanji ?',
    prompt: 'Choisis la signification correcte.',
    subjectClass: 'quiz-kanji',
    getSubjectLabel: item => item.character,
    getAnswer: getMeaningAnswer,
    isDistractorAllowed: (candidate, subject) => !meaningsOverlap(candidate, subject),
  })
}
