import Vue from 'vue';
import VueCordova from 'vue-cordova';
Vue.use(VueCordova);
export default ({app: {router}, store}, inject) => {
    Vue.cordova.on('deviceready', () => {
      Vue.cordova.file = cordova.file
      Vue.cordova.iAB = Vue.cordova.inAppBrowser = cordova.InAppBrowser
      Vue.cordova.fO2 = Vue.cordova.fileOpener2 = cordova.plugins.fileOpener2
    });

    inject('cordova',Vue.cordova)
}
