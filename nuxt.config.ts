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
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      functionBaseUrl:
        process.env.NODE_ENV === "production"
          ? `${process.env.BASE_URL_PROD}/.netlify/functions`
          : `${process.env.BASE_URL_DEV}/.netlify/functions`,
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
