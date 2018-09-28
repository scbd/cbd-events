<template>
  <div >
    <!-- demo only 2016 -->
    <iframe class="docs-frame" :src="`${iFrameHost}/conferences/2016/schedules?viewOnly=true&datetime=2016-12-15T10:00`"></iframe>
    <!-- <iframe class="docs-frame" :src="`${iFrameHost}/conferences/${conferenceCode}/schedules?viewOnly=true`"></iframe> -->
  </div>
</template>

<script>
  export default {
    async asyncData ({store,params}) {

      return{
        conferenceCode:params.conferenceCode,
        iFrameHost:process.env.IFRAME_HOST
      }
    }
  }
</script>

<style>
  .docs-frame{
    width:100%;
    height:90vh;
    border: none;
  }
</style>
