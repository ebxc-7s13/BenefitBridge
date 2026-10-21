import type { Ruleset } from "../types";

/**
 * Figures in force on 2026-10-01:
 * - 2026 HHS poverty guidelines (effective 2026-01-13)
 * - SNAP FY2027 cost-of-living adjustments (2026-10-01 to 2027-09-30)
 * - Tax year 2026 EITC / CTC (Rev. Proc. 2025-32; P.L. 119-21)
 * - 2026 SSI federal benefit rate and Medicare Extra Help resource limits
 *
 * Add a new file for each update; never edit a published ruleset.
 */
export const ruleset2026: Ruleset = {
  version: "2026.10",
  effectiveFrom: "2026-10-01",
  sources: [
    "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
    "https://www.fns.usda.gov/snap/allotment/cola",
    "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
    "https://www.ssa.gov/oact/cola/SSI.html",
    "https://www.kff.org/affordable-care-act/state-indicator/state-activity-around-expanding-medicaid-under-the-affordable-care-act/",
  ],
  povertyGuidelines: {
    year: 2026,
    base: { contiguous: 15_960, AK: 19_950, HI: 18_360 },
    perAdditionalPerson: { contiguous: 5_680, AK: 7_100, HI: 6_530 },
  },
  snap: {
    fiscalYear: 2027,
    maxAllotment: [306, 562, 808, 1_023, 1_217, 1_463, 1_616, 1_841],
    maxAllotmentPerAdditional: 225,
    standardDeduction: [217, 217, 217, 229, 268, 308],
    excessShelterCap: 769,
    minimumBenefit: 25,
    earnedIncomeDeduction: 0.2,
    medicalDeductionFloor: 35,
  },
  eitc: {
    taxYear: 2026,
    maxCredit: [664, 4_427, 7_316, 8_231],
    phaseInRate: [0.0765, 0.34, 0.4, 0.45],
    phaseOutRate: [0.0765, 0.1598, 0.2106, 0.2106],
    phaseOutStart: [10_860, 23_890, 23_890, 23_890],
    phaseOutStartMarried: [18_140, 31_160, 31_160, 31_160],
  },
  ctc: {
    taxYear: 2026,
    perChild: 2_200,
    refundablePerChild: 1_700,
    earnedIncomeFloor: 2_500,
    refundableRate: 0.15,
    phaseOutStart: 200_000,
    phaseOutStartMarried: 400_000,
  },
  ssi: { year: 2026, federalBenefitRate: 994, federalBenefitRateCouple: 1_491, resourceLimit: 2_000 },
  medicareExtraHelp: { resourceLimit: 18_090, resourceLimitCouple: 36_100 },
  freeTaxHelpIncomeLimit: 69_000,
  medicaidNonExpansionStates: ["AL", "FL", "GA", "KS", "MS", "SC", "TN", "TX", "WI", "WY"],
};
