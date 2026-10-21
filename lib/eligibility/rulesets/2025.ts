import type { Ruleset } from "../types";

/**
 * 2025 HHS poverty guidelines. These also drive SNAP limits for FY2026
 * (Oct 2025 – Sep 2026).
 *
 * Add a new file for each annual update; never edit a published ruleset.
 */
export const ruleset2025: Ruleset = {
  version: "2025.1",
  effectiveFrom: "2025-01-15",
  sources: [
    "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
    "https://www.fns.usda.gov/snap/recipient/eligibility",
    "https://www.kff.org/status-of-state-medicaid-expansion-decisions/",
  ],
  povertyGuidelines: {
    base: { contiguous: 15_650, AK: 19_550, HI: 17_990 },
    perAdditionalPerson: { contiguous: 5_500, AK: 6_880, HI: 6_330 },
  },
  medicaidNonExpansionStates: ["AL", "FL", "GA", "KS", "MS", "SC", "TN", "TX", "WI", "WY"],
};
