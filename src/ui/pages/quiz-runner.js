import { createMultipleChoiceQuestion, evaluateMultipleChoice } from '../../core/multiple-choice.js'
import { createQuizSession, filterKanjiByLevels } from '../../core/quiz.js'
import { createCountdownTimer } from '../../core/timer.js'
import { loadKanji } from '../../data/loader.js'

const QUESTION_DURATION_MS = 20000
const REVIEW_DURATION_MS = 3000

export function renderMultipleChoiceQuizPage(root, config) {
  const {
    eyebrow,
    title,
    prompt,
    getSubjectLabel,
    getAnswer,
    isDistractorAllowed,
    isItemEligible = () => true,
    getSubjectDetails = null,
    subjectClass = 'quiz-kanji',
    optionClass = '',
  } = config

  let disposed = false
  let items = []
  let session
  let currentQuestion
  let answered = false
  let score = 0
  let attempts = 0

  root.innerHTML = `
    <section class="quiz-page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h1>${title}</h1>
        </div>
      </header>

      <div class="revision-toolbar quiz-toolbar">
        <span class="toolbar-label">Niveau</span>
        <div class="level-chips" aria-label="Niveaux JLPT">
          <label class="level-chip">
            <input type="checkbox" name="quiz-level" value="N5" checked>
            <span>N5</span>
          </label>
          <label class="level-chip">
            <input type="checkbox" name="quiz-level" value="N4">
            <span>N4</span>
          </label>
        </div>
      </div>

      <section class="quiz-stage" aria-live="polite">
        <div class="quiz-statusbar">
          <span class="level-badge" data-role="level">N5</span>
          <strong data-role="score">Score 0 / 0</strong>
        </div>

        <div class="quiz-subject-layout" data-role="subject-layout">
          <aside class="quiz-reading-panel" data-role="subject-details" hidden></aside>
          <div class="quiz-subject ${subjectClass}" data-role="subject">準</div>
          <div class="quiz-subject-balance" aria-hidden="true"></div>
        </div>

        <p class="quiz-prompt">${prompt}</p>

        <div class="quiz-options" data-role="options"></div>

        <div class="quiz-timer">
          <div class="progress-track" aria-label="Temps restant">
            <div class="progress-value" data-role="progress"></div>
          </div>
          <div class="quiz-timer-meta">
            <span data-role="timer-label">Temps restant</span>
            <strong data-role="timer-seconds">20 s</strong>
          </div>
        </div>
      </section>
    </section>
  `

  const subjectElement = root.querySelector('[data-role="subject"]')
  const subjectLayout = root.querySelector('[data-role="subject-layout"]')
  const subjectDetails = root.querySelector('[data-role="subject-details"]')
  const level = root.querySelector('[data-role="level"]')
  const scoreLabel = root.querySelector('[data-role="score"]')
  const optionsRoot = root.querySelector('[data-role="options"]')
  const progress = root.querySelector('[data-role="progress"]')
  const timerLabel = root.querySelector('[data-role="timer-label"]')
  const timerSeconds = root.querySelector('[data-role="timer-seconds"]')
  const levelInputs = [...root.querySelectorAll('input[name="quiz-level"]')]

  function selectedLevels() {
    return levelInputs.filter(input => input.checked).map(input => input.value)
  }

  function setProgress(value) {
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, value))})`
  }

  function updateScore() {
    scoreLabel.textContent = `Score ${score} / ${attempts}`
  }

  function renderTimer(state, label) {
    setProgress(state.progress)
    timerLabel.textContent = label
    timerSeconds.textContent = `${Math.ceil(state.remainingMs / 1000)} s`
  }

  function markAnswers(selectedKey = null) {
    const buttons = [...optionsRoot.querySelectorAll('.quiz-option')]

    buttons.forEach(button => {
      const key = button.dataset.choice
      button.disabled = true

      if (key === currentQuestion.correctKey) {
        button.classList.add('is-correct')
      } else if (selectedKey && key === selectedKey) {
        button.classList.add('is-wrong')
      }
    })
  }

  function startReview(selectedKey = null) {
    answered = true
    questionTimer.pause()
    markAnswers(selectedKey)
    showSubjectDetails()
    reviewTimer.start(REVIEW_DURATION_MS)
  }

  function answer(choiceKey) {
    if (answered || !currentQuestion) return

    const result = evaluateMultipleChoice(currentQuestion, choiceKey)
    attempts += 1

    if (result.isCorrect) {
      score += 1
      updateScore()
      startReview(choiceKey)
      return
    }

    updateScore()
    startReview(choiceKey)
  }

  function handleTimeout() {
    if (answered || !currentQuestion) return

    attempts += 1
    updateScore()
    startReview()
  }

  function renderSubjectDetails(subject) {
    const details = typeof getSubjectDetails === 'function' ? getSubjectDetails(subject) : []

    subjectDetails.replaceChildren()
    subjectLayout.classList.toggle('has-details', Boolean(details?.length))
    subjectDetails.hidden = true

    for (const detail of details ?? []) {
      const row = document.createElement('div')
      row.className = 'quiz-reading-row'

      if (detail.type) {
        row.dataset.detailType = detail.type
      }

      const label = document.createElement('span')
      label.className = 'quiz-reading-label'
      label.textContent = detail.label

      const value = document.createElement('strong')
      value.className = 'quiz-reading-value'
      value.textContent = detail.value || '—'

      row.append(label, value)
      subjectDetails.append(row)
    }
  }

  function showSubjectDetails() {
    if (subjectLayout.classList.contains('has-details')) {
      subjectDetails.hidden = false
    }
  }

  function renderChoices() {
    optionsRoot.replaceChildren()

    for (const choice of currentQuestion.choices) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `quiz-option${optionClass ? ` ${optionClass}` : ''}`
      button.dataset.choice = choice.key
      button.textContent = choice.label
      button.addEventListener('click', () => answer(choice.key))
      optionsRoot.append(button)
    }
  }

  function renderQuestion() {
    const state = session.getState()
    const subject = state.current

    currentQuestion = createMultipleChoiceQuestion(
      subject,
      filterKanjiByLevels(items, state.levels),
      {
        getAnswer,
        isDistractorAllowed,
      },
    )

    answered = false
    subjectElement.textContent = getSubjectLabel(subject)
    renderSubjectDetails(subject)
    level.textContent = subject.jlpt
    renderChoices()

    reviewTimer.stop()
    questionTimer.start(QUESTION_DURATION_MS)
  }

  function nextQuestion() {
    if (disposed || !session) return
    session.next()
    renderQuestion()
  }

  const questionTimer = createCountdownTimer({
    durationMs: QUESTION_DURATION_MS,
    onTick: state => {
      if (!disposed && !answered) renderTimer(state, 'Temps restant')
    },
    onComplete: () => {
      if (!disposed) handleTimeout()
    },
  })

  const reviewTimer = createCountdownTimer({
    durationMs: REVIEW_DURATION_MS,
    onTick: state => {
      if (!disposed && answered) renderTimer(state, 'Question suivante')
    },
    onComplete: () => {
      if (!disposed) nextQuestion()
    },
  })

  loadKanji()
    .then(loadedItems => {
      if (disposed) return

      items = loadedItems.filter(isItemEligible)

      if (items.length < 4) {
        throw new Error('Not enough eligible kanji for this quiz mode')
      }

      session = createQuizSession(items, { levels: selectedLevels() })
      updateScore()
      nextQuestion()
    })
    .catch(error => {
      if (disposed) return

      console.error(error)
      timerLabel.textContent = 'Erreur de chargement des données'
      timerSeconds.textContent = '—'
    })

  levelInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (!session || disposed) return

      const levels = selectedLevels()

      if (!levels.length) {
        input.checked = true
        return
      }

      questionTimer.stop()
      reviewTimer.stop()
      score = 0
      attempts = 0
      updateScore()
      session.setLevels(levels)
      nextQuestion()
    })
  })

  return () => {
    disposed = true
    questionTimer.stop()
    reviewTimer.stop()
  }
}
