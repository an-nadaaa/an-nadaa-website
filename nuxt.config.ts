import { vite as vidstack } from "vidstack/plugins"
import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  css: ["./app/assets/css/tailwind.css"],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui", // Change to new directory
  },
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    routeRules: {
      "/botswana": { redirect: "/causes/arxc351ma9727fevmv4qgomy" },
      "/build-a-mosque": { redirect: "/causes/arl51t0ph1mhp9j0zu746dqy" },
      "/build-a-well": {
        redirect: "/causes/ipusjulg6wj0l8eia6sivph9",
      },
      "/help-widows": {
        redirect: "/causes/ghdapx0kf7cz9se7rhb7w60p",
      },
      "/help-orphans": {
        redirect: "/causes/ghdapx0kf7cz9se7rhb7w60p",
      },
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      lang: "en-US",
      STRIPE_PK:
        process.env.NODE_ENV === "production"
          ? process.env.STRIPE_PK_PROD
          : process.env.STRIPE_PK_DEV,
      STRAPI_API:
        process.env.NODE_ENV === "production"
          ? process.env.STRAPI_API_PROD
          : process.env.STRAPI_API_DEV,
      STRAPI_API_KEY:
        process.env.NODE_ENV === "production"
          ? process.env.STRAPI_API_KEY_PROD
          : process.env.STRAPI_API_KEY_DEV,
      strapi: {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.STRAPI_API_PROD
            : process.env.STRAPI_API_DEV,
        prefix: "",
        admin: "/admin",
        version: "v5",
        cookie: {
          path: "/",
          // maxAge: 20, This is set in the /config/plugins.ts in the backend
          secure: process.env.NODE_ENV === "production",
          sameSite: false,
        },
        cookieName: "strapi_jwt",
      },
    },
    STRIPE_SK:
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_SK_PROD
        : process.env.STRIPE_SK_DEV,
    STRAPI_API_KEY_BACKEND:
      process.env.NODE_ENV === "production"
        ? process.env.STRAPI_API_KEY_BACKEND_PROD
        : process.env.STRAPI_API_KEY_BACKEND_DEV,
  },

  modules: [
    "@vueuse/nuxt",
    "shadcn-nuxt", // "shadcn/nuxt",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/strapi",
    "nuxt-auth-utils",
  ],
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  content: {
    markdown: {
      anchorLinks: false,
    },
  },
  strapi: {
    url:
      process.env.NODE_ENV === "production"
        ? process.env.STRAPI_API_PROD
        : process.env.STRAPI_API_DEV,
    token:
      process.env.NODE_ENV === "production"
        ? process.env.STRAPI_API_KEY_PROD
        : process.env.STRAPI_API_KEY_DEV,
    prefix: "",
    admin: "/admin",
    version: "v5",
    cookie: {
      path: "/",
      maxAge: 20,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    },
    cookieName: "strapi_jwt",
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      // { code: "ar", name: "العربية", file: "ar.json" },
      // { code: "ms", name: "Bahasa Malayu", file: "ms.json" },
      // { code: "sw", name: "Swahili", file: "sw.json" },
    ],
    defaultDirection: "ltr",
    // lazy: true,
    strategy: "prefix_except_default",
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("media-"),
    },
  },
  vite: {
    plugins: [vidstack(), tailwindcss()],
  },
})
