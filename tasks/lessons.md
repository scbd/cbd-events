# Nuxt 4 Migration — Lessons Learned

## p01-01: Nuxt 4 config & dependency overhaul

- **Capacitor plugin versioning**: Capacitor 7.x plugins do NOT all share the same version number as `@capacitor/core`. Each plugin has its own version (e.g., core=7.5.0, device=7.0.4, filesystem=7.1.8). Always verify against npm registry rather than assuming uniform versions.
- **`__dirname` in nuxt.config.ts**: Works because Nuxt uses jiti to load config files, which provides CJS compatibility globals. Safe to use with `resolve(__dirname, ...)`.
- **`import { version } from './package.json'`**: Works in nuxt.config.ts via jiti without needing `with { type: 'json' }` assertion.
- **i18n v10 breaking changes**: `iso` → `language` in locale config. Full migration deferred to Phase 08.
- **`generate.dir` → `nitro.output.publicDir`**: Direct mapping for controlling where `nuxt generate` outputs static files.
- **Peer dep warnings expected**: Vue 3, vite, and other peer deps show warnings because not all migrated code is in place yet — this is normal during incremental migration.
## p01-02: Directory restructure & file naming

- **File naming convention**: All files use **kebab-case** (lowercase with hyphens). Examples: `api-normalize.js`, `cover-image-mixin.js`, `side-menu.vue`, `cal-event-details.vue`. No PascalCase or camelCase filenames.
- **macOS case-insensitive FS + git**: On APFS (case-insensitive), renaming files that differ only in case requires a two-step rename through a temp name, or using `mv` on the filesystem then `git add -A` to sync the index. `git mv` with `-f` flag can also work but is unreliable.
- **`modules/` auto-scan**: Nuxt 4 auto-scans `modules/` at rootDir for Nuxt modules. Non-module utility files MUST be moved to `app/utils/` or they will cause errors. Confirmed from circusliving_amp migration.
- **Dynamic route param names stay camelCase**: Directory names like `[conferenceCode]` use camelCase because they're JavaScript parameter names, not file names. This is standard Nuxt convention.

## p01-03: Build scripts, env vars & Capacitor unification

- **Capacitor plugin versions on npm**: Each `@capacitor/*` plugin has its OWN version scheme — `@capacitor/core` is at 7.5.0 while `@capacitor/device` maxes at 7.0.4. The `capacitor/package.json` originally claimed 7.4.3 for all, which doesn't exist for most plugins. Always verify with `npm view`.
- **`@capgo/capacitor-updater` versioning**: Uses its own numbering (7.43.3) — the "7" means Capacitor 7 compatible, but minor/patch are independent and much higher than core. Both root and capacitor/ must match.
- **i18n v10 restructureDir**: Default is `'i18n'`, meaning `langDir` resolves relative to `<rootDir>/i18n/`. Set `restructureDir: false` when locales live inside srcDir (e.g., `app/locales/`). Then `langDir: 'app/locales'` resolves from rootDir.
- **modules/ auto-scan crash**: Nuxt 2-style modules using `require`, `this.options`, `this.addPlugin()` crash when Nuxt 4 auto-scans `modules/`. Convert to no-op ESM stub (`export default function () {}`) to prevent errors while preserving file for later phases.
- **`bundledWebRuntime` deprecated**: Remove from `capacitor.config.json` — no-op since Capacitor 6+.
- **Jetifier removed**: Android now uses AndroidX natively; `yarn jetify` in build scripts is no longer needed.

## p02-01: LocalForage plugin rewrite

- **Vue instance → plain class**: The old localForage plugin created a `new Vue()` instance per store with methods wrapping every localForage call in manual `new Promise()`. The replacement is a simple class that delegates directly to `localforage.createInstance()` — no Promise wrapping needed since localForage already returns Promises.
- **Plugin file naming for order**: Use `01.local-forage.js` prefix to control plugin load order in Nuxt 4's auto-discovery. This ensures localForage is available before other plugins that may depend on it.
- **iterate() curly bracket gotcha preserved**: The `iterate()` method is delegated directly to the localforage instance. The curly bracket requirement (`{ data.push(value) }` not `data.push(value)`) is a localforage behavior, not a wrapper issue — so the plain delegation preserves correct behavior.
- **Dual access pattern**: Provide both `useLocalForage()` composable (for Pinia stores / script setup) and `$localForage` via plugin provide (for gradual migration of `this.$localForage` usage).

## p07-01/02: Calendar Widget Migration

- **`$children` removal in Vue 3**: `this.$children` is completely removed. Replace with `useTemplateRef()` and access child elements via `$el.children` or expose child methods with `defineExpose()`.
- **Directive lifecycle hook mapping**: `bind` → `beforeMount`, `inserted` → `mounted`, `componentUpdated` → `updated`. The `unbind` hook becomes `unmounted`.
- **`Vue.set()` is unnecessary in Vue 3**: Vue 3 reactivity system tracks property additions automatically. Replace `Vue.set(this, 'prop', val)` with direct assignment `this.prop = val` (for class instances) or `ref.value = val` (for refs).
- **`require()` in Vue components**: Not available in ESM. Replace with `await import()` in `onMounted` or top-level await.
- **debounce handler identity**: When using `addEventListener`/`removeEventListener`, store a single `const debouncedFn = debounce(fn, ms)` — don't create new debounce wrappers on each call, or `removeEventListener` won't match the handler.
- **`$fetch` vs `axios` response shape**: `$fetch` from ofetch auto-parses JSON and returns data directly. `axios.get()` wraps in `{ data: ... }`. When migrating, remove `.data` access.
- **mitt bus `off()` requires exact reference**: Always store event handler in a named const so the same reference can be passed to both `bus.on(event, handler)` and `bus.off(event, handler)`.
- **Calendar component `events` naming conflict**: The root Calendar uses `events` as both an import (bus) and a data/prop name. Renamed data to `calEvents` to avoid shadowing.
- **`process.server` → `import.meta.server`**: Nuxt 4 tree-shaking replacement. Same for `process.client` → `import.meta.client`.