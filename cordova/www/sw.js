importScripts('/_nuxt/workbox.3ffff7b2.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/02a29766559f2ae5e336.js",
    "revision": "3c032f0cd56836d72903bfb238981d75"
  },
  {
    "url": "/_nuxt/0f4a7541997b04a7cdac.js",
    "revision": "3b18dfec2145a6c8116b319d1a4d4622"
  },
  {
    "url": "/_nuxt/17a4a64ce1a65ea50af6.js",
    "revision": "10665cfb70a593db8fd7a0cd83cacb07"
  },
  {
    "url": "/_nuxt/1915b76a8e910af63e1f.js",
    "revision": "30a9f3d4de63ac7d1cc5f4393720a1fd"
  },
  {
    "url": "/_nuxt/37a01dab3359e6ed156a.js",
    "revision": "7f6430fb1defd367f4cf6a1031535570"
  },
  {
    "url": "/_nuxt/63dfeb585ceb19d3483b.js",
    "revision": "d943d849512e22d90fc951240dbaab27"
  },
  {
    "url": "/_nuxt/7000e972649258aaa12d.js",
    "revision": "f25601a0791d9468e7806a94f465c6b3"
  },
  {
    "url": "/_nuxt/853d5a109ef90c31d0f9.js",
    "revision": "f79783e1f046862625864d1ff4ae6ff6"
  },
  {
    "url": "/_nuxt/c02099be5fe5ba433912.js",
    "revision": "f2b1c9566a5891eec08a1f22989addb3"
  },
  {
    "url": "/_nuxt/d928825811264883d786.js",
    "revision": "ee5381d530b588db1a325f4f98d8c0aa"
  },
  {
    "url": "/_nuxt/f4b8297d5bad98aa4130.js",
    "revision": "556cfbc89eecdae1c28827db83f0cb7b"
  }
], {
  "cacheId": "kronos-js",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')





