<template>
  <section ref="main">
    <div  :class="[$style.calComponent]">
      <CalHeader :selected-iteration="selectedIteration" />
      <CalBody :selected-iteration="selectedIteration" :conference="conference" :events="events"/>
      <CalFooter :iterations="iterations" @action="changeDateTime"/>
    </div>
  </section>
</template>
<style>
  a {
    color: #337ab7;
    text-decoration: none;
  }
  a:hover,
  a:focus {
    color: #23527c;
    text-decoration: underline;
  }
</style>
<style module>
  .calComponent{
    position: relative;
    height: 100vh;
    width: 100vw;
    padding-bottom:5.3em;
  }
</style>

<script>

  import {DateTime}         from 'luxon'
  import events             from '../modules/Bus'
  import CalBody            from './body/CalBody'
  import CalHeader          from './header/CalHeader'
  import CalFooter          from './footer/CalFooter'
  import CalWeeks           from '../modules/CalWeeksService'
  import messages           from '../locales'
  import VueAuthentication  from '../modules/Authentication'
  import Vue from 'vue'
  Vue.use(VueAuthentication,{env:process.env.NODE_ENV})


  export default {
    name: 'Calendar',
    props:['options'],
    data:function(){
      return{
        events:{},
        query:{},
        iterationsService:this.setIterationsService(this.$i18n,this.$route.query.selected),
        conference:this.options.conference
    }},
    components:{CalBody,CalHeader,CalFooter},
    computed:{
      iterations:function(){ let its;  if(this.iterationsService) its = this.iterationsService.iterations; return its || []},
      selectedIteration:function(){return this.iterationsService.selected || {}},
      queryObject:queryObject
    },
    methods: {
      changeDateTime:changeDateTime,
      setIterationsService:setIterationsService,
      getEvents:function(){
        return this.options.queryFn(this.queryObject).then((e)=>{
          this.events = e
        })
      },
      setQueryString:setQueryString,
      applyFilter:applyFilter
    },
    mounted:function(){
      events.$on('showFilter', this.applyFilter)

    },
    created: function(){
      if(!this.$route.query || !this.$route.query.selected)
        this.$router.replace({
                  query: { selected: DateTime.local().toFormat('yyyy-MM-dd') }
                })
      else if(this.$route.query.selected)
        this.iterationsService=this.setIterationsService(this.$i18n,this.$route.query.selected)
      this.setQueryString(0)
      this.getEvents()
    },
    beforeCreate:function(){

      if(!this.$i18n)
        throw new Error('$i18n must be installed')

      if(this.$i18n)
        for (let locale in messages){
          let msgs = this.$i18n.getLocaleMessage( locale )
          this.$i18n.setLocaleMessage( locale, Object.assign(msgs,messages[locale]) )
        }
    }

  }

  function applyFilter (e){
    if(e && e.data && !e.data.show){
      if(e.data.keyWordFilter) this.query.keyWordFilter = e.data.keyWordFilter
      if(e.data.selectedAgendaItem) this.query.selectedAgendaItem = e.data.selectedAgendaItem
      if(e.data.selectedProgramme) this.query.selectedProgramme = e.data.selectedProgramme
      if(e.data.selectedStream) this.query.selectedStream = e.data.selectedStream

    }else{
      this.query = {}
    }
    if(!this.query.locale)this.query.locale=this.options.locale || this.$i18n.locale
      this.getEvents(this.queryObject)
  }


  function queryObject (){
    let {locale,conference} = this.options
    if(conference)
      conference = conference._id
    let query = Object.assign(this.query,{locale,conference})
    if(!query.locale)query.locale='en'
    this.query = query
    return query
  }

  function changeDateTime(numberOfIterations){
    if(!this.iterationsService) this.setIterationsService()
    let num = Number(numberOfIterations)
    this.setQueryString(num)

    this.getEvents(this.query).then(()=>{
      this.iterationsService.add(num)
    })
  }
  //
  function setQueryString(interations){
    let nextIteration
    if(interations==-1) nextIteration = this.selectedIteration.next
    if(interations==-2) nextIteration = this.selectedIteration.next.next
    if(interations==2) nextIteration = this.selectedIteration.prev.prev
    if(interations==1) nextIteration = this.selectedIteration.prev
    if(interations==0) nextIteration = this.selectedIteration

    if(interations)
      this.$router.replace({
        query: { selected: nextIteration.aDateTime.toFormat('yyyy-MM-dd') }
      })
    let start = nextIteration.aDateTime.toUTC().toISO()
    let end = nextIteration.endDateTime.toUTC().toISO()

    this.query.start = start
    this.query.end = end
  }
  //
  function setIterationsService($i18n,date, type='week'){

    if(!$i18n) throw new Error('must have i18n installed')
    let opts   = this? this.options || {} : {}
    let locale = opts.locale || 'en'//getUserAgentLocale()
    if(date) date = DateTime.fromISO(date)
    else date = DateTime.local()
    if(type==='week')
      return new CalWeeks($i18n,date,locale)
  }
</script>
