// Tests for p06-03 — article tag page, fileView page, and article component migration
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises                  } from '@vue/test-utils'
import { defineComponent, ref                  } from 'vue'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockArticleGet,
  mockSetRoutesMeetingNav,
  mockRouterGo,
  mockBusOn,
  mockBusOff,
  mockFetch,
} = vi.hoisted(() => ({
  mockArticleGet        : vi.fn().mockResolvedValue(undefined),
  mockSetRoutesMeetingNav: vi.fn(),
  mockRouterGo          : vi.fn(),
  mockBusOn             : vi.fn(),
  mockBusOff            : vi.fn(),
  mockFetch             : vi.fn().mockResolvedValue({ html: '<iframe src="test"></iframe>' }),
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

vi.mock('~/stores/article', () => ({
  useArticleStore: () => ({ get: mockArticleGet }),
}))

vi.mock('~/stores/routes', () => ({
  useRoutesStore: () => ({
    setShowMeetingNav: mockSetRoutesMeetingNav,
  }),
}))

vi.mock('~/stores/files', () => ({
  useFilesStore: () => ({
    fileToOpen: ref('blob:http://localhost/test-file'),
  }),
}))

vi.mock('~/composables/use-bus', () => ({
  useBus: () => ({ on: mockBusOn, off: mockBusOff, emit: vi.fn() }),
}))

vi.mock('ofetch', () => ({
  $fetch: mockFetch,
}))

// ── override global router stub to track go() calls ───────────────────────
vi.stubGlobal('useRouter', vi.fn(() => ({
  push   : vi.fn(),
  go     : mockRouterGo,
  replace: vi.fn(),
})))

// ── override global useRoute to include tag param for article page tests ──
vi.stubGlobal('useRoute', vi.fn(() => ({
  params: { conferenceCode: 'cbd-test', meetingCode: 'meeting-01', tag: 'my-tag' },
  query : {},
  name  : 'conferenceCode-article-tag',
})))

// ---------------------------------------------------------------------------
// Imports AFTER mocks
// ---------------------------------------------------------------------------
import ArticleTagPage from '~/pages/[conferenceCode]/article/[tag].vue'
import FileViewPage   from '~/pages/[conferenceCode]/file-view.vue'
import ArticleComp    from '~/components/article.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
          Article : true,
          Header  : true,
          Icon    : true,
        },
        mocks: { $t: (k) => k },
      },
    }
  )

  await flushPromises()

  return wrapper
}

function mountSync(Component, props = {}) {
  return mount(Component, {
    props,
    global: {
      stubs: { Header: true, NuxtLink: true, Icon: true, Article: true },
      mocks: { $t: (k) => k },
    },
  })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('article-fileview-pages', () => {
  beforeEach(() => vi.clearAllMocks())

  // ── 1. article [tag] page ─────────────────────────────────────────────

  it('article tag page — calls articleStore.get with conferenceCode and tag', async () => {
    await mountAsync(ArticleTagPage)

    expect(mockArticleGet).toHaveBeenCalledOnce()
    expect(mockArticleGet).toHaveBeenCalledWith({ code: 'cbd-test', tag: 'my-tag' })
  })

  it('article tag page — disables meeting nav on load', async () => {
    await mountAsync(ArticleTagPage)

    expect(mockSetRoutesMeetingNav).toHaveBeenCalledWith(false)
  })

  it('article tag page — renders Article stub when store returns data', async () => {
    mockArticleGet.mockResolvedValueOnce({
      title  : { en: 'Test Article' },
      content: { en: 'Body text' },
      blob   : null,
    })

    const wrapper = await mountAsync(ArticleTagPage)

    expect(wrapper.html()).toContain('article-stub')
  })

  // ── 2. file-view page ─────────────────────────────────────────────────

  it('file-view page — declares bottom-screen layout via definePageMeta', () => {
    mountSync(FileViewPage)

    expect(globalThis.definePageMeta).toHaveBeenCalledWith({ layout: 'bottom-screen' })
  })

  it('file-view page — registers bottom-screen-done bus listener on mount', () => {
    mountSync(FileViewPage)

    expect(mockBusOn).toHaveBeenCalledWith('bottom-screen-done', expect.any(Function))
  })

  it('file-view page — removes bus listener on unmount', () => {
    const wrapper = mountSync(FileViewPage)

    wrapper.unmount()

    expect(mockBusOff).toHaveBeenCalledWith('bottom-screen-done', expect.any(Function))
  })

  it('file-view page — done() calls router.go(-1)', () => {
    mountSync(FileViewPage)

    // Retrieve the handler registered with the bus and invoke it
    const [[, doneHandler]] = mockBusOn.mock.calls

    doneHandler()

    expect(mockRouterGo).toHaveBeenCalledWith(-1)
  })

  // ── 3. article component ──────────────────────────────────────────────

  it('article component — renders image and content when title is provided', () => {
    const wrapper = mountSync(ArticleComp, {
      title  : { en: 'Hello' },
      content: { en: '<p>Body</p>' },
      blob   : null,
    })

    expect(wrapper.find('.ck-content').exists()).toBe(true)
  })

  it('article component — does not render when title is falsy', () => {
    const wrapper = mountSync(ArticleComp, {
      title  : null,
      content: null,
      blob   : null,
    })

    expect(wrapper.find('.ck-content').exists()).toBe(false)
  })

  it('article component — renders hero image when blob is provided', () => {
    const wrapper = mountSync(ArticleComp, {
      title  : { en: 'Hello' },
      content: { en: '' },
      blob   : 'blob:http://localhost/123',
    })

    expect(wrapper.find('img.hero').exists()).toBe(true)
    expect(wrapper.find('img.hero').attributes('src')).toBe('blob:http://localhost/123')
  })
})
