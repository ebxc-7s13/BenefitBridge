import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { contents, type Content, type Locale } from "../content";
import { emptyHousehold, screen } from "./eligibility/engine";
import type { Household, ProgramId, ProgramResult } from "./eligibility/types";
import type { IncomeInput } from "./income";
import { storage } from "./storage";

const KEY = "benefitbridge:v1";

export type PlanStatus = "todo" | "applying" | "applied" | "approved" | "denied";

export interface PlanItem {
  status: PlanStatus;
  /** Indexes of the documents checked off. */
  docs: number[];
  interview?: string;
  renewal?: string;
}

export interface Saved {
  locale: Locale;
  /** Keep answers on this device between visits. */
  save: boolean;
  answers: Household;
  income: { earned: IncomeInput; other: IncomeInput };
  /** The screener has been finished at least once. */
  done: boolean;
  plan: Partial<Record<ProgramId, PlanItem>>;
}

function initial(): Saved {
  const lang = typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
  return {
    locale: lang,
    save: true,
    answers: emptyHousehold(),
    income: { earned: { amount: "", frequency: "monthly" }, other: { amount: "", frequency: "monthly" } },
    done: false,
    plan: {},
  };
}

function load(): Saved {
  const fresh = initial();
  const stored = storage.get<Partial<Saved>>(KEY);
  if (!stored) return fresh;
  return {
    ...fresh,
    ...stored,
    answers: { ...fresh.answers, ...stored.answers, expenses: { ...fresh.answers.expenses, ...stored.answers?.expenses }, receives: { ...fresh.answers.receives, ...stored.answers?.receives } },
    income: { ...fresh.income, ...stored.income },
  };
}

interface AppState extends Saved {
  t: Content;
  results: ProgramResult[];
  update(patch: Partial<Saved>): void;
  setAnswers(patch: Partial<Household>): void;
  setPlanItem(id: ProgramId, patch: Partial<PlanItem> | null): void;
  reset(): void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(load);

  useEffect(() => {
    if (state.save) storage.set(KEY, state);
    else storage.remove(KEY);
    document.documentElement.lang = state.locale;
  }, [state]);

  const results = useMemo(() => (state.done && state.answers.state ? screen(state.answers) : []), [state.done, state.answers]);

  const value = useMemo<AppState>(
    () => ({
      ...state,
      t: contents[state.locale],
      results,
      update: (patch) => setState((s) => ({ ...s, ...patch })),
      setAnswers: (patch) => setState((s) => ({ ...s, answers: { ...s.answers, ...patch } })),
      setPlanItem: (id, patch) =>
        setState((s) => {
          const plan = { ...s.plan };
          if (patch === null) delete plan[id];
          else plan[id] = { status: "todo", docs: [], ...plan[id], ...patch };
          return { ...s, plan };
        }),
      reset: () => setState((s) => ({ ...initial(), locale: s.locale, save: s.save })),
    }),
    [state, results],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
