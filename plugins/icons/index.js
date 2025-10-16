import { defineNuxtPlugin } from '#app'
import Icons from './icons.vue'
import Icon  from './icon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register components globally
  nuxtApp.vueApp.component('Icons', Icons)
  nuxtApp.vueApp.component('Icon', Icon)
})