<template>
  <div :class="[$style.main]">
    <Details v-if="detailsData" :conference="conference" :event="detailsData" />
    <CalFilter v-if="showFilter" @filter="filter" />
    
    <transition name="slide-week" @leave="leave" >
      <CalWeekBody
        v-if="isWeek && !selectedIteration.loading"
        :week="selectedIteration"
        :events-by-week="selectEvents"
        :conference:="conference"
        keep-alive
      />
    </transition>
  </div>
</template>

<script>
import CalWeekBody  from './CalWeekBody'
import Details      from '../event/CalEventDetails'
import EventsBus    from '../../modules/Bus'
import CalFilter    from './CalFilter'


export default {
  name      : 'CalBody',
  props     : [ 'selectedIteration', 'events', 'conference' ],
  components: { CalWeekBody, Details, CalFilter },
  methods   : { leave, showDetails, filter },
  computed  : { isWeek, isMeeting, isDay, selectEvents },
  data,
  mounted
}

function  data(){
  return{
    detailsData: false,
    showFilter : false
  }
}

function mounted(){
  EventsBus.$on('EventDetails', this.showDetails)
  EventsBus.$on('showFilter', this.filter)
}

function filter (e){
  if(hasOwnProperty.call(e||{}, 'data'))
    return this.showFilter = e.data.show
  
  return this.showFilter=!this.showFilter
}

function showDetails (e){
  const { data } = e

  this.detailsData = this.detailsData? false : data
}

function selectEvents(){
  if(!this.selectedIteration) return {}

  const { events } = this
  const weekText = this.selectedIteration.aDateTime.toFormat('yyyy-W')
  const dayText = this.selectedIteration.aDateTime.toFormat('yyyy-MM-dd')

  if(this.isWeek && events.weeks)
    return events.weeks[weekText]

  if(this.isDay && events.days)
    return events.days[dayText]
}

function isWeek(){
  return (this.selectedIteration.type==='week')
}

function isDay(){
  return (this.selectedIteration.type==='day')
}

function isMeeting(){
  return (this.selectedIteration.type==='meeting')
}

function leave(){
  // let change = this.selectedIteration.change ? '' : '-'
  // let num = Math.abs(this.selectedIteration.changeNum )
  // let time = 750
  // if(num>1) time = 1600

  for (const ref in this.$children[0].$refs)
    this.$children[0].$refs[ref].style.display='block'

  setTimeout(() => { this.selectedIteration.loading = false }, 400)
}

</script>

<style>
.slide-week-leave-active, .slide-week-enter-active  { transition: all .2s ease; }
.slide-week-enter { transform: translateY(100%); opacity: 0; }
</style>

<style module>
  .main{ position: relative; height:100%; padding:0 0 0 0; }
  .child{ margin-right: 100%; }
</style>
