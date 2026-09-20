const INTL_LOCALES = { ko: "ko-KR", en: "en-US" };

export function formatDate(value, locale) {
  const intlLocale = INTL_LOCALES[locale];
  if (!intlLocale) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(intlLocale, { dateStyle: "medium", timeZone: "Asia/Seoul" }).format(date);
}
