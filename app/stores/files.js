import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalForage } from '~/composables/use-local-forage.js'

export const useFilesStore = defineStore('files', () => {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const data        = ref([])
  const downloading = ref(false)
  const fileToOpen  = ref(false)

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  const files         = computed(() => data.value)
  const hasDownloads  = computed(() => Boolean(data.value.length))
  const isDownloading = computed(() => Boolean(downloading.value))
  const totalSize     = computed(() => data.value.reduce((sum, f) => sum + (f.size || 0), 0))
  const getByMeeting  = computed(() => (meetingCode) =>
    data.value.filter((f) => f.baseName && f.baseName.includes(meetingCode))
  )
  const getFileByName = computed(() => (name) =>
    data.value.find((f) => f.name === name)
  )

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  async function load() {
    const { files: filesStore, blobs: blobsStore } = useLocalForage()
    const items = []

    try {
      await filesStore.iterate((value) => { items.push(value) })                             // curly brackets required — arrow body stops iteration on truthy return
      await blobsStore.iterate((value, key, n) => { if (items[n - 1]) items[n - 1].blob = value })

      if (items.length) data.value = items
    } catch (e) {
      console.error('Error:', e)
    }
  }

  function save({ files: filesMeta, blobs: blobsMeta }) {
    const { files: filesStore, blobs: blobsStore } = useLocalForage()

    try {
      if (Array.isArray(filesMeta)) {
        for (let i = 0; i < filesMeta.length; i++) {
          const clone = Object.assign({}, filesMeta[i])
          clone.blob  = blobsMeta[i]
          _pushFile(clone)
          filesStore.setItem(filesMeta[i].name, filesMeta[i])
          blobsStore.setItem(filesMeta[i].name, blobsMeta[i])
        }
      } else {
        const clone = Object.assign({}, filesMeta)
        clone.blob  = blobsMeta
        _pushFile(clone)
        filesStore.setItem(filesMeta.name, filesMeta)
        blobsStore.setItem(filesMeta.name, blobsMeta)
      }
    } catch (e) {
      console.error(`Error: ${e.message}`)
    }
  }

  async function remove(files = []) {
    const isArray = Array.isArray(files)
    const length  = isArray ? files.length : 0
    const isAll   = isArray && data.value.length === length

    if (isAll || !isArray) return removeAll()

    return _removeArrayOfFiles(files)
  }

  async function removeAll() {
    const { files: filesStore, blobs: blobsStore } = useLocalForage()
    data.value = []
    await filesStore.clear()
    await blobsStore.clear()
  }

  function setDownloading(val) {
    downloading.value = Boolean(val)
  }

  function setFileToOpen(file = false) {
    fileToOpen.value = file
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  function _pushFile(file) {
    if (data.value.find(({ name }) => name === file.name)) return
    data.value = [...data.value, file]
  }

  async function _removeArrayOfFiles(files) {
    const { files: filesStore, blobs: blobsStore } = useLocalForage()

    for (const file of files) {
      const { name } = file
      data.value = data.value.filter((f) => f.name !== name)
      await filesStore.removeItem(name)
      await blobsStore.removeItem(name)
    }
  }

  // ---------------------------------------------------------------------------
  // Exports
  // ---------------------------------------------------------------------------

  return {
    data, downloading, fileToOpen,
    files, hasDownloads, isDownloading, totalSize, getByMeeting, getFileByName,
    load, save, remove, removeAll, setDownloading, setFileToOpen,
  }
})
