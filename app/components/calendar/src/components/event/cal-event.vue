<template>
  <div
    ref="eventCal"
    :class="[$style.main,isPast()?$style.past:'']"
    @click="showDetails"
  >
    <p
      ref="eventCalTitle"
      :class="[$style.mainTitle]"
      v-clamp:20="numLines"
    >
    {{ event.title }}
    </p>
    <div :class="[$style.footer]">
      {{ getStartTime() }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { DateTime }   from 'luxon'
import lineClamp      from '../../directives/line-clamp'
import { useBus }     from '~/composables/use-bus'
import debounce       from 'lodash.debounce'

const vClamp = lineClamp

const props = defineProps(['event'])
const bus = useBus()

const numLines  = ref(1)
const widthFlag = ref(false)

const eventCalRef      = useTemplateRef('eventCal')
const eventCalTitleRef = useTemplateRef('eventCalTitle')

function isPast() {
  const start = DateTime.fromISO(props.event.start)
  const today = DateTime.utc()
  return start < today
}

function calcNumLines(height) {
  if (height <= 52) return 1
  if (height > 53 && height <= 79) return 2
  if (height > 79 && height <= 105) return 3
  if (height > 106) return 4
}

function oneLine() {
  if (!eventCalTitleRef.value) return
  eventCalTitleRef.value.style.margin = '0 0 0 0'
  const titleWidth = eventCalTitleRef.value.clientWidth
  const eventWidth = eventCalRef.value.clientWidth
  const maxWidth = (eventWidth - 8)

  if (eventCalRef.value.clientHeight < 35) {
    if (titleWidth >= maxWidth)
      eventCalTitleRef.value.style.width = eventCalTitleRef.value.clientWidth - 35 + 'px'
  } else {
    eventCalTitleRef.value.style.width = '100%'
  }
}

function resize() {
  nextTick(() => {
    numLines.value = calcNumLines(eventCalRef.value.clientHeight)
    if (numLines.value === 1)
      oneLine()
    else
      eventCalTitleRef.value.style.margin = '1em 0 1em 0'
  })
}

const debouncedResize = debounce(resize, 50)

function showDetails(e) {
  e.data = props.event
  bus.emit('EventDetails', e)
}

function getDuration() {
  const start = DateTime.fromISO(props.event.start)
  const end   = DateTime.fromISO(props.event.end)
  const diff = end.diff(start).shiftTo('hours', 'minutes').toObject()

  if (diff.minutes < 60 && diff.minutes > 58) {
    diff.minutes = 0
    diff.hours++
  }

  let minutes = `${roundMinutes(diff.minutes)}m`
  if (diff.minutes < 59 && !diff.hours && diff.minutes) return minutes
  if (!diff.minutes) minutes = ''
  return `${diff.hours}h ` + minutes
}

function getStartTime() {
  return DateTime.fromISO(props.event.start, { zone: props.event.timezone }).toFormat('T')
}

function roundMinutes(m) {
  if (m > 0 && m <= 15) return 15
  if (m > 15 && m <= 30) return 30
  if (m > 30 && m <= 59) return 45
  return 0
}

onMounted(() => {
  resize()
  window.addEventListener('resize', debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize)
})
</script>

<style module>
  .main {
    white-space: normal;
    border: 1px solid grey;
    border-top: 5px solid grey;
    overflow: hidden;
    padding: 3px 3px 3px 3px;
    position: relative;
    height:98%;
    min-height: 20px;
    min-width:10%;
    flex: 1 0 20%;
  }
  .past{
    opacity: 0.5;
  }
  .mainTitle{
    font-weight: bold;
    font-size: .7em;
    line-height:1.2em;

  }
  .footer{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: .8em;
    line-height:1.2em;
    padding: 0 3px 0 3px;
    text-align: right;
  }
</style>
