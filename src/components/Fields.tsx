import { useId, type ReactNode } from "react";
import { Icon } from "./Icon";

export function Stepper(props: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange(n: number): void;
  minusLabel: string;
  plusLabel: string;
  hint?: string;
}) {
  const id = useId();
  const { value, min = 0, max = 20, onChange } = props;
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Number.isFinite(n) ? Math.floor(n) : min)));
  return (
    <div className="field stepper">
      <label htmlFor={id}>{props.label}</label>
      {props.hint && <p className="hint" id={`${id}-hint`}>{props.hint}</p>}
      <div className="stepper-row">
        <button type="button" className="icon-button" onClick={() => set(value - 1)} disabled={value <= min} aria-label={props.minusLabel}>
          <Icon name="minus" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          aria-describedby={props.hint ? `${id}-hint` : undefined}
          onChange={(e) => set(Number(e.target.value))}
        />
        <button type="button" className="icon-button" onClick={() => set(value + 1)} disabled={value >= max} aria-label={props.plusLabel}>
          <Icon name="plus" />
        </button>
      </div>
    </div>
  );
}

export function MoneyField(props: { label: string; hint?: string; value: string; onChange(v: string): void; symbol?: string; children?: ReactNode }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{props.label}</label>
      {props.hint && <p className="hint" id={`${id}-hint`}>{props.hint}</p>}
      <div className="money-input">
        <span aria-hidden="true">{props.symbol ?? "$"}</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={props.value}
          placeholder="0"
          aria-describedby={props.hint ? `${id}-hint` : undefined}
          onChange={(e) => props.onChange(e.target.value.replace(/[^0-9.,]/g, ""))}
        />
      </div>
      {props.children}
    </div>
  );
}

export function Check(props: { label: string; checked: boolean; onChange(v: boolean): void }) {
  return (
    <label className="check">
      <input type="checkbox" checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
      <span className="check-box" aria-hidden="true">
        <Icon name="check" size={16} />
      </span>
      <span>{props.label}</span>
    </label>
  );
}

export function RadioGroup<V extends string>(props: {
  legend: string;
  name: string;
  value: V | "";
  options: [value: V, label: string][];
  onChange(v: V): void;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset className="field" aria-describedby={props.error ? `${id}-error` : undefined}>
      <legend>{props.legend}</legend>
      <div className="check-list">
        {props.options.map(([value, label]) => (
          <label key={value} className="check radio">
            <input type="radio" name={props.name} value={value} checked={props.value === value} onChange={() => props.onChange(value)} />
            <span className="check-box" aria-hidden="true">
              <Icon name="check" size={16} />
            </span>
            <span>{label}</span>
          </label>
        ))}
      </div>
      {props.error && <p className="error" id={`${id}-error`} role="alert">{props.error}</p>}
    </fieldset>
  );
}
