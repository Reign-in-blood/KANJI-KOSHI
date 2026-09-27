import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createQuizRoute,
  getQuizTargets,
  normalizeQuizRoute,
  parseQuizRoute,
  QUIZ_TYPE_ORDER,
} from '../src/ui/quiz-types.js'

test('every quiz source exposes exactly four different targets', () => {
  for (const source of QUIZ_TYPE_ORDER) {
    const targets = getQuizTargets(source)
    assert.equal(targets.length, 4)
    assert.equal(targets.includes(source), false)
  }
})

test('the five quiz types produce twenty directed modes', () => {
  const routes = QUIZ_TYPE_ORDER.flatMap(source =>
    getQuizTargets(source).map(target => createQuizRoute(source, target)),
  )

  assert.equal(routes.length, 20)
  assert.equal(new Set(routes).size, 20)
})

test('legacy quiz routes normalize to the new source-target routes', () => {
  assert.deepEqual(parseQuizRoute('quiz'), { source: 'kanji', target: 'meaning' })
  assert.deepEqual(parseQuizRoute('quiz-symbol'), { source: 'meaning', target: 'kanji' })
  assert.equal(normalizeQuizRoute('quiz'), 'quiz-kanji-meaning')
  assert.equal(normalizeQuizRoute('quiz-symbol'), 'quiz-meaning-kanji')
})

test('same-source-and-target routes are rejected', () => {
  assert.equal(parseQuizRoute('quiz-kanji-kanji'), null)
  assert.throws(() => createQuizRoute('kanji', 'kanji'))
})
