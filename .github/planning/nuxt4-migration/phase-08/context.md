# Phase 08: Bootstrap 5, i18n, Cleanup & Verification

## Purpose

Complete the migration by upgrading Bootstrap 4→5, finalizing i18n module upgrade, cleaning up orphaned dependencies, and running integration tests across web, iOS, and Android.

## Shared Context

- Bootstrap 4→5 changes: no jQuery dependency, updated utility classes, updated component markup
  - `data-toggle` → `data-bs-toggle`
  - `data-target` → `data-bs-target`
  - `data-dismiss` → `data-bs-dismiss`
  - `ml-*` / `mr-*` → `ms-*` / `me-*` (logical properties)
  - `pl-*` / `pr-*` → `ps-*` / `pe-*`
  - `text-left` / `text-right` → `text-start` / `text-end`
  - `float-left` / `float-right` → `float-start` / `float-end`
  - `badge-*` variant classes changed
  - `.close` → `.btn-close`
  - Forms: `.form-group` removed, `.form-control` updated
- i18n: `nuxt-i18n` v6 → `@nuxtjs/i18n` v9+ config migration
  - Strategy names remain similar
  - `vueI18n` config block → `vueI18n: { legacy: false }` (Composition API mode)
  - `langDir` path relative to srcDir (now `app/`)
  - Lazy loading locale files: same concept, slightly different config
- Final verification should test on actual Capacitor builds (iOS Simulator, Android Emulator)

## Key Files

| File | Purpose |
|------|---------|
| `assets/app.scss` | Bootstrap import — `@import "bootstrap/scss/bootstrap"` |
| `assets/app.css` | Custom CSS |
| `nuxt.config.ts` | i18n module config |
| `locales/en.js` | Locale file — may need format change for v9 |
| `package.json` | Final dependency cleanup |

## Constraints

- Bootstrap upgrade is CSS-only (no BootstrapVue or JS component library)
- Only HTML attribute renames and utility class renames needed
- i18n has only 1 locale (English) — simplifies migration
- Must verify OTA updates still work on native platforms
- Must verify offline-first storage (localForage) works correctly
