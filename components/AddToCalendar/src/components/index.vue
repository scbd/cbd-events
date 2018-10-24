<template>
  <section >
    <div  :class="[$style.main]">
      <div class="btn-group">
        <button type="button" :class="$style.but" class="btn btn-xs btn-default" v-on:click.stop="drop">
          {{$t('title')}}
          <span class="caret"></span>
        </button>
        <div :class="[$style.arrowBorder]" v-if="showDrop"></div>
        <div :class="[$style.arrow]" v-if="showDrop"></div>

          <ul ref="dropdown"   v-if="showDrop" class="dropdown-menu" v-on:click.stop="drop">
            <li v-if="hasStreams">
              <div :class="[$style.formGroup]" class="form-group form-group-sm">
                  <label><small>{{$t('selectStream')}}</small></label>
                  <select class="form-control input-sm" v-model="stream" v-on:click.stop="">
                    <option value="event">This Event</option>
                    <option  :key="s" v-for="s in event.stream" :value="s" style="text-transform: capitalize;">{{s}}</option>
                  </select>
              </div>
            </li>
            <li role="separator" class="divider" v-if="hasStreams"></li>
             <li ><div :class="[$style.title]"><small>{{$t('calendarClient')}}</small></div></li>
             <li><a :class="[$style.option]" v-on:click="goToWebcal"><span class="eco-apple"></span>  Apple</a></li>
             <li><a :class="[$style.option]" v-on:click="goToGoogleCal"><span class="eco-google"></span>  Google</a></li>
             <li><a :class="[$style.option]" v-on:click="goToWebcal"><span class="eco-windows"></span>  Outlook</a></li>
             <li><a :class="[$style.option]" v-on:click="goToOutlookOnline"><span class="eco-windows"></span>  Outlook <small>(on-line)</small></a></li>
             <li><a :class="[$style.option]" v-on:click="goToYahoo"><span class="eco-yahoo"></span>  Yahoo</a></li>
             <li role="separator" class="divider"></li>
             <li>
               <div :class="[$style.formGroup]" class="form-group form-group-sm">
                 <label><small>{{$t('subscribeManually')}}</small></label>
                 <p :class="[$style.formGroupPara]"><small>{{$t('subscribeManuallyDescription')}}</small></p>
                 <div class="input-group">

                  <input ref="icsInput" type="input"   class="form-control input-sm" :value="ics" v-on:click.stop="">
                  <span class="input-group-addon" style="line-height:1.3em;" v-on:click.stop="copy"><span class="eco-docs"></span></span>
                </div>
                </div>
             </li>
           </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import querystring  from 'querystring'
  import messages     from '../locales'

  import '@scbd/ecosystem-icons/all/all.css'
  import "@scbd/ecosystem-style/layouts/base/build.min.css"
  import "@scbd/ecosystem-style/patterns/button-groups/build.css"
  import "@scbd/ecosystem-style/elements/buttons/build.min.css"
  import "@scbd/ecosystem-style/patterns/dropdowns/build.min.css"
  import "@scbd/ecosystem-style/patterns/forms/build.min.css"
  import "@scbd/ecosystem-style/patterns/input-groups/build.min.css"

  export default {
    name: 'AddToCalendar',
    props:['event','options'],
    data:function(){
      return{
        showDrop:false,
        stream:'event'
    }},
    beforeCreate:function(){

      if(!this.$i18n)
        throw new Error('$i18n must be installed')

      if(this.$i18n)
        for (let locale in messages){
          let msgs = this.$i18n.getLocaleMessage( locale )
          this.$i18n.setLocaleMessage( locale, Object.assign(msgs,messages[locale]) )
        }
    },
    created:function(){
      /* eslint-disable */
      if(this.options && this.options.icsFunction && typeof this.options.icsFunction === "function")
        ics = this.options.icsFunction
      /* eslint-enable */
    },
    methods:{
      drop:drop,
      goToWebcal:goToWebcal,
      goToGoogleCal:goToGoogleCal,
      goToOutlookOnline:goToOutlookOnline,
      goToYahoo:goToYahoo,
      copy:copy,
      reservationUri:reservationUri
    },
    computed:{
      ics:ics,
      hasStreams:hasStreams,
  
    }
  }

  function copy () {

    this.$refs.icsInput.select()
    if(typeof window !== 'undefined')
      window.document.execCommand("copy")
    this.drop()
  }
  function hasStreams () {
    return (this.event.stream && this.event.stream.length)
  }
  function ics () {
    let baseUrl = ''
    if(this.options && this.options.baseUrl) baseUrl = this.options.baseUrl
    else if(typeof window !== 'undefined') baseUrl =`${window.location.protocol}//${window.location.hostname}:${window.location.port}`

    if(this.stream === 'event')
      return `${baseUrl}/api/v2018/iCalEvents/${encodeURIComponent(this.reservationUri(this.event.identifier))}`
    else
      return `${baseUrl}/api/v2018/iCal/${this.event.conference}/${this.stream}`
  }
  function reservationUri (id) {
      return `${this.options.baseUrl}/api/v2016/reservations/${id}`
  }
  function drop () {
    this.showDrop=!this.showDrop
  }
  function goToWebcal(){
    if(typeof window !== 'undefined')
      window.open(`webcal://${this.ics}`,'_blank')
  }
  function goToGoogleCal(){
    // let queryString = querystring.stringify({ action:'TEMPLATE',
    //                                           dates:`${this.event.start.replace(/-|:|\.\d\d\d/g,"")}/${this.event.end.replace(/-|:|\.\d\d\d/g,"")}`,
    //                                           text:this.event.title,
    //                                           location:this.event.location,
    //                                           details:this.event.description,
    //
    //                                           trp:true
    //                                         })
    //
    // if(typeof window !== 'undefined')
    //   window.open(`https://www.google.com/calendar/event?${queryString}`,'_blank')
    if(typeof window !== 'undefined')
      window.open(`https://www.google.com/calendar/render?cid=webcal://${this.ics}`,'_blank')

  }

  function goToYahoo(){
    let queryString = querystring.stringify({ v:60,
                                              view:'d',
                                              type:20,
                                              st:this.event.start,
                                              et:this.event.end,
                                              title:this.event.title,
                                              in_loc:this.event.location,
                                              desc:this.event.description
                                            })

    if(typeof window !== 'undefined')
      window.open(`https://calendar.yahoo.com/?${queryString}`,'_blank')

  }
  function goToOutlookOnline(){
    let queryString = querystring.stringify({ path:'/calendar/action/subscribe',
                                              url:`webcal:${this.ics}`,
                                              name:this.stream
                                            })

    if(typeof window !== 'undefined')
      window.open(`https://outlook.live.com/owa/?${queryString}`,'_blank')
  }

</script>
<style scoped>
  .dropdown-menu{
    display: inline-block !important;
    top: 117%;
    width:200px;

  }
  select {
    text-transform:capitalize;
    width:100% !important;
  }
</style>
<style module>
  .streamOption{
    text-transform: capitalize;
  }
  .option{
    padding: 5px 10px 5px 10px !important;
    text-decoration: none;
  }
  .main{
    font-size: 1em;
  }
  .but{
    position: relative;
  }
  .formGroup{
    padding: 5px 5px 5px 5px;
  }
  .formGroupPara{
    margin: 0 0 0 0;
  }
  .arrow {
    position: absolute;
    top: 105%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;  /* left arrow slant */
    border-right: 5px solid transparent; /* right arrow slant */
    border-bottom: 5px solid #fff; /* bottom, add background color here */
    font-size: 0;
    line-height: 0;
    z-index: 1010;
   }
  .arrowBorder {
    position: absolute;
    top: 100%;
    left: 49%;
    width: 0;
    height: 0;
    border-left: 7px solid transparent;  /* left arrow slant */
    border-right: 7px solid transparent; /* right arrow slant */
    border-bottom: 5px solid lightgrey; /* bottom, add background color here */
    font-size: 0;
    line-height: 0;
    z-index: 999;
  }
  .title{
    padding: 5px 5px 5px 5px ;
    font-weight: bold;
  }
</style>
