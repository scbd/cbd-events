<template>
  <div class="main">
    <div class="text-center">
      <svg class="icon x3"><use href="#icon-wifi-off" /></svg>
      <h3>{{ $t('serviceUnavailable') }}</h3>
    </div>
  </div>
</template>

<style scoped>
  .main{
    background-color: #d3d3d3;
    height: 83vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>