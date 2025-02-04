import { vite as vidstack } from "vidstack/plugins"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
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
    },
    STRIPE_SK:
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_SK_PROD
        : process.env.STRIPE_SK_DEV,
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "shadcn-nuxt",
    "@pinia/nuxt", // "shadcn/nuxt",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/strapi",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  content: {
    markdown: {
      anchorLinks: false,
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || "http://localhost:1337",
    prefix: "/api",
    admin: "/admin",
    version: "v5",
    cookie: {
      path: "/",
      maxAge: 14 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    },
    cookieName: "strapi_jwt",
  },
  i18n: {
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "translations/en.js",
        dir: "ltr",
        name: "English",
      },
      {
        code: "ar",
        language: "ar-SA",
        file: "translations/ar.js",
        dir: "rtl",
        name: "العربية",
      },
      {
        code: "ms",
        language: "ms-MY",
        file: "translations/ms.js",
        dir: "ltr",
        name: "Bahasa Malayu",
      },
      // we use the NG postfix because sw is ignored in git ignore for being a convention for service workers
    ],
    defaultLocale: "en",
    defaultDirection: "ltr",
    lazy: true,
    strategy: "prefix_except_default",
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("media-"),
    },
  },
  vite: {
    plugins: [vidstack()],
  },
})
