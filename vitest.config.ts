import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals    : true,
    setupFiles : ['tests/setup.js'],
    alias      : {
      '~'    : resolve(__dirname, 'app'),
      '#app' : resolve(__dirname, 'tests/__mocks__/nuxt-app.js'),
    },
  },
})
