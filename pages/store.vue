<script setup>
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '~/store/inventory'
const store = useInventoryStore()
const { computers } = storeToRefs(store)
</script>

<template>
  <div class="row">
    <div class="column">
      <h1 class="title">Store</h1>
      <div class="computers">
        <div class="computer" v-for="computer in computers">
          {{ computer.model }}
          <NuxtImg :src="computer.img"></NuxtImg>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.computers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  grid-gap: calc(var(--spacing-unit) * 3);
}
.computer {
  background-color: var(--neutral-100);
  border-radius: var(--spacing-unit);
}
.computer > img {
  width: 100%;
}
</style>