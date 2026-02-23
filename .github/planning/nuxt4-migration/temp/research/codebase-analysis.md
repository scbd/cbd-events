# CBD Events — Nuxt 4 / Vue 3 Migration: Codebase Analysis

> Generated: 2026-02-23 | READ-ONLY research — no files modified

---

## Table of Contents
1. [Current Dependencies](#1-current-dependencies)
2. [Nuxt Config](#2-nuxt-config)
3. [Vue 2 Patterns in Use](#3-vue-2-patterns-in-use)
4. [Vuex Store](#4-vuex-store)
5. [Plugins](#5-plugins)
6. [Composables](#6-composables)
7. [Middleware](#7-middleware)
8. [Modules](#8-modules)
9. [Components](#9-components)
10. [Layouts](#10-layouts)
11. [Pages](#11-pages)
12. [i18n](#12-i18n)
13. [CSS/Assets](#13-cssassets)
14. [Capacitor Integration](#14-capacitor-integration)
15. [Build System](#15-build-system)
16. [Migration Risk Summary](#16-migration-risk-summary)

---

## 1. Current Dependencies

### Root `package.json` (app v5.0.3)

#### Dependencies
| Package | Version | Migration Notes |
|---------|---------|----------------|
| `@awesome-cordova-plugins/core` | 6.9.0 | Keep — wraps Cordova plugin for file opening |
| `@awesome-cordova-plugins/file-opener` | 6.9.0 | Keep |
| `@capacitor/app` | 6.0.1 | Upgrade to 7.x (already 7.x in capacitor/) |
| `@capacitor/core` | 6.1.2 | Upgrade to 7.x |
| `@capacitor/device` | 6.0.1 | Upgrade to 7.x |
| `@capacitor/filesystem` | 6.0.1 | Upgrade to 7.x |
| `@capacitor/local-notifications` | 6.1.0 | Upgrade to 7.x |
| `@capacitor/share` | 6.0.2 | Upgrade to 7.x |
| `@capacitor/splash-screen` | 6.0.2 | Upgrade to 7.x |
| `@capacitor/status-bar` | 6.0.1 | Upgrade to 7.x |
| `@capgo/capacitor-updater` | 6.3.0 | Upgrade to 7.x |
| `@ionic-native/core` | 5.36.0 | **REMOVE** — replaced by `@awesome-cordova-plugins` or direct Capacitor |
| `@ionic-native/http` | 5.36.0 | **REPLACE** — used for native HTTP; needs Capacitor HTTP plugin or fetch |
| `@nuxtjs/axios` | 5.13.6 | **REMOVE** — Nuxt 4 uses `$fetch` / `useFetch` (built-in ofetch) |
| `@scbd/ckeditor5-build-inline-full` | 35.0.0 | Keep — only CSS imported |
| `@scbd/conference-cal` | 1.0.3 | **CHECK** Vue 3 compatibility |
| `bootstrap` | 4.6.2 | Upgrade to Bootstrap 5.x (no jQuery dep) |
| `camelcase-keys` | 9.1.3 | Keep (ESM, no issues) |
| `localforage` | 1.10.0 | Keep — framework agnostic |
| `lodash.debounce` | 4.0.8 | Keep |
| `luxon` | 3.5.0 | Keep |
| `nuxt` | 2.18.1 | **REPLACE** → Nuxt 4 (currently `nuxt@^4.x`) |
| `nuxt-i18n` | 6.28.1 | **REPLACE** → `@nuxtjs/i18n` v9+ (Vue 3 / Nuxt 3+ compatible) |
| `object-sizeof` | 2.6.5 | Keep |
| `semver` | 7.6.3 | Keep |
| `sweetalert2` | 11.14.1 | Keep — framework agnostic |
| `velocity-animate` | 1.5.2 | **CHECK** — may need replacement; used minimally |
| `vue` | 2.7.16 | **REPLACE** → Vue 3.x |
| `vue-cordova` | 0.1.2 | **REMOVE** — legacy Cordova bridge; replace with direct Capacitor API |
| `vue-notifications` | 1.0.2 | **REMOVE** — replaced by sweetalert2 already |
| `vue-server-renderer` | 2.7.16 | **REMOVE** — not needed (SPA, and Vue 3 has different SSR) |
| `vue-template-compiler` | 2.7.16 | **REMOVE** — not needed in Vue 3 |

#### devDependencies
| Package | Version | Migration Notes |
|---------|---------|----------------|
| `babel-eslint` | 10.1.0 | **REPLACE** → `@typescript-eslint/parser` or `eslint` + flat config |
| `eslint` | 7.32.0 | Upgrade to 9.x with flat config |
| `eslint-friendly-formatter` | 4.0.1 | Remove (unused in Nuxt 4) |
| `eslint-plugin-vue` | 7.20.0 | Upgrade to 9.x+ (Vue 3 rules) |
| `replace` | 1.2.2 | Keep |
| `sass` | 1.79.4 | Keep |
| `sass-loader` | 10.5.2 | **REMOVE** — Nuxt 4 uses Vite (built-in sass support) |

### `capacitor/package.json` (Capacitor wrapper v5.0.0)

| Package | Version | Notes |
|---------|---------|-------|
| `@capacitor/android` | 7.4.3 | Already on 7.x ✅ |
| `@capacitor/core` | 7.4.3 | Already on 7.x ✅ |
| `@capacitor/ios` | 7.4.3 | Already on 7.x ✅ |
| All `@capacitor/*` plugins | 7.4.3 | Already on 7.x ✅ |
| `@capgo/capacitor-updater` | 7.4.3 | Already on 7.x ✅ |
| `@ionic-native/http` | 5.36.0 | **REPLACE** with Capacitor HTTP or fetch |
| `cordova-plugin-advanced-http` | 3.3.1 | **REPLACE** — backs `@ionic-native/http` |
| `cordova-plugin-file` | 8.1.0 | May still be needed by file-opener2 |
| `cordova-plugin-file-opener2` | (GitHub commit) | **KEEP** — specific commit for Android compliance |
| `@capacitor/cli` | 7.4.3 | ✅ |
| `jetifier` | 2.0.0 | Keep for Android compat |

> **NOTE**: Root package.json has Capacitor 6.x, but capacitor/ has 7.x — these are **mismatched** and should be unified to 7.x.

---

## 2. Nuxt Config

**File**: `nuxt.config.js`

### Key Settings
```js
ssr: false          // SPA mode — Nuxt 4 equivalent: `ssr: false` in nuxt.config.ts
generate: { dir: 'capacitor/www' }  // Static output for Capacitor
router: { linkActiveClass: 'active-link', middleware: ['redirects'] }
```

### Environment Variables
```js
env: {
  NUXT_ENV_BASE_URL:    'https://cbd-events.cbd.int',
  NUXT_ENV_IFRAME_HOST: 'https://www.cbd.int',
  NUXT_ENV_API:         'https://api.cbd.int',
  NUXT_ENV_ATTACHMENTS: 'https://attachments.cbd.int',
  NUXT_ENV_VERSION:     version  // from package.json
}
```
→ In Nuxt 4: use `runtimeConfig.public.*` instead of `process.env.NUXT_ENV_*`

### Modules
1. **`nuxt-i18n`** (v6) — configured inline with lazy loading, `prefix_except_default` strategy
2. **`~/modules/nuxtModules/localForage.js`** — custom module that injects localForage plugin with template serialization

### Plugins (order matters!)
1. `~/plugins/cordova.js` — **MUST be first** (unshifted via `config.plugins.unshift()`)
2. `~/plugins/icons/index.js`
3. `~/plugins/router.js`
4. `~/plugins/filters.js`
5. `~/plugins/vue-notifications`

### Build Configuration
```js
build: {
  transpile: ['camelcase-keys', '@awesome-cordova-plugins/file-opener', 'consola'],
  loaders: {
    scss: {
      sassOptions: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'mixed-decls', 'abs-percent']
      }
    }
  }
}
```

### Migration Notes
- **`module.exports =`** → must become `export default defineNuxtConfig({})` 
- **`generate.dir`** → In Nuxt 4: configure via `nitro: { output: { dir: 'capacitor/www' } }` or `app: { baseURL: '/' }`
- **Custom module (localForage)** uses Nuxt 2's `this.addPlugin()` with template serialization (`<%= serialize(options) %>`) — must be rewritten as a Nuxt 4 module
- **`config.plugins.unshift()`** pattern — Nuxt 4 plugins have explicit `order` or `enforce` options

**Risk**: 🔴 HIGH — config is the foundation; many patterns need complete rewrite

---

## 3. Vue 2 Patterns in Use

### 3.1 `this.$` Instance Property Usage (191 matches total)

| Pattern | Count | Files | Migration Path |
|---------|-------|-------|----------------|
| `this.$store` | ~45 | 15+ files | → Pinia composable `useStore()` or `useState()` |
| `this.$router` | ~15 | 10 files | → `useRouter()` composable |
| `this.$route` | ~8 | 6 files | → `useRoute()` composable |
| `this.$localForage` | ~8 | 3 store files | → Custom composable or plugin `useLocalForage()` |
| `this.$axios` | ~6 | 4 files | → `$fetch` / `useFetch()` |
| `this.$i18n` | ~15 | 8 files | → `useI18n()` composable |
| `this.$root.$on/$off/$emit` | ~20 | 10 files | → `mitt` event emitter or provide/inject |
| `this.$refs` | ~12 | 5 files | → `useTemplateRef()` or keep (still works) |
| `this.$swal` | ~4 | 3 files | → Direct import or `useNuxtApp().$swal` |
| `this.$nuxt.$loading` | ~5 | 1 file (mixin) | → Nuxt 4 `useLoadingIndicator()` |
| `this.$cordova` | ~4 | 2 files | → Direct Capacitor imports |
| `this.$filters` | ~3 | 2 files | → Direct function imports (filters removed in Vue 3) |
| `this.$forceUpdate` | ~2 | 1 file | → Refactor reactivity (should not be needed) |
| `this.$options.filters` | ~2 | 1 file | → Direct function imports |
| `this.$localePath` | injected | many templates | → `useLocalePath()` from `@nuxtjs/i18n` |
| `this.$t` | ~10 | 6 files | → `useI18n().t()` or `$t` in templates (still works) |

### 3.2 `asyncData` Usage (11 page/component files)

Files using `asyncData`:
- `pages/_conferenceCode/index.vue`
- `pages/_conferenceCode/about.vue`
- `pages/_conferenceCode/overview.vue`
- `pages/_conferenceCode/conferences.vue`
- `pages/_conferenceCode/fileView.vue`
- `pages/_conferenceCode/languages.vue`
- `pages/_conferenceCode/article/_tag.vue`
- `pages/_conferenceCode/_meetingCode/agenda.vue`
- `pages/_conferenceCode/_meetingCode/calendar.vue`
- `pages/_conferenceCode/_meetingCode/documents.vue`
- `pages/_conferenceCode/_meetingCode/downloads.vue`
- `pages/_conferenceCode/_meetingCode/meetings.vue`
- `pages/_conferenceCode/_meetingCode/WeekSelect.vue`
- `components/article.vue` (component using asyncData — unusual!)

→ In Nuxt 4: replace with `useAsyncData()` or `useFetch()` composables in `<script setup>`

### 3.3 Vue.filter / Vue.directive / Vue.mixin / Vue.use

```js
// plugins/filters.js
Vue.filter(key, globalFilter[key])       // Vue.filter() REMOVED in Vue 3
Vue.prototype.$filters = Vue.options.filters  // Vue.prototype REMOVED

// plugins/cordova.js
Vue.use(VueCordova)  // Vue.use() → app.use() in Vue 3

// plugins/icons/index.js
Vue.component('Icons', Icons)  // Vue.component() → app.component()
Vue.component('Icon', Icon)

// components/Calendar/src/modules/CalWeeksService.js
Vue.set(this, 'iterations', [])   // Vue.set() REMOVED in Vue 3
Vue.nextTick(() => ...)           // → nextTick() import from 'vue'

// components/Calendar/src/modules/Bus.js
const events = new Vue()  // Event bus pattern REMOVED in Vue 3
```

### 3.4 `$set`, `$delete`, `$on`, `$off`, `$once`, `$children`, `$parent`, `$listeners`

| Pattern | Count | Files |
|---------|-------|-------|
| `this.$set()` | 1 | `CalFilter.vue` |
| `Vue.set()` | 1 | `CalWeeksService.js` |
| `this.$root.$on()` | ~10 | 7 files (event bus pattern) |
| `this.$root.$off()` | ~7 | 7 files |
| `this.$root.$emit()` | ~5 | 4 files |
| `EventsBus.$on()` | 2 | `CalBody.vue` |
| `this.$children` | 1 | `CalBody.vue` — `this.$children[0].$refs` |
| `$listeners` | 0 | None found |
| `$parent` | 0 | None found |

**Event Bus Pattern** (CRITICAL — removed in Vue 3):
The app uses `this.$root` as an event bus extensively for communication between bottom-screen pages and headers:
```js
// Pattern used in 7+ files:
this.$root.$on('bottom-screen-done', this.done)     // mounted
this.$root.$off('bottom-screen-done')                // beforeDestroy
this.$root.$emit('bottom-screen-done', { ... })      // trigger
```
Also a dedicated event bus in Calendar:
```js
// components/Calendar/src/modules/Bus.js
import Vue from 'vue'
const events = new Vue()  // ← BREAKS in Vue 3
export default events
```

→ **Must replace with `mitt` or `tiny-emitter` or `provide/inject` pattern**

### 3.5 `.sync` Modifier / Slot Syntax / Functional Components

| Pattern | Found | Notes |
|---------|-------|-------|
| `.sync` modifier | 0 | Not used ✅ |
| `slot-scope` | 0 | Not used ✅ |
| `functional: true` | 0 | Not used ✅ |
| `render(h)` / `createElement` | 0 | Not used ✅ |
| `v-slot` | 0 | No named slots used |

### 3.6 `nuxt-link` with `tag` prop (removed in Vue Router 4)

```vue
<!-- components/navigation/index.vue — 5 occurrences -->
<nuxt-link tag="li" class="nav-item" :to="...">
```
→ In Vue Router 4 / Nuxt 4: use `<NuxtLink>` with custom rendering via `v-slot` or wrap in `<li>`

### 3.7 `process.server` / `process.client` Usage (6 occurrences)

Found in: `documentDownloadMixin.js`, `header.vue`, `default.vue`, `CalEventDetails.vue`
→ In Nuxt 4: use `import.meta.server` / `import.meta.client` (though since SPA, mostly moot)

### 3.8 Template Filter Usage

```vue
<!-- Vue 2 filter syntax (REMOVED in Vue 3) -->
{{ conference.title | lstring }}    <!-- in header.vue, index.vue -->
{{ file.baseName | trimName }}      <!-- in downloads.vue -->
{{ file.lastModified | timeDisplay }}
{{ file.size | formatBytes }}
{{ meeting.title | lstring }}
```
→ Must convert all `{{ value | filter }}` to `{{ filter(value) }}` or computed properties

**Files with template filters**: `header.vue`, `pages/_conferenceCode/index.vue`, `downloads.vue`, `meetings.vue`, `WeekSelect.vue`, `article.vue`

### 3.9 Options API `filters` Property

```js
// pages/_conferenceCode/_meetingCode/downloads.vue
filters: { trimName, timeDisplay, formatBytes, lstring }
```
→ Remove `filters` option; import and call functions directly

**Risk**: 🔴 HIGH — Pervasive Vue 2 patterns throughout; every component needs updating

---

## 4. Vuex Store

### Store Files (7 files)

| File | State Props | Mutations | Actions | Getters | Complexity |
|------|-------------|-----------|---------|---------|------------|
| `store/index.js` | 0 | 0 | 0 | 0 | Minimal (root, strict:false) |
| `store/conferences.js` | 4 (docs, selected, selectedMeeting, meetings) | 5 | 2 | 12 | **HIGH** — 326 lines, complex API queries |
| `store/files.js` | 3 (data, downloading, fileToOpen) | 6 | 4 | 5 | **MEDIUM** — localForage integration |
| `store/about.js` | 1 (docs) | 1 | 4 | 0 | MEDIUM — API + localForage caching |
| `store/article.js` | 1 (docs) | 1 | 4 | 0 | MEDIUM — API + localForage caching |
| `store/offLine.js` | 2 (isOffLine, isOnLine) | 2 | 0 | 2 | LOW |
| `store/routes.js` | 5 (route, prevRoute, initialized, showMeetingNav, showNavs) | 6 | 0 | 2 | LOW |

### Critical Vuex Patterns

1. **`this.$router` in actions** — Store actions use `this.$router.currentRoute.params` (Nuxt 2 injects router into Vuex context):
```js
// store/conferences.js
async function getConferences({ state, dispatch, commit, rootState }){
  const { conferenceCode } = this.$router.currentRoute.params  // ← Nuxt 2 specific
}
```

2. **`this.$localForage` in actions** — Store actions directly access injected localForage:
```js
// store/files.js
await this.$localForage.files.iterate((value) => { data.push(value) })
```

3. **`this.$axios` in actions** — Store actions use injected axios:
```js
// store/conferences.js
const response = await queryConferences(this.$axios, rootState.i18n)
```

4. **`rootState.i18n`** — Accesses i18n module state from Vuex:
```js
rootState.i18n.locale  // nuxt-i18n syncs to Vuex
```

5. **`mapGetters` usage** — 5 components use `mapGetters`:
   - `navigation/index.vue`
   - `pages/_conferenceCode/index.vue`
   - `pages/_conferenceCode/_meetingCode/agenda.vue`
   - `pages/_conferenceCode/_meetingCode/downloads.vue`
   - `pages/_conferenceCode/_meetingCode/calendar.vue`

### Migration Path: Vuex → Pinia

Each store module becomes a Pinia store with `defineStore()`. Key challenges:
- `this.$router`, `this.$axios`, `this.$localForage` in actions must be passed as params or accessed via `useRouter()`, `useFetch()`, `useNuxtApp()` inside setup-style stores
- `rootState.i18n` → `useI18n()` inside store
- `mapGetters` → `storeToRefs()` from Pinia
- Mutations are removed in Pinia; just modify state directly in actions

**Risk**: 🔴 HIGH — Stores are deeply coupled to Nuxt 2 injections

---

## 5. Plugins

### Plugin Analysis

#### 1. `plugins/cordova.js` — **MUST LOAD FIRST**
```js
import Vue from 'vue'
import VueCordova from 'vue-cordova'

Vue.use(VueCordova)           // ← Vue.use removed
inject('localePath', localePath)  // ← Nuxt inject pattern
inject('cordova', Vue.cordova)    // ← injects $cordova
```
**Migration**: Rewrite as Nuxt 4 plugin using `defineNuxtPlugin()`. Remove `vue-cordova` dependency; use Capacitor APIs directly. The `localePath` injection is now provided by `@nuxtjs/i18n` v9+.

#### 2. `plugins/icons/index.js`
```js
Vue.component('Icons', Icons)
Vue.component('Icon', Icon)
```
**Migration**: Use `defineNuxtPlugin()` with `nuxtApp.vueApp.component()` or auto-import via `components/` directory.

#### 3. `plugins/router.js`
```js
app.router.afterEach((to) => {
  store.commit('routes/SET_ROUTE', route)
})
```
**Migration**: Use Nuxt 4's route middleware or `useRouter().afterEach()` in a plugin.

#### 4. `plugins/filters.js`
```js
Vue.filter(key, globalFilter[key])           // REMOVED in Vue 3
Vue.prototype.$filters = Vue.options.filters  // REMOVED
```
**Exports**: `timeDisplay`, `lstring`, `trimName`, `formatBytes`, `globalFilter`
**Migration**: Export as plain functions. Use `app.config.globalProperties.$filters` or better, direct imports.

#### 5. `plugins/vue-notifications.js`
```js
import swal from 'sweetalert2'
inject('swal', swal)
```
**Migration**: Simple — rewrite with `defineNuxtPlugin()` + `provide()`.

#### 6. `plugins/localForage.js` (generated by nuxt module)
```js
import Vue from 'vue'
const OPTS = <%= serialize(options) %>  // ← Nuxt 2 template syntax

function createVueIntance(options){
  let lf = localForage.createInstance(options)
  return new Vue({        // ← Creates Vue instance as localForage wrapper!
    name: options.storeName,
    methods: { getItem, setItem, removeItem, clear, length, key, keys, iterate, ... }
  })
}
```
**CRITICAL**: Each localForage store is wrapped in a **Vue 2 instance**. This pattern is completely incompatible with Vue 3.

**Migration**: Rewrite as a plain class or composable wrapping localForage directly (no Vue instance needed). The Vue instance wrapper adds no value.

**Risk**: 🔴 HIGH — 4 plugins need complete rewrites; localForage plugin architecture is deeply Vue 2

---

## 6. Composables

### Already Existing Composables (4 files)

#### `composables/http.js`
```js
import { Capacitor } from '@capacitor/core'
import axios from 'axios'
import { HTTP } from '@ionic-native/http'

export const http = (restParams, $axios = axios) => {
    if(Capacitor.getPlatform() === 'web') return webVersion(restParams, $axios)
    return nativeVersion(restParams)
}
```
**Status**: Mostly framework-agnostic ✅. Replace `$axios` with `$fetch` or `ofetch`. `@ionic-native/http` needs replacement (Capacitor HTTP plugin or keep cordova-plugin-advanced-http).

#### `composables/over-the-air.js`
```js
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { HTTP } from '@ionic-native/http'
```
**Status**: Framework-agnostic ✅. Only depends on Capacitor and `@ionic-native/http`.

#### `composables/query-filter.js`
```js
export default (queryObj = {}) => {
    const query = {}
    for (const key in queryObj)
        query[key] = JSON.stringify(queryObj[key])
    return query
}
```
**Status**: Pure utility function ✅. No changes needed.

#### `composables/file-system.js`
```js
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
```
**Status**: Framework-agnostic ✅. No changes needed.

**Risk**: 🟢 LOW — Composables are already mostly framework-agnostic

---

## 7. Middleware

### `middleware/redirects.js`
```js
export default async function ({ route, redirect, store }){
  const hasRouteParams = Object.keys(route.params).length
  const isConferenceLoaded = store.state.conferences.selected

  if(!isConferenceLoaded) 
    await store.dispatch('conferences/get')
  
  await loadAbout(store)
  store.dispatch('conferences/get')

  const { code } = store.state.conferences.selected
  const isAppFirstLoad = !hasRouteParams && code

  if(isAppFirstLoad) redirect(`/${code}`)
}
```

**Migration**: Rewrite with `defineNuxtRouteMiddleware()`. Replace `store` with Pinia stores. Replace `redirect()` with `navigateTo()`.

**Risk**: 🟡 MEDIUM — Simple logic but depends on Vuex store

---

## 8. Modules

### 8.1 `modules/nuxtModules/localForage.js`
```js
const { resolve } = require('path')
module.exports = function module(moduleOptions){
  this.addPlugin({
    src: resolve(__dirname, './../../plugins/localForage.js'),
    ssr: false,
    fileName: 'localForage.js',
    options
  })
}
```
**Migration**: Rewrite as `defineNuxtModule()`. The `<%= serialize(options) %>` template pattern is not available in Nuxt 4. Pass options through `runtimeConfig` or module state.

### 8.2 `modules/documentDownloadMixin.js` — **Mixin** (HIGH complexity)
```js
export default {
  methods: { saveFiles, getFileName, createFileObj, closeDialog, getFileObjs },
  mounted,
  created,
  beforeDestroy
}
```
Used by: `pages/_conferenceCode/_meetingCode/agenda.vue`, `pages/_conferenceCode/_meetingCode/documents.vue`

**Vue 2 APIs used inside**:
- `this.$refs.docsFrame`
- `this.$store.dispatch/commit`  
- `this.$nuxt.$loading.start/finish`
- `this.$route.params`
- `process.client`, `process.server`
- `window.addEventListener('message', ...)`

**Migration**: Convert to a **composable** (`useDocumentDownload`). This is the most complex mixin in the codebase.

### 8.3 `modules/CoverImageMixin.js` — **Mixin**
```js
export default {
  computed: { conference, getHeroImage, getImage, title }
}
```
Uses: `this.$store.state.conferences.selected`, `this.$filters.lstring`

**Migration**: Convert to composable.

### 8.4 `modules/apiNormalize.js`
Pure utility functions: `normalizeApiResponse`, `normalizeSolrResponse`, `toCamelCase`, etc.
**Status**: Framework-agnostic ✅.

### 8.5 `modules/CordovaFiles.js`
Uses: `FileOpener`, `writeFile` from composable, `Share` from Capacitor.
**Status**: Mostly framework-agnostic ✅. No Vue imports.

### 8.6 `modules/Device.js`
Pure utility class with static methods.
**Status**: Framework-agnostic ✅.

### 8.7 `modules/MimeTypes.js`
Pure utility functions.
**Status**: Framework-agnostic ✅.

### 8.8 `modules/localFileSystem.js`
Legacy Cordova file system wrapper (largely replaced by Capacitor Filesystem).
**Status**: Framework-agnostic ✅.

### 8.9 `modules/appEnvironmentsManager.js`
Build-time configuration (dotenv, env detection). Uses `require('path')`, `require('dotenv')`.
**Status**: Mostly commented out in nuxt.config.js. May be removable.

**Risk**: 🔴 HIGH for mixins (documentDownloadMixin, CoverImageMixin); 🟢 LOW for utilities

---

## 9. Components

### Total .vue Files: **42**

### Breakdown by Location
| Location | Count | Notes |
|----------|-------|-------|
| `pages/` | 14 | Including nested routes |
| `components/Calendar/` | 14 | Complex calendar widget |
| `components/` (top-level) | 5 | article, Loading, Offline, Spinner |
| `components/header/` | 3 | header, header-bottom-screen, SideMenu |
| `components/navigation/` | 1 | Bottom nav bar |
| `layouts/` | 2 | default, bottom-screen |
| `plugins/icons/` | 2 | Icon, Icons |

### Options API Usage (ALL components use Options API)

Every single `.vue` file uses Options API with `export default { ... }`. Patterns found:

| Pattern | Occurrences | Notes |
|---------|-------------|-------|
| `data()` | ~15 | Function-style data (correct for Vue 2) |
| `methods: {}` | ~18 | Most components |
| `computed: {}` | ~12 | Including `mapGetters` spread |
| `mounted` | ~15 | Lifecycle hook |
| `created` | ~4 | |
| `beforeMount` | ~3 | |
| `beforeDestroy` | ~10 | → renamed to `beforeUnmount` in Vue 3 |
| `asyncData` | ~13 | Nuxt 2 specific |
| `mixins: []` | 2 | agenda.vue, documents.vue |
| `filters: {}` | 1 | downloads.vue |
| `layout: 'bottom-screen'` | 4 | Page-level layout property |
| `props` | ~5 | |
| `watch` | ~2 | Calendar components |

### `$refs` Usage
- `this.$refs.docsFrame` — iframe reference (documentDownloadMixin, agenda, documents)
- `this.$refs.article` — DOM query for oembed processing (article.vue)
- `this.$refs.eventCalTitle` — style manipulation (CalEvent.vue)
- `this.$refs.day` — scroll to element (CalWeekRow.vue)
- `this.$refs.main` — Calendar root (Calendar index.vue)

### `$children` Usage (REMOVED in Vue 3)
```js
// components/Calendar/src/components/body/CalBody.vue
for (const ref in this.$children[0].$refs)
    this.$children[0].$refs[ref].style.display='block'
```
→ Must refactor to use template refs or provide/inject

### UI Component Libraries
- **Bootstrap 4** — via `@import "bootstrap/scss/bootstrap"` in `app.scss`
- **No Vue component library** (no Vuetify, BootstrapVue, etc.) — just raw Bootstrap CSS classes
- **Custom Icon system** — `plugins/icons/Icon.vue` and `Icons.vue` (SVG sprite sheets)
- **`@scbd/conference-cal`** — external Vue component (needs Vue 3 compat check)

### `nuxt-link` with `tag` prop (5 occurrences)
```vue
<nuxt-link tag="li" ...>  <!-- REMOVED in Vue Router 4 -->
```
All in `components/navigation/index.vue`.

### `<nuxt />` component
Used in both layouts:
```vue
<nuxt />  <!-- → <NuxtPage /> in Nuxt 4 -->
```

**Risk**: 🔴 HIGH — All 42 components need Options API → Composition API conversion; Calendar widget (14 files) is the most complex subsystem

---

## 10. Layouts

### `layouts/default.vue`
- Components: Header, Nav, Loading (lazy)
- Lifecycle: `beforeMount`, `mounted`
- Uses: `this.$store.commit`, `Capacitor`, `StatusBar`, `updateOTA`
- Event listeners: `window.online/offline` → `offLine/TOGGLE` store commit
- OTA update on mount (native only)
- Template: `<nuxt />` → `<NuxtPage />`

### `layouts/bottom-screen.vue`
- Simple wrapper with `<nuxt />` and transition
- Used by: conferences, languages, fileView, meetings, WeekSelect
- Template: `<nuxt />` → `<NuxtPage />`

**Migration Notes**:
- Replace `<nuxt />` with `<slot />` (Nuxt 4 layouts use slots)
- `layout: 'bottom-screen'` in pages → `definePageMeta({ layout: 'bottom-screen' })`

**Risk**: 🟡 MEDIUM — Straightforward template changes, some store refs

---

## 11. Pages

### Route Structure

```
/                                    → pages/index.vue (redirect only)
/:conferenceCode                     → pages/_conferenceCode/index.vue
/:conferenceCode/about               → pages/_conferenceCode/about.vue
/:conferenceCode/overview            → pages/_conferenceCode/overview.vue
/:conferenceCode/conferences         → pages/_conferenceCode/conferences.vue
/:conferenceCode/languages           → pages/_conferenceCode/languages.vue
/:conferenceCode/fileView            → pages/_conferenceCode/fileView.vue
/:conferenceCode/article/:tag        → pages/_conferenceCode/article/_tag.vue
/:conferenceCode/:meetingCode/agenda → pages/_conferenceCode/_meetingCode/agenda.vue
/:conferenceCode/:meetingCode/calendar    → .../_meetingCode/calendar.vue
/:conferenceCode/:meetingCode/documents   → .../_meetingCode/documents.vue
/:conferenceCode/:meetingCode/downloads   → .../_meetingCode/downloads.vue
/:conferenceCode/:meetingCode/meetings    → .../_meetingCode/meetings.vue
/:conferenceCode/:meetingCode/WeekSelect  → .../_meetingCode/WeekSelect.vue
/offline                             → pages/offline.vue
```

### Nuxt 4 Directory Rename
```
_conferenceCode/  → [conferenceCode]/
_meetingCode/     → [meetingCode]/
_tag.vue          → [tag].vue
```

### `asyncData` Usage

ALL pages except `index.vue` and `offline.vue` use `asyncData`. Examples:

```js
// Typical pattern: destructure { store, params } from context
async function asyncData({ store, params }){
  const { conferenceCode } = params
  await store.dispatch('about/get', { code: conferenceCode })
  store.commit('routes/SET_SHOW_MEETING_NAV', false)
  return { conferenceCode, ... }
}
```

→ In Nuxt 4: use `useAsyncData()` in `<script setup>` or `useFetch()`:
```js
const route = useRoute()
const store = useConferencesStore()
const { data } = await useAsyncData(() => store.get(route.params.conferenceCode))
```

### `head()` Usage
**None found** — head is set only in `nuxt.config.js` globally.

### `fetch()` Usage  
**None found** — only `asyncData` is used.

### `layout` Property
4 pages use `layout: 'bottom-screen'`:
- `conferences.vue`
- `languages.vue`  
- `fileView.vue`
- `meetings.vue`
- `WeekSelect.vue`

→ In Nuxt 4: `definePageMeta({ layout: 'bottom-screen' })`

**Risk**: 🔴 HIGH — 13 pages need asyncData migration; route directory renaming; all Options API

---

## 12. i18n

### Current Configuration (in `nuxt.config.js`)
```js
['nuxt-i18n', {
  defaultLocale: 'en',
  detectBrowserLanguage: { cookieKey: 'localePref', useCookie: true },
  locales: [{ code: 'en', file: 'en.js', iso: 'en-US' }],
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: 'locales/',
  vueI18n: { fallbackLocale: 'en' },
  seo: false
}]
```

### Locale File: `locales/en.js`
```js
export default () => new Promise(((resolve) => {
  resolve({
    info: 'Information',
    docs: 'Documents',
    cal: 'Calendar',
    // ... ~30 translation keys
  })
}))
```
→ Only **English** locale defined. Simple flat key structure.

### i18n Usage Patterns
| Pattern | Count | Migration |
|---------|-------|-----------|
| `this.$i18n.t('key')` | ~15 | → `const { t } = useI18n()` |
| `this.$i18n.locale` | ~5 | → `const { locale } = useI18n()` |
| `this.$t('key')` (template) | ~10 | → `$t('key')` (still works in templates) |
| `app.i18n.t()` in asyncData | ~3 | → `useI18n()` |
| `app.i18n.locales` | 1 | → `useI18n()` |
| `localePath()` in templates | Many | → `useLocalePath()` or `localePath()` (auto-imported) |
| `switchLocalePath()` | 1 | → `useSwitchLocalePath()` |
| `store.state.i18n.locale` | ~3 | → `useI18n().locale` |
| `store.commit('i18n/I18N_SET_LOCALE')` | 1 | → `setLocale()` from `useI18n()` |
| `rootState.i18n` in store | ~2 | → Pass locale as parameter |

### Calendar Component i18n
The Calendar component injects its own locale messages in `beforeCreate`:
```js
function beforeCreate(){
  for (const locale in messages){
    const msgs = $i18n.getLocaleMessage(locale);
    $i18n.setLocaleMessage(locale, Object.assign(msgs, messages[locale]));
  }
}
```
Has its own locale files in `components/Calendar/src/locales/`.

**Migration**: Replace `nuxt-i18n` v6 with `@nuxtjs/i18n` v9+. Most template patterns (`$t`, `localePath`) still work. Script patterns need composable conversion.

**Risk**: 🟡 MEDIUM — Simple config; single language; composable migration straightforward

---

## 13. CSS/Assets

### `assets/app.scss`
```scss
@import "bootstrap/scss/bootstrap";
```
→ Imports **ALL of Bootstrap 4**. Consider upgrading to Bootstrap 5 and importing only needed parts.

### `assets/app.css`
Custom CSS (~100 lines): transitions, animations, layout utilities, typography.
→ Framework-agnostic ✅. No changes needed.

### CKEditor CSS
```js
css: [{ src: '@scbd/ckeditor5-build-inline-full/build/content-style.css' }]
```
→ Keep as-is.

### SCSS Configuration
```js
build: {
  loaders: {
    scss: {
      sassOptions: {
        api: 'modern-compiler',
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'mixed-decls', 'abs-percent']
      }
    }
  }
}
```
→ Nuxt 4 (Vite): configure via `vite.css.preprocessorOptions.scss`.

### Scoped Styles
Most components use `<style scoped>`. A few have unscoped `<style>` for global CSS overrides (agenda labels, article typography).

**Risk**: 🟢 LOW — CSS is mostly framework-agnostic; Bootstrap upgrade is optional

---

## 14. Capacitor Integration

### `capacitor/capacitor.config.json`
```json
{
  "appId": "io.cbd.unbioevents",
  "appName": "CBD Events",
  "webDir": "www",
  "bundledWebRuntime": false,
  "loggingBehavior": "production",
  "backgroundColor": "000000",
  "server": { "cleartext": true },
  "android": { "webContentsDebuggingEnabled": false },
  "ios": { "contentInset": "always" },
  "plugins": {
    "CapacitorUpdater": { "autoUpdate": false, "statsUrl": "" }
  }
}
```

### Version Mismatch
- **Root `package.json`**: Capacitor 6.x plugins
- **`capacitor/package.json`**: Capacitor 7.x plugins
→ Must unify to 7.x across both package.json files

### Capacitor Plugins Used
| Plugin | Usage Location |
|--------|---------------|
| `@capacitor/core` (Capacitor.getPlatform) | http.js, cordova.js, default.vue |
| `@capacitor/filesystem` | file-system.js |
| `@capacitor/share` | CordovaFiles.js |
| `@capacitor/status-bar` | default.vue |
| `@capacitor/splash-screen` | (configured, not seen in code) |
| `@capgo/capacitor-updater` | over-the-air.js |
| `@awesome-cordova-plugins/file-opener` | CordovaFiles.js |
| `@ionic-native/http` (HTTP) | http.js, over-the-air.js |

### Native HTTP Strategy
The dual HTTP strategy (axios for web, `@ionic-native/http` for native) works around CORS/SSL issues on native platforms. This is a critical architecture decision:
- **Option A**: Replace with `@capacitor/http` (deprecated in favor of native fetch in Capacitor 6+)
- **Option B**: Keep `cordova-plugin-advanced-http` via `@awesome-cordova-plugins`
- **Option C**: Use native fetch (Capacitor 6+ patches fetch on native platforms)

**Risk**: 🟡 MEDIUM — Capacitor itself is modern; main risk is the HTTP strategy migration

---

## 15. Build System

### Current Build: Webpack (via Nuxt 2)

#### Build Scripts
```json
{
  "dev": "rm -rf .nuxt && NODE_ENV=local nuxt --open",
  "build:i": "rm -rf .nuxt && NODE_ENV=ios nuxt generate && cd capacitor && yarn cap sync ios",
  "build:a": "rm -rf .nuxt && NODE_ENV=android nuxt generate && cd capacitor && yarn cap sync android",
  "clean-reinstall": "rm -f yarn.lock && rm -f package-lock.json && rm -rf node_modules && CXXFLAGS=\"--std=c++17\" yarn install --force"
}
```

### Webpack-Specific Config
```js
build: {
  transpile: ['camelcase-keys', '@awesome-cordova-plugins/file-opener', 'consola'],
  loaders: { scss: { sassOptions: { ... } } }
}
```

### No Babel Config
No `.babelrc` or `babel.config.js` found. Nuxt 2 handles transpilation internally.

### Nuxt 4 Build: Vite
- `nuxt generate` → `nuxt generate` (still works, now Vite-based)
- `build.transpile` → `vite.optimizeDeps.include` or `build.transpile` (still supported)
- `build.loaders.scss` → `vite.css.preprocessorOptions.scss`
- **`generate.dir: 'capacitor/www'`** → `nitro: { output: { publicDir: 'capacitor/www' } }` or set in nuxt.config

### Package Manager
Uses **Yarn** (classic v1) with `yarn.lock`.

**Risk**: 🟡 MEDIUM — Webpack → Vite transition is mostly automatic; some config remapping needed

---

## 16. Migration Risk Summary

### By Area

| Area | Risk | Effort | Notes |
|------|------|--------|-------|
| **Nuxt Config** | 🔴 HIGH | Medium | Full rewrite to `defineNuxtConfig()` |
| **Vue 2 → Vue 3 Patterns** | 🔴 HIGH | High | 42 files, all Options API, event bus, filters, Vue.prototype |
| **Vuex → Pinia** | 🔴 HIGH | High | 7 stores, deeply coupled to Nuxt 2 injections |
| **Plugins** | 🔴 HIGH | High | localForage uses Vue instances; filters plugin; cordova plugin |
| **asyncData → useAsyncData** | 🔴 HIGH | Medium | 13 pages + 1 component |
| **Event Bus ($root.$on/off/emit)** | 🔴 HIGH | Medium | ~20 occurrences across 10 files; needs mitt or provide/inject |
| **Mixins → Composables** | 🟡 MEDIUM | Medium | 2 mixins (documentDownload most complex) |
| **Middleware** | 🟡 MEDIUM | Low | 1 file, simple logic |
| **i18n** | 🟡 MEDIUM | Medium | Module replacement + composable migration |
| **Template Filters** | 🟡 MEDIUM | Low | ~15 template filter usages; mechanical replacement |
| **Route Directory Naming** | 🟡 MEDIUM | Low | `_param` → `[param]` (file renames) |
| **`nuxt-link tag=`** | 🟡 MEDIUM | Low | 5 occurrences; restructure HTML |
| **Calendar Widget** | 🔴 HIGH | High | 14 files; Vue.set, event bus, $children, CalWeeksService uses Vue |
| **Composables** | 🟢 LOW | Low | Already framework-agnostic |
| **CSS/Assets** | 🟢 LOW | Low | Bootstrap import; framework-agnostic CSS |
| **Capacitor** | 🟡 MEDIUM | Medium | Version unification; HTTP strategy decision |
| **Build System** | 🟡 MEDIUM | Medium | Webpack → Vite; generate dir config |
| **Utility Modules** | 🟢 LOW | None | apiNormalize, Device, MimeTypes, etc. all pure |

### Overall Assessment

**Total Effort Estimate**: HIGH — This is a substantial migration.

**Key Blockers**:
1. **localForage plugin** — Creates Vue 2 instances as wrappers; needs complete rewrite
2. **Vuex stores** — Use `this.$router`, `this.$axios`, `this.$localForage` inside actions (Nuxt 2 injection)
3. **Calendar widget** — 14 files with `Vue.set()`, `new Vue()` event bus, `$children` access
4. **Event bus pattern** — `this.$root.$on/off/emit` used in ~10 files for cross-component communication
5. **All 42 components are Options API** — Need conversion to Composition API / `<script setup>`

**Low-Hanging Fruit**:
1. Utility modules (apiNormalize, Device, MimeTypes, etc.) need zero changes
2. Composables are already framework-agnostic
3. CSS is almost entirely framework-agnostic
4. Route directory renaming is mechanical
5. Template filter replacement is mechanical (`{{ x | f }}` → `{{ f(x) }}`)

### Recommended Migration Order
1. **Phase 0**: Unify Capacitor versions (root ↔ capacitor/)
2. **Phase 1**: Scaffolding — new Nuxt 4 project, config, env vars, build scripts
3. **Phase 2**: Rewrite plugins (localForage, filters, cordova, icons, router, swal)
4. **Phase 3**: Migrate stores (Vuex → Pinia), resolve injection dependencies
5. **Phase 4**: Implement event bus replacement (mitt)
6. **Phase 5**: Convert mixins to composables
7. **Phase 6**: Migrate pages/components (Options API → Composition API, asyncData → useAsyncData)
8. **Phase 7**: Calendar widget migration (most isolated, most complex)
9. **Phase 8**: i18n module upgrade
10. **Phase 9**: Testing on web, iOS, Android; OTA update verification
