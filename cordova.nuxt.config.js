module.exports = {
    mode:'spa',
  /*
  ** Headers of the page
  */
  head: {
    meta: [
      { name: 'viewport', content: 'viewport', content: 'width=device-width, initial-scale=1, minimal-ui, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
    ],
    script: [
        { src : 'cordova.js'}
    ]
  },
  css: [
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
      seo: true,
      vuex: {
        // Module namespace
        moduleName: 'i18n',

        // Mutations config
        mutations: {
          // Mutation to commit to store current locale, set to false to disable
          setLocale: 'I18N_SET_LOCALE',

          // Mutation to commit to store current message, set to false to disable
          // setMessages: 'I18N_SET_MESSAGES'
        }
      },

    }]

  ],
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/i18n.js'
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
      mode: 'hash'
    // middleware: ['auth']
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
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      // ws: true,
      changeOrigin: true
    }
  },
  axios: {
    proxy:true,
    // debug:true,
    // browserBaseURL:'/',
    baseURL:'http://localhost:8000'
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
