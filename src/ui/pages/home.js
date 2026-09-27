export function renderHomePage(root, { navigate }) {
  root.innerHTML = `
    <section class="home-hero">
      <div class="hero-copy">
        <p class="eyebrow">日本語 · JLPT N5 / N4</p>
        <h1>Apprendre les kanji,<br><span>un caractère à la fois.</span></h1>
        <p class="hero-intro">
          Révise les lectures et les significations avec des sessions rapides,
          simples et centrées sur l'essentiel.
        </p>

        <div class="hero-actions">
          <button class="button button-primary" type="button" data-action="start-revision">
            Commencer une révision
          </button>
          <span class="hero-meta">245 kanji · français · sans compte</span>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="sakura-orbit sakura-orbit-one"></div>
        <div class="sakura-orbit sakura-orbit-two"></div>
        <div class="kanji-showcase">
          <span class="kanji-showcase-level">学</span>
          <span class="kanji-showcase-reading">まなぶ · apprendre</span>
        </div>
      </div>
    </section>

    <section class="home-section" aria-labelledby="modes-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Modes d'apprentissage</p>
          <h2 id="modes-title">Choisis comment travailler</h2>
        </div>
        <p>Révision et quiz sont disponibles. Les autres modes arrivent progressivement.</p>
      </div>

      <div class="mode-grid">
        <button class="mode-card mode-card-primary" type="button" data-action="start-revision">
          <span class="mode-card-symbol" aria-hidden="true">漢</span>
          <span class="mode-card-body">
            <span class="mode-card-kicker">Disponible</span>
            <strong>Révision</strong>
            <span>Kanji, timer, lectures ON/KUN et significations françaises.</span>
          </span>
          <span class="mode-card-arrow" aria-hidden="true">→</span>
        </button>

        <button class="mode-card" type="button" data-action="start-quiz">
          <span class="mode-card-symbol" aria-hidden="true">問</span>
          <span class="mode-card-body">
            <span class="mode-card-kicker">Disponible</span>
            <strong>Quiz</strong>
            <span>Quatre propositions pour retrouver la signification d'un kanji.</span>
          </span>
          <span class="mode-card-arrow" aria-hidden="true">→</span>
        </button>

        <article class="mode-card is-coming-soon">
          <span class="mode-card-symbol" aria-hidden="true">あ</span>
          <span class="mode-card-body">
            <span class="mode-card-kicker">À venir</span>
            <strong>Kana</strong>
            <span>Hiragana et katakana avec exercices dédiés.</span>
          </span>
        </article>

        <article class="mode-card is-coming-soon">
          <span class="mode-card-symbol" aria-hidden="true">進</span>
          <span class="mode-card-body">
            <span class="mode-card-kicker">À venir</span>
            <strong>Progression</strong>
            <span>Suivi des kanji vus, maîtrisés et à retravailler.</span>
          </span>
        </article>
      </div>
    </section>

    <section class="home-highlight">
      <div>
        <p class="eyebrow">V1 concentrée</p>
        <h2>N5 et N4 d'abord.</h2>
      </div>
      <p>
        L'application se concentre actuellement sur 245 kanji N5/N4 afin de construire
        une expérience solide avant d'étendre les niveaux.
      </p>
    </section>
  `

  root.querySelectorAll('[data-action="start-revision"]').forEach(button => {
    button.addEventListener('click', () => navigate('revision'))
  })

  root.querySelector('[data-action="start-quiz"]')?.addEventListener('click', () => navigate('quiz'))

  return () => {}
}
