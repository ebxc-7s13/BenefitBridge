import { annualPovertyGuideline } from "../fpl";
import type { Household, Program, Reason } from "../types";

/** From 2027, expansion adults 19–64 must show 80 hours a month of work, school or service unless exempt. */
function medicaidWorkRule(h: Household, children: number): Reason[] {
  const exempt = h.pregnant || h.hasDisability || h.hasSenior65 || children > 0;
  return exempt ? [] : [{ key: "medicaid-adults.workRule" }];
}

export const medicaidAdults: Program = {
  id: "medicaid-adults",
  category: "health",
  evaluate(h, { fplPercent, nonExpansion, children }) {
    const pct = Math.round(fplPercent);
    if (h.receives.medicaid) return { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
    if (h.receives.ssi) return { status: "likely", reasons: [{ key: "medicaid-adults.ssi" }] };
    if (!nonExpansion && fplPercent <= 138) {
      return {
        status: "likely",
        reasons: [{ key: "medicaid-adults.expansion", params: { state: h.state, pct } }, ...medicaidWorkRule(h, children)],
      };
    }
    if ((h.hasSenior65 || h.hasDisability) && fplPercent <= 150) {
      return { status: "possibly", reasons: [{ key: "medicaid-adults.agedDisabled" }] };
    }
    if (nonExpansion && children > 0 && fplPercent <= 100) {
      return { status: "possibly", reasons: [{ key: "medicaid-adults.parents", params: { state: h.state } }] };
    }
    if (nonExpansion && fplPercent < 100) {
      return { status: "unlikely", reasons: [{ key: "medicaid-adults.gap", params: { state: h.state } }] };
    }
    return { status: "unlikely", reasons: [{ key: "medicaid-adults.over", params: { pct } }] };
  },
};

export const medicaidPregnancy: Program = {
  id: "medicaid-pregnancy",
  category: "health",
  evaluate(h, { fplPercent }) {
    const pct = Math.round(fplPercent);
    if (!h.pregnant) return { status: "unlikely", reasons: [{ key: "medicaid-pregnancy.notPregnant" }] };
    if (h.receives.medicaid) return { status: "likely", reasons: [{ key: "common.alreadyGet" }] };
    if (fplPercent <= 138) return { status: "likely", reasons: [{ key: "medicaid-pregnancy.under", params: { pct } }, { key: "medicaid-pregnancy.postpartum" }] };
    if (fplPercent <= 213) return { status: "possibly", reasons: [{ key: "medicaid-pregnancy.most", params: { pct } }, { key: "medicaid-pregnancy.postpartum" }] };
    return { status: "unlikely", reasons: [{ key: "medicaid-pregnancy.over", params: { pct } }] };
  },
};

export const medicaidChip: Program = {
  id: "medicaid-chip",
  category: "health",
  evaluate(_h, { fplPercent, children }) {
    const pct = Math.round(fplPercent);
    if (children === 0) return { status: "unlikely", reasons: [{ key: "medicaid-chip.noKids" }] };
    if (fplPercent <= 175) return { status: "likely", reasons: [{ key: "medicaid-chip.under", params: { pct } }] };
    if (fplPercent <= 300) return { status: "possibly", reasons: [{ key: "medicaid-chip.most", params: { pct } }] };
    return { status: "unlikely", reasons: [{ key: "medicaid-chip.over", params: { pct } }] };
  },
};

export const acaMarketplace: Program = {
  id: "aca-marketplace",
  category: "health",
  evaluate(h, { fplPercent, nonExpansion }) {
    const pct = Math.round(fplPercent);
    if (h.receives.medicaid || h.receives.medicare) return { status: "unlikely", reasons: [{ key: "aca-marketplace.covered" }] };
    if (!nonExpansion && fplPercent <= 138) return { status: "unlikely", reasons: [{ key: "aca-marketplace.medicaidInstead" }] };
    if (nonExpansion && fplPercent < 100) return { status: "unlikely", reasons: [{ key: "aca-marketplace.gap", params: { state: h.state } }] };
    if (fplPercent <= 400) {
      return { status: "likely", reasons: [{ key: "aca-marketplace.credit", params: { pct } }, { key: "aca-marketplace.enroll" }] };
    }
    return { status: "unlikely", reasons: [{ key: "aca-marketplace.over", params: { pct } }, { key: "aca-marketplace.enroll" }] };
  },
};

export const medicareExtraHelp: Program = {
  id: "medicare-extra-help",
  category: "health",
  evaluate(h, { ruleset, annualIncome }) {
    if (!h.hasSenior65 && !h.receives.medicare) return { status: "unlikely", reasons: [{ key: "medicare-extra-help.needsMedicare" }] };
    if (h.receives.medicaid || h.receives.ssi) return { status: "likely", reasons: [{ key: "medicare-extra-help.automatic" }] };
    // Extra Help counts only the person (or couple), not the whole household.
    const pct = (annualIncome / annualPovertyGuideline(ruleset, h.state, h.married ? 2 : 1)) * 100;
    const resources = h.married ? ruleset.medicareExtraHelp.resourceLimitCouple : ruleset.medicareExtraHelp.resourceLimit;
    const extra: Reason[] = [{ key: "medicare-extra-help.resources", params: { resources } }, { key: "medicare-extra-help.msp" }];
    if (pct <= 150) return { status: "likely", reasons: [{ key: "medicare-extra-help.under", params: { pct: Math.round(pct) } }, ...extra] };
    if (pct <= 165) return { status: "possibly", reasons: [{ key: "medicare-extra-help.close" }, ...extra] };
    return { status: "unlikely", reasons: [{ key: "medicare-extra-help.over" }] };
  },
};
