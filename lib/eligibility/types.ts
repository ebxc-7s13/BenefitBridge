export type UsState = string; // two-letter postal code, e.g. "CA"

export interface Household {
  state: UsState;
  /** People who live together and buy/prepare food together. */
  size: number;
  /** Total gross (pre-tax) monthly income for the whole household, in USD. */
  monthlyGrossIncome: number;
  pregnant: boolean;
  /** Someone in the household is under 5 years old. */
  hasChildUnder5: boolean;
  /** Someone in the household is under 19 years old. */
  hasChildUnder19: boolean;
  /** Someone in the household is 60 or older. */
  hasSenior: boolean;
  /** Someone in the household has a disability. */
  hasDisability: boolean;
  /** Programs the household already receives. */
  receives: {
    snap: boolean;
    medicaid: boolean;
    ssi: boolean;
    tanf: boolean;
  };
}

export type Status = "likely" | "possibly" | "unlikely";

export interface ProgramResult {
  programId: string;
  name: string;
  summary: string;
  status: Status;
  /** Plain-language reasons, each tied to a fact and a threshold. */
  reasons: string[];
  applyUrl: string;
}

export interface Ruleset {
  version: string;
  /** ISO date this ruleset's thresholds took effect. */
  effectiveFrom: string;
  sources: string[];
  povertyGuidelines: {
    /** Annual poverty guideline for a 1-person household. */
    base: Record<"contiguous" | "AK" | "HI", number>;
    /** Amount added per additional person. */
    perAdditionalPerson: Record<"contiguous" | "AK" | "HI", number>;
  };
  /** States that have not adopted ACA Medicaid expansion for adults. */
  medicaidNonExpansionStates: UsState[];
}

export interface Context {
  ruleset: Ruleset;
  /** Household income as a percentage of the federal poverty guideline. */
  fplPercent: number;
  /** Annual poverty guideline for this household. */
  fplAnnual: number;
}

export interface Program {
  id: string;
  name: string;
  summary: string;
  applyUrl: string;
  evaluate(h: Household, ctx: Context): { status: Status; reasons: string[] };
}
