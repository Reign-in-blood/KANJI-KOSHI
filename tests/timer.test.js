import test from 'node:test'
import assert from 'node:assert/strict'
import { createCountdownTimer } from '../src/core/timer.js'

function createClock() {
  let time = 0
  let callback = null
  return {
    now: () => time,
    schedule: next => {
      callback = next
      return 1
    },
    cancel: () => {
      callback = null
    },
    advance(ms) {
      time += ms
      const next = callback
      callback = null
      next?.()
    },
  }
}

test('counts down and completes', () => {
  const clock = createClock()
  let completed = 0
  const timer = createCountdownTimer({
    durationMs: 1000,
    tickMs: 100,
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
    onComplete: () => { completed += 1 },
  })

  timer.start()
  clock.advance(1000)

  assert.equal(timer.getState().state, 'completed')
  assert.equal(timer.getState().progress, 1)
  assert.equal(completed, 1)
})

test('pause and resume preserve elapsed time', () => {
  const clock = createClock()
  const timer = createCountdownTimer({
    durationMs: 1000,
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  })

  timer.start()
  clock.advance(300)
  timer.pause()
  assert.equal(timer.getState().elapsedMs, 300)

  clock.advance(500)
  assert.equal(timer.getState().elapsedMs, 300)

  timer.resume()
  clock.advance(700)
  assert.equal(timer.getState().state, 'completed')
})

test('stop returns timer to idle', () => {
  const clock = createClock()
  const timer = createCountdownTimer({
    durationMs: 1000,
    now: clock.now,
    schedule: clock.schedule,
    cancel: clock.cancel,
  })

  timer.start()
  clock.advance(200)
  timer.stop()

  assert.deepEqual(timer.getState(), {
    state: 'idle',
    durationMs: 1000,
    elapsedMs: 0,
    remainingMs: 1000,
    progress: 0,
  })
})
