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

<script>
import { DateTime }   from 'luxon'
import lineClamp    from '../../directives/LineClamp'
import events       from '../../modules/Bus'
import debounce     from 'lodash.debounce'

export default {
  name : 'CalEvent',
  props: [ 'event' ],
  data(){
    return {
      numLines : 1,
      widthFlag: false
    }
  },
  directives: { clamp: lineClamp },
  methods   : {
    getDuration,
    showDetails,
    getStartTime,
    resize,
    oneLine,
    isPast
  },
  mounted (){
    this.isMounted = true;
    this.resize()
    window.addEventListener('resize', debounce(this.resize, 50))
  },
  destroyed (){
    this.$nextTick(() => {
      window.removeEventListener('resize', debounce(this.resize, 50))
    })
  }
}
function isPast(){
  const start = DateTime.fromISO(this.event.start)
  const today = DateTime.utc()

  if(start<today) return true
  return false
}

function resize(){
  this.$nextTick(() => {
    this.numLines = numLines(this.$el.clientHeight)
    if(this.numLines===1)
      this.oneLine()
    else
      this.$refs.eventCalTitle.style.margin='1em 0 1em 0'
  })
}

function oneLine(){
  if(!this.$refs.eventCalTitle) return
  this.$refs.eventCalTitle.style.margin='0 0 0 0'
  const titleWidth = this.$refs.eventCalTitle.clientWidth
  const eventWidth = this.$el.clientWidth
  const maxWidth = (eventWidth - 8)

  if(this.$el.clientHeight<35){
    if((titleWidth >= maxWidth))
      this.$refs.eventCalTitle.style.width = this.$refs.eventCalTitle.clientWidth - 35+'px'
  }
  else {
    this.$refs.eventCalTitle.style.width = '100%'
  }
}

function numLines(height){
  if(height <= 52) return 1
  if(height > 53 && height <= 79) return 2
  if(height > 79 && height <= 105) return 3
  if(height > 106) return 4
}

function showDetails (e){
  e.data =this.event
  events.$emit('EventDetails', e)
}

function getDuration (){
  const start = DateTime.fromISO(this.event.start)
  const end   = DateTime.fromISO(this.event.end)
  const diff = end.diff(start).shiftTo('hours', 'minutes').toObject()

  if(diff.minutes < 60 && diff.minutes > 58){
    diff.minutes=0
    diff.hours++
  }

  let minutes = `${roundMinutes(diff.minutes)}m`

  if(diff.minutes<59 && !diff.hours &&  diff.minutes) return minutes
  if(!diff.minutes) minutes=''
  return `${diff.hours}h `+minutes
}
function getStartTime (){
  const start = DateTime.fromISO(this.event.start, { zone: this.event.timezone }).toFormat('T')

  return start
}
function roundMinutes (m){
  if(m>0 && m<= 15) return 15
  if(m>15 && m<= 30) return 30
  if(m>30 && m<= 59) return 45
  return 0
}
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
