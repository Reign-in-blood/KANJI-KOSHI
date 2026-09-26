export function createCountdownTimer(options = {}) {
  let durationMs = options.durationMs ?? 4000
  const tickMs = options.tickMs ?? 50
  const onTick = options.onTick ?? (() => {})
  const onComplete = options.onComplete ?? (() => {})
  const now = options.now ?? (() => Date.now())
  const schedule = options.schedule ?? ((callback, delay) => setTimeout(callback, delay))
  const cancel = options.cancel ?? (handle => clearTimeout(handle))

  if (!(durationMs > 0)) throw new Error('durationMs must be greater than 0')
  if (!(tickMs > 0)) throw new Error('tickMs must be greater than 0')

  let state = 'idle'
  let startedAt = 0
  let elapsedBeforeStart = 0
  let handle = null

  function snapshot() {
    const runningElapsed = state === 'running' ? now() - startedAt : 0
    const elapsedMs = Math.min(durationMs, elapsedBeforeStart + runningElapsed)
    const remainingMs = Math.max(0, durationMs - elapsedMs)
    const progress = durationMs === 0 ? 1 : Math.min(1, elapsedMs / durationMs)

    return {
      state,
      durationMs,
      elapsedMs,
      remainingMs,
      progress,
    }
  }

  function clearScheduledTick() {
    if (handle !== null) {
      cancel(handle)
      handle = null
    }
  }

  function emitTick() {
    const value = snapshot()
    onTick(value)
    return value
  }

  function step() {
    if (state !== 'running') return

    const value = emitTick()
    if (value.remainingMs <= 0) {
      state = 'completed'
      elapsedBeforeStart = durationMs
      clearScheduledTick()
      onTick(snapshot())
      onComplete(snapshot())
      return
    }

    handle = schedule(step, Math.min(tickMs, value.remainingMs))
  }

  function start(nextDurationMs = durationMs) {
    if (!(nextDurationMs > 0)) throw new Error('durationMs must be greater than 0')

    clearScheduledTick()
    durationMs = nextDurationMs
    elapsedBeforeStart = 0
    startedAt = now()
    state = 'running'
    emitTick()
    handle = schedule(step, Math.min(tickMs, durationMs))
    return snapshot()
  }

  function pause() {
    if (state !== 'running') return snapshot()

    elapsedBeforeStart = Math.min(durationMs, elapsedBeforeStart + (now() - startedAt))
    state = 'paused'
    clearScheduledTick()
    return emitTick()
  }

  function resume() {
    if (state !== 'paused') return snapshot()

    if (elapsedBeforeStart >= durationMs) {
      state = 'completed'
      return emitTick()
    }

    startedAt = now()
    state = 'running'
    emitTick()
    handle = schedule(step, Math.min(tickMs, durationMs - elapsedBeforeStart))
    return snapshot()
  }

  function stop() {
    clearScheduledTick()
    state = 'idle'
    elapsedBeforeStart = 0
    return emitTick()
  }

  function getState() {
    return snapshot()
  }

  return {
    start,
    pause,
    resume,
    stop,
    getState,
  }
}
