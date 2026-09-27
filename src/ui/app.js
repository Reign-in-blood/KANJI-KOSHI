import { renderHomePage } from './pages/home.js'
import { renderQuizPage } from './pages/quiz.js'
import { renderSymbolQuizPage } from './pages/quiz-symbol.js'
import { renderRevisionPage } from './pages/revision.js'

const ROUTES = new Set(['home', 'revision', 'quiz', 'quiz-symbol'])

function getRoute() {
  const value = window.location.hash.replace(/^#\/?/, '')
  return ROUTES.has(value) ? value : 'home'
}

function setRoute(route) {
  if (!ROUTES.has(route)) return

  const nextHash = route === 'home' ? '' : `#/${route}`

  if (window.location.hash === nextHash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    return
  }

  window.location.hash = nextHash
}

export function renderApp(root) {
  let cleanupPage = () => {}

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

          <div class="nav-dropdown">
            <button
              class="nav-dropdown-trigger"
              type="button"
              data-route="quiz"
              data-route-group="quiz"
            >
              Quiz <span class="nav-dropdown-arrow" aria-hidden="true">▾</span>
            </button>
            <div class="nav-submenu">
              <button type="button" data-route="quiz">Signification</button>
              <button type="button" data-route="quiz-symbol">Symbole</button>
            </div>
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

  function renderRoute() {
    cleanupPage()

    const route = getRoute()

    routeButtons.forEach(button => {
      const routeGroup = button.dataset.routeGroup
      const active = button.dataset.route === route || (routeGroup && route.startsWith(routeGroup))

      button.classList.toggle('is-active', active)

      if (button.closest('.main-nav')) {
        if (active && !routeGroup) button.setAttribute('aria-current', 'page')
        else button.removeAttribute('aria-current')
      }
    })

    if (route === 'revision') {
      cleanupPage = renderRevisionPage(pageRoot)
      return
    }

    if (route === 'quiz-symbol') {
      cleanupPage = renderSymbolQuizPage(pageRoot)
      return
    }

    if (route === 'quiz') {
      cleanupPage = renderQuizPage(pageRoot)
      return
    }

    cleanupPage = renderHomePage(pageRoot, { navigate: setRoute })
  }

  routeButtons.forEach(button => {
    button.addEventListener('click', () => setRoute(button.dataset.route))
  })

  window.addEventListener('hashchange', renderRoute)
  renderRoute()
}
