import { useId, useState } from "react";
import { Check, MoneyField, Stepper } from "../components/Fields";
import { WizardShell } from "../components/Wizard";
import { money } from "../content/format";
import type { UsWizard } from "../content/us/types";
import { frequencies, toMonthly, type IncomeInput } from "../lib/income";
import { useApp } from "../lib/state";
import { STATES } from "../lib/states";
import type { Household } from "../lib/us/types";

const TOTAL = 5;

function useUs() {
  const app = useApp();
  return {
    ...app,
    w: app.c!.wizard as UsWizard,
    a: app.answers.US,
    set: (patch: Partial<Household>) => app.setAnswers("US", patch),
  };
}

/** Steps 1–2 are the basic details asked once (profile mode). */
const PROFILE_STEPS = 2;

export function UsScreener({ step, mode = "screener" }: { step: number; mode?: "screener" | "profile" }) {
  const { w, a, set } = useUs();
  const [error, setError] = useState("");
  const total = mode === "profile" ? PROFILE_STEPS : TOTAL;
  const current = Math.min(step, total);
  const titles = [w.state.title, w.household.title, w.income.title, w.expenses.title, w.current.title];

  const validate = () => {
    if (current === 1 && !a.state) {
      setError(w.errors.state);
      document.getElementById("state")?.focus();
      return false;
    }
    setError("");
    return true;
  };

  return (
    <WizardShell mode={mode} step={current} total={total} title={titles[current - 1]} validate={validate}>
      {current === 1 && (
        <div className="field">
          <label htmlFor="state">{w.state.label}</label>
          <select
            id="state"
            value={a.state}
            aria-invalid={!!error}
            aria-describedby={error ? "state-error" : undefined}
            onChange={(e) => {
              set({ state: e.target.value });
              setError("");
            }}
          >
            <option value="">{w.state.placeholder}</option>
            {STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          {error && <p className="error" id="state-error" role="alert">{error}</p>}
        </div>
      )}
      {current === 2 && <HouseholdStep />}
      {current === 3 && <IncomeStep />}
      {current === 4 && <ExpensesStep />}
      {current === 5 && (
        <>
          <p className="lead">{w.current.lead}</p>
          <div className="check-list">
            {(["snap", "medicaid", "ssi", "tanf", "medicare"] as const).map((k) => (
              <Check key={k} label={w.current[k]} checked={a.receives[k]} onChange={(v) => set({ receives: { ...a.receives, [k]: v } })} />
            ))}
          </div>
        </>
      )}
    </WizardShell>
  );
}

function HouseholdStep() {
  const { t, w, a, set } = useUs();
  const h = w.household;
  const kids = a.childrenUnder5 + a.children5to16 + a.children17to18;
  // Keep the household size at least as large as the people counted.
  const setKids = (patch: Partial<Household>) => {
    const next = { ...a, ...patch };
    const needed = next.childrenUnder5 + next.children5to16 + next.children17to18 + 1;
    set({ ...patch, size: Math.max(next.size, needed) });
  };
  const stepper = (label: string) => ({ label, minusLabel: t.wizard.minus(label), plusLabel: t.wizard.plus(label) });
  return (
    <>
      <Stepper {...stepper(h.size)} hint={h.sizeHint} min={Math.max(1, kids + 1)} value={a.size} onChange={(size) => set({ size })} />
      <div className="stepper-group">
        <Stepper {...stepper(h.under5)} value={a.childrenUnder5} max={12} onChange={(n) => setKids({ childrenUnder5: n })} />
        <Stepper {...stepper(h.age5to16)} value={a.children5to16} max={12} onChange={(n) => setKids({ children5to16: n })} />
        <Stepper {...stepper(h.age17to18)} value={a.children17to18} max={12} onChange={(n) => setKids({ children17to18: n })} />
      </div>
      <fieldset>
        <legend>{h.situations}</legend>
        <div className="check-list">
          <Check label={h.pregnant} checked={a.pregnant} onChange={(pregnant) => set({ pregnant })} />
          <Check label={h.senior60} checked={a.hasSenior60 || a.hasSenior65} onChange={(v) => set({ hasSenior60: v, hasSenior65: v && a.hasSenior65 })} />
          <Check label={h.senior65} checked={a.hasSenior65} onChange={(v) => set({ hasSenior65: v, hasSenior60: v || a.hasSenior60 })} />
          <Check label={h.disability} checked={a.hasDisability} onChange={(hasDisability) => set({ hasDisability })} />
        </div>
      </fieldset>
      <div className="check-list">
        <Check label={h.married} checked={a.married} onChange={(married) => set({ married, size: Math.max(a.size, married ? kids + 2 : 1) })} />
        <Check label={h.homeless} checked={a.homeless} onChange={(homeless) => set({ homeless })} />
      </div>
    </>
  );
}

function IncomeStep() {
  const { w, locale, income, update, set } = useUs();
  const inc = w.income;

  const change = (kind: "earned" | "other", patch: Partial<IncomeInput>) => {
    const nextIncome = { ...income, [kind]: { ...income[kind], ...patch } };
    update({ income: nextIncome });
    set(kind === "earned" ? { monthlyEarned: toMonthly(nextIncome.earned) } : { monthlyOther: toMonthly(nextIncome.other) });
  };

  return (
    <>
      <p className="lead">{inc.lead}</p>
      {(["earned", "other"] as const).map((kind) => (
        <IncomeRow
          key={kind}
          label={kind === "earned" ? inc.earned : inc.other}
          hint={kind === "earned" ? inc.earnedHint : inc.otherHint}
          input={income[kind]}
          frequencyLabel={inc.frequency}
          frequencyNames={inc.frequencies}
          perMonth={income[kind].frequency !== "monthly" && toMonthly(income[kind]) > 0 ? inc.perMonth(money(toMonthly(income[kind]), locale, "USD")) : ""}
          onChange={(patch) => change(kind, patch)}
        />
      ))}
    </>
  );
}

function IncomeRow(props: {
  label: string;
  hint: string;
  input: IncomeInput;
  frequencyLabel: string;
  frequencyNames: Record<IncomeInput["frequency"], string>;
  perMonth: string;
  onChange(patch: Partial<IncomeInput>): void;
}) {
  const id = useId();
  return (
    <div className="income-row">
      <MoneyField label={props.label} hint={props.hint} value={props.input.amount} onChange={(amount) => props.onChange({ amount })}>
        <div className="field inline">
          <label htmlFor={id}>{props.frequencyLabel}</label>
          <select id={id} value={props.input.frequency} onChange={(e) => props.onChange({ frequency: e.target.value as IncomeInput["frequency"] })}>
            {frequencies.map((f) => (
              <option key={f} value={f}>{props.frequencyNames[f]}</option>
            ))}
          </select>
        </div>
        {props.perMonth && <p className="hint" aria-live="polite">{props.perMonth}</p>}
      </MoneyField>
    </div>
  );
}

function ExpensesStep() {
  const { w, a, set } = useUs();
  const e = w.expenses;
  const show = (n: number) => (n ? String(n) : "");
  const num = (v: string) => Math.round(Number(v.replace(/,/g, "")) || 0);
  const setExp = (k: keyof Household["expenses"]) => (v: string) => set({ expenses: { ...a.expenses, [k]: num(v) } });
  return (
    <>
      <p className="lead">{e.lead}</p>
      <MoneyField label={e.rent} value={show(a.expenses.rent)} onChange={setExp("rent")} />
      <MoneyField label={e.utilities} value={show(a.expenses.utilities)} onChange={setExp("utilities")} />
      {a.childrenUnder5 + a.children5to16 > 0 && <MoneyField label={e.childCare} value={show(a.expenses.childCare)} onChange={setExp("childCare")} />}
      {(a.hasSenior60 || a.hasDisability) && <MoneyField label={e.medical} hint={e.medicalHint} value={show(a.expenses.medical)} onChange={setExp("medical")} />}
    </>
  );
}
