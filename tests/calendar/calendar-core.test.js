/**
 * Phase 07 — Calendar Widget Migration Tests
 *
 * Tests for:
 *  - cal-weeks-service.js (Vue.set/Vue.nextTick removal)
 *  - directives (Vue 3 lifecycle hooks)
 *  - Calendar components (<script setup> migration)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount, shallowMount } from '@vue/test-utils'

// ── Mocks ──

const mockBus = { on: vi.fn(), off: vi.fn(), emit: vi.fn() }

vi.mock('~/composables/use-bus', () => ({
  useBus: () => mockBus,
}))

vi.mock('ofetch', () => ({
  $fetch: vi.fn().mockResolvedValue([]),
}))

vi.mock('velocity-animate', () => ({
  default: vi.fn(),
}))

vi.mock('lodash.debounce', () => ({
  default: (fn) => fn,
}))

// ───────────────────────────────────────────────────────────────────────────
// cal-weeks-service.js
// ───────────────────────────────────────────────────────────────────────────
describe('CalWeeksService (p07-01)', () => {
  let CalWeeks

  beforeEach(async () => {
    CalWeeks = (await import('~/components/calendar/src/modules/cal-weeks-service')).default
  })

  const mockI18n = {
    locale: 'en',
    t: (k) => k,
    getLocaleMessage: vi.fn(() => ({})),
    setLocaleMessage: vi.fn(),
  }

  it('has no import of Vue', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync('app/components/calendar/src/modules/cal-weeks-service.js', 'utf-8')
    expect(source).not.toMatch(/import\s+Vue\s+from\s+['"]vue['"]/)
    expect(source).not.toMatch(/Vue\.set/)
    expect(source).not.toMatch(/Vue\.nextTick/)
  })

  it('imports nextTick from vue', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync('app/components/calendar/src/modules/cal-weeks-service.js', 'utf-8')
    expect(source).toMatch(/import\s*{\s*nextTick\s*}\s*from\s*['"]vue['"]/)
  })

  it('creates 15 weekly iterations', () => {
    const { DateTime } = require('luxon')
    const dt = DateTime.fromISO('2025-06-15')
    const service = new CalWeeks(mockI18n, dt)

    expect(service.iterations).toHaveLength(15)
    expect(service.iterations[7]).toBeDefined()
    expect(service.iterations[7].type).toBe('week')
  })

  it('selected returns the 8th iteration (index 7)', () => {
    const { DateTime } = require('luxon')
    const dt = DateTime.fromISO('2025-06-15')
    const service = new CalWeeks(mockI18n, dt)
    const selected = service.selected

    expect(selected).toBe(service.iterations[7])
  })

  it('each week has day iterations', () => {
    const { DateTime } = require('luxon')
    const dt = DateTime.fromISO('2025-06-15')
    const service = new CalWeeks(mockI18n, dt)
    const week = service.iterations[0]

    expect(week.dayIterarions).toHaveLength(7)
    expect(week.dayIterarions[0]).toHaveProperty('title')
    expect(week.dayIterarions[0]).toHaveProperty('isWeekend')
    expect(week.dayIterarions[0]).toHaveProperty('isToday')
  })

  it('add() shifts iterations left or right', () => {
    const { DateTime } = require('luxon')
    const dt = DateTime.fromISO('2025-06-15')
    const service = new CalWeeks(mockI18n, dt)

    const firstWeekBefore = service.iterations[0].aDateTime.valueOf()
    service.add(1) // _fromLeft: prepend 1, pop 1 (after timeout)
    const firstWeekAfter = service.iterations[0].aDateTime.valueOf()

    // A new week was unshifted to front, so first element changed
    expect(firstWeekAfter).not.toBe(firstWeekBefore)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Directives
// ───────────────────────────────────────────────────────────────────────────
describe('Calendar Directives (p07-01)', () => {
  it('line-clamp uses Vue 3 hooks (beforeMount, mounted, updated)', async () => {
    const directive = (await import('~/components/calendar/src/directives/line-clamp')).default

    expect(directive).toHaveProperty('beforeMount')
    expect(directive).toHaveProperty('mounted')
    expect(directive).toHaveProperty('updated')
    // Vue 2 hooks should not exist
    expect(directive).not.toHaveProperty('bind')
    expect(directive).not.toHaveProperty('inserted')
    expect(directive).not.toHaveProperty('componentUpdated')
  })

  it('scroll uses Vue 3 mounted hook (not inserted)', async () => {
    const directive = (await import('~/components/calendar/src/directives/scroll')).default

    expect(directive).toHaveProperty('mounted')
    expect(directive).not.toHaveProperty('inserted')
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Calendar Components — script setup verification
// ───────────────────────────────────────────────────────────────────────────
describe('Calendar Components — <script setup> (p07-02)', () => {
  it('all Vue files use <script setup>', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const glob = await import('node:fs')

    function findVueFiles(dir) {
      const results = []
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) results.push(...findVueFiles(full))
        else if (entry.name.endsWith('.vue')) results.push(full)
      }
      return results
    }

    const calDir = 'app/components/calendar/src/components'
    const vueFiles = findVueFiles(calDir)

    expect(vueFiles.length).toBeGreaterThan(0)

    for (const file of vueFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      expect(content, `${file} should use <script setup>`).toMatch(/<script setup>/)
      expect(content, `${file} should not have Options API export default`).not.toMatch(/export\s+default\s*{/)
    }
  })

  it('no Vue 2 patterns remain in calendar components', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')

    function findFiles(dir, exts) {
      const results = []
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) results.push(...findFiles(full, exts))
        else if (exts.some(e => entry.name.endsWith(e))) results.push(full)
      }
      return results
    }

    const calDir = 'app/components/calendar/src'
    const files = findFiles(calDir, ['.vue', '.js'])

    const vue2Patterns = [
      /import\s+Vue\s+from\s+['"]vue['"]/,
      /Vue\.set\(/,
      /Vue\.nextTick\(/,
      /this\.\$root\.\$on/,
      /this\.\$root\.\$off/,
      /this\.\$root\.\$emit/,
      /this\.\$set\(/,
      /this\.\$children/,
      /import\s+axios\s+from\s+['"]axios['"]/,
      /import\s+querystring/,
      /process\.env\.NUXT_ENV/,
      /process\.server/,
    ]

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      // Skip comments
      const codeOnly = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')

      for (const pattern of vue2Patterns) {
        expect(codeOnly, `${file} should not match ${pattern}`).not.toMatch(pattern)
      }
    }
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Bus module
// ───────────────────────────────────────────────────────────────────────────
describe('Calendar bus.js', () => {
  it('re-exports mitt bus from composable', async () => {
    const bus = (await import('~/components/calendar/src/modules/bus')).default
    expect(bus).toBeDefined()
    expect(bus).toHaveProperty('on')
    expect(bus).toHaveProperty('off')
    expect(bus).toHaveProperty('emit')
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Shallow mount tests for key calendar components
// ───────────────────────────────────────────────────────────────────────────
describe('CalHeader component', () => {
  it('emits bus events on toggles', async () => {
    const CalHeader = (await import('~/components/calendar/src/components/header/cal-header.vue')).default

    const wrapper = shallowMount(CalHeader, {
      props: {
        selectedIteration: { title: 'Jun 15 - 21', subTitle: '2025 (week 24)' },
      },
      global: {
        stubs: { Icon: true },
      },
    })

    // Click the filter area
    await wrapper.find('.col-3').trigger('click')
    expect(mockBus.emit).toHaveBeenCalledWith('showFilter')

    // Click the week selector area
    mockBus.emit.mockClear()
    await wrapper.find('.col-9').trigger('click')
    expect(mockBus.emit).toHaveBeenCalledWith('bottom-screen-done', { something: 'yes' })
  })
})

describe('CalBody component', () => {
  it('subscribes to bus events on mount', async () => {
    const CalBody = (await import('~/components/calendar/src/components/body/cal-body.vue')).default
    mockBus.on.mockClear()

    shallowMount(CalBody, {
      props: {
        selectedIteration: { type: 'week', loading: false, aDateTime: { toFormat: () => '2025-W24' } },
        events: {},
        conference: {},
      },
      global: {
        stubs: {
          CalWeekBody: true,
          Details: true,
          CalFilter: true,
          transition: false,
        },
      },
    })

    expect(mockBus.on).toHaveBeenCalledWith('EventDetails', expect.any(Function))
    expect(mockBus.on).toHaveBeenCalledWith('showFilter', expect.any(Function))
  })
})

describe('AgendaItem component', () => {
  it('maps COP body to CBD', async () => {
    const AgendaItem = (await import('~/components/calendar/src/components/event/agenda-item.vue')).default

    const wrapper = shallowMount(AgendaItem, {
      props: { body: 'COP-15', item: '1' },
    })

    expect(wrapper.text()).toContain('CBD')
    expect(wrapper.text()).toContain('1')
  })

  it('maps non-COP body to prefix', async () => {
    const AgendaItem = (await import('~/components/calendar/src/components/event/agenda-item.vue')).default

    const wrapper = shallowMount(AgendaItem, {
      props: { body: 'NP-MOP-4', item: '3' },
    })

    expect(wrapper.text()).toContain('NP')
    expect(wrapper.text()).toContain('3')
  })
})

describe('CalEventDetailsFile component', () => {
  it('uses $fetch instead of axios', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/event/cal-event-details-file.vue',
      'utf-8'
    )
    expect(source).not.toMatch(/import\s+axios/)
    expect(source).toMatch(/\$fetch/)
  })

  it('uses useRuntimeConfig instead of process.env', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/event/cal-event-details-file.vue',
      'utf-8'
    )
    expect(source).not.toMatch(/process\.env/)
    expect(source).toMatch(/useRuntimeConfig/)
  })
})

describe('CalEventDetailsFileStatus component', () => {
  it('uses $fetch instead of axios and querystring', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/event/cal-event-details-file-status.vue',
      'utf-8'
    )
    expect(source).not.toMatch(/import\s+axios/)
    expect(source).not.toMatch(/import\s+querystring/)
    expect(source).toMatch(/\$fetch/)
  })
})

describe('CalWeekBody component', () => {
  it('renders week rows for each day', async () => {
    const CalWeekBody = (await import('~/components/calendar/src/components/body/cal-week-body.vue')).default

    const mockDayIterarions = Array.from({ length: 7 }, (_, i) => ({
      aDateTime: { toFormat: () => `2025-06-${15 + i}`, day: 15 + i },
      title: 15 + i,
      subTitle: 'Jun',
      isWeekend: i >= 5,
      isToday: false,
    }))

    const wrapper = shallowMount(CalWeekBody, {
      props: {
        week: { dayIterarions: mockDayIterarions },
        eventsByWeek: {},
        conference: {},
      },
      global: {
        stubs: { CalWeekRow: true },
      },
    })

    const rows = wrapper.findAllComponents({ name: 'CalWeekRow' })
    expect(rows).toHaveLength(7)
  })
})

describe('CalFooter component', () => {
  it('uses dynamic import instead of require for velocity-animate', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/footer/cal-footer.vue',
      'utf-8'
    )
    expect(source).not.toMatch(/require\s*\(/)
    expect(source).toMatch(/import\s*\(/)
  })

  it('uses defineEmits for action event', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/footer/cal-footer.vue',
      'utf-8'
    )
    expect(source).toMatch(/defineEmits/)
  })
})

describe('Calendar week-select (internal)', () => {
  it('uses useBus instead of $root.$on/off/emit', async () => {
    const fs = await import('node:fs')
    const source = fs.readFileSync(
      'app/components/calendar/src/components/body/week-select.vue',
      'utf-8'
    )
    expect(source).not.toMatch(/this\.\$root/)
    expect(source).toMatch(/useBus/)
    expect(source).toMatch(/bus\.emit\('changeDate'/)
    expect(source).toMatch(/bus\.on\('bottom-screen-done'/)
    expect(source).toMatch(/bus\.off\('bottom-screen-done'/)
  })
})
