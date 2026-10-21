import { monthlyLimit } from "./fpl";
import type { Program } from "./types";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export const snap: Program = {
  id: "snap",
  name: "SNAP (food assistance)",
  summary: "Monthly money on an EBT card to buy groceries.",
  applyUrl: "https://www.fns.usda.gov/snap/state-directory",
  evaluate(h, { fplAnnual }) {
    const gross = monthlyLimit(fplAnnual, 130);
    const net = monthlyLimit(fplAnnual, 100);
    if (h.receives.tanf || h.receives.ssi) {
      return {
        status: "likely",
        reasons: ["Households getting TANF or SSI usually qualify for SNAP automatically."],
      };
    }
    if (h.monthlyGrossIncome <= gross) {
      return {
        status: "likely",
        reasons: [`Your income (${usd(h.monthlyGrossIncome)}/mo) is under the ${usd(gross)}/mo limit for a household of ${h.size}.`],
      };
    }
    if (h.hasSenior || h.hasDisability) {
      // Elderly/disabled households skip the gross test and only face the net-income test.
      return {
        status: "possibly",
        reasons: [
          "Households with someone 60+ or disabled are judged on income after deductions (like medical and housing costs).",
          `If your income after deductions is under about ${usd(net)}/mo, you may qualify.`,
        ],
      };
    }
    if (h.monthlyGrossIncome <= monthlyLimit(fplAnnual, 200)) {
      return {
        status: "possibly",
        reasons: [`Your income is above the ${usd(gross)}/mo federal limit, but many states use higher limits (up to 200% of poverty).`],
      };
    }
    return { status: "unlikely", reasons: [`Your income is above SNAP limits for a household of ${h.size}.`] };
  },
};

export const medicaidAdults: Program = {
  id: "medicaid-adults",
  name: "Medicaid (adults)",
  summary: "Free or very low-cost health coverage.",
  applyUrl: "https://www.healthcare.gov/medicaid-chip/",
  evaluate(h, { fplPercent, ruleset }) {
    if (h.receives.ssi) {
      return { status: "likely", reasons: ["In most states, people getting SSI qualify for Medicaid."] };
    }
    const expanded = !ruleset.medicaidNonExpansionStates.includes(h.state);
    if (expanded && fplPercent <= 138) {
      return {
        status: "likely",
        reasons: [`${h.state} covers adults with income up to 138% of the poverty level. You're at about ${Math.round(fplPercent)}%.`],
      };
    }
    if (h.pregnant && fplPercent <= 138) {
      return { status: "likely", reasons: ["Every state covers pregnant people with income up to at least 138% of poverty."] };
    }
    if (h.pregnant && fplPercent <= 200) {
      return { status: "possibly", reasons: ["Most states cover pregnant people up to 200% of poverty or higher."] };
    }
    if (!expanded && (h.hasChildUnder19 || h.hasDisability || h.hasSenior)) {
      return {
        status: "possibly",
        reasons: [`${h.state} hasn't expanded Medicaid, but parents, seniors and people with disabilities may still qualify.`],
      };
    }
    if (!expanded) {
      return {
        status: "unlikely",
        reasons: [`${h.state} hasn't expanded Medicaid for adults without children. Check HealthCare.gov for low-cost plans.`],
      };
    }
    return { status: "unlikely", reasons: ["Your income is above the adult Medicaid limit. You may get subsidies on HealthCare.gov."] };
  },
};

export const medicaidChip: Program = {
  id: "medicaid-chip",
  name: "Medicaid & CHIP (children)",
  summary: "Free or low-cost health coverage for kids under 19.",
  applyUrl: "https://www.insurekidsnow.gov/coverage/index.html",
  evaluate(h, { fplPercent }) {
    if (!h.hasChildUnder19) return { status: "unlikely", reasons: ["This program is for children under 19."] };
    if (fplPercent <= 200) {
      return { status: "likely", reasons: [`Every state covers children in families up to about 200% of poverty. You're at about ${Math.round(fplPercent)}%.`] };
    }
    if (fplPercent <= 300) {
      return { status: "possibly", reasons: ["Many states cover children in families up to 250–300% of poverty or higher."] };
    }
    return { status: "unlikely", reasons: ["Your income is above most states' limits, though a few states go higher."] };
  },
};

export const wic: Program = {
  id: "wic",
  name: "WIC (women, infants & children)",
  summary: "Healthy food, formula and nutrition support for pregnant people, new parents and kids under 5.",
  applyUrl: "https://www.fns.usda.gov/wic/wic-how-apply",
  evaluate(h, { fplAnnual }) {
    if (!h.pregnant && !h.hasChildUnder5) {
      return { status: "unlikely", reasons: ["WIC is for pregnant or postpartum people and children under 5."] };
    }
    if (h.receives.snap || h.receives.medicaid || h.receives.tanf) {
      return { status: "likely", reasons: ["Getting SNAP, Medicaid or TANF automatically meets WIC's income rule."] };
    }
    const limit = monthlyLimit(fplAnnual, 185);
    if (h.monthlyGrossIncome <= limit) {
      // A pregnant person counts as an extra household member for WIC, so this check is conservative.
      return { status: "likely", reasons: [`Your income is under WIC's ${usd(limit)}/mo limit.`] };
    }
    return { status: "unlikely", reasons: [`Your income is above WIC's ${usd(limit)}/mo limit.`] };
  },
};

export const liheap: Program = {
  id: "liheap",
  name: "LIHEAP (energy bill help)",
  summary: "Help paying heating and cooling bills, and emergency help if your power is about to be shut off.",
  applyUrl: "https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap",
  evaluate(h, { fplPercent }) {
    if (h.receives.snap || h.receives.ssi || h.receives.tanf) {
      return { status: "likely", reasons: ["Many states automatically qualify households getting SNAP, SSI or TANF."] };
    }
    if (fplPercent <= 150) {
      return { status: "likely", reasons: ["Your income is under 150% of poverty, which every state accepts."] };
    }
    if (fplPercent <= 250) {
      return { status: "possibly", reasons: ["Some states use 60% of state median income, which can be higher than 150% of poverty."] };
    }
    return { status: "unlikely", reasons: ["Your income is likely above your state's limit."] };
  },
};

export const lifeline: Program = {
  id: "lifeline",
  name: "Lifeline (phone & internet discount)",
  summary: "A monthly discount on phone or internet service.",
  applyUrl: "https://www.lifelinesupport.org/",
  evaluate(h, { fplPercent }) {
    if (h.receives.snap || h.receives.medicaid || h.receives.ssi) {
      return { status: "likely", reasons: ["Getting SNAP, Medicaid or SSI qualifies you for Lifeline."] };
    }
    if (fplPercent <= 135) {
      return { status: "likely", reasons: [`Your income is about ${Math.round(fplPercent)}% of poverty, under Lifeline's 135% limit.`] };
    }
    return { status: "unlikely", reasons: ["Your income is above Lifeline's 135% of poverty limit."] };
  },
};

export const programs: Program[] = [snap, medicaidAdults, medicaidChip, wic, liheap, lifeline];
