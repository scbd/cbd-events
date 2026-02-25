# Checkpoint

**Current phase:** Phase 02 — Core Plugins & Infrastructure
**Last completed:** `phase-02/p02-05-router-plugin.md`
**Next task:** `phase-03/p03-01-pinia-setup-simple-stores.md`
**Updated:** 2026-02-25T01:00:00Z

## State

- Full plan drafted, approved, and refined
- 8 phases, 27 tasks
- Research complete (981-line codebase analysis)
- Memory recall applied: lessons from circusliving_amp Nuxt 4 migration
- **p01-01 COMPLETE**: nuxt.config.ts, package.json, app/app.vue, tsconfig.json
- **p01-02 COMPLETE**: directory restructure, kebab-case file naming, dynamic route renames
- **p01-03 COMPLETE**: build scripts, env vars, Capacitor unification
- **Phase 01 COMPLETE**
- **p02-01 COMPLETE**: localForage plugin rewrite
- **p02-02 COMPLETE**: event bus (mitt)
- **p02-03 COMPLETE**: filters, icons, notifications
- **p02-04 COMPLETE**: platform plugin (cordova → capacitor)
- **p02-05 COMPLETE**: router plugin (shell + router.options.js)
- **Phase 02 COMPLETE**

## p02-05 Summary

- Created `app/plugins/05.router.js` — `defineNuxtPlugin()` shell with `router.afterEach()` hook; logs navigation to debug; TODO comment marks Pinia wiring point for p03-01
- Created `app/router.options.js` — exports `{ linkActiveClass: 'active-link' }`, replaces `router: {}` block in old nuxt.config
- Deleted `app/plugins/router.js` — Nuxt 2 context-based plugin (`store.commit('routes/SET_ROUTE', ...)`) removed; full store sync deferred to p03-01
- `yarn dev` starts cleanly: Nuxt 4.3.1, no errors

## p02-04 Summary

- Created `app/plugins/00.platform.js` — `defineNuxtPlugin()` providing `$platform` and `$isNative` via `Capacitor.getPlatform()`; `00.` prefix ensures first-load ordering
- Created `app/composables/use-platform.js` — `usePlatform()` composable returning `{ platform, isNative }` from `useNuxtApp()`
- Deleted `app/plugins/cordova.js` — `vue-cordova` integration, `localePath` injection (now native to `@nuxtjs/i18n`), and `deviceready` listener all removed
- `vue-cordova` confirmed absent from `package.json` (removed in p01-01)
- `yarn dev` starts cleanly: Vite client+server built, Nitro built, no errors

## p02-03 Summary

- Created `app/utils/filters.js` — pure exports: `lstring`, `timeDisplay`, `trimName`, `formatBytes`, `globalFilter`, `setLocale`
- Created `app/plugins/03.filters.js` — `defineNuxtPlugin()` providing `$filters`; watches `$i18n.locale` to keep module-level locale in sync
- Moved `app/plugins/icons/icon.vue` → `app/components/icon.vue` — converted from Vue 2 `functional` template to Vue 3 Options API component; `xlink:href` → `:href`; `props.x` → `x`
- Moved `app/plugins/icons/icons.vue` → `app/components/icons.vue` — SVG sprite file, no changes needed
- Deleted `app/plugins/icons/index.js` (was `Vue.component()` registration — replaced by Nuxt 4 auto-import)
- Deleted `app/plugins/filters.js` (Vue 2 `Vue.filter()` + `Vue.prototype.$filters`)
- Deleted `app/plugins/vue-notifications.js` (Vue 2 `inject()`)
- Created `app/plugins/04.notifications.js` — `defineNuxtPlugin()` providing `$swal`
- Template `| lstring` pipe syntax not yet updated — deferred to Phase 06

## p02-02 Summary

- Created `app/plugins/02.bus.js` — `defineNuxtPlugin()` providing `$bus` (mitt instance)
- Created `app/composables/use-bus.js` — `useBus()` composable returning `useNuxtApp().$bus`
- Updated `app/components/calendar/src/modules/bus.js` — re-exports `useBus()` as bridge for gradual Phase-07 migration
- Actual `$root.$on/off/emit` replacements deferred to Phase 06/07
- mitt `off()` requires exact handler reference — noted in composable JSDoc

## p02-01 Summary

- Created `app/composables/use-local-forage.js` — plain `LocalForageStore` class wrapping `localforage.createInstance()` for each of the 4 stores (files, blobs, about, article)
- Created `app/plugins/01.local-forage.js` — `defineNuxtPlugin()` providing `$localForage` via `useNuxtApp()`
- Exported `useLocalForage()` composable for direct import in Pinia stores (Phase 03)
- Deleted old Nuxt 2 `app/plugins/local-forage.js` (Vue-instance-based wrapper with `<%= serialize(options) %>`)
- Deleted `modules/local-forage.js` (no-op stub from p01-03) and removed empty `modules/` directory
- Removed commented localForage module reference from `nuxt.config.ts` modules array
- `iterate()` method delegates directly to localforage instance — curly bracket pattern continues to work
- `yarn dev` starts cleanly: Vite client+server built, Nitro built, no errors

## p01-03 Summary

- Updated `package.json` scripts: removed `rm -rf .nuxt`, `NODE_ENV=` prefixes, `yarn jetify`; added `build`, `generate`, `preview`, `lint` scripts
- Removed `@awesome-cordova-plugins/core` from root (only file-opener needed)
- Unified Capacitor plugin versions between root and `capacitor/package.json` — all `@capacitor/*` packages now match (core 7.5.0, app 7.1.2, device 7.0.4, filesystem 7.1.8, etc.)
- Updated `@capgo/capacitor-updater` in capacitor/ to 7.43.3 (matching root)
- Removed deprecated `bundledWebRuntime` from `capacitor/capacitor.config.json`
- Converted `modules/local-forage.js` from Nuxt 2 (`require`, `this.options`) to no-op ESM stub — prevents auto-scan crash; Phase 02 will implement real replacement
- Fixed i18n config: `restructureDir: false` + `langDir: 'app/locales'` for correct locale resolution
- `runtimeConfig.public` already in place (done in p01-01); `nitro.output.publicDir` already set
- `yarn install` succeeds; `yarn dev` starts cleanly (Vite client+server built, no errors)

## p01-02 Summary

- Moved all source dirs into `app/` (srcDir): assets, components, composables, layouts, middleware, pages, plugins, locales, store
- Moved non-module utility files from `modules/` to `app/utils/` with kebab-case names (api-normalize.js, device.js, mime-types.js, cordova-files.js, local-file-system.js, app-environments-manager.js, cover-image-mixin.js, document-download-mixin.js)
- Flattened `modules/nuxtModules/localForage.js` → `modules/local-forage.js` (only real Nuxt module remains)
- **Kebab-case naming convention applied to ALL files** — no PascalCase or camelCase filenames. Component `name` properties still use PascalCase internally.
- Renamed dynamic route dirs: `_conferenceCode` → `[conferenceCode]`, `_meetingCode` → `[meetingCode]`, `_tag.vue` → `[tag].vue`
- Updated all import paths across codebase to match new locations and kebab-case names
- Updated nuxt.config.ts module reference comment
- Calendar component internal imports updated (19 path changes across 8 files)

## p01-01 Summary

- Created `nuxt.config.ts` with `defineNuxtConfig()` — SPA mode, runtimeConfig, app.head, i18n module config, vite SCSS preprocessor, nitro output to capacitor/www
- Updated `package.json`: removed Vue 2/Nuxt 2 deps; added Nuxt 4, Pinia, mitt, @nuxtjs/i18n v10, vitest, @vue/test-utils, happy-dom; upgraded Capacitor 6→7, Bootstrap 4→5, eslint 7→9; added `type: "module"`
- Created `app/app.vue` with NuxtLayout + NuxtPage
- Created `tsconfig.json` extending `.nuxt/tsconfig.json`
- `yarn install` succeeds (peer dep warnings expected at this stage)

## Conventions

- **File naming**: All files use kebab-case (e.g., `api-normalize.js`, `side-menu.vue`, `cal-event-details.vue`)
- **Dynamic route params**: Use camelCase in brackets (e.g., `[conferenceCode]`) — standard Nuxt convention
- **Component name property**: PascalCase (e.g., `name: 'CalBody'`) — Vue convention

## Notes

- localForage module is a no-op stub in modules/local-forage.js — auto-scanned by Nuxt 4; Phase 02 will implement
- Capacitor plugin versions unified; each plugin has its own version scheme (not all 7.4.3)
- `restructureDir: false` needed in i18n config since locales are in `app/locales/` not `i18n/locales/`
- `runtimeConfig.public.*` pattern: access via `useRuntimeConfig().public.api` (replaces `process.env.NUXT_ENV_API`)
- Start next with p02-01: localForage plugin replacement
