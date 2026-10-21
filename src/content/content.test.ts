import { describe, expect, it } from "vitest";
import { emptyHousehold, programs, screen } from "../lib/eligibility/engine";
import type { Household, Reason } from "../lib/eligibility/types";
import { contents } from "./index";
import { programLinks } from "./links";

/** A spread of households that reaches every branch of every program. */
function* households(): Generator<Household> {
  const incomes = [0, 400, 1_200, 2_000, 3_000, 4_500, 7_000, 20_000];
  for (const state of ["CA", "TX", "AK"])
    for (const earned of incomes)
      for (const other of [0, 900])
        for (const kids of [0, 1, 3])
          for (const flags of [0, 1, 2, 3, 4, 5])
            for (const gets of [null, "snap", "medicaid", "ssi", "medicare"] as const) {
            const h = emptyHousehold();
            h.state = state;
            h.monthlyEarned = earned;
            h.monthlyOther = other;
            h.childrenUnder5 = kids > 0 ? 1 : 0;
            h.children5to16 = Math.max(0, kids - 1);
            h.size = kids + 1 + (flags === 1 ? 1 : 0);
            h.pregnant = flags === 2;
            h.hasSenior65 = flags === 3;
            h.hasDisability = flags === 4;
            h.married = flags === 1;
            h.homeless = flags === 5;
            h.receives = { snap: gets === "snap", medicaid: gets === "medicaid", ssi: gets === "ssi", tanf: false, medicare: gets === "medicare" };
            yield h;
          }
}

describe("content", () => {
  const emitted = new Set<string>();
  const unique = new Map<string, Reason>();
  for (const h of households())
    for (const r of screen(h))
      for (const reason of r.reasons) {
        emitted.add(reason.key);
        unique.set(JSON.stringify(reason), reason);
      }

  it("covers every reason the engine produces, in every language", () => {
    for (const c of Object.values(contents)) {
      const missing = [...emitted].filter((k) => !(k in c.reasons));
      expect(missing, `${c.locale} is missing reasons`).toEqual([]);
    }
  });

  it("has no unused reason text", () => {
    for (const c of Object.values(contents)) {
      const unused = Object.keys(c.reasons).filter((k) => !emitted.has(k));
      expect(unused, `${c.locale} has unused reasons`).toEqual([]);
    }
  });

  it("has the same shape in English and Spanish", () => {
    const { en, es } = contents;
    expect(Object.keys(es.reasons).sort()).toEqual(Object.keys(en.reasons).sort());
    for (const p of programs) {
      // Checklists are saved by position, so both languages must list the same papers in the same order.
      expect(es.programs[p.id].documents.length, p.id).toBe(en.programs[p.id].documents.length);
      expect(es.programs[p.id].steps.length, p.id).toBe(en.programs[p.id].steps.length);
      expect(es.programs[p.id].faq.length, p.id).toBe(en.programs[p.id].faq.length);
    }
  });

  it("renders every reason without leaking placeholders", () => {
    for (const reason of unique.values())
      for (const c of Object.values(contents)) {
        const text = c.reasons[reason.key](reason.params ?? {});
        expect(text).not.toMatch(/undefined|NaN|\$\{/);
      }
  });

  it("links every program to an official https site", () => {
    for (const p of programs) {
      expect(programLinks[p.id].url).toMatch(/^https:\/\/[^/]*\.(gov|org)\//);
    }
  });
});
