<template>
  <div class="main">
    <div class="text-center">
      <svg class="icon x3"  ><use xlink:href="#icon-wifi-off"></use></svg>
      <h3>{{$t('serviceUnavailable')}}</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Offline'
  }

</script>
<style scoped>
  .main{
    background-color: #d3d3d3;
    height: 83vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>