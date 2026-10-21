import { describe, expect, it } from "vitest";
import { packs } from "../countries";
import { IN_STATES } from "../lib/india/states";
import { stateSchemes } from "../lib/india/stateSchemes";
import { entries } from "./india/stateEntries";
import { ui } from "./index";
import { STATE_LANGUAGE } from "./languages";
import { regionalIndia, regionalStateText, regionalUi } from "./regional";
import type { IndianLocale } from "./types";

describe("Indian state languages", () => {
  const offered = [...new Set(Object.values(STATE_LANGUAGE))] as IndianLocale[];

  it("offers English, Hindi and the state's own language once translated", () => {
    for (const [state, l] of Object.entries(STATE_LANGUAGE)) {
      const expected = regionalIndia[l!] ? ["en", "hi", l] : ["en", "hi"];
      expect(packs.IN.localesFor({ ...packs.IN.empty(), state }), state).toEqual(expected);
    }
    expect(packs.IN.localesFor({ ...packs.IN.empty(), state: "UP" })).toEqual(["en", "hi"]);
  });

  it("has screen text, India content and state scheme wording for each language together", () => {
    for (const l of offered) {
      const parts = [!!regionalUi[l], !!regionalIndia[l], !!regionalStateText[l]];
      expect(new Set(parts).size, l).toBe(1);
    }
    for (const l of Object.keys(regionalUi)) expect(ui[l as IndianLocale]).toBeTruthy();
  });

  it("names every state and UT, and translates every scheme of its own states", () => {
    // General social security pensions share one translated wording.
    const shared = (id: string) => entries[id].en[0].startsWith("Social security pension (");
    const missing: string[] = [];
    for (const l of offered) {
      const text = regionalStateText[l];
      if (!text) continue;
      expect(text.locale).toBe(l);
      for (const [code] of IN_STATES) expect(text.stateNames[code], `${l} ${code}`).toBeTruthy();
      const own = Object.entries(STATE_LANGUAGE).filter(([, x]) => x === l).map(([s]) => s);
      const ids = stateSchemes.filter((s) => own.includes(s.state) && !shared(s.id)).map((s) => s.id);
      missing.push(...ids.filter((id) => !text.entries[id]).map((id) => `${l}: ${id}`));
    }
    expect(missing, "untranslated schemes").toEqual([]);
  });
});
