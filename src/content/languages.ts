import type { IndianLocale, Locale } from "./types";

/** Each language's own name, and whether it's written right to left. */
export const LANGUAGES: Record<Locale, { name: string; rtl?: boolean }> = {
  en: { name: "English" },
  es: { name: "Español" },
  hi: { name: "हिन्दी" },
  bn: { name: "বাংলা" },
  mr: { name: "मराठी" },
  ta: { name: "தமிழ்" },
  te: { name: "తెలుగు" },
  kn: { name: "ಕನ್ನಡ" },
  ml: { name: "മലയാളം" },
  gu: { name: "ગુજરાતી" },
  pa: { name: "ਪੰਜਾਬੀ" },
  or: { name: "ଓଡ଼ିଆ" },
  as: { name: "অসমীয়া" },
  ur: { name: "اردو", rtl: true },
};

/** The official language of each Indian state or UT, when it isn't Hindi or English. */
export const STATE_LANGUAGE: Partial<Record<string, IndianLocale>> = {
  AP: "te",
  TS: "te",
  TN: "ta",
  PY: "ta",
  KA: "kn",
  KL: "ml",
  LD: "ml",
  MH: "mr",
  GJ: "gu",
  DN: "gu",
  WB: "bn",
  TR: "bn",
  OD: "or",
  AS: "as",
  PB: "pa",
  CH: "pa",
  JK: "ur",
};

export const INDIAN_LOCALES = [...new Set(Object.values(STATE_LANGUAGE))] as IndianLocale[];
