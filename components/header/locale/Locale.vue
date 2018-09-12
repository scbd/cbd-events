<template>
  <section>
    <div class="navbar-item has-dropdown is-hoverable" >
      <a class="navbar-link is-paddingless" v-on:click="showMobile()" v-if="!mobileOptionsOnly">
        <span v-show="(!showMobileFlag && $breakpoints.isTouch) || !$breakpoints.isTouch">
          <!-- <i class="fontello icon-language is-size-5" ></i> -->
          <span class="badge is-uppercase">{{locale}} <span class="caret"></span></span>
        </span>
        <span class="is-hidden-desktop is-pulled-right" v-show="showMobileFlag"><i class="fontello icon-cancel is-size-5" ></i></span>
      </a>
      <options class="is-hidden-desktop" v-show="showMobileFlag && mobileOptionsOnly" />
      <options class="is-hidden-touch" />
    </div>
 </section>
</template>

<script>
import options from '~/components/scbd/GlobalBar/locale/options.vue'
export default {
  name: 'Locale',
  components: {options},
  props: {
      mobileOptionsOnly: {
        type: Boolean,
        default: false
      }
  },
  computed: {
    locale: function () {
      return this.$store.state.locale.locale
    },
    showMobileFlag: function () {
      return this.$store.state.locale.showMobileFlag
    }
  },
  // define methods under the `methods` object
  methods: {
    showMobile: function () {
      let showMobileFlag = !this.$store.state.locale.showMobileFlag
      this.$store.commit('locale/setMobileShow', showMobileFlag)
    }
  }

}

</script>
<style scoped>

.navbar-link:after{
  border: 0px;
}
.caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid\9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
}
.navbar-item{
  padding:3px 5px 0 0
}
@media (min-width:1024px){
  .navbar-item{
    padding:3px 15px 0 0
  }
}
</style>
