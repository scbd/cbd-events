# Task: Build scripts, env vars & Capacitor unification

**ID:** p01-03
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p01-03-build-scripts-env`
**Target LOC:** ~100 (max 400)

## Goal

Update build scripts in `package.json` for Nuxt 4, unify Capacitor plugin versions between root and `capacitor/` package.json, convert the Nuxt 2 `env` block to Nuxt 4 `runtimeConfig`, and verify the Capacitor config still targets the correct build output directory.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-03-build-scripts-env`
3. Memory recall (async)

## Inputs

- Phase context: `phase-01/context.md`
- Current `package.json` scripts and dependencies
- `capacitor/package.json` (already on Capacitor 7.x)
- `capacitor/capacitor.config.json`
- `nuxt.config.ts` (converted in p01-01) — specifically the `env` block

## Steps

1. **Update `package.json` scripts**:
   ```json
   {
     "dev": "nuxt dev",
     "build": "nuxt build",
     "generate": "nuxt generate",
     "build:i": "nuxt generate && cd capacitor && npx cap sync ios",
     "build:a": "nuxt generate && cd capacitor && npx cap sync android",
     "preview": "nuxt preview",
     "test": "vitest",
     "test:run": "vitest run",
     "lint": "eslint app/",
     "clean-reinstall": "rm -f yarn.lock && rm -f package-lock.json && rm -rf node_modules && yarn install --force"
   }
   ```
   Key changes from current scripts:
   - Remove `rm -rf .nuxt &&` prefix (Nuxt 4 handles this)
   - Remove `NODE_ENV=local|ios|android` prefixes (platform detection uses Capacitor, not NODE_ENV)
   - Remove `yarn jetify` from `build:a` (jetifier is deprecated; AndroidX is standard)
   - Add `dev`, `build`, `generate`, `preview`, `test`, `test:run`, `lint` scripts

2. **Convert `env` block to `runtimeConfig`** in `nuxt.config.ts`:

   Old (Nuxt 2):
   ```js
   env: {
     NUXT_ENV_BASE_URL   : 'https://cbd-events.cbd.int',
     NUXT_ENV_IFRAME_HOST: 'https://www.cbd.int',
     NUXT_ENV_API        : 'https://api.cbd.int',
     NUXT_ENV_ATTACHMENTS: 'https://attachments.cbd.int',
     NUXT_ENV_VERSION    : version
   }
   ```

   New (Nuxt 4):
   ```ts
   runtimeConfig: {
     public: {
       baseUrl    : 'https://cbd-events.cbd.int',
       iframeHost : 'https://www.cbd.int',
       api        : 'https://api.cbd.int',
       attachments: 'https://attachments.cbd.int',
       version    : version
     }
   }
   ```
   - Drop the `NUXT_ENV_` prefix — Nuxt 4 auto-maps `NUXT_PUBLIC_*` env vars to `runtimeConfig.public.*`
   - Access pattern changes: `process.env.NUXT_ENV_API` → `useRuntimeConfig().public.api`
   - All 5 vars are client-visible, so they go under `public`
   - The `version` import from `package.json` stays the same

3. **Unify Capacitor plugin versions** — upgrade root `package.json` from Capacitor 6.x to 7.x to match `capacitor/package.json`:

   | Package | Root (current 6.x) | capacitor/ (7.x) | Root (target) |
   |---------|-------------------|-------------------|---------------|
   | `@capacitor/core` | 6.1.2 | 7.4.3 | 7.4.3 |
   | `@capacitor/app` | 6.0.1 | 7.1.0 | 7.1.0 |
   | `@capacitor/device` | 6.0.1 | 7.4.3 | 7.4.3 |
   | `@capacitor/filesystem` | 6.0.1 | 7.4.3 | 7.4.3 |
   | `@capacitor/local-notifications` | 6.1.0 | 7.4.3 | 7.4.3 |
   | `@capacitor/share` | 6.0.2 | 7.4.3 | 7.4.3 |
   | `@capacitor/splash-screen` | 6.0.2 | 7.4.3 | 7.4.3 |
   | `@capacitor/status-bar` | 6.0.1 | 7.4.3 | 7.4.3 |
   | `@capgo/capacitor-updater` | 6.3.0 | 7.4.3 | 7.4.3 |

   Also:
   - Remove `@awesome-cordova-plugins/core` from root (only `@awesome-cordova-plugins/file-opener` is needed, and it's duplicated in `capacitor/package.json`)
   - Remove `@ionic-native/core` from root (legacy, replaced by `@awesome-cordova-plugins`)
   - Keep `@ionic-native/http` in root for now (used by `composables/http.js`; will evaluate in Phase 05)

4. **Verify `capacitor/capacitor.config.json`**:
   - Current `"webDir": "www"` is correct — Nuxt 4 `generate` output goes to `capacitor/www/` via `nitro.output.publicDir` in `nuxt.config.ts` (configured in p01-01)
   - `"bundledWebRuntime": false` — remove this key (deprecated in Capacitor 6+, no-op)
   - All other settings (`appId`, `appName`, `server`, `ios.contentInset`, `plugins.CapacitorUpdater`) remain unchanged

5. **Update `generate.dir`** to Nuxt 4 equivalent in `nuxt.config.ts`:

   Old (Nuxt 2):
   ```js
   generate: { dir: 'capacitor/www' }
   ```

   New (Nuxt 4):
   ```ts
   nitro: {
     output: {
       publicDir: '../capacitor/www'  // relative to .output/
     }
   }
   ```
   Note: Verify the exact relative path works during testing. May need to use an absolute path via `import { resolve } from 'path'`.

6. **Remove obsolete dev dependencies**:
   - `babel-eslint` → replaced by `@nuxt/eslint-config` (Nuxt 4 uses flat ESLint config)
   - `eslint-friendly-formatter` → not needed with modern ESLint
   - `eslint-plugin-vue` → `7.20.0` is Vue 2 only; will be replaced by `eslint-plugin-vue@^9` (Vue 3)
   - `sass-loader` → Nuxt 4 handles Sass natively via Vite, no loader needed
   - Keep `sass` (but update to latest if needed for Vite compatibility)
   - Keep `replace` (used for build-time string replacements)

## Testing

- [ ] `yarn install` succeeds with updated Capacitor versions (no peer dependency conflicts)
- [ ] `yarn dev` starts the dev server (or fails only on expected Nuxt 4 migration issues, not build script errors)
- [ ] `npx nuxt generate` produces output in `capacitor/www/`
- [ ] Verify `useRuntimeConfig().public.api` returns `'https://api.cbd.int'` in a test component
- [ ] Confirm no `process.env.NUXT_ENV_*` references remain in `nuxt.config.ts`

## Outputs

- Updated `package.json` (scripts, Capacitor 7.x deps, removed obsolete devDeps)
- Updated `nuxt.config.ts` (`runtimeConfig.public` replaces `env`, `nitro.output` replaces `generate.dir`)
- Updated `capacitor/capacitor.config.json` (removed deprecated `bundledWebRuntime`)

## Done When

- [ ] All `package.json` scripts use `nuxt` CLI (no `NODE_ENV` prefix, no `rm -rf .nuxt`)
- [ ] `env` block removed from `nuxt.config.ts`; `runtimeConfig.public` in place with all 5 vars
- [ ] All `@capacitor/*` versions in root match `capacitor/package.json` (7.x)
- [ ] `@capgo/capacitor-updater` version matches across both package.json files
- [ ] `bundledWebRuntime` removed from `capacitor.config.json`
- [ ] Obsolete devDependencies removed
- [ ] `generate.dir` replaced with `nitro.output.publicDir`

## Commits

Final commit message: `p01-03-build-scripts-env`

## Post-Commit Memory (async)

Record: runtimeConfig.public pattern for env vars; Capacitor unified to 7.x; nitro.output.publicDir for generate dir; jetifier removed.

## Rollback

- `git checkout -- package.json nuxt.config.ts capacitor/capacitor.config.json`
- `yarn install` to restore node_modules

## Handoff

Next: `phase-02/p02-01-localforage-plugin.md`
State: Phase 01 complete — project scaffolded with Nuxt 4 config, directory structure, build scripts, env vars, and unified Capacitor versions. Ready to begin core plugins & infrastructure.
