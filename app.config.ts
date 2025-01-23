export default defineAppConfig({
  siteName: "An-Nadaa – Educate Empower Improve",
  siteDescription:
    "An-Nadaa Educational Foundation is an Islamic non-profit organization actively involved in launching and managing educational, da’wah, and welfare projects across underprivileged communities in Nigeria.",
  contact: "contact@an-nadaa.com",
  siteLang: "en",
  colorModeFallback: "dark", // should replace COLOR_MODE_FALLBACK
  logo: {
    color: "/img/an-nadaa/annadaa-color.svg",
    white: "/img/an-nadaa/annadaa-white.svg",
    symbol_color: "/img/an-nadaa/annadaa-symbol_color.svg",
  },
  defaultCurrency: {
    symbol: "$",
    code: "USD",
    name: "US Dollar",
    decimalPlaces: 2,
  },
  currencies: {
    USD: {
      symbol: "$",
      code: "USD",
      name: "US Dollar",
      decimalPlaces: 2,
    },
    MYR: {
      symbol: "RM",
      code: "MYR",
      name: "Malaysian Ringgit",
      decimalPlaces: 2,
    },
  },
})
