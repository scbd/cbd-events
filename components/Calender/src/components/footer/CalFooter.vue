<template>
  <div
    class="container-fluid"
    :class="[$style.slideContainer]"
  >
    <div
      class="row"
      :class="[$style.bg]"
    >
      <transition
        name="slide"
        v-for="(item, index) in iterations"
        :key="item.weekNumber"
        @leave="leave"
      >
        <div
          v-if="inBounds(item,index)"
          @click="changeDate(index)"
          :class="[$style.bg,(index===7 && iterations.length===15)?$style.selected:'',$style.colXs5ths]"
        >
          <span>{{ item.startMon }}<br>
            {{ item.startDay }}-{{ item.endDay }}
          </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
let Velocity = {}

export default {
  name : 'CalFooter',
  props: ['iterations'],
  mounted(){
    Velocity = require('velocity-animate')
  },
  methods: {
    changeDate,
    handlers(){ return{ left: this.left, right: this.right } },
    inBounds(iteration, index){
      if(this.iterations && this.iterations.length !== 15) return false
      if(index > 4 && index < 10) return true
      return false
    },
    leave
  }
}// export

function changeDate(index){
  if(Number(index) === 7) return
  this.change = ((7 - Number(index)) >0)
  return  this.$emit('action', 7 - Number(index))
}

function leave(el){
  if(this.iterations && this.iterations.length === 15) return false
  const change = this.change ? '' : '-'

  Velocity(el, { translateX: `${change}100%`, 'background-color': '#eeeeee', color: 'inherit' }, { duration: 20 })
}


</script>

<style>
.slide-enter-active {
  transition: all .4s ease;
}
.slide-leave-active {
  transition: all .4s ease;
}
</style>
<style module>
  .slideContainer{
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    height: 3.5em;
    cursor: pointer;

  }
  .bg{
    background-color: #eeeeee;
    height: 3.5em;
    line-height: 1.75em;
    white-space: nowrap;
  }

  .selected{
    color: #ffffff;
    background-color: rgba(0,0,255,.8);
  }

  .currentOverlay{
    position:absolute;
    width: 10%;
    height: 95%;
    bottom: 0;
    left:45%;
  }
  .colXs5ths {
    position: relative;
    min-height: 3.5em;
    padding-right: 15px;
    padding-left: 15px;
    display: inline-block;
    width: 20%;
    color: #000;
    z-index:200;
    text-align: center;
  }
</style>
