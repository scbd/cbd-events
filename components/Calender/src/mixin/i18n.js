import Vue      from 'vue'
import VueI18n  from 'vue-i18n'
import messages from '../locales'
let i18n

export default {
  methods: {
    $tr: translate
  },
  beforeCreate(){
    if(!this.$i18n){
      Vue.use(VueI18n)
      i18n = new VueI18n({
        locale: 'en', // set locale
        messages // set locale messages
      })
    }

    if(this.$i18n)
      for (const locale in messages){
        const msgs = this.$i18n.getLocaleMessage(locale)

        this.$i18n.setLocaleMessage(locale, Object.assign(msgs, messages[locale]))
      }
  }
}// export

function translate (p){
  if(this.$i18n) return this.$i18n.t(p)
  else return i18n.t(p)
}
