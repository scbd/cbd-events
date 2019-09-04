import Vue from 'vue'

let locale = 'en'

export const lstring  = (val) => { if(!val) return; return val[locale] || val['en'] }
export const filters  = { lstring }

export default ({ store }) => {
  locale = store.state.i18n.locale

  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })

  Vue.prototype.$filters = Vue.options.filters
}