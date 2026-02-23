# Task: Nuxt 4 config & dependency overhaul

**ID:** p01-01
**Status:** done
**Depends on:** none
**Context size:** large
**Branch:** `p01-01-nuxt4-config`
**Target LOC:** ~200 (max 400) — excludes comments, tests, translations, data, pkg/repo config

## Goal

Replace `nuxt.config.js` with `nuxt.config.ts` using `defineNuxtConfig()`, and overhaul `package.json` to swap Nuxt 2 + Vue 2 dependencies for Nuxt 4 + Vue 3 equivalents.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-01-nuxt4-config`
3. Memory recall (async): search for nuxt4 migration, nuxt config, defineNuxtConfig

## Inputs

- Phase context: `phase-01/context.md`
- Current `nuxt.config.js`
- Current `package.json`

## Steps

1. **Create `nuxt.config.ts`** from current `nuxt.config.js`:
   - `module.exports = { ... }` → `export default defineNuxtConfig({ ... })`
   - `ssr: false` (keep SPA mode)
   - Move `env` block → `runtimeConfig.public` (remove `NUXT_ENV_` prefix):
     ```ts
     runtimeConfig: {
       public: {
         baseUrl: 'https://cbd-events.cbd.int',
         iframeHost: 'https://www.cbd.int',
         api: 'https://api.cbd.int',
         attachments: 'https://attachments.cbd.int',
         appVersion: version,
       }
     }
     ```
   - Move `build.loaders.scss` → `vite.css.preprocessorOptions.scss`
   - Remove `build.transpile` for now (Vite handles ESM natively; re-add if needed)
   - Keep `modules` array but update names:
     - `nuxt-i18n` → `@nuxtjs/i18n` (config migration in Phase 08)
     - `~/modules/nuxtModules/localForage.js` → becomes `~/modules/localForage.js` after p01-02, then fully replaced in Phase 02
   - Replace `generate: { dir: 'capacitor/www' }` with:
     ```ts
     nitro: {
       output: {
         publicDir: resolve(__dirname, 'capacitor/www')
       }
     }
     ```
   - Plugins: remove explicit plugin registrations (Nuxt 4 auto-discovers `app/plugins/`)
   - Router config: move `middleware: ['redirects']` → inline in middleware file; `linkActiveClass` → router options file
   - Remove `loading` config (Nuxt 4 has `<NuxtLoadingIndicator>`)
   - Add basic TypeScript support config

2. **Update `package.json`**:
   - Remove: `vue`, `vue-template-compiler`, `vue-server-renderer`, `vue-cordova`, `vue-notifications`, `@nuxtjs/axios`, `@ionic-native/core`, `@ionic-native/http`, `babel-eslint`, `eslint-friendly-formatter`, `sass-loader`
   - Change `nuxt` version: `2.18.1` → `^4.0.0`
   - Add: `@pinia/nuxt`, `pinia`, `mitt`, `@nuxtjs/i18n` (^9.0.0), `vitest`, `@vue/test-utils`, `happy-dom`
   - Upgrade `@capacitor/*` from 6.x → 7.x
   - Upgrade `@capgo/capacitor-updater` → 7.x
   - Upgrade `eslint` → 9.x, `eslint-plugin-vue` → 9.x
   - Upgrade `bootstrap` → ^5.3.0
   - Keep: `localforage`, `luxon`, `semver`, `sweetalert2`, `lodash.debounce`, `camelcase-keys`, `sass`
   - Add `type: "module"` to package.json (ESM)

3. **Delete old `nuxt.config.js`** after `nuxt.config.ts` is verified

4. **Create `app/app.vue`** (minimal root component):
   ```vue
   <template>
     <NuxtLayout>
       <NuxtPage />
     </NuxtLayout>
   </template>
   ```

5. **Create `tsconfig.json`** at root:
   ```json
   { "extends": "./.nuxt/tsconfig.json" }
   ```

## Testing

- [ ] Unit tests: Write a test that validates `nuxt.config.ts` can be imported and `defineNuxtConfig` returns valid config object
- [ ] Verify `yarn install` succeeds (may have peer dep warnings — that's OK at this stage)

## Outputs

- `nuxt.config.ts` — new Nuxt 4 config
- `package.json` — updated dependencies
- `app/app.vue` — root component
- `tsconfig.json` — TypeScript config
- `nuxt.config.js` — DELETED

## Done When

- [ ] `nuxt.config.ts` has all settings from old `nuxt.config.js` translated to Nuxt 4 equivalents
- [ ] `package.json` has correct dependency set (install may not fully resolve until all phases done)
- [ ] `app/app.vue` exists with NuxtLayout + NuxtPage
- [ ] TypeScript config extends Nuxt-generated tsconfig
- [ ] Old `nuxt.config.js` deleted

## Commits

Final commit message: `p01-01-nuxt4-config`
Commit body must list files created/changed and why.

## Post-Commit Memory (async)

Record task completion, key decisions about config mapping, and any gotchas.

## Rollback

- `git checkout master -- nuxt.config.js package.json`
- Delete `nuxt.config.ts`, `app/app.vue`, `tsconfig.json`

## Handoff

Next: `phase-01/p01-02-directory-restructure.md`
State: Nuxt config and deps ready. Directory structure not yet reorganized.
