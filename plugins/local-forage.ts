import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import localforage from 'localforage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const options = config.public.localforage || {
    name: 'nuxtJS',
    storeName: 'nuxtLocalForage'
  }

  // Create main instance
  const mainInstance = localforage.createInstance(options)
  
  // Create a localForage wrapper object
  const $localForage: any = {
    ...mainInstance,
    [options.storeName]: mainInstance
  }

  // Create additional instances if specified
  if (options.instances && Array.isArray(options.instances)) {
    for (const instanceOpts of options.instances) {
      if (!instanceOpts.name || !instanceOpts.storeName) {
        console.warn('LocalForage instance missing name or storeName:', instanceOpts)
        continue
      }
      $localForage[instanceOpts.storeName] = localforage.createInstance(instanceOpts)
    }
  }

  return {
    provide: {
      localForage: $localForage
    }
  }
})
