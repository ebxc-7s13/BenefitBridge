import { describe, expect, it } from "vitest";
import { packs } from "../../countries";
import { emptyHousehold } from "./engine";
import { evaluateStateScheme, type StateScheme } from "./stateRules";
import { statePortals, stateSchemes } from "./stateSchemes";
import { IN_STATES } from "./states";
import type { InHousehold } from "./types";

type Patch = Partial<Omit<InHousehold, "work">> & { work?: Partial<InHousehold["work"]> };
const make = (p: Patch): InHousehold => {
  const base = emptyHousehold();
  return { ...base, ...p, work: { ...base.work, ...p.work } };
};
const scheme = (criteria: StateScheme["criteria"], extra: Partial<StateScheme> = {}): StateScheme => ({
  id: "test",
  state: "UP",
  category: "family",
  criteria,
  url: "https://up.gov.in/",
  ...extra,
});

describe("state scheme data", () => {
  const codes = IN_STATES.map(([code]) => code);

  it("has an official portal for every state and UT", () => {
    expect(Object.keys(statePortals).sort()).toEqual([...codes].sort());
    for (const url of Object.values(statePortals)) expect(url).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|nic)\.in\//);
  });

  it("gives every state and UT at least one scheme or its portal", () => {
    const covered = new Set(stateSchemes.map((s) => s.state));
    expect(covered.size).toBeGreaterThanOrEqual(30);
    for (const s of stateSchemes) expect(codes, s.id).toContain(s.state);
  });

  it("uses unique ids prefixed by the state code", () => {
    expect(new Set(stateSchemes.map((s) => s.id)).size).toBe(stateSchemes.length);
    for (const s of stateSchemes) expect(s.id.startsWith(`${s.state.toLowerCase()}-`), s.id).toBe(true);
  });

  it("links only to government sites over https", () => {
    // Official portals that state governments run outside gov.in.
    const stateRun = ["https://www.pspcl.in/", "https://www.cmchistn.com/", "https://nandagaurauk.in/", "https://krishakbandhu.net/"];
    for (const s of stateSchemes) if (!stateRun.includes(s.url)) expect(s.url, s.id).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|nic)\.in\//);
  });

  it("has a name, papers and steps for every scheme in English and Hindi", () => {
    for (const s of stateSchemes) {
      const en = packs.IN.content.en!.programs[s.id];
      const hi = packs.IN.content.hi!.programs[s.id];
      expect(en?.name, s.id).toBeTruthy();
      expect(hi?.name, s.id).toBeTruthy();
      expect(en.documents.length, s.id).toBeGreaterThan(0);
      expect(hi.documents.length, s.id).toBe(en.documents.length);
      expect(hi.steps.length, s.id).toBe(en.steps.length);
    }
  });
});

describe("evaluateStateScheme", () => {
  it("is likely when every criterion is met and nothing needs checking", () => {
    const r = evaluateStateScheme(scheme({ women: true, ageMin: 21, ageMax: 60 }), make({ gender: "female", age: 30 }));
    expect(r.status).toBe("likely");
    expect(r.reasons.map((x) => x.key)).toEqual(["state.women", "state.age", "state.verify"]);
    expect(r.reasons[1].params).toEqual({ min: 21, max: 60 });
  });

  it("is at most possibly when the scheme has conditions we don't ask", () => {
    expect(evaluateStateScheme(scheme({ women: true }, { check: true }), make({ gender: "female" })).status).toBe("possibly");
  });

  it("treats unanswered age and gender as unknown, not a miss", () => {
    expect(evaluateStateScheme(scheme({ women: true, ageMin: 21 }), make({})).status).toBe("possibly");
  });

  it("is unlikely, with what's missing, when a criterion fails", () => {
    const r = evaluateStateScheme(scheme({ women: true, incomeMax: 250_000, rural: true }), make({ gender: "male", annualIncome: 400_000, area: "urban" }));
    expect(r.status).toBe("unlikely");
    expect(r.reasons.map((x) => x.key)).toEqual(["state.miss.women", "state.miss.incomeMax"]);
    expect(r.value).toBeUndefined();
  });

  it("matches any listed social category", () => {
    const s = scheme({ categories: ["sc", "st"] });
    expect(evaluateStateScheme(s, make({ category: "st" })).status).toBe("likely");
    expect(evaluateStateScheme(s, make({ category: "obc" })).status).toBe("unlikely");
    expect(evaluateStateScheme(scheme({ categories: ["minority"] }), make({ minority: true })).status).toBe("likely");
  });

  it("pays per-acre schemes by the land owned", () => {
    const s = scheme({ farmer: true }, { perAcre: 12_000 });
    expect(evaluateStateScheme(s, make({ work: { farmer: true }, landAcres: 2.5 })).value).toEqual({ low: 30_000, high: 30_000 });
    expect(evaluateStateScheme(s, make({ work: { farmer: true } })).value).toBeUndefined();
  });

  it("only screens schemes of the household's own state", () => {
    const ids = packs.IN.screen(make({ state: "TN" })).map((r) => r.programId);
    expect(ids).toContain("tn-kmut");
    expect(ids.some((id) => id.startsWith("ka-"))).toBe(false);
  });
});
