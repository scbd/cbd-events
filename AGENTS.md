# CBD Events - AI Coding Agent Instructions

This file is the single source of instructions for coding agents in this repo. `CLAUDE.md` defers
to it. There is no `.github/` instruction file any more — do not recreate one.

For what the app *is*, how to build it, the environment variables, the API endpoints, the
`apps.cbdEvents` conference contract and the articles/`adminTags` contract, read
[README.md](README.md). This file covers only how to work in the code.

## Stack

| | |
|---|---|
| Framework | Nuxt 2.18 in SPA mode (`ssr: false`), Vue 2.7, Vuex |
| Native shell | Capacitor 7 (`capacitor/`), plus legacy `@ionic-native` / `@awesome-cordova-plugins` bridges |
| Node | `>=22` (`.nvmrc`, `engines`) |
| Styling | Bootstrap 4.6 (CSS only) + Sass |
| Storage | localForage (IndexedDB/WebSQL) |
| OTA | `@capgo/capacitor-updater` over an S3 release index |

A Nuxt 4 / Vue 3 / Bootstrap 5 migration is planned but not started — see
`docs/nuxt4-upgrade-plan.md` (DEV-1106). Write new code against the current Nuxt 2 stack unless a
task says otherwise.

## Repo layout

```
components/        Vue 2 components; components/Calendar/ is a vendored calendar
composables/       http.js (platform-aware transport), file-system.js, over-the-air.js, query-filter.js
layouts/ pages/    Nuxt routing; pages use _conferenceCode/_meetingCode dynamic segments
middleware/        redirects.js runs on every route (registered in nuxt.config router.middleware)
modules/           mixins + helpers (NOT Nuxt modules); modules/nuxtModules/ holds the real ones
plugins/           cordova.js must load first, then icons, router, filters, notifications
store/             Vuex modules: conferences, about, article, files, routes, i18n
capacitor/         native projects + www/ build output (generated, do not hand-edit www/)
docs/              architecture and upgrade plans
```

## Conventions

### HTTP: always go through the composable

```js
import useHttp from '~/composables/http'

const data = await useHttp({ url, method: 'get', responseType: 'json', params }, this.$axios)
```

`composables/http.js` branches on `Capacitor.getPlatform()`: axios on web, `@ionic-native/http` on
iOS/Android (native avoids the CORS/SSL restrictions of the webview). Never import axios directly in
a component or store.

Query params for the CBD API are JSON-stringified per key by `composables/query-filter.js`:

```js
const params = queryFilter({ q: { 'apps.cbdEvents': { $exists: true } }, s: { StartDate: -1 } })
```

### Platform detection

```js
import { Capacitor } from '@capacitor/core'

if (Capacitor.getPlatform() !== 'web') { /* native only */ }
```

Use this, not legacy Cordova globals. See `plugins/cordova.js`, `composables/http.js`.

### API responses

Every CBD API response is passed through `~/modules/apiNormalize`. `normalizeApiResponse` only deep
camelCases the keys — it takes no locale, so callers that pass one are passing it into the void, and
localized objects stay as `{ en, fr, ... }` for the `lstring` filter. `normalizeSolrResponse` does
both: it strips the Solr `_s`/`_txt` field suffixes *and* resolves lstrings to the given locale. Do
not consume raw responses.

### Offline storage

Four localForage instances are registered in `nuxt.config.js` and injected as `$localForage`:

| Instance | Holds | Key |
|---|---|---|
| `files` | File metadata | `file.name` |
| `blobs` | File binary content (kept separate for size/memory) | `file.name` |
| `about` | About articles | `conferenceCode` |
| `article` | Home + button articles | `` `${conferenceCode}-${tag}` `` |

Always write metadata and blob under the same key in the two separate stores (`saveFiles` /
`saveObjectOfFiles` in `store/files.js`), and read them back together in `loadAction`.

### i18n

`nuxt-i18n`, default locale `en`, `prefix_except_default`. Route with
`this.localePath({ name: 'route-name', params })`. Localized `{ en, fr, ... }` objects render
through the `lstring` filter (`plugins/filters.js`).

### Data fetching in pages

Pages use Vue 2 `asyncData()` even though the app is SPA-only. Route params are available as
`this.$router.currentRoute.params`, and `plugins/router.js` mirrors router state into the `routes`
Vuex module.

## Gotchas

1. **localForage iteration needs a block body.** `iterate((value) => data.push(value))` returns the
   pushed length, which localForage reads as a stop signal and breaks after the first record. Use
   `iterate((value) => { data.push(value) })` (`store/files.js:7`).
2. **`$axios` is not actually registered.** `@nuxtjs/axios` is a dependency but is not in
   `nuxt.config.js` `modules`, so `this.$axios` is `undefined` and `useHttp` falls through to its
   default axios import. Passing `this.$axios` is harmless but means nothing — do not rely on Nuxt
   axios interceptors or `baseURL`.
3. **Plugin order matters.** `plugins/cordova.js` is prepended with `config.plugins.unshift()` at the
   bottom of `nuxt.config.js`; keep it first.
4. **`modules/` is not a Nuxt modules dir here.** Real Nuxt modules live in `modules/nuxtModules/`.
   The Nuxt 4 migration will have to move the mixins out (Nuxt 4 auto-scans `modules/`).
5. **File opener commit is pinned for a reason.** `cordova-plugin-file-opener2` must stay at
   `0b15d93b4f0c5a70206fe276f7aa956f754c3ca3`; upstream injects an Android permission that gets the
   build rejected from the Play Store (see README notes).
6. **iOS content inset** is set via `"contentInset": "always"` in `capacitor.config.json` for status
   bar handling.
7. **OTA only crosses minor/patch.** `composables/over-the-air.js` refuses updates across a major
   version; a major bump requires a store release.
8. **`capacitor/www/` is build output.** Never edit it; it is regenerated by `yarn build:i` /
   `yarn build:a`.

## Working agreements

- Pin dependency versions exactly — no `^` or `~` in `package.json`.
- Run `yarn test:smoke` before claiming a build-affecting change works.
- Changes to the `apps.cbdEvents` shape or the article `adminTags` convention are a contract change:
  update the tables in [README.md](README.md) in the same change.
- Tickets are tracked in Jira (`DEV-####`); branch and commit subjects carry the ticket id.
