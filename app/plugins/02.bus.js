import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'

export default defineNuxtPlugin(() => {
  const bus = mitt()

  return {
    provide: {
      bus
    }
  }
})
