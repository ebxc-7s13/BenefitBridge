import type { Scheme } from "../types";
import { already } from "./basics";

const notFarmer = { status: "unlikely" as const, reasons: [{ key: "farm.notFarmer" }] };

/** PM-KISAN: ₹6,000 a year to landholding farmer families, in three instalments. */
export const pmKisan: Scheme = {
  id: "pm-kisan",
  category: "farm",
  evaluate(h, { rules }) {
    if (!h.work.farmer) return notFarmer;
    if (h.receives.pmKisan) return already;
    if (h.landAcres <= 0) return { status: "unlikely", reasons: [{ key: "pm-kisan.landOwners" }] };
    if (h.incomeTaxPayer || h.govtEmployee) return { status: "unlikely", reasons: [{ key: "pm-kisan.excluded" }] };
    const amount = rules.pmKisanPerYear;
    return { status: "likely", reasons: [{ key: "pm-kisan.amount", params: { amount } }, { key: "pm-kisan.ekyc" }], value: { low: amount, high: amount } };
  },
};

/** Pradhan Mantri Kisan Maan-dhan Yojana: pension for small and marginal farmers. */
export const kisanMaandhan: Scheme = {
  id: "kisan-maandhan",
  category: "farm",
  evaluate(h, { rules, unorganised }) {
    if (!h.work.farmer) return notFarmer;
    if (h.landAcres <= 0 || h.landAcres > rules.kisanMaandhanMaxAcres) return { status: "unlikely", reasons: [{ key: "kisan-maandhan.small" }] };
    if (!unorganised || h.incomeTaxPayer) return { status: "unlikely", reasons: [{ key: "pm-sym.formal" }] };
    if (h.age && (h.age < 18 || h.age > 40)) return { status: "unlikely", reasons: [{ key: "common.age18to40" }] };
    return { status: h.age ? "likely" : "possibly", reasons: [{ key: "kisan-maandhan.pension" }] };
  },
};

/** Kisan Credit Card: cheap crop loans, 4% a year when repaid on time. */
export const kcc: Scheme = {
  id: "kcc",
  category: "farm",
  evaluate(h) {
    if (!h.work.farmer) return notFarmer;
    return { status: "likely", reasons: [{ key: "kcc.loan" }, { key: "kcc.tenants" }] };
  },
};

/** Pradhan Mantri Fasal Bima Yojana: crop insurance with a low farmer premium. */
export const pmfby: Scheme = {
  id: "pmfby",
  category: "farm",
  evaluate(h) {
    if (!h.work.farmer) return notFarmer;
    return { status: "likely", reasons: [{ key: "pmfby.premium" }, { key: "pmfby.deadline" }] };
  },
};
