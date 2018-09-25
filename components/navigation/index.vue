<template>
  <nav class="navbar navbar-default menu-gradient">
      <ul class="nav nav-pills nav-justified">
        <li><nuxt-link :to="$i18n.path({ name: 'conferenceCode-meetingCode-info',params: { conferenceCode: conferenceCode, meetingCode:meetingCode } })"><svg class="icon-clock-o"><use xlink:href="#icon-info-circle"></use></svg></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name: 'conferenceCode-meetingCode-agenda',params: { conferenceCode: conferenceCode, meetingCode:meetingCode }  })"><svg class="icon-clock-o"><use xlink:href="#icon-clock-o"></use></svg></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name:'conferenceCode-meetingCode-documents',params: { conferenceCode: conferenceCode, meetingCode:meetingCode } })"><svg class="icon-clock-o"><use xlink:href="#icon-docs"></use></svg></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name:'conferenceCode-meetingCode-calendar',params: { conferenceCode: conferenceCode, meetingCode:meetingCode } })"><svg class="icon-clock-o"><use xlink:href="#icon-calendar-o"></use></svg></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name:'conferenceCode-meetingCode-meetings',params: { conferenceCode: conferenceCode, meetingCode:meetingCode } })"><svg class="icon-clock-o"><use xlink:href="#icon-ellipsis-v"></use></svg></nuxt-link></li>
      </ul>
  </nav>
</template>

<script>
import '@scbd/ecosystem-style/patterns/navs/build.min.css'
import '@scbd/ecosystem-style/patterns/navbar/build.min.css'

export default {
  name:'Navigation',
  components:{},
  data ({$route,$store}) {
    $store.dispatch('conferences/get')
    return {
      conferenceCode:$route.params.conferenceCode,
      meetingCode:$route.params.meetingCode
    }

  },
}
</script>
<style scoped>
.nav-justified > li >a {
  color:#FFFFFF;
  margin:0;
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
</style>
