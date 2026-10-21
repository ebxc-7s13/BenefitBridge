import type { Household, Ruleset } from "./types";

export function snapMaxAllotment(ruleset: Ruleset, size: number): number {
  const { maxAllotment, maxAllotmentPerAdditional } = ruleset.snap;
  if (size <= maxAllotment.length) return maxAllotment[Math.max(1, size) - 1];
  return maxAllotment[maxAllotment.length - 1] + (size - maxAllotment.length) * maxAllotmentPerAdditional;
}

/**
 * SNAP net income and monthly benefit, following the federal budgeting steps:
 * gross → minus 20% of earnings, standard, dependent care and (60+/disabled) medical
 * deductions → minus excess shelter costs → benefit = max allotment − 30% of net income.
 * Rent plus actual utility costs stands in for the state's utility allowance.
 */
export function snapBudget(h: Household, ruleset: Ruleset) {
  const s = ruleset.snap;
  const elderlyOrDisabled = h.hasSenior60 || h.hasDisability;
  const gross = h.monthlyEarned + h.monthlyOther;
  let adjusted =
    gross -
    s.earnedIncomeDeduction * h.monthlyEarned -
    s.standardDeduction[Math.min(h.size, s.standardDeduction.length) - 1] -
    h.expenses.childCare;
  if (elderlyOrDisabled && h.expenses.medical > s.medicalDeductionFloor) {
    adjusted -= h.expenses.medical - s.medicalDeductionFloor;
  }
  adjusted = Math.max(0, adjusted);
  let excessShelter = Math.max(0, h.expenses.rent + h.expenses.utilities - adjusted / 2);
  if (!elderlyOrDisabled) excessShelter = Math.min(excessShelter, s.excessShelterCap);
  const net = Math.max(0, Math.round(adjusted - excessShelter));
  const max = snapMaxAllotment(ruleset, h.size);
  const benefit = Math.max(0, max - Math.ceil(net * 0.3));
  return { gross, net, max, benefit };
}

/** Federal EITC for the ruleset's tax year. `kids` is capped at 3. */
export function eitcCredit(ruleset: Ruleset, earned: number, agi: number, kids: number, married: boolean): number {
  const e = ruleset.eitc;
  const k = Math.min(3, Math.max(0, kids));
  const phaseIn = Math.min(e.phaseInRate[k] * earned, e.maxCredit[k]);
  const start = (married ? e.phaseOutStartMarried : e.phaseOutStart)[k];
  const reduction = e.phaseOutRate[k] * Math.max(0, Math.max(agi, earned) - start);
  return Math.max(0, Math.round(phaseIn - reduction));
}

/** Income at which the EITC reaches $0. */
export function eitcIncomeLimit(ruleset: Ruleset, kids: number, married: boolean): number {
  const e = ruleset.eitc;
  const k = Math.min(3, Math.max(0, kids));
  return Math.round((married ? e.phaseOutStartMarried : e.phaseOutStart)[k] + e.maxCredit[k] / e.phaseOutRate[k]);
}

/**
 * Child Tax Credit range. `low` is the refundable part anyone with enough earnings gets back;
 * `high` is the full credit, reached when the family owes enough income tax.
 */
export function ctcRange(ruleset: Ruleset, earned: number, agi: number, kids: number, married: boolean) {
  const c = ruleset.ctc;
  const start = married ? c.phaseOutStartMarried : c.phaseOutStart;
  // $50 reduction per $1,000 (or part of $1,000) over the threshold.
  const reduction = Math.ceil(Math.max(0, agi - start) / 1000) * 50;
  const high = Math.max(0, kids * c.perChild - reduction);
  const refundable = Math.min(kids * c.refundablePerChild, c.refundableRate * Math.max(0, earned - c.earnedIncomeFloor));
  const low = Math.round(Math.min(refundable, high));
  return { low, high };
}

/** SSI countable income after the $20 general and $65 + half-of-the-rest earned-income exclusions. */
export function ssiCountableIncome(monthlyEarned: number, monthlyOther: number): number {
  const generalLeft = Math.max(0, 20 - monthlyOther);
  const unearned = Math.max(0, monthlyOther - 20);
  const earned = Math.max(0, monthlyEarned - generalLeft - 65) / 2;
  return Math.round(unearned + earned);
}
