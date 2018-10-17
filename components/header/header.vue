<template>
<section>
  <transition name="slide-fade">
    <nav v-if="showNavs" class="mainn navbar  navbar-default">

      <div class="container-fluid ">

        <span class="pull-left">
          <img  :src="'/images/cbd-leaf-green.svg'" class="header-nav-img" :alt="$t('scbdLeafLogo')"/>
        </span>

        <span class="pull-right">
          <SideMenu/>
        </span>
        <div class="title"><b>{{conference.title | lstring}}</b></div>
      </div>
      <div class="row sub" v-if="showMeetingNav">

        <div class="sub-con"  v-on:click="toggle()">
          <b v-if="meeting.title">
            {{meeting.title}} <span v-if="!~meeting.subTitle.indexOf('COPMOP')">{{meeting.subTitle}}</span>
          </b>
          <b v-else>
            {{meeting.subTitle}}
          </b>
          <svg class="icon-clock-o"  ><use xlink:href="#icon-select-arrows"></use></svg>
        </div>
      </div>
    </nav>

  </transition>
</section>
</template>

<script>
  import SideMenu from './SideMenu.vue'
  import '@scbd/ecosystem-style/patterns/navs/build.min.css'
  let showLinks = false

  export default {
    name:'Header',
    components:{SideMenu},
    data () {
      return {
        showLinks: showLinks,
        lastScrollTop: 0,
        show: true,
        attachments:process.env.ATTACHMENTS
      }
    },
    computed: {
      showMeetingNav:function(){
        return this.$store.state.routes.showMeetingNav
      },
      conference: function () {
        return this.$store.state.conferences.selected.conference.cbdMeet || {}
      },
      meeting: function () {
        return this.$store.state.conferences.selectedMeeting || {}
      },
      showNavs:showNavs
    },
    methods: {
      offlineNotice:offlineNotice,
      onlineNotice:onlineNotice,
      toggle(){
        let locale = this.$store.state.i18n.locale
        this.$router.push({name:`conferenceCode-meetingCode-meetings___${locale}`,params: this.$route.params })
      },
      onScroll (e) {
        if((window.scrollY<0 || document.documentElement.scrollTop <0) || window.scrollY==0 && document.documentElement.scrollTop==0) {
          this.scrolled = false
          this.show = true
          e.preventDefault()
          e.stopPropagation() 
          return
        }
        this.scrolled = true
      },
      hasScrolled () {
        let doc = document.documentElement
        let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
        let diff = Math.abs(top - this.lastScrollTop)

        if (top < this.lastScrollTop && diff > 25)
          this.show = true

        if (top > this.lastScrollTop && diff > 25)
          this.show = false

        if (diff > 25) this.lastScrollTop = top

      }
    },
    beforeMount () {
      if(process.server) return
      window.addEventListener('scroll', this.onScroll)
      setInterval(function () {
        if (this.scrolled) {
          this.hasScrolled()
          this.scrolled = false
        }
      }.bind(this), 250)
      window.addEventListener('online', this.onlineNotice )
      window.addEventListener('offline', this.offlineNotice )
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('online', this.onlineNotice )
      window.removeEventListener('offline', this.offlineNotice )
    }
  }
  
  function offlineNotice(){
    this.$swal({
        title: this.$i18n.t('internetConnectionLost'),
        text: this.$i18n.t('internetConnectionLostDescription'),
        icon: "warning",
      })
  }
  function onlineNotice(){
    this.$swal({
        title: this.$i18n.t('internetConnectionRestored'),
        icon: "success",
      })
  }
  function showNavs(){
    if(this.$store)
      return this.$store.state.routes.showNavs
    else
      return this.show
  }
</script>

<style scoped>
  .pull-right{
    float: right;
    margin:.2em 0 0 0;
  }
  .pull-left{
    float: left;
    margin-left: -5px;
  }
  .sub-con{
    background-color:rgba(0,0,0,0.40);
  }
  .sub{
       color:white;

       background-color: rgba(0,0,0,0);
       background: #bdc3c7; /* For browsers that do not support gradients */
       background: -webkit-linear-gradient(left top, #bdc3c7, #2c3e50); /* For Safari 5.1 to 6.0 */
       background: -o-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Opera 11.1 to 12.0 */
       background: -moz-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Firefox 3.6 to 15 */
       background: linear-gradient(to bottom right, #bdc3c7, #2c3e50); /* Standard syntax (must be last) */

       border: none;

  }
  .mainn{
    text-align: center;
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

  .brand{
    vertical-align: top;
    line-height: 1.4em;
  }

  .header-nav-img {
    max-height: 1.3em;
    position: relative;

  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  {
    transform: translatey(-35px);
    opacity: 0;
  }
  @media (max-width: 320px) {
    .title{
      font-size: .9em;
    }
  }
</style>
