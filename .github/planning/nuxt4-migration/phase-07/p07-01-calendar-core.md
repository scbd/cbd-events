# Task: Calendar core: services, bus, directives

**ID:** p07-01
**Status:** pending
**Depends on:** p02-02
**Context size:** medium
**Branch:** `p07-01-calendar-core`
**Target LOC:** ~200 (max 400)

## Goal

Migrate Calendar's JavaScript modules (services, directives) from Vue 2 patterns to Vue 3 compatible code. Bus.js was already migrated in Phase 02.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p07-01-calendar-core`
3. Memory recall (async)

## Inputs

- Phase context: `phase-07/context.md`
- `components/Calendar/src/modules/CalWeeksService.js`
- `components/Calendar/src/modules/CalFilter.js`
- `components/Calendar/src/modules/CalEventsService.js`
- `components/Calendar/src/modules/CalEvent.js`
- `components/Calendar/src/modules/CalClickOutside.js`
- `components/Calendar/src/directives/LineClamp.js`
- `components/Calendar/src/directives/Scroll.js`

## Steps

1. **Migrate `CalWeeksService.js`** (most complex):
   - `Vue.set(this, 'iterations', [])` → `this.iterations = reactive([])`  or plain `this.iterations = []` if class properties are already reactive
   - `Vue.nextTick(() => ...)` → `import { nextTick } from 'vue'` then `nextTick(() => ...)`
   - Remove `import Vue from 'vue'`
   - Review class structure — if it creates reactive state, consider whether it should use `reactive()` explicitly

2. **Migrate `CalFilter.js`**:
   - Review for Vue 2 patterns
   - Replace any `Vue.*` calls

3. **Migrate `CalEventsService.js`**:
   - Review for Vue 2 patterns
   - Likely framework-agnostic; verify

4. **Migrate `CalEvent.js`**:
   - Data model class — likely framework-agnostic
   - Verify no Vue 2 imports

5. **Migrate `CalClickOutside.js`**:
   - Click outside detection helper
   - May need Vue 3 directive format if used as directive

6. **Migrate directives** to Vue 3 format:
   - Vue 2 lifecycle: `bind`, `inserted`, `update`, `componentUpdated`, `unbind`
   - Vue 3 lifecycle: `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`
   - `LineClamp.js`:
     ```js
     // Vue 3 directive format
     export default {
       mounted(el, binding) { /* apply line clamp */ },
       updated(el, binding) { /* update line clamp */ }
     }
     ```
   - `Scroll.js`:
     ```js
     export default {
       mounted(el, binding) { /* attach scroll handler */ },
       unmounted(el, binding) { /* remove scroll handler */ }
     }
     ```

7. **Update Bus.js call sites** in CalFilter and CalEventsService if they use `$on/$off/$emit`:
   - These should use `on/off/emit` (mitt style) — verify Phase 02 covered all instances

## Testing

- [ ] Unit test: CalWeeksService generates correct week iterations without Vue.set
- [ ] Unit test: directives have correct Vue 3 lifecycle hooks
- [ ] Unit test: CalEventsService processes events correctly
- [ ] Unit test: no `import Vue from 'vue'` remains in any Calendar module

## Outputs

- Updated Calendar modules: CalWeeksService.js, CalFilter.js, CalEventsService.js, CalEvent.js, CalClickOutside.js
- Updated directives: LineClamp.js, Scroll.js

## Done When

- [ ] No `Vue.set()`, `Vue.nextTick()`, or `import Vue from 'vue'` in Calendar modules
- [ ] Directives use Vue 3 lifecycle hooks
- [ ] All bus calls use mitt API (on/off/emit without $ prefix)
- [ ] Service classes function correctly with Vue 3 reactivity

## Commits

Final commit message: `p07-01-calendar-core`

## Post-Commit Memory (async)

Record: Vue.set→direct assignment; Vue.nextTick→import nextTick; Vue 2→3 directive lifecycle mapping.

## Rollback

- Restore all Calendar module files from git

## Handoff

Next: `phase-07/p07-02-calendar-components.md`
State: Calendar services and directives migrated. Vue component files remain.
