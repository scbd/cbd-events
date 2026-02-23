import Vue        from 'vue'
import VueCordova from 'vue-cordova'
import { Capacitor } from '@capacitor/core';

if(Capacitor.getPlatform() !== 'web')
  Vue.use(VueCordova)

export default ({app}, inject) => {


  const  localePath = (link) => {
    return app.localePath(link).replace('#', '')
  }

  inject('localePath', localePath)

  if(Capacitor.getPlatform() === 'web') return

  inject('cordova', Vue.cordova)

  Vue.cordova.on('deviceready', async () => {
    const { cordova }  = window;
    const { file }     = cordova;

    Vue.cordova.file = file
  })
}