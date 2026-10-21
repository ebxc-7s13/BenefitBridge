import type { Evaluation, Reason } from "../../core";
import type { Scheme } from "../types";
import { already } from "./basics";

const between = (age: number, min: number, max: number) => age >= min && age <= max;
const needBank = (hasBank: boolean): Reason[] => (hasBank ? [] : [{ key: "common.needBank" }]);

/** Atal Pension Yojana: guaranteed pension of ₹1,000–5,000 a month from 60. */
export const apy: Scheme = {
  id: "apy",
  category: "security",
  evaluate(h) {
    if (h.incomeTaxPayer) return { status: "unlikely", reasons: [{ key: "apy.taxpayer" }] };
    if (h.age && !between(h.age, 18, 40)) return { status: "unlikely", reasons: [{ key: "common.age18to40" }] };
    const reasons = [{ key: "apy.pension" }, ...needBank(h.hasBank)];
    return { status: h.age ? "likely" : "possibly", reasons: h.age ? reasons : [{ key: "common.age18to40" }, ...reasons] };
  },
};

/** Pradhan Mantri Jeevan Jyoti Bima Yojana: ₹2 lakh life cover for ₹436 a year. */
export const pmjjby: Scheme = {
  id: "pmjjby",
  category: "security",
  evaluate(h, { rules }) {
    if (h.age && !between(h.age, 18, 50)) return { status: "unlikely", reasons: [{ key: "pmjjby.age" }] };
    const { pmjjbyPremium: premium, cover } = rules.insurance;
    return { status: h.age ? "likely" : "possibly", reasons: [{ key: "pmjjby.cover", params: { premium, cover } }, ...needBank(h.hasBank)] };
  },
};

/** Pradhan Mantri Suraksha Bima Yojana: ₹2 lakh accident cover for ₹20 a year. */
export const pmsby: Scheme = {
  id: "pmsby",
  category: "security",
  evaluate(h, { rules }) {
    if (h.age && !between(h.age, 18, 70)) return { status: "unlikely", reasons: [{ key: "pmsby.age" }] };
    const { pmsbyPremium: premium, cover } = rules.insurance;
    return { status: h.age ? "likely" : "possibly", reasons: [{ key: "pmsby.cover", params: { premium, cover } }, ...needBank(h.hasBank)] };
  },
};

/** National Social Assistance Programme pensions are for families on the BPL list. */
function nsap(h: Parameters<Scheme["evaluate"]>[0], bpl: boolean, nfsa: boolean, reason: Reason, monthly: number): Evaluation {
  if (h.receives.pension) return already;
  const value = { low: monthly * 12, high: monthly * 12 };
  if (bpl) return { status: "likely", reasons: [reason, { key: "pension.stateTopUp" }], value };
  if (h.bpl === "unknown" && (nfsa || h.annualIncome <= 200_000)) {
    return { status: "possibly", reasons: [{ key: "pension.bplList" }, reason, { key: "pension.stateTopUp" }], value };
  }
  return { status: "unlikely", reasons: [{ key: "pension.bplOnly" }, { key: "pension.stateSchemes" }] };
}

export const oldAgePension: Scheme = {
  id: "old-age-pension",
  category: "security",
  evaluate(h, { rules, bpl, nfsa }) {
    if (!h.senior60) return { status: "unlikely", reasons: [{ key: "old-age-pension.age" }] };
    const { oldAge, oldAge80 } = rules.pensions;
    return nsap(h, bpl, nfsa, { key: "old-age-pension.amount", params: { amount: oldAge, amount80: oldAge80 } }, oldAge);
  },
};

export const widowPension: Scheme = {
  id: "widow-pension",
  category: "security",
  evaluate(h, { rules, bpl, nfsa }) {
    if (!h.widow) return { status: "unlikely", reasons: [{ key: "widow-pension.notWidow" }] };
    const amount = rules.pensions.widow;
    return nsap(h, bpl, nfsa, { key: "widow-pension.amount", params: { amount } }, amount);
  },
};

export const disabilityPension: Scheme = {
  id: "disability-pension",
  category: "security",
  evaluate(h, { rules, bpl, nfsa }) {
    if (h.disability !== "severe") return { status: "unlikely", reasons: [{ key: "disability-pension.severeOnly" }] };
    const amount = rules.pensions.disability;
    return nsap(h, bpl, nfsa, { key: "disability-pension.amount", params: { amount } }, amount);
  },
};

/** Rashtriya Vayoshri Yojana: free walking sticks, hearing aids, spectacles and more for seniors. */
export const vayoshri: Scheme = {
  id: "vayoshri",
  category: "security",
  evaluate(h, { rules, bpl, monthlyIncome }) {
    if (!h.senior60) return { status: "unlikely", reasons: [{ key: "vayoshri.age" }] };
    if (bpl || monthlyIncome <= rules.vayoshriIncome) return { status: "likely", reasons: [{ key: "vayoshri.devices", params: { limit: rules.vayoshriIncome } }] };
    return { status: "unlikely", reasons: [{ key: "vayoshri.over", params: { limit: rules.vayoshriIncome } }] };
  },
};

/** ADIP: free or half-price assistive devices for people with disabilities. */
export const adip: Scheme = {
  id: "adip",
  category: "security",
  evaluate(h, { rules, monthlyIncome }) {
    if (h.disability === "none") return { status: "unlikely", reasons: [{ key: "disability.none" }] };
    if (monthlyIncome <= rules.adipFreeIncome) return { status: "likely", reasons: [{ key: "adip.free", params: { limit: rules.adipFreeIncome } }] };
    if (monthlyIncome <= rules.adipHalfIncome) return { status: "likely", reasons: [{ key: "adip.half", params: { limit: rules.adipHalfIncome } }] };
    return { status: "unlikely", reasons: [{ key: "adip.over", params: { limit: rules.adipHalfIncome } }] };
  },
};

/** Unique Disability ID card: one card that unlocks disability benefits everywhere in India. */
export const udid: Scheme = {
  id: "udid",
  category: "security",
  evaluate(h) {
    if (h.disability === "none") return { status: "unlikely", reasons: [{ key: "disability.none" }] };
    return { status: "likely", reasons: [{ key: "udid.card" }] };
  },
};
