import type { Ruleset, UsState } from "./types";

export function annualPovertyGuideline(ruleset: Ruleset, state: UsState, size: number): number {
  const region = state === "AK" || state === "HI" ? state : "contiguous";
  const { base, perAdditionalPerson } = ruleset.povertyGuidelines;
  return base[region] + perAdditionalPerson[region] * (Math.max(1, size) - 1);
}

export function percentOfPoverty(ruleset: Ruleset, state: UsState, size: number, monthlyIncome: number): number {
  return ((monthlyIncome * 12) / annualPovertyGuideline(ruleset, state, size)) * 100;
}

/** Monthly income limit at a given % of the poverty guideline, rounded up like SNAP tables. */
export function monthlyLimit(fplAnnual: number, percent: number): number {
  return Math.ceil((fplAnnual * percent) / 100 / 12);
}
