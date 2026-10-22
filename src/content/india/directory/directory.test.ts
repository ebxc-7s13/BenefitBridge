import { describe, expect, it } from "vitest";
import { STATE_LANGUAGE } from "../../languages";
import { jobText } from "../jobs";
import { inServices } from "../services";
import { directoryText } from "./index";

describe.each(Object.entries(directoryText))("%s services and jobs", (locale, text) => {
  const states = Object.entries(STATE_LANGUAGE).filter(([, l]) => l === locale).map(([s]) => s);
  const own = inServices.filter((s) => s.scope === "national" || states.includes(s.scope));

  it("translates every national service and every service of its states", () => {
    expect(own.filter((s) => !text!.services[s.id]?.name).map((s) => s.id)).toEqual([]);
  });

  it("keeps papers and steps the same length as English", () => {
    for (const s of own) {
      const t = text!.services[s.id];
      if (s.docs && t?.docs) expect(t.docs.length, s.id).toBe(s.docs.en.length);
      if (s.steps && t?.steps) expect(t.steps.length, s.id).toBe(s.steps.en.length);
    }
  });

  it("translates every job and only known ids", () => {
    expect(Object.keys(jobText).filter((id) => !text!.jobs[id]?.name)).toEqual([]);
    const known = new Set(inServices.map((s) => s.id));
    expect(Object.keys(text!.services).filter((id) => !known.has(id))).toEqual([]);
  });
});
