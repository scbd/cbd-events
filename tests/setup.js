// Global test setup — stubs Nuxt auto-imported globals so middleware/composables
// that use them can be tested without a running Nuxt instance.

import { vi } from 'vitest'

// Nuxt route middleware helper (passthrough in tests)
vi.stubGlobal('defineNuxtRouteMiddleware', (fn) => fn)

// Nuxt navigation helper (spy by default; tests can override)
vi.stubGlobal('navigateTo', vi.fn())

// Nuxt runtime config helper — thin wrapper so tests don't need to import #app
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    baseUrl    : 'https://cbd-events.cbd.int',
    iframeHost : 'https://www.cbd.int',
    api        : 'https://api.cbd.int',
    attachments: 'https://attachments.cbd.int',
    appVersion : '1.0.0',
  },
}))
