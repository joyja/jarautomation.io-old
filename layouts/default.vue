<template>
  <div class="app">
    <JarHeader />
    <main>
      <slot />
    </main>
    <JarFooter />
  </div>
</template>

<style lang="scss" scoped>
.app {
  position: relative;
  background-image: url('/waterOnGlass.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-color: var(--neutral-900);
  min-height: calc(100vh - 102px + var(--spacing-unit) * 4);
  padding-bottom: calc(60px + var(--spacing-unit) * 4);
}
</style>