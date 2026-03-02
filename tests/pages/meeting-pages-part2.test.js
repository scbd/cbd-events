// Tests for p06-05 — downloads, meetings, calendar, week-select page migration
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount                                 } from '@vue/test-utils'
import { ref, computed                         } from 'vue'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  mockSetShowMeetingNav,
  mockSetSelectedMeeting,
  mockSetFileToOpen,
  mockFilesLoad,
  mockSetOpenSafariFn,
  mockBusOn,
  mockBusOff,
  mockRouterGo,
  mockRouterPush,
  mockFetch,
} = vi.hoisted(() => ({
  mockSetShowMeetingNav : vi.fn(),
  mockSetSelectedMeeting: vi.fn(),
  mockSetFileToOpen     : vi.fn(),
  mockFilesLoad         : vi.fn().mockResolvedValue(undefined),
  mockSetOpenSafariFn   : vi.fn(),
  mockBusOn             : vi.fn(),
  mockBusOff            : vi.fn(),
  mockRouterGo          : vi.fn(),
  mockRouterPush        : vi.fn(),
  mockFetch             : vi.fn().mockResolvedValue({ response: { docs: [] } }),
}))

// ── storeToRefs passthrough ───────────────────────────────────────────────
vi.mock('pinia', async (importOriginal) => {
  const pinia = await importOriginal()
  return {
    ...pinia,
    storeToRefs: (store) => {
      const result = {}
      for (const key in store) {
        if (typeof store[key] !== 'function') result[key] = store[key]
      }
      return result
    },
  }
})

// ── Store mocks ───────────────────────────────────────────────────────────

vi.mock('~/stores/files', () => ({
  useFilesStore: () => ({
    files          : ref([
      { name: '/cbd-events/test/m1/doc.pdf', baseName: 'doc.pdf', type: 'application/pdf', size: 1024, lastModified: '2025-01-15T00:00:00Z' },
    ]),
    hasDownloads   : ref(true),
    meeting        : ref({ title: { en: 'Test Meeting' } }),
    load           : mockFilesLoad,
    setFileToOpen  : mockSetFileToOpen,
    setDownloading : vi.fn(),
  }),
}))

vi.mock('~/stores/conferences', () => ({
  useConferencesStore: () => ({
    meetings        : ref([
      { evtCd: 'CBD-16', id: '1', agenda: { items: [{ item: '1', title: 'Agenda Item 1' }] } },
      { evtCd: 'CP-MOP-11', id: '2' },
    ]),
    meeting         : ref({ title: { en: 'Test Meeting' } }),
    conference      : ref({ id: 'conf-1', startDate: '2025-01-01', endDate: '2025-01-15', apps: { cbdEvents: {} } }),
    conferenceId    : ref('conf-1'),
    setSelectedMeeting: mockSetSelectedMeeting,
  }),
}))

vi.mock('~/stores/routes', () => ({
  useRoutesStore: () => ({
    setShowMeetingNav: mockSetShowMeetingNav,
    showMeetingNav   : ref(false),
    prevRoute        : ref({ name: 'conferenceCode-meetingCode-agenda' }),
  }),
}))

vi.mock('~/composables/use-bus', () => ({
  useBus: () => ({ on: mockBusOn, off: mockBusOff, emit: vi.fn() }),
}))

vi.mock('~/composables/use-platform', () => ({
  usePlatform: () => ({ platform: 'ios', isNative: true }),
}))

vi.mock('~/utils/cordova-files', () => ({
  openFile       : vi.fn(),
  shareFile      : vi.fn(),
  setOpenSafariFn: mockSetOpenSafariFn,
}))

vi.mock('~/utils/mime-types', () => ({
  isPDF   : vi.fn((t) => t?.includes('pdf')),
  isMsWord: vi.fn(() => false),
}))

vi.mock('~/utils/device', () => ({
  isIpad: vi.fn(() => false),
}))

vi.mock('~/utils/filters', () => ({
  lstring    : (v) => v?.en || '',
  trimName   : (n) => n,
  timeDisplay: (d) => d,
  formatBytes: (b) => `${b} B`,
}))

vi.mock('~/utils/api-normalize', () => ({
  sanitizeIndexResult: vi.fn((docs) => docs),
}))

vi.mock('ofetch', () => ({
  $fetch: mockFetch,
}))

// ── CalendarWidget deep imports can't resolve in test env ─────────────────
vi.mock('~/components/calendar/src/components/index.vue', () => ({
  default: { name: 'CalendarWidget', template: '<div class="calendar-stub" />', props: ['options'] },
}))

// ── override global router ──────────────────────────────────────────────
vi.stubGlobal('useRouter', vi.fn(() => ({
  push   : mockRouterPush,
  go     : mockRouterGo,
  replace: vi.fn(),
})))

// ---------------------------------------------------------------------------
// Imports AFTER mocks
// ---------------------------------------------------------------------------
import DownloadsPage  from '~/pages/[conferenceCode]/[meetingCode]/downloads.vue'
import MeetingsPage   from '~/pages/[conferenceCode]/[meetingCode]/meetings.vue'
import CalendarPage   from '~/pages/[conferenceCode]/[meetingCode]/calendar.vue'
import WeekSelectPage from '~/pages/[conferenceCode]/[meetingCode]/week-select.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mountSync(Component, opts = {}) {
  return mount(Component, {
    global: {
      stubs: {
        Offline            : true,
        Icon               : true,
        CalendarWidget     : true,
        HeaderBottomScreen : true,
      },
      mocks: { $t: (k) => k },
      ...opts.global,
    },
  })
}

// ===========================================================================
// Downloads page
// ===========================================================================

describe('downloads page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls filesStore.load on setup', () => {
    mountSync(DownloadsPage)

    expect(mockFilesLoad).toHaveBeenCalledOnce()
  })

  it('sets meetingNav to false', () => {
    mountSync(DownloadsPage)

    expect(mockSetShowMeetingNav).toHaveBeenCalledWith(false)
  })

  it('registers openSafari callback on mount', () => {
    mountSync(DownloadsPage)

    expect(mockSetOpenSafariFn).toHaveBeenCalledOnce()
    expect(typeof mockSetOpenSawariFnCall()).toBe('function')

    function mockSetOpenSawariFnCall() {
      return mockSetOpenSafariFn.mock.calls[0][0]
    }
  })

  it('renders file list with formatted values', () => {
    const wrapper = mountSync(DownloadsPage)

    expect(wrapper.text()).toContain('doc.pdf')
    expect(wrapper.text()).toContain('1024 B')
  })

  it('renders file section (not empty state) when files exist', () => {
    const wrapper = mountSync(DownloadsPage)

    // The v-for section should render since we have 1 file
    expect(wrapper.find('.file').exists()).toBe(true)
  })

  it('shows share button on iOS', () => {
    const wrapper = mountSync(DownloadsPage)

    // Platform mock returns 'ios'
    expect(wrapper.find('.icon.x2').exists()).toBe(true)
  })
})

// ===========================================================================
// Meetings page
// ===========================================================================

describe('meetings page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses bottom-screen layout', () => {
    mountSync(MeetingsPage)

    expect(definePageMeta).toHaveBeenCalledWith({ layout: 'bottom-screen' })
  })

  it('renders visible meetings', () => {
    const wrapper = mountSync(MeetingsPage)

    // Both meetings have id, so both should be visible when agendasOnly is false
    expect(wrapper.findAll('.block').length).toBe(2)
  })

  it('registers bus listener for bottom-screen-done', () => {
    mountSync(MeetingsPage)

    expect(mockBusOn).toHaveBeenCalledWith('bottom-screen-done', expect.any(Function))
  })

  it('calls router.go(-1) on done', () => {
    mountSync(MeetingsPage)

    const doneHandler = mockBusOn.mock.calls.find(c => c[0] === 'bottom-screen-done')[1]

    doneHandler()

    expect(mockRouterGo).toHaveBeenCalledWith(-1)
  })

  it('calls setSelectedMeeting and router.push on changeMeeting', async () => {
    const wrapper = mountSync(MeetingsPage)

    await wrapper.find('.block').trigger('click')

    expect(mockSetSelectedMeeting).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledOnce()
  })

  it('cleans up bus listener on unmount', () => {
    const wrapper = mountSync(MeetingsPage)

    // Get the exact function reference registered via bus.on
    const doneHandler = mockBusOn.mock.calls.find(c => c[0] === 'bottom-screen-done')[1]

    wrapper.unmount()

    expect(mockBusOff).toHaveBeenCalledWith('bottom-screen-done', doneHandler)
  })
})

// ===========================================================================
// Calendar page
// ===========================================================================

describe('calendar page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sets meetingNav to false', () => {
    mountSync(CalendarPage)

    expect(mockSetShowMeetingNav).toHaveBeenCalledWith(false)
  })

  it('renders CalendarWidget with options', () => {
    const wrapper = mountSync(CalendarPage)

    const widget = wrapper.find('calendar-widget-stub')

    expect(widget.exists()).toBe(true)
    expect(widget.attributes('options')).toBeDefined()
  })
})

// ===========================================================================
// WeekSelect page
// ===========================================================================

describe('week-select page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses bottom-screen layout', () => {
    mountSync(WeekSelectPage)

    expect(definePageMeta).toHaveBeenCalledWith({ layout: 'bottom-screen' })
  })

  it('renders visible meetings', () => {
    const wrapper = mountSync(WeekSelectPage)

    expect(wrapper.findAll('.block').length).toBe(2)
  })

  it('registers and cleans up bus listener', () => {
    const wrapper = mountSync(WeekSelectPage)

    expect(mockBusOn).toHaveBeenCalledWith('bottom-screen-done', expect.any(Function))

    const handler = mockBusOn.mock.calls.find(c => c[0] === 'bottom-screen-done')[1]

    wrapper.unmount()

    expect(mockBusOff).toHaveBeenCalledWith('bottom-screen-done', handler)
  })
})
