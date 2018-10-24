<template>
  <transition name="slide-details" >
    <div :class="[$style.main]" v-on:click.stop="showDetails">
      <div  :class="$style.title">
                <span :class="$style.pointer" class="eco-cancel pull-right"></span>
        <span >{{calEvent.title}}</span>

      </div>
      <div :class="[$style.body]">

        <div class="text-primary">
          <span class="eco-clock"></span> {{dateTime}}
        </div>

        <div v-if="addToCalReady()">
          <span class="eco-calendar-empty"></span>
          <span v-bind:key="index" :class="$style.caps" v-for="(stream, index) in calEvent.stream_ss">{{stream}}<span v-if="index < calEvent.stream_ss.length-1">,</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>

          <AddToCalendar :options="{baseUrl:api}" :event="calEvent" style="display:inline-block;" v-on:click.stop=""/>
        </div>

        <div v-if="isInSession()"><span class="eco-location"></span> {{location}}</div>
        <div v-if="(organizer || organizerEmail) && $isStaff">
          <span class="eco-address-card" ></span>
          <a :href="`${organizerEmail}`">{{organizer || organizerEmail}}</a>
          <div :key="i" v-for="(o, i) in calEvent.organizers">{{o}}</div>
        </div>
        <div v-if="calEvent.item_ss && calEvent.item_ss.length">
          <table  >
            <tr>
              <td style="vertical-align:top;">
                  <span class="eco-docs" ></span>
              </td>
              <td>
                <table >
                  <tr :key="index" v-for="(item, index) in calEvent.item_ss">
                    <td>
                      <AgendaItem :body="calEvent.itemMeeting[index]" :item="item" />

                    </td>
                    <td>
                      {{itemTextArr(index)}}
                    </td>
                    <td>
                      <CalEventDetailsFile v-if="files(index)._id" :file="files(index)"/>
                    </td>
                    <td>
                      <FileStatus v-if="files(index)._id && $isStaff" :file="files(index)"/>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div>
        
        </div>
      </div>
      <div :class="$style.footer">
        <span v-html="calEvent.description"></span>
      </div>
    </div>
  </transition>
</template>

<script>

  import AddToCalendar        from '~/components/AddToCalendar/src/components/index.vue'
  import events               from '../../modules/Bus'
  import AgendaItem           from './AgendaItem'
  import FileStatus           from './CalEventDetailsFileStatus'
  import {DateTime}           from 'luxon'
  import CalEventDetailsFile  from './CalEventDetailsFile'

  import '@scbd/ecosystem-style/modifiers/helpers/build.min.css'
  import '@scbd/ecosystem-style/modifiers/states/build.min.css'
  import '@scbd/ecosystem-style/patterns/button-groups/build.css'

  export default {
    name: 'Details',
    props:['event','conference'],
    data:function(){
      return{
        api:process.env.API
    }},
    components:{AgendaItem,CalEventDetailsFile,FileStatus,AddToCalendar},
    methods:{
      showDetails:showDetails,
      files:files,
      itemTextArr:itemTextArr,
      goTo:goTo,
      isInSession:isInSession,
      addToCalReady:addToCalReady
    },
    computed:{
      calEvent:calEvent,
      dateTime:dateTime,
      location:location,
      organizer:organizer,
      organizerEmail:organizerEmail
    }
  }

  function addToCalReady(){
    return this.conference.schedule.addToCalReady
  }
  
  function goTo(url){
    if(typeof window !== 'undefined')
      window.open(url,'_blank')
  }

  function itemTextArr (i){
      if(this.calEvent.itemText)
        return this.calEvent.itemText[i]
      return''
  }

  function showDetails (e){
    e.stopPropagation()
    e.data ={data:true}
    events.$emit('EventDetails',e)
  }
  function calEvent (){

    if(!this.event) return {}
    return this.event
  }
  function dateTime () {
    let start = DateTime.fromISO(this.calEvent.start,{ zone: this.calEvent.timezone }).toFormat('T')
    let end = DateTime.fromISO(this.calEvent.end,{ zone: this.calEvent.timezone }).toFormat('T  cccc, LLLL L ')
    return  `${start} - ${end}`
  }
  function location () {

    let localName = this.calEvent.roomLocalName || ''
    let location = this.calEvent.roomLocation
    let title = this.calEvent.roomTitle

    return  `${localName}${(location&&localName) ?',':''} ${location}${title ?',':''} ${title}`
  }
  
  function organizer () {
    let name = this.calEvent.organizerName || ''
    let email = this.calEvent.organizerEmail || ''
    if(email) email = `${name? '-':''} <${email}>`
    if(!email && !name) return false
    return  `${name} ${email}`
  }
  function organizerEmail () {
    return  this.calEvent.organizerEmail || ''
  }
  
  function files (index) {
    if(!this.calEvent.itemText)this.calEvent.itemText=[]
    if(!this.calEvent.item)this.calEvent.item=[]
    if(!this.calEvent.itemFiles)this.calEvent.itemFiles=[]
    for (var i = 0; i < this.calEvent.itemFiles.length; i++) {
      if(typeof this.calEvent.itemFiles[i] === 'string')
        this.calEvent.itemFiles[i] = JSON.parse(this.calEvent.itemFiles[i])

      if(this.calEvent.itemFiles[i] && this.calEvent.itemFiles[i][0])
        this.calEvent.itemFiles[i] = this.calEvent.itemFiles[i][0]
    }

    return  this.calEvent.itemFiles[index]|| {}
  }
  
  function isInSession() {

    let start = DateTime.fromISO(this.conference.schedule.start)
    let now = DateTime.local().setZone(this.conference.timezone)

    if(start <= now )
        return true

    return false
  }
</script>
<style>
/* @import url('@scbd/eco-molecule-add-to-calendar/dist/vue/AddToCalendar.css') */
  .slide-details-leave-active, .slide-details-enter-active  {
    transition: all .4s ease;
  }
  .slide-details-enter {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-details-leave-to {
    transform: translateY(200%);
    opacity: 0;
  }
</style>
<style module>
.caps{
  text-transform: capitalize;
}
.pointer{
  cursor:pointer;
}
  .main {
    white-space: normal;
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    background-color: #fff;
    z-index: 20;
    overflow-y: auto;
  }
  .body {
    padding: 5px 15px 5px 15px;
  }
  .footer{
      border-top: 1px solid #eee;
      margin: 0 0 0 0;
      padding: 5px 15px 5px 15px;
  }
  .title {
    /* position: absolute;
    top:0;
    left:0;
    right:0; */
    font-size: 1.2em;
    padding: 3px 15px 3px 15px;


    color:white;
    /* Fallback (could use .jpg/.png alternatively) */
    background-color: #009b48;

    background: #009b48; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, #008200, #009b48); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, #008200, #009b48); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, #008200, #009b48); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, #008200, #009b48); /* Standard syntax (must be last) */

  }
    .titleCont{
      background-color: #009b48;
      color:white;
    }
</style>
