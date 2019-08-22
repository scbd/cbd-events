<template>
  <transition name="slide-up">
    <nav class="navbar navbar-default menu-gradient">
      <ul class="nav nav-pills nav-justified">
        <li><nuxt-link :to="$i18n.path({ name: 'conferenceCode',params: { conferenceCode: conferenceCode } })"><svg class="icon-clock-o"><use xlink:href="#icon-info-circle"></use></svg></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name: 'conferenceCode-meetingCode-agenda',params: { conferenceCode: conferenceCode, meetingCode:meetingCode }  })"><svg class="icon"><use xlink:href="#icon-clock-o"></use></svg></nuxt-link></li>
        <li v-if="filesExist || downloading">
          <div v-if="downloading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
          <nuxt-link v-if="!downloading" :to="$i18n.path({ name:'conferenceCode-meetingCode-downloads',params: { conferenceCode: conferenceCode, meetingCode:meetingCode } })"><svg class="icon"><use xlink:href="#icon-document-download"></use></svg></nuxt-link>
        </li>
        <li><nuxt-link :to="$i18n.path({ name:'conferenceCode-meetingCode-documents',params: { conferenceCode: conferenceCode, meetingCode:meetingCode }  })"><svg class="icon"><use xlink:href="#icon-docs"></use></svg></nuxt-link></li>      
        <li><nuxt-link :to="$i18n.path({ name:'conferenceCode-meetingCode-calendar',params: { conferenceCode: conferenceCode, meetingCode:meetingCode }, query: { selected: getCalStartDate() } })"><svg class="icon-clock-o"><use xlink:href="#icon-calendar-o"></use></svg></nuxt-link></li>
      </ul>
    </nav>
  </transition>
</template>

<script>
import {DateTime}   from 'luxon'

export default {
  name:'Navigation',
  data ({$route,$store}) {
    
    let meetingCode = $route.params.meetingCode
    let conferenceCode = $route.params.conferenceCode

    if(!meetingCode && $store.state.conferences.selectedMeeting)
      meetingCode = $store.state.conferences.selectedMeeting.code

    if(!conferenceCode && $store.state.conferences.selected)
      conferenceCode = $store.state.conferences.selected.code

    return {
      conferenceCode:conferenceCode,
      meetingCode:meetingCode,
      lastScrollTop: 0,
      show: true
    }
  },
  computed:{
    filesExist:filesExist,
    downloading:downloading,
    showNavs:showNavs
  },
  methods: {
    onScroll (e) {
      if((window.scrollY<0 || document.documentElement.scrollTop <0) || window.scrollY==0 && document.documentElement.scrollTop==0) {
        this.scrolled = false
        this.show = true
        e.preventDefault()
        e.stopPropagation() 
        if(this.$store)
          this.$store.commit('routes/SET_SHOW_NAVS',true)    
        return
      }
      this.scrolled = true
    },
    hasScrolled () {
      let doc = document.documentElement
      let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      let diff = Math.abs(top - this.lastScrollTop)

      if (top < this.lastScrollTop && diff > 25){
        this.show = true
        
        if(this.$store)
          this.$store.commit('routes/SET_SHOW_NAVS',true)
      }
      if (top > this.lastScrollTop && diff > 25){
        this.show = false
        if(this.$store)
          this.$store.commit('routes/SET_SHOW_NAVS',false)
      }
      if (diff > 25) this.lastScrollTop = top

    },

    getCalStartDate(){
      let start = DateTime.fromISO(this.$store.state.conferences.selected.startDate).startOf('day')
      let now = DateTime.local().startOf('day')
      if(now<start)
        return start.toISODate()
      return now.toUTC().toISODate()
    }
  },
  async beforeMount () {
    await this.$store.dispatch('files/LOAD')
    window.addEventListener('scroll', this.onScroll)
    setInterval(function () {
      if (this.scrolled) {
        this.hasScrolled()
        this.scrolled = false
      }
    }.bind(this), 250)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  }

}
function showNavs(){
  if(this.$store)
    return this.$store.state.routes.showNavs
  else
    return this.show
}
function downloading(){
  return this.$store.state.files.downloading
}

function filesExist(){
  return !!this.$store.state.files.data.length
}
</script>
<style scoped>
.nav-justified > li >a {
  color:#FFFFFF;
  margin:0;
}
.nuxt-link-exact-active{
    background-color: #009b48;
}
.nav>li>a:hover, .nav>li>a:focus{
  background-color: #009b48;
}
.nav-justified > li > a:hover, a:active, a:focus{
  background-color: #009b48;
}
.nav{
      background-color:rgba(0,0,0,0.40);
      color:#FFFFFF;
}

  .navbar{
    border-radius: 0px;
    position: fixed;
    bottom:-25px;
    width:100%;
   z-index:100000;
  }
  .font-m{
    font-size: .7em;
  }
.menu-gradient {
   background-color: rgba(0,0,0,0);
   background: #bdc3c7; /* For browsers that do not support gradients */
   background: -webkit-linear-gradient(left top, #bdc3c7, #2c3e50); /* For Safari 5.1 to 6.0 */
   background: -o-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Opera 11.1 to 12.0 */
   background: -moz-linear-gradient(bottom right, #bdc3c7, #2c3e50); /* For Firefox 3.6 to 15 */
   background: linear-gradient(to bottom right, #bdc3c7, #2c3e50); /* Standard syntax (must be last) */

   border: none;
}
.conf{
  line-height: .7em;
  vertical-align: middle;
}
  @media (min-width: 0px) {
    .nav-justified > li {
      display: table-cell;
      width: 1%;
      text-align: center;
      font-size: 1.5em;
    }
  }
  @media (max-width: 330px) {
    .font-m{
      font-size: .5em;
    }
    .conf{
      line-height: .5em;
    }
  }
  .lds-ring {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
  margin-bottom:-5px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 25px;
  height: 25px;
  margin: 3px;
  border: 3px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
