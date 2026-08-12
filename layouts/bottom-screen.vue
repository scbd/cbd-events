<template>
  <transition name="bottom" v-if="isMounted" >
    <section class="bottom-screen-layout">
      <Icons />
      <main>
        <nuxt />
      </main>
    </section>
  </transition>
</template>

<script>

export default {
  name: 'BottomScreen',
  data (){
    return {
      isMounted: false
    }
  },
  mounted(){
    this.isMounted=true
  }
}
</script>

<style scoped>
.bottom-screen-layout {
  background-color: white;
  min-height: 100vh;
}
</style>
