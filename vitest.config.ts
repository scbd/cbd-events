import { defineConfig } from 'vitest/config'
import { resolve      } from 'node:path'
import   vue            from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
