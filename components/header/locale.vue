<template>
  <div class="btn-group atop" :class="{open:isOpen}" @mouseenter="toggle()" @mouseleave="toggle()">

    <a  v-on:click="toggle()" class="set-languages"  href="#">
          <span class="badge badge-default color-white">
            {{title}}<span class="caret"></span>
          </span>
    </a>
    <transition name="slide-fade">
      <ul class="dropdown-menu" v-if="isOpen">

        <li v-for="locale in options" :key="locale.code">
          <a :href="switchLocalePath(locale.code)" >{{locale.code}}</a>
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
    data:function(){

      return{
        active:'',
        isOpen:false,
        options:this.$i18n.locales,
        title:this.$i18n.locale
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
  display: inline;
  vertical-align: top;
  margin-top: .4em;
}
</style>
