<template>
  <div class="row">
    <div class="column">
      <ContentDoc v-slot="{ doc }">
        <h1 class="title">{{ doc.title }}</h1>
        <ContentRenderer class="content" :value="doc" />
      </ContentDoc>
    </div>
  </div>
</template>

<style lang="scss">
.content {
  color: var(--gray-200);
}
.content > p {
  font-family: Basic;
} 
.content > h2,h3 {
  font-family: Oswald !important;
  text-transform: uppercase;
}
</style>