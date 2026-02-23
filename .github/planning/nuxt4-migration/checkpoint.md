# Checkpoint

**Current phase:** Phase 01 — Project Scaffolding & Config
**Last completed:** `phase-01/p01-02-directory-restructure.md`
**Next task:** `phase-01/p01-03-build-scripts-env.md`
**Updated:** 2026-02-23T21:30:00Z

## State

- Full plan drafted, approved, and refined
- 8 phases, 27 tasks
- Research complete (981-line codebase analysis)
- Memory recall applied: lessons from circusliving_amp Nuxt 4 migration
- **p01-01 COMPLETE**: nuxt.config.ts, package.json, app/app.vue, tsconfig.json
- **p01-02 COMPLETE**: directory restructure, kebab-case file naming, dynamic route renames

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

- localForage module commented out in nuxt.config.ts (Phase 02 will replace)
- Capacitor plugin versions corrected to match actual npm registry
- Start next with p01-03: Build scripts & environment variables
