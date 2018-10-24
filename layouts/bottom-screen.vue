<template>
  <transition name="bottom" v-if="isMounted">
    <section>
      <Icons/>
      <main >
        <nuxt/>
      </main>
    </section>
  </transition>
</template>

<script>
  import Icons      from '~/components/icons'
  export default {
    name:'bottom-screen',
    components:{Icons},
    data () {
      return {
        isMounted:true
      }
    }
  }
</script>
