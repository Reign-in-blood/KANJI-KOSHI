import { renderHomePage } from './pages/home.js'
import { renderQuizPage } from './pages/quiz.js'
import { renderRevisionPage } from './pages/revision.js'
import {
  createQuizRoute,
  getQuizTargets,
  normalizeQuizRoute,
  parseQuizRoute,
  QUIZ_TYPE_ORDER,
  QUIZ_TYPES,
} from './quiz-types.js'

const STATIC_ROUTES = new Set(['home', 'revision'])

function normalizeRoute(route) {
  if (STATIC_ROUTES.has(route)) return route
  return normalizeQuizRoute(route) ?? 'home'
}

function getRoute() {
  const value = window.location.hash.replace(/^#\/?/, '')
  return normalizeRoute(value || 'home')
}

function setRoute(route) {
  const normalizedRoute = normalizeRoute(route)
  const nextHash = normalizedRoute === 'home' ? '' : `#/${normalizedRoute}`

  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }

  window.location.hash = nextHash
}

export function renderApp(root) {
  let cleanupPage = () => {}
  let quizMenuSource = null

  root.innerHTML = `
    <div class="site-shell">
      <header class="topbar">
        <button class="brand" type="button" data-route="home" aria-label="Accueil KANJI KŌSHI">
          <span class="brand-mark" aria-hidden="true">漢</span>
          <span class="brand-copy">
            <strong>KANJI KŌSHI</strong>
            <small>Apprentissage japonais</small>
          </span>
        </button>

        <nav class="main-nav" aria-label="Navigation principale">
          <button type="button" data-route="home">Accueil</button>
          <button type="button" data-route="revision">Révision</button>

          <div class="nav-dropdown" data-role="quiz-dropdown">
            <button
              class="nav-dropdown-trigger"
              type="button"
              data-role="quiz-trigger"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Quiz <span class="nav-dropdown-arrow" aria-hidden="true">▾</span>
            </button>
            <div class="nav-submenu quiz-mode-menu" data-role="quiz-menu" hidden></div>
          </div>

          <button type="button" disabled>Kana</button>
          <button type="button" disabled>Progression</button>
        </nav>
      </header>

      <main class="page-frame" data-role="page"></main>

      <footer class="site-footer">
        <span>KANJI KŌSHI</span>
        <span>JLPT N5 · N4</span>
      </footer>
    </div>
  `

  const pageRoot = root.querySelector('[data-role="page"]')
  const routeButtons = [...root.querySelectorAll('[data-route]')]
  const quizDropdown = root.querySelector('[data-role="quiz-dropdown"]')
  const quizTrigger = root.querySelector('[data-role="quiz-trigger"]')
  const quizMenu = root.querySelector('[data-role="quiz-menu"]')

  function currentQuizMode() {
    return parseQuizRoute(getRoute())
  }

  function closeQuizMenu() {
    quizMenuSource = null
    quizDropdown.classList.remove('is-open')
    quizTrigger.setAttribute('aria-expanded', 'false')
    quizMenu.hidden = true
  }

  function renderQuizSourceMenu() {
    quizMenu.replaceChildren()

    const currentMode = currentQuizMode()
    const heading = document.createElement('div')
    heading.className = 'quiz-menu-heading'
    heading.textContent = 'Question'
    quizMenu.append(heading)

    for (const source of QUIZ_TYPE_ORDER) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'quiz-menu-item quiz-menu-source'
      button.dataset.quizSource = source

      if (currentMode?.source === source) button.classList.add('is-current')

      const label = document.createElement('span')
      label.textContent = QUIZ_TYPES[source].label

      const arrow = document.createElement('span')
      arrow.className = 'quiz-menu-chevron'
      arrow.setAttribute('aria-hidden', 'true')
      arrow.textContent = '›'

      button.append(label, arrow)
      button.addEventListener('click', event => {
        event.stopPropagation()
        quizMenuSource = source
        renderQuizTargetMenu(source)
      })

      quizMenu.append(button)
    }
  }

  function renderQuizTargetMenu(source) {
    quizMenu.replaceChildren()

    const currentMode = currentQuizMode()
    const back = document.createElement('button')
    back.type = 'button'
    back.className = 'quiz-menu-back'
    back.innerHTML = `<span aria-hidden="true">‹</span> ${QUIZ_TYPES[source].label}`
    back.addEventListener('click', event => {
      event.stopPropagation()
      quizMenuSource = null
      renderQuizSourceMenu()
    })
    quizMenu.append(back)

    const heading = document.createElement('div')
    heading.className = 'quiz-menu-heading'
    heading.textContent = 'Trouver'
    quizMenu.append(heading)

    for (const target of getQuizTargets(source)) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'quiz-menu-item'

      if (currentMode?.source === source && currentMode?.target === target) {
        button.classList.add('is-active')
      }

      button.textContent = QUIZ_TYPES[target].label
      button.addEventListener('click', event => {
        event.stopPropagation()
        setRoute(createQuizRoute(source, target))
        closeQuizMenu()
      })

      quizMenu.append(button)
    }
  }

  function openQuizMenu() {
    quizDropdown.classList.add('is-open')
    quizTrigger.setAttribute('aria-expanded', 'true')
    quizMenu.hidden = false

    if (quizMenuSource) renderQuizTargetMenu(quizMenuSource)
    else renderQuizSourceMenu()
  }

  function toggleQuizMenu(event) {
    event.stopPropagation()

    if (quizDropdown.classList.contains('is-open')) {
      closeQuizMenu()
    } else {
      openQuizMenu()
    }
  }

  function renderRoute() {
    cleanupPage()

    const route = getRoute()
    const quizMode = parseQuizRoute(route)

    routeButtons.forEach(button => {
      const exactActive = button.dataset.route === route
      button.classList.toggle('is-active', exactActive)

      if (button.closest('.main-nav')) {
        if (exactActive) button.setAttribute('aria-current', 'page')
        else button.removeAttribute('aria-current')
      }
    })

    quizTrigger.classList.toggle('is-group-active', Boolean(quizMode))

    if (route === 'revision') {
      cleanupPage = renderRevisionPage(pageRoot)
      return
    }

    if (quizMode) {
      cleanupPage = renderQuizPage(pageRoot, quizMode)
      return
    }

    cleanupPage = renderHomePage(pageRoot, { navigate: setRoute })
  }

  routeButtons.forEach(button => {
    button.addEventListener('click', () => setRoute(button.dataset.route))
  })

  quizTrigger.addEventListener('click', toggleQuizMenu)

  document.addEventListener('click', event => {
    if (!quizDropdown.contains(event.target)) closeQuizMenu()
  })

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeQuizMenu()
  })

  window.addEventListener('hashchange', renderRoute)
  renderRoute()
}
