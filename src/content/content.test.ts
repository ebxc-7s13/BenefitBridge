import { describe, expect, it } from "vitest";
import { packs, type Answers, type CountryPack } from "../countries";
import type { Reason } from "../lib/core";
import { emptyHousehold as emptyIn } from "../lib/india/engine";
import { IN_STATES } from "../lib/india/states";
import { emptyHousehold as emptyUs } from "../lib/us/engine";
import { STATES } from "../lib/states";
import { ui } from "./index";
import type { CountryContent } from "./types";

/** US households that reach every branch of every program, and every state's own tax credits. */
function* usHouseholds(): Generator<Answers["US"]> {
  const everywhere: [string, number[], number[]][] = [
    ...["CA", "TX", "AK"].map((s): [string, number[], number[]] => [s, [0, 400, 1_200, 2_000, 3_000, 4_500, 7_000, 20_000], [0, 1, 3]]),
    ...STATES.map(([s]): [string, number[], number[]] => [s, [0, 1_500, 4_000, 20_000], [0, 1, 4]]),
  ];
  for (const [state, earnings, kidCounts] of everywhere)
    for (const earned of earnings)
      for (const other of [0, 900])
        for (const kids of kidCounts)
          for (const flag of [0, 1, 2, 3, 4, 5])
            for (const gets of [null, "snap", "medicaid", "ssi", "medicare"] as const) {
              const h = emptyUs();
              Object.assign(h, {
                state,
                monthlyEarned: earned,
                monthlyOther: other,
                childrenUnder5: kids > 0 ? 1 : 0,
                children5to16: Math.max(0, kids - 1),
                size: kids + 1 + (flag === 1 ? 1 : 0),
                pregnant: flag === 2,
                hasSenior65: flag === 3,
                hasDisability: flag === 4,
                married: flag === 1,
                homeless: flag === 5,
                receives: { snap: gets === "snap", medicaid: gets === "medicaid", ssi: gets === "ssi", tanf: false, medicare: gets === "medicare" },
              });
              yield h;
            }
}

/** India households that reach every branch of every central scheme, plus every state's own schemes. */
function* inHouseholds(): Generator<Answers["IN"]> {
  const everywhere: [string, string, number[], number[]][] = [
    ...([["UP", "rural"], ["KL", "urban"], ["UK", "rural"], ["MH", "urban"]] as const).map(([state, area]): [string, string, number[], number[]] => [
      state,
      area,
      [0, 100_000, 190_000, 240_000, 280_000, 340_000, 500_000, 850_000, 1_200_000],
      [0, 17, 22, 35, 45, 55, 65, 75],
    ]),
    ...IN_STATES.flatMap(([state]) =>
      (["rural", "urban"] as const).map((area): [string, string, number[], number[]] => [state, area, [60_000, 150_000, 300_000, 1_200_000], [0, 12, 20, 30, 50, 65]]),
    ),
  ];
  const works = [{}, { farmer: true }, { worker: true }, { vendor: true, business: true }, { artisan: true }, { student: true, jobseeker: true }, { homemaker: true }];
  for (const [state, area, incomes, ages] of everywhere)
    for (const annualIncome of incomes)
      for (const age of ages)
        for (const flag of [0, 1, 2, 3, 4, 5, 6])
          for (const work of works)
            for (const variant of [0, 1]) {
              const h = emptyIn();
              Object.assign(h, {
                state,
                area,
                age,
                annualIncome,
                gender: flag % 2 ? "female" : "male",
                category: (["general", "sc", "st", "obc"] as const)[flag % 4],
                minority: flag === 5,
                pregnant: flag === 1,
                senior60: flag === 2 || flag === 3,
                senior70: flag === 3,
                widow: flag === 4,
                disability: flag === 5 ? "some" : flag === 6 ? "severe" : "none",
                rationCard: (["none", "aay", "phh", "other"] as const)[flag % 4],
                bpl: (["yes", "no", "unknown"] as const)[flag % 3],
                childrenUnder6: flag === 1 ? 1 : 0,
                girlsUnder10: flag === 2 ? 1 : 0,
                schoolChildren: flag % 3,
                collegeStudent: flag === 4 || flag === 0,
                hasBank: flag !== 6,
                hasLpg: flag > 3,
                home: (["pucca", "kutcha", "none"] as const)[flag % 3],
                ownsHomeWithMeter: flag % 3 === 0,
                landAcres: [0, 1, 3, 8][flag % 4],
                firstJob: flag === 6,
                wantsLoan: flag === 5,
                incomeTaxPayer: flag === 6 && annualIncome > 800_000,
                govtEmployee: flag === 0 && annualIncome === 1_200_000,
                formalJob: flag === 4 && annualIncome > 300_000,
                work: { ...h.work, ...work },
                receives: { pmKisan: flag === 6, ayushman: flag === 5 && age === 35, eshram: flag === 3, pension: flag === 4 && age === 75 },
              });
              // A second profile: a general-category family with no cards, sometimes taxpaying.
              if (variant === 1) {
                Object.assign(h, {
                  category: "general",
                  minority: false,
                  rationCard: "none",
                  bpl: flag === 4 ? "yes" : "no",
                  disability: "none",
                  incomeTaxPayer: annualIncome >= 500_000,
                  receives: { pmKisan: false, ayushman: false, eshram: false, pension: false },
                });
              }
              yield h;
            }
}

function check<C extends "US" | "IN">(pack: CountryPack, households: () => Generator<Answers[C]>) {
  const emitted = new Set<string>();
  const unique = new Map<string, Reason>();
  const ids = new Set<string>();
  for (const h of households())
    for (const r of pack.screen(h as never)) {
      ids.add(r.programId);
      for (const reason of r.reasons) {
        emitted.add(reason.key);
        unique.set(JSON.stringify(reason), reason);
      }
    }
  const locales = Object.entries(pack.content) as [string, CountryContent][];

  it("has wording for every reason the engine produces, in every language", () => {
    for (const [locale, c] of locales) {
      expect([...emitted].filter((k) => !(k in c.reasons)), `${locale} is missing reasons`).toEqual([]);
    }
  });

  it("has no unused reason text", () => {
    for (const [locale, c] of locales) {
      expect(Object.keys(c.reasons).filter((k) => !emitted.has(k)), `${locale} has unused reasons`).toEqual([]);
    }
  });

  it("has the same shape in every language", () => {
    const [[, first], ...rest] = locales;
    for (const [locale, c] of rest) {
      expect(Object.keys(c.reasons).sort(), locale).toEqual(Object.keys(first.reasons).sort());
      expect(Object.keys(c.categories).sort(), locale).toEqual(Object.keys(first.categories).sort());
      expect(c.resources.length, locale).toBe(first.resources.length);
      for (const id of ids) {
        // Checklists are saved by position, so every language lists the same papers in the same order.
        expect(c.programs[id].documents.length, `${locale} ${id}`).toBe(first.programs[id].documents.length);
        expect(c.programs[id].steps.length, `${locale} ${id}`).toBe(first.programs[id].steps.length);
        expect(c.programs[id].faq.length, `${locale} ${id}`).toBe(first.programs[id].faq.length);
      }
    }
  });

  it("describes, categorises and links every program", () => {
    for (const id of ids) {
      for (const [locale, c] of locales) {
        expect(c.programs[id]?.name, `${locale} ${id}`).toBeTruthy();
        expect(c.categories[pack.categoryOf(id)], `${locale} ${id} category`).toBeTruthy();
      }
      expect(pack.links[id]?.url, id).toMatch(/^https:\/\/[a-z0-9.-]+\//);
    }
  });

  it("renders every reason without leaking placeholders", () => {
    for (const reason of unique.values())
      for (const [, c] of locales) {
        expect(c.reasons[reason.key](reason.params ?? {})).not.toMatch(/undefined|NaN|\$\{|\[object/);
      }
  });
}

describe("United States content", () => check(packs.US as unknown as CountryPack, usHouseholds));
describe("India content", () => check(packs.IN as unknown as CountryPack, inHouseholds));

describe("shared interface text", () => {
  const shape = (o: object): string[] =>
    Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" && !Array.isArray(v) ? shape(v).map((s) => `${k}.${s}`) : [k]));

  it("has every string in every language", () => {
    for (const [locale, strings] of Object.entries(ui)) {
      expect(shape(strings!).sort(), locale).toEqual(shape(ui.en).sort());
      expect(strings!.locale, locale).toBe(locale);
    }
  });
});
