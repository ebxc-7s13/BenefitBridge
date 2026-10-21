import { annualPovertyGuideline } from "./fpl";
import { childCare, headStart } from "./programs/family";
import { schoolMeals, snap, wic } from "./programs/food";
import { acaMarketplace, medicaidAdults, medicaidChip, medicaidPregnancy, medicareExtraHelp } from "./programs/health";
import { housingVoucher, lifeline, liheap } from "./programs/home";
import { ctc, eitc, freeTaxHelp, ssi, tanf } from "./programs/money";
import { ruleset2026 } from "./rulesets/2026";
import { rank, totals } from "../core";
import type { Context, Household, Program, ProgramId, ProgramResult, Ruleset } from "./types";

export const currentRuleset = ruleset2026;

export const programs: Program[] = [
  snap, wic, schoolMeals,
  medicaidAdults, medicaidPregnancy, medicaidChip, acaMarketplace, medicareExtraHelp,
  eitc, ctc, ssi, tanf, freeTaxHelp,
  liheap, lifeline, housingVoucher,
  headStart, childCare,
];

export const programById = Object.fromEntries(programs.map((p) => [p.id, p])) as Record<ProgramId, Program>;

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const count = (n: number) => Math.floor(clean(n));

/** Coerce user input into a consistent household (non-negative numbers, size covers the children). */
export function normalize(h: Household): Household {
  const childrenUnder5 = count(h.childrenUnder5);
  const children5to16 = count(h.children5to16);
  const children17to18 = count(h.children17to18);
  const kids = childrenUnder5 + children5to16 + children17to18;
  return {
    ...h,
    childrenUnder5,
    children5to16,
    children17to18,
    size: Math.max(1, count(h.size), kids + 1),
    hasSenior60: h.hasSenior60 || h.hasSenior65,
    monthlyEarned: clean(h.monthlyEarned),
    monthlyOther: clean(h.monthlyOther),
    expenses: {
      rent: clean(h.expenses.rent),
      utilities: clean(h.expenses.utilities),
      childCare: clean(h.expenses.childCare),
      medical: clean(h.expenses.medical),
    },
  };
}

export function buildContext(h: Household, ruleset: Ruleset): Context {
  const fplAnnual = annualPovertyGuideline(ruleset, h.state, h.size);
  const monthlyIncome = h.monthlyEarned + h.monthlyOther;
  return {
    ruleset,
    fplAnnual,
    fplPercent: ((monthlyIncome * 12) / fplAnnual) * 100,
    monthlyIncome,
    annualIncome: monthlyIncome * 12,
    annualEarned: h.monthlyEarned * 12,
    children: h.childrenUnder5 + h.children5to16 + h.children17to18,
    childrenUnder17: h.childrenUnder5 + h.children5to16,
    nonExpansion: ruleset.medicaidNonExpansionStates.includes(h.state),
  };
}

/** Screen a household against every program. Likely results come first, then by estimated value. */
export function screen(household: Household, ruleset: Ruleset = currentRuleset, list: Program[] = programs): ProgramResult[] {
  const h = normalize(household);
  const ctx = buildContext(h, ruleset);
  return rank(list.map((p) => ({ programId: p.id, ...p.evaluate(h, ctx) })));
}

/** Total estimated yearly value of the results that are likely or possible. */
export function totalValue(results: ProgramResult[]): { low: number; high: number } {
  return totals(results).yearly;
}

export function emptyHousehold(): Household {
  return {
    state: "",
    size: 1,
    childrenUnder5: 0,
    children5to16: 0,
    children17to18: 0,
    pregnant: false,
    hasSenior60: false,
    hasSenior65: false,
    hasDisability: false,
    married: false,
    homeless: false,
    monthlyEarned: 0,
    monthlyOther: 0,
    expenses: { rent: 0, utilities: 0, childCare: 0, medical: 0 },
    receives: { snap: false, medicaid: false, ssi: false, tanf: false, medicare: false },
  };
}
