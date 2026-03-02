<template>
  <div :class="[$style.main]">
    <Details v-if="detailsData" :conference="conference" :event="detailsData" />
    <CalFilter v-if="showFilter" @filter="filter" />
    
    <transition name="slide-week" @leave="leave" >
      <CalWeekBody
        v-if="isWeek && !selectedIteration.loading"
        ref="weekBody"
        :week="selectedIteration"
        :events-by-week="selectEvents"
        :conference="conference"
        keep-alive
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { useBus }   from '~/composables/use-bus'
import CalWeekBody   from './cal-week-body.vue'
import Details       from '../event/cal-event-details.vue'
import CalFilter     from './cal-filter.vue'

const props = defineProps(['selectedIteration', 'events', 'conference'])

const bus = useBus()

const detailsData = ref(false)
const showFilter  = ref(false)
const weekBodyRef = useTemplateRef('weekBody')

const isWeek    = computed(() => props.selectedIteration.type === 'week')
const isDay     = computed(() => props.selectedIteration.type === 'day')
const isMeeting = computed(() => props.selectedIteration.type === 'meeting')

const selectEvents = computed(() => {
  if (!props.selectedIteration) return {}
  const weekText = props.selectedIteration.aDateTime?.toFormat('yyyy-W')
  const dayText  = props.selectedIteration.aDateTime?.toFormat('yyyy-MM-dd')

  if (isWeek.value && props.events.weeks) return props.events.weeks[weekText]
  if (isDay.value && props.events.days)   return props.events.days[dayText]
})

function filter(e) {
  if (Object.prototype.hasOwnProperty.call(e || {}, 'data'))
    return (showFilter.value = e.data.show)
  return (showFilter.value = !showFilter.value)
}

function showDetails(e) {
  const { data } = e
  detailsData.value = detailsData.value ? false : data
}

function leave() {
  // In Vue 2 this iterated this.$children[0].$refs — replaced with template ref
  const el = weekBodyRef.value?.$el
  if (el) {
    const children = el.children
    for (let i = 0; i < children.length; i++)
      children[i].style.display = 'block'
  }
  setTimeout(() => { props.selectedIteration.loading = false }, 400)
}

onMounted(() => {
  bus.on('EventDetails', showDetails)
  bus.on('showFilter', filter)
})

onBeforeUnmount(() => {
  bus.off('EventDetails', showDetails)
  bus.off('showFilter', filter)
})
</script>

<style>
.slide-week-leave-active, .slide-week-enter-active  { transition: all .2s ease; }
.slide-week-enter { transform: translateY(100%); opacity: 0; }
</style>

<style module>
  .main{ position: relative; height:100%; padding:0 0 0 0; }
  .child{ margin-right: 100%; }
</style>
