import { LANGUAGES } from "../content/languages";
import type { CountryCode, Locale } from "../content/types";

/** One dated notice on the home page: a rule change, a deadline or a new feature. */
export interface Update {
  id: string;
  /** ISO date, e.g. "2026-10-21". */
  date: string;
  country: CountryCode | "ALL";
  /** Only for one state or UT (its code), e.g. "MH". */
  state?: string;
  title: Partial<Record<Locale, string>> & { en: string };
  body: Partial<Record<Locale, string>> & { en: string };
  /** Official page with the details. */
  url?: string;
}

/** Published updates: the repository first (always current), then the copy deployed with the app. */
export const UPDATE_SOURCES = ["https://raw.githubusercontent.com/ebxc-7s13/BenefitBridge/main/public/updates.json", "./updates.json"];

const LOCALES = Object.keys(LANGUAGES) as Locale[];
const COUNTRIES = ["ALL", "US", "IN"];

function text(v: unknown, max: number): Update["title"] | null {
  if (!v || typeof v !== "object") return null;
  const out: Partial<Record<Locale, string>> = {};
  for (const l of LOCALES) {
    const s = (v as Record<string, unknown>)[l];
    if (typeof s === "string" && s.trim() && s.length <= max) out[l] = s.trim();
  }
  return out.en ? (out as Update["title"]) : null;
}

/** Keep only well-formed updates from an untrusted file; everything is shown as plain text. */
export function parseUpdates(data: unknown): Update[] {
  const list = Array.isArray(data) ? data : data && typeof data === "object" ? (data as { updates?: unknown }).updates : null;
  if (!Array.isArray(list)) return [];
  const out: Update[] = [];
  for (const raw of list.slice(0, 200)) {
    if (!raw || typeof raw !== "object") continue;
    const u = raw as Record<string, unknown>;
    const title = text(u.title, 140);
    const body = text(u.body, 600);
    if (typeof u.id !== "string" || !/^[a-z0-9-]{1,60}$/.test(u.id)) continue;
    if (typeof u.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(u.date) || Number.isNaN(Date.parse(u.date))) continue;
    if (typeof u.country !== "string" || !COUNTRIES.includes(u.country)) continue;
    if (u.state !== undefined && (typeof u.state !== "string" || !/^[A-Z]{2}$/.test(u.state))) continue;
    if (u.url !== undefined && (typeof u.url !== "string" || !/^https:\/\/[^\s"<>]+$/.test(u.url))) continue;
    if (!title || !body) continue;
    out.push({ id: u.id, date: u.date, country: u.country as Update["country"], state: u.state as string | undefined, title, body, url: u.url as string | undefined });
  }
  return out;
}

/** Bundled and fetched updates together; a fetched update replaces a bundled one with the same id. */
export function mergeUpdates(...lists: Update[][]): Update[] {
  const byId = new Map<string, Update>();
  for (const list of lists) for (const u of list) byId.set(u.id, u);
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

/** Updates for this country, and for this state when one is chosen, newest first. */
export function updatesFor(all: Update[], country: CountryCode, state: string, today: string): Update[] {
  return all.filter((u) => (u.country === "ALL" || u.country === country) && (!u.state || u.state === state) && u.date <= today);
}

/** The text in the reader's language, or English. */
export const localized = (t: Update["title"], locale: Locale) => t[locale] ?? t.en;

/** Fetch published updates when online; null when no source could be reached. Never sends anything about the user. */
export async function fetchUpdates(fetcher: typeof fetch = fetch): Promise<Update[] | null> {
  for (const url of UPDATE_SOURCES) {
    try {
      const response = await fetcher(url, { cache: "no-cache", credentials: "omit", referrerPolicy: "no-referrer" });
      if (response.ok) return parseUpdates(await response.json());
    } catch {
      // Offline, blocked or not published here: try the next source.
    }
  }
  return null;
}
