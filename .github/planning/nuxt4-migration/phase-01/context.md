# Phase 01: Project Scaffolding & Config

## Purpose

Establish the Nuxt 4 foundation: convert `nuxt.config.js` → `nuxt.config.ts`, update `package.json` dependencies, move files into the new `app/` directory structure, rename dynamic route directories from `_param` to `[param]`, and configure build scripts + environment variables.

## Shared Context

- The project is currently Nuxt 2.18 with `module.exports` in `nuxt.config.js`
- Nuxt 4 uses `defineNuxtConfig()` in `nuxt.config.ts` (TypeScript)
- SPA mode (`ssr: false`) — no SSR considerations
- Build output must go to `capacitor/www/` for mobile builds
- Capacitor native projects are in `capacitor/ios/` and `capacitor/android/`
- Root `package.json` has Capacitor 6.x plugins; `capacitor/package.json` has 7.x — must unify to 7.x
- **CRITICAL**: Nuxt 4 auto-scans `modules/` at rootDir for Nuxt modules. Non-module files (utilities, mixins) must be moved to `app/utils/` or they'll cause errors. Lesson from prior Nuxt 4 migration (circusliving_amp project).

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.js` | Current Nuxt 2 config — must become `nuxt.config.ts` |
| `package.json` | Root dependencies — major overhaul needed |
| `capacitor/package.json` | Capacitor native deps — already on 7.x |
| `capacitor/capacitor.config.json` | Capacitor config — `webDir: "www"` |