<template>
  <nav class="mainn navbar  navbar-default">
    <div class="col-3" @click="close" >
      <svg class="icon-clock-o" v-if="options && options.cancel" >
        <use xlink:href="#icon-close" />
      </svg>
    </div>
    <div class="col-6 mid"> {{ title }} </div>
    <div class="col-3 right-side" @click="done" > {{ $t('done') }} </div>
  </nav>
</template>

<script>
export default {
  name   : 'HeaderBottomScreen',
  props  : { title: { type: String }, options: { type: Object } },
  methods: { close, done }
}

function close(){
  this.$root.$emit('bottom-screen-cancel', { something: 'yes' })
}

function done(){
  this.$root.$emit('bottom-screen-done', { something: 'yes' })
}
</script>

<style scoped>
  .left-side{ text-align: left; }
  .right-side{ text-align: right; }
  .mid{ text-align: center; font-weight: bold;}
  .mainn{
    color:#333;
    padding: .2em .2em 0 .2em;
    background-color: white;
    min-height: 30px;
    border:0;
    border-bottom: 1px solid #e7e7e7;
    border-radius:0;
    border-bottom: 1px solid rgb(231, 231, 231);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
    margin:0;
    transition: top 0.2s ease-in-out;
    position:fixed;
    top:0px;
    z-index:99999;
    width:100%;
  }
  @media (min-width: 0px) {
    .nav-justified > li { display: table-cell; width: 1%; font-size: 1.5em; }
  }

</style>
