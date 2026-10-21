import type { Scheme } from "../types";
import { already } from "./basics";

const between = (age: number, min: number, max: number) => age >= min && age <= max;

/** Viksit Bharat – Guarantee for Rozgar and Ajeevika Mission (Gramin), which replaced MGNREGA on 1 July 2026. */
export const ruralJobs: Scheme = {
  id: "rural-jobs",
  category: "work",
  evaluate(_h, { rules, rural, adult }) {
    if (!rural) return { status: "unlikely", reasons: [{ key: "rural-jobs.ruralOnly" }] };
    if (!adult) return { status: "unlikely", reasons: [{ key: "common.adultsOnly" }] };
    return { status: "likely", reasons: [{ key: "rural-jobs.days", params: { days: rules.ruralJobsDays } }, { key: "rural-jobs.jobCard" }] };
  },
};

/** e-Shram card: the national register of unorganised workers. */
export const eshram: Scheme = {
  id: "eshram",
  category: "work",
  evaluate(h, { unorganised }) {
    if (h.receives.eshram) return already;
    const w = h.work;
    const unorganisedWork = w.worker || w.farmLabour || w.vendor || w.artisan || w.farmer || w.business;
    if (!unorganisedWork) return { status: "unlikely", reasons: [{ key: "eshram.notWorker" }] };
    if (!unorganised || h.incomeTaxPayer) return { status: "unlikely", reasons: [{ key: "eshram.formal" }] };
    if (h.age && !between(h.age, 16, 59)) return { status: "unlikely", reasons: [{ key: "eshram.age" }] };
    return { status: "likely", reasons: [{ key: "eshram.benefits" }] };
  },
};

/** Pradhan Mantri Shram Yogi Maan-dhan: ₹3,000 a month pension from 60 for unorganised workers. */
export const pmSym: Scheme = {
  id: "pm-sym",
  category: "security",
  evaluate(h, { rules, unorganised, monthlyIncome }) {
    const w = h.work;
    if (!(w.worker || w.farmLabour || w.vendor || w.artisan || w.homemaker || w.business)) {
      return { status: "unlikely", reasons: [{ key: "pm-sym.notWorker" }] };
    }
    if (!unorganised || h.incomeTaxPayer) return { status: "unlikely", reasons: [{ key: "pm-sym.formal" }] };
    if (h.age && !between(h.age, 18, 40)) return { status: "unlikely", reasons: [{ key: "common.age18to40" }] };
    const reasons = [{ key: "pm-sym.pension" }];
    if (!h.age) return { status: "possibly", reasons: [{ key: "common.age18to40" }, ...reasons] };
    if (monthlyIncome <= rules.pmSymIncome) return { status: "likely", reasons };
    return { status: "possibly", reasons: [{ key: "pm-sym.ownIncome", params: { limit: rules.pmSymIncome } }, ...reasons] };
  },
};

/** PM Vishwakarma: support for artisans in 18 traditional trades. */
export const vishwakarma: Scheme = {
  id: "vishwakarma",
  category: "work",
  evaluate(h, { rules, adult }) {
    if (!h.work.artisan) return { status: "unlikely", reasons: [{ key: "vishwakarma.notArtisan" }] };
    if (!adult) return { status: "unlikely", reasons: [{ key: "common.adultsOnly" }] };
    if (h.govtEmployee) return { status: "unlikely", reasons: [{ key: "vishwakarma.govt" }] };
    const toolkit = rules.vishwakarmaToolkit;
    return {
      status: "likely",
      reasons: [{ key: "vishwakarma.trades" }, { key: "vishwakarma.benefits", params: { toolkit } }],
      value: { low: toolkit, high: toolkit, once: true },
    };
  },
};

/** PM SVANidhi: working-capital loans for street vendors, restructured and extended to 2030. */
export const svanidhi: Scheme = {
  id: "svanidhi",
  category: "work",
  evaluate(h) {
    if (!h.work.vendor) return { status: "unlikely", reasons: [{ key: "svanidhi.notVendor" }] };
    return { status: "likely", reasons: [{ key: "svanidhi.loans" }, { key: "svanidhi.card" }] };
  },
};

/** Pradhan Mantri Mudra Yojana: collateral-free loans up to ₹20 lakh for small businesses. */
export const mudra: Scheme = {
  id: "mudra",
  category: "work",
  evaluate(h) {
    if (!h.work.business && !h.wantsLoan) return { status: "unlikely", reasons: [{ key: "mudra.noBusiness" }] };
    return { status: "likely", reasons: [{ key: "mudra.loans" }, { key: "mudra.bankDecides" }] };
  },
};

/** Prime Minister's Employment Generation Programme: subsidy on loans for new micro-enterprises. */
export const pmegp: Scheme = {
  id: "pmegp",
  category: "work",
  evaluate(h, { adult, rural, specialCategory }) {
    if (!h.wantsLoan) return { status: "unlikely", reasons: [{ key: "pmegp.noPlan" }] };
    if (!adult) return { status: "unlikely", reasons: [{ key: "common.adultsOnly" }] };
    const rate = specialCategory ? (rural ? 35 : 25) : rural ? 25 : 15;
    return { status: "possibly", reasons: [{ key: "pmegp.subsidy", params: { rate } }, { key: "pmegp.newOnly" }] };
  },
};

/** Skill India (PMKVY): free short courses with a certificate. */
export const skillIndia: Scheme = {
  id: "skill-india",
  category: "work",
  evaluate(h) {
    const w = h.work;
    if (!(w.jobseeker || w.student || w.homemaker || w.worker || w.farmLabour)) return { status: "unlikely", reasons: [{ key: "skill-india.notLooking" }] };
    if (h.age && !between(h.age, 15, 45)) return { status: "unlikely", reasons: [{ key: "skill-india.age" }] };
    return { status: "likely", reasons: [{ key: "skill-india.free" }] };
  },
};

/** PM Internship Scheme: 12 months in a top company with a monthly stipend. */
export const internship: Scheme = {
  id: "internship",
  category: "work",
  evaluate(h, { rules }) {
    if (!h.work.jobseeker && !h.work.student) return { status: "unlikely", reasons: [{ key: "internship.notLooking" }] };
    if (h.age && !between(h.age, 18, 25)) return { status: "unlikely", reasons: [{ key: "internship.age" }] };
    if (h.govtEmployee) return { status: "unlikely", reasons: [{ key: "internship.govtFamily" }] };
    if (h.annualIncome > rules.internshipIncome) return { status: "unlikely", reasons: [{ key: "internship.over", params: { limit: rules.internshipIncome } }] };
    return { status: "possibly", reasons: [{ key: "internship.stipend" }, { key: "internship.check" }] };
  },
};

/** Pradhan Mantri Viksit Bharat Rozgar Yojana, Part A: a bonus for a first job with EPF. */
export const firstJob: Scheme = {
  id: "first-job",
  category: "work",
  evaluate(h, { rules }) {
    if (!h.firstJob) return { status: "unlikely", reasons: [{ key: "first-job.notNew" }] };
    const max = rules.firstJobIncentive;
    return { status: "likely", reasons: [{ key: "first-job.incentive", params: { max } }], value: { low: 0, high: max, once: true } };
  },
};
