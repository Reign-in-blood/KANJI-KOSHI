import { createQuizSession } from '../../core/quiz.js'
import { createCountdownTimer } from '../../core/timer.js'
import { getKanjiMeanings, loadKanji } from '../../data/loader.js'

const QUESTION_DURATION_MS = 4000
const ANSWER_DURATION_MS = 3000

export function renderRevisionPage(root) {
  let disposed = false

  root.innerHTML = `
    <section class="revision-page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">Révision chronométrée</p>
          <h1>Révision des kanji</h1>
        </div>
        <p>4 secondes de réflexion · 3 secondes pour la réponse</p>
      </header>

      <div class="revision-toolbar">
        <span class="toolbar-label">Niveau</span>
        <div class="level-chips" aria-label="Niveaux JLPT">
          <label class="level-chip">
            <input type="checkbox" name="level" value="N5" checked>
            <span>N5</span>
          </label>
          <label class="level-chip">
            <input type="checkbox" name="level" value="N4">
            <span>N4</span>
          </label>
        </div>
      </div>

      <section class="revision-stage" aria-live="polite">
        <div class="revision-meta">
          <span class="level-badge" data-role="level">N5</span>
          <span class="question-counter" data-role="counter">0 / 79</span>
        </div>

        <div class="kanji-character" data-role="character">準</div>

        <div class="answer-panel" data-role="answer" hidden>
          <div class="answer-row">
            <span>ON</span>
            <strong data-role="on">—</strong>
          </div>
          <div class="answer-row">
            <span>KUN</span>
            <strong data-role="kun">—</strong>
          </div>
          <div class="answer-row">
            <span>FR</span>
            <strong data-role="meaning">—</strong>
          </div>
        </div>

        <div class="revision-placeholder" data-role="placeholder">
          <span>Prêt à commencer</span>
          <small>Le premier kanji apparaîtra au lancement.</small>
        </div>
      </section>

      <div class="timer-area">
        <div class="progress-track" aria-label="Progression du temps">
          <div class="progress-value" data-role="progress"></div>
        </div>
        <p class="phase-label" data-role="phase">Prêt</p>
      </div>

      <div class="revision-actions">
        <button class="button button-primary" type="button" data-action="toggle">Démarrer</button>
        <button class="button button-secondary" type="button" data-action="reveal" disabled>
          Révéler
        </button>
        <button class="button button-secondary" type="button" data-action="next" disabled>
          Suivant
        </button>
      </div>
    </section>
  `

  const character = root.querySelector('[data-role="character"]')
  const level = root.querySelector('[data-role="level"]')
  const counter = root.querySelector('[data-role="counter"]')
  const answer = root.querySelector('[data-role="answer"]')
  const placeholder = root.querySelector('[data-role="placeholder"]')
  const onReading = root.querySelector('[data-role="on"]')
  const kunReading = root.querySelector('[data-role="kun"]')
  const meaning = root.querySelector('[data-role="meaning"]')
  const progress = root.querySelector('[data-role="progress"]')
  const phaseLabel = root.querySelector('[data-role="phase"]')
  const toggleButton = root.querySelector('[data-action="toggle"]')
  const revealButton = root.querySelector('[data-action="reveal"]')
  const nextButton = root.querySelector('[data-action="next"]')
  const levelInputs = [...root.querySelectorAll('input[name="level"]')]

  let session
  let running = false

  function setProgress(value) {
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, value))})`
  }

  function selectedLevels() {
    return levelInputs.filter(input => input.checked).map(input => input.value)
  }

  function updateButtons() {
    const timerState = timer.getState().state

    toggleButton.textContent = running
      ? timerState === 'paused'
        ? 'Reprendre'
        : 'Pause'
      : session?.getState().current
        ? 'Reprendre'
        : 'Démarrer'

    revealButton.disabled = !session?.getState().current
    nextButton.disabled = !session?.getState().current
  }

  function renderCurrent() {
    const state = session.getState()
    const item = state.current

    counter.textContent = `${state.questionNumber} / ${state.poolSize}`
    level.textContent = item?.jlpt ?? state.levels.join(' + ')

    if (!item) {
      character.textContent = '準'
      answer.hidden = true
      placeholder.hidden = false
      phaseLabel.textContent = 'Prêt'
      setProgress(0)
      updateButtons()
      return
    }

    placeholder.hidden = true
    character.textContent = item.character
    onReading.textContent = item.onReadings.length ? item.onReadings.join(' · ') : '—'
    kunReading.textContent = item.kunReadings.length ? item.kunReadings.join(' · ') : '—'
    meaning.textContent = getKanjiMeanings(item, 'fr').join(', ') || '—'
    answer.hidden = state.phase !== 'answer'
    phaseLabel.textContent = state.phase === 'answer' ? 'Réponse' : 'Réflexion'
    updateButtons()
  }

  function restartPhaseTimer(durationMs) {
    if (!running || disposed) return

    const keepPaused = timer.getState().state === 'paused'
    timer.start(durationMs)
    if (keepPaused) timer.pause()
  }

  function startQuestion() {
    if (!session || disposed) return
    session.next()
    renderCurrent()
    restartPhaseTimer(QUESTION_DURATION_MS)
  }

  function revealCurrent() {
    if (!session || disposed) return
    if (!session.getState().current || session.getState().phase === 'answer') return

    session.reveal()
    renderCurrent()
    restartPhaseTimer(ANSWER_DURATION_MS)
  }

  const timer = createCountdownTimer({
    durationMs: QUESTION_DURATION_MS,
    onTick: state => {
      if (!disposed) setProgress(state.progress)
    },
    onComplete: () => {
      if (!running || disposed) return
      if (session.getState().phase === 'question') revealCurrent()
      else startQuestion()
    },
  })

  loadKanji()
    .then(items => {
      if (disposed) return
      session = createQuizSession(items, { levels: selectedLevels() })
      renderCurrent()
    })
    .catch(error => {
      if (disposed) return
      console.error(error)
      phaseLabel.textContent = 'Erreur de chargement des données.'
      toggleButton.disabled = true
    })

  toggleButton.addEventListener('click', () => {
    if (!session || disposed) return

    if (!session.getState().current) {
      running = true
      startQuestion()
      updateButtons()
      return
    }

    const timerState = timer.getState().state

    if (!running) {
      running = true
      restartPhaseTimer(
        session.getState().phase === 'answer' ? ANSWER_DURATION_MS : QUESTION_DURATION_MS,
      )
    } else if (timerState === 'paused') {
      timer.resume()
    } else {
      timer.pause()
    }

    updateButtons()
  })

  revealButton.addEventListener('click', revealCurrent)
  nextButton.addEventListener('click', startQuestion)

  levelInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (!session || disposed) return

      const levels = selectedLevels()

      if (!levels.length) {
        input.checked = true
        return
      }

      timer.stop()
      running = false
      session.setLevels(levels)
      renderCurrent()
    })
  })

  return () => {
    disposed = true
    timer.stop()
  }
}
