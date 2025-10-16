<template>
  <section ref="main">
    <WeekSelect :iteration="selectedIteration"/>
    <div :class="[$style.calComponent]">
      <CalHeader :selected-iteration="selectedIteration" />
      
      <CalBody :selected-iteration="selectedIteration" :conference="conference" :events="events" />
    </div>
  </section>
</template>

<script>
import { DateTime }       from 'luxon'
import events             from '../modules/Bus'
import CalBody            from './body/CalBody'
import CalHeader          from './header/CalHeader'
import CalWeeks           from '../modules/CalWeeksService'
import messages           from '../locales'
import WeekSelect         from './body/WeekSelect'

export default {
  name      : 'Calendar',
  props     : [ 'options' ],
  components: { CalBody, CalHeader, WeekSelect },
  computed  : { iterations, selectedIteration, queryObject },
  methods   : { changeDateTime, setIterationsService, getEvents, setQueryString, applyFilter },
  data,
  mounted,
  created,
  beforeCreate
}

function data(){
  return{
    events           : {},
    query            : {},
    iterationsService: this.setIterationsService(this.$i18n, this.$route.query.selected),
    conference       : this.options.conference
  }
}

function mounted(){
  events.$on('showFilter', this.applyFilter)
  this.$root.$on('changeDate', this.changeDateTime)
}

function beforeCreate(){
  const { $i18n } = this
  
  if(!$i18n) throw new Error('$i18n must be installed')

  for (const locale in messages){
    const msgs = $i18n.getLocaleMessage(locale)

    $i18n.setLocaleMessage(locale, Object.assign(msgs, messages[locale]))
  }
}

function created(){
  const { $route, $router, $i18n } = this
  const { query } = $route
  const initStart = this.conference?.apps?.cbdEvents?.start || this.conference.startDate
  const start = initStart? DateTime.fromISO(initStart) : DateTime.local()
  const route = { query: { selected: start.toFormat('yyyy-MM-dd') } }

  if(!query || !query.selected)
    $router.replace(route)
  else
    this.iterationsService = this.setIterationsService($i18n, query.selected)

  this.setQueryString(0)
  this.getEvents()
}

function getEvents(){
  const { queryFn } = this.options

  return queryFn(this.queryObject)
    .then(mapByDay)
    .then(mapByWeek)
    .then((e) => { this.events = e })
}

function selectedIteration(){
  try { return this.iterationsService.selected }
  catch(e){ return {} }
}

function iterations(){
  if(!this.iterationsService) return []

  const { iterations } = this.iterationsService

  return iterations || []
}

function applyFilter (event){
  try{
    const { data } = event
    const { options, $i18n } = this
    const locale = options.locale || $i18n.locale
    
    if(!data.show) this.query = Object.assign(this.query, { locale })

    this.query = Object.assign({ locale }, this.query, data)
  }
  catch(e){ this.query = {} }
  finally{ this.getEvents(this.queryObject) }
}


function queryObject (){
  //eslint-disable-next-line
  let   { conference } = this.options
  const { id         } = conference
  const   locale       = this.options.locale || this.$i18n.locale || 'en'
  const   query        = Object.assign(this.query, { locale, conference: id })

  this.query = query
  return query
}

function changeDateTime(numberOfIterations){
  if(!this.iterationsService) this.setIterationsService()
  const num = Number(numberOfIterations)

  this.setQueryString(num)

  this.getEvents(this.query).then(() => {
    this.iterationsService.add(num)
  })
}

function setQueryString(interations){

  const { next, prev } = this.selectedIteration
  
  let nextIteration = this.selectedIteration

  if(interations ==- 1) nextIteration = next
  if(interations == -2) nextIteration = next.next
  if(interations == 2)  nextIteration = prev.prev
  if(interations == 1)  nextIteration = prev
  
  const { aDateTime, endDateTime } = nextIteration
  const route = { query: { selected: aDateTime.toFormat('yyyy-MM-dd') } }


  if(interations) this.$router.replace(route)

  const start = aDateTime.toISO({includeOffset:false})
  const end   = endDateTime.toISO({includeOffset:false})

  this.query = { ...this.query, start, end }
}

function setIterationsService($i18n, date, type='week'){
  if(!$i18n) throw new Error('must have i18n installed')
  const opts   = this? this.options || {} : {}
  const locale = opts.locale || 'en'//getUserAgentLocale()

  if(date) date = DateTime.fromISO(date)
  else date = DateTime.local()
  if(type === 'week')
    return new CalWeeks($i18n, date, locale)
}

function mapByDay(events){
  const { raw } = events
  const days = {}

  for (let i = raw.length-1; i >=0; i--){ //backrards so days are in order in object from push
    const { hasOwnProperty } = Object.prototype
    const   dayStart         = DateTime.fromISO(raw[i].start).startOf('day')
    const   dayEnd           = DateTime.fromISO(raw[i].start).endOf('day')
    const   start            = DateTime.fromISO(raw[i].start)
    const   dayStartText     = dayStart.toISODate({includeOffset:false})


    if(!hasOwnProperty.call(days, dayStartText))
      days[dayStartText]=[]

    if(start>=dayStart && start<=dayEnd)
      days[dayStartText].push(raw[i])
  }

  events.days = days
  return events
}

function mapByWeek(events){
  const { days } = events
  const { hasOwnProperty } = Object.prototype
  const weeks = {}

  for (const day in days){
    const year       = DateTime.fromISO(day).year
    const weekNumber = DateTime.fromISO(day).weekNumber
    const weekText   = `${year}-${weekNumber}`

    if(!hasOwnProperty.call(weeks, weekText)) weeks[weekText]={}

    weeks[weekText][day]=days[day]

  }
  events.weeks=createLinkedList(weeks)
  return events
}

function createLinkedList(weeks){
  const weekArr = Object.values(weeks)

  //link listafy
  for (let i = 0; i < weekArr.length; i++){
    if(i>0)
      weekArr[i].next = weekArr[i-1]
    if(i<weekArr.length-1)
      weekArr[i].prev = weekArr[i+1]
  }
  return weeks
}
</script>
<style>
  a { color: #337ab7; text-decoration: none; }
  a:hover,
  a:focus { color: #23527c; text-decoration: underline; }
</style>
<style module>
  .calComponent{ position: relative; height: 78vh; width: 100vw;   }
</style>