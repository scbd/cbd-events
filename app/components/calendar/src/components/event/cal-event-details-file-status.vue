<style module>
  .badge {
    display: inline-block;
    min-width: 45px;
    padding: .3em .6em .3em .6em;
    font-size: .75em;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
    line-height: 1em;
    background-color: seagreen;
    cursor:pointer;
  }
  .workflow { background-color: gray;}
</style>

<template>
  <span>
    <a
      @click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"
      target="_blank"
    ><span
      :class="[$style.badge]"
      v-if="!fullFile.workflow"
    >public</span></a>
    <a
      @click.stop="goTo(`https://www.cbd.int/meetings/${genMeetingFromSymbol()}/documents/status`)"
      target="_blank"
    ><span
      :class="[$style.badge,$style.workflow]"
      v-if="fullFile.workflow"
    >{{ getWorkflow }}</span></a>
  </span>
</template>

<script setup>
import { ref, computed } from 'vue'
import { $fetch } from 'ofetch'

const props = defineProps(['file'])
const config = useRuntimeConfig()

const symbol   = ref(props.file.symbol)
const id       = ref(props.file._id)
const title    = ref(props.file.title ? props.file.title.en : '')
const fullFile = ref({})

function goTo(url) {
  if (typeof window !== 'undefined') window.open(url, '_blank')
}

const getWorkflow = computed(() => {
  if (!fullFile.value) return false
  if (fullFile.value.workflow && fullFile.value.workflow.steps) {
    const step = fullFile.value.workflow.steps.find((s) => s.status === 'active')
    return step?.status
  }

  return undefined
})

const download = computed(() => {
  if (!fullFile.value.files) return '#'
  const file = fullFile.value.files.find((f) =>
    (f.language === 'en' && f.type === 'application/msword') ||
    (f.language === 'en' && f.type === 'application/pdf')
  )
  return file?.url || '#'
})

function genMeetingFromSymbol() {
  if (!symbol.value) return false
  const symbolArr = symbol.value.split('/')
  return `${symbolArr[1]}-${symbolArr[2]}`
}

function genFilePath() {
  return `${config.public.api}/api/v2016/meetings/${genMeetingFromSymbol()}/documents/${id.value}`
}

// created logic
$fetch(genFilePath()).then((data) => { fullFile.value = data })
</script>
