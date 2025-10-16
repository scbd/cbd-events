
<template>
<div class="screen">
  <div class="ring">
    <Spinner :size="250" color="#009b48">
      <div class="text-cont">
        <img src="https://attachments.cbd.int/cbd-leaf-green.svg" ><br>
        <span class="percent" v-if="state==='downloading'">      {{percent}}%</span>
        <span class="msg"     v-if="state==='downloading'">      {{$t('downloading')}}</span>
        <span class="msg"     v-if="state==='downloadComplete'"> {{$t('downloadComplete')}}</span>
        <span class="msg"     v-if="state==='installing'">       {{$t('installing')}}</span>
      </div>
    </Spinner>
  </div>
</div>
</template>

<script>
import Spinner from './Spinner'

export default {
  name      : 'Loading',
  components: { Spinner },
  props     : [ 'percent', 'state' ]
}
</script>

<style scoped>
.screen{ z-index:9999999999; position: relative; width: 100vw; height: 100vh; background-color: rgba(255,255,255,.7); position: fixed; top:0; left: 0;}
.ring{ position: absolute;   top: 50%; left: 50%; transform: translate(-50%, -50%);}
.percent{ font-size: 1.5em; font-weight: bold; color: #009b48; display: inline-block; }
.msg{ font-size: .8em; font-weight: bold;  display: inline-block; white-space: nowrap; }
.text-cont{ text-align: center; margin-bottom: 2em;}
</style>