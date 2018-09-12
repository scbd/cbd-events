<template>
<section>
  <transition name="slide-fade">
    <nav v-if="show" class="mainn navbar  navbar-default">
      <div class="container-fluid ">
        <span href="http://www.cbd.int" class="hidden-md hidden-lg pull-left">
          <img src="https://attachments.cbd.int/cbd-leaf-green.svg" class="header-nav-img" />
          <span class="brand">CBD</span>
        </span>
        <!-- <div id="CBD-Branding" class="debug">
          <div class="navbar-header">
            <span class="hidden-xs hidden-sm ">
              <i class="eco-menu"></i>
              <img src="https://attachments.cbd.int/cbd-leaf-green.svg" class="header-nav-img" />
              <span class="brand">Convention on Biological Diversity</span>
            </span>

            <span href="http://www.cbd.int" class="hidden-md hidden-lg pull-left">
              <img src="https://attachments.cbd.int/cbd-leaf-green.svg" class="header-nav-img" />
              <span class="brand">CBD</span>
            </span>
          </div>

          <ul v-if="false" class="hidden-xs hidden-sm">
            <li><a translation-url href="http://www.cbd.int/convention/" class="color-cbdgrey">The Convention</a></li>
            <li><a translation-url href="http://bch.cbd.int/protocol" class="color-cbdgrey">Cartagena Protocol</a></li>
            <li><a translation-url href="http://www.cbd.int/abs/" class="color-cbdgrey">Nagoya Protocol</a></li>
            <li><a translation-url href="http://www.cbd.int/programmes/" class="color-cbdgrey">Programmes</a></li>
            <li><a translation-url href="http://www.cbd.int/information/" class="color-cbdgrey">Information</a></li>
            <li><a translation-url href="http://www.cbd.int/secretariat/" class="color-cbdgrey">Secretariat</a></li>
          </ul>
        </div> -->
        <locale/>
      </div>
    </nav>
  </transition>
</section>
</template>

<script>
  import locale from './locale.vue'
  import '@scbd/ecosystem-style/patterns/navs/build.min.css'
  let showLinks = false

  export default {
    name:'Header',
    components:{locale},
    data () {
      return {
        me: this.$store.state.me,
        showLinks: showLinks,
        lastScrollTop: 0,
        show: true
      }
    },
    computed: {
      locale: function () {
        if (this.$store.state.locale.locale !== 'en') { return '/' + this.$store.state.locale.locale }
        return ''
      },
      showLocale: function () {
        return this.$store.state.locale.showMobileFlag
      },
      showSCBD: function () {
        return this.$store.state.scbd.showMobileFlag
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
  .mainn{
    color:#bdbdbd;
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
    margin-top: .5em;
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
