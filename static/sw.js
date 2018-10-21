importScripts('/_nuxt/workbox.5c678697.js')



workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/03577af37ffdc54c59b0.js",
    "revision": "8daa6cffbdd2f192d850b6cc6d65f988"
  },
  {
    "url": "/_nuxt/23b1ace2dd05dd1b1466.js",
    "revision": "dcca231712ef7e6bd6d79df292fe7c70"
  },
  {
    "url": "/_nuxt/2cf796ac4b1e144c1f10.js",
    "revision": "b2859255b33d83a664f8168d4c19f376"
  },
  {
    "url": "/_nuxt/303a91c3592a45e78de1.js",
    "revision": "f03b93eae7bc626f2278e43f89833941"
  },
  {
    "url": "/_nuxt/42bbe803e439dc0deda8.js",
    "revision": "4eab4259fa9dc53b523b2b5d973d9b96"
  },
  {
    "url": "/_nuxt/4759e56470d82f2a65ce.js",
    "revision": "538f194dd983f661f21f17ff821c6a6e"
  },
  {
    "url": "/_nuxt/4808ab83aa842fac9273.js",
    "revision": "edf59758b8a83ad5ab58b61e884b6809"
  },
  {
    "url": "/_nuxt/4faeb63ac6ca7a2635e6.js",
    "revision": "9593a6c128e98f0c9e41940349057b22"
  },
  {
    "url": "/_nuxt/62c2599c14a2cde2420a.js",
    "revision": "19672fdc3d6be765d4e89759a159c091"
  },
  {
    "url": "/_nuxt/8fd9f899ea2d192b6951.js",
    "revision": "b51792d2a0fa228053b2c33f889a36b5"
  },
  {
    "url": "/_nuxt/9e4191e9db0a545b6ce2.js",
    "revision": "76e46b2e755a2c1e00857cee1a4a3033"
  },
  {
    "url": "/_nuxt/a0bcf6a75e54bef2177a.js",
    "revision": "13e46dacc82726646db680f900957884"
  },
  {
    "url": "/_nuxt/ba174e83ef74ef17dc82.js",
    "revision": "211aaa8486a98268058c8010214f54d1"
  },
  {
    "url": "/_nuxt/c1b1b73414f6b2585e22.js",
    "revision": "c5d6f7c51575f22441b865b391271b98"
  },
  {
    "url": "/_nuxt/cf43dc9bffac749e12ae.js",
    "revision": "87d5e3b24aff43d777a805a176992c8a"
  },
  {
    "url": "/_nuxt/f26961d0d45436ba06c6.js",
    "revision": "46225344450651b9f3ab1a4770ce03ce"
  },
  {
    "url": "/_nuxt/f6ef925163d468249ce7.js",
    "revision": "61cf34a30a6aba31ed20d33e06a341c1"
  },
  {
    "url": "/_nuxt/ffb4aeb26c57d6341589.js",
    "revision": "01a1cf0b1ae9f72bde02d0be1df270ae"
  }
], {
  "cacheId": "cbd-events",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('https://attachments.cbd.int/*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/images/*'), workbox.strategies.cacheFirst({}), 'GET')





