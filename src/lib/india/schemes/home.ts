import type { Scheme } from "../types";

/** PMAY-Gramin: money to build a pucca house in villages. */
export const pmayGramin: Scheme = {
  id: "pmay-g",
  category: "home",
  evaluate(h, { rules, rural, bpl, nfsa }) {
    if (!rural) return { status: "unlikely", reasons: [{ key: "pmay-g.ruralOnly" }] };
    if (h.home === "pucca") return { status: "unlikely", reasons: [{ key: "pmay.hasHouse" }] };
    if (h.govtEmployee || h.incomeTaxPayer) return { status: "unlikely", reasons: [{ key: "pmay.excluded" }] };
    const hilly = rules.hillyStates.includes(h.state);
    const amount = hilly ? rules.pmayGramin.hilly : rules.pmayGramin.plains;
    const value = { low: amount, high: amount, once: true };
    const reasons = [{ key: hilly ? "pmay-g.hilly" : "pmay-g.plains", params: { amount } }, { key: "pmay-g.survey" }];
    return { status: bpl || nfsa ? "likely" : "possibly", reasons, value };
  },
};

/** PMAY-Urban 2.0: help to build, buy or rent a home in towns and cities. */
export const pmayUrban: Scheme = {
  id: "pmay-u",
  category: "home",
  evaluate(h, { rules, rural }) {
    if (rural) return { status: "unlikely", reasons: [{ key: "pmay-u.urbanOnly" }] };
    if (h.home === "pucca") return { status: "unlikely", reasons: [{ key: "pmay.hasHouse" }] };
    const { ews, mig } = rules.pmayUrbanIncome;
    if (h.annualIncome <= ews) {
      const amount = rules.pmayUrbanBlc;
      return { status: "likely", reasons: [{ key: "pmay-u.ews", params: { limit: ews, amount } }], value: { low: 0, high: amount, once: true } };
    }
    if (h.annualIncome <= mig) return { status: "possibly", reasons: [{ key: "pmay-u.loanSubsidy", params: { limit: mig } }] };
    return { status: "unlikely", reasons: [{ key: "pmay-u.over", params: { limit: mig } }] };
  },
};

/** PM Surya Ghar Muft Bijli Yojana: rooftop solar subsidy and up to 300 free units a month. */
export const suryaGhar: Scheme = {
  id: "surya-ghar",
  category: "home",
  evaluate(h, { rules }) {
    if (!h.ownsHomeWithMeter) return { status: "unlikely", reasons: [{ key: "surya-ghar.needsHome" }] };
    const { firstTwoKwPerKw, max } = rules.suryaGhar;
    return {
      status: "likely",
      reasons: [{ key: "surya-ghar.subsidy", params: { perKw: firstTwoKwPerKw, max } }, { key: "surya-ghar.freePower" }],
      value: { low: firstTwoKwPerKw, high: max, once: true },
    };
  },
};

/** Pradhan Mantri Ujjwala Yojana: free LPG connection for women in poor households. */
export const ujjwala: Scheme = {
  id: "ujjwala",
  category: "home",
  evaluate(h, { adult, bpl, nfsa }) {
    if (h.hasLpg) return { status: "unlikely", reasons: [{ key: "ujjwala.hasLpg" }] };
    const poor = bpl || nfsa || h.category === "sc" || h.category === "st" || h.annualIncome <= 250_000;
    if (!poor) return { status: "unlikely", reasons: [{ key: "ujjwala.over" }] };
    const reasons = [{ key: "ujjwala.free" }, { key: "ujjwala.subsidy" }];
    if (h.gender === "female" && adult) return { status: "likely", reasons };
    return { status: "possibly", reasons: [{ key: "ujjwala.womanName" }, ...reasons] };
  },
};
