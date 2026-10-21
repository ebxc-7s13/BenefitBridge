import { describe, expect, it } from "vitest";
import { jobText } from "../content/india/jobs";
import { jobs2026 } from "./india/jobs2026";
import { educationFit, evaluateJob, type JobRule } from "./jobs";

const rule: JobRule = { id: "x", minEducation: "graduate", ageMin: 18, ageMax: 32, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" };

describe("evaluateJob", () => {
  it("accepts someone with the education and age", () => {
    expect(evaluateJob(rule, { age: 25, education: "graduate", category: "general" }).status).toBe("yes");
  });

  it("adds the category relaxation to the upper age limit", () => {
    expect(evaluateJob(rule, { age: 35, education: "graduate", category: "general" }).status).toBe("no");
    expect(evaluateJob(rule, { age: 35, education: "graduate", category: "obc" })).toMatchObject({ status: "yes", ageMax: 35, relaxed: 3 });
    expect(evaluateJob(rule, { age: 37, education: "postgraduate", category: "sc" }).status).toBe("yes");
  });

  it("says check the notice when age or education is missing", () => {
    expect(evaluateJob(rule, { age: 0, education: "graduate", category: "" }).status).toBe("maybe");
    expect(evaluateJob(rule, { age: 25, education: "", category: "" }).status).toBe("maybe");
  });

  it("opens job portals and free training to everyone", () => {
    expect(evaluateJob({ id: "ncs", forAll: true, url: "https://www.ncs.gov.in/" }, { age: 70, education: "none", category: "" }).status).toBe("yes");
  });
});

describe("educationFit", () => {
  it("ranks school levels", () => {
    expect(educationFit("12th", "10th")).toBe("yes");
    expect(educationFit("10th", "12th")).toBe("no");
  });

  it("treats parallel tracks carefully", () => {
    expect(educationFit("iti", "iti")).toBe("yes");
    expect(educationFit("12th", "iti")).toBe("no");
    expect(educationFit("graduate", "iti")).toBe("maybe");
    expect(educationFit("diploma", "12th")).toBe("maybe");
    expect(educationFit("graduate", "b.ed")).toBe("maybe");
    expect(educationFit("12th", "b.ed")).toBe("no");
  });
});

describe("national job data", () => {
  it("has wording in English and Hindi and an official https link for every exam", () => {
    for (const r of jobs2026) {
      expect(jobText[r.id]?.name.en, r.id).toBeTruthy();
      expect(jobText[r.id]?.name.hi, r.id).toBeTruthy();
      expect(r.url, r.id).toMatch(/^https:\/\/[a-z0-9.-]+\//);
      if (r.ageMin !== undefined && r.ageMax !== undefined) expect(r.ageMax, r.id).toBeGreaterThan(r.ageMin);
    }
  });
});
