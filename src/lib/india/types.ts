import type { Evaluation } from "../core";

/** Everything the India questionnaire asks. Money is in rupees. */
export interface InHousehold {
  /** State or union territory code, e.g. "UP". */
  state: string;
  area: "rural" | "urban" | "";
  size: number;
  /** Age of the person answering (0 = not given). */
  age: number;
  gender: "female" | "male" | "other" | "";
  childrenUnder6: number;
  girlsUnder10: number;
  /** Children studying in classes 1–12. */
  schoolChildren: number;
  /** Someone is in college, ITI, diploma or class 11–12. */
  collegeStudent: boolean;
  /** Someone is pregnant or breastfeeding. */
  pregnant: boolean;
  senior60: boolean;
  senior70: boolean;
  /** "some" = certified 40% or more; "severe" = 80% or more. */
  disability: "none" | "some" | "severe";
  /** A widow aged 40 or more lives in the household. */
  widow: boolean;
  category: "general" | "obc" | "sc" | "st" | "";
  minority: boolean;
  /** Total family income in a year, from all sources. */
  annualIncome: number;
  incomeTaxPayer: boolean;
  govtEmployee: boolean;
  /** The person answering is covered by EPF, ESIC or NPS through a job. */
  formalJob: boolean;
  rationCard: "none" | "aay" | "phh" | "other";
  bpl: "yes" | "no" | "unknown";
  hasBank: boolean;
  /** Highest education, asked on the jobs page (not used for schemes). */
  education?: "" | "none" | "8th" | "10th" | "12th" | "iti" | "diploma" | "graduate" | "postgraduate";
  work: {
    farmer: boolean;
    farmLabour: boolean;
    worker: boolean;
    vendor: boolean;
    artisan: boolean;
    business: boolean;
    salaried: boolean;
    student: boolean;
    jobseeker: boolean;
    homemaker: boolean;
  };
  /** Farmland owned by the family, in acres. */
  landAcres: number;
  /** Started a first job with EPF (PF) on or after 1 August 2025. */
  firstJob: boolean;
  wantsLoan: boolean;
  home: "pucca" | "kutcha" | "none" | "";
  /** Owns the home and has its own electricity connection. */
  ownsHomeWithMeter: boolean;
  hasLpg: boolean;
  receives: {
    pmKisan: boolean;
    ayushman: boolean;
    eshram: boolean;
    pension: boolean;
  };
}

export type SchemeId =
  | "ration"
  | "anganwadi"
  | "mid-day-meal"
  | "pmjay"
  | "jsy"
  | "pmmvy"
  | "pmay-g"
  | "pmay-u"
  | "surya-ghar"
  | "ujjwala"
  | "rural-jobs"
  | "eshram"
  | "pm-sym"
  | "vishwakarma"
  | "svanidhi"
  | "mudra"
  | "pmegp"
  | "skill-india"
  | "internship"
  | "first-job"
  | "pm-kisan"
  | "kisan-maandhan"
  | "kcc"
  | "pmfby"
  | "apy"
  | "pmjjby"
  | "pmsby"
  | "jan-dhan"
  | "old-age-pension"
  | "widow-pension"
  | "disability-pension"
  | "vayoshri"
  | "adip"
  | "udid"
  | "sukanya"
  | "scholarship-category"
  | "scholarship-merit"
  | "nmmss"
  | "shg";

export type Category = "food" | "health" | "home" | "work" | "farm" | "security" | "family" | "education";

export interface Rules {
  version: string;
  effectiveFrom: string;
  sources: string[];
  /** States and UTs where PMAY-G pays the higher hilly/difficult-area amount. */
  hillyStates: string[];
  /** Low-performing states where every mother delivering in a public facility gets JSY. */
  jsyLowPerformingStates: string[];
  pmKisanPerYear: number;
  pmayGramin: { plains: number; hilly: number };
  pmayUrbanBlc: number;
  pmayUrbanIncome: { ews: number; lig: number; mig: number };
  suryaGhar: { firstTwoKwPerKw: number; thirdKw: number; max: number };
  pmmvy: { firstChild: number; secondGirl: number; incomeLimit: number };
  jsy: { lowRural: number; lowUrban: number; highRural: number; highUrban: number };
  ruralJobsDays: number;
  vishwakarmaToolkit: number;
  firstJobIncentive: number;
  pensions: { oldAge: number; oldAge80: number; widow: number; disability: number };
  /** Monthly income limits. */
  pmSymIncome: number;
  vayoshriIncome: number;
  adipFreeIncome: number;
  adipHalfIncome: number;
  /** Annual family income limits. */
  scholarshipIncome: { sc: number; st: number; obc: number; minority: number; merit: number; nmmss: number };
  internshipIncome: number;
  insurance: { pmjjbyPremium: number; pmsbyPremium: number; cover: number };
  kisanMaandhanMaxAcres: number;
}

export interface Context {
  rules: Rules;
  monthlyIncome: number;
  adult: boolean;
  rural: boolean;
  bpl: boolean;
  /** Holds an AAY or priority (PHH) ration card. */
  nfsa: boolean;
  /** Works outside formal employment (no EPF/ESIC/NPS job). */
  unorganised: boolean;
  /** SC, ST, OBC, minority, woman or person with a disability: groups many schemes favour. */
  specialCategory: boolean;
}

export interface Scheme {
  id: SchemeId;
  category: Category;
  evaluate(h: InHousehold, ctx: Context): Evaluation;
}

export interface SchemeResult extends Evaluation {
  programId: SchemeId;
}
