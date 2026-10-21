import { inEn } from "../content/india/en";
import { inHi } from "../content/india/hi";
import { indiaLinks, MYSCHEME_URL } from "../content/india/links";
import { withLocalStateContent, withStateContent } from "../content/india/stateContent";
import { stateNameFor } from "../content/india/stateNames";
import { STATE_LANGUAGE } from "../content/languages";
import { regionalIndia, regionalStateText } from "../content/regional";
import type { InWizard } from "../content/india/types";
import { money, type Currency } from "../content/format";
import { uiFor } from "../content";
import type { Link } from "../content/links";
import type { CountryCode, CountryContent, IndianLocale, Locale } from "../content/types";
import { usEn } from "../content/us/en";
import { usEs } from "../content/us/es";
import { usLinks } from "../content/us/links";
import { withStateContent as withUsStateContent } from "../content/us/stateContent";
import { statePortals as usPortals } from "../content/us/statePortals";
import type { UsWizard } from "../content/us/types";
import type { ProgramResult } from "../lib/core";
import { categoryOf as inCategoryOf, currentRules, emptyHousehold as emptyIn, screen as screenIn } from "../lib/india/engine";
import { statePortals, stateSchemes } from "../lib/india/stateSchemes";
import { inStateName } from "../lib/india/states";
import type { InHousehold } from "../lib/india/types";
import { stateName } from "../lib/states";
import { categoryOf as usCategoryOf, currentRuleset, emptyHousehold as emptyUs, screen as screenUs } from "../lib/us/engine";
import { stateCreditTable } from "../lib/us/rulesets/stateCredits2026";
import { stateCtcId, stateEitcId } from "../lib/us/stateCredits";
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
  /** Languages offered for these answers (India adds the chosen state's language). */
  localesFor(answers: Answers[C]): Locale[];
  currency: Currency;
  rules: { version: string; effectiveFrom: string; sources: string[] };
  steps: number;
  content: Partial<Record<Locale, CountryContent<W>>>;
  links: Record<string, Link>;
  categoryOf(programId: string): string;
  empty(): Answers[C];
  screen(answers: Answers[C]): ProgramResult[];
  /** The household's own state and its official links, for the card under the results. */
  local(answers: Answers[C], locale: Locale): { place: string; links: { label: string; href: string }[] } | null;
  /** One line describing the household for the printed plan. */
  summary(answers: Answers[C], locale: Locale): string;
}

/** "up.gov.in" from "https://www.up.gov.in/". */
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export const US: CountryPack<"US", UsWizard> = {
  code: "US",
  locales: ["en", "es"],
  localesFor: () => ["en", "es"],
  currency: "USD",
  rules: currentRuleset,
  steps: 5,
  content: { en: withUsStateContent(usEn, "en"), es: withUsStateContent(usEs, "es") },
  links: {
    ...usLinks,
    ...Object.fromEntries(
      Object.entries(stateCreditTable.states).flatMap(([state, c]) => [
        ...(c.eitc ? [[stateEitcId(state), { url: c.tax.url }]] : []),
        ...(c.ctc ? [[stateCtcId(state), { url: c.tax.url }]] : []),
      ]),
    ),
  },
  categoryOf: usCategoryOf,
  empty: emptyUs,
  screen: screenUs,
  local: (a) => {
    const p = usPortals[a.state];
    if (!p) return null;
    return {
      place: stateName(a.state),
      links: [...(p.portal ? [{ label: p.portal.name, href: p.portal.url }] : []), { label: p.agency.name, href: p.agency.url }],
    };
  },
  summary: (a, locale) =>
    `${stateName(a.state)} · ${a.size} · ${money(a.monthlyEarned + a.monthlyOther, locale, "USD")}/${locale === "es" ? "mes" : "mo"}`,
};

export const IN: CountryPack<"IN", InWizard> = {
  code: "IN",
  locales: ["en", "hi"],
  localesFor: (a) => {
    const own = STATE_LANGUAGE[a.state];
    return own && regionalIndia[own] ? ["en", "hi", own] : ["en", "hi"];
  },
  currency: "INR",
  rules: currentRules,
  steps: 6,
  content: {
    en: withStateContent(inEn, "en"),
    hi: withStateContent(inHi, "hi"),
    ...Object.fromEntries(
      Object.entries(regionalIndia).map(([l, c]) => [l, regionalStateText[l as IndianLocale] ? withLocalStateContent(c, regionalStateText[l as IndianLocale]!) : c]),
    ),
  },
  links: { ...indiaLinks, ...Object.fromEntries(stateSchemes.map((s) => [s.id, { url: s.url ?? statePortals[s.state], phone: s.phone }])) },
  categoryOf: inCategoryOf,
  empty: emptyIn,
  screen: screenIn,
  local: (a, locale) => {
    const portal = statePortals[a.state];
    if (!portal) return null;
    return {
      place: stateNameFor(a.state, locale),
      links: [
        { label: hostOf(portal), href: portal },
        { label: "myScheme.gov.in", href: `${MYSCHEME_URL}search/state/${encodeURIComponent(inStateName(a.state, "en"))}` },
      ],
    };
  },
  summary: (a, locale) =>
    `${stateNameFor(a.state, locale)} · ${a.size} · ${money(a.annualIncome, locale, "INR")} ${uiFor(locale).money.perYear}`,
};

export const packs = { US, IN } as const;

export function packFor(code: CountryCode): CountryPack {
  return packs[code] as unknown as CountryPack;
}

/** The country's wording in the reader's language, falling back to its default language. */
export function contentFor(pack: CountryPack, locale: Locale): CountryContent {
  return (pack.content[locale] ?? pack.content[pack.locales[0]])!;
}
