import type { Evaluation, Reason } from "../../core";
import type { Scheme } from "../types";

export const already: Evaluation = { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
const no = (key: string, params?: Reason["params"]): Evaluation => ({ status: "unlikely", reasons: [{ key, params }] });

/** National Food Security Act ration card: free grain under PM Garib Kalyan Anna Yojana. */
export const ration: Scheme = {
  id: "ration",
  category: "food",
  evaluate(h, { bpl, nfsa }) {
    if (nfsa) {
      const why: Reason = h.rationCard === "aay" ? { key: "ration.aay" } : { key: "ration.phh", params: { kg: 5 * h.size } };
      return { status: "likely", reasons: [why, { key: "ration.onorc" }] };
    }
    const low = bpl || h.annualIncome <= 300_000;
    if (!low) return no("ration.over");
    return { status: "possibly", reasons: [{ key: h.rationCard === "other" ? "ration.upgrade" : "ration.apply" }, { key: "ration.stateRules" }] };
  },
};

/** Saksham Anganwadi and Poshan 2.0: food, check-ups and pre-school at the anganwadi. */
export const anganwadi: Scheme = {
  id: "anganwadi",
  category: "food",
  evaluate(h) {
    if (h.childrenUnder6 === 0 && !h.pregnant) return no("anganwadi.notCategory");
    return { status: "likely", reasons: [{ key: "anganwadi.open" }] };
  },
};

/** PM POSHAN: free hot meals in government and aided schools. */
export const midDayMeal: Scheme = {
  id: "mid-day-meal",
  category: "food",
  evaluate(h) {
    if (h.schoolChildren === 0) return no("mid-day-meal.noKids");
    return { status: "likely", reasons: [{ key: "mid-day-meal.govtSchool" }] };
  },
};

/** Pradhan Mantri Jan Dhan Yojana: a free basic bank account. */
export const janDhan: Scheme = {
  id: "jan-dhan",
  category: "security",
  evaluate(h) {
    if (h.hasBank) return no("jan-dhan.have");
    return { status: "likely", reasons: [{ key: "jan-dhan.open" }] };
  },
};
