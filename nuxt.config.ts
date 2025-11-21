// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: "2025-11-21",

  typescript: {
    strict: true,
    typeCheck: true,
  },

  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
  ],

  css: ["~/assets/styles/main.scss"],

  devtools: {
    enabled: true,
  },
});
