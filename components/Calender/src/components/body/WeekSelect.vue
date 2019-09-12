<template>
  <transition  name="slide-details">
    <div class="page container-fluid" v-if="hide">
      <div class="row">

        <Header :title="title" />

        <div v-on:click="changeDate(5)" class="block gradient col-12" >
          <div>
            <h4>{{iteration.prev.prev.title}}</h4>
            <small><span>{{ iteration.prev.prev.subTitle }}</span></small>
          </div>
        </div>

        <div v-on:click="changeDate(4)" class="block gradient col-12" >
          <div>
            <h4>{{iteration.prev.title}}</h4>
            <small><span>{{ iteration.prev.subTitle }}</span></small>
          </div>
        </div>

        <div v-on:click="changeDate(8)" class="block gradient col-12" >
          <div>
            <h4>{{iteration.next.title}}</h4>
            <small><span>{{ iteration.next.subTitle }}</span></small>
          </div>
        </div>

        <div v-on:click="changeDate(9)" class="block gradient col-12" >
          <div>
            <h4>{{iteration.next.next.title}}</h4>
            <small><span>{{ iteration.next.next.subTitle }}</span></small>
          </div>
        </div>

      </div>
    </div>
  </transition>

</template>

<script>
import Header    from '~/components/header/header-bottom-screen'

export default {
  name      : 'WeekSelect',
  props     : [ 'iteration' ],
  components: { Header },
  methods   : { changeDate },
  data,
  mounted
}

function data(){
  const title = this.$t('weekSelect')
  const hide  = false

  return { title, hide }
}

function changeDate(index){
  this.$root.$emit('changeDate', 7 - Number(index))
  this.hide = !this.hide
}

function mounted(){ this.$root.$on('bottom-screen-done', () =>  this.hide = !this.hide) }

</script>

<style scoped>
  .slide-details-leave-active, .slide-details-enter-active  { transition: all .4s ease; }
  .slide-details-enter { transform: translateY(100%); opacity: 0; }
  .slide-details-leave-to { transform: translateY(200%); opacity: 0; }
  .page{ position:absolute; top:0;z-index:100000;  height:100vh; background-color: #eee;}
  .block > img { align-self: center; width: 100%; }
  .block > div { vertical-align: top; }
  .block h5 { font-weight: 500; }
  /* For browsers that do not support gradients */
  .gradient {
              background-color:rgba(0,0,0,0.40);
              background: rgba(0,0,0,0.40);
              background: -webkit-linear-gradient(left top, rgba(0,0,0,0.40), #2c3e50);
              /* For Safari 5.1 to 6.0 */
              background: -o-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Opera 11.1 to 12.0 */
              background: -moz-linear-gradient(bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* For Firefox 3.6 to 15 */
              background: linear-gradient(to bottom right, rgba(0,0,0,0.40), #2c3e50);
              /* Standard syntax (must be last) */
            }
  .block {
            background-color: rgba(0,0,0,0.40);
            text-align: center;
            color:white;
            margin: 3em 0 1em 0;
            cursor: pointer;
            padding: 1em;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
          }
</style>