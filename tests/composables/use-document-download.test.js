import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() so variables exist before vi.mock factory hoisting
// ---------------------------------------------------------------------------

const {
  mockFetch,
  mockFilesLoad, mockFilesSave, mockFilesSetDownloading,
  mockRoutesSetShowNavs,
  mockLoadingStart, mockLoadingFinish,
  mockOnMounted, mockOnBeforeUnmount,
} = vi.hoisted(() => {
  const mockLoadingStart  = vi.fn()
  const mockLoadingFinish = vi.fn()

  return {
    mockFetch               : vi.fn(),
    mockFilesLoad           : vi.fn(),
    mockFilesSave           : vi.fn(),
    mockFilesSetDownloading : vi.fn(),
    mockRoutesSetShowNavs   : vi.fn(),
    mockLoadingStart,
    mockLoadingFinish,
    mockOnMounted           : vi.fn(),
    mockOnBeforeUnmount     : vi.fn(),
  }
})

// Mock Vue lifecycle hooks to avoid "outside setup()" warnings and capture callbacks
vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    onMounted       : mockOnMounted,
    onBeforeUnmount : mockOnBeforeUnmount,
  }
})

vi.mock('ofetch', () => ({ $fetch: mockFetch }))

vi.mock('object-sizeof', () => ({ default: () => 1024 }))

vi.mock('~/stores/files', () => ({
  useFilesStore: () => ({
    load          : mockFilesLoad,
    save          : mockFilesSave,
    setDownloading: mockFilesSetDownloading,
  }),
}))

vi.mock('~/stores/routes', () => ({
  useRoutesStore: () => ({
    setShowNavs: mockRoutesSetShowNavs,
  }),
}))

vi.mock('#app', () => ({
  useNuxtApp      : () => ({ $swal: vi.fn() }),
  useRuntimeConfig: () => ({ public: { iframeHost: 'https://www.cbd.int' } }),
}))

// Override the global stub from setup.js with test-specific spies
vi.stubGlobal('useLoadingIndicator', () => ({ start: mockLoadingStart, finish: mockLoadingFinish }))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { conferenceCode: 'cop15', meetingCode: 'wg2024' },
  }),
}))

import { useDocumentDownload } from '~/composables/useDocumentDownload.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeIframeRef(el = null) {
  return ref(el)
}

function makeMessageEvent(data) {
  return { data }
}

function makeMessage(files = []) {
  return { type: 'saveFiles', data: files }
}

function makeFileData(overrides = {}) {
  return { name: 'https://cdn.int/path/to/doc.pdf', size: 0, date: '2024-01-01', ...overrides }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useDocumentDownload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFilesLoad.mockResolvedValue(undefined)
    mockFilesSave.mockResolvedValue(undefined)
    mockFilesSetDownloading.mockReturnValue(undefined)
    mockRoutesSetShowNavs.mockReturnValue(undefined)
    mockLoadingStart.mockReturnValue(undefined)
    mockLoadingFinish.mockReturnValue(undefined)
  })

  // --- API shape ---

  it('returns expected functions', () => {
    const result = useDocumentDownload(makeIframeRef())

    expect(result).toHaveProperty('saveFiles')
    expect(result).toHaveProperty('getFileName')
    expect(result).toHaveProperty('createFileObj')
    expect(result).toHaveProperty('closeDialog')
  })

  it('registers onMounted and onBeforeUnmount lifecycle hooks', () => {
    useDocumentDownload(makeIframeRef())

    expect(mockOnMounted).toHaveBeenCalledOnce()
    expect(mockOnBeforeUnmount).toHaveBeenCalledOnce()
  })

  // --- getFileName ---

  it('getFileName builds path from conferenceCode, meetingCode and url basename', () => {
    const { getFileName } = useDocumentDownload(makeIframeRef())

    expect(getFileName('https://api.cbd.int/files/report.pdf'))
      .toBe('/cbd-events/cop15/wg2024/report.pdf')
  })

  it('getFileName strips query-string from url', () => {
    const { getFileName } = useDocumentDownload(makeIframeRef())

    expect(getFileName('https://api.cbd.int/files/report.pdf?token=abc'))
      .toBe('/cbd-events/cop15/wg2024/report.pdf')
  })

  // --- createFileObj ---

  it('createFileObj populates name, baseName, size, lastModified', () => {
    const { createFileObj } = useDocumentDownload(makeIframeRef())
    const fileData          = makeFileData()
    const blob              = { size: 5000 }
    const result            = createFileObj(fileData, blob)

    expect(result.name).toBe('/cbd-events/cop15/wg2024/doc.pdf')
    expect(result.baseName).toBe('doc.pdf')
    expect(result.size).toBe(5000)
    expect(result.lastModified).toBe('2024-01-01')
  })

  it('createFileObj falls back to sizeOf when blob has no size', () => {
    const { createFileObj } = useDocumentDownload(makeIframeRef())
    const fileData          = makeFileData({ size: 0 })
    const result            = createFileObj(fileData, {})

    expect(result.size).toBe(1024) // object-sizeof mock returns 1024
  })

  // --- saveFiles: early return ---

  it('saveFiles ignores messages with wrong type', async () => {
    const { saveFiles } = useDocumentDownload(makeIframeRef())

    await saveFiles(makeMessageEvent({ type: 'otherEvent' }))

    expect(mockFilesLoad).not.toHaveBeenCalled()
    expect(mockFilesSave).not.toHaveBeenCalled()
  })

  it('saveFiles ignores empty/null event data', async () => {
    const { saveFiles } = useDocumentDownload(makeIframeRef())

    await saveFiles(makeMessageEvent(null))

    expect(mockFilesLoad).not.toHaveBeenCalled()
  })

  // --- saveFiles: full flow ---

  it('saveFiles calls setShowNavs, setDownloading, save, load, then closeDialog', async () => {
    const mockContentWindow = { postMessage: vi.fn() }
    const iframeEl          = { contentWindow: mockContentWindow }
    const iframeRef         = ref(iframeEl)

    const { saveFiles } = useDocumentDownload(iframeRef)

    const fileData = makeFileData({ size: 100 })
    const blob     = new Blob(['data'])

    mockFetch.mockResolvedValue(blob)

    // Stub FileReader to avoid happy-dom limitations with readAsDataURL.
    // onload is assigned after readAsDataURL is called, so use queueMicrotask
    // to fire it asynchronously (after the assignment).
    class MockFileReader {
      constructor() {
        this.result  = 'data:application/pdf;base64,abc123'
        this.onload  = null
        this.onerror = null
      }

      readAsDataURL() {
        queueMicrotask(() => { if (this.onload) this.onload() })
      }
    }

    global.FileReader = MockFileReader

    await saveFiles(makeMessageEvent(makeMessage([fileData])))

    expect(mockRoutesSetShowNavs).toHaveBeenCalledWith(true)
    expect(mockLoadingStart).toHaveBeenCalled()
    expect(mockFilesSetDownloading).toHaveBeenCalledWith(true)
    expect(mockFilesSave).toHaveBeenCalled()
    expect(mockFilesLoad).toHaveBeenCalled()
    expect(mockLoadingFinish).toHaveBeenCalled()
    expect(mockFilesSetDownloading).toHaveBeenCalledWith(false)
    expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
      JSON.stringify({ type: 'closeDialogRemote' }),
      'https://www.cbd.int'
    )
  })

  // --- closeDialog ---

  it('closeDialog posts closeDialogRemote to iframe contentWindow', () => {
    const mockContentWindow = { postMessage: vi.fn() }
    const iframeRef         = ref({ contentWindow: mockContentWindow })

    const { closeDialog } = useDocumentDownload(iframeRef)

    closeDialog()

    expect(mockContentWindow.postMessage).toHaveBeenCalledWith(
      JSON.stringify({ type: 'closeDialogRemote' }),
      'https://www.cbd.int'
    )
  })

  it('closeDialog does not throw when iframeRef is null', () => {
    const { closeDialog } = useDocumentDownload(ref(null))

    expect(() => closeDialog()).not.toThrow()
  })
})
