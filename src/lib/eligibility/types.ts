export type UsState = string; // two-letter postal code, e.g. "CA"

/** Everything the screener asks. All money is monthly, in USD, before taxes. */
export interface Household {
  state: UsState;
  /** People who live together and share meals, including the person answering. */
  size: number;
  childrenUnder5: number;
  children5to16: number;
  children17to18: number;
  pregnant: boolean;
  /** Someone in the household is 60 or older. */
  hasSenior60: boolean;
  /** Someone in the household is 65 or older. */
  hasSenior65: boolean;
  hasDisability: boolean;
  /** Married and would file taxes jointly. */
  married: boolean;
  /** Homeless, in a shelter, or staying with others because they lost housing. */
  homeless: boolean;
  /** Wages and self-employment. */
  monthlyEarned: number;
  /** Social Security, unemployment, child support, pensions and other income. */
  monthlyOther: number;
  expenses: {
    rent: number;
    utilities: number;
    childCare: number;
    /** Out-of-pocket medical costs for someone 60+ or disabled. */
    medical: number;
  };
  receives: {
    snap: boolean;
    medicaid: boolean;
    ssi: boolean;
    tanf: boolean;
    medicare: boolean;
  };
}

export type Status = "likely" | "possibly" | "unlikely";

/** A language-neutral reason. `key` is looked up in the content files for the user's language. */
export interface Reason {
  key: string;
  params?: Record<string, number | string>;
}

/** Estimated yearly value in USD. `low` < `high` means a range. */
export interface Value {
  low: number;
  high: number;
}

export interface Evaluation {
  status: Status;
  reasons: Reason[];
  value?: Value;
}

export interface ProgramResult extends Evaluation {
  programId: ProgramId;
}

export type ProgramId =
  | "snap"
  | "wic"
  | "school-meals"
  | "medicaid-adults"
  | "medicaid-pregnancy"
  | "medicaid-chip"
  | "aca-marketplace"
  | "medicare-extra-help"
  | "eitc"
  | "ctc"
  | "free-tax-help"
  | "ssi"
  | "tanf"
  | "liheap"
  | "lifeline"
  | "head-start"
  | "child-care"
  | "housing-voucher";

export type Category = "food" | "health" | "money" | "home" | "family";

type Region = "contiguous" | "AK" | "HI";

export interface Ruleset {
  version: string;
  /** ISO date the newest figures in this ruleset took effect. */
  effectiveFrom: string;
  sources: string[];
  povertyGuidelines: {
    year: number;
    base: Record<Region, number>;
    perAdditionalPerson: Record<Region, number>;
  };
  snap: {
    fiscalYear: number;
    /** Maximum monthly allotments for 1–8 people, 48 states + DC. */
    maxAllotment: number[];
    maxAllotmentPerAdditional: number;
    /** Standard deduction for 1–6+ people, 48 states + DC. */
    standardDeduction: number[];
    excessShelterCap: number;
    minimumBenefit: number;
    earnedIncomeDeduction: number;
    medicalDeductionFloor: number;
  };
  eitc: {
    taxYear: number;
    /** Indexed by number of qualifying children: 0, 1, 2, 3+. */
    maxCredit: number[];
    phaseInRate: number[];
    phaseOutRate: number[];
    phaseOutStart: number[];
    phaseOutStartMarried: number[];
  };
  ctc: {
    taxYear: number;
    perChild: number;
    refundablePerChild: number;
    earnedIncomeFloor: number;
    refundableRate: number;
    phaseOutStart: number;
    phaseOutStartMarried: number;
  };
  ssi: { year: number; federalBenefitRate: number; federalBenefitRateCouple: number; resourceLimit: number };
  medicareExtraHelp: { resourceLimit: number; resourceLimitCouple: number };
  freeTaxHelpIncomeLimit: number;
  /** States that have not adopted ACA Medicaid expansion for adults. */
  medicaidNonExpansionStates: UsState[];
}

export interface Context {
  ruleset: Ruleset;
  /** Annual poverty guideline for this household's size and state. */
  fplAnnual: number;
  /** Household income as a percentage of the poverty guideline. */
  fplPercent: number;
  monthlyIncome: number;
  annualIncome: number;
  annualEarned: number;
  children: number;
  childrenUnder17: number;
  nonExpansion: boolean;
}

export interface Program {
  id: ProgramId;
  category: Category;
  evaluate(h: Household, ctx: Context): Evaluation;
}
