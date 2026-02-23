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