<template>
  <div class="container-fluid" :class="[$style.bg,$style.gradient]" >
    <div class="row" :class="[$style.row]" >

      <div v-on:click.stop="toggleWeekSelect()" class="col-9" :class="[$style.left]" >
        <span :class="[$style.title]">{{ selectedIteration.title }} </span>
        <small><span>{{ selectedIteration.subTitle }}</span></small>
        <Icon name="select-arrows" in-text="true"/>
      </div>

      <div class="col-3" :class="[$style.right]" @click="toggleFilter">
        <Icon  name="filter-list" :class="[$style.pointer]" />
      </div>
    </div>
  </div>
</template>

<script>

import events from '../../modules/Bus'

export default {
  name   : 'CalHeader',
  props  : [ 'selectedIteration' ],
  methods: { toggleWeekSelect, toggleFilter },
  data
}

function toggleWeekSelect(){
  this.$root.$emit('bottom-screen-done', { something: 'yes' })
}

function  data(){ return{ showFilter: false } }

function toggleFilter(){ events.$emit('showFilter') }

</script>

<style module>
  .row{ background-color: rgba(0,0,0,0.40); height: 1.75em; }
  .bg{ position:absolute; top:0; left:0; right:0; color:white; z-index:500; }
  .gradient {
      position:relative;
      background: #bdc3c7; /* For browsers that do not support gradients */
      background: -webkit-linear-gradient(left top, #bdc3c7, #2c3e50); /* For Safari 5.1 to 6.0 */
      background: -o-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Opera 11.1 to 12.0 */
      background: -moz-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Firefox 3.6 to 15 */
      background: linear-gradient(to bottom right, #bdc3c7, #2c3e50); /* Standard syntax (must be last) */
  }
  .left{ line-height: 1.75em; height: 1.75em; text-align: left; }
  .right{ text-align: right; height: 1.75em; }
  .title{ font-weight: bold; }
  .pointer{ cursor:pointer; }
</style>
