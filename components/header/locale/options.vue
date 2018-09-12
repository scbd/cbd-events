<template>
    <transition name="slide-fade">
    <div class="navbar-item has-dropdown is-hoverable">
      <div class="navbar-dropdown  is-boxed" :class="{'is-right':!$i18n.isRtl($i18n.locale)}">
        <span class="navbar-item cbd-size">
             <strong>{{ $t('component.Locale.languages') }}</strong>
        </span>
        <hr class="dropdown-divider" style="margin:10px 0 0 0;">
        <a class="navbar-item rtl disabled"  :class="{'is-active':isLocale('ar')}" >لعربية <i class="fontello icon-ok is-pulled-left" v-if="isLocale('ar')"></i></a>
        <a class="navbar-item disabled" :class="{'is-active':isLocale('zh')}" >中文 <i class="fontello icon-ok is-pulled-right" v-if="isLocale('zh')"></i></a>
        <a class="navbar-item" v-on:click="setLocale('en')" :class="{'is-active':isLocale('en')}" >English <i class="fontello icon-ok is-pulled-right" v-if="isLocale('en')"></i></a>
        <a class="navbar-item disabled"  :class="{'is-active':isLocale('es')}">Español <i class="fontello icon-ok is-pulled-right" v-if="isLocale('es')"></i></a>
        <a class="navbar-item disabled"  :class="{'is-active':isLocale('fr')}">Français <i class="fontello icon-ok is-pulled-right" v-if="isLocale('fr')"></i></a>
        <a class="navbar-item disabled"  :class="{'is-active':isLocale('ru')}">Русский <i class="fontello icon-ok is-pulled-right" v-if="isLocale('ru')"></i></a>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LocaleOptions',
  // define methods under the `methods` object
  computed: {
    locale: function () {
      return this.$store.state.locale.locale
    }
  },
  methods: {
    setLocale: function (locale) {
      this.$store.dispatch('locale/setLocale', locale)
      let path
      if (this.$route.params.lang) {
        let pathArr = this.$route.path.split('/')
        pathArr.splice(1, 1)
        path = '/' + locale + pathArr.join('/')
      } else path = '/' + locale + this.$route.path

      this.$router.push(path)
      this.$store.commit('locale/setMobileShow', false)
    },
    isLocale: function (locale) {
      if(locale === this.locale) return true
      return false
    },
    showMobile: function () {
      let showMobileFlag = !this.$store.state.locale.showMobileFlag
      this.$store.commit('locale/setMobileShow', showMobileFlag)
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 1024px){

  .is-active {
      background-color: #f5f5f5 !important;
      color: #0a0a0a !important;
  }
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translatey(-5px);
  opacity: 0;
}
.disabled{
  cursor: not-allowed;
  text-decoration: line-through;
  color:#cccccc;
}
</style>
