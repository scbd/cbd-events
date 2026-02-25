import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOffLineStore } from '~/stores/off-line.js'

describe('useOffLineStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts online', () => {
    const store = useOffLineStore()
    expect(store.isOffLine).toBe(false)
    expect(store.isOnLine).toBe(true)
  })

  it('set(false) marks offline', () => {
    const store = useOffLineStore()
    store.set(false)
    expect(store.isOffLine).toBe(true)
    expect(store.isOnLine).toBe(false)
  })

  it('set(true) restores online', () => {
    const store = useOffLineStore()
    store.set(false)
    store.set(true)
    expect(store.isOffLine).toBe(false)
    expect(store.isOnLine).toBe(true)
  })

  it('toggle flips state', () => {
    const store = useOffLineStore()
    store.toggle()
    expect(store.isOffLine).toBe(true)
    store.toggle()
    expect(store.isOffLine).toBe(false)
  })

  it('isOnLine is always inverse of isOffLine', () => {
    const store = useOffLineStore()
    store.toggle()
    expect(store.isOnLine).toBe(!store.isOffLine)
  })
})
