<template>
  <div >
    <Icons/>
    <Header/>
    <main class="main-view">
      <nuxt/>
    </main>
    <Nav/>
  </div>
</template>

<script>
  import Icons             from '~/components/icons'
  import Header             from '~/components/header/header'
  import Nav                from '~/components/navigation/index'
  export default {
    name:'default',
    components:{Header,Nav,Icons}
  }
</script>
