// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  css: [
    "~/assets/css/main.css",
  ],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
        },
      ],
    },
  },
  
  devtools: { enabled: true },
  modules:['@nuxt/ui', "@nuxtjs/device"],
  vite:{
    plugins: [
      tailwindcss(),
    ]
  }
})