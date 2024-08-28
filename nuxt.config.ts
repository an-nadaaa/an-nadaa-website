// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
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
})
