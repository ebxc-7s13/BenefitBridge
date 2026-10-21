import type { Reason } from "../../core";
import type { Scheme } from "../types";
import { already } from "./basics";

const cover: Reason = { key: "pmjay.cover" };

/** Ayushman Bharat PM-JAY, including Ayushman Vay Vandana for everyone 70+. */
export const pmjay: Scheme = {
  id: "pmjay",
  category: "health",
  evaluate(h, { bpl, nfsa }) {
    if (h.receives.ayushman) return already;
    if (h.senior70) return { status: "likely", reasons: [{ key: "pmjay.senior70" }, cover] };
    if (h.rationCard === "aay") return { status: "likely", reasons: [{ key: "pmjay.aay" }, cover] };
    if (bpl || nfsa || h.annualIncome <= 250_000) return { status: "possibly", reasons: [{ key: "pmjay.checkList" }, cover] };
    return { status: "unlikely", reasons: [{ key: "pmjay.over" }, { key: "pmjay.senior70info" }] };
  },
};

/** Janani Suraksha Yojana: cash for giving birth in a government hospital. */
export const jsy: Scheme = {
  id: "jsy",
  category: "health",
  evaluate(h, { rules, rural, bpl, nfsa }) {
    if (!h.pregnant) return { status: "unlikely", reasons: [{ key: "jsy.notPregnant" }] };
    const low = rules.jsyLowPerformingStates.includes(h.state);
    const amount = low ? (rural ? rules.jsy.lowRural : rules.jsy.lowUrban) : rural ? rules.jsy.highRural : rules.jsy.highUrban;
    const value = { low: amount, high: amount, once: true };
    if (low) return { status: "likely", reasons: [{ key: "jsy.allMothers", params: { amount } }, { key: "jsy.govtHospital" }], value };
    if (bpl || nfsa || h.category === "sc" || h.category === "st") {
      return { status: "likely", reasons: [{ key: "jsy.bpl", params: { amount } }, { key: "jsy.govtHospital" }], value };
    }
    return { status: "unlikely", reasons: [{ key: "jsy.notCategory" }] };
  },
};

/** Pradhan Mantri Matru Vandana Yojana: maternity cash for the first child, and a second child if a girl. */
export const pmmvy: Scheme = {
  id: "pmmvy",
  category: "health",
  evaluate(h, { rules, bpl, nfsa }) {
    if (!h.pregnant) return { status: "unlikely", reasons: [{ key: "pmmvy.notPregnant" }] };
    const { firstChild, secondGirl, incomeLimit } = rules.pmmvy;
    const listed =
      h.category === "sc" ||
      h.category === "st" ||
      h.disability !== "none" ||
      bpl ||
      nfsa ||
      h.receives.ayushman ||
      h.receives.eshram ||
      h.receives.pmKisan ||
      h.annualIncome < incomeLimit;
    if (!listed) return { status: "unlikely", reasons: [{ key: "pmmvy.over", params: { limit: incomeLimit } }] };
    return {
      status: "likely",
      reasons: [{ key: "pmmvy.amounts", params: { firstChild, secondGirl } }, { key: "pmmvy.register" }],
      value: { low: firstChild, high: secondGirl, once: true },
    };
  },
};
