import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia          } from 'pinia'

// ---------------------------------------------------------------------------
// Mocks — must be hoisted before store import
// ---------------------------------------------------------------------------

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $axios: {},
    $i18n : { locale: { value: 'en' } }
  })
}))

// Mock http composable so no real HTTP calls are made
vi.mock('~/composables/http', () => ({
  default: vi.fn()
}))

import { useConferencesStore } from '~/stores/conferences.js'
import http from '~/composables/http'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MOCK_CONFERENCE = {
  id          : 'conf-1',
  code        : 'cop16',
  active      : true,
  startDate   : '2025-10-20',
  endDate     : '2025-11-01',
  timezone    : 'America/Bogota',
  majorEventIds: ['oid1', 'oid2'],
  conference  : { menus: null },
  apps        : {
    cbdEvents: {
      heroImage   : null,
      image       : null,
      hideCalendar: false,
      useMenus    : false
    },
    conferenceCal: { enabled: true }
  }
}

const MOCK_MEETING = {
  code  : 'sbi',
  evtCd : 'SBI',
  title : { en: 'SBI Meeting' },
  agenda: {
    prefix: 'SBSTTA/',
    items : [{ id: 1, title: 'Item 1' }]
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useConferencesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('initializes with empty state', () => {
    const store = useConferencesStore()
    expect(store.docs).toEqual([])
    expect(store.selected).toBe(false)
    expect(store.selectedMeeting).toBe(false)
    expect(store.meetings).toEqual([])
  })

  // -------------------------------------------------------------------------
  // setSelected / setSelectedMeeting / clearAll mutations
  // -------------------------------------------------------------------------

  it('setSelected clears meetings and sets selected', () => {
    const store = useConferencesStore()
    store.meetings        = [MOCK_MEETING]
    store.selectedMeeting = MOCK_MEETING

    store.setSelected(MOCK_CONFERENCE)

    expect(store.selected.code).toBe('cop16')
    expect(store.meetings).toEqual([])
    expect(store.selectedMeeting).toBe(false)
  })

  it('setSelected with falsy clears selected', () => {
    const store = useConferencesStore()
    store.setSelected(null)
    expect(store.selected).toBe(false)
  })

  it('setSelectedMeeting sets the meeting', () => {
    const store = useConferencesStore()
    store.setSelectedMeeting(MOCK_MEETING)
    expect(store.selectedMeeting.code).toBe('sbi')
  })

  it('clearAll resets all state', () => {
    const store = useConferencesStore()
    store.docs             = [MOCK_CONFERENCE]
    store.selected         = MOCK_CONFERENCE
    store.selectedMeeting  = MOCK_MEETING
    store.meetings         = [MOCK_MEETING]

    store.clearAll()

    expect(store.docs).toEqual([])
    expect(store.selected).toBe(false)
    expect(store.selectedMeeting).toBe(false)
    expect(store.meetings).toEqual([])
  })

  // -------------------------------------------------------------------------
  // Computed getters
  // -------------------------------------------------------------------------

  it('conference returns selected value', () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    expect(store.conference.code).toBe('cop16')
  })

  it('conference returns {} when selected is false', () => {
    const store = useConferencesStore()
    expect(store.conference).toBe(false)
  })

  it('meeting returns selectedMeeting value', () => {
    const store = useConferencesStore()
    store.selectedMeeting = MOCK_MEETING
    expect(store.meeting.code).toBe('sbi')
  })

  it('selectedApp returns apps.cbdEvents', () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    expect(store.selectedApp).toEqual(MOCK_CONFERENCE.apps.cbdEvents)
  })

  it('selectedApp returns {} when selected is false', () => {
    const store = useConferencesStore()
    expect(store.selectedApp).toEqual({})
  })

  it('conferenceId returns id', () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    expect(store.conferenceId).toBe('conf-1')
  })

  it('meetingCode returns evtCd from selectedMeeting', () => {
    const store = useConferencesStore()
    store.selectedMeeting = MOCK_MEETING
    expect(store.meetingCode).toBe('SBI')
  })

  it('meetingCode returns {} when no meeting', () => {
    const store = useConferencesStore()
    expect(store.meetingCode).toEqual({})
  })

  it('showCalendar returns true by default when hideCalendar missing', () => {
    const store = useConferencesStore()
    expect(store.showCalendar).toBe(true)
  })

  it('showCalendar returns true when hideCalendar is false', () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    expect(store.showCalendar).toBe(true)
  })

  it('showCalendar returns false when hideCalendar is true', () => {
    const store   = useConferencesStore()
    const conf    = JSON.parse(JSON.stringify(MOCK_CONFERENCE))
    conf.apps.cbdEvents.hideCalendar = true
    store.selected = conf
    expect(store.showCalendar).toBe(false)
  })

  it('conferenceCal returns apps.conferenceCal', () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    expect(store.conferenceCal).toEqual({ enabled: true })
  })

  it('agendaItems returns items array from selected meeting', () => {
    const store = useConferencesStore()
    store.selectedMeeting = MOCK_MEETING
    expect(store.agendaItems).toEqual([{ id: 1, title: 'Item 1' }])
  })

  it('agendaItems returns [] when no meeting', () => {
    const store = useConferencesStore()
    expect(store.agendaItems).toEqual([])
  })

  it('agendaPrefix returns prefix from selected meeting', () => {
    const store = useConferencesStore()
    store.selectedMeeting = MOCK_MEETING
    expect(store.agendaPrefix).toBe('SBSTTA/')
  })

  it('agenda returns full agenda object', () => {
    const store = useConferencesStore()
    store.selectedMeeting = MOCK_MEETING
    expect(store.agenda).toEqual(MOCK_MEETING.agenda)
  })

  // -------------------------------------------------------------------------
  // startDate computed
  // -------------------------------------------------------------------------

  it('startDate returns conference startDate when now is before conference', () => {
    const store = useConferencesStore()
    store.selected = {
      ...MOCK_CONFERENCE,
      startDate: '2099-01-01',
      endDate  : '2099-01-10'
    }
    expect(store.startDate).toBe('2099-01-01')
  })

  it('startDate returns null when no selected', () => {
    const store = useConferencesStore()
    expect(store.startDate).toBeNull()
  })

  // -------------------------------------------------------------------------
  // Function helpers
  // -------------------------------------------------------------------------

  it('byCode returns matching conference', () => {
    const store = useConferencesStore()
    store.docs = [MOCK_CONFERENCE]
    expect(store.byCode('cop16').id).toBe('conf-1')
  })

  it('byCode returns false when not found', () => {
    const store = useConferencesStore()
    store.docs = [MOCK_CONFERENCE]
    expect(store.byCode('unknown')).toBe(false)
  })

  it('byCode returns false when docs empty', () => {
    const store = useConferencesStore()
    expect(store.byCode('cop16')).toBe(false)
  })

  it('forceDate returns datetime param string when valid date', () => {
    const store = useConferencesStore()
    expect(store.forceDate('2025-10-25')).toBe('&datetime=2025-10-25')
  })

  it('forceDate returns empty string for invalid date', () => {
    const store = useConferencesStore()
    expect(store.forceDate('not-a-date')).toBe('')
  })

  it('isInSession returns true when conference is active', () => {
    const store = useConferencesStore()
    store.selected = { ...MOCK_CONFERENCE, active: true }
    expect(store.isInSession(null)).toBe(true)
  })

  it('isInSession returns false when no selected', () => {
    const store = useConferencesStore()
    expect(store.isInSession(null)).toBe(false)
  })

  // -------------------------------------------------------------------------
  // get() action
  // -------------------------------------------------------------------------

  it('get() populates docs and selected when conference code provided', async () => {
    const store = useConferencesStore()

    // First call: conferences API; second call: meetings API
    http
      .mockResolvedValueOnce([MOCK_CONFERENCE])
      .mockResolvedValueOnce([MOCK_MEETING])

    await store.get('cop16')

    expect(store.docs[0].code).toBe('cop16')
    expect(store.selected.code).toBe('cop16')
  })

  it('get() returns cached docs if already selected', async () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE
    store.docs     = [MOCK_CONFERENCE]

    const result = await store.get('cop16')

    expect(http).not.toHaveBeenCalled()
    expect(result).toEqual([MOCK_CONFERENCE])
  })

  // -------------------------------------------------------------------------
  // getMeetings() action
  // -------------------------------------------------------------------------

  it('getMeetings() populates meetings and sets selectedMeeting', async () => {
    const store = useConferencesStore()
    store.selected = MOCK_CONFERENCE

    http.mockResolvedValueOnce([MOCK_MEETING])

    await store.getMeetings()

    expect(store.meetings[0].code).toBe('sbi')
    expect(store.selectedMeeting.code).toBe('sbi')
  })

  it('getMeetings() returns [] when no selected conference', async () => {
    const store = useConferencesStore()
    const result = await store.getMeetings()
    expect(result).toEqual([])
    expect(http).not.toHaveBeenCalled()
  })
})
