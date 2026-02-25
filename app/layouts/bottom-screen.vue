<template>
  <transition name="bottom" v-if="isMounted">
    <section>
      <Icons />
      <main>
        <slot />
      </main>
    </section>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMounted = ref(false)

onMounted(() => { isMounted.value = true })
</script>
