# Roadmap

## Phase 01: Project Scaffolding & Config

**Context:** [phase-01/context.md](phase-01/context.md)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p01-01 | [Nuxt 4 config & dependency overhaul](phase-01/p01-01-nuxt4-config.md) | ⬜ pending | none |
| p01-02 | [Directory restructuring & route renaming](phase-01/p01-02-directory-restructure.md) | ⬜ pending | p01-01 |
| p01-03 | [Build scripts, env vars & Capacitor unification](phase-01/p01-03-build-scripts-env.md) | ⬜ pending | p01-01 |

## Phase 02: Core Plugins & Infrastructure

**Context:** [phase-02/context.md](phase-02/context.md)  
**Requires:** Phase 01 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p02-01 | [LocalForage plugin rewrite](phase-02/p02-01-localforage-plugin.md) | ⬜ pending | p01-01 |
| p02-02 | [Event bus → mitt](phase-02/p02-02-event-bus-mitt.md) | ⬜ pending | p01-01 |
| p02-03 | [Filters, icons & notification plugins](phase-02/p02-03-filters-icons-notifications.md) | ⬜ pending | p01-01 |
| p02-04 | [Platform plugin (cordova → capacitor)](phase-02/p02-04-platform-plugin.md) | ⬜ pending | p01-01 |
| p02-05 | [Router plugin migration](phase-02/p02-05-router-plugin.md) | ⬜ pending | p01-01 |

## Phase 03: State Management (Vuex → Pinia)

**Context:** [phase-03/context.md](phase-03/context.md)  
**Requires:** Phase 02 complete (plugins available)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p03-01 | [Pinia setup + offLine & routes stores](phase-03/p03-01-pinia-setup-simple-stores.md) | ⬜ pending | p02-01 |
| p03-02 | [Conferences store migration](phase-03/p03-02-conferences-store.md) | ⬜ pending | p03-01 |
| p03-03 | [Files store migration](phase-03/p03-03-files-store.md) | ⬜ pending | p03-01, p02-01 |
| p03-04 | [About & Article stores migration](phase-03/p03-04-about-article-stores.md) | ⬜ pending | p03-01 |

## Phase 04: HTTP & Data Layer

**Context:** [phase-04/context.md](phase-04/context.md)  
**Requires:** Phase 03 complete (stores use HTTP)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p04-01 | [Replace axios + ionic-native with ofetch + native fetch](phase-04/p04-01-http-migration.md) | ⬜ pending | p03-02 |
| p04-02 | [OTA updater composable migration](phase-04/p04-02-ota-updater.md) | ⬜ pending | p04-01 |

## Phase 05: Mixins → Composables

**Context:** [phase-05/context.md](phase-05/context.md)  
**Requires:** Phase 03 + 04 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p05-01 | [CoverImageMixin → useCoverImage composable](phase-05/p05-01-cover-image-composable.md) | ⬜ pending | p03-02 |
| p05-02 | [documentDownloadMixin → useDocumentDownload composable](phase-05/p05-02-document-download-composable.md) | ⬜ pending | p03-03, p04-01 |

## Phase 06: Layouts, Middleware & Pages

**Context:** [phase-06/context.md](phase-06/context.md)  
**Requires:** Phase 02-05 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p06-01 | [Layouts & middleware migration](phase-06/p06-01-layouts-middleware.md) | ⬜ pending | p02-02, p03-01 |
| p06-02 | [Static & conference info pages](phase-06/p06-02-static-conference-pages.md) | ⬜ pending | p06-01, p03-02 |
| p06-03 | [Article & fileView pages](phase-06/p06-03-article-fileview-pages.md) | ⬜ pending | p06-01, p03-04, p05-01 |
| p06-04 | [Meeting pages (part 1): agenda & documents](phase-06/p06-04-meeting-pages-part1.md) | ⬜ pending | p06-01, p05-02 |
| p06-05 | [Meeting pages (part 2): downloads, meetings, calendar, WeekSelect](phase-06/p06-05-meeting-pages-part2.md) | ⬜ pending | p06-04 |

## Phase 07: Calendar Widget

**Context:** [phase-07/context.md](phase-07/context.md)  
**Requires:** Phase 02 (mitt) complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p07-01 | [Calendar core: services, bus, directives](phase-07/p07-01-calendar-core.md) | ⬜ pending | p02-02 |
| p07-02 | [Calendar Vue components migration](phase-07/p07-02-calendar-components.md) | ⬜ pending | p07-01 |

## Phase 08: Bootstrap 5, i18n, Cleanup & Verification

**Context:** [phase-08/context.md](phase-08/context.md)  
**Requires:** Phase 06 + 07 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p08-01 | [i18n module upgrade (nuxt-i18n → @nuxtjs/i18n v9)](phase-08/p08-01-i18n-upgrade.md) | ⬜ pending | p06-05 |
| p08-02 | [Bootstrap 4 → 5 migration](phase-08/p08-02-bootstrap5.md) | ⬜ pending | p06-05, p07-02 |
| p08-03 | [Dependency cleanup & version unification](phase-08/p08-03-dependency-cleanup.md) | ⬜ pending | p08-01, p08-02 |
| p08-04 | [Integration testing & platform verification](phase-08/p08-04-integration-testing.md) | ⬜ pending | p08-03 |

## Status Legend

- ⬜ pending
- 🔄 in-progress
- ✅ complete
- ❌ blocked
- ⏸️ paused