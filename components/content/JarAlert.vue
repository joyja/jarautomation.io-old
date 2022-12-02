<script setup>
defineProps({
  color: {
    type: String,
    required: false,
    default: 'var(--red-600)'
  }
})
</script>

<template>
  <div class="alert" :style="{ 'font-family': 'Basic', 'background-color': color }">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.alert {
  border-radius: var(--spacing-unit);
  padding: var(--spacing-unit);
  margin-bottom: calc(var(--spacing-unit) * 3);
}
</style>
