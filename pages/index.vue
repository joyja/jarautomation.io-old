<template>
  <div class="row">
    <div class="column">
      <h1 class="title">A different kind of industrial automation consultant</h1>
      <p class="leading">We specialize in using modern technology to eliminate vendor lock-in, improve reliability, lower cost, and do generally amazing things with industrial control systems. We provide long term support for our clients, giving them peace of mind.</p>
      <div class="ignition-certified">
        <nuxtImg
          src="https://res.cloudinary.com/jarautomation/image/upload/g_auto,f_auto/v1605644772/badge_gold.png"
          placeholder="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,g_auto,f_auto/v1605644772/badge_gold.png"
          loading="lazy"
        />
      </div>
      <div class="buttons space-x-2">
        <NuxtLink to="/store" class="button--accent button--text-with-symbol">Go to Store
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16px" width="16px">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </NuxtLink>
        <NuxtLink to="/blog" class="button--primary button--text-with-symbol">Go to Blog
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16px" width="16px">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </NuxtLink>
      </div>
      <div class="process">
        <nuxtImg src="/process.png" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/text';
@import '~/assets/css/breakpoints';

.ignition-certified {
  position: absolute;
  right: calc(var(--spacing-unit) * 3);
  top: calc(var(--spacing-unit) * 3);
  transform: rotate(5deg);
}
.ignition-certified:after {
  position: absolute;
  border-radius: 0.75rem;
  content:"";
  height:100%;
  width:100%;
  top: 0px;
  left: 0px;
  background: linear-gradient(200deg, rgba(255,0,0,0) 40%,rgba(var(--orange-900--rgb), 0.5) 100%);
}
.ignition-certified > img {
  width: 70px;
  @include bpmd {
    width: 100px;
  }
}
.leading {
  font-family: Basic;
  color: var(--neutral-400);
  font-size: var(--text-md);
  line-height: var(--text-md-lh);
  text-align: center;
  @include bpmd {
    margin-top: calc(var(--spacing-unit) * 6);
    font-size: var(--text-xl);
    line-height: 2rem;
  }
}
.button--text-with-symbol {
  display:flex;
  align-items: center;
}
.buttons {
  display:flex;
  justify-content: center;
}
.process {
  display:flex;
}
.process > img {
  width: 100%;
  flex-basis: 100px;
  flex-grow: 0;
  flex-shrink: 1;
}
</style>
