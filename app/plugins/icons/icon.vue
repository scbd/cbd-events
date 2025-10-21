<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true
    },
    inText: {
      type: Boolean,
      default: false
    },
    x: {
      type: [String, Number],
      default: null
    }
  }
}
</script>

<template>
  <svg class="icon" :class="{'icon-text': inText, [`x${x}`]: x, pdf: name.includes('file-pdf-o'), word: name.includes('file-word-o')}">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>