<template>
  <section ref="main">
    <WeekSelect :iteration="selectedIteration"/>
    <div :class="[$style.calComponent]">
      <CalHeader :selected-iteration="selectedIteration" />
      
      <CalBody :selected-iteration="selectedIteration" :conference="conference" :events="calEvents" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { DateTime, IANAZone } from 'luxon'
import { useBus }     from '~/composables/use-bus'
import CalBody         from './body/cal-body.vue'
import CalHeader       from './header/cal-header.vue'
import CalWeeks        from '../modules/cal-weeks-service'
import messages        from '../locales'
import WeekSelect      from './body/week-select.vue'

const props = defineProps(['options'])

const { locale: i18nLocale, t, getLocaleMessage, setLocaleMessage } = useI18n()
const route  = useRoute()
const router = useRouter()
const bus    = useBus()

// Merge calendar-specific i18n messages (was beforeCreate)
for (const loc in messages) {
  const msgs = getLocaleMessage(loc)
  setLocaleMessage(loc, Object.assign(msgs, messages[loc]))
}

const calEvents          = ref({})
const query              = ref({})
const conference         = ref(props.options.conference)

const conferenceTimeZone = computed(() => {
  const timeZone = conference.value?.timeZone
  if (timeZone && IANAZone.isValidZone(timeZone)) return timeZone
  return 'America/Montreal'
})

function initIterationsService(i18n, date, type = 'week') {
  if (!i18n) throw new Error('must have i18n installed')
  const opts   = props.options || {}
  const locale = opts.locale || 'en'

  if (date) date = DateTime.fromISO(date)
  else date = DateTime.local()
  if (type === 'week') return new CalWeeks(i18n, date, locale)
}

const i18nObj = { locale: i18nLocale, t, getLocaleMessage, setLocaleMessage }
const iterationsService = ref(initIterationsService(i18nObj, route.query.selected))

const selectedIteration = computed(() => {
  try { return iterationsService.value.selected }
  catch (e) { return {} }
})

const iterations = computed(() => {
  if (!iterationsService.value) return []
  return iterationsService.value.iterations || []
})

const queryObject = computed(() => {
  const { conference: conf } = props.options
  const { id } = conf
  const locale = props.options.locale || i18nLocale.value || 'en'
  const q = Object.assign(query.value, { locale, conference: id })
  query.value = q
  return q
})

function mapByDay(events) {
  const { raw } = events
  const tz = conferenceTimeZone.value
  const days = {}

  for (let i = raw.length - 1; i >= 0; i--) {
    const { hasOwnProperty } = Object.prototype
    const dayStart     = DateTime.fromISO(raw[i].start, { zone: tz }).startOf('day')
    const dayEnd       = DateTime.fromISO(raw[i].start, { zone: tz }).endOf('day')
    const start        = DateTime.fromISO(raw[i].start, { zone: tz })
    const dayStartText = dayStart.toISODate({ includeOffset: false })

    if (!hasOwnProperty.call(days, dayStartText)) days[dayStartText] = []
    if (start >= dayStart && start <= dayEnd) days[dayStartText].push(raw[i])
  }

  events.days = days
  return events
}

function mapByWeek(events) {
  const { days } = events
  const { hasOwnProperty } = Object.prototype
  const weeks = {}
  const tz = conferenceTimeZone.value

  for (const day in days) {
    const year       = DateTime.fromISO(day, { zone: tz }).year
    const weekNumber = DateTime.fromISO(day, { zone: tz }).weekNumber
    const weekText   = `${year}-${weekNumber}`

    if (!hasOwnProperty.call(weeks, weekText)) weeks[weekText] = {}
    weeks[weekText][day] = days[day]
  }
  events.weeks = createLinkedList(weeks)
  return events
}

function createLinkedList(weeks) {
  const weekArr = Object.values(weeks)
  for (let i = 0; i < weekArr.length; i++) {
    if (i > 0) weekArr[i].next = weekArr[i - 1]
    if (i < weekArr.length - 1) weekArr[i].prev = weekArr[i + 1]
  }
  return weeks
}

function getEvents() {
  const { queryFn } = props.options
  return queryFn(queryObject.value)
    .then(mapByDay)
    .then(mapByWeek)
    .then((e) => { calEvents.value = e })
}

function setQueryString(interations) {
  const { next, prev } = selectedIteration.value
  let nextIteration = selectedIteration.value

  if (interations === -1) nextIteration = next
  if (interations === -2) nextIteration = next.next
  if (interations === 2)  nextIteration = prev.prev
  if (interations === 1)  nextIteration = prev

  const { aDateTime, endDateTime } = nextIteration
  const routeObj = { query: { selected: aDateTime.toFormat('yyyy-MM-dd') } }

  if (interations) router.replace(routeObj)

  const start = aDateTime.toISO({ includeOffset: false })
  const end   = endDateTime.toISO({ includeOffset: false })

  query.value = { ...query.value, start, end }
}

function applyFilter(event) {
  try {
    const { data } = event
    const locale = props.options.locale || i18nLocale.value
    if (!data.show) query.value = Object.assign(query.value, { locale })
    query.value = Object.assign({ locale }, query.value, data)
  }
  catch (e) { query.value = {} }
  finally { getEvents() }
}

function changeDateTime(numberOfIterations) {
  if (!iterationsService.value) iterationsService.value = initIterationsService(i18nObj)
  const num = Number(numberOfIterations)
  setQueryString(num)
  getEvents().then(() => { iterationsService.value.add(num) })
}

// created logic
const initStart = conference.value?.apps?.cbdEvents?.start || conference.value.startDate
const tz = conferenceTimeZone.value
const startDt = initStart ? DateTime.fromISO(initStart, { zone: tz }) : DateTime.local()
const initRoute = { query: { selected: startDt.toFormat('yyyy-MM-dd') } }

if (!route.query || !route.query.selected)
  router.replace(initRoute)
else
  iterationsService.value = initIterationsService(i18nObj, route.query.selected)

setQueryString(0)
getEvents()

// mounted
onMounted(() => {
  bus.on('showFilter', applyFilter)
  bus.on('changeDate', changeDateTime)
})

onBeforeUnmount(() => {
  bus.off('showFilter', applyFilter)
  bus.off('changeDate', changeDateTime)
})
</script>
<style>
  a { color: #337ab7; text-decoration: none; }
  a:hover,
  a:focus { color: #23527c; text-decoration: underline; }
</style>
<style module>
  .calComponent{ position: relative; height: 78vh; width: 100vw;   }
</style>