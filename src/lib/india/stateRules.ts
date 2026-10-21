import type { Evaluation, Reason, Value } from "../core";
import type { Category, InHousehold } from "./types";

/**
 * Criteria a state scheme can require. Every criterion listed must be met.
 * Unknown answers (age 0, gender not given) never rule a scheme out; they lower it to "possibly".
 */
export interface StateCriteria {
  women?: boolean;
  ageMin?: number;
  ageMax?: number;
  /** Annual family income limit in rupees. */
  incomeMax?: number;
  rural?: boolean;
  categories?: ("sc" | "st" | "obc" | "minority")[];
  /** AAY or priority (PHH/BPL) ration card, or on the BPL list. */
  poorCard?: boolean;
  /** Any ration card issued by the state. */
  anyCard?: boolean;
  farmer?: boolean;
  landOwner?: boolean;
  girl?: boolean;
  school?: boolean;
  college?: boolean;
  pregnant?: boolean;
  senior60?: boolean;
  widow?: boolean;
  disability?: boolean;
  /** Someone 60+, a widow, or a person with a disability. */
  needy?: boolean;
  /** Unorganised work: daily wage, farm labour, vending or crafts. */
  worker?: boolean;
  jobseeker?: boolean;
  business?: boolean;
  noTaxPayer?: boolean;
  noGovtJob?: boolean;
  noPuccaHouse?: boolean;
}

export interface StateScheme {
  id: string;
  /** State or UT code, e.g. "UP". */
  state: string;
  category: Category;
  criteria: StateCriteria;
  /**
   * The scheme has conditions the questionnaire doesn't ask (for example marital status,
   * exact caste lists or exam results), so a match is "possibly", never "likely".
   */
  check?: boolean;
  value?: Value;
  /** Yearly value per acre of farmland (replaces `value`). */
  perAcre?: number;
  /** The scheme's official page; null when it has none of its own (the state portal is used). */
  url: string | null;
  phone?: string;
}

type Key = keyof StateCriteria;
type Test = (h: InHousehold, c: StateCriteria) => boolean | null;

const poor = (h: InHousehold) => h.bpl === "yes" || h.rationCard === "aay" || h.rationCard === "phh";

/** Each criterion returns true (met), false (not met) or null (we can't tell from the answers). */
const tests: Record<Key, Test> = {
  women: (h) => (h.gender === "" ? null : h.gender === "female"),
  ageMin: (h, c) => (h.age === 0 ? null : h.age >= c.ageMin!),
  ageMax: (h, c) => (h.age === 0 ? null : h.age <= c.ageMax!),
  incomeMax: (h, c) => h.annualIncome <= c.incomeMax!,
  rural: (h) => h.area !== "urban",
  categories: (h, c) => c.categories!.some((x) => (x === "minority" ? h.minority : h.category === x)),
  poorCard: (h) => poor(h),
  anyCard: (h) => h.rationCard !== "none",
  farmer: (h) => h.work.farmer,
  landOwner: (h) => h.landAcres > 0,
  girl: (h) => h.girlsUnder10 > 0,
  school: (h) => h.schoolChildren > 0,
  college: (h) => h.collegeStudent,
  pregnant: (h) => h.pregnant,
  senior60: (h) => h.senior60 || h.senior70,
  widow: (h) => h.widow,
  disability: (h) => h.disability !== "none",
  needy: (h) => h.senior60 || h.senior70 || h.widow || h.disability !== "none",
  worker: (h) => h.work.worker || h.work.farmLabour || h.work.vendor || h.work.artisan,
  jobseeker: (h) => h.work.jobseeker,
  business: (h) => h.work.business || h.wantsLoan,
  noTaxPayer: (h) => !h.incomeTaxPayer,
  noGovtJob: (h) => !h.govtEmployee,
  noPuccaHouse: (h) => h.home !== "pucca",
};

/** Reason parameters for a criterion (age range, income limit, categories). */
function params(key: Key, c: StateCriteria): Reason["params"] {
  if (key === "ageMin" || key === "ageMax") return { min: c.ageMin ?? 0, max: c.ageMax ?? 0 };
  if (key === "incomeMax") return { limit: c.incomeMax! };
  if (key === "categories") return { list: c.categories!.join(",") };
  return undefined;
}

/** ageMin and ageMax share one reason. */
const reasonKey = (key: Key, c: StateCriteria) =>
  key === "ageMin" || key === "ageMax" ? (c.ageMin && c.ageMax ? "age" : key === "ageMin" ? "ageMin" : "ageMax") : key;

export function evaluateStateScheme(s: StateScheme, h: InHousehold): Evaluation {
  const met: Reason[] = [];
  const missed: Reason[] = [];
  let unknown = false;
  const seen = new Set<string>();
  for (const key of Object.keys(s.criteria) as Key[]) {
    if (s.criteria[key] === undefined || s.criteria[key] === false) continue;
    const result = tests[key](h, s.criteria);
    const k = reasonKey(key, s.criteria);
    if (seen.has(k) && result !== false) continue;
    seen.add(k);
    const reason = { key: `state.${k}`, params: params(key, s.criteria) };
    if (result === false) missed.push({ ...reason, key: `state.miss.${k}` });
    else {
      if (result === null) unknown = true;
      met.push(reason);
    }
  }
  if (missed.length > 0) return { status: "unlikely", reasons: missed.slice(0, 2) };

  const value = s.perAcre ? (h.landAcres > 0 ? { low: s.perAcre * h.landAcres, high: s.perAcre * h.landAcres } : undefined) : s.value;
  return {
    status: s.check || unknown ? "possibly" : "likely",
    reasons: [...met.slice(0, 3), { key: "state.verify" }],
    value,
  };
}
