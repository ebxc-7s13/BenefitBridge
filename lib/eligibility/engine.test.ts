import { describe, expect, it } from "vitest";
import { screen } from "./engine";
import { annualPovertyGuideline, monthlyLimit } from "./fpl";
import { ruleset2025 } from "./rulesets/2025";
import type { Household } from "./types";

const base: Household = {
  state: "CA",
  size: 1,
  monthlyGrossIncome: 0,
  pregnant: false,
  hasChildUnder5: false,
  hasChildUnder19: false,
  hasSenior: false,
  hasDisability: false,
  receives: { snap: false, medicaid: false, ssi: false, tanf: false },
};

const statusOf = (h: Partial<Household>, id: string) =>
  screen({ ...base, ...h }).find((r) => r.programId === id)!.status;

describe("poverty guidelines", () => {
  it("matches published 2025 figures", () => {
    expect(annualPovertyGuideline(ruleset2025, "CA", 1)).toBe(15_650);
    expect(annualPovertyGuideline(ruleset2025, "CA", 4)).toBe(32_150);
    expect(annualPovertyGuideline(ruleset2025, "AK", 1)).toBe(19_550);
    expect(annualPovertyGuideline(ruleset2025, "HI", 2)).toBe(24_320);
  });

  it("reproduces the FY2026 SNAP gross income table", () => {
    const fy2026 = [1_696, 2_292, 2_888, 3_483, 4_079, 4_675, 5_271, 5_867];
    fy2026.forEach((limit, i) => {
      expect(monthlyLimit(annualPovertyGuideline(ruleset2025, "CA", i + 1), 130)).toBe(limit);
    });
  });
});

describe("SNAP", () => {
  it("is likely at the gross limit and possibly just above it", () => {
    expect(statusOf({ size: 3, monthlyGrossIncome: 2_888 }, "snap")).toBe("likely");
    expect(statusOf({ size: 3, monthlyGrossIncome: 2_889 }, "snap")).toBe("possibly");
  });

  it("is unlikely well above 200% of poverty", () => {
    expect(statusOf({ size: 1, monthlyGrossIncome: 5_000 }, "snap")).toBe("unlikely");
  });

  it("treats SSI households as categorically eligible", () => {
    expect(statusOf({ monthlyGrossIncome: 10_000, receives: { ...base.receives, ssi: true } }, "snap")).toBe("likely");
  });

  it("gives seniors over the gross limit a possibly", () => {
    expect(statusOf({ monthlyGrossIncome: 4_000, hasSenior: true }, "snap")).toBe("possibly");
  });
});

describe("Medicaid (adults)", () => {
  it("covers adults to 138% in expansion states", () => {
    expect(statusOf({ state: "CA", monthlyGrossIncome: 1_700 }, "medicaid-adults")).toBe("likely");
    expect(statusOf({ state: "CA", monthlyGrossIncome: 2_000 }, "medicaid-adults")).toBe("unlikely");
  });

  it("is unlikely for childless adults in non-expansion states", () => {
    expect(statusOf({ state: "TX", monthlyGrossIncome: 1_000 }, "medicaid-adults")).toBe("unlikely");
  });

  it("covers low-income pregnant people even in non-expansion states", () => {
    expect(statusOf({ state: "TX", monthlyGrossIncome: 1_000, pregnant: true }, "medicaid-adults")).toBe("likely");
  });
});

describe("WIC", () => {
  it("requires pregnancy or a young child", () => {
    expect(statusOf({ monthlyGrossIncome: 0 }, "wic")).toBe("unlikely");
  });

  it("is adjunctively eligible through Medicaid", () => {
    expect(
      statusOf({ hasChildUnder5: true, monthlyGrossIncome: 9_000, receives: { ...base.receives, medicaid: true } }, "wic"),
    ).toBe("likely");
  });
});

describe("screen()", () => {
  it("sorts likely results first", () => {
    const results = screen({ ...base, size: 3, monthlyGrossIncome: 2_000, hasChildUnder5: true, hasChildUnder19: true });
    const ranks = results.map((r) => ["likely", "possibly", "unlikely"].indexOf(r.status));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("gives every result a reason and an https apply link", () => {
    for (const r of screen(base)) {
      expect(r.reasons.length).toBeGreaterThan(0);
      expect(r.applyUrl).toMatch(/^https:\/\//);
    }
  });
});
