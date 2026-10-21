import type { Rules } from "./types";

/**
 * Central government scheme figures in force on 2026-10-01.
 * State governments often add their own top-ups on pensions and housing.
 *
 * Add a new file for each update; never edit a published ruleset.
 */
export const rules2026: Rules = {
  version: "IN-2026.10",
  effectiveFrom: "2026-10-01",
  sources: [
    "https://www.myscheme.gov.in/",
    "https://pmkisan.gov.in/",
    "https://pmjay.gov.in/",
    "https://pmayg.dord.gov.in/",
    "https://pmay-urban.gov.in/",
    "https://pmsuryaghar.gov.in/",
    "https://pmuy.gov.in/",
    "https://nrega.dord.gov.in/",
    "https://nsap.nic.in/",
    "https://scholarships.gov.in/",
    "https://pmvishwakarma.gov.in/",
    "https://pmsvanidhi.mohua.gov.in/",
    "https://pmvbry.epfindia.gov.in/",
  ],
  hillyStates: ["AR", "AS", "MN", "ML", "MZ", "NL", "SK", "TR", "HP", "UK", "JK", "LA"],
  jsyLowPerformingStates: ["UP", "UK", "BR", "JH", "MP", "CG", "AS", "RJ", "OD", "JK"],
  pmKisanPerYear: 6_000,
  pmayGramin: { plains: 120_000, hilly: 130_000 },
  pmayUrbanBlc: 250_000,
  pmayUrbanIncome: { ews: 300_000, lig: 600_000, mig: 900_000 },
  suryaGhar: { firstTwoKwPerKw: 30_000, thirdKw: 18_000, max: 78_000 },
  pmmvy: { firstChild: 5_000, secondGirl: 6_000, incomeLimit: 800_000 },
  jsy: { lowRural: 1_400, lowUrban: 1_000, highRural: 700, highUrban: 600 },
  ruralJobsDays: 125,
  vishwakarmaToolkit: 15_000,
  firstJobIncentive: 15_000,
  pensions: { oldAge: 200, oldAge80: 500, widow: 300, disability: 300 },
  pmSymIncome: 15_000,
  vayoshriIncome: 15_000,
  adipFreeIncome: 22_500,
  adipHalfIncome: 30_000,
  scholarshipIncome: { sc: 250_000, st: 250_000, obc: 250_000, minority: 200_000, merit: 450_000, nmmss: 350_000 },
  internshipIncome: 800_000,
  insurance: { pmjjbyPremium: 436, pmsbyPremium: 20, cover: 200_000 },
  kisanMaandhanMaxAcres: 4.94, // 2 hectares
};
