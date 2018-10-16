<template>
  <section>
      <svg class="icon-clock-o" :class="{'active':isOpen}"  v-on:click="toggle()"><use xlink:href="#icon-cog"></use></svg>
      <transition name="test" >
        <div class="side-menu" v-if="isOpen" v-on:click="toggle()">
          <div class="row">
            <div class="col-xs-12">
              <br>

              <h4>{{$t('settings')}}</h4>
              <!-- <div class="list-group">
                <nuxt-link :to="$i18n.path({name:'conferenceCode-languages', params: { conferenceCode: conferenceCode } })"><button type="button" class="list-group-item"><svg class="icon-language"><use xlink:href="#icon-language"></use></svg> {{language}}</button></nuxt-link>
              </div> -->
              <div class="list-group">
                <nuxt-link :to="$i18n.path({name:'conferenceCode-conferences', params: { conferenceCode: conferenceCode } })"><button type="button" class="list-group-item"><svg class="icon"><use xlink:href="#icon-transfer"></use></svg> {{switchConference}}</button></nuxt-link>
              </div>
              <div class="list-group" v-on:click="deleteAll()">
                <button type="button" class="list-group-item"><svg class="icon"><use xlink:href="#icon-trash-o"></use></svg> {{deleteAllDownloads}}</button>
              </div>
              
              <h4>{{$t('contactUs')}}</h4>
              <div class="list-group">
                <a href="tel:1-514-288-2220"> 
                  <button type="button" href="tel:1-514-288-2220" class="list-group-item"><svg class="icon"><use xlink:href="#icon-phone"></use></svg>{{$t('callThe')}} {{$t('scbd')}} <span class="email">1.514.288.2220</span></button>
                </a>
              </div>
              <div class="list-group">
                <a href="mailto:secretariat@cbd.int">
                  <button type="button"  class="list-group-item"><svg class="icon"><use xlink:href="#icon-envelope"></use></svg> 
                  {{$t('emailThe')}} {{$t('scbd')}}
                  <span class="email">secretariat@cbd.int</span>
                  </button>
                </a>
              </div>            
            </div>
          </div>
        </div>
      </transition>
  </section>
</template>

<script>
  import '@scbd/ecosystem-style/patterns/list-groups/build.min.css'
  export default {
    name:"mainMenu",
    data ({$route}) {
      return {
        isOpen:false,
        conferenceCode:$route.params.conferenceCode,
        deleteing:false
      }
    },
    computed: {
      conference: function () {
        return this.$store.state.conferences.selected || {}
      },
      language: function () {
        return this.$i18n.t('language')
      },
      deleteAllDownloads: function () {
        return this.$i18n.t('deleteAllDownloads')
      },
      switchConference: function () {
        return this.$i18n.t('switchConference')
      },
    },
    methods:{
      toggle:toggle,
      deleteAll:deleteAll
    }
  }
  async function deleteAll(){
    this.$store.commit('files/DOWNLOADING')
    await this.$store.dispatch('files/DELETE',this.$store.state.files.data)
    this.$store.commit('files/DOWNLOADING')
  }
  function toggle(){
    this.isOpen = !this.isOpen
  }
</script>
<style scoped>
.email{
  color:#337ab7;
  float:right;
}
.logo{
  max-height: 1.3em;
}
h1{
  margin: 1em 1em 1em 1em;
}
.list-group-item{
    font-size: 1em;
}
  .side-menu{
    position:absolute;
    top:30px;
    left:1px;
    height:100vh;
    width:100%;
    background-color: #eee;
  }
  .test-enter-active {
    transition: all .2s ease;
  }
  .test-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .test-enter
  {
    transform: translatex(100vw);
    opacity: 0;
  }
  .test-leave-to
  {
    transform: translatex(100vw);
    opacity: 0;
  }
  .active{
    color:#337ab7;
  }
</style>
