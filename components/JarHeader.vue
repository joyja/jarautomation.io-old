<template>
  <nav class="header">
    <NuxtLink to="/">
      <Jar3dLogo class="logo"/>
      <p class="logo__text">Automation</p>
    </NuxtLink>
  </nav>
</template>

<style lang="scss">
@import '~/assets/css/breakpoints.scss';

.logo {
  transition: height .3s ease-out;
  height: 60px;
  @include bpmd {
    height:100px;
  }
}
.logo__text {
  transition: font-size .3s ease-out;
  font-size: 1rem;
  font-family: Lobster;
  color: var(--neutral-300);
  transform: rotate(-3deg) translateY(-0.25rem) translateX(0.5rem);
  transform-origin: left;
  @include bpmd {
    font-size: 2rem;
  }
}
.header {
  padding: calc(var(--spacing-unit)*3);
  height: 60px;
}
</style>