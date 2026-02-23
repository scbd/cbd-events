# Task: Dependency cleanup & version unification

**ID:** p08-03
**Status:** pending
**Depends on:** p08-01, p08-02
**Context size:** small
**Branch:** `p08-03-dependency-cleanup`
**Target LOC:** ~50 (max 400)

## Goal

Remove all orphaned dependencies, unify Capacitor plugin versions between root and capacitor/ package.json, and ensure the dependency tree is clean.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p08-03-dependency-cleanup`
3. Memory recall (async)

## Inputs

- Phase context: `phase-08/context.md`
- `package.json` — root deps
- `capacitor/package.json` — native deps

## Steps

1. **Verify removal of all deprecated dependencies**:
   - [ ] `vue` (2.x) — replaced by Vue 3 via Nuxt
   - [ ] `vue-template-compiler` — not needed in Vue 3
   - [ ] `vue-server-renderer` — not needed
   - [ ] `vue-cordova` — removed, using Capacitor directly
   - [ ] `vue-notifications` — replaced by sweetalert2
   - [ ] `@nuxtjs/axios` — replaced by $fetch/ofetch
   - [ ] `@ionic-native/core` — replaced by Capacitor
   - [ ] `@ionic-native/http` — replaced by native fetch
   - [ ] `nuxt-i18n` (v6) — replaced by @nuxtjs/i18n v9
   - [ ] `babel-eslint` — replaced by eslint flat config
   - [ ] `eslint-friendly-formatter` — not needed
   - [ ] `sass-loader` — Vite handles SCSS natively
   - [ ] `velocity-animate` — verify if still used, remove if not

2. **Unify Capacitor versions**:
   - Root `package.json`: all `@capacitor/*` → 7.x
   - `capacitor/package.json`: verify already 7.x
   - Remove `@ionic-native/http` and `cordova-plugin-advanced-http` from `capacitor/package.json`

3. **Check for unused capacitor/ dependencies**:
   - `cordova-plugin-file` — may still be needed by `cordova-plugin-file-opener2`
   - `jetifier` — keep for Android compatibility

4. **Run dependency audit**:
   ```bash
   yarn install
   yarn audit
   ```

5. **Update `eslint` config** to flat config format (eslint 9.x):
   - Create `eslint.config.js` replacing `.eslintrc`
   - Add `eslint-plugin-vue` v9+ for Vue 3 rules

6. **Verify `type: "module"` in package.json** for ESM

## Testing

- [ ] `yarn install` succeeds with no errors
- [ ] `yarn lint` runs without crashes
- [ ] No deprecated packages in dependency tree

## Outputs

- Cleaned `package.json`
- Cleaned `capacitor/package.json`
- `eslint.config.js` — new flat config
- `.eslintrc` — DELETED (if exists)

## Done When

- [ ] No orphaned dependencies
- [ ] Capacitor versions unified at 7.x
- [ ] ESLint flat config working
- [ ] yarn install and yarn lint pass
- [ ] package.json has `type: "module"`

## Commits

Final commit message: `p08-03-dependency-cleanup`

## Post-Commit Memory (async)

Record: Final dependency manifest; Capacitor 7.x unified; eslint 9 flat config setup.

## Rollback

- Restore package.json files from git

## Handoff

Next: `phase-08/p08-04-integration-testing.md`
State: Dependencies clean. Ready for full integration testing.
