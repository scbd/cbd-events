import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia          } from 'pinia'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() ensures variables exist when vi.mock factory runs
// ---------------------------------------------------------------------------

const { mockArticleStore, mockHttp } = vi.hoisted(() => {
  const makeStore = () => ({
    _data     : {},
    getItem   : vi.fn(function (k) { return Promise.resolve(this._data[k] ?? null) }),
    setItem   : vi.fn(function (k, v) { this._data[k] = v; return Promise.resolve(v) }),
    removeItem: vi.fn(function (k) { delete this._data[k]; return Promise.resolve() }),
    clear     : vi.fn(function () { this._data = {}; return Promise.resolve() }),
  })

  return { mockArticleStore: makeStore(), mockHttp: vi.fn() }
})

vi.mock('~/composables/use-local-forage.js', () => ({
  useLocalForage: () => ({ article: mockArticleStore }),
  default        : { article: mockArticleStore },
}))

vi.mock('ofetch', () => ({
  $fetch: mockHttp,
}))

vi.mock('#app', () => ({
  useNuxtApp: () => ({}),
}))

function resetStores() {
  mockArticleStore._data = {}
  vi.clearAllMocks()
}

import { useArticleStore } from '~/stores/article.js'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ARTICLE_A = {
  title      : { en: 'News about COP16' },
  summary    : { en: 'Summary text' },
  content    : { en: 'Article content' },
  coverImage : { url: 'https://example.com/cover.jpg' },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useArticleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    resetStores()
  })

  // ── Initial state ──────────────────────────────────────────────────────

  it('initializes with empty docs', () => {
    const store = useArticleStore()

    expect(store.docs).toEqual({})
  })

  // ── get() edge cases ───────────────────────────────────────────────────

  it('get({}) returns undefined when no code provided', async () => {
    const store  = useArticleStore()
    const result = await store.get({})

    expect(result).toBeUndefined()
    expect(mockHttp).not.toHaveBeenCalled()
  })

  it('get() with no args returns undefined', async () => {
    const store  = useArticleStore()
    const result = await store.get()

    expect(result).toBeUndefined()
    expect(mockHttp).not.toHaveBeenCalled()
  })

  // ── fetch from API, composite key ──────────────────────────────────────

  it('fetches from API, saves with composite key, returns article', async () => {
    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(new Uint8Array([1, 2]))

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16', tag: 'news' })

    expect(result).toMatchObject({ title: ARTICLE_A.title })
    expect(result.blob).toBeDefined()
    expect(mockArticleStore.setItem).toHaveBeenCalledWith('cop16-news', expect.objectContaining({ title: ARTICLE_A.title }))
    expect(store.docs['cop16-news']).toBeDefined()
  })

  it('uses composite key ${code}-${tag} in docs', async () => {
    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(undefined)

    const store = useArticleStore()

    await store.get({ code: 'cop16', tag: 'biodiversity' })

    expect(store.docs['cop16-biodiversity']).toBeDefined()
    expect(store.docs['cop16']).toBeUndefined()
  })

  it('different tags are stored under separate keys', async () => {
    const article2 = { ...ARTICLE_A, title: { en: 'Another Article' } }

    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce([article2])
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue([]) // background refreshes

    const store = useArticleStore()

    await store.get({ code: 'cop16', tag: 'news' })
    await store.get({ code: 'cop16', tag: 'science' })

    expect(store.docs['cop16-news']).toBeDefined()
    expect(store.docs['cop16-science']).toBeDefined()
  })

  it('returns undefined when API returns no articles', async () => {
    mockHttp.mockResolvedValueOnce([])

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16', tag: 'missing' })

    expect(result).toBeUndefined()
    expect(mockArticleStore.setItem).not.toHaveBeenCalled()
  })

  it('returns undefined when API throws', async () => {
    mockHttp.mockRejectedValueOnce(new Error('network error'))

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16', tag: 'news' })

    expect(result).toBeUndefined()
  })

  // ── localForage fallback ───────────────────────────────────────────────

  it('returns article from localForage when not in memory', async () => {
    mockArticleStore._data['cop16-news'] = ARTICLE_A
    mockHttp.mockResolvedValue([]) // background refresh

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16', tag: 'news' })

    expect(result).toEqual(ARTICLE_A)
    expect(mockArticleStore.getItem).toHaveBeenCalledWith('cop16-news')
    expect(store.docs['cop16-news']).toEqual(ARTICLE_A)
  })

  it('populates docs via composite key from localForage', async () => {
    mockArticleStore._data['cop15-science'] = ARTICLE_A
    mockHttp.mockResolvedValue([])

    const store = useArticleStore()

    await store.get({ code: 'cop15', tag: 'science' })

    expect(store.docs['cop15-science']).toEqual(ARTICLE_A)
  })

  // ── in-memory cache ────────────────────────────────────────────────────

  it('returns from memory without hitting localForage', async () => {
    const store = useArticleStore()

    store.docs['cop16-news'] = ARTICLE_A
    mockHttp.mockResolvedValue([]) // background refresh

    const result = await store.get({ code: 'cop16', tag: 'news' })

    expect(result).toEqual(ARTICLE_A)
    expect(mockArticleStore.getItem).not.toHaveBeenCalled()
  })

  // ── force flag ─────────────────────────────────────────────────────────

  it('force=true bypasses cache and calls API even when in memory', async () => {
    const store = useArticleStore()

    store.docs['cop16-news'] = ARTICLE_A

    const freshArticle = { ...ARTICLE_A, title: { en: 'Updated News' } }

    mockHttp
      .mockResolvedValueOnce([freshArticle])
      .mockResolvedValueOnce(undefined)

    const result = await store.get({ code: 'cop16', tag: 'news' }, true)

    expect(result).toMatchObject({ title: freshArticle.title })
    expect(mockHttp).toHaveBeenCalled()
  })

  // ── no-tag fallback ────────────────────────────────────────────────────

  it('get without tag still works using undefined key segment', async () => {
    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(undefined)

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16' })

    expect(result).toBeDefined()
    expect(store.docs['cop16-undefined']).toBeDefined()
  })

  // ── coverImage fallback ────────────────────────────────────────────────

  it('handles article with no coverImage without throwing', async () => {
    const articleNoImg = { ...ARTICLE_A, coverImage: undefined }

    mockHttp.mockResolvedValueOnce([articleNoImg])

    const store  = useArticleStore()
    const result = await store.get({ code: 'cop16', tag: 'news' })

    expect(result).toBeDefined()
    expect(result.blob).toBeUndefined()
  })
})
