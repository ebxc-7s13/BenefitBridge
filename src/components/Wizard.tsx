import type { FormEvent, ReactNode } from "react";
import { go } from "../lib/router";
import { useApp } from "../lib/state";
import { Icon } from "./Icon";

/** The frame around every questionnaire step: progress, title, privacy note and back/next buttons. */
export function WizardShell(props: {
  step: number;
  total: number;
  title: string;
  /** Return false to stay on this step (for example, when an answer is missing). */
  validate?: () => boolean;
  children: ReactNode;
}) {
  const { t, country, update, done } = useApp();
  const w = t.wizard;
  const { step, total } = props;

  function next(e: FormEvent) {
    e.preventDefault();
    if (props.validate && !props.validate()) return;
    if (step < total) go({ name: "screener", step: step + 1 });
    else {
      if (country) update({ done: { ...done, [country]: true } });
      go({ name: "results" });
    }
  }

  return (
    <form className="page wizard" onSubmit={next} noValidate>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <p className="step-label">{w.stepOf(step, total)}</p>
      <h1 id="page-title" tabIndex={-1}>{props.title}</h1>

      {props.children}

      <p className="fine-print privacy-inline">
        <Icon name="shield" size={16} /> {w.privacyNote}
      </p>

      <div className="wizard-nav">
        {step > 1 ? (
          <button type="button" className="button secondary" onClick={() => go({ name: "screener", step: step - 1 })}>
            <Icon name="back" /> {w.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="button">
          {step === total ? w.finish : w.next} <Icon name="forward" />
        </button>
      </div>
    </form>
  );
}
