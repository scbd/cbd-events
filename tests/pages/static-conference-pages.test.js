// Tests for p06-02 — static & conference info pages migration
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises                  } from '@vue/test-utils'
import { defineComponent, ref                  } from 'vue'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockAboutGet,
  mockArticleGet,
  mockConferencesGet,
  mockConferencesClearAll,
  mockSetRoutesMeetingNav,
  mockSetLocale,
  mockRouterGo,
  mockRouterPush,
} = vi.hoisted(() => ({
  mockAboutGet              : vi.fn().mockResolvedValue(undefined),
  mockArticleGet            : vi.fn().mockResolvedValue(undefined),
  mockConferencesGet        : vi.fn().mockResolvedValue(undefined),
  mockConferencesClearAll   : vi.fn(),
  mockSetRoutesMeetingNav   : vi.fn(),
  mockSetLocale             : vi.fn().mockResolvedValue(undefined),
  mockRouterGo              : vi.fn(),
  mockRouterPush            : vi.fn(),
}))

// storeToRefs wraps plain mock object refs in extra ObjectRef (double-nesting).
// Return properties straight from the store so refs stay as single-level.
vi.mock('pinia', async (importOriginal) => {
  const pinia = await importOriginal()
  return {
    ...pinia,
    storeToRefs: (store) => {
      const result = {}
      for (const key in store) {
        if (typeof store[key] !== 'function') result[key] = store[key]
      }
      return result
    },
  }
})

vi.mock('~/stores/about', () => ({
  useAboutStore: () => ({ get: mockAboutGet }),
}))

vi.mock('~/stores/article', () => ({
  useArticleStore: () => ({ get: mockArticleGet }),
}))

vi.mock('~/stores/routes', () => ({
  useRoutesStore: () => ({
    setShowMeetingNav: mockSetRoutesMeetingNav,
    prevRoute        : ref({ name: 'conferenceCode___en', params: {} }),
  }),
}))

vi.mock('~/stores/conferences', () => ({
  useConferencesStore: () => ({
    clearAll    : mockConferencesClearAll,
    get         : mockConferencesGet,
    docs        : mockConferenceDocs,
    meetingCode : ref('meeting-01'),
    startDate   : ref(null),
    conferenceCal: ref(null),
    selectedApp : ref({}),
    showCalendar: ref(true),
  }),
}))

vi.mock('~/stores/files', () => ({
  useFilesStore: () => ({
    hasDownloads: ref(false),
  }),
}))

vi.mock('~/composables/use-bus', () => ({
  useBus: () => ({ on: vi.fn(), off: vi.fn(), emit: vi.fn() }),
}))

// ── override global useI18n stub to track setLocale ──────────────────────
vi.stubGlobal('useI18n', vi.fn(() => ({
  t        : (k) => k,
  locale   : ref('en'),
  locales  : ref([{ code: 'en' }, { code: 'fr' }]),
  setLocale: mockSetLocale,
})))

// ── override global router stubs to track calls ───────────────────────────
vi.stubGlobal('useRouter', vi.fn(() => ({
  push   : mockRouterPush,
  go     : mockRouterGo,
  replace: vi.fn(),
})))

// ---------------------------------------------------------------------------
// Imports AFTER mocks (vi.hoisted + vi.mock execute before module transform)
// ---------------------------------------------------------------------------
import AboutPage       from '~/pages/[conferenceCode]/about.vue'
import ConferenceIndex from '~/pages/[conferenceCode]/index.vue'
import ConferencesPage from '~/pages/[conferenceCode]/conferences.vue'
import LanguagesPage   from '~/pages/[conferenceCode]/languages.vue'

// Module-level ref — declared after imports so ref() is available
const mockConferenceDocs = ref([])

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Wraps an async-setup component in <Suspense> so top-level await resolves.
async function mountAsync(Component) {
  const wrapper = mount(
    defineComponent({
      components: { Comp: Component },
      template  : '<Suspense><Comp /></Suspense>',
    }),
    {
      global: {
        stubs: {
          NuxtLink: true,
          Icon    : true,
          Article : true,
          Header  : true,
        },
        mocks: { $t: (k) => k },
      },
    }
  )

  await flushPromises()

  return wrapper
}

function mountSync(Component) {
  return mount(Component, {
    global: {
      stubs: { Header: true, NuxtLink: true, Icon: true, Article: true },
      mocks: { $t: (k) => k },
    },
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('static-conference-pages', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 1. about page ─────────────────────────────────────────────────────

  it('about page — calls aboutStore.get with conferenceCode from route', async () => {
    await mountAsync(AboutPage)

    expect(mockAboutGet).toHaveBeenCalledOnce()
    expect(mockAboutGet).toHaveBeenCalledWith('cbd-test')
  })

  it('about page — disables meeting nav on load', async () => {
    await mountAsync(AboutPage)

    expect(mockSetRoutesMeetingNav).toHaveBeenCalledWith(false)
  })

  // ── 2. conference index page ──────────────────────────────────────────

  it('conference index — calls aboutStore.get with conferenceCode', async () => {
    await mountAsync(ConferenceIndex)

    expect(mockAboutGet).toHaveBeenCalledWith('cbd-test')
  })

  it('conference index — calls articleStore.get with home tag', async () => {
    await mountAsync(ConferenceIndex)

    expect(mockArticleGet).toHaveBeenCalledWith(
      { code: 'cbd-test', tag: 'cbd-events-home' },
      true
    )
  })

  // ── 3. conferences page — bottom-screen layout ────────────────────────

  it('conferences page — declares bottom-screen layout via definePageMeta', () => {
    mountSync(ConferencesPage)

    expect(globalThis.definePageMeta).toHaveBeenCalledWith({ layout: 'bottom-screen' })
  })

  it('conferences page — changeConference clears store, fetches new code, navigates', async () => {
    mockConferenceDocs.value = [{
      _id: 'c1', code: 'cop-17', hasMeetings: true,
      apps: { cbdEvents: { title: { en: 'COP-17' } } },
    }]

    const wrapper = mountSync(ConferencesPage)

    await wrapper.find('.col').trigger('click')
    await flushPromises()

    expect(mockConferencesClearAll).toHaveBeenCalledOnce()
    expect(mockConferencesGet).toHaveBeenCalledWith('cop-17')
  })

  // ── 4. languages page — setLocale ─────────────────────────────────────

  it('languages page — declares bottom-screen layout via definePageMeta', () => {
    mountSync(LanguagesPage)

    expect(globalThis.definePageMeta).toHaveBeenCalledWith({ layout: 'bottom-screen' })
  })

  it('languages page — changeLanguage calls setLocale with locale code', async () => {
    const wrapper = mountSync(LanguagesPage)

    // click the first locale item (code: 'en')
    await wrapper.find('.list-group-item').trigger('click')
    await flushPromises()

    expect(mockSetLocale).toHaveBeenCalledOnce()
    expect(mockSetLocale).toHaveBeenCalledWith('en')
  })
})
