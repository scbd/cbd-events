import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia          } from 'pinia'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() ensures variables exist when vi.mock factory runs
// ---------------------------------------------------------------------------

const { mockAboutStore, mockHttp } = vi.hoisted(() => {
  const makeStore = () => ({
    _data     : {},
    getItem   : vi.fn(function (k) { return Promise.resolve(this._data[k] ?? null) }),
    setItem   : vi.fn(function (k, v) { this._data[k] = v; return Promise.resolve(v) }),
    removeItem: vi.fn(function (k) { delete this._data[k]; return Promise.resolve() }),
    clear     : vi.fn(function () { this._data = {}; return Promise.resolve() }),
  })

  return { mockAboutStore: makeStore(), mockHttp: vi.fn() }
})

vi.mock('~/composables/use-local-forage.js', () => ({
  useLocalForage: () => ({ about: mockAboutStore }),
  default        : { about: mockAboutStore },
}))

vi.mock('#app', () => ({
  useNuxtApp: () => ({ $axios: {} }),
}))

vi.mock('~/composables/http', () => ({
  default: mockHttp,
}))

function resetStores() {
  mockAboutStore._data = {}
  vi.clearAllMocks()
}

import { useAboutStore } from '~/stores/about.js'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const ARTICLE_A = {
  title      : { en: 'About COP16' },
  summary    : { en: 'Summary' },
  content    : { en: 'Content' },
  coverImage : { url: 'https://example.com/cover.jpg' },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useAboutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    resetStores()
  })

  // ── Initial state ──────────────────────────────────────────────────────

  it('initializes with empty docs', () => {
    const store = useAboutStore()

    expect(store.docs).toEqual({})
  })

  // ── get() edge cases ───────────────────────────────────────────────────

  it('get(undefined) returns undefined without hitting API', async () => {
    const store  = useAboutStore()
    const result = await store.get(undefined)

    expect(result).toBeUndefined()
    expect(mockHttp).not.toHaveBeenCalled()
  })

  it('get(null) returns undefined without hitting API', async () => {
    const store  = useAboutStore()
    const result = await store.get(null)

    expect(result).toBeUndefined()
    expect(mockHttp).not.toHaveBeenCalled()
  })

  // ── fetch from API, cache in localForage ───────────────────────────────

  it('fetches from API when not cached, saves to localForage, returns article', async () => {
    const articleWithBlob = { ...ARTICLE_A, blob: new Uint8Array([1, 2]) }

    // First call = article list, second = blob
    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(new Uint8Array([1, 2]))

    const store  = useAboutStore()
    const result = await store.get('cop16')

    expect(result).toMatchObject({ title: ARTICLE_A.title })
    expect(result.blob).toBeDefined()
    expect(mockAboutStore.setItem).toHaveBeenCalledWith('cop16', expect.objectContaining({ title: ARTICLE_A.title }))
    expect(store.docs['cop16']).toBeDefined()
  })

  it('returns undefined when API returns no articles', async () => {
    mockHttp.mockResolvedValueOnce([])

    const store  = useAboutStore()
    const result = await store.get('unknown-conf')

    expect(result).toBeUndefined()
    expect(mockAboutStore.setItem).not.toHaveBeenCalled()
  })

  it('returns undefined when API throws', async () => {
    mockHttp.mockRejectedValueOnce(new Error('network error'))

    const store  = useAboutStore()
    const result = await store.get('cop16')

    expect(result).toBeUndefined()
  })

  // ── localForage fallback ───────────────────────────────────────────────

  it('returns article from localForage when not in memory', async () => {
    mockAboutStore._data['cop16'] = ARTICLE_A
    // subsequent background refresh will hit API — mock it to resolve empty
    mockHttp.mockResolvedValue([])

    const store  = useAboutStore()
    const result = await store.get('cop16')

    expect(result).toEqual(ARTICLE_A)
    expect(mockAboutStore.getItem).toHaveBeenCalledWith('cop16')
    // memory updated
    expect(store.docs['cop16']).toEqual(ARTICLE_A)
  })

  it('populates docs from localForage hit', async () => {
    mockAboutStore._data['cop15'] = ARTICLE_A
    mockHttp.mockResolvedValue([]) // background refresh returns empty

    const store = useAboutStore()

    await store.get('cop15')
    expect(store.docs['cop15']).toEqual(ARTICLE_A)
  })

  // ── in-memory cache ────────────────────────────────────────────────────

  it('returns from memory without hitting localForage again', async () => {
    const store = useAboutStore()

    store.docs['cop16'] = ARTICLE_A
    mockHttp.mockResolvedValue([]) // background refresh

    const result = await store.get('cop16')

    expect(result).toEqual(ARTICLE_A)
    // localForage.getItem should NOT have been called for primary read
    expect(mockAboutStore.getItem).not.toHaveBeenCalled()
  })

  // ── force flag ─────────────────────────────────────────────────────────

  it('force=true bypasses cache and calls API even when article is in memory', async () => {
    const store = useAboutStore()

    store.docs['cop16'] = ARTICLE_A

    const freshArticle = { ...ARTICLE_A, title: { en: 'Updated' } }

    mockHttp
      .mockResolvedValueOnce([freshArticle]) // API response
      .mockResolvedValueOnce(undefined)       // blob (no cover URL match)

    const result = await store.get('cop16', true)

    expect(result).toMatchObject({ title: freshArticle.title })
    expect(mockHttp).toHaveBeenCalled()
  })

  // ── save ───────────────────────────────────────────────────────────────

  it('saving an article writes to localForage', async () => {
    mockHttp
      .mockResolvedValueOnce([ARTICLE_A])
      .mockResolvedValueOnce(undefined)

    const store = useAboutStore()

    await store.get('cop16')

    expect(mockAboutStore.setItem).toHaveBeenCalledWith('cop16', expect.objectContaining({ title: ARTICLE_A.title }))
  })

  // ── coverImage fallback ────────────────────────────────────────────────

  it('handles article with no coverImage without throwing', async () => {
    const articleNoImg = { ...ARTICLE_A, coverImage: undefined }

    mockHttp.mockResolvedValueOnce([articleNoImg])

    const store  = useAboutStore()
    const result = await store.get('cop16')

    expect(result).toBeDefined()
    expect(result.blob).toBeUndefined()
  })
})
