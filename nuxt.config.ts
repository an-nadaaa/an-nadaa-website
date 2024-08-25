// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt", "@nuxt/icon", // "shadcn/nuxt",
  "@nuxtjs/i18n", "@nuxt/content"],
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
    ],
    defaultLocale: "en",
    defaultDirection: "ltr",
    lazy: true,
    strategy: "prefix_except_default",
  },
})