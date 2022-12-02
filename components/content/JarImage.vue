<script setup>
const props = defineProps({
    src: {
      required: true,
      type: String,
    },
    lazySrc: {
      required: false,
      type: [String, null],
      default: null,
    },
    alt: {
      required: false,
      type: String,
      default: null
    },
    flat: {
      required: false,
      type: Boolean,
      default: false,
    },
    transparent: {
      required: false,
      type: Boolean,
      default: false,
    },
    color: {
      required: false,
      type: String,
      default: 'transparent',
    },
    addClasses: {
      required: false,
      type: String,
      default: '',
    },
    aspectRatio: {
      required: false,
      type: [Number, String, null],
      default: null,
    },
    elevation: {
      required: false,
      type: [Number, String, null],
      default: 0,
    },
    basis: {
      required: false,
      type: [Number, String, null],
      default: '100%',
    },
    justify: {
      required: false,
      type: String,
      default: 'center',
    },
  })
</script>

<template>
  <div :style="{ 'background-color': color }" class="content--img--wrapper">
    <NuxtImg class="content--img" :style="{'flex-basis': basis, 'max-width': '100%' }" :src="src" :placeholder="lazySrc"/>
  </div>
</template>

<style>
.content--img--wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: calc(var(--spacing-unit) * 3)
}
.content--img {
  flex-shrink: 1;
  flex-grow: 0;
}
</style>