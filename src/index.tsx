import App from '@/app'
import { cleanupTokens } from '@/jwt'
import { render } from 'preact'

const el = document.createElement('div')
document.body.append(el)

cleanupTokens()

render(<App />, el)

if ('serviceWorker' in navigator && process.env.ROLLUP === 'true') {
  navigator.serviceWorker.register('/sw.js')
}
