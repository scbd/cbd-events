import Vue        from 'vue'
import VueCordova from 'vue-cordova'

Vue.use(VueCordova)

export default ({app}, inject) => {
  Vue.cordova.on('deviceready', () => {
    const { cordova }                     = window
    const { file, InAppBrowser, plugins } = cordova

    Vue.cordova.file         = file
    Vue.cordova.iAB          = InAppBrowser
    Vue.cordova.inAppBrowser = InAppBrowser
    Vue.cordova.fO2          = plugins.fileOpener2
    Vue.cordova.fileOpener2  = plugins.fileOpener2
  })

  const  localePath = (link) => {
    return app.localePath(link).replace('#', '')
  }

  inject('cordova', Vue.cordova)
  inject('localePath', localePath)
}

