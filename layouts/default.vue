<template>
  <div >
    <Header/>
    <main class="main-view debug">
      <nuxt/>
    </main>
    <Nav/>
  </div>
</template>

<script>
  import '@scbd/ecosystem-icons/all/all.css'

  import Header             from '~/components/header/header'
  import Nav                from '~/components/navigation/index'
  // import VueAuthentication  from '../modules/Authentication'
  //
  // import Vue from 'vue'
  // Vue.use(VueAuthentication,{env:process.env.NODE_ENV})

  export default {
    name:'default',
    components:{Header,Nav}
  }
</script>

<style>

.debugB {
  border: 1px solid blue;
}
.debug {
  border: 1px solid red;
}
.table{
  border-collapse: collapse;
  border-spacing: 0px;
}
.marginless{
  margin:0;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
a {
    color: #337ab7;
    text-decoration: none;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
{
  transform: translatey(-35px);
  opacity: 0;
}
</style>
