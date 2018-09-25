<template>
  <div class="container-fluid">
    <iframe class="docs-frame" :src="`https://www.cbddev.xyz/conferences/${conferenceCode}/${meetingCode}/documents?viewOnly=true`"></iframe>
  </div>
</template>

<script>
  export default {
    components: {},
    async asyncData ({store,params,route}) {
      return{
        conferenceCode:params.conferenceCode,
        meetingCode:params.meetingCode
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
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
.right{
  border-left: 1px solid black;
}
</style>
