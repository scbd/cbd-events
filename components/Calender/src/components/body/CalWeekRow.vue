<template>
  <div    :class="[$style.main]" >
    <!-- {{day.dayOfWeekShort}} :ref="`weekRow${yIndex}`"
    {{day.dayNumber}} -->
    <div :ref="`weekRowTitle${yIndex}`" class="text-center" :class="[$style.mainTitleChild,day.isToday? $style.today:'',day.isWeekend? $style.weekend:'']" >
      <div  :class="[$style.inner]">
        {{day.subTitle}} <br>
        {{day.title}}
      </div>
    </div>
    <transition name="fader" >
      <div :ref="`hasMore${yIndex}`"  :class="[$style.hasMore]" v-if="hasMoreLeft">
        <div  :class="[$style.hasMoreContainer]" v-on:click="scrollBack">
          <div  :class="[$style.hasMoreInner]">
            <span class="eco-left-circled"></span>
          </div>
        </div>
      </div>
    </transition>
    <div :class="[$style.mainChildCont]" ref="day">
      <CalEvent :conference:="conference" :ref="`calEvent${yIndex}`" :key="evnt.identifier" :event="evnt" :indicies="{xIndex:index,yIndex:yIndex,totalXIndex:dayEvents.length}" v-for="(evnt, index) in dayEvents" :class="[$style.mainChild]"/>
    </div>
    <transition name="fader" >
      <div :ref="`hasMore${yIndex}`"  :class="[$style.hasMoreRight]" v-if="hasMoreRight">
        <div  :class="[$style.hasMoreContainer]" v-on:click="scrollForward">
          <div :class="[$style.hasMoreInner]">
            <span class="eco-right-circled"></span>
          </div>
        </div>
      </div>
    </transition >
  </div>
</template>

<script>
import CalEvent     from '../event/CalEvent'
import '@scbd/ecosystem-icons/right-circled/icon.min.css'
import '@scbd/ecosystem-icons/left-circled/icon.min.css'

export default {
  name: 'CalWeekRow',
  data:function(){
    return{
      scrollPosition:0,
      hasMoreL:false
  }},
  props:['day','dayEvents','yIndex','conference'],
  components:{CalEvent},
  methods:{
    onScroll:onScroll,
    scrollForward:scrollForward,
    scrollBack:scrollBack
  },
  computed:{
    hasMoreRight:hasMoreRight,
    hasMoreLeft:hasMoreLeft
  },
  mounted () {

    let el = this.$refs.day
    if(el.addEventListener)
       el.addEventListener('scroll', this.onScroll)
    else
      el.onscroll = this.onScroll

  }
}

  function hasMoreRight() {
    if(!this.dayEvents) return false
    let eventSizePercent = 100/this.dayEvents.length

    if(this.scrollPosition + eventSizePercent >=100) return false
    return ( eventSizePercent < 20)
  }

  function hasMoreLeft() {
    return this.hasMoreL
  }

  function onScroll(e) {

    if(!this.dayEvents){
      this.hasMoreL = 0
      return
    }

    this.hasMoreL  = (xPercentage(e.target) >0)
    this.scrollPosition = (xPercentage(e.target))
  }

  function xPercentage(el) {
    return 100 * el.scrollLeft / (el.scrollWidth-el.clientWidth)
  }

  function scrollForward() {
    let el = this.$refs.day
    el.scrollLeft += el.clientWidth
  }

  function scrollBack() {
    let el = this.$refs.day
    el.scrollLeft -= el.clientWidth
  }
</script>
<style>
  .fader-enter-active {
    transition: opacity .5s;
  }
  .fader-leave-active {
    transition: opacity .5s;
  }
  .fader-leave-to{
    opacity: 0;
  }

  .fader-enter {
    opacity: 0;
  }
</style>
<style module>
.fader-enter {
  opacity: 0;
}
.inner{

  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
 transform: translate(-50%, -50%);
}
  .weekend{
    color:red;
  }
  .today{
    color:rgba(0, 0, 255, 0.8);
  }
  .main{
    position: relative;
    height:14.2857%;
    padding-left:10%;
    border-bottom: 1px solid #eeeeee;
    overflow: hidden;

  }
  .mainChildCont{
    height:100%;
    width:100%;
    display:flex;
    /* float: left; */

    overflow-x: auto;
    overflow-y: hidden;
    /* white-space: nowrap; */
    scroll-behavior: smooth;
  }
  .mainChild{
    display: inline-block;
    width:19.80%;
    height:95%;

    margin: .1% .1% .1% .1%;
  }
  .hasMoreContainer{
    position: relative;
    height: 100%;
  }
  .hasMoreInner{

    position: absolute;
    top: 50%;
left: 50%;
   transform: translate(-50%, -50%);
  }
  .hasMore{
    position: absolute;
    left: 10%;
    top:0;
    bottom:0;
    width:3%;
    height:100%;
    float: left;
    border-bottom: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
    background-color: rgba(256,256,256,.7);
    z-index:10;
    cursor: pointer;
  }
  .hasMoreRight{
    position: absolute;
    right: 0;
    top:0;
    bottom:0;
    width:3%;
    height:100%;
    float: left;
    border-bottom: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
    background-color: rgba(256,256,256,.7);
    z-index:10;
    cursor: pointer;
  }
  .mainTitleChild{
    position: absolute;
    left: 0;
    top:0;
    bottom:0;
    width:10%;
    height:100%;
    float: left;
    border-bottom: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
  }
  @media (min-width:1024px){
    .hasMore{
      width:2%;
    }
    .hasMoreRight{
      width:2%;
    }
  }
</style>
