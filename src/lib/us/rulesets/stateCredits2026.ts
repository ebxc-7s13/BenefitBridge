import type { StateCreditTable } from "../stateCredits";

/**
 * State earned income and child tax credits for tax year 2026 (returns filed in early 2027),
 * as published by October 2026. Where a 2026 figure wasn't final, the 2025 figure is used.
 * Child credits are always "possibly": most have income phase-outs and residency rules.
 *
 * Add a new file for each tax year; never edit a published table.
 */
export const stateCreditTable: StateCreditTable = {
  taxYear: 2026,
  sources: [
    "https://taxpolicycenter.org/sites/default/files/2026-07/state_eitc_rates.pdf",
    "https://www.ncsl.org/human-services/earned-income-tax-credit-overview",
    "https://itep.org/state-child-tax-credits-2025/",
    "https://itep.org/2026-state-legislative-sessions-child-tax-credit-eitc/",
    "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/states-and-local-governments-with-earned-income-tax-credit",
  ],
  states: {
    AK: { tax: { url: "https://dor.alaska.gov/" } },
    AL: { tax: { url: "https://www.revenue.alabama.gov/" } },
    AR: { tax: { url: "https://www.dfa.arkansas.gov/" } },
    AZ: { ctc: { tiers: [{ max: 100, ageUnder: 17 }], refundable: false }, tax: { url: "https://azdor.gov/" } },
    // CalEITC uses its own formula; the Young Child Tax Credit is one per return and needs CalEITC.
    CA: {
      eitc: { refundable: true },
      ctc: { tiers: [{ max: 1_189, ageUnder: 6 }], refundable: true, perReturn: true, incomeMax: 32_900 },
      tax: { url: "https://www.ftb.ca.gov/" },
    },
    // Family Affordability Tax Credit (2024 amounts; AGI limit about $96,000 for couples).
    CO: {
      eitc: { pct: 0.25, refundable: true },
      ctc: { tiers: [{ max: 3_200, ageUnder: 6 }, { max: 2_400, ageUnder: 17 }], refundable: true, incomeMax: 96_000 },
      tax: { url: "https://tax.colorado.gov/" },
    },
    CT: { eitc: { pct: 0.4, refundable: true }, tax: { url: "https://portal.ct.gov/drs" } },
    // OTR lists 85% for 2026–2028; the new DC Child Tax Credit starts in 2026.
    DC: {
      eitc: { pct: 0.85, refundable: true },
      ctc: { tiers: [{ max: 1_000, ageUnder: 18 }], refundable: true, phaseOut: true },
      tax: { url: "https://otr.cfo.dc.gov/" },
    },
    DE: { eitc: { pct: 0.045, refundable: true }, tax: { url: "https://revenue.delaware.gov/" } },
    FL: { tax: { url: "https://floridarevenue.com/" } },
    GA: { ctc: { tiers: [{ max: 250, ageUnder: 6 }], refundable: false }, tax: { url: "https://dor.georgia.gov/" } },
    HI: { eitc: { pct: 0.4, refundable: true }, tax: { url: "https://tax.hawaii.gov/" } },
    IA: { eitc: { pct: 0.15, refundable: true }, tax: { url: "https://revenue.iowa.gov/" } },
    // Idaho's child credit ended after tax year 2025.
    ID: { tax: { url: "https://tax.idaho.gov/" } },
    // The child credit is 40% of the Illinois EITC, one per return, for a child under 12.
    IL: {
      eitc: { pct: 0.2, refundable: true },
      ctc: { tiers: [{ max: 650, ageUnder: 12 }], refundable: true, perReturn: true, needsEitc: true },
      tax: { url: "https://tax.illinois.gov/" },
    },
    IN: { eitc: { pct: 0.1, refundable: true }, tax: { url: "https://www.in.gov/dor/" } },
    KS: { eitc: { pct: 0.17, refundable: true }, tax: { url: "https://www.ksrevenue.gov/" } },
    KY: { tax: { url: "https://revenue.ky.gov/" } },
    LA: { eitc: { pct: 0.05, refundable: true }, tax: { url: "https://revenue.louisiana.gov/" } },
    MA: {
      eitc: { pct: 0.4, refundable: true },
      ctc: { tiers: [{ max: 440, ageUnder: 13 }], refundable: true },
      tax: { url: "https://www.mass.gov/orgs/massachusetts-department-of-revenue" },
    },
    MD: {
      eitc: { pct: 0.45, refundable: true },
      ctc: { tiers: [{ max: 500, ageUnder: 6 }], refundable: true, incomeMax: 24_000 },
      tax: { url: "https://www.marylandcomptroller.gov/" },
    },
    ME: {
      eitc: { pct: 0.25, refundable: true },
      ctc: { tiers: [{ max: 610, ageUnder: 6 }, { max: 305, ageUnder: 17 }], refundable: true, phaseOut: true },
      tax: { url: "https://www.maine.gov/revenue/" },
    },
    MI: { eitc: { pct: 0.3, refundable: true }, tax: { url: "https://www.michigan.gov/treasury/" } },
    // Working Family Credit uses its own formula; both credits phase out together.
    MN: {
      eitc: { refundable: true },
      ctc: { tiers: [{ max: 1_750, ageUnder: 18 }], refundable: true, phaseOut: true },
      tax: { url: "https://www.revenue.state.mn.us/" },
    },
    MO: { eitc: { pct: 0.2, refundable: false }, tax: { url: "https://dor.mo.gov/" } },
    MS: { tax: { url: "https://www.dor.ms.gov/" } },
    MT: { eitc: { pct: 0.2, refundable: true }, tax: { url: "https://revenue.mt.gov/" } },
    NC: { tax: { url: "https://www.ncdor.gov/" } },
    ND: { tax: { url: "https://www.tax.nd.gov/" } },
    NE: { eitc: { pct: 0.1, refundable: true }, tax: { url: "https://revenue.nebraska.gov/" } },
    NH: { tax: { url: "https://www.revenue.nh.gov/" } },
    NJ: {
      eitc: { pct: 0.4, refundable: true },
      ctc: { tiers: [{ max: 1_250, ageUnder: 6 }], refundable: true, incomeMax: 80_000 },
      tax: { url: "https://www.nj.gov/treasury/taxation/" },
    },
    NM: {
      eitc: { pct: 0.25, refundable: true },
      ctc: { tiers: [{ max: 600, ageUnder: 17 }], refundable: true, phaseOut: true },
      tax: { url: "https://www.tax.newmexico.gov/" },
    },
    NV: { tax: { url: "https://tax.nv.gov/" } },
    // Empire State Child Credit: $1,000 under 4, $500 aged 4–16 from 2026.
    NY: {
      eitc: { pct: 0.3, refundable: true },
      ctc: { tiers: [{ max: 1_000, ageUnder: 4 }, { max: 500, ageUnder: 17 }], refundable: true, incomeMax: 110_000 },
      tax: { url: "https://www.tax.ny.gov/" },
    },
    OH: { eitc: { pct: 0.3, refundable: false }, tax: { url: "https://tax.ohio.gov/" } },
    OK: {
      eitc: { pct: 0.05, refundable: true },
      ctc: { tiers: [{ max: 110, ageUnder: 17 }], refundable: false, incomeMax: 100_000 },
      tax: { url: "https://oklahoma.gov/tax.html" },
    },
    // 14% of the federal EITC from 2026 (17% with a child under 3).
    OR: {
      eitc: { pct: 0.14, refundable: true },
      ctc: { tiers: [{ max: 1_050, ageUnder: 6 }], refundable: true, incomeMax: 31_550 },
      tax: { url: "https://www.oregon.gov/dor/" },
    },
    PA: { eitc: { pct: 0.1, refundable: true }, tax: { url: "https://www.pa.gov/agencies/revenue" } },
    RI: {
      eitc: { pct: 0.16, refundable: true },
      ctc: { tiers: [{ max: 330, ageUnder: 19 }], refundable: true, phaseOut: true },
      tax: { url: "https://tax.ri.gov/" },
    },
    SC: { eitc: { pct: 1.25, refundable: false }, tax: { url: "https://dor.sc.gov/" } },
    SD: { tax: { url: "https://dor.sd.gov/" } },
    TN: { tax: { url: "https://www.tn.gov/revenue.html" } },
    TX: { tax: { url: "https://comptroller.texas.gov/" } },
    UT: {
      eitc: { pct: 0.2, refundable: false },
      ctc: { tiers: [{ max: 1_000, ageUnder: 6 }], refundable: false, phaseOut: true },
      tax: { url: "https://tax.utah.gov/" },
    },
    VA: { eitc: { pct: 0.2, refundable: true }, tax: { url: "https://www.tax.virginia.gov/" } },
    VT: {
      eitc: { pct: 0.38, refundable: true },
      ctc: { tiers: [{ max: 1_000, ageUnder: 7 }], refundable: true, incomeMax: 175_000 },
      tax: { url: "https://tax.vermont.gov/" },
    },
    // Working Families Tax Credit: flat amounts, claimed from the Department of Revenue.
    WA: { eitc: { refundable: true }, tax: { url: "https://dor.wa.gov/" } },
    WI: { eitc: { pct: [0, 0.04, 0.11, 0.34], refundable: true }, tax: { url: "https://www.revenue.wi.gov/" } },
    WV: { tax: { url: "https://tax.wv.gov/" } },
    WY: { tax: { url: "https://revenue.wyo.gov/" } },
  },
};
