import { dotEnvReader, cordovaNuxtConfig } from './modules/appEnvironmentsManager'
// import { resolve } from 'path'
const localforage = require('localforage')

dotEnvReader() // read env related vars and set them to nodejs.env

let config = {
  mode: 'spa',
  dev : (process.env.NODE_ENV !== 'production'),
  env : {
    API        : process.env.API,
    IFRAME_HOST: process.env.IFRAME_HOST,
    ATTACHMENTS: process.env.ATTACHMENTS
  },
  head: {
    title: 'CBD Events - UN Biodiversity Conference App',
    meta : [ { charset: 'utf-8' },
      { name: 'viewport',  content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas,  descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.' }
    ],
    link: [ { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' } ]
  },
  css: [
    { src: '~assets/app.scss'  },
    { src: '~assets/app.css' }
  ],
  modules: [  
    [ 'nuxt-i18n', {
      defaultLocale        : 'en',
      detectBrowserLanguage: { cookieKey: 'localePref', useCookie: true },
      locales              : [
        { code: 'en', file: 'en.js', iso: 'en-US' },
        { code: 'fr', file: 'fr.js', iso: 'fr-FR' }
      ],
      strategy: 'prefix_except_default',
      lazy    : true,
      langDir : 'locales/',
      vueI18n : { fallbackLocale: 'en' },
      seo     : false,
      vuex    : {
        moduleName: 'i18n',
        mutations : { setLocale: 'I18N_SET_LOCALE',  setMessages: 'I18N_SET_MESSAGES' }
      }
    }
    ],
    '@nuxtjs/axios',
    [ '~/modules/nuxtModules/localForage.js', {
      name       : 'cbd-events',
      version    : 1.0,
      size       : 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName  : 'files', // Should be alphanumeric, with underscores.
      description: 'Main file store',
      instances  : [ 
                      { name: 'cbd-events', version: 1.0, size: 4980736,  storeName: 'blobs', description: 'file blobs' },
                      { name: 'cbd-events', version: 1.0, size: 4980736,  storeName: 'about', description: 'about articles' }
                    ]
    } ]
  ],
  plugins: [
    '~/plugins/icons/index.js',
    '~/plugins/axios.js',
    '~/plugins/router.js',
    '~/plugins/filters.js',
    '~/plugins/vue-notifications'
    
  ],
  loading: { color: '#009b48' },
  router : { linkActiveClass: 'active-link', middleware: [ 'redirects' ] },
  build  : { extend },
  axios  : { browserBaseURL: '/', baseURL: process.env.API },
  cache  : { max: 1000, maxAge: 900000 },
  render : { http2: { push: true }, static: { maxAge: '1y', setHeaders } }
}

config = cordovaNuxtConfig(config) // if cordova modify config

module.exports = config

function setHeaders(res, path){
  if (path.includes('sw.js'))
    res.setHeader('Cache-Control', `public, max-age=${15 * 60}`)
}

/*
** Run ESLint on save
*/
function extend(config, { isDev, isClient }){
  if (isDev && isClient)
    config.module.rules.push({
      enforce: 'pre',
      test   : /\.(js|vue)$/,
      loader : 'eslint-loader',
      exclude: /(node_modules)/,
      options: { fix: true }
    })
}

// function done(moduleContainer){

//   moduleContainer.addPlugin({
//     src     : resolve(__dirname, 'plugins/i18n.js'),
//     ssr     : false,
//     fileName: 'i18n.js'
//   })

// } 