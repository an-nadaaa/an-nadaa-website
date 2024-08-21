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
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/i18n",
    // "shadcn/nuxt",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        file: "translations/en.js",
        dir: "ltr",
        name: "English",
      },
      {
        code: "ar",
        iso: "ar-SA",
        file: "translations/ar.js",
        dir: "rtl",
        name: "العربية",
      },
      {
        code: "ms",
        iso: "ms-MY",
        file: "translations/ms.js",
        dir: "ltr",
        name: "Bahasa Malayu",
      },
      // we use the NG postfix because sw is ignored in git ignore for being a convention for service workers
      {
        code: "sw",
        iso: "sw",
        file: "translations/sw-NG.js",
        dir: "ltr",
        name: "Swahili",
      },
    ],
    defaultLocale: "en",
    defaultDirection: "ltr",
    lazy: true,
    strategy: "prefix_except_default",
  },
})
