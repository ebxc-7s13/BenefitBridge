import { rank } from "../core";
import { rules2026 } from "./rules2026";
import { anganwadi, janDhan, midDayMeal, ration } from "./schemes/basics";
import { nmmss, scholarshipCategory, scholarshipMerit, shg, sukanya } from "./schemes/family";
import { kcc, kisanMaandhan, pmfby, pmKisan } from "./schemes/farm";
import { jsy, pmjay, pmmvy } from "./schemes/health";
import { pmayGramin, pmayUrban, suryaGhar, ujjwala } from "./schemes/home";
import { adip, apy, disabilityPension, oldAgePension, pmjjby, pmsby, udid, vayoshri, widowPension } from "./schemes/security";
import { eshram, firstJob, internship, mudra, pmegp, pmSym, ruralJobs, skillIndia, svanidhi, vishwakarma } from "./schemes/work";
import { evaluateStateScheme } from "./stateRules";
import { stateSchemes } from "./stateSchemes";
import type { Context, InHousehold, Rules, Scheme, SchemeId, SchemeResult } from "./types";

export const currentRules = rules2026;

export const schemes: Scheme[] = [
  ration, anganwadi, midDayMeal,
  pmjay, jsy, pmmvy,
  pmayGramin, pmayUrban, suryaGhar, ujjwala,
  ruralJobs, eshram, vishwakarma, svanidhi, mudra, pmegp, skillIndia, internship, firstJob,
  pmKisan, kisanMaandhan, kcc, pmfby,
  oldAgePension, widowPension, disabilityPension, apy, pmSym, pmjjby, pmsby, janDhan, vayoshri, adip, udid,
  sukanya, shg, scholarshipCategory, scholarshipMerit, nmmss,
];

export const schemeById = Object.fromEntries(schemes.map((s) => [s.id, s])) as Record<SchemeId, Scheme>;

/** Category of any scheme, central or state. */
export function categoryOf(id: string): string {
  return (schemeById[id as SchemeId] ?? stateSchemes.find((s) => s.id === id))?.category ?? "security";
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const count = (n: number) => Math.floor(clean(n));

/** Coerce user input into a consistent household. */
export function normalize(h: InHousehold): InHousehold {
  const childrenUnder6 = count(h.childrenUnder6);
  const girlsUnder10 = count(h.girlsUnder10);
  const schoolChildren = count(h.schoolChildren);
  return {
    ...h,
    age: Math.min(120, count(h.age)),
    childrenUnder6,
    girlsUnder10,
    schoolChildren,
    // Children counted in different questions can overlap, so the largest group sets the minimum size.
    size: Math.max(1, count(h.size), Math.max(childrenUnder6, girlsUnder10, schoolChildren) + 1),
    senior60: h.senior60 || h.senior70,
    annualIncome: clean(h.annualIncome),
    landAcres: clean(h.landAcres),
  };
}

export function buildContext(h: InHousehold, rules: Rules): Context {
  return {
    rules,
    monthlyIncome: h.annualIncome / 12,
    adult: h.age === 0 || h.age >= 18,
    rural: h.area !== "urban",
    bpl: h.bpl === "yes" || h.rationCard === "aay",
    nfsa: h.rationCard === "aay" || h.rationCard === "phh",
    unorganised: !h.formalJob,
    specialCategory: h.category === "sc" || h.category === "st" || h.category === "obc" || h.minority || h.gender === "female" || h.disability !== "none",
  };
}

export interface Result extends Omit<SchemeResult, "programId"> {
  programId: string;
  /** Set for a state or UT scheme. */
  state?: string;
}

/** Central schemes plus the schemes of the household's own state. */
export function screen(household: InHousehold, rules: Rules = currentRules, list: Scheme[] = schemes): Result[] {
  const h = normalize(household);
  const ctx = buildContext(h, rules);
  const central: Result[] = list.map((s) => ({ programId: s.id, ...s.evaluate(h, ctx) }));
  const state: Result[] = stateSchemes.filter((s) => s.state === h.state).map((s) => ({ programId: s.id, state: s.state, ...evaluateStateScheme(s, h) }));
  return rank([...central, ...state]);
}

export function emptyHousehold(): InHousehold {
  return {
    state: "",
    area: "",
    size: 1,
    age: 0,
    gender: "",
    childrenUnder6: 0,
    girlsUnder10: 0,
    schoolChildren: 0,
    collegeStudent: false,
    pregnant: false,
    senior60: false,
    senior70: false,
    disability: "none",
    widow: false,
    category: "",
    minority: false,
    annualIncome: 0,
    incomeTaxPayer: false,
    govtEmployee: false,
    formalJob: false,
    rationCard: "none",
    bpl: "unknown",
    hasBank: true,
    education: "",
    work: { farmer: false, farmLabour: false, worker: false, vendor: false, artisan: false, business: false, salaried: false, student: false, jobseeker: false, homemaker: false },
    landAcres: 0,
    firstJob: false,
    wantsLoan: false,
    home: "",
    ownsHomeWithMeter: false,
    hasLpg: true,
    receives: { pmKisan: false, ayushman: false, eshram: false, pension: false },
  };
}
