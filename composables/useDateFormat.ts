export function useDateFormatter(locale?: Ref<string>) {
  const currentLocale = toValue(locale) ?? "en-US";

  function formateDayMonthYear(date: MaybeRef<string | Date>, format?: string) {
    return useDateFormat(toValue(date), format || "MMM D, YYYY", {
      locales: currentLocale,
    });
  }

  function formatMonthYear(date: MaybeRef<string | Date>, format?: string) {
    return useDateFormat(toValue(date), format || "MMM YYYY", {
      locales: currentLocale,
    });
  }

  return {
    formateDayMonthYear,
    formatMonthYear,
  };
}
