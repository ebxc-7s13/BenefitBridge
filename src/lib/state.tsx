import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ui, type CountryCode, type CountryContent, type Locale, type UiStrings } from "../content";
import { contentFor, packFor, packs, type Answers, type CountryPack } from "../countries";
import type { ProgramResult } from "./core";
import type { IncomeInput } from "./income";
import { storage } from "./storage";

const KEY = "benefitbridge:v2";
const OLD_KEY = "benefitbridge:v1";

export type PlanStatus = "todo" | "applying" | "applied" | "approved" | "denied";

export interface PlanItem {
  status: PlanStatus;
  /** Indexes of the documents checked off. */
  docs: number[];
  interview?: string;
  renewal?: string;
}

type Plan = Partial<Record<string, PlanItem>>;

export interface Saved {
  country: CountryCode | null;
  locale: Locale;
  /** Keep answers on this device between visits. */
  save: boolean;
  answers: Answers;
  /** United States income as typed, with how often it's paid. */
  income: { earned: IncomeInput; other: IncomeInput };
  /** India family income as typed (monthly or yearly). */
  inIncome: IncomeInput;
  /** The questionnaire has been finished at least once, per country. */
  done: Record<CountryCode, boolean>;
  plan: Record<CountryCode, Plan>;
  /** Ids of the home-page updates already shown. */
  seen: string[];
}

const browserLocale = (): Locale => {
  const lang = typeof navigator !== "undefined" ? navigator.language?.toLowerCase() ?? "" : "";
  return lang.startsWith("es") ? "es" : lang.startsWith("hi") ? "hi" : "en";
};

function initial(): Saved {
  return {
    country: null,
    locale: browserLocale(),
    save: true,
    answers: { US: packs.US.empty(), IN: packs.IN.empty() },
    income: { earned: { amount: "", frequency: "monthly" }, other: { amount: "", frequency: "monthly" } },
    inIncome: { amount: "", frequency: "monthly" },
    done: { US: false, IN: false },
    plan: { US: {}, IN: {} },
    seen: [],
  };
}

/** v1 stored one US household; carry it over as the US country. */
function migrate(fresh: Saved): Saved | null {
  const old = storage.get<{ locale?: Locale; save?: boolean; answers?: Answers["US"]; income?: Saved["income"]; done?: boolean; plan?: Plan }>(OLD_KEY);
  if (!old) return null;
  return {
    ...fresh,
    country: "US",
    locale: old.locale === "es" ? "es" : "en",
    save: old.save ?? true,
    answers: { ...fresh.answers, US: { ...fresh.answers.US, ...old.answers } },
    income: old.income ?? fresh.income,
    done: { ...fresh.done, US: !!old.done },
    plan: { ...fresh.plan, US: old.plan ?? {} },
  };
}

function load(): Saved {
  const fresh = initial();
  const stored = storage.get<Partial<Saved>>(KEY);
  if (!stored) return migrate(fresh) ?? fresh;
  const a = stored.answers;
  return {
    ...fresh,
    ...stored,
    answers: {
      US: { ...fresh.answers.US, ...a?.US, expenses: { ...fresh.answers.US.expenses, ...a?.US?.expenses }, receives: { ...fresh.answers.US.receives, ...a?.US?.receives } },
      IN: { ...fresh.answers.IN, ...a?.IN, work: { ...fresh.answers.IN.work, ...a?.IN?.work }, receives: { ...fresh.answers.IN.receives, ...a?.IN?.receives } },
    },
    done: { ...fresh.done, ...stored.done },
    plan: { ...fresh.plan, ...stored.plan },
    seen: Array.isArray(stored.seen) ? stored.seen.filter((x) => typeof x === "string").slice(-300) : [],
  };
}

interface AppState extends Saved {
  /** Text shared by every country, in the reader's language. */
  t: UiStrings;
  /** The chosen country's pack and wording (null until a country is chosen). */
  pack: CountryPack | null;
  c: CountryContent | null;
  results: ProgramResult[];
  countryDone: boolean;
  countryPlan: Plan;
  update(patch: Partial<Saved>): void;
  chooseCountry(code: CountryCode): void;
  setAnswers<K extends CountryCode>(code: K, patch: Partial<Answers[K]>): void;
  setPlanItem(id: string, patch: Partial<PlanItem> | null): void;
  markSeen(ids: string[]): void;
  /** Switch to the country's next language. */
  toggleLocale(): void;
  reset(): void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Saved>(load);

  useEffect(() => {
    if (state.save) storage.set(KEY, state);
    else storage.remove(KEY);
    storage.remove(OLD_KEY);
    document.documentElement.lang = state.locale;
  }, [state]);

  const pack = state.country ? packFor(state.country) : null;
  const countryDone = !!state.country && state.done[state.country];

  const results = useMemo(() => {
    if (!pack || !state.country || !countryDone) return [];
    const answers = state.answers[state.country];
    return answers.state ? pack.screen(answers as never) : [];
  }, [pack, state.country, countryDone, state.answers]);

  const value = useMemo<AppState>(() => {
    const locales: Locale[] = pack ? pack.locales : ["en", "hi", "es"];
    return {
      ...state,
      t: ui[state.locale],
      pack,
      c: pack ? contentFor(pack, state.locale) : null,
      results,
      countryDone,
      countryPlan: state.country ? state.plan[state.country] : {},
      update: (patch) => setState((s) => ({ ...s, ...patch })),
      chooseCountry: (code) =>
        setState((s) => {
          const supported = packFor(code).locales;
          return { ...s, country: code, locale: supported.includes(s.locale) ? s.locale : supported[0] };
        }),
      setAnswers: (code, patch) => setState((s) => ({ ...s, answers: { ...s.answers, [code]: { ...s.answers[code], ...patch } } })),
      setPlanItem: (id, patch) =>
        setState((s) => {
          if (!s.country) return s;
          const plan = { ...s.plan[s.country] };
          if (patch === null) delete plan[id];
          else plan[id] = { status: "todo", docs: [], ...plan[id], ...patch };
          return { ...s, plan: { ...s.plan, [s.country]: plan } };
        }),
      markSeen: (ids) =>
        setState((s) => {
          const fresh = ids.filter((id) => !s.seen.includes(id));
          return fresh.length ? { ...s, seen: [...s.seen, ...fresh].slice(-300) } : s;
        }),
      toggleLocale: () =>
        setState((s) => {
          const i = locales.indexOf(s.locale);
          return { ...s, locale: locales[(i + 1) % locales.length] };
        }),
      reset: () => setState((s) => ({ ...initial(), locale: s.locale, save: s.save, seen: s.seen })),
    };
  }, [state, pack, results, countryDone]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
