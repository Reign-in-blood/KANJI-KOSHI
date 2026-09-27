import './styles/main.css'
import { renderApp } from './ui/app.js'
import { mountSakuraFall } from './ui/sakura-fall.js'

mountSakuraFall()
renderApp(document.querySelector('#app'))
