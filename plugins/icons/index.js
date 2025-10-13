import { defineNuxtPlugin } from '#app'
import Icons from './Icons.vue'
import Icon  from './Icon.vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Register components globally
  nuxtApp.vueApp.component('Icons', Icons)
  nuxtApp.vueApp.component('Icon', Icon)
})