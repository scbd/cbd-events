# Task: Bootstrap 4 → 5 migration

**ID:** p08-02
**Status:** pending
**Depends on:** p06-05, p07-02
**Context size:** medium
**Branch:** `p08-02-bootstrap5`
**Target LOC:** ~150 (max 400)

## Goal

Upgrade Bootstrap from 4.6 to 5.3. Update all HTML data attributes, utility class names, and SCSS imports.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p08-02-bootstrap5`
3. Memory recall (async)

## Inputs

- Phase context: `phase-08/context.md`
- `app/assets/app.scss` — Bootstrap SCSS import
- All .vue files — search for Bootstrap 4 patterns

## Steps

1. **Update `app/assets/app.scss`**:
   - `@import "bootstrap/scss/bootstrap"` stays the same (Bootstrap 5 uses same import path)
   - Verify SCSS compiles without errors with Bootstrap 5

2. **Search and replace data attributes** across all .vue files:
   ```bash
   grep -rn 'data-toggle\|data-target\|data-dismiss\|data-placement\|data-slide' app/ --include="*.vue"
   ```
   Replace:
   - `data-toggle=` → `data-bs-toggle=`
   - `data-target=` → `data-bs-target=`
   - `data-dismiss=` → `data-bs-dismiss=`
   - `data-placement=` → `data-bs-placement=`
   - `data-slide=` → `data-bs-slide=`

3. **Search and replace utility classes**:
   ```bash
   grep -rn 'ml-\|mr-\|pl-\|pr-\|text-left\|text-right\|float-left\|float-right' app/ --include="*.vue"
   ```
   Replace:
   - `ml-` → `ms-` (margin-left → margin-start)
   - `mr-` → `me-` (margin-right → margin-end)
   - `pl-` → `ps-` (padding-left → padding-start)
   - `pr-` → `pe-` (padding-right → padding-end)
   - `text-left` → `text-start`
   - `text-right` → `text-end`
   - `float-left` → `float-start`
   - `float-right` → `float-end`

4. **Check component-specific changes**:
   - `.close` button class → `.btn-close`
   - `.badge-*` → `.bg-*` for badge variants
   - Forms: verify `.form-control`, `.form-group` usage
   - `.media` component removed — replace with flex utilities

5. **Verify no jQuery usage** — Bootstrap 5 is jQuery-free ✅ (app doesn't use jQuery)

## Testing

- [ ] Visual test: verify all pages render correctly with Bootstrap 5
- [ ] Search codebase: no `data-toggle`, `data-target`, `ml-`, `mr-`, `pl-`, `pr-` remain
- [ ] SCSS compiles without errors

## Outputs

- Updated `app/assets/app.scss` (if needed)
- Updated .vue template files with Bootstrap 5 attributes and classes

## Done When

- [ ] Bootstrap 5.3 installed and SCSS compiles
- [ ] All data attributes updated to `data-bs-*`
- [ ] All directional utility classes use logical properties (ms/me/ps/pe/start/end)
- [ ] No Bootstrap 4 deprecated patterns remain

## Commits

Final commit message: `p08-02-bootstrap5`

## Post-Commit Memory (async)

Record: Bootstrap 4→5 class mapping; data-toggle→data-bs-toggle; ml→ms, mr→me utility changes.

## Rollback

- Revert all .vue file changes, downgrade bootstrap in package.json

## Handoff

Next: `phase-08/p08-03-dependency-cleanup.md`
State: Bootstrap 5 applied. Dependencies may have orphaned packages.
