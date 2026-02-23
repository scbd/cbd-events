# Phase 07: Calendar Widget

## Purpose

Migrate the Calendar widget subsystem (14 Vue files + JS modules) from Vue 2 Options API to Vue 3 Composition API. The Calendar is the most complex isolated subsystem in the app.

## Shared Context

- Calendar source: `components/Calendar/src/`
  - `components/` — Vue components (index.vue, body/, event/, footer/, header/)
  - `directives/` — LineClamp.js, Scroll.js
  - `locales/` — en.json, fr.json, index.js
  - `modules/` — Bus.js (already migrated to mitt in p02-02), CalWeeksService.js, CalFilter.vue/CalFilter.js, CalEventsService.js, CalClickOutside.js, CalEvent.js
- Critical Vue 2 patterns to convert:
  - `Vue.set(this, 'iterations', [])` → direct assignment (Vue 3 reactivity doesn't need Vue.set)
  - `new Vue()` for Calendar event bus → already replaced with mitt (Phase 02)
  - `this.$children[0].$refs` → replace with template refs or provide/inject
  - `this.$set()` → direct property assignment
  - `Vue.nextTick()` → `import { nextTick } from 'vue'`
  - `$on`, `$off`, `$emit` on bus → mitt's `on`, `off`, `emit`
  - `beforeCreate` i18n message injection → `onBeforeMount` or top-level in setup
- CalWeeksService.js uses `Vue.set()` and `Vue.nextTick()` — class needs refactoring
- `@scbd/conference-cal` external dependency — check if used or if Calendar is fully internal
- Calendar directives (LineClamp, Scroll) need Vue 3 directive format

## Key Files

| File | Complexity | Key Issues |
|------|------------|------------|
| `modules/CalWeeksService.js` | HIGH | Uses `Vue.set()`, `Vue.nextTick()`, manages week iterations |
| `modules/Bus.js` | DONE | Already migrated to mitt in Phase 02 |
| `modules/CalFilter.js` | MEDIUM | Filter/search logic |
| `modules/CalEventsService.js` | MEDIUM | Event data processing |
| `modules/CalEvent.js` | LOW | Event data model |
| `modules/CalClickOutside.js` | LOW | Click outside directive helper |
| `components/index.vue` | HIGH | Root calendar component |
| `components/body/CalBody.vue` | HIGH | Uses `this.$children[0].$refs` |
| `components/event/CalEvent.vue` | MEDIUM | Event display, uses `this.$refs` |
| `components/event/CalEventDetails.vue` | MEDIUM | Event detail popup |
| `directives/LineClamp.js` | LOW | CSS line clamp directive |
| `directives/Scroll.js` | LOW | Scroll handling directive |

## Constraints

- Calendar is relatively isolated — doesn't depend on most app pages
- Only `pages/[conferenceCode]/[meetingCode]/calendar.vue` uses it directly
- Must preserve public interface: props for events data, emits for user interactions
- `this.$children` access in CalBody.vue is the trickiest migration (completely removed in Vue 3)
