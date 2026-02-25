import { defineNuxtPlugin } from '#app'
import { Capacitor } from '@capacitor/core'

export default defineNuxtPlugin(() => {
  const platform = Capacitor.getPlatform() // 'web' | 'ios' | 'android'
  const isNative = platform !== 'web'

  return {
    provide: {
      platform,
      isNative,
    }
  }
})
