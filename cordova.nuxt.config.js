const path = require('path')

require('dotenv').config({path: path.resolve(process.cwd(), '.env.local')})
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
console.log('process.env.NODE_ENVprocess.env.NODE_ENV',process.env.NODE_ENV)
module.exports = {
  dev: true,//(process.env.NODE_ENV !== 'production'),
  mode:'spa',
  env: {
    BASE_URL: process.env.BASE_URL,
    IFRAME_HOST: process.env.IFRAME_HOST
  },
  head: {
    meta: [
      { name: 'viewport', content: 'viewport', content: 'width=device-width, initial-scale=1, minimal-ui, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
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
    { src: '~assets/app.css' }
  ],
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    // '@nuxtjs/auth',
    ['nuxt-i18n', {
      locales: ['en', 'fr'],
      defaultLocale: 'en',
        detectBrowserLanguage: {
          cookieKey: 'localePref',
          useCookie: true,
      },
      locales: [
        {
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
      vueI18n: {fallbackLocale: 'en',},
      seo: false,
      vuex: {
        // Module namespace
        moduleName: 'i18n',

        // Mutations config
        mutations: {
          // Mutation to commit to store current locale, set to false to disable
          setLocale: 'I18N_SET_LOCALE',//'I18N_SET_LOCALE',

          // Mutation to commit to store current message, set to false to disable
          setMessages: 'I18N_SET_MESSAGES'
        }
      },

    }]

  ],
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/i18n.js',
    '~/plugins/router.js',
    '~/plugins/filters.js'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#009b48' },
  /*
  ** Build configuration
  */

    generate : {
        dir : 'cordova/www'
    },
  router: {
      mode: 'hash',
      linkActiveClass: 'active-link',
      middleware: ['redirects']
  },
  build: {
        publicPath : '/nuxt/',
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  //module configs
  // proxy: {
  //   '/api': {
  //     target: process.env.API,
  //     // ws: true,
  //     changeOrigin: true
  //   }
  // },
  axios: {
    //proxy:true,
    // debug:true,
    // browserBaseURL:'/',
    baseURL:process.env.API
  // proxyHeaders: false
  },
  // auth: {
  //   strategies: {
  //       local: {
  //         endpoints: {
  //           login:false,
  //           logout: false,
  //           user: { url: '/api/v2013/authentication/user', method: 'get', propertyName: ''}
  //         },
  //         tokenRequired: true,
  //         // tokenType: 'Ticket'
  //       }
  //     },
  //   plugins: [
  //     '~/plugins/auth.js'
  //   ]
  // }
}
