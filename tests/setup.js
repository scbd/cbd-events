// Global test setup — stubs Nuxt auto-imported globals so middleware/composables
// and pages that use them can be tested without a running Nuxt instance.

import { vi  } from 'vitest'
import { ref } from 'vue'

// ── Nuxt route-middleware helpers ──────────────────────────────────────────
vi.stubGlobal('defineNuxtRouteMiddleware', (fn) => fn)
vi.stubGlobal('navigateTo', vi.fn())

// ── Nuxt page/layout macro ─────────────────────────────────────────────────
vi.stubGlobal('definePageMeta', vi.fn())

// ── Nuxt data-fetching ─────────────────────────────────────────────────────
vi.stubGlobal('useAsyncData', vi.fn(async (key, fn) => ({
  data   : ref(fn ? await fn().catch(() => null) : null),
  pending: ref(false),
  error  : ref(null),
})))

// ── Nuxt routing ──────────────────────────────────────────────────────────
vi.stubGlobal('useRoute', vi.fn(() => ({
  params: { conferenceCode: 'cbd-test', meetingCode: 'meeting-01' },
  query : {},
  name  : 'conferenceCode',
})))

vi.stubGlobal('useRouter', vi.fn(() => ({
  push   : vi.fn(),
  go     : vi.fn(),
  replace: vi.fn(),
})))

vi.stubGlobal('useLocalePath', vi.fn(() => (route) => '/' + (route?.name || '')))

// ── i18n ───────────────────────────────────────────────────────────────────
vi.stubGlobal('useI18n', vi.fn(() => ({
  t          : (k) => k,
  locale     : ref('en'),
  locales    : ref([{ code: 'en' }, { code: 'fr' }]),
  setLocale  : vi.fn().mockResolvedValue(undefined),
})))

// ── Nuxt app / runtime config ─────────────────────────────────────────────
vi.stubGlobal('useNuxtApp', vi.fn(() => ({
  $swal : { fire: vi.fn().mockResolvedValue({}) },
  $bus  : { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  $axios: {},
})))

vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    baseUrl    : 'https://cbd-events.cbd.int',
    iframeHost : 'https://www.cbd.int',
    api        : 'https://api.cbd.int',
    attachments: 'https://attachments.cbd.int',
    appVersion : '1.0.0',
  },
}))
