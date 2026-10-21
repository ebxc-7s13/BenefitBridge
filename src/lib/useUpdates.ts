import { useCallback, useEffect, useState } from "react";
import { bundledUpdates } from "../content/updates";
import { storage } from "./storage";
import { fetchUpdates, mergeUpdates, parseUpdates, type Update } from "./updates";

/** Fetched updates hold no personal data, so they are cached even when answers aren't saved. */
const CACHE_KEY = "benefitbridge:updates";

interface Cached {
  updates: unknown;
  checkedAt: string;
}

export type UpdateStatus = "checking" | "ok" | "offline";

let shared: { updates: Update[]; checkedAt: string | null; status: UpdateStatus } | null = null;
const listeners = new Set<() => void>();

function initialState() {
  if (shared) return shared;
  const cached = storage.get<Cached>(CACHE_KEY);
  return { updates: mergeUpdates(bundledUpdates, parseUpdates(cached?.updates)), checkedAt: cached?.checkedAt ?? null, status: "offline" as UpdateStatus };
}

let inFlight: Promise<void> | null = null;

function refresh(): Promise<void> {
  if (inFlight) return inFlight;
  shared = { ...initialState(), status: "checking" };
  listeners.forEach((l) => l());
  inFlight = fetchUpdates()
    .then((fetched) => {
      const base = initialState();
      if (fetched === null) {
        shared = { ...base, status: "offline" };
      } else {
        const checkedAt = new Date().toISOString();
        storage.set(CACHE_KEY, { updates: fetched, checkedAt } satisfies Cached);
        shared = { updates: mergeUpdates(bundledUpdates, fetched), checkedAt, status: "ok" };
      }
    })
    .finally(() => {
      inFlight = null;
      listeners.forEach((l) => l());
    });
  return inFlight;
}

let checkedThisVisit = false;

/** Bundled updates at once, then the published ones when online (once per visit, or on request). */
export function useUpdates() {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    const listener = () => setState(shared ?? initialState());
    listeners.add(listener);
    if (!checkedThisVisit && (typeof navigator === "undefined" || navigator.onLine !== false)) {
      checkedThisVisit = true;
      void refresh();
    }
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return { ...state, refresh: useCallback(() => void refresh(), []) };
}
