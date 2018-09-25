<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-6">
         {{$t('home')}}<br>sffgsdfgsdfgs



         <svg class="icon-clock-o"><use xlink:href="#icon-clock-o"></use></svg>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    async asyncData ({store,params,router}) {
      console.log('index asyncData',params)
    }
  }
</script>

<style>

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
