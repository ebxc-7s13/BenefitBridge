import type { Evaluation, Reason } from "../core";
import type { Household, ProgramResult } from "./types";

/** A state's own earned income and child tax credits. */
export interface StateCredits {
  eitc?: {
    /** Share of the federal EITC (0.3 = 30%). Absent when the state uses its own formula. */
    pct?: number;
    refundable: boolean;
  };
  ctc?: {
    /** Most per child, in dollars a year. */
    max: number;
    /** Children younger than this age count. */
    ageUnder: number;
    /** Household income limit (federal AGI), when the state sets one. */
    incomeMax?: number;
  };
  /** The state tax agency, where the credits are claimed. */
  tax: { url: string };
}

export interface StateCreditTable {
  taxYear: number;
  sources: string[];
  states: Record<string, StateCredits>;
}

export const stateEitcId = (state: string) => `${state.toLowerCase()}-eitc`;
export const stateCtcId = (state: string) => `${state.toLowerCase()}-ctc`;

/** The state's EITC follows the federal one: same status, a share of its value. */
export function evaluateStateEitc(credit: NonNullable<StateCredits["eitc"]>, federal: ProgramResult): Evaluation {
  if (federal.status === "unlikely") return { status: "unlikely", reasons: [{ key: "stateEitc.needsFederal" }] };
  const reasons: Reason[] = [credit.pct ? { key: "stateEitc.pct", params: { pct: Math.round(credit.pct * 100) } } : { key: "stateEitc.formula" }];
  reasons.push({ key: credit.refundable ? "stateEitc.refundable" : "stateEitc.nonRefundable" }, { key: "stateCredit.file" });
  if (!credit.pct || !federal.value) return { status: "possibly", reasons };
  // A credit that isn't refundable only lowers tax owed, so it may be worth less than the full share.
  const high = Math.round(federal.value.high * credit.pct);
  return { status: credit.refundable ? federal.status : "possibly", reasons, value: { low: credit.refundable ? Math.round(federal.value.low * credit.pct) : 0, high } };
}

/** Children we can count for an age limit, and whether some may be missed (age buckets are 0–4, 5–16, 17–18). */
function childrenUnder(h: Household, age: number): { sure: number; maybe: number } {
  if (age >= 19) return { sure: h.childrenUnder5 + h.children5to16 + h.children17to18, maybe: 0 };
  if (age >= 17) return { sure: h.childrenUnder5 + h.children5to16, maybe: age > 17 ? h.children17to18 : 0 };
  if (age >= 5) return { sure: h.childrenUnder5, maybe: h.children5to16 };
  return { sure: 0, maybe: h.childrenUnder5 };
}

export function evaluateStateCtc(credit: NonNullable<StateCredits["ctc"]>, h: Household, annualIncome: number): Evaluation {
  const { sure, maybe } = childrenUnder(h, credit.ageUnder);
  if (sure + maybe === 0) return { status: "unlikely", reasons: [{ key: "stateCtc.miss.children", params: { age: credit.ageUnder } }] };
  if (credit.incomeMax && annualIncome > credit.incomeMax) {
    return { status: "unlikely", reasons: [{ key: "stateCtc.miss.income", params: { limit: credit.incomeMax } }] };
  }
  const reasons: Reason[] = [
    { key: "stateCtc.amount", params: { max: credit.max, age: credit.ageUnder } },
    ...(credit.incomeMax ? [{ key: "stateCtc.income", params: { limit: credit.incomeMax } }] : []),
    { key: "stateCredit.file" },
  ];
  return { status: "possibly", reasons, value: { low: 0, high: credit.max * (sure + maybe) } };
}
