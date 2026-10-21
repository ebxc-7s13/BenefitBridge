import type { Locale } from "./types";

export interface Link {
  url: string;
  /** Spanish-language page, when the agency has one. */
  es?: string;
  phone?: string;
}

/** The official page in the reader's language when the agency has one. */
export function linkUrl(link: Link, locale: Locale): string {
  return (locale === "es" && link.es) || link.url;
}
