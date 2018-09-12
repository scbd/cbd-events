import Vue from 'vue';
import VueCordova from 'vue-cordova';
Vue.use(VueCordova);
export default ({app: {router}, store}, inject) => {
    Vue.cordova.on('deviceready', () => {
console.log('Javascript OK');
        /*
        Do Something
        */

    });
}
