# Task: Directory restructuring & route renaming

**ID:** p01-02
**Status:** pending
**Depends on:** p01-01
**Context size:** medium
**Branch:** `p01-02-directory-restructure`
**Target LOC:** ~100 (mostly file moves and import path updates)

## Goal

Move source directories into `app/` (Nuxt 4 default `srcDir`) and rename dynamic route directories from `_param` (Nuxt 2) to `[param]` (Nuxt 4).

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-02-directory-restructure`
3. Memory recall (async)

## Inputs

- Phase context: `phase-01/context.md`

## Steps

1. **Create `app/` directory** at project root

2. **Move directories into `app/`**:
   ```bash
   mv assets/ app/assets/
   mv components/ app/components/
   mv composables/ app/composables/
   mv layouts/ app/layouts/
   mv middleware/ app/middleware/
   mv pages/ app/pages/
   mv plugins/ app/plugins/
   mv locales/ app/locales/       # i18n locale files
   ```

3. **Keep at root level**:
   - `capacitor/` (native project)
   - `nuxt.config.ts`
   - `package.json`
   - `static/` → rename to `public/` (if exists)

4. **Clean up `modules/` directory** — **CRITICAL**: Nuxt 4 auto-scans `modules/` at rootDir and treats every `.js`/`.ts` file as a Nuxt module. Non-module files will cause errors.
   ```bash
   # Move utility/helper files to app/utils/
   mv modules/apiNormalize.js app/utils/apiNormalize.js
   mv modules/MimeTypes.js app/utils/MimeTypes.js
   mv modules/Device.js app/utils/Device.js
   mv modules/CordovaFiles.js app/utils/CordovaFiles.js
   mv modules/localFileSystem.js app/utils/localFileSystem.js
   mv modules/appEnvironmentsManager.js app/utils/appEnvironmentsManager.js
   
   # Move mixins to app/utils/ temporarily (become composables in Phase 05)
   mv modules/CoverImageMixin.js app/utils/CoverImageMixin.js
   mv modules/documentDownloadMixin.js app/utils/documentDownloadMixin.js
   
   # Flatten the actual Nuxt module and remove subdirectory
   mv modules/nuxtModules/localForage.js modules/localForage.js
   rm -r modules/nuxtModules/
   ```
   After this step, `modules/` should contain ONLY `localForage.js` (a real Nuxt module).
   Lesson from prior Nuxt 4 migration: auto-scan of `modules/` breaks on non-module files.

5. **Rename dynamic route directories** (Nuxt 2 `_param` → Nuxt 4 `[param]`):
   ```bash
   mv app/pages/_conferenceCode/ app/pages/[conferenceCode]/
   mv app/pages/[conferenceCode]/_meetingCode/ app/pages/[conferenceCode]/[meetingCode]/
   mv app/pages/[conferenceCode]/article/_tag.vue app/pages/[conferenceCode]/article/[tag].vue
   ```

6. **Update any hard-coded paths** in config or code that reference old locations:
   - `nuxt.config.ts` `langDir` → update to `locales/` (relative to srcDir, which is now `app/`)
   - `modules/localForage.js` — update internal path references (will be fully rewritten in Phase 02, but ensure no immediate breakage)
   - Any imports of `~/modules/apiNormalize` → `~/utils/apiNormalize` (or equivalent)
   - Any imports of `~/modules/MimeTypes` → `~/utils/MimeTypes` (etc.)

7. **Create `app/utils/` directory** (Nuxt 4 auto-imports from this) — already populated from step 4

## Testing

- [ ] Verify directory structure matches Nuxt 4 expectations with `ls -la app/`
- [ ] No broken imports (will be validated when app compiles in later phases)

## Outputs

- `app/` directory with all source code
- Dynamic route dirs renamed with bracket syntax
- `modules/` cleaned to contain only the localForage Nuxt module
- Utility files and mixins moved to `app/utils/`

## Done When

- [ ] All source dirs under `app/`
- [ ] `_conferenceCode` → `[conferenceCode]`
- [ ] `_meetingCode` → `[meetingCode]`
- [ ] `_tag.vue` → `[tag].vue`
- [ ] `modules/` contains ONLY `localForage.js` (no utility files or mixins)
- [ ] Utility files (apiNormalize, MimeTypes, Device, CordovaFiles, localFileSystem, appEnvironmentsManager) in `app/utils/`
- [ ] Mixins (CoverImageMixin, documentDownloadMixin) in `app/utils/`
- [ ] No orphan directories at root level

## Commits

Final commit message: `p01-02-directory-restructure`

## Rollback

- Reverse all `mv` commands

## Handoff

Next: `phase-01/p01-03-build-scripts-env.md`
State: Directory structure is Nuxt 4 compliant. Build scripts not yet updated.
