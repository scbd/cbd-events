import { defineNuxtPlugin } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    // Add any default config here
  })

  // Add error interceptor
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      console.info(error)
      return Promise.reject(error)
    }
  )

  // Provide axios instance
  return {
    provide: {
      axios: axiosInstance
    }
  }
})