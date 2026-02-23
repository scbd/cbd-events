# Task: OTA updater composable migration

**ID:** p04-02
**Status:** pending
**Depends on:** p04-01
**Context size:** small
**Branch:** `p04-02-ota-updater`
**Target LOC:** ~100 (max 400)

## Goal

Migrate the over-the-air update composable from `@ionic-native/http` to native fetch/`$fetch` for downloading update bundles.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-02-ota-updater`
3. Memory recall (async)

## Inputs

- Phase context: `phase-04/context.md`
- `composables/over-the-air.js` — current OTA implementation
- `@capgo/capacitor-updater` — Capacitor plugin for bundle management

## Steps

1. **Rewrite `app/composables/useOta.js`**:
   - Replace `HTTP.get()` from `@ionic-native/http` with `$fetch` for:
     - Fetching `index.json` (version list) from S3
     - Version comparison logic (semver)
   - Keep `CapacitorUpdater.download()` for actual bundle download (it handles its own HTTP)
   - Keep `CapacitorUpdater.set()` for applying updates
   - Replace `import { HTTP } from '@ionic-native/http'` with `import { $fetch } from 'ofetch'`
   - Export as composable: `useOta()` returning `{ checkForUpdate, applyUpdate }`

2. **Update version check logic**:
   ```js
   // Old: HTTP.get(indexUrl, {}, {}).then(response => JSON.parse(response.data))
   // New: const versions = await $fetch(indexUrl)  // auto-parsed JSON
   ```

3. **Preserve semver constraint**: Only update within same major version

4. **Delete old `composables/over-the-air.js`**

5. **Verify `@ionic-native/http` fully removed** from entire codebase:
   ```bash
   grep -r "@ionic-native/http" --include="*.js" --include="*.vue" --include="*.ts"
   ```

## Testing

- [ ] Unit test: version comparison logic (semver) works correctly
- [ ] Unit test: checkForUpdate returns correct update info from mock index.json
- [ ] Unit test: major version constraint prevents cross-major updates

## Outputs

- `app/composables/useOta.js` — migrated OTA composable
- `composables/over-the-air.js` — DELETED

## Done When

- [ ] OTA composable uses `$fetch` instead of `@ionic-native/http`
- [ ] `CapacitorUpdater` integration preserved
- [ ] Semver constraint preserved
- [ ] No `@ionic-native/http` references remain anywhere in codebase
- [ ] Old file deleted

## Commits

Final commit message: `p04-02-ota-updater`

## Post-Commit Memory (async)

Record: OTA uses $fetch for index.json, CapacitorUpdater.download() for bundles; @ionic-native fully removed.

## Rollback

- Restore over-the-air.js, revert package.json changes

## Handoff

Next: `phase-05/p05-01-cover-image-composable.md`
State: HTTP layer fully migrated. All @ionic-native removed. Ready for mixin → composable conversion.
