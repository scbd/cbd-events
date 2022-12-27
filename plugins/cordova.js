import Vue        from 'vue'
import VueCordova from 'vue-cordova'
import { FileOpener } from '@awesome-cordova-plugins/file-opener'
import { Device } from '@capacitor/device';

Vue.use(VueCordova)

export default ({app}, inject) => {
  Vue.cordova.on('deviceready', async () => {
    const { cordova }                     = window
    const { file, InAppBrowser, plugins } = cordova

    // console.error(JSON.stringify(Object.keys(file)))
    // console.error(JSON.stringify(Object.keys(plugins)))
    // console.error(cordova.platformId)
    // console.error(JSON.stringify(Object.keys(Vue.cordova)))
    // console.error(JSON.stringify(Object.keys(plugins)))
    // console.error(Vue.cordova.geolocation)
// ["deviceready","plugins","on","geolocation","contacts"]
    // cordova.iAB          = InAppBrowser
    // cordova.inAppBrowser = InAppBrowser
    // cordova.fO2          = FileOpener
    // cordova.fileOpener2  = FileOpener
    // cordova.Device      = Device
    // cordova.deviceready = Vue   .cordova.deviceready
    // cordova.on          = Vue   .cordova.on
    // cordova.geolocation = Vue   .cordova.geolocation
    // cordova.contacts    = Vue   .cordova.contacts
    Vue.cordova.file = file
    // inject('cordova', cordova)

  })

  const  localePath = (link) => {
    return app.localePath(link).replace('#', '')
  }

  inject('cordova', Vue.cordova)
  inject('localePath', localePath)
}

