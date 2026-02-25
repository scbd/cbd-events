import { vi, describe, it, expect, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockGet, mockSelected } = vi.hoisted(() => {
  const mockSelected = { value: null }
  const mockGet      = vi.fn(async () => {})
  return { mockGet, mockSelected }
})

vi.mock('~/stores/conferences', () => ({
  useConferencesStore: () => ({
    get selected() { return mockSelected.value },
    get           : mockGet
  })
}))

// ---------------------------------------------------------------------------
// Subject under test (imported AFTER mocks are in place)
// ---------------------------------------------------------------------------
import redirectsMiddleware from '~/middleware/redirects'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('redirects middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockSelected.value = null
  })

  it('fetches conference and redirects to code when no route params', async () => {
    mockGet.mockImplementation(async () => { mockSelected.value = { code: 'cop-16' } })

    await redirectsMiddleware({ params: {} })

    expect(mockGet).toHaveBeenCalledOnce()
    expect(globalThis.navigateTo).toHaveBeenCalledWith('/cop-16')
  })

  it('does not redirect when route already has params', async () => {
    mockSelected.value = { code: 'cop-16' }

    await redirectsMiddleware({ params: { conferenceCode: 'cop-16' } })

    expect(globalThis.navigateTo).not.toHaveBeenCalled()
  })

  it('does not redirect when no conference code is available', async () => {
    mockSelected.value = null

    await redirectsMiddleware({ params: {} })

    expect(globalThis.navigateTo).not.toHaveBeenCalled()
  })

  it('skips get() when conference is already selected', async () => {
    mockSelected.value = { code: 'cop-16' }

    await redirectsMiddleware({ params: {} })

    expect(mockGet).not.toHaveBeenCalled()
  })
})
