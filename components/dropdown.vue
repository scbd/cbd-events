<template>
  <div class="btn-group atop" :class="{open:isOpen}" @mouseenter="toggle()" @mouseleave="toggle()">
    <button  v-on:click="toggle()" type="button" class="btn btn-sm btn-default dropdown-toggle" >
            {{title}} <span class="caret"></span>
    </button>

    <transition name="slide-fade">
      <ul class="dropdown-menu" v-if="isOpen">

        <li v-for="line in options" :key="line.title">
          <a :href="`${$router.currentRoute.path}?${buildQueryString(line.params)}`" v-on:click.prevent.stop="goTo(line.params)">{{line.title}}</a>
        </li>
      </ul>
    </transition>

  </div>
</template>

<script>
  import querystring from 'querystring'
  import '@scbd/ecosystem-style/patterns/dropdowns/build.min.css'
  import '@scbd/ecosystem-style/elements/buttons/build.min.css'
  export default {
    name:'Dropdown',
    props:['title','options'],
    data:function(){
      buildQueryString(this.options[0].params)
      return{
        active:'',
        isOpen:false
    }},
    methods:{
      toggle:toggle,
      buildQueryString:buildQueryString,
      goTo:goTo
    },
    // beforeRouteUpdate (to, from, next) {
    //   console.log('do this')
    //   next()
    // }
  }
  function goTo(params){
    this.$router.push({
      path: this.$route.path,
      query: params
    })
  }
  function toggle(){
    this.isOpen = !this.isOpen
  }
  function buildQueryString(params){
    return querystring.stringify(params)
  }
</script>
<style>
.atop{
  vertical-align: top;
  margin-top: .4em;
}
</style>
