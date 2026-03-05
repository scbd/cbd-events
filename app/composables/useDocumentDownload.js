import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute               } from 'vue-router'
import { useNuxtApp, useRuntimeConfig } from '#app'
import { $fetch                 } from 'ofetch'
import   sizeOf                   from 'object-sizeof'
import { useFilesStore          } from '~/stores/files'
import { useRoutesStore         } from '~/stores/routes'

// ---------------------------------------------------------------------------
// Private helpers (pure — no store refs)
// ---------------------------------------------------------------------------

/** Extract filename from a URL path, stripping query-string. */
function _basename(url) {
  return decodeURIComponent(url.split('/').pop().split('?')[0])
}

function _convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(blob)
    reader.onload  = () => resolve(reader.result.toString())
    reader.onerror = (error) => reject(error)
  })
}

function _getBlobs({ data = [] }) {
  const promises = data.map(({ url }) =>
    $fetch(url, { responseType: 'blob' }).then(_convertBlobToBase64)
  )

  return Promise.all(promises)
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------

/**
 * Replaces the Vue 2 documentDownloadMixin.
 *
 * Handles postMessage-based file downloads from an embedded iframe.
 * Pass the template ref for the iframe as `iframeRef`.
 *
 * @param {import('vue').Ref} iframeRef - ref pointing to the <iframe> element
 */
export function useDocumentDownload(iframeRef) {
  const route            = useRoute()
  const filesStore       = useFilesStore()
  const routesStore      = useRoutesStore()
  const { $swal }        = useNuxtApp()
  const config           = useRuntimeConfig()
  const loadingIndicator = useLoadingIndicator()

  // -------------------------------------------------------------------------
  // Internal helpers (need composable context for route/store)
  // -------------------------------------------------------------------------

  function getFileName(fileUrl) {
    const name           = _basename(fileUrl)
    const conferenceCode = route.params.conferenceCode
    const meetingCode    = route.params.meetingCode

    return `/cbd-events/${conferenceCode}/${meetingCode}/${name}`
  }

  function createFileObj(fileData, blob) {
    fileData.name         = getFileName(fileData.name)
    fileData.baseName     = _basename(fileData.name)
    fileData.size         = fileData.size || blob?.size || sizeOf(blob)
    fileData.lastModified = fileData.date

    return fileData
  }

  function _getFileObjs({ data = [] }, blobs) {
    return data.map((fileData, i) => createFileObj(fileData, blobs[i]))
  }

  function closeDialog() {
    iframeRef?.value?.contentWindow?.postMessage(
      JSON.stringify({ type: 'closeDialogRemote' }),
      config.public.iframeHost
    )
  }

  async function saveFiles(event) {
    const msg = event.data

    if (msg?.type !== 'saveFiles') return

    routesStore.setShowNavs(true)
    loadingIndicator.start()
    filesStore.setDownloading(true)

    const blobs    = await _getBlobs(msg)
    const fileObjs = _getFileObjs(msg, blobs)

    try {
      await filesStore.save({ files: fileObjs, blobs })
      await filesStore.load()
    } catch(e) {
      console.error(e)
    }

    loadingIndicator.finish()
    await filesStore.load()
    filesStore.setDownloading(false)
    closeDialog()
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  onMounted(() => {
    if (!import.meta.client) return

    filesStore.load()
    window.addEventListener('message', saveFiles)

    if (iframeRef?.value)
      iframeRef.value.onload = () => loadingIndicator.finish()

    loadingIndicator.start()
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) return

    window.removeEventListener('message', saveFiles)
    loadingIndicator.finish()
  })

  return { saveFiles, getFileName, createFileObj, closeDialog }
}
