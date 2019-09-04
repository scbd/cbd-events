<template functional>
      <svg class="icon" :class="{'icon-text':props.inText}">
        <use :xlink:href="`#icon-${props.name}`" />
      </svg>
</template>