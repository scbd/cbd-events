module.exports = {
      mode:'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'UN Biodiversity Events',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'UN Biodiversity Events Application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
    ]
  },
  css: [
    { src: '~assets/app.css' }
  ],
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
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
  router: {
      mode: 'hash',
      linkActiveClass: 'active-link'
    // middleware: ['auth']
  },
  build: {
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
