// import { dotEnvReader, cordovaNuxtConfig } from './modules/appEnvironmentsManager'

// dotEnvReader() // read env related vars and set them to nodejs.env
import { version } from './package.json'

let config = {
  mode: 'spa',
  env:{
    NUXT_ENV_BASE_URL   : 'https://cbd-events.cbd.int' ,
    NUXT_ENV_IFRAME_HOST: 'https://www.cbd.int'        ,
    NUXT_ENV_API        : 'https://api.cbd.int'        ,
    NUXT_ENV_ATTACHMENTS: 'https://attachments.cbd.int',
    NUXT_ENV_VERSION    : version
  },
  dev : (process.env.NODE_ENV !== 'production'),
  head: {
    title: 'CBD Events - UN Biodiversity Conference App',
    meta : [ { charset: 'utf-8' },
      { name: 'viewport',  content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas,  descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.' },
    ],
    link: [ { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' } ]
  },
  css: [
    { src: '~assets/app.scss'  },
    { src: '~assets/app.css' },
    { src: '~assets/content-style.css' }
  ],
  modules: [
    [ 'nuxt-i18n', {
      defaultLocale        : 'en',
      detectBrowserLanguage: { cookieKey: 'localePref', useCookie: true },
      locales              : [
        { code: 'en', file: 'en.js', iso: 'en-US' }
      ],
      strategy: 'prefix_except_default',
      lazy    : true,
      langDir : 'locales/',
      vueI18n : { fallbackLocale: 'en' },
      seo     : false,
      // vuex    : {
      //   moduleName: 'i18n',
      //   mutations : { setLocale: 'I18N_SET_LOCALE',  setMessages: 'I18N_SET_MESSAGES' }
      // }
    }
    ],
    [ '~/modules/nuxtModules/localForage.js', {
      name       : 'cbd-events',
      version    : 1.0,
      size       : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName  : 'files', // Should be alphanumeric, with underscores.
      description: 'Main file store',
      instances  : [
        { name: 'cbd-events', version: 1.0, size: 4980736,  storeName: 'blobs', description: 'file blobs' },
        { name: 'cbd-events', version: 1.0, size: 4980736,  storeName: 'about', description: 'about articles' },
        { name: 'cbd-events', version: 1.0, size: 4980736,  storeName: 'article', description: 'articles' }
      ]
    } ]
  ],
  plugins: [
    '~/plugins/icons/index.js',
    '~/plugins/router.js',
    '~/plugins/filters.js',
    '~/plugins/vue-notifications'
    
  ],
  loading: { color: '#009b48' },
  router : { linkActiveClass: 'active-link', middleware: [ 'redirects' ] },
  build  : { transpile: [ 'camelcase-keys', '@awesome-cordova-plugins/file-opener' ] },
  cache  : { max: 1000, maxAge: 900000 },
  render : { http2: { push: true }, static: { maxAge: '1y', setHeaders } },
  generate: { dir: 'capacitor/www' }
}

config.plugins.unshift('~/plugins/cordova.js')
//config = cordovaNuxtConfig(config) // if cordova modify config

module.exports = config

function setHeaders(res, path){
  if (path.includes('sw.js'))
    res.setHeader('Cache-Control', `public, max-age=${15 * 60}`)
}
