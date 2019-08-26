import Vue from 'vue'


export default ({ store }) => {
  const { locale } = store.state.i18n
  
  Vue.filter('lstring', (val) => {
    if(!val) return
    return val[locale] || val['en']
  })
}
