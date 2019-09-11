import Vue from 'vue'
import { DateTime        } from 'luxon'

let locale = 'en'

export const timeDisplay   = (isoDate) => DateTime.fromISO(isoDate).toFormat('LLL d')
export const lstring       = (val) => { if(!val) return; return val[locale] || val['en'] }

export const trimName  = (name) => {
  const value = name.replace(/\.[^/.]+$/, '')

  if (!value) return ''
  if (value.length<30) return value

  return `${value.substr(0, 13)}...${value.substr(value.length-13, value.length-1)}`
}

export const formatBytes = (a, b=2) => {
  if(0==a) return'0 Bytes'

  const c = 1024
  const d = b||2
  const e = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ]
  const f = Math.floor(Math.log(a)/Math.log(c))

  return parseFloat((a/Math.pow(c, f)).toFixed(d))+' '+e[f]
}

export const globalFilter  = { lstring }

export default ({ store }) => {
  locale = store.state.i18n.locale

  Object.keys(globalFilter).forEach(key => { Vue.filter(key, globalFilter[key]) })

  Vue.prototype.$filters = Vue.options.filters
}