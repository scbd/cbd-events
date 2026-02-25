import { defineNuxtPlugin } from '#app'
import swal from 'sweetalert2'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swal
    }
  }
})
