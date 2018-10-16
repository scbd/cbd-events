<template>
    <span  :class="[$style.main,$style[mapBody()]]" >
      {{mapBody()}} {{item}}
    </span>
</template>

<script>
  export default {
    name: 'AgendaItem',
    props:['body','item'],
    methods:{
      mapBody:function(){
        if(~this.body.indexOf('COP'))
          return 'CBD'
        return this.body.slice(0,this.body.indexOf('-'))
      }
    }
  }
</script>

<style module>
  .main {
    display: inline-block;
    min-width: 45px;
    padding: .3em .6em .3em .6em;
    font-size: .75em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
    line-height: 1em;
  }
  .CBD     { background-color: #009B48;}
  .NP      { background-color: #A05800;}
  .CP      { background-color: #0086B7;}
  .HLS     { background-color: #eeb422;}
  .SBSTTA  { background-color: #f77502;}
  .SBI     { background-color: #8b475d;}
  .W8J     { background-color: #793698;}
</style>
