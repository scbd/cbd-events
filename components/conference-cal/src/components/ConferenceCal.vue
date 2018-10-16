<template>
  <section>
    <div class="scroll">
      <div class="cont top">
        <div class="day-col" v-for="(day,index) in getDays" v-bind:key="index" :ref="index">
          <div class="day-col-day">{{day.day}}</div>
          <div class="day-col-day-w">{{day.dayOfWeek}}</div>
        </div>
      </div>
      <div class="cont off" v-for="(s,i) in streams" v-bind:key="i"> &nbsp;
         <div class="day-col" :class="{'on':index%2}"  v-for="(day, key, index) in getDays" v-bind:key="index" :ref="'d'+key">
            <div class="event-cont"    :class="{'bm':!isEventOn(day, e,s)}" v-if="isEventStart(day, e,s)" v-for="(e,j) in getEvents" v-bind:key="j" >
                <div class="event" :class="{pointer:ifLink(e)}" v-on:click="showDetails(e)"  :style="{'background-color':e.color,width:`${getColWidth(e)}px`}"  >
                  <span >{{ e.titleMobile || e.title }}</span>
                </div>
            </div>
            <div class="event-cont" v-else-if="isEventOn(day, e,s)">&nbsp;</div>
         </div>
      </div>
    </div>
  </section>
</template>

<script>

import {DateTime} from 'luxon'
import axios from 'axios'


export default {
  name: 'ConferenceCal',
  props:['code','options'],
  data:function(){

    this.getConference()
    return{
      local:'en',
      days:{},
      start:'',
      end:'',
      streams:[],
      events:[]
  }},
  methods:{
    isEventStart:isEventStart,
    isEventOn:isEventOn,
    showDetails:showDetails,
    getConference:getConference,
    loadEvents:loadEvents,
    ifLink:ifLink,
    onHover:function(){
      window.document.body.style.cursor = 'pointer'
    }
  },
  computed:{
    getDays:getDays,
    getEvents:getEvents,
    getColWidth:getColWidth
  },
  mounted:function(){
    this.$watch('events', () =>  this.$forceUpdate())
  }
}

function ifLink(event){
  
  if(event.url) return event.url
  if(event.code) return `https://www.cbd.int/conferences/${this.code}/parallel-meetings/${event.code}`
  return false
}

function getEvents(){

  if(this.events && this.events.length)
  return this.events
  return []
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
  let path = `/api/v2016/event-groups/`

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

function isEventStart(day, event,stream){
  if(day.date.day===event.start.day && event.stream===stream)
    return true
  else
    return false
}

function isEventOn(day, event,stream){
  if(day.date.day>event.start.day && day.date.day<=event.end.day && event.stream===stream)
    return true
  else
    return false
}

function getDays(){
  if(!this.start) return
  let diff = this.end.diff(this.start,'days' ).toObject().days

  for (var i = 0; i < diff; i++) {
    let day = this.start.plus({days:i}).startOf('day')
    this.days['d'+day.toFormat("yyyyMMdd")] ={
      day:day.day,
      dayOfWeek:day.setLocale(this.locale).toFormat('ccc'),
      date:day
    }
  }
  return this.days
}
</script>

<style scoped>
.pointer{
  cursor:pointer;
  pointer-events:all;
}
.stream{
  padding: 1em 0 1em 0;
}
.event{
  position: absolute;
  color:white;
  top: 50%;
  transform: translate(0,-50%);
  font-size: .6em;
  text-align: center;
  border-left: 1px solid white;
  border-right: 1px solid white;
  max-height:60px;
  z-index: 100;
  line-height: 1.2em;
  padding: .2em 0 .2em .1em;
}

.event-cont{
  position: relative;
  width: 100%;
  font-weight: bold;
  padding: .5em 0 1em 0;
  font-size: 1.2em;
  z-index:10;
  pointer-events:none; 
}
.bm{
  margin-bottom:.7em;
}
.day-col{
  width:100%;
  position: relative;
}
.day-col-day{
  background: #95A5A6;
  color:white;
  text-align: center;
  font-weight: bold;
  border-right: 1px solid white;
}
.on{
  background: #F2F1EF;
}
.day-col-day-w{
  background: #D2D7D3;
  text-align: center;
  border-right: 1px solid white;
}
.cont{
  display: inline-flex;
  width:270%;
}
.top{
  margin-bottom: .25em
}
.debugB {
  border: 1px solid blue;
  width:100%;
  overflow-x: scroll;
}
.scroll {
  width:100%;
  overflow-x: auto;
}
.debug {
  border: 1px solid red;

}
.off{
  margin-left:-0.3em
}


   @media  (min-width:768px) {
     .cont{
       width:150%;
     }
   }
   @media (min-width:992px) {
     .cont{
       width:135%;
     }
   }


</style>
