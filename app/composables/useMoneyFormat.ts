export function useMoneyFormat(locale?: Ref<string>) {
  const currentLocale = toValue(locale) ?? "en-US"

  function formatCurrency(amount: MaybeRef<number>, currency: string = "USD") {
    return amount.toLocaleString(currentLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency,
    })
  }

  return {
    formatCurrency,
  }
}
