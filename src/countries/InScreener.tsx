import { useState } from "react";
import { Check, MoneyField, RadioGroup, Stepper } from "../components/Fields";
import { WizardShell } from "../components/Wizard";
import type { InWizard } from "../content/india/types";
import { money } from "../content/format";
import { toMonthly, type IncomeInput } from "../lib/income";
import { IN_STATES } from "../lib/india/states";
import type { InHousehold } from "../lib/india/types";
import { useApp } from "../lib/state";

const TOTAL = 6;

function useIn() {
  const app = useApp();
  return {
    ...app,
    w: app.c!.wizard as InWizard,
    a: app.answers.IN,
    set: (patch: Partial<InHousehold>) => app.setAnswers("IN", patch),
  };
}

export function InScreener({ step }: { step: number }) {
  const { w, a } = useIn();
  const [errors, setErrors] = useState<{ state?: string; area?: string }>({});
  const current = Math.min(step, TOTAL);
  const titles = [w.where.title, w.family.title, w.cards.title, w.money.title, w.work.title, w.home.title];

  const validate = () => {
    if (current !== 1) return true;
    const next = { state: a.state ? undefined : w.where.errorState, area: a.area ? undefined : w.where.errorArea };
    setErrors(next);
    if (next.state) document.getElementById("in-state")?.focus();
    return !next.state && !next.area;
  };

  return (
    <WizardShell step={current} total={TOTAL} title={titles[current - 1]} validate={validate}>
      {current === 1 && <WhereStep errors={errors} clear={() => setErrors({})} />}
      {current === 2 && <FamilyStep />}
      {current === 3 && <CardsStep />}
      {current === 4 && <MoneyStep />}
      {current === 5 && <WorkStep />}
      {current === 6 && <HomeStep />}
    </WizardShell>
  );
}

function WhereStep({ errors, clear }: { errors: { state?: string; area?: string }; clear(): void }) {
  const { w, a, set, locale } = useIn();
  return (
    <>
      <div className="field">
        <label htmlFor="in-state">{w.where.state}</label>
        <select
          id="in-state"
          value={a.state}
          aria-invalid={!!errors.state}
          aria-describedby={errors.state ? "in-state-error" : undefined}
          onChange={(e) => {
            set({ state: e.target.value });
            clear();
          }}
        >
          <option value="">{w.where.statePlaceholder}</option>
          {IN_STATES.map(([code, en, hi]) => (
            <option key={code} value={code}>{locale === "hi" ? hi : en}</option>
          ))}
        </select>
        {errors.state && <p className="error" id="in-state-error" role="alert">{errors.state}</p>}
      </div>
      <RadioGroup
        legend={w.where.area}
        name="area"
        value={a.area}
        options={[["rural", w.where.rural], ["urban", w.where.urban]]}
        onChange={(area) => set({ area })}
        error={errors.area}
      />
    </>
  );
}

function FamilyStep() {
  const { t, w, a, set } = useIn();
  const f = w.family;
  const stepper = (label: string) => ({ label, minusLabel: t.wizard.minus(label), plusLabel: t.wizard.plus(label) });
  const kidsMin = Math.max(a.childrenUnder6, a.girlsUnder10, a.schoolChildren) + 1;
  const setKids = (patch: Partial<InHousehold>) => {
    const next = { ...a, ...patch };
    set({ ...patch, size: Math.max(next.size, Math.max(next.childrenUnder6, next.girlsUnder10, next.schoolChildren) + 1) });
  };
  return (
    <>
      <div className="field">
        <label htmlFor="in-age">{f.age}</label>
        <p className="hint" id="in-age-hint">{f.ageHint}</p>
        <input
          id="in-age"
          type="number"
          inputMode="numeric"
          min={0}
          max={120}
          value={a.age || ""}
          aria-describedby="in-age-hint"
          onChange={(e) => set({ age: Math.max(0, Math.min(120, Math.floor(Number(e.target.value) || 0))) })}
          style={{ maxWidth: "8rem" }}
        />
      </div>
      <RadioGroup legend={f.gender} name="gender" value={a.gender} options={[["female", f.female], ["male", f.male], ["other", f.other]]} onChange={(gender) => set({ gender })} />
      <Stepper {...stepper(f.size)} hint={f.sizeHint} min={kidsMin} value={a.size} onChange={(size) => set({ size })} />
      <div className="stepper-group">
        <Stepper {...stepper(f.under6)} value={a.childrenUnder6} max={12} onChange={(n) => setKids({ childrenUnder6: n })} />
        <Stepper {...stepper(f.girlsUnder10)} value={a.girlsUnder10} max={12} onChange={(n) => setKids({ girlsUnder10: n })} />
        <Stepper {...stepper(f.school)} value={a.schoolChildren} max={12} onChange={(n) => setKids({ schoolChildren: n })} />
      </div>
      <fieldset>
        <legend>{f.situations}</legend>
        <div className="check-list">
          <Check label={f.college} checked={a.collegeStudent} onChange={(collegeStudent) => set({ collegeStudent })} />
          <Check label={f.pregnant} checked={a.pregnant} onChange={(pregnant) => set({ pregnant })} />
          <Check label={f.senior60} checked={a.senior60 || a.senior70} onChange={(v) => set({ senior60: v, senior70: v && a.senior70 })} />
          <Check label={f.senior70} checked={a.senior70} onChange={(v) => set({ senior70: v, senior60: v || a.senior60 })} />
          <Check label={f.widow} checked={a.widow} onChange={(widow) => set({ widow })} />
        </div>
      </fieldset>
      <RadioGroup
        legend={f.disability}
        name="disability"
        value={a.disability}
        options={[["none", f.disabilityNone], ["some", f.disabilitySome], ["severe", f.disabilitySevere]]}
        onChange={(disability) => set({ disability })}
      />
    </>
  );
}

function CardsStep() {
  const { w, a, set } = useIn();
  const c = w.cards;
  return (
    <>
      <RadioGroup
        legend={c.category}
        name="category"
        value={a.category}
        options={[["general", c.general], ["obc", c.obc], ["sc", c.sc], ["st", c.st]]}
        onChange={(category) => set({ category })}
      />
      <div className="check-list">
        <Check label={c.minority} checked={a.minority} onChange={(minority) => set({ minority })} />
      </div>
      <RadioGroup
        legend={c.ration}
        name="ration"
        value={a.rationCard}
        options={[["none", c.rationNone], ["aay", c.rationAay], ["phh", c.rationPhh], ["other", c.rationOther]]}
        onChange={(rationCard) => set({ rationCard })}
      />
      <RadioGroup legend={c.bpl} name="bpl" value={a.bpl} options={[["yes", c.yes], ["no", c.no], ["unknown", c.dontKnow]]} onChange={(bpl) => set({ bpl })} />
      <div className="check-list">
        <Check label={c.bank} checked={a.hasBank} onChange={(hasBank) => set({ hasBank })} />
      </div>
      <fieldset>
        <legend>{c.already}</legend>
        <div className="check-list">
          {(["ayushman", "pmKisan", "eshram", "pension"] as const).map((k) => (
            <Check key={k} label={c[k]} checked={a.receives[k]} onChange={(v) => set({ receives: { ...a.receives, [k]: v } })} />
          ))}
        </div>
      </fieldset>
    </>
  );
}

function MoneyStep() {
  const { w, a, set, inIncome, update, locale } = useIn();
  const m = w.money;
  const change = (patch: Partial<IncomeInput>) => {
    const next = { ...inIncome, ...patch };
    update({ inIncome: next });
    set({ annualIncome: toMonthly(next) * 12 });
  };
  const yearly = toMonthly(inIncome) * 12;
  return (
    <>
      <MoneyField label={m.income} hint={m.incomeHint} symbol="₹" value={inIncome.amount} onChange={(amount) => change({ amount })} />
      <RadioGroup
        legend={m.per}
        name="income-per"
        value={inIncome.frequency === "yearly" ? "yearly" : "monthly"}
        options={[["monthly", m.monthly], ["yearly", m.yearly]]}
        onChange={(frequency) => change({ frequency })}
      />
      {inIncome.frequency !== "yearly" && yearly > 0 && (
        <p className="hint" aria-live="polite">{m.perYear(money(yearly, locale, "INR"))}</p>
      )}
      <div className="check-list">
        <Check label={m.taxPayer} checked={a.incomeTaxPayer} onChange={(incomeTaxPayer) => set({ incomeTaxPayer })} />
        <Check label={m.govtEmployee} checked={a.govtEmployee} onChange={(govtEmployee) => set({ govtEmployee })} />
        <Check label={m.formalJob} checked={a.formalJob} onChange={(formalJob) => set({ formalJob })} />
      </div>
    </>
  );
}

const WORK = ["farmer", "farmLabour", "worker", "vendor", "artisan", "business", "salaried", "student", "jobseeker", "homemaker"] as const;

function WorkStep() {
  const { w, a, set } = useIn();
  const k = w.work;
  return (
    <>
      <p className="lead">{k.lead}</p>
      <div className="check-list">
        {WORK.map((key) => (
          <Check key={key} label={k[key]} checked={a.work[key]} onChange={(v) => set({ work: { ...a.work, [key]: v } })} />
        ))}
      </div>
      {a.work.farmer && (
        <div className="field">
          <label htmlFor="in-land">{k.land}</label>
          <p className="hint" id="in-land-hint">{k.landHint}</p>
          <input
            id="in-land"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.1"
            value={a.landAcres || ""}
            aria-describedby="in-land-hint"
            onChange={(e) => set({ landAcres: Math.max(0, Number(e.target.value) || 0) })}
            style={{ maxWidth: "10rem" }}
          />
        </div>
      )}
      <div className="check-list">
        <Check label={k.firstJob} checked={a.firstJob} onChange={(firstJob) => set({ firstJob })} />
        <Check label={k.wantsLoan} checked={a.wantsLoan} onChange={(wantsLoan) => set({ wantsLoan })} />
      </div>
    </>
  );
}

function HomeStep() {
  const { w, a, set } = useIn();
  const h = w.home;
  return (
    <>
      <RadioGroup
        legend={h.type}
        name="home"
        value={a.home}
        options={[["pucca", h.pucca], ["kutcha", h.kutcha], ["none", h.none]]}
        onChange={(home) => set({ home, ownsHomeWithMeter: home === "pucca" && a.ownsHomeWithMeter })}
      />
      <div className="check-list">
        {a.home === "pucca" && <Check label={h.meter} checked={a.ownsHomeWithMeter} onChange={(ownsHomeWithMeter) => set({ ownsHomeWithMeter })} />}
        <Check label={h.lpg} checked={a.hasLpg} onChange={(hasLpg) => set({ hasLpg })} />
      </div>
    </>
  );
}
