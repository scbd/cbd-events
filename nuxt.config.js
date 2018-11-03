import {iconsObj} from './static/icons/icons'
import {dotEnvReader,cordovaNuxtConfig} from './modules/appEnvironmentsManager'
import localforage from 'localforage'

dotEnvReader() // read env related vars and set them to nodejs.env

let config = {
  dev: (process.env.NODE_ENV !== 'production'),
  env: {
    API: process.env.API,
    BASE_URL: process.env.BASE_URL,
    IFRAME_HOST: process.env.IFRAME_HOST,
    ATTACHMENTS: process.env.ATTACHMENTS,
    DOCS_API:process.env.DOCS_API,
    PROXY_ENABLED:process.env.PROXY_ENABLED
  },
  head: {
    title: 'CBD Events - UN Biodiversity Confrence App',
    meta: [{charset: 'utf-8'},
      {name: 'viewport',  content: 'width=device-width, initial-scale=1'},
      {  hid: 'description', name: 'description',content: 'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas,  descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.'},
      { name: 'nativeUI', content:true },
      { name: 'apple-mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      {rel: 'icon',type: 'image/x-icon',href: 'favicon.ico'},
      {rel:'apple-touch-icon', sizes:'76x76',       href:"/icons/ios/ios-appicon-76-76.png"},
      {rel:'apple-touch-icon', sizes:'120x120',     href:"/icons/ios/ios-appicon-120-120.png"},     
      {rel:'apple-touch-icon', sizes:'152x152',     href:"/icons/ios/ios-appicon-152-152.png"},    
      {rel:'apple-touch-icon', sizes:'180x180',     href:"/icons/ios/ios-appicon-180-180.png"}, 
      {rel:'apple-touch-icon', sizes:'1024x1024',   href:"/icons/ios/ios-appicon-1024-1024.png"},     

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-default-p-768x1004.png', media: 'orientation: portrait'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-default-l-1004x768.png', media: 'orientation: landscape'},  
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-4-p-320x480.png', media: '(device-width: 320px) and (device-height: 480px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-4-l-480x320.png', media: '(device-width: 320px) and (device-height: 480px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'},      
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-5-p-640x960.png', media: '(device-width: 320px) and (device-height: 568px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-5-l-960x640.png', media: '(device-width: 320px) and (device-height: 568px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'},

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-5s-se-p-640x1136.png', media: '(device-width: 320px) and (device-height: 568px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-5s-se-l-1136x640.png', media: '(device-width: 320px) and (device-height: 568px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-678-p-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-678-l-1334x750.png', media: '(device-width: 375px) and (device-height: 667px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-678-plus-p-1242x2208.png', media: '(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-678-plus-l-2208x1242.png', media: '(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)'},
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-x-xs-p-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-x-xs-l-2436x1125.png', media: '(device-width: 375px) and (device-height: 812px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)'},        

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-xr-p-828x1792.png', media: '(device-width : 414px) and (device-height : 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-xr-l-1792-828.png', media: '(device-width : 414px) and (device-height : 896px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},    

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-xs-max-p-1142x2688.png', media: '(device-width : 414px) and (device-height : 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/iphone-xs-max-l-2688x1142.png', media: '(device-width : 414px) and (device-height : 896px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)'},       

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini-p-768x1024.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini-l-1024x768.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'}, 

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini-p-768x1024.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini-l-1024x768.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'}, 

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini@2-p-1536x2048.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-mini@2-l-2048x1536.png', media: '(device-width : 768px) and (device-height : 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-10inch-p-834x1112.png', media: '(device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-10inch-l-1112x834.png', media: '(device-width: 834px) and (device-height: 1112px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'},  

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-10inch@2-p-1668x2224.png', media: '(device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-10inch@2-l-2224x1668.png', media: '(device-width: 834px) and (device-height: 1112px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},  

      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-12inch-p-1024x1366.png', media: '(device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-12inch-l-1366x1024.png', media: '(device-width: 1024px) and (device-height: 1366px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)'},  
      
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-12inch@2-p-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)'},
      {rel: 'apple-touch-startup-image',href: '/icons/ios/splashscreens/ipad-pro-12inch@2-l-2732x2048.png', media: '(device-width: 1024px) and (device-height: 1366px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)'},             
                                 
    ]
  },
  manifest: {
    name: 'CBD Events - UN Biodiversity Confrence App',
    short_name: 'CBD Events',
    description: 'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas,  descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.',
    background_color:'#000000',
    display: 'standalone',
    // scope: '/',
    start_url:'/2018',
    dir:'rtl',
    lang: 'en-US',
    icons: iconsObj.icons
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
    '@nuxtjs/onesignal', 
    ['@nuxtjs/pwa',{icon:false}], 
    ['~/modules/nuxtModules/localForage.js', {
      name: 'cbd-events',
     // driver      : [localforage.WEBSQL,localforage.LOCALSTORAGE],
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'files', // Should be alphanumeric, with underscores.
      description: 'Main file store',
      instances:[{
        name: 'cbd-events',
       // driver      : [localforage.WEBSQL,localforage.LOCALSTORAGE],
        version: 1.0,
        size: 4980736, // Size of database, in bytes. WebSQL-only for now.
        storeName: 'blobs', // Should be alphanumeric, with underscores.
        description: 'file blobs'
      }]
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
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/
        // })
      }
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
  },
  cache: {
    max: 1000,
    maxAge: 900000
  },
  workbox: {
      dev: (process.env.NODE_ENV !== 'production'),
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
  oneSignal: {
    init: {
      cdn: true,
      appId: '4dee4bb3-4b08-4f8d-b942-431f8ac1cab2',
      allowLocalhostAsSecureOrigin: true,
      persistNotification:true
    }
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

config = cordovaNuxtConfig(config) // if cordova modify config
//config = cordovaAndroidNuxtConfig(config)// if android cordova modify config


module.exports = config