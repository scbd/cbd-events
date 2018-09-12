<template>
  <nav class="navbar navbar-default menu-gradient">
    <div class="container-fluid ">
      <ul class="nav nav-pills nav-justified">
        <li><nuxt-link :to="$i18n.path({ name: 'info'})"><i class="eco-info-circled"></i></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({ name: 'agenda' })"><i class="eco-clock"></i></nuxt-link></li>
        <li style="line-height: .7em; vertical-align: middle;"><span class="font-m">UN Biodiversity</span></li>
        <li><nuxt-link :to="$i18n.path({name:'documents'})"><i class="eco-docs"></i></nuxt-link></li>
        <li><nuxt-link :to="$i18n.path({name:'calendar'})"><i class="eco-calendar-empty"></i></nuxt-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import '@scbd/ecosystem-style/patterns/navs/build.min.css'
import '@scbd/ecosystem-style/patterns/navbar/build.min.css'

export default {
  name:'Navigation',
  components:{},
  data ({route}) {

    return {
      conference:2018
    }

  },
}
</script>
<style scoped>
.nav-justified > li >a {
  color:#FFFFFF;
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
}
  @media (min-width: 0px) {
    .nav-justified > li {
      display: table-cell;
      width: 1%;
      text-align: center;
      font-size: 1.5em;
    }
  }
</style>
