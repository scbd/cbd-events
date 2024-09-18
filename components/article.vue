<template>
    <div v-if="title" >
        <div class="col-12">
          <img class="hero" v-if="blob" :src="blob" :alt="`${title | this.$filters.lstring} logo`" style="width:100%;">
        </div>
        <div class="col-12">
          <span v-html="this.$options.filters.lstring(content)" />
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ArticleHome',
    props: ['title', 'content', 'blob']
  }
  function data(){
    return { show: false }
  }
  </script>
  <style>
  h1{
    font-size: 1.5rem;
    margin: 1rem 0 1rem 0;
  }
  h2{
    font-size: 1.2rem;
    margin: .5rem 0 .5rem 0;
  }
  </style>
  <style scoped>
    .home{ padding-bottom: 3em; }
  </style>
  