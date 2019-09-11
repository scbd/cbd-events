<template>
  <section ref="main">
    <div :class="[$style.calComponent]">
      <CalHeader :selected-iteration="selectedIteration" />
      <CalBody :selected-iteration="selectedIteration" :conference="conference" :events="events" />
      <CalFooter :iterations="iterations" @action="changeDateTime" />
    </div>
  </section>
</template>


<script>

import { DateTime }       from 'luxon'
import events             from '../modules/Bus'
import CalBody            from './body/CalBody'
import CalHeader          from './header/CalHeader'
import CalFooter          from './footer/CalFooter'
import CalWeeks           from '../modules/CalWeeksService'
import messages           from '../locales'


export default {
  name      : 'Calendar',
  props     : [ 'options' ],
  components: { CalBody, CalHeader, CalFooter },
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
  const start = this.conference.startDate? DateTime.fromISO(this.conference.startDate) : DateTime.local()
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

  console.log('this.queryObject', this.queryObject)
  return queryFn(this.queryObject)
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

function applyFilter ({ data }){
  try{
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
//
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

  const start = aDateTime.toUTC().toISO()
  const end   = endDateTime.toUTC().toISO()

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
</script>
<style>
  a { color: #337ab7; text-decoration: none; }
  a:hover,
  a:focus { color: #23527c; text-decoration: underline; }
</style>
<style module>
  .calComponent{ position: relative; height: 100vh; width: 100vw; padding-bottom:5.3em; }
</style>