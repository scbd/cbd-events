<template>
  <section>
    <Header :title="title" />
    <div class="page container-fluid">
      <div class="row">
        <div class="list-group">
          <li
            class="list-group-item"
            v-for="locale in locales"
            :key="locale.code"
            @click="changeLanguage(locale.code)"
          >
            {{ $t(locale.code) }}
          </li>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Header from '~/components/header/header-bottom-screen'

export default {
  name      : 'Languages',
  components: { Header },
  layout    : 'bottom-screen',
  methods   : { done, changeLanguage },
  asyncData,
  mounted
}

function mounted(){
  this.$root.$on('bottom-screen-done', done)
}

function asyncData ({ app }){
  return {
    locales: app.i18n.locales,
    title  : app.i18n.t('language')
  }
}

function done(){ this.$router.go(-1) }

function changeLanguage(localeCode){
  this.switchLocalePath(localeCode)
  this.$store.commit('i18n/I18N_SET_LOCALE', localeCode)
  this.$i18n.locale = localeCode
  this.$forceUpdate()
  const to = this.$store.state.routes.prevRoute
  const pathName = to.name.replace(`___${this.$store.state.i18n.prevLocale}`, `___${this.$store.state.i18n.locale}`)

  this.$router.replace({ name: pathName, params: to.params })
  this.$forceUpdate()
}
</script>
<style scoped>
  .page{ margin-top:50px; height:100vh; }
</style>
