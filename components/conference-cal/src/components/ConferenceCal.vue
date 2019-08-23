<template>
  <section>
    <div class="scroll">
      <div class="cont top">
        <div class="day-col" v-for="(day,index) in getDays" v-bind:key="index" :ref="index">
          <div class="day-col-day">{{ day.day }}</div>
          <div class="day-col-day-w">{{ day.dayOfWeek }}</div>
        </div>
      </div>
      <div class="cont off" v-for="(stream, i) in streams" v-bind:key="i"> &nbsp;
        <div class="day-col" :class="{ 'on':index%2 }"  v-for="(day, key, index) in getDays" v-bind:key="index" :ref="'d'+key">
          <section v-for="(event, j) in getEvents({ day, stream })" v-bind:key="j">
            <div v-if="event.isEventStart" class="event-cont" :class="{ 'bm': !isEventOn(day, event, stream) }"  >
                <div v-on:click="showDetails(event)" class="event" :class="{ pointer: ifLink(event) }" :style="{ 'background-color':e.color, width:`${getColWidth(event)}px` }"  >
                  <span >{{ e.titleMobile || e.title }}</span>
                </div>
            </div>
            <div v-else-if="isEventOn(day, event, stream)" class="event-cont" >&nbsp;</div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { DateTime } from 'luxon'
import  axios       from 'axios'

export default {
  name    : 'ConferenceCal',
  props   : [ 'code','options' ],
  methods : { getEvents, isEventStart, isEventOn, showDetails, getConference, loadEvents, ifLink, onHover },
  computed: { getDays,  getColWidth },
  data, mounted
}

function mounted (){ this.$watch('events', () =>  this.$forceUpdate()) }

function data(){
    this.getConference()
    return { local:'en', days:{}, start:'', end:'', streams:[], events:[] }
}

function onHover(){ window.document.body.style.cursor = 'pointer' }

function ifLink(event){
  if(event.url) return event.url
  if(event.code) return `https://www.cbd.int/conferences/${this.code}/parallel-meetings/${event.code}`
  return false
}

function getEvents({ day, stream }){
  if(!this.events || !this.events.length) return []
  return this.events.map( event => { event.isEventStart = this.isEventStart(day, event, stream); })
}

function loadEvents(events){
  if(!events) return
  for (let i = 0; i < events.length; i++){
    events[i].end=DateTime.fromISO(events[i].end)
    events[i].start=DateTime.fromISO(events[i].start)
    events[i].length = (events[i].end.diff(events[i].start,'days' ).toObject().days || 0)+1
  }
}

async function getConference(){
  let path = `${process.env.API}/api/v2016/event-groups/`

  let r = await axios.get(path,{params:{q:{code:this.code}}})

    if(!r.data[0].conference ) return

    this.conference = r.data[0].conference.overViewCalendar
    this.start = DateTime.fromISO(this.conference.start)
    this.end = DateTime.fromISO(this.conference.end)
    this.streams = this.conference.streams

    this.events = r.data[0].conference.overViewCalendar.events
    this.loadEvents(this.events)
    return this.events
}

function showDetails (e){
  if(this.ifLink(e) && !e.code || (this.options && this.options.target==='_blank'))
    window.open(this.ifLink(e), '_blank')
  else 
    window.location = this.ifLink(e)
}

function getColWidth(){
  return event => {
    if(!this.$refs['d'+event.start.toFormat("yyyyMMdd")]) return
    return this.$refs['d'+event.start.toFormat("yyyyMMdd")][0].clientWidth * event.length
  }
}

function isEventStart(day, event, stream){
  if(day.date.day===event.start.day && event.stream===stream)
    return true
  else
    return false
}

function isEventOn(day, event, stream){
  if(day.date.day>event.start.day && day.date.day<=event.end.day && event.stream===stream)
    return true
  else
    return false
}

function getDays(){
  if(!this.start) return
  let diff = this.end.diff(this.start,'days' ).toObject().days

  for (var i = 0; i < diff; i++) {
    let day    = this.start.plus({ days:i }).startOf('day')
    let dayObj =  {
                    day:day.day,
                    dayOfWeek:day.setLocale(this.locale).toFormat('ccc'),
                    date:day
                  }
    this.days['d'+day.toFormat("yyyyMMdd")] = dayObj
  }
  return this.days
}
</script>

<style scoped>
  .pointer  { cursor:pointer; pointer-events:all; }
  .stream   { padding: 1em 0 1em 0; }
  .event    { position: absolute; color:white; top: 50%; transform: translate(0,-50%); font-size: .6em; text-align: center; border-left: 1px solid white; border-right: 1px solid white; max-height:60px; z-index: 100; line-height: 1.2em; padding: .2em 0 .2em .1em; }
  .bm       { margin-bottom:.7em; }
  .on       { background: #F2F1EF; }
  .cont     { display: inline-flex; width:270%; }
  .top      { margin-bottom: .25em }
  .debugB   { border: 1px solid blue; width:100%; overflow-x: scroll; }
  .scroll   { width:100%; overflow-x: auto; }
  .debug    { border: 1px solid red; }
  .off      { margin-left:-0.3em }

  .day-col-day-w{ background: #D2D7D3; text-align: center; border-right: 1px solid white; }
  .day-col      { width:100%; position: relative; }
  .day-col-day  { background: #95A5A6; color:white; text-align: center; font-weight: bold; border-right: 1px solid white; }
  .event-cont   { position: relative; width: 100%; font-weight: bold; padding: .5em 0 1em 0; font-size: 1.2em; z-index:10; pointer-events:none;  }

  @media  (min-width:768px) {
    .cont{ width:150%; }
  }

  @media (min-width:992px) {
    .cont{ width:135%; }
  }
</style>
