import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOffLineStore = defineStore('offLine', () => {
  const isOffLine = ref(false)
  const isOnLine  = computed(() => !isOffLine.value)

  function set(onLine) {
    isOffLine.value = !onLine
  }

  function toggle() {
    isOffLine.value = !isOffLine.value
  }

  return { isOffLine, isOnLine, set, toggle }
})
