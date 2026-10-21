import type { Locale } from "./types";

export type Currency = "USD" | "INR";

/** Rupees use Indian digit grouping (₹1,20,000) in every language. */
const tag = (locale: Locale, currency: Currency) =>
  currency === "INR" ? (locale === "hi" ? "hi-IN" : "en-IN") : locale === "es" ? "es-US" : "en-US";

export function money(n: number, locale: Locale, currency: Currency): string {
  const cents = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat(tag(locale, currency), {
    style: "currency",
    currency,
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
    numberingSystem: "latn",
  }).format(n);
}

/** "₹5,000", "₹5,000–₹6,000", or "up to ₹15,000" when the low end is 0. */
export function moneyRange(low: number, high: number, locale: Locale, currency: Currency, upTo: string): string {
  if (low === 0) return locale === "hi" ? `${money(high, locale, currency)} ${upTo}` : `${upTo} ${money(high, locale, currency)}`;
  return low === high ? money(low, locale, currency) : `${money(low, locale, currency)}–${money(high, locale, currency)}`;
}

export function longDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const tags: Record<Locale, string> = { en: "en-US", es: "es-US", hi: "hi-IN" };
  return new Intl.DateTimeFormat(tags[locale], { year: "numeric", month: "long", day: "numeric", numberingSystem: "latn" }).format(new Date(y, m - 1, d));
}
