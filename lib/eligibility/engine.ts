import { annualPovertyGuideline, percentOfPoverty } from "./fpl";
import { programs as defaultPrograms } from "./programs";
import { ruleset2025 } from "./rulesets/2025";
import type { Household, Program, ProgramResult, Ruleset, Status } from "./types";

export const currentRuleset = ruleset2025;

const order: Record<Status, number> = { likely: 0, possibly: 1, unlikely: 2 };

export function screen(
  household: Household,
  ruleset: Ruleset = currentRuleset,
  programs: Program[] = defaultPrograms,
): ProgramResult[] {
  const h = { ...household, size: Math.max(1, Math.floor(household.size)) };
  const ctx = {
    ruleset,
    fplAnnual: annualPovertyGuideline(ruleset, h.state, h.size),
    fplPercent: percentOfPoverty(ruleset, h.state, h.size, h.monthlyGrossIncome),
  };
  return programs
    .map((p) => ({ programId: p.id, name: p.name, summary: p.summary, applyUrl: p.applyUrl, ...p.evaluate(h, ctx) }))
    .sort((a, b) => order[a.status] - order[b.status]);
}
