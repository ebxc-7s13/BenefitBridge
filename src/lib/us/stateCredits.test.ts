import { describe, expect, it } from "vitest";
import { packs } from "../../countries";
import { statePortals } from "../../content/us/statePortals";
import { STATES } from "../states";
import { emptyHousehold, screen } from "./engine";
import { stateCreditTable } from "./rulesets/stateCredits2026";
import { evaluateStateCtc, evaluateStateEitc, type StateCredits } from "./stateCredits";
import type { Household, ProgramResult } from "./types";

const make = (h: Partial<Household>): Household => ({ ...emptyHousehold(), ...h });
const federal = (status: ProgramResult["status"], amount = 4_000): ProgramResult => ({
  programId: "eitc",
  status,
  reasons: [],
  value: status === "unlikely" ? undefined : { low: amount, high: amount },
});

describe("state data", () => {
  const codes = STATES.map(([c]) => c);

  it("has a tax agency and a benefits office for every state and DC", () => {
    expect(Object.keys(stateCreditTable.states).sort()).toEqual([...codes].sort());
    expect(Object.keys(statePortals).sort()).toEqual([...codes].sort());
    for (const [state, c] of Object.entries(stateCreditTable.states)) expect(c.tax.url, state).toMatch(/^https:\/\/[a-z0-9.-]+\//);
    for (const [state, p] of Object.entries(statePortals)) {
      // Florida's Department of Children and Families runs its official site outside .gov.
      if (state !== "FL") expect(p.agency.url, state).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|us)\//);
      if (p.portal) expect(p.portal.url, state).toMatch(/^https:\/\/[a-z0-9.-]+\//);
    }
  });

  it("keeps percentages and amounts sensible", () => {
    for (const [state, c] of Object.entries(stateCreditTable.states)) {
      const pcts = c.eitc?.pct === undefined ? [] : Array.isArray(c.eitc.pct) ? c.eitc.pct : [c.eitc.pct];
      for (const p of pcts) expect(p, state).toBeGreaterThanOrEqual(0), expect(p, state).toBeLessThanOrEqual(1.5);
      for (const t of c.ctc?.tiers ?? []) {
        expect(t.max, state).toBeGreaterThan(0);
        expect(t.max, state).toBeLessThanOrEqual(5_000);
        expect(t.ageUnder, state).toBeGreaterThan(0);
        expect(t.ageUnder, state).toBeLessThanOrEqual(19);
      }
    }
  });

  it("names and links every state credit in English and Spanish", () => {
    for (const [state, c] of Object.entries(stateCreditTable.states))
      for (const kind of [c.eitc && "eitc", c.ctc && "ctc"].filter(Boolean)) {
        const id = `${state.toLowerCase()}-${kind}`;
        expect(packs.US.content.en!.programs[id]?.name, id).toContain(STATES.find(([s]) => s === state)![1]);
        expect(packs.US.content.es!.programs[id]?.name, id).toBeTruthy();
        expect(packs.US.links[id]?.url, id).toBe(c.tax.url);
      }
  });
});

describe("state EITC", () => {
  const credit: NonNullable<StateCredits["eitc"]> = { pct: 0.3, refundable: true };

  it("pays a share of the federal EITC, with the same status", () => {
    const r = evaluateStateEitc(credit, federal("likely", 4_000), 2);
    expect(r).toMatchObject({ status: "likely", value: { low: 1_200, high: 1_200 } });
    expect(r.reasons[0]).toEqual({ key: "stateEitc.pct", params: { pct: 30 } });
  });

  it("needs the federal EITC", () => {
    expect(evaluateStateEitc(credit, federal("unlikely"), 2).status).toBe("unlikely");
  });

  it("is only possibly, from zero, when it isn't refundable", () => {
    expect(evaluateStateEitc({ pct: 1.25, refundable: false }, federal("likely", 1_000), 1)).toMatchObject({ status: "possibly", value: { low: 0, high: 1_250 } });
  });

  it("uses the share for the number of children (Wisconsin)", () => {
    const wi = stateCreditTable.states.WI.eitc!;
    expect(evaluateStateEitc(wi, federal("likely", 1_000), 3).value).toEqual({ low: 340, high: 340 });
    expect(evaluateStateEitc(wi, federal("likely", 600), 0).status).toBe("unlikely");
  });

  it("gives no amount for states with their own formula", () => {
    const r = evaluateStateEitc({ refundable: true }, federal("likely"), 1);
    expect(r.status).toBe("possibly");
    expect(r.value).toBeUndefined();
  });
});

describe("state child tax credit", () => {
  const ny = stateCreditTable.states.NY.ctc!;

  it("counts children by age group and tier", () => {
    // A toddler may be under 4 ($1,000); a 10-year-old gets $500.
    const r = evaluateStateCtc(ny, make({ childrenUnder5: 1, children5to16: 1 }), 50_000);
    expect(r).toMatchObject({ status: "possibly", value: { low: 0, high: 1_500 } });
  });

  it("needs children young enough, and income under the limit", () => {
    expect(evaluateStateCtc(ny, make({ children17to18: 2 }), 50_000).reasons[0].key).toBe("stateCtc.miss.children");
    expect(evaluateStateCtc(ny, make({ childrenUnder5: 1 }), 150_000).reasons[0].key).toBe("stateCtc.miss.income");
  });

  it("pays per-return credits once", () => {
    const ca = stateCreditTable.states.CA.ctc!;
    expect(evaluateStateCtc(ca, make({ childrenUnder5: 3 }), 20_000).value).toEqual({ low: 0, high: 1_189 });
  });

  it("only screens the household's own state", () => {
    const ids = screen(make({ state: "NY", size: 2, childrenUnder5: 1, monthlyEarned: 1_500 })).map((r) => r.programId);
    expect(ids).toEqual(expect.arrayContaining(["ny-eitc", "ny-ctc"]));
    expect(ids.some((id) => id.startsWith("ca-"))).toBe(false);
    expect(screen(make({ state: "TX", size: 2, childrenUnder5: 1, monthlyEarned: 1_500 })).some((r) => r.state)).toBe(false);
  });
});
