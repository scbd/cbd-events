import Vue from 'vue'
import AuthIFrame from '~/components/AuthIFrame'

const vm = new Vue({
  data: {
    me: {}
  }
})

// create component programatically
const AuthIFrameClass = Vue.extend(AuthIFrame)

export default ({ app }, inject) => {
  //TODO make env dynamic
  const AuthIFrameInstance = new AuthIFrameClass({
      propsData: { env: 'production' }
  })
  // create hidden iframe to accounts.cbd.int
  createMixin (AuthIFrameInstance)

  // when loaded get token
  whenIframeLoaded (app.$auth, AuthIFrameInstance)

  // app.i18n.path = (link) => {
  //  if (app.i18n.locale === app.i18n.fallbackLocale)
  //    return `/${link}`
  //  return `/${app.i18n.locale}/${link}`
  // }
}


function whenIframeLoaded (auth, AuthIFrameInstance) {
  AuthIFrameInstance.loaded.then(async (t)=>{
    auth.setToken('local', `Ticket ${t}`)
    auth.fetchUser()
  })
}

function createMixin (AuthIFrameInstance) {
  Vue.mixin({
    // computed:{
    //   '$me':() => Vue.$me.get(),
    //   // '$isAdmin':isAdmin,
    //   // '$isStaff':isStaff,
    //   '$token':()=>AuthIFrameInstance.loaded
    // },
    // methods:{
    //   '$hasRole':hasRole
    // },
    mounted: function () {
      if( !Vue.$AuthIFrame && this.$options.name!=='AuthIFrame' && this.$options.name){
        AuthIFrameInstance.$mount()
        this.$el.appendChild(AuthIFrameInstance.$el)
        Vue.$AuthIFrame = AuthIFrameInstance.$el
      }
    }
  })
}
