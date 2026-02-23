# Phase 04: HTTP & Data Layer

## Purpose

Replace the dual HTTP strategy (axios for web, @ionic-native/http for native) with a unified approach using `ofetch`/`$fetch` for web and Capacitor's native fetch patching for native platforms.

## Shared Context

- Nuxt 4 includes `ofetch` built-in — available as `$fetch` globally and `useFetch()` composable
- Capacitor 6+ patches the global `fetch` on native platforms to handle CORS/SSL natively
- This means a single `$fetch` call works on both web and native — no dual HTTP strategy needed
- The old `composables/http.js` wraps axios (web) and `@ionic-native/http` (native)
- The old `composables/over-the-air.js` uses `@ionic-native/http` for downloading update bundles
- After this phase, `@ionic-native/http`, `@nuxtjs/axios`, and `cordova-plugin-advanced-http` can be removed
- `$fetch` follows the same API as the Fetch API but adds automatic JSON parsing, error handling, and retry
- For stores: replace `this.$axios.get(url)` with `$fetch(url)` — response is already parsed JSON

## Key Files

| File | Purpose |
|------|---------|
| `composables/http.js` | Dual HTTP strategy — axios vs @ionic-native/http |
| `composables/over-the-air.js` | OTA update downloads via @ionic-native/http |
| `store/conferences.js` (now `stores/conferences.js`) | Uses HTTP for API queries |
| `store/about.js` (now `stores/about.js`) | Uses HTTP for article fetching |
| `store/article.js` (now `stores/article.js`) | Uses HTTP for article fetching |

## Constraints

- Must verify Capacitor native fetch works with the CBD API endpoints (CORS, SSL pinning)
- OTA updater must still be able to download zip files on native platforms
- All HTTP error handling patterns must be preserved
- `camelcase-keys` normalization still applied post-fetch
