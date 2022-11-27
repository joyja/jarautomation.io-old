<template>
  <nav class="header">
    <div>
      <Jar3dLogo />
      <p class="logo__text">Automation</p>
    </div>
  </nav>
</template>

<style lang="scss">
.logo__text {
  font-size: 2rem;
  font-family: Lobster;
  color: var(--neutral-300);
  transform: rotate(-3deg) translateY(-0.25rem) translateX(0.5rem);
  transform-origin: left;
}
.header {
  padding: calc(var(--spacing-unit)*3)
}
</style>