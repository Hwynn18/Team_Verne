export const LOCALES = ["ko", "en"];
export const DEFAULT_LOCALE = "ko";
export const LOCALE_COOKIE = "locale";
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value) {
  return LOCALES.includes(value);
}
