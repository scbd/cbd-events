import { defineNuxtPlugin } from '#app'
import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin((nuxtApp) => {
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