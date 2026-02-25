import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() so variables are available when vi.mock factories run
// ---------------------------------------------------------------------------

const { mockFetch, mockCapacitorUpdater, mockGlobalFetch } = vi.hoisted(() => {
  const mockCapacitorUpdater = {
    current        : vi.fn(),
    download       : vi.fn(),
    set            : vi.fn(),
    notifyAppReady : vi.fn(),
    reload         : vi.fn(),
    addListener    : vi.fn(),
  }

  return {
    mockFetch            : vi.fn(),
    mockCapacitorUpdater,
    mockGlobalFetch      : vi.fn(),
  }
})

vi.mock('@capgo/capacitor-updater', () => ({
  CapacitorUpdater: mockCapacitorUpdater,
}))

vi.mock('ofetch', () => ({
  $fetch: mockFetch,
}))

vi.mock('#app', () => ({
  useNuxtApp: () => ({}),
  useRuntimeConfig: () => ({
    public: { appVersion: '2.3.1' },
  }),
}))

// Stub global fetch for HEAD requests in distFileExists
global.fetch = mockGlobalFetch

import { getVersionOTA, needsUpdateOTA, updateOTA, useOta } from '~/composables/useOta.js'

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const releaseAt = (tag_name) => ({ tag_name, name: tag_name, id: 1, body: '', assets: [] })

function resetMocks() {
  vi.clearAllMocks()

  // Sane default: not native builtin
  mockCapacitorUpdater.current.mockResolvedValue({ bundle: { version: '2.2.0' } })

  // HEAD check succeeds by default
  mockGlobalFetch.mockResolvedValue({ ok: true })

  // Download/set succeed
  mockCapacitorUpdater.download.mockResolvedValue({ version: '2.3.0' })
  mockCapacitorUpdater.set.mockResolvedValue(undefined)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useOta', () => {
  beforeEach(resetMocks)
  afterEach(() => vi.clearAllMocks())

  it('returns checkForUpdate and applyUpdate', () => {
    const ota = useOta()

    expect(typeof ota.checkForUpdate).toBe('function')
    expect(typeof ota.applyUpdate).toBe('function')
  })
})

describe('getVersionOTA', () => {
  beforeEach(resetMocks)

  it('returns bundle version when not native builtin', async () => {
    mockCapacitorUpdater.current.mockResolvedValue({ bundle: { version: '2.2.0' } })
    const v = await getVersionOTA()

    expect(v).toBe('2.2.0')
  })

  it('returns appVersion from runtimeConfig when bundle is builtin', async () => {
    mockCapacitorUpdater.current.mockResolvedValue({ bundle: { version: 'builtin' } })
    const v = await getVersionOTA()

    expect(v).toBe('2.3.1')
  })
})

describe('needsUpdateOTA', () => {
  beforeEach(resetMocks)

  it('returns latest version string when a newer same-major release exists', async () => {
    mockFetch.mockResolvedValue([
      releaseAt('v2.3.0'),
      releaseAt('v2.3.1'),   // same as current — excluded
      releaseAt('v2.4.0'),   // newer, same major → included
      releaseAt('v3.0.0'),   // different major → excluded
    ])

    const result = await needsUpdateOTA()

    expect(result).toBe('2.4.0')
  })

  it('returns false when no newer release exists', async () => {
    mockFetch.mockResolvedValue([
      releaseAt('v2.0.0'),
      releaseAt('v2.1.0'),
    ])

    const result = await needsUpdateOTA()

    expect(result).toBe(false)
  })

  it('excludes cross-major releases', async () => {
    mockFetch.mockResolvedValue([
      releaseAt('v3.0.0'),
      releaseAt('v3.1.0'),
    ])

    const result = await needsUpdateOTA()

    expect(result).toBe(false)
  })

  it('picks the highest version when multiple candidates exist', async () => {
    mockFetch.mockResolvedValue([
      releaseAt('v2.4.0'),
      releaseAt('v2.5.0'),
      releaseAt('v2.6.0'),
    ])

    const result = await needsUpdateOTA()

    expect(result).toBe('2.6.0')
  })

  it('returns undefined when $fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('network error'))

    const result = await needsUpdateOTA()

    expect(result).toBe(false)
  })
})

describe('updateOTA', () => {
  beforeEach(resetMocks)

  it('downloads and applies update when newer version exists', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.4.0') ])
    mockGlobalFetch.mockResolvedValue({ ok: true })
    mockCapacitorUpdater.download.mockResolvedValue({ version: '2.4.0', path: '/tmp/bundle.zip' })

    await updateOTA()

    expect(mockCapacitorUpdater.download).toHaveBeenCalledWith({
      version: '2.4.0',
      url    : 'https://attachments.cbd.int/cbd-events/releases/2/4/0/dist.zip',
    })
    expect(mockCapacitorUpdater.set).toHaveBeenCalled()
    expect(mockCapacitorUpdater.notifyAppReady).toHaveBeenCalled()
    expect(mockCapacitorUpdater.reload).toHaveBeenCalled()
  })

  it('exits early when no update available', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.0.0') ])

    await updateOTA()

    expect(mockCapacitorUpdater.download).not.toHaveBeenCalled()
  })

  it('exits early when dist file does not exist', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.4.0') ])
    mockGlobalFetch.mockResolvedValue({ ok: false })

    await updateOTA()

    expect(mockCapacitorUpdater.download).not.toHaveBeenCalled()
  })

  it('registers progress listener when progressFnc provided', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.4.0') ])
    const onProgress = vi.fn()

    await updateOTA(onProgress)

    expect(mockCapacitorUpdater.addListener).toHaveBeenCalledWith('download', onProgress)
  })

  it('registers error listener when errorFnc provided', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.4.0') ])
    const onError = vi.fn()

    await updateOTA(null, onError)

    expect(mockCapacitorUpdater.addListener).toHaveBeenCalledWith('updateFailed', expect.any(Function))
  })

  it('uses HEAD check to verify dist url exists', async () => {
    mockFetch.mockResolvedValue([ releaseAt('v2.4.0') ])

    await updateOTA()

    expect(mockGlobalFetch).toHaveBeenCalledWith(
      'https://attachments.cbd.int/cbd-events/releases/2/4/0/dist.zip',
      { method: 'HEAD' }
    )
  })
})
