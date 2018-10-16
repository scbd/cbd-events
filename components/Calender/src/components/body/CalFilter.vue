<template>
  <transition name="slide-filter" >
    <div :class="[$style.main]" v-on:click.stop="showFilter">
      <div  :class="$style.title">
        {{$t('filterEventsTitle')}}
        <span class="pull-right"><a href="#" v-on:click.stop="done">Done</a></span>
      </div>
      <div  :class="[$style.filterRow]">
        <div :class="[$style.formGroup]" class="form-group form-group-sm">
           <input :placeholder="$t('keyWord')"  type="input"   class="form-control input-sm" v-model="keyWordFilter" v-on:click.stop="">
        </div>
      </div>
      <hr style="margin-top:0;"/>
      <div  :class="[$style.filterRow]">
        <select v-model="selectedStream" class="form-control input-sm" v-on:click.stop="">
          <option :value="$t('stream')" selected>{{$t('stream')}}</option>
          <option value="official">Official</option>
          <option value="regional">Regional</option>
          <option value="contact">Contact</option>
          <option value="hls">High Level Segment</option>
          <option value="side-events">Side-events</option>
          <option value="side-events-cbd">Side-events SCBD</option>
          <option value="events-cbd">Events SCBD</option>
        </select>
      </div>
      <hr style="margin-top:0;"/>
      <div  :class="[$style.filterRow]" v-if="false">
        <select  v-model="selectedProgramme" class="form-control input-sm" v-on:click.stop="">
          <option :value="$t('programme')" selected>{{$t('programme')}}</option>
          <optgroup v-if="programme" :label="programme.title" v-for="programme in programmes" :key="programme.identifier" >
            <option :value="child.identifier" v-for="child in programme.children" :key="child.identifier" >{{child.title}}</option>
          </optgroup>
        </select>
      </div>
      <hr style="margin-top:0;"/>
      <div  :class="[$style.filterRow]" v-if="false">
        <select v-model="selectedAgendaItem" class="form-control input-sm" v-on:click.stop="">
          <option :value="$t('agendaItem')" selected>{{$t('agendaItem')}}</option>
          <option v-bind:key="agenda" v-for="agenda in agendaItems" v-bind:value="agenda">
            {{ agenda }}
          </option>
        </select>
      </div>
      <hr style="margin-top:0;" v-if="false"/>
    </div>
  </transition>
</template>

<script>

  import "@scbd/ecosystem-style/patterns/forms/build.min.css"
  import "@scbd/ecosystem-style/patterns/input-groups/build.min.css"
  import "@scbd/ecosystem-style/patterns/button-groups/build.css"
  import "@scbd/ecosystem-style/elements/buttons/build.min.css"
  import "@scbd/ecosystem-style/patterns/dropdowns/build.min.css"

  import events from '../../modules/Bus'
  import axios from 'axios'

  export default {
    name: 'Details',
    data:function(){
       return{
         keyWordFilter:'',
         showStreamDropdown:false,
         showSubjectDropdown:false,
         showAgendaItemDropdown:false,
         selectedStream:this.$t('stream'),
         selectedProgramme:this.$t('programme'),
         selectedAgendaItem:this.$t('agendaItem'),
         streams:[],
         agendaItems:[],
         programmes:[]
     }},
     created:function(){
       let locale = this.$i18n.locale
       getPrograms(locale ).then((progs)=>{
         progs = mapPrograms(sanitizeResult(progs.data,locale ))
         this.$set(this,'programmes',progs)
       })
     },
    props:['event'],
    methods:{
      showFilter:showFilter,
      toggleStream:toggleStream,
      done:done
    }
  }

  function done (e){
    e.data = {
                show:false,
                keyWordFilter:this.keyWordFilter,
                selectedAgendaItem:(this.selectedAgendaItem!==this.$t('agendaItem'))? this.selectedAgendaItem:'',
                selectedProgramme:(this.selectedProgramme!==this.$t('programme'))? this.selectedProgramme:'',
                selectedStream:(this.selectedStream!==this.$t('stream'))? this.selectedStream:'',
              }
    events.$emit('showFilter',e)
  }

  function showFilter (e){
    e.data = false
    events.$emit('showFilter',e)
  }
  function toggleStream (){
    this.showStreamDropdown=!this.showStreamDropdown
  }

  function getPrograms(){
    let endPoint = `/api/v2013/thesaurus/domains/CBD-SUBJECTS/terms`
    return axios.get(endPoint)
  }

  function mapPrograms (programmes){
    let parents = []
    let map = {}
    for (let i = 0; i < programmes.length; i++)
      map[programmes[i].identifier]=programmes[i]

    for (let i = 0; i < programmes.length; i++)
      if(!programmes[i].broaderTerms.length){
        parents.push(programmes[i])
        if(programmes[i].narrowerTerms.length)
          if(!programmes[i].children)programmes[i].children=[]
            for (let j = 0; j < programmes[i].narrowerTerms.length; j++)
              programmes[i].children.push(map[programmes[i].narrowerTerms[j]])
      }
    return parents
  }

  function sanitizeResult(docs,locale='en'){
    for (var i = 0; i < docs.length; i++)
      for (let variable in docs[i])
        if(['title'].includes(variable))
          docs[i][variable]=docs[i][variable][locale]
    return docs
  }
</script>
<style>

  .slide-filter-leave-active, .slide-filter-enter-active  {
    transition: all .4s ease;
  }
  .slide-filter-enter {
    transform: translateY(100%);
    opacity: 0;
  }
  .slide-filter-leave-to {
    transform: translateY(200%);
    opacity: 0;
  }
</style>
<style module>

  .filterRow{
    padding: 5px 15px 5px 15px;

  }
  .title {
    font-size: 1.2em;
    padding: 3px 15px 3px 15px;
    color:white;
    /* Fallback (could use .jpg/.png alternatively) */
    background-color: #333333;
    background: #333333; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(left top, #555, #333333); /* For Safari 5.1 to 6.0 */
    background: -o-linear-gradient(bottom right, #555, #333333); /* For Opera 11.1 to 12.0 */
    background: -moz-linear-gradient(bottom right, #555, #333333); /* For Firefox 3.6 to 15 */
    background: linear-gradient(to bottom right, #555, #333333); /* Standard syntax (must be last) */

  }
  .formGroup{
    margin-bottom:0;
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
</style>
