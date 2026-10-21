import type { Locale } from "./types";

const tag = (locale: Locale) => (locale === "es" ? "es-US" : "en-US");

export function money(n: number, locale: Locale): string {
  const cents = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

export function moneyRange(low: number, high: number, locale: Locale): string {
  return low === high ? money(low, locale) : `${money(low, locale)}–${money(high, locale)}`;
}

export function longDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(tag(locale), { year: "numeric", month: "long", day: "numeric" }).format(new Date(y, m - 1, d));
}
