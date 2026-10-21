import type { Reason } from "../lib/core";
import type { CountryContent, Locale, UiStrings } from "./types";
import { uiEn } from "./ui/en";
import { uiEs } from "./ui/es";
import { uiHi } from "./ui/hi";
import { regionalUi } from "./regional";

export const ui: Partial<Record<Locale, UiStrings>> & Record<"en" | "es" | "hi", UiStrings> = { en: uiEn, es: uiEs, hi: uiHi, ...regionalUi };

/** Screen text in the reader's language, or English if it isn't translated. */
export const uiFor = (locale: Locale): UiStrings => ui[locale] ?? ui.en;

export function reasonText(c: CountryContent, r: Reason): string {
  const render = c.reasons[r.key];
  return render ? render(r.params ?? {}) : r.key;
}

export type { CountryCode, CountryContent, IndianLocale, Locale, UiStrings } from "./types";
