import { IN_STATES, inStateName } from "../../lib/india/states";
import { regionalStateText } from "../regional";
import type { IndianLocale, Locale } from "../types";

/** A state's name in the reader's language (state languages use their own spelling). */
export function stateNameFor(code: string, locale: Locale): string {
  return regionalStateText[locale as IndianLocale]?.stateNames[code] ?? inStateName(code, locale === "hi" ? "hi" : "en");
}

/** All states and UTs as [code, name] in the reader's language. */
export const statesFor = (locale: Locale): [string, string][] => IN_STATES.map(([code]) => [code, stateNameFor(code, locale)]);
