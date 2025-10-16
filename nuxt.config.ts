// https://nuxt.com/docs/api/configuration/nuxt-config
import { version } from './package.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  
  // Enable SPA mode (equivalent to mode: 'spa' in Nuxt 2)
  ssr: false,

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      baseUrl: 'https://cbd-events.cbd.int',
      iframeHost: 'https://www.cbd.int',
      api: 'https://api.cbd.int',
      attachments: 'https://attachments.cbd.int',
      version: version,
      localforage: {
        name: 'cbd-events',
        version: 1.0,
        size: 4980736,
        storeName: 'files',
        description: 'Main file store',
        instances: [
          { name: 'cbd-events', version: 1.0, size: 4980736, storeName: 'blobs', description: 'file blobs' },
          { name: 'cbd-events', version: 1.0, size: 4980736, storeName: 'about', description: 'about articles' },
          { name: 'cbd-events', version: 1.0, size: 4980736, storeName: 'article', description: 'articles' }
        ]
      }
    }
  },

  app: {
    head: {
      title: 'CBD Events - UN Biodiversity Conference App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas, descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.' 
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: [
    '~/assets/app.scss',
    '~/assets/app.css',
    '@scbd/ckeditor5-build-inline-full/build/content-style.css'
  ],

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '~/utils/nuxt-modules/local-forage.ts'
  ],

  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: {
      cookieKey: 'localePref',
      useCookie: true
    },
    locales: [
      { code: 'en', file: 'en.js', language: 'en-US' }
    ],
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    vueI18n: './i18n.config.ts'
  },

  router: {
    options: {
      linkActiveClass: 'active-link'
    }
  },

  // Nitro config for static generation
  nitro: {
    output: {
      dir: 'capacitor/www',
      publicDir: 'capacitor/www'
    },
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  // Build configuration
  vite: {
    build: {
      target: 'es2015'
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['color-functions', 'mixed-decls', 'abs-percent']
        }
      }
    }
  },

  build: {
    transpile: [
      'camelcase-keys', 
      '@awesome-cordova-plugins/file-opener'
    ]
  },

  // Hooks for setting headers
  hooks: {
    'nitro:config': (nitroConfig) => {
      if (!nitroConfig.routeRules) {
        nitroConfig.routeRules = {}
      }
      nitroConfig.routeRules['/sw.js'] = {
        headers: {
          'Cache-Control': `public, max-age=${15 * 60}`
        }
      }
    }
  },

  devtools: { enabled: true }
})
