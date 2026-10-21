import { describe, expect, it } from "vitest";
import { world } from "./directory";

const CATEGORIES = ["food", "health", "home", "work", "money", "family", "security", "education"];

describe("other countries", () => {
  it("lists countries we don't screen for, each once", () => {
    const codes = world.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).not.toContain("US");
    expect(codes).not.toContain("IN");
    for (const code of codes) expect(code).toMatch(/^[A-Z]{2}$/);
  });

  it("gives every program who it's for, what it gives, papers, steps and an official https link", () => {
    const ids = new Set<string>();
    for (const c of world) {
      expect(c.portal.url, c.code).toMatch(/^https:\/\/[a-z0-9.-]+\//);
      expect(c.programs.length, c.code).toBeGreaterThanOrEqual(3);
      for (const p of c.programs) {
        expect(ids.has(p.id), p.id).toBe(false);
        ids.add(p.id);
        expect(p.id.startsWith(`${c.code.toLowerCase()}-`), p.id).toBe(true);
        expect(CATEGORIES, p.id).toContain(p.category);
        expect(p.name && p.who && p.gives, p.id).toBeTruthy();
        expect(p.documents.length, p.id).toBeGreaterThan(0);
        expect(p.apply.length, p.id).toBeGreaterThan(0);
        expect(p.url, p.id).toMatch(/^https:\/\/[a-z0-9.-]+(\/|$)/);
      }
    }
  });

  it("keeps the text plain: no leftover markup or placeholders", () => {
    const text = JSON.stringify(world);
    expect(text).not.toMatch(/<[a-z]|\[citation|TODO|undefined|\$\{/i);
  });
});
