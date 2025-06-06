// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    css: ["~/assets/css/main.css"],
    app: {
        head: {
            script: [
                {
                    src: "https://telegram.org/js/telegram-web-app.js",
                    async: true,
                },
            ],
        },
    },
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: { apiUrl: "https://orchidshop.shop/api" },
    },
    ssr: false,
});
