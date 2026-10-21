import { describe, expect, it } from "vitest";
import { bundledUpdates } from "../content/updates";
import { IN_STATES } from "./india/states";
import { STATES } from "./states";
import { fetchUpdates, mergeUpdates, parseUpdates, updatesFor, type Update } from "./updates";

const item = (patch: Partial<Update> = {}): Update => ({
  id: "x",
  date: "2026-10-01",
  country: "IN",
  title: { en: "Title" },
  body: { en: "Body" },
  ...patch,
});

describe("bundled updates", () => {
  it("are well formed, unique and in every language their country uses", () => {
    expect(parseUpdates(bundledUpdates)).toEqual(bundledUpdates);
    expect(new Set(bundledUpdates.map((u) => u.id)).size).toBe(bundledUpdates.length);
    for (const u of bundledUpdates) {
      const langs = u.country === "US" ? ["en", "es"] : u.country === "IN" ? ["en", "hi"] : ["en", "es", "hi"];
      for (const l of langs) {
        expect(u.title[l as "en"], `${u.id} ${l}`).toBeTruthy();
        expect(u.body[l as "en"], `${u.id} ${l}`).toBeTruthy();
      }
      if (u.state) expect((u.country === "IN" ? IN_STATES : STATES).map(([c]) => c), u.id).toContain(u.state);
    }
  });

  it("link only to official sites, or this app's own releases", () => {
    const own = "https://github.com/ebxc-7s13/BenefitBridge/";
    for (const u of bundledUpdates) if (u.url && !u.url.startsWith(own)) expect(u.url, u.id).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|gov\.in|nic\.in)\//);
  });

  it("match the published file's format", async () => {
    const { readFile } = await import("node:fs/promises");
    const file = JSON.parse(await readFile(new URL("../../public/updates.json", import.meta.url), "utf8"));
    expect(Array.isArray(file.updates)).toBe(true);
    expect(parseUpdates(file)).toHaveLength(file.updates.length);
  });
});

describe("parseUpdates", () => {
  it("drops anything malformed or unsafe", () => {
    const bad = [
      { ...item(), id: "Bad Id" },
      { ...item(), date: "21/10/2026" },
      { ...item(), country: "FR" },
      { ...item(), url: "javascript:alert(1)" },
      { ...item(), url: "http://example.gov/" },
      { ...item(), title: { es: "Solo español" } },
      { ...item(), state: "maharashtra" },
      "not an object",
      null,
    ];
    expect(parseUpdates({ updates: [...bad, item({ id: "ok" })] }).map((u) => u.id)).toEqual(["ok"]);
    expect(parseUpdates("nonsense")).toEqual([]);
  });
});

describe("selecting updates", () => {
  const all = mergeUpdates(
    [item({ id: "a", date: "2026-01-01" }), item({ id: "b", country: "US" })],
    [item({ id: "a", date: "2026-09-01", title: { en: "Newer" } }), item({ id: "mh", state: "MH" }), item({ id: "future", date: "2027-01-01" }), item({ id: "all", country: "ALL", date: "2026-10-02" })],
  );

  it("lets a fetched update replace a bundled one and sorts newest first", () => {
    expect(all.find((u) => u.id === "a")!.title.en).toBe("Newer");
    expect(all.map((u) => u.date)).toEqual([...all.map((u) => u.date)].sort().reverse());
  });

  it("shows the country's and the state's updates, and none from the future", () => {
    expect(updatesFor(all, "IN", "UP", "2026-10-21").map((u) => u.id)).toEqual(["all", "a"]);
    expect(updatesFor(all, "IN", "MH", "2026-10-21").map((u) => u.id)).toEqual(["all", "mh", "a"]);
    expect(updatesFor(all, "US", "CA", "2026-10-21").map((u) => u.id)).toEqual(["all", "b"]);
  });
});

describe("fetchUpdates", () => {
  const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

  it("returns the first source that answers", async () => {
    const seen: string[] = [];
    const result = await fetchUpdates(((url: string) => {
      seen.push(url);
      return seen.length === 1 ? Promise.reject(new TypeError("offline")) : ok({ updates: [item({ id: "live" })] });
    }) as typeof fetch);
    expect(seen).toHaveLength(2);
    expect(result?.map((u) => u.id)).toEqual(["live"]);
  });

  it("returns null when no source can be reached", async () => {
    expect(await fetchUpdates((() => Promise.reject(new TypeError("offline"))) as typeof fetch)).toBeNull();
  });
});
