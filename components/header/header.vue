<template>
<section>
  <transition name="slide-fade">
    <nav v-if="show" class="mainn navbar  navbar-default">

      <div class="container-fluid ">

        <span class="pull-left">
          <img src="https://attachments.cbd.int/cbd-leaf-green.svg" class="header-nav-img" />
          <!-- <span class="brand">CBD</span> -->
        </span>

        <span class="pull-right">
          <SideMenu/>
        </span>
        <div ><b>{{conference.title | lstring}}</b></div>
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
        show: true
      }
    },
    computed: {
      conference: function () {
        return this.$store.state.conferences.selected || {}
      }
    },
    methods: {
      onScroll () {
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
    mounted(){
        console.log('this.$store.state.conferences.selected',this.$store.state.conferences.selected)
    },
    beforeMount () {
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
</style>
