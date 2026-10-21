import type { Reason } from "../lib/eligibility/types";
import { en } from "./en";
import { es } from "./es";
import type { Content, Locale } from "./types";

export const contents: Record<Locale, Content> = { en, es };

export function reasonText(c: Content, r: Reason): string {
  const render = c.reasons[r.key];
  return render ? render(r.params ?? {}) : r.key;
}

export type { Content, Locale } from "./types";
