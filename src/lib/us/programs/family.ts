import type { Program } from "../types";

export const headStart: Program = {
  id: "head-start",
  category: "family",
  evaluate(h, { fplPercent }) {
    // Early Head Start also serves pregnant women.
    if (h.childrenUnder5 === 0 && !h.pregnant) return { status: "unlikely", reasons: [{ key: "head-start.noKids" }] };
    if (h.receives.snap || h.receives.tanf || h.receives.ssi || h.homeless) {
      return { status: "likely", reasons: [{ key: "head-start.categorical" }, { key: "head-start.seats" }] };
    }
    if (fplPercent <= 100) return { status: "likely", reasons: [{ key: "head-start.under" }, { key: "head-start.seats" }] };
    if (fplPercent <= 130) return { status: "possibly", reasons: [{ key: "head-start.near" }] };
    return { status: "unlikely", reasons: [{ key: "head-start.over" }] };
  },
};

export const childCare: Program = {
  id: "child-care",
  category: "family",
  evaluate(h, { fplPercent }) {
    if (h.childrenUnder5 + h.children5to16 === 0) return { status: "unlikely", reasons: [{ key: "child-care.noKids" }] };
    if (h.monthlyEarned <= 0) return { status: "possibly", reasons: [{ key: "child-care.workOrSchool" }, { key: "child-care.waitlist" }] };
    if (fplPercent <= 150) return { status: "likely", reasons: [{ key: "child-care.under" }, { key: "child-care.waitlist" }] };
    if (fplPercent <= 250) return { status: "possibly", reasons: [{ key: "child-care.stateLimit" }, { key: "child-care.waitlist" }] };
    return { status: "unlikely", reasons: [{ key: "child-care.over" }] };
  },
};
