import { defineNuxtPlugin } from '#app'
import { DateTime } from 'luxon'

// Note: Vue 3 removed filters. These are now provided as global properties
// In templates, use {{ $filters.lstring(value) }} instead of {{ value | lstring }}

export const timeDisplay = (isoDate) => DateTime.fromISO(isoDate).toFormat('LLL d')

export const lstring = (val, currentLocale = 'en') => {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val[currentLocale] || val['en'] || ''
}

export const trimName = (name) => {
  const value = name.replace(/\.[^/.]+$/, '')

  if (!value) return ''
  if (value.length < 30) return value

  return `${value.substr(0, 13)}...${value.substr(value.length - 13, value.length - 1)}`
}

export const formatBytes = (a, b = 2) => {
  if (0 == a) return '0 Bytes'

  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))

  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

export default defineNuxtPlugin((nuxtApp) => {
  // Provide all filter functions as global properties
  return {
    provide: {
      filters: {
        lstring,
        timeDisplay,
        trimName,
        formatBytes
      }
    }
  }
})