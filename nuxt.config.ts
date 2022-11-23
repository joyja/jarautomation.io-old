// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@/assets/css/main.scss'
  ],
  content: {
    watch: {
      ws: {
        hostname: '10.251.214.196',
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
