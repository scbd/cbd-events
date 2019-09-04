<template>
  <transition name="bottom" v-if="isMounted" >
    <section>
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
      isMounted: true
    }
  }
}
</script>
