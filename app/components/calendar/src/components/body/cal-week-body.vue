<template>
  <div :class="[$style.main]">
    <CalWeekRow
      v-for="(d, index) in week.dayIterarions"
      :key="index"
      :y-index="index"
      :day="d"
      :day-events="getDayEvents(d)"
      :conference="conference"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CalWeekRow from './cal-week-row.vue'

const props = defineProps(['week', 'eventsByWeek', 'conference'])

const events = computed(() => props.eventsByWeek)

function getDayEvents(d) {
  if (!props.eventsByWeek) return []
  return props.eventsByWeek[d.aDateTime.toFormat('yyyy-MM-dd')]
}
</script>

<style module>
  .main{
    position: relative;
    height:100%;
  }
</style>
