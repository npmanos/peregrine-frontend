// @ts-check
const prefresh = require('@prefresh/vite')
const tsResolver = require('vite-tsconfig-paths').default

/** @type {import('vite').UserConfig} */
const config = {
  jsx: 'preact',
  plugins: [prefresh()],
  resolvers: [tsResolver],
  alias: {
    linaria: 'goober',
    'linaria-styled-preact': 'goober',
  },
}

module.exports = config
