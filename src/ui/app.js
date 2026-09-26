import { createQuizSession } from '../core/quiz.js'
import { createCountdownTimer } from '../core/timer.js'
import { getKanjiMeanings, loadKanji } from '../data/loader.js'

const QUESTION_DURATION_MS = 4000
const ANSWER_DURATION_MS = 3000

export async function renderApp(root) {
  root.innerHTML = `
    <main class="app-shell">
      <section class="quiz-panel" aria-live="polite">
        <header class="quiz-header">
          <h1>KANJI KŌSHI</h1>
          <p class="dev-note">Interface fonctionnelle temporaire — design final à venir.</p>
        </header>

        <fieldset class="level-selector">
          <legend>Niveaux</legend>
          <label><input type="checkbox" name="level" value="N5" checked> N5</label>
          <label><input type="checkbox" name="level" value="N4"> N4</label>
        </fieldset>

        <div class="quiz-card">
          <div class="quiz-meta">
            <span data-role="level">—</span>
            <span data-role="counter">0</span>
          </div>
          <div class="kanji-character" data-role="character">—</div>
          <div class="answer" data-role="answer" hidden>
            <p><strong>ON</strong> <span data-role="on">—</span></p>
            <p><strong>KUN</strong> <span data-role="kun">—</span></p>
            <p><strong>FR</strong> <span data-role="meaning">—</span></p>
          </div>
        </div>

        <div class="progress-track" aria-label="Progression du temps">
          <div class="progress-value" data-role="progress"></div>
        </div>
        <p class="phase-label" data-role="phase">Prêt</p>

        <div class="quiz-actions">
          <button type="button" data-action="toggle">Démarrer</button>
          <button type="button" data-action="reveal" disabled>Afficher la réponse</button>
          <button type="button" data-action="next" disabled>Suivant</button>
        </div>
      </section>
    </main>
  `

  const character = root.querySelector('[data-role="character"]')
  const level = root.querySelector('[data-role="level"]')
  const counter = root.querySelector('[data-role="counter"]')
  const answer = root.querySelector('[data-role="answer"]')
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
      ? timerState === 'paused' ? 'Reprendre' : 'Pause'
      : 'Démarrer'

    revealButton.disabled = !session?.getState().current
    nextButton.disabled = !session?.getState().current
  }

  function renderCurrent() {
    const state = session.getState()
    const item = state.current

    counter.textContent = item ? `Question ${state.questionNumber}` : '0'
    level.textContent = item?.jlpt ?? '—'
    character.textContent = item?.character ?? '—'

    if (!item) {
      answer.hidden = true
      onReading.textContent = '—'
      kunReading.textContent = '—'
      meaning.textContent = '—'
      phaseLabel.textContent = 'Prêt'
      setProgress(0)
      updateButtons()
      return
    }

    onReading.textContent = item.onReadings.length ? item.onReadings.join(' · ') : '—'
    kunReading.textContent = item.kunReadings.length ? item.kunReadings.join(' · ') : '—'
    meaning.textContent = getKanjiMeanings(item, 'fr').join(', ') || '—'
    answer.hidden = state.phase !== 'answer'
    phaseLabel.textContent = state.phase === 'answer' ? 'Réponse' : 'Réflexion'
    updateButtons()
  }

  function restartPhaseTimer(durationMs) {
    if (!running) return

    const keepPaused = timer.getState().state === 'paused'
    timer.start(durationMs)
    if (keepPaused) timer.pause()
  }

  function startQuestion() {
    session.next()
    renderCurrent()
    restartPhaseTimer(QUESTION_DURATION_MS)
  }

  function revealCurrent() {
    if (!session.getState().current || session.getState().phase === 'answer') return

    session.reveal()
    renderCurrent()
    restartPhaseTimer(ANSWER_DURATION_MS)
  }

  const timer = createCountdownTimer({
    durationMs: QUESTION_DURATION_MS,
    onTick: state => setProgress(state.progress),
    onComplete: () => {
      if (!running) return
      if (session.getState().phase === 'question') revealCurrent()
      else startQuestion()
    },
  })

  try {
    const items = await loadKanji()
    session = createQuizSession(items, { levels: selectedLevels() })
    renderCurrent()
  } catch (error) {
    console.error(error)
    phaseLabel.textContent = 'Erreur de chargement des données.'
    toggleButton.disabled = true
    return
  }

  toggleButton.addEventListener('click', () => {
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
}
