// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    css: ["~/assets/css/main.css"],
    image: {
        dir: "public",
    },
    app: {
        pageTransition: { name: "page", mode: "in-out" },
        head: {
            link: [
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
                },
            ],
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1.0, user-scalable=no",
                },
            ],
            script: [
                {
                    src: "https://telegram.org/js/telegram-web-app.js",
                    async: true,
                },
            ],
        },
    },
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/image"],
    vite: {
        plugins: [tailwindcss()],
    },
    runtimeConfig: {
        public: { apiUrl: "https://orchidshop.shop/api" },
    },
    nitro: {
        prerender: {
            ignore: ["/admin/**"],
        },
    },
    ssr: false,
});
