import  path from 'path'
const icons = require('./static/icons/icons.json')

let dotFile = '.env'

if (['local','dev','stg'].includes(process.env.NODE_ENV))
  dotFile = `${dotFile}.${process.env.NODE_ENV}`
else 
  process.env.NODE_ENV = 'production'
  
console.info(`##### Building for NODE_ENV: ${process.env.NODE_ENV}`)  
console.info(`##### Reading dotenv file: ${dotFile}`)

require('dotenv').config({path: path.resolve(process.cwd(), dotFile)})

module.exports = {
  env: {
    API: process.env.API,
    BASE_URL: process.env.BASE_URL,
    IFRAME_HOST: process.env.IFRAME_HOST,
    ATTACHMENTS: process.env.ATTACHMENTS,
    DOCS_API:process.env.DOCS_API
  },
  head: {
    title: 'UN Biodiversity Events',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'UN Biodiversity Events Application'
      },
      { name: 'nativeUI', content:true },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: '#00405c' }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico'
    }]
  },
  manifest: {
    name: 'UN Biodiversity Events',
    short_name: 'CBD Events',
    description: 'UN Biodiversity conference app supplying documents and schedules',
    theme_color: '#009b48',
    background_color:'#ffffff',
    display: 'standalone',
    background_color: '#ffffff',
    scope: '/cbd-events/',
    start_url:'/',
    dir:'rtl',
    lang: 'en-US'
  },
  css: [{
      src: 'normalize.css'
    },
    {
      src: '@scbd/ecosystem-style/layouts/base/build.min.css'
    },
    {
      src: '@scbd/ecosystem-style/layouts/container/build.min.css'
    },
    {
      src: '@scbd/ecosystem-style/elements/typography/headings/build.css'
    },
    {
      src: '@scbd/ecosystem-style/modifiers/helpers/build.min.css'
    },
    {
      src: '@scbd/ecosystem-style/modifiers/text/build.min.css'
    },
    {
      src: '@scbd/ecosystem-style/layouts/grid/build.min.css'
    },
    {
      src: '@scbd/ecosystem-style/modifiers/responsive/build.min.css'
    },
    {
      src: '~assets/app.css'
    },
  ],
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    ['@nuxtjs/pwa',{icon:false}], 
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
  loading: {
    color: '#009b48'
  },
  /*
   ** Build configuration
   */
  router: {
    linkActiveClass: 'active-link',
    middleware: ['redirects']
  },
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
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
    //    debug:true,
    browserBaseURL: '/',
    baseURL: process.env.API,
    proxy: true
    // proxyHeaders: false
  },
  workbox: {
      //dev:true,
      runtimeCaching: [
        {
          // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
          urlPattern: `${process.env.ATTACHMENTS}/*`,
          // Defaults to `networkFirst` if omitted
          handler: 'cacheFirst',
          // Defaults to `GET` if omitted
          method: 'GET',
          statuses: [0, 200]
        },
        {
          // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
          urlPattern: `/images/*`,
          // Defaults to `networkFirst` if omitted
          handler: 'cacheFirst',
          // Defaults to `GET` if omitted
          method: 'GET',
          statuses: [0, 200]
        }
    ]
  },
  render: {
    http2: {
      push: true
    },
    static: {
      maxAge: "1y",
      setHeaders(res, path) {
        if (path.includes("sw.js")) {
          res.setHeader("Cache-Control", `public, max-age=${15 * 60}`)
        }
      }
    }
  }
}