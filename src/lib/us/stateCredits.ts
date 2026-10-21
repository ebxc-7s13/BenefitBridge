import type { Evaluation, Reason } from "../core";
import type { Household, ProgramResult } from "./types";

/** A state's own earned income and child tax credits. */
export interface StateCredits {
  eitc?: {
    /**
     * Share of the federal EITC (0.3 = 30%), or shares by number of children (0, 1, 2, 3+).
     * Absent when the state uses its own formula.
     */
    pct?: number | [number, number, number, number];
    refundable: boolean;
  };
  ctc?: {
    /** Most per child for children younger than `ageUnder`; a younger tier first when amounts differ by age. */
    tiers: { max: number; ageUnder: number }[];
    refundable: boolean;
    /** One credit per tax return, not per child. */
    perReturn?: boolean;
    /** Household income above which nothing is paid, when the state sets a hard limit. */
    incomeMax?: number;
    /** The credit shrinks as income rises (no single hard limit). */
    phaseOut?: boolean;
    /** Only for people who also get the EITC. */
    needsEitc?: boolean;
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
export function evaluateStateEitc(credit: NonNullable<StateCredits["eitc"]>, federal: ProgramResult, children: number): Evaluation {
  if (federal.status === "unlikely") return { status: "unlikely", reasons: [{ key: "stateEitc.needsFederal" }] };
  const pct = Array.isArray(credit.pct) ? credit.pct[Math.min(children, 3)] : credit.pct;
  if (pct === 0) return { status: "unlikely", reasons: [{ key: "stateEitc.needsChildren" }] };
  const reasons: Reason[] = [pct ? { key: "stateEitc.pct", params: { pct: Math.round(pct * 1000) / 10 } } : { key: "stateEitc.formula" }];
  reasons.push({ key: credit.refundable ? "stateCredit.refundable" : "stateCredit.nonRefundable" }, { key: "stateCredit.file" });
  if (!pct || !federal.value) return { status: "possibly", reasons };
  // A credit that isn't refundable only lowers tax owed, so it may be worth less than the full share.
  const high = Math.round(federal.value.high * pct);
  return {
    status: credit.refundable ? federal.status : "possibly",
    reasons,
    value: { low: credit.refundable ? Math.round(federal.value.low * pct) : 0, high },
  };
}

/** The most one child could get, given the age group we know (0–4, 5–16 or 17–18). */
function bestFor(tiers: { max: number; ageUnder: number }[], youngest: number): number {
  return Math.max(0, ...tiers.filter((t) => t.ageUnder > youngest).map((t) => t.max));
}

export function evaluateStateCtc(credit: NonNullable<StateCredits["ctc"]>, h: Household, annualIncome: number, federalEitc?: ProgramResult): Evaluation {
  const groups: [count: number, youngest: number][] = [
    [h.childrenUnder5, 0],
    [h.children5to16, 5],
    [h.children17to18, 17],
  ];
  const each = groups.flatMap(([n, youngest]) => Array<number>(n).fill(bestFor(credit.tiers, youngest))).filter((x) => x > 0);
  const oldest = Math.max(...credit.tiers.map((t) => t.ageUnder));
  if (each.length === 0) return { status: "unlikely", reasons: [{ key: "stateCtc.miss.children", params: { age: oldest } }] };
  if (credit.incomeMax && annualIncome > credit.incomeMax) {
    return { status: "unlikely", reasons: [{ key: "stateCtc.miss.income", params: { limit: credit.incomeMax } }] };
  }
  if (credit.needsEitc && federalEitc?.status === "unlikely") return { status: "unlikely", reasons: [{ key: "stateEitc.needsFederal" }] };

  const [first, second] = credit.tiers;
  const reasons: Reason[] = [
    credit.perReturn
      ? { key: "stateCtc.perReturn", params: { max: first.max, age: first.ageUnder } }
      : second
        ? { key: "stateCtc.tiers", params: { max: first.max, age: first.ageUnder, max2: second.max, age2: second.ageUnder } }
        : { key: "stateCtc.amount", params: { max: first.max, age: first.ageUnder } },
  ];
  if (credit.incomeMax) reasons.push({ key: "stateCtc.income", params: { limit: credit.incomeMax } });
  else if (credit.phaseOut) reasons.push({ key: "stateCtc.phaseOut" });
  reasons.push({ key: credit.refundable ? "stateCredit.refundable" : "stateCredit.nonRefundable" }, { key: "stateCredit.file" });
  const high = credit.perReturn ? Math.max(...each) : each.reduce((a, b) => a + b, 0);
  return { status: "possibly", reasons, value: { low: 0, high } };
}
