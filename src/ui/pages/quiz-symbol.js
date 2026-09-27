import { renderMultipleChoiceQuizPage } from './quiz-runner.js'
import { getMeaningLabel, meaningsOverlap } from './quiz-helpers.js'

function getSymbolAnswer(item) {
  return {
    key: item.id,
    label: item.character,
  }
}

export function renderSymbolQuizPage(root) {
  return renderMultipleChoiceQuizPage(root, {
    eyebrow: 'Quiz · Symbole',
    title: 'Quel kanji correspond ?',
    prompt: 'Choisis le symbole correspondant à cette signification.',
    subjectClass: 'quiz-meaning-subject',
    optionClass: 'quiz-option-symbol',
    getSubjectLabel: getMeaningLabel,
    getAnswer: getSymbolAnswer,
    isDistractorAllowed: (candidate, subject) => !meaningsOverlap(candidate, subject),
  })
}
