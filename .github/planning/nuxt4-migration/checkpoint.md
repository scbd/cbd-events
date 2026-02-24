# Checkpoint

**Current phase:** Phase 01 — Project Scaffolding & Config — COMPLETE
**Last completed:** `phase-01/p01-03-build-scripts-env.md`
**Next task:** `phase-02/p02-01-localforage-plugin.md`
**Updated:** 2026-02-24T09:25:00Z

## State

- Full plan drafted, approved, and refined
- 8 phases, 27 tasks
- Research complete (981-line codebase analysis)
- Memory recall applied: lessons from circusliving_amp Nuxt 4 migration
- **p01-01 COMPLETE**: nuxt.config.ts, package.json, app/app.vue, tsconfig.json
- **p01-02 COMPLETE**: directory restructure, kebab-case file naming, dynamic route renames
- **p01-03 COMPLETE**: build scripts, env vars, Capacitor unification
- **Phase 01 COMPLETE** — ready for Phase 02

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
