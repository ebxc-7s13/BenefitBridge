import { describe, expect, it } from "vitest";
import { IN_STATES } from "../../lib/india/states";
import { STATES } from "../../lib/states";
import { SERVICE_CATEGORIES } from "../types";
import { directoryFor } from "./index";

describe.each(["IN", "US"] as const)("%s services and helplines", (country) => {
  const { services, helplines } = directoryFor(country);
  const scopes = new Set(["national", ...(country === "IN" ? IN_STATES : STATES).map(([c]) => c)]);

  it("has unique ids, known scopes and categories", () => {
    const ids = [...services, ...helplines].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of services) {
      expect(scopes.has(s.scope), s.id).toBe(true);
      expect(SERVICE_CATEGORIES, s.id).toContain(s.category);
    }
    for (const h of helplines) expect(scopes.has(h.scope), h.id).toBe(true);
  });

  it("links only over https, and every service can be reached by link or phone", () => {
    for (const s of services) {
      if (s.url) expect(s.url, s.id).toMatch(/^https:\/\/[a-z0-9.-]+(:\d+)?\//);
      expect(!!s.url || !!s.phone, s.id).toBe(true);
    }
  });

  it("has dialable numbers", () => {
    for (const h of helplines) expect(h.number.replace(/[^\d]/g, "").length, h.id).toBeGreaterThanOrEqual(3);
    for (const s of services) if (s.phone) expect(s.phone.replace(/[^\d]/g, "").length, s.id).toBeGreaterThanOrEqual(3);
  });

  it("is written in the country's languages, with papers and steps in step", () => {
    const second = country === "IN" ? "hi" : "es";
    for (const s of services) {
      expect(s.name.en && s.what.en, s.id).toBeTruthy();
      if (country === "IN") expect(s.name[second] && s.what[second], s.id).toBeTruthy();
      for (const list of [s.docs, s.steps]) if (list?.[second]) expect(list[second]!.length, s.id).toBe(list.en.length);
    }
  });

  it("has an emergency number and national services in every common category", () => {
    expect(helplines.some((h) => h.emergency)).toBe(true);
    for (const c of ["identity", "health", "jobs", "tax"] as const) expect(services.some((s) => s.scope === "national" && s.category === c), c).toBe(true);
  });
});

it("gives every Indian state and UT some services of its own", () => {
  const { services } = directoryFor("IN");
  for (const [code] of IN_STATES) expect(services.filter((s) => s.scope === code).length, code).toBeGreaterThanOrEqual(2);
});
