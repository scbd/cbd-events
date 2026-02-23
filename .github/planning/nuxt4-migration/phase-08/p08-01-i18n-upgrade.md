# Task: i18n module upgrade (nuxt-i18n → @nuxtjs/i18n v9)

**ID:** p08-01
**Status:** pending
**Depends on:** p06-05
**Context size:** small
**Branch:** `p08-01-i18n-upgrade`
**Target LOC:** ~80 (max 400)

## Goal

Replace `nuxt-i18n` v6 module configuration with `@nuxtjs/i18n` v9+ configuration in `nuxt.config.ts`. Update locale file format if needed.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p08-01-i18n-upgrade`
3. Memory recall (async)

## Inputs

- Phase context: `phase-08/context.md`
- `nuxt.config.ts` — current i18n module config
- `app/locales/en.js` — English locale file

## Steps

1. **Update `nuxt.config.ts` i18n config**:
   ```ts
   modules: [
     '@nuxtjs/i18n',
     // ...
   ],
   i18n: {
     defaultLocale: 'en',
     detectBrowserLanguage: {
       useCookie: true,
       cookieKey: 'localePref',
     },
     locales: [
       { code: 'en', file: 'en.js', iso: 'en-US' }
     ],
     strategy: 'prefix_except_default',
     lazy: true,
     langDir: 'locales/',
     vueI18n: {
       legacy: false,  // Use Composition API mode
       fallbackLocale: 'en',
     },
   }
   ```

2. **Update locale file format** if needed:
   - Current `locales/en.js` exports a promise-returning function
   - `@nuxtjs/i18n` v9 lazy loading expects: `export default { key: 'value' }` or `export default defineI18nLocale(async () => ({ ... }))`
   - Simplify to:
     ```js
     export default {
       info: 'Information',
       docs: 'Documents',
       cal: 'Calendar',
       // ... all keys
     }
     ```

3. **Remove old `nuxt-i18n` package** from package.json (should already be replaced in p01-01)

4. **Verify all i18n patterns work**:
   - `$t('key')` in templates
   - `useI18n()` in script setup
   - `useLocalePath()` for route generation
   - `useSwitchLocalePath()` for locale switching
   - Calendar locale message merging

## Testing

- [ ] Unit test: i18n module loads without errors
- [ ] Unit test: $t('info') returns 'Information'
- [ ] Unit test: locale file loads correctly via lazy loading

## Outputs

- Updated `nuxt.config.ts` i18n configuration
- Updated `app/locales/en.js` format (if needed)

## Done When

- [ ] `@nuxtjs/i18n` v9 configured in nuxt.config.ts
- [ ] Locale file loads correctly
- [ ] All i18n composables work (useI18n, useLocalePath, useSwitchLocalePath)
- [ ] No `nuxt-i18n` v6 references remain

## Commits

Final commit message: `p08-01-i18n-upgrade`

## Post-Commit Memory (async)

Record: nuxt-i18n v6→@nuxtjs/i18n v9; legacy:false for Composition API; locale file simplified.

## Rollback

- Revert nuxt.config.ts i18n section, restore locale file

## Handoff

Next: `phase-08/p08-02-bootstrap5.md`
State: i18n fully migrated. Bootstrap upgrade next.
