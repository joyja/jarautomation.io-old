<template>
  <div class="row">
    <div class="column">
      <h1 class="title">Blog</h1>
      <ContentNavigation v-slot="{ navigation }">
        <div class="cards">
          <NuxtLink :to="link._path" class="card" v-for="link of navigation.find((link) => link.title === 'Blog').children.find((link) => link.title === 'Posts').children" :key="link._path">
            {{ link }}
            <!-- <nuxt-img class="rounded" :src="link.image"/> -->
          </NuxtLink>
        </div>
      </ContentNavigation>
      <ContentList path="blog/posts" v-slot="{ list }">
        <div v-for="article in list" :key="article._path">
          {{ article.image }}
        </div>
      </ContentList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/boxShadow.scss';
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 20px;
}
.card {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  border: solid 1px var(--ocean-300);
  border-radius: var(--spacing-unit);
  aspect-ratio: 1;
  @extend .shadow-md;
  transition: all .3s ease-out;
  cursor: pointer;
}
</style>