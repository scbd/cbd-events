import { defineNuxtPlugin } from '#app'
import swal from 'sweetalert2'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      swal
    }
  }
})