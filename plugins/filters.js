import Vue from 'vue'


export default async ({ store }) => {
  Vue.filter('lstring',  function(val){
    if(!val) return
    return val[store.state.i18n.locale] || val['en']
  })
}
