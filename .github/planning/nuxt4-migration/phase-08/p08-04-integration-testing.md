# Task: Integration testing & platform verification

**ID:** p08-04
**Status:** pending
**Depends on:** p08-03
**Context size:** medium
**Branch:** `p08-04-integration-testing`
**Target LOC:** ~200 (max 400)

## Goal

Run the full app on web, iOS Simulator, and Android Emulator. Fix any remaining issues. Verify OTA updates, offline storage, and file downloads work on all platforms.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p08-04-integration-testing`
3. Memory recall (async)

## Inputs

- Phase context: `phase-08/context.md`
- All previously migrated files
- Build scripts from p01-03

## Steps

1. **Web verification**:
   ```bash
   yarn dev
   ```
   - Navigate through all routes
   - Test conference selection, meeting pages, calendar
   - Test article loading, file downloads (web mode)
   - Test language switching
   - Browser console: no Vue warnings, no 404s, no unhandled rejections

2. **iOS verification**:
   ```bash
   yarn build:i
   # Open capacitor/ios/App/App.xcworkspace in Xcode
   # Run on iOS Simulator
   ```
   - Test all routes and features
   - Test file download + native file opener
   - Test OTA update check (`useOta()`)
   - Test offline mode (airplane mode)
   - Verify status bar configuration
   - Verify splash screen

3. **Android verification**:
   ```bash
   yarn build:a
   # Open capacitor/android in Android Studio
   # Run on emulator
   ```
   - Same test matrix as iOS
   - Verify file opener uses correct plugin commit
   - Verify jetifier runs without issues

4. **Write integration test checklist**:
   - [ ] App starts without errors (web)
   - [ ] Root redirect works (`/` → `/{conferenceCode}`)
   - [ ] Conference landing page loads hero image
   - [ ] About page renders articles
   - [ ] Meeting agenda page loads iframe
   - [ ] Document download works (iframe postMessage)
   - [ ] File downloads list shows correct sizes
   - [ ] Calendar renders events
   - [ ] Calendar week navigation works
   - [ ] Language switching works
   - [ ] Offline mode shows cached data
   - [ ] Online reconnection refreshes data
   - [ ] iOS build runs on Simulator
   - [ ] Android build runs on Emulator
   - [ ] OTA update check succeeds on native
   - [ ] File open works on native (FileOpener)
   - [ ] Share sheet works on iOS
   - [ ] LocalForage stores persist across app restarts

5. **Fix any remaining issues** — create sub-commits for each fix

6. **Run full test suite**:
   ```bash
   yarn test:run
   ```
   All unit tests from previous tasks must pass.

## Testing

- [ ] All unit tests pass (`yarn test:run`)
- [ ] Integration checklist above fully verified
- [ ] No console errors on any platform

## Outputs

- Bug fixes for any issues found
- Verified working app on web, iOS, Android

## Done When

- [ ] `yarn dev` runs without errors
- [ ] `yarn build:i` produces working iOS build
- [ ] `yarn build:a` produces working Android build
- [ ] All unit tests pass
- [ ] Integration checklist 100% verified
- [ ] OTA update mechanism verified
- [ ] Offline-first storage verified

## Commits

Final commit message: `p08-04-integration-testing`
Additional commits: `p08-04-fix-[description]` for each bug fix

## Post-Commit Memory (async)

Record: Migration complete; document any platform-specific gotchas; record final dep versions.

## Rollback

- Revert individual fixes as needed

## Handoff

**Migration complete.** 🎉
All 27 tasks across 8 phases finished. The app is now running on Nuxt 4 + Vue 3.
