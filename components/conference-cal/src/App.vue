<template>
  <div id="app">
    <ConferenceCal code="2018"/>
  </div>
</template>

<script>
import ConferenceCal from './components/ConferenceCal.vue'

export default {
  name: 'app',
  components: {
    ConferenceCal
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
