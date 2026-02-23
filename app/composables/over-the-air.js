import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { HTTP             } from '@ionic-native/http'
import   semverMajor        from 'semver/functions/major'
import   semver             from 'semver'

export const getVersionOTA = async () => {
  const { version } = (await CapacitorUpdater.current()).bundle


  return (await isNativeVersion())? process.env.NUXT_ENV_VERSION : version
}

export const needsUpdateOTA = async() => {
  const version = await getLatestReleaseVersion()

  return version? version : !!version
}

export const updateOTA = async (progressFnc, errorFnc) => {
  const needsUpdate = await needsUpdateOTA()
  const url         = await getDistUrl(needsUpdate)

  if(!needsUpdate || !url ) return

  if(progressFnc)
    CapacitorUpdater.addListener('download', progressFnc)

  if(errorFnc)
    CapacitorUpdater.addListener('updateFailed', (e) => { errorFnc(e); CapacitorUpdater.reload(); })

  const version          =   needsUpdate
  const capUpdaterParams = { version, url }

  const state = await CapacitorUpdater.download(capUpdaterParams)
  await CapacitorUpdater.set(state)

  CapacitorUpdater.notifyAppReady()
  CapacitorUpdater.reload()

  return test
}

async function getDistUrl(version){
  if(!version) return undefined

  const distPathPartial = version.replaceAll('.', '/')
  const distUrl         = `https://attachments.cbd.int/cbd-events/releases/${distPathPartial}/dist.zip`

  return (await distFileExists(distUrl))? distUrl : undefined
}

async function distFileExists(url){
  try{
    const { status } = await HTTP.sendRequest(url, { method: 'head' })

    return !!status
  }catch(e){
    console.error('over-the-air.distFileExists')
    console.error(e)
    return false
  }
}

async function isNativeVersion(){
  const { version }  = (await CapacitorUpdater.current()).bundle

  return version === 'builtin'
}

async function getLatestReleaseVersion(){
  try{
    const [ latest ] = (await getReleaseData()).filter(majorGreaterFilter).sort(semverSortObjects).reverse()

    return latest? semver.clean(latest.tag_name) : latest
  }catch(e){
    console.error('over-the-air.getLatestReleaseVersion', e.message)

    return undefined
  }
}

function majorGreaterFilter({ tag_name }){
  const currentVersion = semver.clean(process.env.NUXT_ENV_VERSION)
  const majorVersion   = semverMajor(currentVersion)
  const tag            = semver.clean(tag_name)
  const isSameMajor    = semver.satisfies(tag, `${majorVersion}.x`)
  const isGreater      = semver.gt(tag, currentVersion)

  return isSameMajor && isGreater
}

function semverSortObjects(a,b){
  const tagA = semver.clean(a.tag_name)
  const tagB = semver.clean(b.tag_name)

  if(semver.lt(tagA, tagB)) return -1
  if(semver.gt(tagA, tagB)) return 1

  return 0
}

async function getReleaseData(){
  try{
    const url = 'https://cbddocumentspublic-imagebucket-15w2zyxk3prl8.s3.amazonaws.com/cbd-events/releases/index.json'
    
    return HTTP.sendRequest(url, { method: 'get', responseType: 'json' }).then( (res) => res.data)
  }catch(e){
    return []
  }
}

// release template

// { id, name, body, tag_name, assets: [ { id, name, size, browser_download_url} ] }