import { describe, expect, it } from "vitest";
import { emptyHousehold, normalize, schemes, screen } from "./engine";
import type { InHousehold, SchemeId } from "./types";

type Patch = Omit<Partial<InHousehold>, "work" | "receives"> & {
  work?: Partial<InHousehold["work"]>;
  receives?: Partial<InHousehold["receives"]>;
};

function make(p: Patch): InHousehold {
  const base = emptyHousehold();
  return { ...base, state: "UP", area: "rural", age: 32, ...p, work: { ...base.work, ...p.work }, receives: { ...base.receives, ...p.receives } };
}
const result = (p: Patch, id: SchemeId) => screen(make(p)).find((r) => r.programId === id)!;
const status = (p: Patch, id: SchemeId) => result(p, id).status;
const keys = (p: Patch, id: SchemeId) => result(p, id).reasons.map((r) => r.key);

describe("farmers", () => {
  const farmer: Patch = { work: { farmer: true }, landAcres: 2, annualIncome: 150_000 };

  it("gives PM-KISAN ₹6,000 a year to landholding farmers", () => {
    expect(result(farmer, "pm-kisan")).toMatchObject({ status: "likely", value: { low: 6_000, high: 6_000 } });
  });
  it("excludes income-tax payers, government employees and landless farmers", () => {
    expect(status({ ...farmer, incomeTaxPayer: true }, "pm-kisan")).toBe("unlikely");
    expect(status({ ...farmer, govtEmployee: true }, "pm-kisan")).toBe("unlikely");
    expect(keys({ ...farmer, landAcres: 0 }, "pm-kisan")).toEqual(["pm-kisan.landOwners"]);
  });
  it("limits Kisan Maan-dhan to farmers aged 18–40 with up to 2 hectares", () => {
    expect(status(farmer, "kisan-maandhan")).toBe("likely");
    expect(status({ ...farmer, landAcres: 6 }, "kisan-maandhan")).toBe("unlikely");
    expect(status({ ...farmer, age: 45 }, "kisan-maandhan")).toBe("unlikely");
  });
  it("offers credit and crop insurance to every farmer", () => {
    expect(status(farmer, "kcc")).toBe("likely");
    expect(status(farmer, "pmfby")).toBe("likely");
    expect(status({}, "kcc")).toBe("unlikely");
  });
});

describe("health and maternity", () => {
  it("covers everyone 70+ under Ayushman Vay Vandana, whatever the income", () => {
    expect(status({ senior70: true, annualIncome: 2_000_000 }, "pmjay")).toBe("likely");
  });
  it("covers AAY families and asks others on lists to check", () => {
    expect(status({ rationCard: "aay" }, "pmjay")).toBe("likely");
    expect(status({ rationCard: "phh" }, "pmjay")).toBe("possibly");
    expect(status({ annualIncome: 900_000 }, "pmjay")).toBe("unlikely");
  });
  it("pays JSY to every mother in low-performing states, and only BPL/SC/ST mothers elsewhere", () => {
    expect(result({ pregnant: true, state: "UP", area: "rural", annualIncome: 600_000 }, "jsy")).toMatchObject({ status: "likely", value: { low: 1_400 } });
    expect(result({ pregnant: true, state: "UP", area: "urban", annualIncome: 600_000 }, "jsy").value?.low).toBe(1_000);
    expect(status({ pregnant: true, state: "KL", annualIncome: 600_000 }, "jsy")).toBe("unlikely");
    expect(result({ pregnant: true, state: "KL", area: "rural", category: "sc" }, "jsy").value?.low).toBe(700);
  });
  it("gives PMMVY ₹5,000–6,000 below ₹8 lakh income", () => {
    expect(result({ pregnant: true, annualIncome: 400_000 }, "pmmvy")).toMatchObject({ status: "likely", value: { low: 5_000, high: 6_000, once: true } });
    expect(status({ pregnant: true, annualIncome: 900_000 }, "pmmvy")).toBe("unlikely");
    expect(status({ pregnant: true, annualIncome: 900_000, category: "st" }, "pmmvy")).toBe("likely");
  });
});

describe("housing and energy", () => {
  it("pays PMAY-G ₹1.2 lakh in the plains and ₹1.3 lakh in hilly states", () => {
    expect(result({ home: "kutcha", bpl: "yes" }, "pmay-g")).toMatchObject({ status: "likely", value: { low: 120_000 } });
    expect(result({ home: "kutcha", state: "UK", bpl: "yes" }, "pmay-g").value?.low).toBe(130_000);
    expect(status({ home: "pucca" }, "pmay-g")).toBe("unlikely");
    expect(status({ home: "kutcha", incomeTaxPayer: true }, "pmay-g")).toBe("unlikely");
  });
  it("uses PMAY-U 2.0 income bands in towns", () => {
    const urban: Patch = { area: "urban", home: "none" };
    expect(status({ ...urban, annualIncome: 280_000 }, "pmay-u")).toBe("likely");
    expect(status({ ...urban, annualIncome: 700_000 }, "pmay-u")).toBe("possibly");
    expect(status({ ...urban, annualIncome: 1_000_000 }, "pmay-u")).toBe("unlikely");
    expect(status({ annualIncome: 100_000, home: "none" }, "pmay-u")).toBe("unlikely");
  });
  it("caps the rooftop solar subsidy at ₹78,000", () => {
    expect(result({ ownsHomeWithMeter: true }, "surya-ghar").value).toEqual({ low: 30_000, high: 78_000, once: true });
  });
  it("gives Ujjwala to poor households without LPG, in a woman's name", () => {
    expect(status({ hasLpg: false, gender: "female", bpl: "yes" }, "ujjwala")).toBe("likely");
    expect(status({ hasLpg: false, gender: "male", bpl: "yes" }, "ujjwala")).toBe("possibly");
    expect(status({ hasLpg: true, gender: "female", bpl: "yes" }, "ujjwala")).toBe("unlikely");
  });
});

describe("work", () => {
  it("guarantees 125 days of rural work to adults in villages only", () => {
    expect(result({}, "rural-jobs").reasons[0]).toEqual({ key: "rural-jobs.days", params: { days: 125 } });
    expect(status({ area: "urban" }, "rural-jobs")).toBe("unlikely");
  });
  it("registers unorganised workers aged 16–59 on e-Shram", () => {
    expect(status({ work: { worker: true } }, "eshram")).toBe("likely");
    expect(status({ work: { worker: true }, formalJob: true }, "eshram")).toBe("unlikely");
    expect(status({ work: { worker: true }, age: 62 }, "eshram")).toBe("unlikely");
  });
  it("checks PM-SYM's ₹15,000 a month income limit", () => {
    expect(status({ work: { worker: true }, annualIncome: 150_000 }, "pm-sym")).toBe("likely");
    expect(status({ work: { worker: true }, annualIncome: 300_000 }, "pm-sym")).toBe("possibly");
  });
  it("gives PMEGP's higher subsidy to special categories in villages", () => {
    expect(result({ wantsLoan: true, category: "sc" }, "pmegp").reasons[0].params).toEqual({ rate: 35 });
    expect(result({ wantsLoan: true, area: "urban", category: "general", gender: "male" }, "pmegp").reasons[0].params).toEqual({ rate: 15 });
  });
  it("pays artisans the PM Vishwakarma toolkit grant", () => {
    expect(result({ work: { artisan: true } }, "vishwakarma")).toMatchObject({ status: "likely", value: { low: 15_000, once: true } });
    expect(status({ work: { artisan: true }, govtEmployee: true }, "vishwakarma")).toBe("unlikely");
  });
});

describe("pensions and insurance", () => {
  it("pays NSAP pensions to BPL families and asks others to check the list", () => {
    expect(result({ senior60: true, bpl: "yes" }, "old-age-pension")).toMatchObject({ status: "likely", value: { low: 2_400 } });
    expect(status({ senior60: true, bpl: "unknown", rationCard: "phh" }, "old-age-pension")).toBe("possibly");
    expect(status({ senior60: true, bpl: "no" }, "old-age-pension")).toBe("unlikely");
    expect(result({ widow: true, bpl: "yes" }, "widow-pension").value?.low).toBe(3_600);
    expect(status({ disability: "some", bpl: "yes" }, "disability-pension")).toBe("unlikely");
    expect(status({ disability: "severe", bpl: "yes" }, "disability-pension")).toBe("likely");
  });
  it("applies the age windows for APY, PMJJBY and PMSBY", () => {
    expect([status({ age: 30 }, "apy"), status({ age: 41 }, "apy")]).toEqual(["likely", "unlikely"]);
    expect([status({ age: 50 }, "pmjjby"), status({ age: 51 }, "pmjjby")]).toEqual(["likely", "unlikely"]);
    expect([status({ age: 70 }, "pmsby"), status({ age: 71 }, "pmsby")]).toEqual(["likely", "unlikely"]);
    expect(status({ age: 30, incomeTaxPayer: true }, "apy")).toBe("unlikely");
  });
  it("gives free assistive devices below the income limits", () => {
    expect(keys({ disability: "some", annualIncome: 240_000 }, "adip")).toEqual(["adip.free"]);
    expect(keys({ disability: "some", annualIncome: 330_000 }, "adip")).toEqual(["adip.half"]);
    expect(status({ disability: "some", annualIncome: 400_000 }, "adip")).toBe("unlikely");
  });
});

describe("students and families", () => {
  it("matches scholarships to category and income", () => {
    expect(status({ collegeStudent: true, category: "sc", annualIncome: 240_000 }, "scholarship-category")).toBe("likely");
    expect(status({ collegeStudent: true, category: "sc", annualIncome: 260_000 }, "scholarship-category")).toBe("unlikely");
    expect(status({ schoolChildren: 1, minority: true, category: "general", annualIncome: 190_000 }, "scholarship-category")).toBe("likely");
    expect(status({ collegeStudent: true, category: "general", annualIncome: 100_000 }, "scholarship-category")).toBe("unlikely");
    expect(status({ collegeStudent: true, annualIncome: 440_000 }, "scholarship-merit")).toBe("possibly");
  });
  it("opens Sukanya Samriddhi for girls under 10", () => {
    expect(status({ girlsUnder10: 1 }, "sukanya")).toBe("likely");
    expect(status({}, "sukanya")).toBe("unlikely");
  });
});

describe("screen()", () => {
  const family = make({ state: "BR", area: "rural", size: 5, age: 34, gender: "female", childrenUnder6: 1, girlsUnder10: 1, schoolChildren: 2, rationCard: "phh", bpl: "yes", annualIncome: 110_000, work: { farmer: true, farmLabour: true }, landAcres: 1, home: "kutcha", hasLpg: false });

  it("returns every scheme once, likely first", () => {
    const results = screen(family);
    expect(results.map((r) => r.programId).sort()).toEqual(schemes.map((s) => s.id).sort());
    const ranks = results.map((r) => ["likely", "possibly", "unlikely"].indexOf(r.status));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("finds the core schemes for a poor rural farming family", () => {
    const likely = screen(family).filter((r) => r.status === "likely").map((r) => r.programId);
    for (const id of ["ration", "pm-kisan", "pmay-g", "ujjwala", "rural-jobs", "anganwadi", "mid-day-meal", "sukanya", "shg", "kcc"] as const) {
      expect(likely, id).toContain(id);
    }
  });

  it("keeps household size at least as large as the children counted", () => {
    expect(normalize(make({ size: 1, schoolChildren: 3 })).size).toBe(4);
  });
});
