export type Locale = "en" | "ka";

export function pick<T>(locale: Locale, en: T, ka: T | null | undefined): T {
  return locale === "ka" && ka != null ? ka : en;
}
