import test from 'node:test'
import assert from 'node:assert/strict'
import { createQuizSession, filterKanjiByLevels } from '../src/core/quiz.js'

const ITEMS = [
  { id: 'a', character: '一', jlpt: 'N5' },
  { id: 'b', character: '二', jlpt: 'N5' },
  { id: 'c', character: '会', jlpt: 'N4' },
]

test('filters by active JLPT levels', () => {
  assert.deepEqual(filterKanjiByLevels(ITEMS, ['N5']).map(item => item.id), ['a', 'b'])
  assert.deepEqual(filterKanjiByLevels(ITEMS, ['N5', 'N4']).map(item => item.id), ['a', 'b', 'c'])
})

test('uses every item before starting a new cycle', () => {
  const session = createQuizSession(ITEMS, { levels: ['N5'], random: () => 0 })
  const first = session.next().id
  const second = session.next().id
  assert.notEqual(first, second)
  assert.equal(session.getState().remainingInCycle, 0)
})

test('does not immediately repeat at a cycle boundary when multiple items exist', () => {
  const session = createQuizSession(ITEMS, { levels: ['N5'], random: () => 0 })
  session.next()
  const lastOfCycle = session.next().id
  const firstOfNextCycle = session.next().id
  assert.notEqual(lastOfCycle, firstOfNextCycle)
})

test('tracks question and answer phases', () => {
  const session = createQuizSession(ITEMS, { levels: ['N4'] })
  assert.equal(session.getState().phase, 'idle')
  session.next()
  assert.equal(session.getState().phase, 'question')
  session.reveal()
  assert.equal(session.getState().phase, 'answer')
})

test('changing levels resets the session', () => {
  const session = createQuizSession(ITEMS, { levels: ['N5'] })
  session.next()
  session.setLevels(['N4'])
  const state = session.getState()
  assert.equal(state.phase, 'idle')
  assert.equal(state.questionNumber, 0)
  assert.equal(state.poolSize, 1)
})
