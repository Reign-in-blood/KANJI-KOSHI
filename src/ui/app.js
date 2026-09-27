import { renderHomePage } from './pages/home.js'
import { renderQuizPage } from './pages/quiz.js'
import { renderRevisionPage } from './pages/revision.js'

const ROUTES = new Set(['home', 'revision', 'quiz'])

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
          <button type="button" data-route="quiz">Quiz</button>
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
      const active = button.dataset.route === route
      button.classList.toggle('is-active', active)
      if (button.closest('.main-nav')) {
        if (active) button.setAttribute('aria-current', 'page')
        else button.removeAttribute('aria-current')
      }
    })

    if (route === 'revision') {
      cleanupPage = renderRevisionPage(pageRoot)
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
