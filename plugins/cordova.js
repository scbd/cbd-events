import { defineNuxtPlugin } from '#app'
import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin((nuxtApp) => {
  const localePath = (link) => {
    // In Nuxt 3, use the i18n plugin's localePath
    const i18n = nuxtApp.$i18n
    if (i18n && i18n.localePath) {
      return i18n.localePath(link).replace('#', '')
    }
    return link.replace('#', '')
  }

  // Provide localePath helper
  return {
    provide: {
      localePath
    }
  }

  // Cordova/Capacitor is only available in native environments
  if (Capacitor.getPlatform() === 'web') return

  // Additional Capacitor setup for native platforms
  if (typeof window !== 'undefined' && window.cordova) {
    window.addEventListener('deviceready', async () => {
      const { cordova } = window;
      const { file } = cordova;
      
      // Store file reference for later use
      if (file) {
        window.cordovaFile = file
      }
    })
  }
})