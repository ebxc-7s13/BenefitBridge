import type { Ruleset, UsState } from "./types";

export function annualPovertyGuideline(ruleset: Ruleset, state: UsState, size: number): number {
  const region = state === "AK" || state === "HI" ? state : "contiguous";
  const { base, perAdditionalPerson } = ruleset.povertyGuidelines;
  return base[region] + perAdditionalPerson[region] * (Math.max(1, size) - 1);
}

/** Monthly income limit at a given % of the poverty guideline, rounded up like USDA tables. */
export function monthlyLimit(fplAnnual: number, percent: number): number {
  return Math.ceil((fplAnnual * percent) / 100 / 12);
}

/** Annual income limit at a given % of the poverty guideline, rounded up like USDA tables. */
export function annualLimit(fplAnnual: number, percent: number): number {
  return Math.ceil((fplAnnual * percent) / 100);
}
