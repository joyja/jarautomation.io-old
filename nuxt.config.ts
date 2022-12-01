// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  css: [
    '@/assets/css/main.scss'
  ],
  content: {
    highlight: {
      theme: 'nord'
    },
    watch: {
      ws: {
        hostname: '10.77.178.237',
        port: 4001
      }
    }
  },
  googleFonts: {
    families: {
      Lobster: true,
      Oswald: true,
      Basic: true
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxt/image-edge',
    '@nuxtjs/google-fonts',
  ],
})
