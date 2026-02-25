import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRoutesStore } from '~/stores/routes.js'

describe('useRoutesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty defaults', () => {
    const store = useRoutesStore()
    expect(store.route).toEqual({})
    expect(store.prevRoute).toEqual({})
    expect(store.initialized).toBe(false)
    expect(store.showMeetingNav).toBe(false)
    expect(store.showNavs).toBe(true)
  })

  it('setRoute updates route and prevRoute', () => {
    const store    = useRoutesStore()
    const route1   = { name: 'home', path: '/', params: {}, query: {} }
    const route2   = { name: 'about', path: '/about', params: {}, query: {} }
    store.setRoute(route1)
    store.setRoute(route2)
    expect(store.route.name).toBe('about')
    expect(store.prevRoute.name).toBe('home')
  })

  it('setRoute sets initialized on first call', () => {
    const store = useRoutesStore()
    expect(store.initialized).toBe(false)
    store.setRoute({ name: 'home', path: '/', params: {}, query: {} })
    expect(store.initialized).toBe(true)
  })

  it('conferenceCode derived from route params', () => {
    const store = useRoutesStore()
    store.setRoute({ name: 'conf', path: '/cop16', params: { conferenceCode: 'cop16' }, query: {} })
    expect(store.conferenceCode).toBe('cop16')
  })

  it('meetingCode derived from route params', () => {
    const store = useRoutesStore()
    store.setRoute({ name: 'mtg', path: '/cop16/sbi', params: { conferenceCode: 'cop16', meetingCode: 'sbi' }, query: {} })
    expect(store.meetingCode).toBe('sbi')
  })

  it('conferenceCode returns empty string when not in params', () => {
    const store = useRoutesStore()
    expect(store.conferenceCode).toBe('')
  })

  it('setShowMeetingNav toggles flag', () => {
    const store = useRoutesStore()
    store.setShowMeetingNav(true)
    expect(store.showMeetingNav).toBe(true)
    store.setShowMeetingNav(false)
    expect(store.showMeetingNav).toBe(false)
  })

  it('setShowNavs toggles flag', () => {
    const store = useRoutesStore()
    store.setShowNavs(false)
    expect(store.showNavs).toBe(false)
  })

  it('toggleMeetings flips showMeetings', () => {
    const store = useRoutesStore()
    expect(store.showMeetings).toBe(false)
    store.toggleMeetings()
    expect(store.showMeetings).toBe(true)
    store.toggleMeetings()
    expect(store.showMeetings).toBe(false)
  })
})
