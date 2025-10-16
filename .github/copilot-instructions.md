# CBD Events Mobile App - AI Coding Agent Instructions

> **Note**: If `.github/personal.md` exists, follow the instructions and configurations specified there in addition to these guidelines.

## Architecture Overview

This is a **Nuxt 4 SPA** mobile app wrapped with **Capacitor 6** for iOS/Android deployment. The app provides offline-first access to CBD/UN Biodiversity conference schedules, documents, and articles.

**⚠️ Migration Status**: Currently migrating from Nuxt 2 → Nuxt 4. The codebase is in a **hybrid state**:
- ✅ Plugin system migrated to Nuxt 3/4 (`defineNuxtPlugin`, `useRuntimeConfig`)
- ✅ Config migrated to `nuxt.config.ts` with `defineNuxtConfig`
- ⚠️ **Still using Vuex** (not yet migrated to Pinia) - stores use Nuxt 2 pattern
- ⚠️ **Pages use Options API + `asyncData`** - not yet migrated to Composition API

### Key Stack
- **Nuxt 4.0** (SPA mode via `ssr: false`) - Static generation to `capacitor/www`
- **Capacitor 6** - Native mobile wrapper (legacy Cordova references remain)
- **LocalForage** - Offline data persistence across 4 isolated instances
- **Vuex** (legacy) - State management: `conferences`, `files`, `about`, `article`, `routes`
- **Bootstrap 4.6.2** - UI framework
- **Vue 3 with Options API** - Pages not yet migrated to Composition API

## Critical Build Commands

```bash
# Development (web browser)
yarn dev  # Runs nuxt dev on localhost:3000

# iOS build (generates static site to capacitor/www then syncs native code)
yarn build:i
# Sets NODE_ENV=ios, runs nuxt generate, syncs to iOS
# Then: Open capacitor/ios/App/App.xcworkspace in Xcode → Run simulator

# Android build  
yarn build:a
# Sets NODE_ENV=android, runs nuxt generate, runs jetify, syncs to Android
# Then: Open capacitor/android in Android Studio → Run emulator
```

**Build output**: `nuxt.config.ts` sets:
```typescript
nitro: {
  output: {
    dir: 'capacitor/www',
    publicDir: 'capacitor/www'
  }
}
```

## Platform Detection Pattern

**Always use Capacitor.getPlatform() for platform detection**, not legacy Cordova checks:

```javascript
import { Capacitor } from '@capacitor/core';

if(Capacitor.getPlatform() !== 'web') {
  // Native iOS/Android code
}
```

See: `plugins/cordova.js`, `composables/http.js`

## HTTP Requests: Platform-Specific

**Use the custom `http` composable** instead of axios directly on native platforms:

```javascript
import http from '~/composables/http'

// Automatically routes to:
// - axios on web
// - @ionic-native/http on iOS/Android (handles CORS/SSL)
const data = await http(restParams, this.$axios)
```

Example: `store/conferences.js` line 167

## File System & Document Downloads

### LocalForage Storage Pattern
App uses **4 LocalForage instances** (see `plugins/localForage.ts` + `utils/nuxtModules/localForage.ts`):
- `files` - File metadata
- `blobs` - Binary content (separate for memory management)
- `about` - About page articles
- `article` - General articles

**Critical iteration pattern**: Must use curly brackets or iteration breaks:
```javascript
// ✅ Correct - curly brackets required
await this.$localForage.files.iterate((value) => { data.push(value) })

// ❌ Wrong - breaks on first iteration
await this.$localForage.files.iterate((value) => data.push(value))
```
See: `store/files.js` line 7-9

### Download & Open Flow
1. Download file → Store blob in LocalForage (`store/files.js`)
2. Save to device filesystem using Capacitor Filesystem API (`composables/file-system.js`)
3. Open with native viewer using FileOpener (`utils/cordova-files.js`)

**iOS Share Pattern**: Use `@capacitor/share` for iOS file sharing:
```javascript
import { Share } from '@capacitor/share'
await Share.share({ title: file.baseName, url, dialogTitle: `Share ${file.baseName}` })
```
See: `utils/cordova-files.js` line 93

## Dynamic Routing & Conference Selection

**Route structure**: `/:conferenceCode/:meetingCode?/[page]`

### Conference Loading Flow
1. `middleware/redirects.js` - Auto-redirects to selected conference on app launch
2. `store/conferences.js` - Loads conferences, selects active one
3. `plugins/router.js` - Syncs Vue Router state to Vuex `routes` store

**Access route params anywhere**:
```javascript
const { conferenceCode } = this.$router.currentRoute.params
```

## Environment Variables

Configured in `nuxt.config.ts` using `runtimeConfig` (Nuxt 3+ pattern):

```typescript
runtimeConfig: {
  public: {
    baseUrl: 'https://cbd-events.cbd.int',
    api: 'https://api.cbd.int',
    attachments: 'https://attachments.cbd.int',
    version: version // from package.json
  }
}
```

**Access in code**:
```javascript
// Plugin context (Nuxt 3+ way)
const config = useRuntimeConfig()
console.log(config.public.api)

// Legacy (still works in templates/components)
process.env.NUXT_ENV_API
```

## Over-The-Air (OTA) Updates

**Critical feature**: App can update web bundle without app store releases

- Uses `@capgo/capacitor-updater` with custom S3-based versioning
- Update check: `composables/over-the-air.js`
- Release format: `s3://cbddocumentspublic-imagebucket-15w2zyxk3prl8/cbd-events/releases/{major}/{minor}/{patch}/dist.zip`
- **Only updates within same major version** (semver constraint)
- `index.json` at root lists available versions

## API Data Normalization

**All API responses use camelCase conversion**:
```javascript
import { normalizeApiResponse, normalizeSolrResponse } from '~/utils/api-normalize'

// Converts snake_case API responses to camelCase
const data = normalizeApiResponse(response)
```

Pattern used in: `store/conferences.js`, `store/about.js`

## i18n & Localization

- Uses `nuxt-i18n` with default locale `en`
- Route helper: `this.$localePath({ name: 'route-name' })` - Returns localized path
- Filter: `lstring` - Extracts locale string from `{en: '', fr: '', ...}` objects

See: `plugins/filters.js`, `plugins/cordova.js` (localePath injection)

## Common Gotchas

1. **AsyncData vs Mounted**: Pages still use legacy `asyncData` (Options API) - not yet migrated to `setup()` + `useAsyncData()`
2. **Vuex Access**: Use `this.$store` in components - Pinia migration pending
3. **LocalForage iteration**: Use curly brackets `{ data.push(value) }` or iteration breaks early (see `store/files.js` line 9)
4. **File opener permission**: Must use commit `0b15d93b4f0c5a70206fe276f7aa956f754c3ca3` of `cordova-plugin-file-opener2` (see README) to avoid Android rejection
5. **iOS Content Inset**: Set in `capacitor.config.json` - `"contentInset": "always"` for proper status bar handling
6. **Plugin Pattern**: All plugins migrated to `defineNuxtPlugin()` - never use old `export default ({ app }, inject)` pattern
