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
  padding-right: calc(var(--spacing-unit) * 3);
  padding-left: calc(var(--spacing-unit) * 3);
}
.content > p {
  font-family: Basic;
  margin-bottom: calc(var(--spacing-unit) * 3);
} 
.content > h2,h3 {
  font-family: Oswald !important;
  text-transform: uppercase;
}
.content > ol {
  font-family: Basic;
  list-style-type: decimal;
  list-style-position: inside;
}
.content > ul {
  font-family: Basic;
  list-style-type: disc;
  list-style-position: inside;
}
.content > p > a {
  color: var(--red-600);
  text-decoration: underline;
}
.content > p > a:visited {
  color: var(--red-800);
}
</style>