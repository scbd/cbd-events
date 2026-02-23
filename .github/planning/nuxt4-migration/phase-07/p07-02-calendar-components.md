# Task: Calendar Vue components migration

**ID:** p07-02
**Status:** pending
**Depends on:** p07-01
**Context size:** large
**Branch:** `p07-02-calendar-components`
**Target LOC:** ~400 (max 400)

## Goal

Convert all Calendar Vue components from Options API to Composition API with `<script setup>`. Handle the critical `this.$children` removal.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p07-02-calendar-components`
3. Memory recall (async)

## Inputs

- Phase context: `phase-07/context.md`
- All Calendar Vue components:
  - `components/calendar/src/components/index.vue` (root)
  - `components/calendar/src/components/body/cal-body.vue`
  - `components/calendar/src/components/body/cal-week-row.vue`
  - `components/calendar/src/components/body/CalDayCell.vue` (if exists)
  - `components/calendar/src/components/event/cal-event.vue`
  - `components/calendar/src/components/event/cal-event-details.vue`
  - `components/calendar/src/components/header/cal-header.vue`
  - `components/calendar/src/components/footer/cal-footer.vue`

## Steps

1. **Migrate `index.vue`** (root Calendar component):
   - Convert to `<script setup>` with `defineProps`, `defineEmits`
   - `beforeCreate` i18n message injection → top-level in `<script setup>`:
     ```js
     const { mergeLocaleMessage } = useI18n()
     for (const locale in messages)
       mergeLocaleMessage(locale, messages[locale])
     ```
   - Register directives locally or via plugin
   - Initialize services in setup

2. **Migrate `cal-body.vue`** (CRITICAL — uses `this.$children`):
   - `this.$children[0].$refs` is **removed in Vue 3**
   - Replace with explicit template refs:
     ```vue
     <script setup>
     const weekRowRef = useTemplateRef('weekRow')
     // Access: weekRowRef.value.$refs.day or weekRowRef.value.someMethod()
     </script>
     <template>
       <CalWeekRow ref="weekRow" ... />
     </template>
     ```
   - Or use provide/inject for parent-child communication
   - Study what `this.$children[0].$refs` accesses and find the minimal replacement

3. **Migrate cal-week-row.vue**:
   - `this.$refs.day` for scroll-to-element
   - Convert to `<script setup>` with template refs

4. **Migrate cal-event.vue and cal-event-details.vue**:
   - `this.$refs.eventCalTitle` for style manipulation
   - Event bus calls → mitt
   - `process.client` → `import.meta.client`
   - Convert to `<script setup>`

5. **Migrate cal-header.vue and cal-footer.vue**:
   - Simpler components
   - Convert to `<script setup>`

6. **Register Calendar directives** in root Calendar component or as Nuxt plugin:
   ```js
   // In Calendar index.vue setup or via vApp directive registration
   const vLineClamp = LineClampDirective
   const vScroll = ScrollDirective
   ```

## Testing

- [ ] Unit test: Calendar root initializes without errors
- [ ] Unit test: CalBody accesses week rows via template refs (not $children)
- [ ] Unit test: CalEvent renders event data correctly
- [ ] Unit test: i18n messages merged correctly on setup

## Outputs

- Updated: all Calendar Vue component files converted to `<script setup>`

## Done When

- [ ] All Calendar components use `<script setup>`
- [ ] No `this.$children` access — replaced with template refs
- [ ] No `this.$set`, `Vue.set`, or Vue 2 event bus patterns
- [ ] i18n messages injected in setup
- [ ] Directives registered correctly for Vue 3
- [ ] Calendar renders and functions correctly as a unit

## Commits

Final commit message: `p07-02-calendar-components`

## Post-Commit Memory (async)

Record: $children removal → template refs; beforeCreate i18n → setup-level mergeLocaleMessage; Calendar is now fully Vue 3.

## Rollback

- Restore all Calendar component files from git

## Handoff

Next: `phase-08/p08-01-i18n-upgrade.md`
State: Calendar widget fully migrated. Ready for final cleanup phase.
