import type { InWizard } from "./india/types";
import type { StateLocal } from "./india/stateText";
import type { CountryContent, IndianLocale, UiStrings } from "./types";

/** Screen text, India content and state scheme wording in each Indian state language. */
export const regionalUi: Partial<Record<IndianLocale, UiStrings>> = {};
export const regionalIndia: Partial<Record<IndianLocale, CountryContent<InWizard>>> = {};
export const regionalStateText: Partial<Record<IndianLocale, StateLocal>> = {};
