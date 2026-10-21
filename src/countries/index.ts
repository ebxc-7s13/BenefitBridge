import { inEn } from "../content/india/en";
import { inHi } from "../content/india/hi";
import { indiaLinks } from "../content/india/links";
import type { InWizard } from "../content/india/types";
import { money, type Currency } from "../content/format";
import type { Link } from "../content/links";
import type { CountryCode, CountryContent, Locale } from "../content/types";
import { usEn } from "../content/us/en";
import { usEs } from "../content/us/es";
import { usLinks } from "../content/us/links";
import type { UsWizard } from "../content/us/types";
import type { ProgramResult } from "../lib/core";
import { currentRules, emptyHousehold as emptyIn, schemeById, screen as screenIn } from "../lib/india/engine";
import { inStateName } from "../lib/india/states";
import type { InHousehold } from "../lib/india/types";
import { stateName } from "../lib/states";
import { currentRuleset, emptyHousehold as emptyUs, programById, screen as screenUs } from "../lib/us/engine";
import type { Household } from "../lib/us/types";

export interface Answers {
  US: Household;
  IN: InHousehold;
}

/** Everything one country contributes: rules, wording, links, currency and languages. */
export interface CountryPack<C extends CountryCode = CountryCode, W = unknown> {
  code: C;
  /** Supported languages; the first is the default. */
  locales: Locale[];
  currency: Currency;
  rules: { version: string; effectiveFrom: string; sources: string[] };
  steps: number;
  content: Partial<Record<Locale, CountryContent<W>>>;
  links: Record<string, Link>;
  categoryOf(programId: string): string;
  empty(): Answers[C];
  screen(answers: Answers[C]): ProgramResult[];
  /** One line describing the household for the printed plan. */
  summary(answers: Answers[C], locale: Locale): string;
}

export const US: CountryPack<"US", UsWizard> = {
  code: "US",
  locales: ["en", "es"],
  currency: "USD",
  rules: currentRuleset,
  steps: 5,
  content: { en: usEn, es: usEs },
  links: usLinks,
  categoryOf: (id) => programById[id as keyof typeof programById].category,
  empty: emptyUs,
  screen: screenUs,
  summary: (a, locale) =>
    `${stateName(a.state)} · ${a.size} · ${money(a.monthlyEarned + a.monthlyOther, locale, "USD")}/${locale === "es" ? "mes" : "mo"}`,
};

export const IN: CountryPack<"IN", InWizard> = {
  code: "IN",
  locales: ["en", "hi"],
  currency: "INR",
  rules: currentRules,
  steps: 6,
  content: { en: inEn, hi: inHi },
  links: indiaLinks,
  categoryOf: (id) => schemeById[id as keyof typeof schemeById].category,
  empty: emptyIn,
  screen: screenIn,
  summary: (a, locale) =>
    `${inStateName(a.state, locale)} · ${a.size} · ${money(a.annualIncome, locale, "INR")}/${locale === "hi" ? "साल" : "yr"}`,
};

export const packs = { US, IN } as const;

export function packFor(code: CountryCode): CountryPack {
  return packs[code] as unknown as CountryPack;
}

/** The country's wording in the reader's language, falling back to its default language. */
export function contentFor(pack: CountryPack, locale: Locale): CountryContent {
  return (pack.content[locale] ?? pack.content[pack.locales[0]])!;
}
