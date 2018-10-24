const path = require('path')
const serveStatic = require('serve-static')

let dotFile = '.env'

if (['local','dev','stg','ios','iosdev'].includes(process.env.NODE_ENV))
  dotFile = `${dotFile}.${process.env.NODE_ENV}`
else 
  process.env.NODE_ENV = 'production'
  
console.info(`##### Building for NODE_ENV: ${process.env.NODE_ENV}`)  
console.info(`##### Reading dotenv file: ${dotFile}`)

require('dotenv').config({path: path.resolve(process.cwd(), dotFile)})

module.exports = {
  // only for easier development
  // serverMiddleware: [
  //  { path: '/cordova.js', handler: serveStatic(__dirname + '/cordova/platforms/ios/www/cordova.js') },
  //  { path: '/cordova_plugins.js', handler: serveStatic(__dirname + '/cordova/platforms/ios/www/cordova_plugins.js') },
  //  { path: '/plugins', handler: serveStatic(__dirname + '/cordova/platforms/ios/www/plugins') }
  // ],
  dev: (process.env.NODE_ENV !== 'production'),
  mode:'spa', 
  env: {
    API: process.env.API,
    BASE_URL: process.env.BASE_URL,
    IFRAME_HOST: process.env.IFRAME_HOST,
    ATTACHMENTS: process.env.ATTACHMENTS,
    DOCS_API:process.env.DOCS_API,
    PROXY_ENABLED:process.env.PROXY_ENABLED
  },
  head: {
    title: 'UN Biodiversity Events',
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'viewport', content: 'viewport', content: 'width=device-width, initial-scale=1, minimal-ui, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
      { name: 'nativeUI', content:true },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'UN Biodiversity Events Application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },        
    ],
    script: [
        { src : 'cordova.js'}
    ]
  },

  css: [
    { src: 'normalize.css' },
    { src: '@scbd/ecosystem-style/layouts/base/build.min.css' },
    { src: '@scbd/ecosystem-style/layouts/container/build.min.css' },
    { src: '@scbd/ecosystem-style/elements/typography/headings/build.css' },
    { src: '@scbd/ecosystem-style/modifiers/helpers/build.min.css' },
    { src: '@scbd/ecosystem-style/modifiers/text/build.min.css' },
    { src: '@scbd/ecosystem-style/layouts/grid/build.min.css' },
    { src: '@scbd/ecosystem-style/modifiers/responsive/build.min.css' },
    { src: '~assets/app.css' },
  ],
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    ['~/modules/nuxtModules/localForage.js', {
      name: 'cbd-events',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'files', // Should be alphanumeric, with underscores.
      description: 'Main file store'
    }],
    ['nuxt-i18n', {
      defaultLocale: 'en',
      detectBrowserLanguage: {
        cookieKey: 'localePref',
        useCookie: true,
      },
      locales: [{
          code: 'en',
          file: 'en.js',
          iso: 'en-US'
        },
        {
          code: 'fr',
          file: 'fr.js',
          iso: 'fr-FR'
        }
      ],
      strategy: 'prefix_except_default',
      lazy: true,
      langDir: 'locales/',
      vueI18n: {
        fallbackLocale: 'en'
      },
      seo: false,
      vuex: {
        // Module namespace
        moduleName: 'i18n',

        // Mutations config
        mutations: {
          // Mutation to commit to store current locale, set to false to disable
          setLocale: 'I18N_SET_LOCALE', //'I18N_SET_LOCALE',

          // Mutation to commit to store current message, set to false to disable
          setMessages: 'I18N_SET_MESSAGES'
        }
      }
    }]

  ],
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/i18n.js',
    '~/plugins/router.js',
    '~/plugins/filters.js',
    '~/plugins/vue-notifications'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#009b48' },
  /*
  ** Build configuration
  */
  router: {
    //  mode: 'hash',// turn this on for IOS dev
      linkActiveClass: 'active-link',
      middleware: ['redirects']
  },
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  },
  proxy: {
    '/api': {
      target: process.env.API,
      changeOrigin: true
    },
    '/images': {
      target: process.env.ATTACHMENTS,
      pathRewrite: { '^/images' : '/' },
      changeOrigin: true
    },
    '/doc': {
      target: process.env.DOCS_API,
      changeOrigin: true
    },
  },
  axios: {
    proxy: true,
    browserBaseURL: '/',
    baseURL: process.env.API
  }
}
