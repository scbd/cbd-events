# Phase 05: Mixins → Composables

## Purpose

Convert Vue 2 mixins to Vue 3 Composition API composables. Mixins are removed in Vue 3's recommended patterns; composables provide the same code reuse with explicit dependencies and better TypeScript support.

## Shared Context

- Vue 2 mixins merge into component options (data, methods, computed, lifecycle) — implicit and order-dependent
- Vue 3 composables are explicit function calls that return reactive state and methods
- Mixin lifecycle hooks → composable uses `onMounted()`, `onBeforeUnmount()`, etc.
- Mixin `this.$store` → import Pinia store directly
- Mixin `this.$refs` → accept ref as parameter or use `useTemplateRef()`
- Mixin `this.$route` → `useRoute()`
- Mixin `this.$nuxt.$loading` → `useLoadingIndicator()` from Nuxt 4
- `process.client` / `process.server` → `import.meta.client` / `import.meta.server`

## Key Files

| File | Purpose | Composable |
|------|---------|------------|
| `app/utils/cover-image-mixin.js` | Hero image computed properties | `useCoverImage()` |
| `app/utils/document-download-mixin.js` | File download + iframe message handling | `useDocumentDownload()` |

## Constraints

- `useCoverImage()` used by: conference pages that display hero images
- `useDocumentDownload()` used by: agenda.vue, documents.vue
- `useDocumentDownload()` is the most complex mixin — handles iframe postMessage, file saving, loading indicators, and native file opening
- Both composables need Pinia stores (from Phase 03) and HTTP (from Phase 04)
