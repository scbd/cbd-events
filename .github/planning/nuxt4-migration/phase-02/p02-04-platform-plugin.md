# Task: Platform plugin (cordova → capacitor)

**ID:** p02-04
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p02-04-platform-plugin`
**Target LOC:** ~80 (max 400)

## Goal

Replace `plugins/cordova.js` (Vue.use(VueCordova), $cordova injection, manual localePath) with a lean Nuxt 4 platform plugin using direct Capacitor APIs.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-04-platform-plugin`
3. Memory recall (async)

## Inputs

- Phase context: `phase-02/context.md`
- `plugins/cordova.js` — current implementation
- Usage of `$cordova` across codebase (minimal — mostly Capacitor.getPlatform())

## Steps

1. **Create `app/plugins/00.platform.js`** (must load first — `00` prefix):
   ```js
   import { defineNuxtPlugin } from '#app'
   import { Capacitor } from '@capacitor/core'

   export default defineNuxtPlugin(() => {
     const platform = Capacitor.getPlatform() // 'web' | 'ios' | 'android'
     const isNative = platform !== 'web'

     return {
       provide: {
         platform,
         isNative,
       }
     }
   })
   ```

2. **Create `app/composables/usePlatform.js`**:
   ```js
   export const usePlatform = () => {
     const { $platform, $isNative } = useNuxtApp()
     return { platform: $platform, isNative: $isNative }
   }
   ```

3. **Remove `vue-cordova` dependency** from package.json (already removed in p01-01, verify)

4. **Delete `plugins/cordova.js`** — the localePath injection is handled by `@nuxtjs/i18n` v9 natively

5. **Note**: The old plugin also called `config.plugins.unshift()` to ensure it loaded first — in Nuxt 4, the `00.` prefix handles ordering

## Testing

- [ ] Unit test: usePlatform() returns platform string and isNative boolean
- [ ] Unit test: mock Capacitor.getPlatform() for web/ios/android

## Outputs

- `app/plugins/00.platform.js` — platform detection plugin
- `app/composables/usePlatform.js` — composable accessor
- `plugins/cordova.js` — DELETED

## Done When

- [ ] `$platform` and `$isNative` available via `useNuxtApp()`
- [ ] `usePlatform()` composable works
- [ ] `vue-cordova` dependency removed
- [ ] Old cordova.js deleted

## Commits

Final commit message: `p02-04-platform-plugin`

## Post-Commit Memory (async)

Record: vue-cordova removed; Capacitor.getPlatform() used directly; 00. prefix for first-load plugin.

## Rollback

- Restore cordova.js from git, delete new files

## Handoff

Next: `phase-02/p02-05-router-plugin.md`
State: Platform detection available. No more vue-cordova dependency.
