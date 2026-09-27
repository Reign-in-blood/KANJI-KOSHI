import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createMultipleChoiceQuestion,
  evaluateMultipleChoice,
} from '../src/core/multiple-choice.js'

const ITEMS = [
  { id: 'a', answer: 'manger', group: 'food' },
  { id: 'b', answer: 'boire', group: 'food' },
  { id: 'c', answer: 'voir', group: 'sense' },
  { id: 'd', answer: 'aller', group: 'motion' },
  { id: 'e', answer: 'manger', group: 'duplicate' },
  { id: 'f', answer: 'venir', group: 'motion' },
]

const getAnswer = item => ({ key: item.id, label: item.answer })

test('creates four unique choices with exactly one correct answer', () => {
  const question = createMultipleChoiceQuestion(ITEMS[0], ITEMS, {
    getAnswer,
    random: () => 0,
  })

  assert.equal(question.choices.length, 4)
  assert.equal(new Set(question.choices.map(choice => choice.label)).size, 4)
  assert.equal(question.choices.filter(choice => choice.isCorrect).length, 1)
  assert.equal(question.correctKey, 'a')
})

test('skips duplicate visible labels', () => {
  const question = createMultipleChoiceQuestion(ITEMS[0], ITEMS, {
    getAnswer,
    random: () => 0,
  })

  assert.equal(question.choices.filter(choice => choice.label === 'manger').length, 1)
})

test('supports custom distractor filtering', () => {
  const question = createMultipleChoiceQuestion(ITEMS[0], ITEMS, {
    getAnswer,
    random: () => 0,
    optionCount: 3,
    isDistractorAllowed: candidate => candidate.group !== 'food',
  })

  assert.equal(question.choices.length, 3)
  assert.equal(question.choices.some(choice => choice.key === 'b'), false)
})

test('evaluates correct and wrong choices', () => {
  const question = createMultipleChoiceQuestion(ITEMS[0], ITEMS, {
    getAnswer,
    random: () => 0,
  })

  assert.deepEqual(evaluateMultipleChoice(question, 'a'), {
    selectedKey: 'a',
    correctKey: 'a',
    isCorrect: true,
  })

  const wrongKey = question.choices.find(choice => choice.key !== 'a').key
  assert.equal(evaluateMultipleChoice(question, wrongKey).isCorrect, false)
})

test('fails when the pool cannot provide enough unique answers', () => {
  assert.throws(
    () =>
      createMultipleChoiceQuestion(ITEMS[0], [ITEMS[0], ITEMS[4]], {
        getAnswer,
        random: () => 0,
      }),
    /Not enough unique distractors/,
  )
})
