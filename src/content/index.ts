import type { Reason } from "../lib/core";
import type { CountryContent, Locale, UiStrings } from "./types";
import { uiEn } from "./ui/en";
import { uiEs } from "./ui/es";
import { uiHi } from "./ui/hi";

export const ui: Record<Locale, UiStrings> = { en: uiEn, es: uiEs, hi: uiHi };

export function reasonText(c: CountryContent, r: Reason): string {
  const render = c.reasons[r.key];
  return render ? render(r.params ?? {}) : r.key;
}

export type { CountryCode, CountryContent, Locale, UiStrings } from "./types";
