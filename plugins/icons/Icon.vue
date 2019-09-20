<template functional>
      <svg class="icon" :class="{'icon-text':props.inText, [`x${props.x}`]:props.x, pdf:props.name.includes('file-pdf-o') , word:props.name.includes('file-word-o') }">
        <use :xlink:href="`#icon-${props.name}`" />
      </svg>
</template>