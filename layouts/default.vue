<template>
  <div class="app">
    <JarHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app {
  background-image: url('/waterOnGlass.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-color: var(--neutral-900);
  min-height: 100vh;
}
</style>