const PETAL_COUNT_DESKTOP = 24
const PETAL_COUNT_MOBILE = 14

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function configurePetal(petal, index) {
  const size = randomBetween(8, 17)
  const startX = randomBetween(-4, 100)
  const drift = randomBetween(-18, 18)
  const duration = randomBetween(8, 16)
  const delay = -randomBetween(0, duration)
  const spin = randomBetween(300, 900) * (Math.random() > 0.5 ? 1 : -1)
  const opacity = randomBetween(0.42, 0.78)
  const sway = randomBetween(18, 46)

  petal.style.setProperty('--petal-size', `${size}px`)
  petal.style.setProperty('--petal-x', `${startX}vw`)
  petal.style.setProperty('--petal-drift', `${drift}vw`)
  petal.style.setProperty('--petal-duration', `${duration}s`)
  petal.style.setProperty('--petal-delay', `${delay}s`)
  petal.style.setProperty('--petal-spin', `${spin}deg`)
  petal.style.setProperty('--petal-opacity', opacity.toFixed(2))
  petal.style.setProperty('--petal-sway', `${sway}px`)
  petal.style.setProperty('--petal-phase', `${(index % 5) * 0.17}s`)
}

export function mountSakuraFall() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const layer = document.createElement('div')
  layer.className = 'sakura-fall'
  layer.setAttribute('aria-hidden', 'true')

  const isMobile = window.matchMedia('(max-width: 760px)').matches
  const petalCount = isMobile ? PETAL_COUNT_MOBILE : PETAL_COUNT_DESKTOP

  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement('span')
    petal.className = 'sakura-petal'
    configurePetal(petal, index)

    petal.addEventListener('animationiteration', () => {
      configurePetal(petal, index)
    })

    layer.append(petal)
  }

  document.body.append(layer)

  return () => layer.remove()
}
