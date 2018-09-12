<template>
  <div class="container-fluid debug">
        <iframe class="docs-frame" ref="docFrame" src="http://localhost:2000/conferences/2018/cop-13/documents?viewOnly"></iframe>
  </div>
</template>

<script>
  export default {
    components: {},
    watchQuery: ['state'],
    mounted() {

      if(!window) return;
    
      window.addEventListener('message', receiveMessage)

    },
  beforeDestroy () {
      window.removeEventListener('message', receiveMessage)
    }
  }

  function receiveMessage(event)
  {
    let message = JSON.parse(event.data);
    console.log(message)
  }  
</script>

<style>

.docs-frame{
  width:100%;
  height:95vh;
  margin-top:24px
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
