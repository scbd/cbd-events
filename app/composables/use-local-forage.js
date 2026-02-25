import localForage from 'localforage'

class LocalForageStore {
  constructor(options) {
    this._instance = localForage.createInstance(options)
  }

  getItem(key) {
    return this._instance.getItem(key)
  }

  setItem(key, value) {
    return this._instance.setItem(key, value)
  }

  removeItem(key) {
    return this._instance.removeItem(key)
  }

  clear() {
    return this._instance.clear()
  }

  length() {
    return this._instance.length()
  }

  key(n) {
    return this._instance.key(n)
  }

  keys() {
    return this._instance.keys()
  }

  iterate(cb) {
    return this._instance.iterate(cb)
  }
}

const stores = {
  files: new LocalForageStore({ name: 'cbd-events', storeName: 'files' }),
  blobs: new LocalForageStore({ name: 'cbd-events', storeName: 'blobs' }),
  about: new LocalForageStore({ name: 'cbd-events', storeName: 'about' }),
  article: new LocalForageStore({ name: 'cbd-events', storeName: 'article' }),
}

export const useLocalForage = () => stores
export default stores
