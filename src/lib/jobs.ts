import type { Education } from "../content/types";

export type RequiredEducation = Exclude<Education, "none"> | "b.ed";

/** Eligibility rule for a recruitment exam or job scheme (general category limits). */
export interface JobRule {
  id: string;
  /** Open to everyone (job portals, free training). */
  forAll?: boolean;
  minEducation?: RequiredEducation;
  ageMin?: number;
  ageMax?: number;
  /** Extra years on the upper age limit by social category. */
  relax?: Partial<Record<"sc" | "st" | "obc", number>>;
  url: string;
}

export interface JobPerson {
  /** 0 when not given. */
  age: number;
  education: Education | "";
  category: string;
}

export type JobFit = "yes" | "no" | "maybe";

export interface JobResult {
  status: JobFit;
  education: JobFit;
  age: JobFit;
  /** Upper age limit after the category relaxation. */
  ageMax?: number;
  relaxed: number;
}

const RANK: Record<Education, number> = { none: 0, "8th": 1, "10th": 2, iti: 2.5, "12th": 3, diploma: 3, graduate: 4, postgraduate: 5 };

/** Does this education meet the requirement? Parallel tracks (ITI, diploma, B.Ed) are "maybe" when unclear. */
export function educationFit(have: Education | "", need?: RequiredEducation): JobFit {
  if (!need) return "yes";
  if (!have) return "maybe";
  if (need === "b.ed") return RANK[have] >= RANK.graduate ? "maybe" : "no";
  if (need === "iti") return have === "iti" ? "yes" : have === "diploma" || RANK[have] >= RANK.graduate ? "maybe" : "no";
  if (need === "diploma") return have === "diploma" ? "yes" : RANK[have] >= RANK.graduate ? "maybe" : "no";
  if (need === "12th" && (have === "iti" || have === "diploma")) return have === "diploma" ? "maybe" : "no";
  return RANK[have] >= RANK[need] ? "yes" : "no";
}

export function evaluateJob(rule: JobRule, p: JobPerson): JobResult {
  if (rule.forAll) return { status: "yes", education: "yes", age: "yes", relaxed: 0 };
  const relaxed = rule.relax?.[p.category as "sc" | "st" | "obc"] ?? 0;
  const ageMax = rule.ageMax !== undefined ? rule.ageMax + relaxed : undefined;
  const age: JobFit = !p.age ? "maybe" : (rule.ageMin !== undefined && p.age < rule.ageMin) || (ageMax !== undefined && p.age > ageMax) ? "no" : "yes";
  const education = educationFit(p.education, rule.minEducation);
  const status: JobFit = age === "no" || education === "no" ? "no" : age === "maybe" || education === "maybe" ? "maybe" : "yes";
  return { status, education, age, ageMax, relaxed };
}
