import { ctcRange, eitcCredit, eitcIncomeLimit, ssiCountableIncome } from "../calc";
import type { Program, Reason } from "../types";

export const eitc: Program = {
  id: "eitc",
  category: "money",
  evaluate(h, { ruleset, annualEarned, children }) {
    if (annualEarned <= 0) return { status: "unlikely", reasons: [{ key: "eitc.noEarnings" }] };
    const credit = eitcCredit(ruleset, annualEarned, annualEarned, children, h.married);
    const limit = eitcIncomeLimit(ruleset, children, h.married);
    const age: Reason[] = children === 0 ? [{ key: "eitc.ageRule" }] : [];
    if (credit > 0) {
      return {
        status: "likely",
        reasons: [{ key: "eitc.estimate", params: { amount: credit, year: ruleset.eitc.taxYear } }, ...age, { key: "eitc.file" }],
        value: { low: credit, high: credit },
      };
    }
    return { status: "unlikely", reasons: [{ key: "eitc.over", params: { limit } }] };
  },
};

export const ctc: Program = {
  id: "ctc",
  category: "money",
  evaluate(h, { ruleset, annualEarned, annualIncome, childrenUnder17 }) {
    if (childrenUnder17 === 0) return { status: "unlikely", reasons: [{ key: "ctc.noKids" }] };
    const { low, high } = ctcRange(ruleset, annualEarned, annualIncome, childrenUnder17, h.married);
    if (high === 0) return { status: "unlikely", reasons: [{ key: "ctc.over" }] };
    const notes: Reason[] = [{ key: "ctc.ssn" }];
    if (annualEarned <= ruleset.ctc.earnedIncomeFloor) {
      return { status: "possibly", reasons: [{ key: "ctc.lowEarnings", params: { floor: ruleset.ctc.earnedIncomeFloor } }, ...notes] };
    }
    return {
      status: "likely",
      reasons: [{ key: "ctc.estimate", params: { low, high, kids: childrenUnder17, year: ruleset.ctc.taxYear } }, ...notes],
      value: { low, high },
    };
  },
};

export const freeTaxHelp: Program = {
  id: "free-tax-help",
  category: "money",
  evaluate(_h, { ruleset, annualIncome }) {
    const limit = ruleset.freeTaxHelpIncomeLimit;
    if (annualIncome <= limit) return { status: "likely", reasons: [{ key: "free-tax-help.under", params: { limit } }] };
    return { status: "unlikely", reasons: [{ key: "free-tax-help.over", params: { limit } }] };
  },
};

export const ssi: Program = {
  id: "ssi",
  category: "money",
  evaluate(h, { ruleset }) {
    if (!h.hasSenior65 && !h.hasDisability) return { status: "unlikely", reasons: [{ key: "ssi.notCategory" }] };
    if (h.receives.ssi) return { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
    const fbr = h.married ? ruleset.ssi.federalBenefitRateCouple : ruleset.ssi.federalBenefitRate;
    const countable = ssiCountableIncome(h.monthlyEarned, h.monthlyOther);
    if (countable >= fbr) return { status: "unlikely", reasons: [{ key: "ssi.over", params: { fbr } }] };
    const amount = fbr - countable;
    const reasons: Reason[] = [
      { key: "ssi.estimate", params: { amount } },
      { key: "ssi.resources", params: { limit: ruleset.ssi.resourceLimit } },
    ];
    if (!h.hasSenior65) reasons.push({ key: "ssi.disabilityReview" });
    // The person's own income and resources decide SSI, so a low-income senior is the clearest case.
    return { status: h.hasSenior65 ? "likely" : "possibly", reasons, value: { low: amount * 12, high: amount * 12 } };
  },
};

export const tanf: Program = {
  id: "tanf",
  category: "money",
  evaluate(h, { fplPercent, children }) {
    if (children === 0 && !h.pregnant) return { status: "unlikely", reasons: [{ key: "tanf.noKids" }] };
    if (h.receives.tanf) return { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
    if (fplPercent <= 50) return { status: "possibly", reasons: [{ key: "tanf.veryLow" }, { key: "tanf.rules" }] };
    return { status: "unlikely", reasons: [{ key: "tanf.over" }] };
  },
};
