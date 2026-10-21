import { inBn } from "./india/bn";
import { localBn } from "./india/local/bn";
import { uiBn } from "./ui/bn";
import { inMr } from "./india/mr";
import { localMr } from "./india/local/mr";
import { uiMr } from "./ui/mr";
import type { InWizard } from "./india/types";
import type { StateLocal } from "./india/stateText";
import type { CountryContent, IndianLocale, UiStrings } from "./types";

/** Screen text, India content and state scheme wording in each Indian state language. */
export const regionalUi: Partial<Record<IndianLocale, UiStrings>> = { bn: uiBn, mr: uiMr };
export const regionalIndia: Partial<Record<IndianLocale, CountryContent<InWizard>>> = { bn: inBn, mr: inMr };
export const regionalStateText: Partial<Record<IndianLocale, StateLocal>> = { bn: localBn, mr: localMr };
