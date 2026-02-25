import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { $fetch             } from 'ofetch'
import   semverMajor          from 'semver/functions/major'
import   semver               from 'semver'
import { useRuntimeConfig    } from '#app'

// ---------------------------------------------------------------------------
// Public composable API
// ---------------------------------------------------------------------------

export const useOta = () => ({ checkForUpdate: needsUpdateOTA, applyUpdate: updateOTA })

// ---------------------------------------------------------------------------
// Named exports — kept for backward compat with components (Phase 06 will clean up)
// ---------------------------------------------------------------------------

export const getVersionOTA = async () => {
  const { version } = (await CapacitorUpdater.current()).bundle

  return (await isNativeVersion()) ? useRuntimeConfig().public.appVersion : version
}

export const needsUpdateOTA = async () => {
  const version = await getLatestReleaseVersion()

  return version ? version : !!version
}

export const updateOTA = async (progressFnc, errorFnc) => {
  const needsUpdate = await needsUpdateOTA()
  const url         = await getDistUrl(needsUpdate)

  if (!needsUpdate || !url) return

  if (progressFnc)
    CapacitorUpdater.addListener('download', progressFnc)

  if (errorFnc)
    CapacitorUpdater.addListener('updateFailed', (e) => { errorFnc(e); CapacitorUpdater.reload() })

  const state = await CapacitorUpdater.download({ version: needsUpdate, url })

  await CapacitorUpdater.set(state)

  CapacitorUpdater.notifyAppReady()
  CapacitorUpdater.reload()
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function getDistUrl(version) {
  if (!version) return undefined

  const distPathPartial = version.replaceAll('.', '/')
  const distUrl         = `https://attachments.cbd.int/cbd-events/releases/${distPathPartial}/dist.zip`

  return (await distFileExists(distUrl)) ? distUrl : undefined
}

async function distFileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })

    return response.ok
  } catch (e) {
    console.error('useOta.distFileExists')
    console.error(e)
    return false
  }
}

async function isNativeVersion() {
  const { version } = (await CapacitorUpdater.current()).bundle

  return version === 'builtin'
}

async function getLatestReleaseVersion() {
  try {
    const currentVersion = semver.clean(useRuntimeConfig().public.appVersion)
    const [ latest ]     = (await getReleaseData()).filter(majorGreaterFilter(currentVersion)).sort(semverSortObjects).reverse()

    return latest ? semver.clean(latest.tag_name) : latest
  } catch (e) {
    console.error('useOta.getLatestReleaseVersion', e.message)
    return undefined
  }
}

function majorGreaterFilter(currentVersion) {
  return ({ tag_name }) => {
    const majorVersion = semverMajor(currentVersion)
    const tag          = semver.clean(tag_name)
    const isSameMajor  = semver.satisfies(tag, `${majorVersion}.x`)
    const isGreater    = semver.gt(tag, currentVersion)

    return isSameMajor && isGreater
  }
}

function semverSortObjects(a, b) {
  const tagA = semver.clean(a.tag_name)
  const tagB = semver.clean(b.tag_name)

  if (semver.lt(tagA, tagB)) return -1
  if (semver.gt(tagA, tagB)) return 1

  return 0
}

async function getReleaseData() {
  try {
    const url = 'https://cbddocumentspublic-imagebucket-15w2zyxk3prl8.s3.amazonaws.com/cbd-events/releases/index.json'

    return await $fetch(url)
  } catch (e) {
    return []
  }
}

// Release item shape:
// { id, name, body, tag_name, assets: [ { id, name, size, browser_download_url } ] }
