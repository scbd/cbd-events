import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia          } from 'pinia'

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() ensures variables exist when vi.mock factory runs
// ---------------------------------------------------------------------------

const { mockFilesStore, mockBlobsStore } = vi.hoisted(() => {
  const makeStore = () => ({
    _data     : {},
    getItem   : vi.fn(function (k) { return Promise.resolve(this._data[k] ?? null) }),
    setItem   : vi.fn(function (k, v) { this._data[k] = v; return Promise.resolve(v) }),
    removeItem: vi.fn(function (k) { delete this._data[k]; return Promise.resolve() }),
    clear     : vi.fn(function () { this._data = {}; return Promise.resolve() }),
    iterate   : vi.fn(function (cb) {
      const entries = Object.entries(this._data)
      for (let i = 0; i < entries.length; i++) {
        const result = cb(entries[i][1], entries[i][0], i + 1)
        if (result !== undefined) break
      }
      return Promise.resolve()
    }),
  })
  return { mockFilesStore: makeStore(), mockBlobsStore: makeStore() }
})

vi.mock('~/composables/use-local-forage.js', () => ({
  useLocalForage: () => ({ files: mockFilesStore, blobs: mockBlobsStore }),
  default        : { files: mockFilesStore, blobs: mockBlobsStore },
}))

// Re-seed mock state between tests
function resetStores() {
  mockFilesStore._data = {}
  mockBlobsStore._data = {}
  vi.clearAllMocks()
}

import { useFilesStore } from '~/stores/files.js'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const FILE_A = { name: 'doc-a.pdf', baseName: 'SBI/doc-a.pdf', size: 1024 }
const FILE_B = { name: 'doc-b.pdf', baseName: 'COP/doc-b.pdf', size: 2048 }
const BLOB_A = new Uint8Array([1, 2, 3])
const BLOB_B = new Uint8Array([4, 5, 6])

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useFilesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    resetStores()
  })

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('initializes with empty state', () => {
    const store = useFilesStore()
    expect(store.data).toEqual([])
    expect(store.downloading).toBe(false)
    expect(store.fileToOpen).toBe(false)
  })

  it('files computed mirrors data', () => {
    const store = useFilesStore()
    expect(store.files).toEqual([])
    store.data = [FILE_A]
    expect(store.files).toEqual([FILE_A])
  })

  it('hasDownloads is false when empty', () => {
    const store = useFilesStore()
    expect(store.hasDownloads).toBe(false)
  })

  it('hasDownloads is true when data has items', () => {
    const store = useFilesStore()
    store.data = [FILE_A]
    expect(store.hasDownloads).toBe(true)
  })

  it('isDownloading reflects downloading state', () => {
    const store = useFilesStore()
    expect(store.isDownloading).toBe(false)
    store.setDownloading(true)
    expect(store.isDownloading).toBe(true)
  })

  // -------------------------------------------------------------------------
  // totalSize
  // -------------------------------------------------------------------------

  it('totalSize sums file sizes', () => {
    const store = useFilesStore()
    store.data = [FILE_A, FILE_B]
    expect(store.totalSize).toBe(3072)
  })

  it('totalSize is 0 when empty', () => {
    const store = useFilesStore()
    expect(store.totalSize).toBe(0)
  })

  it('totalSize treats missing size as 0', () => {
    const store = useFilesStore()
    store.data = [{ name: 'x.pdf', baseName: 'x.pdf' }]
    expect(store.totalSize).toBe(0)
  })

  // -------------------------------------------------------------------------
  // getByMeeting
  // -------------------------------------------------------------------------

  it('getByMeeting filters by baseName substring', () => {
    const store = useFilesStore()
    store.data = [FILE_A, FILE_B]
    expect(store.getByMeeting('SBI')).toEqual([FILE_A])
    expect(store.getByMeeting('COP')).toEqual([FILE_B])
  })

  it('getByMeeting returns empty array when no match', () => {
    const store = useFilesStore()
    store.data = [FILE_A, FILE_B]
    expect(store.getByMeeting('SBSTTA')).toEqual([])
  })

  // -------------------------------------------------------------------------
  // getFileByName
  // -------------------------------------------------------------------------

  it('getFileByName finds file by name', () => {
    const store = useFilesStore()
    store.data = [FILE_A, FILE_B]
    expect(store.getFileByName('doc-a.pdf')).toEqual(FILE_A)
  })

  it('getFileByName returns undefined when not found', () => {
    const store = useFilesStore()
    store.data = [FILE_A]
    expect(store.getFileByName('missing.pdf')).toBeUndefined()
  })

  // -------------------------------------------------------------------------
  // setDownloading / setFileToOpen
  // -------------------------------------------------------------------------

  it('setDownloading(true) sets downloading', () => {
    const store = useFilesStore()
    store.setDownloading(true)
    expect(store.downloading).toBe(true)
  })

  it('setDownloading(false) clears downloading', () => {
    const store = useFilesStore()
    store.setDownloading(true)
    store.setDownloading(false)
    expect(store.downloading).toBe(false)
  })

  it('setFileToOpen sets file', () => {
    const store = useFilesStore()
    store.setFileToOpen(FILE_A)
    expect(store.fileToOpen).toEqual(FILE_A)
  })

  it('setFileToOpen() with no arg resets to false', () => {
    const store = useFilesStore()
    store.setFileToOpen(FILE_A)
    store.setFileToOpen()
    expect(store.fileToOpen).toBe(false)
  })

  // -------------------------------------------------------------------------
  // load — populate data from localForage
  // -------------------------------------------------------------------------

  it('load populates data from localForage files store', async () => {
    mockFilesStore._data = { 'doc-a.pdf': FILE_A, 'doc-b.pdf': FILE_B }
    mockBlobsStore._data = { 'doc-a.pdf': BLOB_A, 'doc-b.pdf': BLOB_B }

    const store = useFilesStore()
    await store.load()

    expect(store.data).toHaveLength(2)
  })

  it('load attaches blobs to file metadata', async () => {
    mockFilesStore._data = { 'doc-a.pdf': { ...FILE_A } }
    mockBlobsStore._data = { 'doc-a.pdf': BLOB_A }

    const store = useFilesStore()
    await store.load()

    expect(store.data[0].blob).toBe(BLOB_A)
  })

  it('load does not update data when storage is empty', async () => {
    const store = useFilesStore()
    await store.load()
    expect(store.data).toEqual([])
  })

  it('iterate collects all items with curly bracket pattern', async () => {
    mockFilesStore._data = { a: FILE_A, b: FILE_B }

    const items = []
    await mockFilesStore.iterate((value) => { items.push(value) })

    expect(items).toHaveLength(2)
  })

  // -------------------------------------------------------------------------
  // save — single object
  // -------------------------------------------------------------------------

  it('save stores single file metadata and blob in localForage', () => {
    const store = useFilesStore()
    store.save({ files: FILE_A, blobs: BLOB_A })

    expect(mockFilesStore.setItem).toHaveBeenCalledWith(FILE_A.name, FILE_A)
    expect(mockBlobsStore.setItem).toHaveBeenCalledWith(FILE_A.name, BLOB_A)
  })

  it('save adds file to data array', () => {
    const store = useFilesStore()
    store.save({ files: FILE_A, blobs: BLOB_A })
    expect(store.data).toHaveLength(1)
    expect(store.data[0].name).toBe('doc-a.pdf')
  })

  it('save attaches blob to cloned file object', () => {
    const store = useFilesStore()
    store.save({ files: FILE_A, blobs: BLOB_A })
    expect(store.data[0].blob).toBe(BLOB_A)
  })

  it('save does not add duplicate file', () => {
    const store = useFilesStore()
    store.save({ files: FILE_A, blobs: BLOB_A })
    store.save({ files: FILE_A, blobs: BLOB_A })
    expect(store.data).toHaveLength(1)
  })

  // -------------------------------------------------------------------------
  // save — array
  // -------------------------------------------------------------------------

  it('save stores array of files', () => {
    const store = useFilesStore()
    store.save({ files: [FILE_A, FILE_B], blobs: [BLOB_A, BLOB_B] })

    expect(store.data).toHaveLength(2)
    expect(mockFilesStore.setItem).toHaveBeenCalledTimes(2)
    expect(mockBlobsStore.setItem).toHaveBeenCalledTimes(2)
  })

  // -------------------------------------------------------------------------
  // remove — all
  // -------------------------------------------------------------------------

  it('removeAll clears data and localForage', async () => {
    const store = useFilesStore()
    store.data  = [FILE_A, FILE_B]

    await store.removeAll()

    expect(store.data).toEqual([])
    expect(mockFilesStore.clear).toHaveBeenCalled()
    expect(mockBlobsStore.clear).toHaveBeenCalled()
  })

  it('remove with matching count calls removeAll', async () => {
    const store = useFilesStore()
    store.data  = [FILE_A, FILE_B]

    await store.remove([FILE_A, FILE_B])

    expect(mockFilesStore.clear).toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // remove — array
  // -------------------------------------------------------------------------

  it('remove array deletes specific files from data and storage', async () => {
    const store = useFilesStore()
    store.data  = [FILE_A, FILE_B]

    await store.remove([FILE_A])

    expect(store.data).toHaveLength(1)
    expect(store.data[0].name).toBe('doc-b.pdf')
    expect(mockFilesStore.removeItem).toHaveBeenCalledWith('doc-a.pdf')
    expect(mockBlobsStore.removeItem).toHaveBeenCalledWith('doc-a.pdf')
  })
})
