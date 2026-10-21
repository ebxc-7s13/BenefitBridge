import type { Locale, ServiceCategory } from "../types";

/** Text in English plus any other languages it has been translated into. */
export type Text = Partial<Record<Locale, string>> & { en: string };
export type TextList = Partial<Record<Locale, string[]>> & { en: string[] };

/** A government service: what it is, its official website and helpline, papers and steps. */
export interface Service {
  id: string;
  /** "national", or the state's code for a state service. */
  scope: string;
  category: ServiceCategory;
  name: Text;
  what: Text;
  /** Official website; null when only a phone number is confirmed. */
  url: string | null;
  phone?: string;
  docs?: TextList;
  steps?: TextList;
}

/** A free government helpline. */
export interface Helpline {
  id: string;
  scope: string;
  name: Text;
  number: string;
  what: Text;
  /** Emergency numbers are shown first and highlighted. */
  emergency?: boolean;
}

export const pick = (t: Text, locale: Locale) => t[locale] ?? t.en;
export const pickList = (t: TextList | undefined, locale: Locale) => (t ? (t[locale] ?? t.en) : []);

/** "tel:" link for a printed number such as "1800-11-4000". */
export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
