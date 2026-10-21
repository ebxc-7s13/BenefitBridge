import { useId, useState, type FormEvent } from "react";
import { Check, MoneyField, Stepper } from "../components/Fields";
import { Icon } from "../components/Icon";
import { money } from "../content/format";
import { frequencies, toMonthly, type IncomeInput } from "../lib/income";
import { go } from "../lib/router";
import { useApp } from "../lib/state";
import { STATES } from "../lib/states";

const TOTAL = 5;

export function Screener({ step }: { step: number }) {
  const app = useApp();
  const { t, answers: a, setAnswers, update } = app;
  const w = t.ui.wizard;
  const [error, setError] = useState("");
  const current = Math.min(step, TOTAL);

  function next(e: FormEvent) {
    e.preventDefault();
    if (current === 1 && !a.state) {
      setError(w.errors.state);
      document.getElementById("state")?.focus();
      return;
    }
    setError("");
    if (current < TOTAL) go({ name: "screener", step: current + 1 });
    else {
      update({ done: true });
      go({ name: "results" });
    }
  }

  const titles = [w.state.title, w.household.title, w.income.title, w.expenses.title, w.current.title];

  return (
    <form className="page wizard" onSubmit={next} noValidate>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${(current / TOTAL) * 100}%` }} />
      </div>
      <p className="step-label">{w.stepOf(current, TOTAL)}</p>
      <h1 id="page-title" tabIndex={-1}>{titles[current - 1]}</h1>

      {current === 1 && (
        <div className="field">
          <label htmlFor="state">{w.state.label}</label>
          <select
            id="state"
            value={a.state}
            aria-invalid={!!error}
            aria-describedby={error ? "state-error" : undefined}
            onChange={(e) => {
              setAnswers({ state: e.target.value });
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
              <Check key={k} label={w.current[k]} checked={a.receives[k]} onChange={(v) => setAnswers({ receives: { ...a.receives, [k]: v } })} />
            ))}
          </div>
        </>
      )}

      <p className="fine-print privacy-inline">
        <Icon name="shield" size={16} /> {w.privacyNote}
      </p>

      <div className="wizard-nav">
        {current > 1 ? (
          <button type="button" className="button secondary" onClick={() => go({ name: "screener", step: current - 1 })}>
            <Icon name="back" /> {w.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="button">
          {current === TOTAL ? w.finish : w.next} <Icon name="forward" />
        </button>
      </div>
    </form>
  );
}

function HouseholdStep() {
  const { t, answers: a, setAnswers } = useApp();
  const w = t.ui.wizard.household;
  const kids = a.childrenUnder5 + a.children5to16 + a.children17to18;
  // Keep the household size at least as large as the people counted.
  const setKids = (patch: Partial<typeof a>) => {
    const next = { ...a, ...patch };
    const needed = next.childrenUnder5 + next.children5to16 + next.children17to18 + 1;
    setAnswers({ ...patch, size: Math.max(next.size, needed) });
  };
  const stepper = (label: string) => ({ label, minusLabel: w.minus(label), plusLabel: w.plus(label) });
  return (
    <>
      <Stepper {...stepper(w.size)} hint={w.sizeHint} min={Math.max(1, kids + 1)} value={a.size} onChange={(size) => setAnswers({ size })} />
      <div className="stepper-group">
        <Stepper {...stepper(w.under5)} value={a.childrenUnder5} max={12} onChange={(n) => setKids({ childrenUnder5: n })} />
        <Stepper {...stepper(w.age5to16)} value={a.children5to16} max={12} onChange={(n) => setKids({ children5to16: n })} />
        <Stepper {...stepper(w.age17to18)} value={a.children17to18} max={12} onChange={(n) => setKids({ children17to18: n })} />
      </div>
      <fieldset>
        <legend>{w.situations}</legend>
        <div className="check-list">
          <Check label={w.pregnant} checked={a.pregnant} onChange={(pregnant) => setAnswers({ pregnant })} />
          <Check label={w.senior60} checked={a.hasSenior60 || a.hasSenior65} onChange={(v) => setAnswers({ hasSenior60: v, hasSenior65: v && a.hasSenior65 })} />
          <Check label={w.senior65} checked={a.hasSenior65} onChange={(v) => setAnswers({ hasSenior65: v, hasSenior60: v || a.hasSenior60 })} />
          <Check label={w.disability} checked={a.hasDisability} onChange={(hasDisability) => setAnswers({ hasDisability })} />
        </div>
      </fieldset>
      <div className="check-list">
        <Check label={w.married} checked={a.married} onChange={(married) => setAnswers({ married, size: Math.max(a.size, married ? kids + 2 : 1) })} />
        <Check label={w.homeless} checked={a.homeless} onChange={(homeless) => setAnswers({ homeless })} />
      </div>
    </>
  );
}

function IncomeStep() {
  const { t, locale, income, update, setAnswers } = useApp();
  const w = t.ui.wizard.income;

  const change = (kind: "earned" | "other", patch: Partial<IncomeInput>) => {
    const nextIncome = { ...income, [kind]: { ...income[kind], ...patch } };
    update({ income: nextIncome });
    setAnswers(kind === "earned" ? { monthlyEarned: toMonthly(nextIncome.earned) } : { monthlyOther: toMonthly(nextIncome.other) });
  };

  return (
    <>
      <p className="lead">{w.lead}</p>
      {(["earned", "other"] as const).map((kind) => (
        <IncomeRow
          key={kind}
          label={kind === "earned" ? w.earned : w.other}
          hint={kind === "earned" ? w.earnedHint : w.otherHint}
          input={income[kind]}
          frequencyLabel={w.frequency}
          frequencyNames={w.frequencies}
          perMonth={income[kind].frequency !== "monthly" && toMonthly(income[kind]) > 0 ? w.perMonth(money(toMonthly(income[kind]), locale)) : ""}
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
  const { t, answers: a, setAnswers } = useApp();
  const w = t.ui.wizard.expenses;
  const show = (n: number) => (n ? String(n) : "");
  const num = (v: string) => Math.round(Number(v.replace(/,/g, "")) || 0);
  const set = (k: keyof typeof a.expenses) => (v: string) => setAnswers({ expenses: { ...a.expenses, [k]: num(v) } });
  return (
    <>
      <p className="lead">{w.lead}</p>
      <MoneyField label={w.rent} value={show(a.expenses.rent)} onChange={set("rent")} />
      <MoneyField label={w.utilities} value={show(a.expenses.utilities)} onChange={set("utilities")} />
      {a.childrenUnder5 + a.children5to16 > 0 && <MoneyField label={w.childCare} value={show(a.expenses.childCare)} onChange={set("childCare")} />}
      {(a.hasSenior60 || a.hasDisability) && <MoneyField label={w.medical} hint={w.medicalHint} value={show(a.expenses.medical)} onChange={set("medical")} />}
    </>
  );
}
