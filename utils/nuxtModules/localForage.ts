import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'localforage',
    configKey: 'localforage'
  },
  defaults: {
    name: 'nuxtJS',
    storeName: 'nuxtLocalForage'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add plugin
    addPlugin({
      src: resolver.resolve('../../plugins/localForage.ts'),
      mode: 'client'
    })
  }
})
