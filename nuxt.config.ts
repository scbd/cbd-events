// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { version } from './package.json'

export default defineNuxtConfig({
  ssr: false,

  runtimeConfig: {
    public: {
      baseUrl: 'https://cbd-events.cbd.int',
      iframeHost: 'https://www.cbd.int',
      api: 'https://api.cbd.int',
      attachments: 'https://attachments.cbd.int',
      appVersion: version,
    },
  },

  app: {
    head: {
      title: 'CBD Events - UN Biodiversity Conference App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'CBD/UN Biodiversity Events Application. Information on CBD/UN Biodiversity conferences and related events is available to you at the touch of your finger. Access important information including agendas, descriptions, in-session documents and activity dates and times. You can create a custom schedule to help you manage your time while at the event or download documents to read on the go or offline.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: [
    '~/assets/app.scss',
    '~/assets/app.css',
    '@scbd/ckeditor5-build-inline-full/build/content-style.css',
  ],

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  i18n: {
    restructureDir: false,
    defaultLocale: 'en',
    detectBrowserLanguage: { cookieKey: 'localePref', useCookie: true },
    locales: [{ code: 'en', file: 'en.js', language: 'en-US' }],
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'app/locales',
    bundle: {
      compositionOnly: true,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api', 'color-functions', 'mixed-decls', 'abs-percent'],
        },
      },
    },
    build: {
      rollupOptions: {
        // @awesome-cordova-plugins/* are native-only (iOS/Android) — not bundled for web
        external: [/@awesome-cordova-plugins\/.*/],
      },
    },
  },

  nitro: {
    output: {
      publicDir: resolve(__dirname, 'capacitor/www'),
    },
  },

  devtools: { enabled: true },

  compatibilityDate: '2026-02-23',
})
