# Phase 07: Calendar Widget

## Purpose

Migrate the Calendar widget subsystem (14 Vue files + JS modules) from Vue 2 Options API to Vue 3 Composition API. The Calendar is the most complex isolated subsystem in the app.

## Shared Context

- Calendar source: `components/calendar/src/`
  - `components/` — Vue components (index.vue, body/, event/, footer/, header/)
  - `directives/` — line-clamp.js, scroll.js
  - `locales/` — en.json, fr.json, index.js
  - `modules/` — bus.js (already migrated to mitt in p02-02), cal-weeks-service.js, cal-filter.vue/CalFilter.js, CalEventsService.js, CalClickOutside.js, CalEvent.js
- Critical Vue 2 patterns to convert:
  - `Vue.set(this, 'iterations', [])` → direct assignment (Vue 3 reactivity doesn't need Vue.set)
  - `new Vue()` for Calendar event bus → already replaced with mitt (Phase 02)
  - `this.$children[0].$refs` → replace with template refs or provide/inject
  - `this.$set()` → direct property assignment
  - `Vue.nextTick()` → `import { nextTick } from 'vue'`
  - `$on`, `$off`, `$emit` on bus → mitt's `on`, `off`, `emit`
  - `beforeCreate` i18n message injection → `onBeforeMount` or top-level in setup
- cal-weeks-service.js uses `Vue.set()` and `Vue.nextTick()` — class needs refactoring
- `@scbd/conference-cal` external dependency — check if used or if Calendar is fully internal
- Calendar directives (LineClamp, Scroll) need Vue 3 directive format

## Key Files

| File | Complexity | Key Issues |
|------|------------|------------|
| `modules/cal-weeks-service.js` | HIGH | Uses `Vue.set()`, `Vue.nextTick()`, manages week iterations |
| `modules/bus.js` | DONE | Already migrated to mitt in Phase 02 |
| `modules/CalFilter.js` | MEDIUM | Filter/search logic |
| `modules/CalEventsService.js` | MEDIUM | Event data processing |
| `modules/CalEvent.js` | LOW | Event data model |
| `modules/CalClickOutside.js` | LOW | Click outside directive helper |
| `components/index.vue` | HIGH | Root calendar component |
| `components/body/cal-body.vue` | HIGH | Uses `this.$children[0].$refs` |
| `components/event/cal-event.vue` | MEDIUM | Event display, uses `this.$refs` |
| `components/event/cal-event-details.vue` | MEDIUM | Event detail popup |
| `directives/line-clamp.js` | LOW | CSS line clamp directive |
| `directives/scroll.js` | LOW | Scroll handling directive |

## Constraints

- Calendar is relatively isolated — doesn't depend on most app pages
- Only `pages/[conferenceCode]/[meetingCode]/calendar.vue` uses it directly
- Must preserve public interface: props for events data, emits for user interactions
- `this.$children` access in cal-body.vue is the trickiest migration (completely removed in Vue 3)
