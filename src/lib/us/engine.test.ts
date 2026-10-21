import { describe, expect, it } from "vitest";
import { ctcRange, eitcCredit, eitcIncomeLimit, snapBudget, ssiCountableIncome } from "./calc";
import { emptyHousehold, normalize, programs, screen, totalValue } from "./engine";
import { annualLimit, annualPovertyGuideline, monthlyLimit } from "./fpl";
import { ruleset2026 as r } from "./rulesets/2026";
import type { Household, ProgramId } from "./types";

const base: Household = { ...emptyHousehold(), state: "CA" };
const make = (h: Partial<Household>): Household => ({ ...base, ...h });
const result = (h: Partial<Household>, id: ProgramId) => screen(make(h)).find((x) => x.programId === id)!;
const statusOf = (h: Partial<Household>, id: ProgramId) => result(h, id).status;
const fpl = (size: number, state = "CA") => annualPovertyGuideline(r, state, size);

describe("2026 poverty guidelines", () => {
  it("matches the published HHS table", () => {
    expect([1, 2, 3, 4].map((n) => fpl(n))).toEqual([15_960, 21_640, 27_320, 33_000]);
    expect([1, 2, 3, 4].map((n) => fpl(n, "AK"))).toEqual([19_950, 27_050, 34_150, 41_250]);
    expect([1, 2, 3, 4].map((n) => fpl(n, "HI"))).toEqual([18_360, 24_890, 31_420, 37_950]);
  });

  it("reproduces published limits derived from it", () => {
    // Lifeline 135% (USAC 2026 table)
    expect([1, 2, 3, 4].map((n) => annualLimit(fpl(n), 135))).toEqual([21_546, 29_214, 36_882, 44_550]);
    // School meals 2026–27: free 130%, reduced 185% (USDA)
    expect(annualLimit(fpl(1), 130)).toBe(20_748);
    expect(annualLimit(fpl(1), 185)).toBe(29_526);
    expect(annualLimit(fpl(4), 130)).toBe(42_900);
    expect(annualLimit(fpl(4), 185)).toBe(61_050);
    // SNAP FY2027 gross limit for 4
    expect(monthlyLimit(fpl(4), 130)).toBe(3_575);
  });
});

describe("SNAP budget (FY2027)", () => {
  it("gives the maximum allotment with no income", () => {
    expect(snapBudget(make({ size: 1 }), r).benefit).toBe(306);
    expect(snapBudget(make({ size: 4 }), r).benefit).toBe(1_023);
    expect(snapBudget(make({ size: 9 }), r).benefit).toBe(1_841 + 225);
  });

  it("follows the federal budgeting steps", () => {
    // 3 people, $1,500 wages, $1,000 rent, $200 utilities.
    // adjusted = 1500 − 300 − 217 = 983; excess shelter = 1200 − 491.5 = 708.5 → net = 274.5 → 275 (rounded)
    // benefit = 808 − ceil(0.3 × 275) = 808 − 83 = 725
    const h = make({ size: 3, monthlyEarned: 1_500, expenses: { rent: 1_000, utilities: 200, childCare: 0, medical: 0 } });
    expect(snapBudget(h, r)).toMatchObject({ net: 275, benefit: 725 });
  });

  it("caps the shelter deduction except for seniors and people with disabilities", () => {
    const expenses = { rent: 3_000, utilities: 0, childCare: 0, medical: 0 };
    const capped = snapBudget(make({ size: 1, monthlyOther: 1_200, expenses }), r);
    const uncapped = snapBudget(make({ size: 1, monthlyOther: 1_200, expenses, hasSenior60: true }), r);
    expect(capped.net).toBe(Math.round(1_200 - 217 - 769));
    expect(uncapped.net).toBe(0);
  });
});

describe("SNAP eligibility", () => {
  it("is likely under the gross and net limits", () => {
    expect(statusOf({ size: 3, monthlyEarned: 2_000 }, "snap")).toBe("likely");
  });
  it("is possibly between 130% and 200% (states with broader limits)", () => {
    const h = { size: 3, monthlyEarned: 3_200, expenses: { rent: 1_600, utilities: 250, childCare: 400, medical: 0 } };
    expect(statusOf(h, "snap")).toBe("possibly");
  });
  it("is unlikely at high income", () => {
    expect(statusOf({ size: 1, monthlyEarned: 5_000 }, "snap")).toBe("unlikely");
  });
  it("gives the minimum benefit to small eligible households", () => {
    const res = result({ size: 1, monthlyOther: 1_200 }, "snap");
    expect(res.status).toBe("likely");
    expect(res.value?.low).toBe(25 * 12);
  });
  it("warns adults without children about the work rule", () => {
    expect(result({ size: 1 }, "snap").reasons.map((x) => x.key)).toContain("snap.workRule");
    expect(result({ size: 2, childrenUnder5: 1 }, "snap").reasons.map((x) => x.key)).not.toContain("snap.workRule");
  });
});

describe("EITC (tax year 2026)", () => {
  it("reaches the published maximum credits", () => {
    expect([0, 1, 2, 3].map((k) => eitcCredit(r, 20_000, 20_000, k, false))).toEqual([0, 4_427, 7_316, 8_231]);
    expect(eitcCredit(r, 9_000, 9_000, 0, false)).toBe(664);
  });
  it("phases out at the published completed-phaseout amounts", () => {
    expect([0, 1, 2, 3].map((k) => eitcIncomeLimit(r, k, false))).toEqual([19_540, 51_593, 58_629, 62_974]);
    expect(eitcIncomeLimit(r, 1, true)).toBe(58_863);
    expect(eitcCredit(r, 51_600, 51_600, 1, false)).toBe(0);
  });
});

describe("Child Tax Credit (2026)", () => {
  it("returns the refundable part as the low end", () => {
    expect(ctcRange(r, 12_500, 12_500, 2, false)).toEqual({ low: 1_500, high: 4_400 });
    expect(ctcRange(r, 40_000, 40_000, 2, false)).toEqual({ low: 3_400, high: 4_400 });
  });
  it("phases out above $200,000", () => {
    expect(ctcRange(r, 210_000, 210_000, 1, false).high).toBe(1_700);
  });
});

describe("SSI", () => {
  it("applies the $20 and $65 + half exclusions", () => {
    expect(ssiCountableIncome(0, 500)).toBe(480);
    expect(ssiCountableIncome(1_085, 0)).toBe(500);
  });
  it("estimates the payment for a low-income senior", () => {
    const res = result({ hasSenior65: true, monthlyOther: 520 }, "ssi");
    expect(res.status).toBe("likely");
    expect(res.value?.low).toBe((994 - 500) * 12);
  });
});

describe("health coverage", () => {
  it("covers adults to 138% only in expansion states", () => {
    expect(statusOf({ state: "CA", monthlyEarned: 1_800 }, "medicaid-adults")).toBe("likely");
    expect(statusOf({ state: "TX", monthlyEarned: 1_000 }, "medicaid-adults")).toBe("unlikely");
  });
  it("sends people in the coverage gap to help, not the marketplace", () => {
    expect(result({ state: "TX", monthlyEarned: 1_000 }, "aca-marketplace").reasons[0].key).toBe("aca-marketplace.gap");
  });
  it("offers marketplace credits between 138% and 400%", () => {
    expect(statusOf({ state: "CA", monthlyEarned: 3_000 }, "aca-marketplace")).toBe("likely");
    expect(statusOf({ state: "CA", monthlyEarned: 6_000 }, "aca-marketplace")).toBe("unlikely");
  });
  it("covers pregnancy even in non-expansion states", () => {
    expect(statusOf({ state: "TX", size: 2, pregnant: true, monthlyEarned: 1_500 }, "medicaid-pregnancy")).toBe("likely");
  });
});

describe("WIC", () => {
  it("counts an unborn child in the household size", () => {
    const limitFor3 = monthlyLimit(fpl(3), 185);
    expect(statusOf({ size: 2, pregnant: true, monthlyEarned: limitFor3 }, "wic")).toBe("likely");
    expect(statusOf({ size: 2, childrenUnder5: 1, monthlyEarned: limitFor3 }, "wic")).toBe("unlikely");
  });
});

describe("normalize()", () => {
  it("makes household size cover every child and clears bad numbers", () => {
    const h = normalize(make({ size: 1, childrenUnder5: 2, children5to16: 1, monthlyEarned: -5, monthlyOther: NaN }));
    expect(h.size).toBe(4);
    expect(h.monthlyEarned).toBe(0);
    expect(h.monthlyOther).toBe(0);
  });
});

describe("screen()", () => {
  const family = make({ state: "OH", size: 4, childrenUnder5: 1, children5to16: 1, married: true, monthlyEarned: 2_600 });

  it("returns every program exactly once, likely first", () => {
    const results = screen(family);
    expect(results.map((x) => x.programId).sort()).toEqual(programs.map((p) => p.id).sort());
    const ranks = results.map((x) => ["likely", "possibly", "unlikely"].indexOf(x.status));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("adds up a meaningful yearly value for a working family", () => {
    const total = totalValue(screen(family));
    expect(total.low).toBeGreaterThan(10_000);
    expect(total.high).toBeGreaterThanOrEqual(total.low);
  });

  it("gives every result at least one reason", () => {
    for (const x of screen(family)) expect(x.reasons.length).toBeGreaterThan(0);
  });
});
