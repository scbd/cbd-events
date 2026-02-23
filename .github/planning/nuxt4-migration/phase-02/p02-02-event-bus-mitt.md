# Task: Event bus → mitt

**ID:** p02-02
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p02-02-event-bus-mitt`
**Target LOC:** ~50 (max 400)

## Goal

Replace all Vue 2 event bus patterns (`this.$root.$on/off/emit` and `new Vue()` bus) with a `mitt` instance provided as `$bus` via Nuxt 4 plugin. This unblocks the Calendar widget migration (Phase 07) and layout/page migrations (Phase 06).

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-02-event-bus-mitt`
3. Memory recall (async)

## Inputs

- Phase context: `phase-02/context.md`
- `components/Calendar/src/modules/Bus.js` — `new Vue()` event bus (used in CalBody.vue)
- ~20 occurrences of `this.$root.$on/off/emit` across 10+ files

### Event Bus Usage Inventory

| Event Name | Emitter | Listener |
|------------|---------|----------|
| `bottom-screen-done` | `header-bottom-screen.vue`, `CalHeader.vue` | `fileView.vue`, `languages.vue`, `conferences.vue`, `WeekSelect.vue`, `meetings.vue` |
| `bottom-screen-cancel` | `header-bottom-screen.vue` | (various) |
| `toggleSetting` | `_conferenceCode/index.vue` | `header.vue` |
| `close-setting` | `navigation/index.vue` | `header.vue` |
| `changeDate` | `Calendar WeekSelect.vue` | `Calendar index.vue` |
| `EventDetails` | (Calendar) | `CalBody.vue` |
| `showFilter` | (Calendar) | `CalBody.vue` |

## Steps

1. **Install mitt**:
   ```bash
   npm install mitt
   ```

2. **Create `app/plugins/01.bus.js`**:
   ```js
   import { defineNuxtPlugin } from '#app'
   import mitt from 'mitt'

   export default defineNuxtPlugin(() => {
     const bus = mitt()

     return {
       provide: {
         bus
       }
     }
   })
   ```

3. **Create `app/composables/useBus.js`**:
   ```js
   export const useBus = () => {
     const { $bus } = useNuxtApp()
     return $bus
   }
   ```

4. **Replace Calendar Bus.js** — `components/Calendar/src/modules/Bus.js`:
   ```js
   // Replaced by app-wide mitt bus
   // Import useBus() in components instead
   // This file kept as re-export for gradual migration:
   import { useBus } from '~/composables/useBus'
   export default useBus()
   ```

5. **Note**: Actual replacement of `this.$root.$on/off/emit` in page/component files happens in Phase 06 (pages) and Phase 07 (calendar). This task only sets up the bus infrastructure and the Calendar Bus.js bridge.

### mitt API mapping

| Vue 2 pattern | mitt equivalent |
|---------------|----------------|
| `this.$root.$on('evt', handler)` | `bus.on('evt', handler)` |
| `this.$root.$off('evt')` | `bus.off('evt', handler)` |
| `this.$root.$emit('evt', data)` | `bus.emit('evt', data)` |

**Key difference**: mitt's `off()` requires the exact handler reference (no wildcard removal). Ensure each listener stores its handler reference for cleanup.

## Testing

- [ ] Unit test: bus.emit triggers bus.on listener
- [ ] Unit test: bus.off removes listener
- [ ] Unit test: useBus() returns mitt instance
- [ ] Verify Calendar Bus.js bridge re-exports correctly

## Outputs

- `app/plugins/01.bus.js` — provides `$bus` (mitt instance)
- `app/composables/useBus.js` — composable accessor
- `components/Calendar/src/modules/Bus.js` — updated to re-export mitt bus

## Done When

- [ ] `$bus` available via `useNuxtApp()`
- [ ] `useBus()` composable returns mitt instance
- [ ] Calendar Bus.js updated
- [ ] mitt installed in dependencies

## Commits

Final commit message: `p02-02-event-bus-mitt`

## Post-Commit Memory (async)

Record: mitt replaces Vue event bus; $bus provided via plugin; Bus.js is bridge re-export; off() needs handler ref.

## Rollback

- Uninstall mitt, restore Bus.js from git, delete new files

## Handoff

Next: `phase-02/p02-03-filters-icons-notifications.md`
State: Event bus infrastructure ready. Actual $root.$on/off/emit replacements deferred to Phase 06/07.
