import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia }          from 'pinia'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const { mockSelectedApp, mockSelected } = vi.hoisted(() => {
  const mockSelectedApp = vi.fn(() => ({}))
  const mockSelected    = vi.fn(() => false)

  return { mockSelectedApp, mockSelected }
})

vi.mock('~/stores/conferences', () => ({
  useConferencesStore: () => ({
    get selectedApp() { return mockSelectedApp() },
    get selected()    { return mockSelected()    },
  }),
}))

vi.mock('~/utils/filters', () => ({
  lstring: (val) => {
    if (!val) return undefined

    return val['en'] || val['fr'] || undefined
  },
}))

import { useCoverImage } from '~/composables/useCoverImage.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeApp(overrides = {}) {
  return {
    image    : 'https://cdn.example.com/img.jpg',
    heroImage: 'https://cdn.example.com/hero.jpg',
    title    : { en: 'COP15', fr: 'COP15 FR' },
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useCoverImage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockSelectedApp.mockReturnValue({})
    mockSelected.mockReturnValue(false)
  })

  // --- API shape ---

  it('returns expected keys', () => {
    const result = useCoverImage()

    expect(result).toHaveProperty('conference')
    expect(result).toHaveProperty('getImage')
    expect(result).toHaveProperty('getHeroImage')
    expect(result).toHaveProperty('title')
  })

  // --- conference ---

  it('conference returns selected from conferences store', () => {
    const conf = { code: 'cop15' }

    mockSelected.mockReturnValue(conf)

    const { conference } = useCoverImage()

    expect(conference.value).toEqual(conf)
  })

  it('conference returns {} when store throws', () => {
    mockSelected.mockImplementation(() => { throw new Error('store error') })

    const { conference } = useCoverImage()

    expect(conference.value).toEqual({})
  })

  // --- getImage ---

  it('getImage returns apps.cbdEvents.image', () => {
    mockSelectedApp.mockReturnValue(makeApp())

    const { getImage } = useCoverImage()

    expect(getImage.value).toBe('https://cdn.example.com/img.jpg')
  })

  it('getImage returns false when no image', () => {
    mockSelectedApp.mockReturnValue(makeApp({ image: undefined }))

    const { getImage } = useCoverImage()

    expect(getImage.value).toBe(false)
  })

  it('getImage returns false when selectedApp is empty', () => {
    mockSelectedApp.mockReturnValue({})

    const { getImage } = useCoverImage()

    expect(getImage.value).toBe(false)
  })

  // --- getHeroImage ---

  it('getHeroImage returns heroImage when present', () => {
    mockSelectedApp.mockReturnValue(makeApp())

    const { getHeroImage } = useCoverImage()

    expect(getHeroImage.value).toBe('https://cdn.example.com/hero.jpg')
  })

  it('getHeroImage falls back to getImage when no heroImage', () => {
    mockSelectedApp.mockReturnValue(makeApp({ heroImage: undefined }))

    const { getHeroImage } = useCoverImage()

    expect(getHeroImage.value).toBe('https://cdn.example.com/img.jpg')
  })

  it('getHeroImage returns false when neither heroImage nor image present', () => {
    mockSelectedApp.mockReturnValue(makeApp({ heroImage: undefined, image: undefined }))

    const { getHeroImage } = useCoverImage()

    expect(getHeroImage.value).toBe(false)
  })

  // --- title ---

  it('title applies lstring to apps.cbdEvents.title', () => {
    mockSelectedApp.mockReturnValue(makeApp())

    const { title } = useCoverImage()

    expect(title.value).toBe('COP15')
  })

  it('title returns undefined when no title', () => {
    mockSelectedApp.mockReturnValue(makeApp({ title: undefined }))

    const { title } = useCoverImage()

    expect(title.value).toBeUndefined()
  })

  it('title returns undefined when selectedApp throws (selectedApp catches to {})', () => {
    // When mockSelectedApp throws, the selectedApp computed catches it and returns {}.
    // title then calls lstring({}.title) = lstring(undefined) = undefined.
    mockSelectedApp.mockImplementation(() => { throw new Error('bad') })

    const { title } = useCoverImage()

    expect(title.value).toBeUndefined()
  })
})
