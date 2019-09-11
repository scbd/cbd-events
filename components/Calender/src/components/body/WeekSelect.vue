<template>


  <transition  name="slide-details">
    
    <div class="page container-fluid debug">
      
        <nav class="mainn navbar  navbar-default debug">
    <div class="col-3" @click="close" >
      <svg class="icon-clock-o" v-if="options && options.cancel" >
        <use xlink:href="#icon-close" />
      </svg>
    </div>
    <div class="col-6 mid"> {{ title }} </div>
    <div class="col-3 right-side" @click="done" > {{ $t('done') }} </div>
  </nav>
      <div class="row">
                  <!-- @click="changeMeeting(meeting)"
          v-for="(meeting,index) in visibleMeetings"
          :key="index" -->
        <div class="block gradient col-12" >
          <div>
            <h4>some date</h4>
          </div>
        </div>
      </div>
      </div>

  </transition>

</template>

<script>

// import EventsBus from '../../modules/Bus'

export default {
  name    : 'WeekSelect',
  props   : [ 'iteration' ],
  computed: { done, close },
  data,
  mounted
}

function data(){
  const title = this.$t('weekSelect')

  return { title }
}

function mounted(){
  console.log(this.iteration)
  this.$root.$on('bottom-screen-done', () => {})
}
function close(){
  this.$root.$emit('bottom-screen-cancel', { something: 'yes' })
}

function done(){
  this.$root.$emit('bottom-screen-done', { something: 'yes' })
}
// function showDetails (e){
//   e.stopPropagation()
//   e.data = { data: true }
//   events.EventsBus('weekSelect', e)
// }
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
            margin: 1em 0 1em 0;
            cursor: pointer;
            padding: 1em;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 1px 5px rgba(0,0,0,.075);
          }
</style>