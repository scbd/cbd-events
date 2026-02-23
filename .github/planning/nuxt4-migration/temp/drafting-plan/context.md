# Drafting Context: nuxt4-migration

## Goal
Plan the migration of CBD Events from Nuxt 2 + Vue 2 to Nuxt 4 + Vue 3, including:
- All dependencies upgraded to latest versions
- Vuex → Pinia
- Options API → Composition API + `<script setup>`
- Bootstrap 4 → Bootstrap 5
- `@ionic-native/http` → Capacitor native fetch
- `@nuxtjs/axios` → `ofetch` / `$fetch`
- `nuxt-i18n` v6 → `@nuxtjs/i18n` v9+
- LocalForage plugin rewrite (remove Vue 2 instances)
- Event bus (`$root.$on/off/emit`) → mitt
- Mixins → composables
- Template filters → function calls
- Route directories: `_param` → `[param]`
- Unit tests for all migrated code

## Constraints
- No pushing branches or commits during implementation
- Each task targets ~200 lines (max 400) of implementation code
- Nuxt 4 (currently v4.x) with `ssr: false` (SPA mode)
- Must maintain Capacitor 7 integration for iOS/Android
- Must preserve OTA update capability

## Research Completed
- Full codebase analysis: `temp/research/codebase-analysis.md` (981 lines)
- Nuxt 4 upgrade guide reviewed (https://nuxt.com/docs/4.x/getting-started/upgrade)
- Vue 3 migration guide reviewed (https://v3-migration.vuejs.org/)
- Nuxt 2→3 migration overview reviewed

## Key Stats
- 42 .vue files (all Options API)
- 7 Vuex stores
- 6 plugins
- 4 composables
- 2 mixins
- 14 pages
- 14-file Calendar widget
- Zero existing tests

## User Decisions
- HTTP: Capacitor native fetch patching
- Bootstrap: Upgrade to 5
- State: Pinia
- Testing: Include unit tests
