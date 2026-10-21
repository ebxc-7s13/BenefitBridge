import type { Program } from "../types";

const LIFELINE_MONTHLY = 9.25;

export const liheap: Program = {
  id: "liheap",
  category: "home",
  evaluate(h, { fplPercent }) {
    if (h.receives.snap || h.receives.ssi || h.receives.tanf) return { status: "likely", reasons: [{ key: "liheap.categorical" }] };
    if (fplPercent <= 150) return { status: "likely", reasons: [{ key: "liheap.under" }] };
    if (fplPercent <= 250) return { status: "possibly", reasons: [{ key: "liheap.stateLimit" }] };
    return { status: "unlikely", reasons: [{ key: "liheap.over" }] };
  },
};

export const lifeline: Program = {
  id: "lifeline",
  category: "home",
  evaluate(h, { fplPercent }) {
    const value = { low: LIFELINE_MONTHLY * 12, high: LIFELINE_MONTHLY * 12 };
    if (h.receives.snap || h.receives.medicaid || h.receives.ssi) {
      return { status: "likely", reasons: [{ key: "lifeline.categorical" }], value };
    }
    if (fplPercent <= 135) {
      return { status: "likely", reasons: [{ key: "lifeline.under", params: { pct: Math.round(fplPercent) } }], value };
    }
    return { status: "unlikely", reasons: [{ key: "lifeline.over" }] };
  },
};

export const housingVoucher: Program = {
  id: "housing-voucher",
  category: "home",
  evaluate(h, { fplPercent }) {
    if (h.homeless) return { status: "possibly", reasons: [{ key: "housing-voucher.homeless" }, { key: "housing-voucher.waitlist" }] };
    if (fplPercent <= 150) return { status: "possibly", reasons: [{ key: "housing-voucher.under" }, { key: "housing-voucher.waitlist" }] };
    return { status: "unlikely", reasons: [{ key: "housing-voucher.over" }] };
  },
};
