import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals    : true,
    alias      : {
      '~': resolve(__dirname, 'app'),
    },
  },
})
