import { snapBudget } from "../calc";
import { annualLimit, annualPovertyGuideline, monthlyLimit } from "../fpl";
import type { Program, Reason } from "../types";

export const snap: Program = {
  id: "snap",
  category: "food",
  evaluate(h, ctx) {
    if (h.receives.snap) return { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
    const { ruleset, fplAnnual, children } = ctx;
    const grossLimit = monthlyLimit(fplAnnual, 130);
    const netLimit = monthlyLimit(fplAnnual, 100);
    const broadLimit = monthlyLimit(fplAnnual, 200);
    const elderlyOrDisabled = h.hasSenior60 || h.hasDisability;
    const categorical = h.receives.tanf || h.receives.ssi;
    const { gross, net, benefit } = snapBudget(h, ruleset);
    // Eligible 1–2 person households always get at least the minimum benefit.
    const amount = h.size <= 2 ? Math.max(benefit, ruleset.snap.minimumBenefit) : benefit;
    const passesNet = net <= netLimit;

    const notes: Reason[] = [];
    if (children === 0 && !h.hasDisability && !h.pregnant && !h.hasSenior65) notes.push({ key: "snap.workRule" });
    const estimate: Reason = { key: "snap.estimate", params: { amount } };
    const value = { low: amount * 12, high: amount * 12 };

    if (categorical && amount > 0) {
      return { status: "likely", reasons: [{ key: "snap.categorical" }, estimate, ...notes], value };
    }
    if (amount > 0 && passesNet && (elderlyOrDisabled || gross <= grossLimit)) {
      const why: Reason = elderlyOrDisabled
        ? { key: "snap.seniorNet", params: { net, netLimit } }
        : { key: "snap.underGross", params: { gross, grossLimit, size: h.size } };
      return { status: "likely", reasons: [why, estimate, ...notes], value };
    }
    if (amount > 0 && passesNet && gross <= broadLimit) {
      return { status: "possibly", reasons: [{ key: "snap.broadState", params: { grossLimit, broadLimit } }, estimate, ...notes], value };
    }
    return { status: "unlikely", reasons: [{ key: "snap.over", params: { grossLimit, size: h.size } }] };
  },
};

export const wic: Program = {
  id: "wic",
  category: "food",
  evaluate(h, ctx) {
    if (!h.pregnant && h.childrenUnder5 === 0) return { status: "unlikely", reasons: [{ key: "wic.notCategory" }] };
    if (h.receives.snap || h.receives.medicaid || h.receives.tanf) {
      return { status: "likely", reasons: [{ key: "wic.adjunct" }] };
    }
    // A pregnant woman counts as two people for WIC income limits.
    const size = h.size + (h.pregnant ? 1 : 0);
    const limit = monthlyLimit(annualPovertyGuideline(ctx.ruleset, h.state, size), 185);
    if (ctx.monthlyIncome <= limit) return { status: "likely", reasons: [{ key: "wic.under", params: { limit } }] };
    return { status: "unlikely", reasons: [{ key: "wic.over", params: { limit } }] };
  },
};

export const schoolMeals: Program = {
  id: "school-meals",
  category: "food",
  evaluate(h, ctx) {
    const schoolAge = h.children5to16 + h.children17to18;
    if (schoolAge === 0) return { status: "unlikely", reasons: [{ key: "school-meals.noKids" }] };
    if (h.receives.snap || h.receives.tanf) return { status: "likely", reasons: [{ key: "school-meals.direct" }] };
    if (h.homeless) return { status: "likely", reasons: [{ key: "school-meals.homeless" }] };
    const free = annualLimit(ctx.fplAnnual, 130);
    const reduced = annualLimit(ctx.fplAnnual, 185);
    if (ctx.annualIncome <= free) return { status: "likely", reasons: [{ key: "school-meals.free", params: { limit: free } }] };
    if (ctx.annualIncome <= reduced) {
      return { status: "likely", reasons: [{ key: "school-meals.reduced", params: { limit: reduced } }] };
    }
    return { status: "unlikely", reasons: [{ key: "school-meals.over", params: { limit: reduced } }, { key: "school-meals.universal" }] };
  },
};
