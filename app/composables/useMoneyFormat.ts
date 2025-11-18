export function useMoneyFormat(locale?: Ref<string>) {
  const currentLocale = toValue(locale) ?? "en-US"

  function formatCurrency(
    amount: MaybeRef<number | null>,
    currency: string = "USD"
  ) {
    const value = toValue(amount) ?? 0
    return value.toLocaleString(currentLocale, {
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
