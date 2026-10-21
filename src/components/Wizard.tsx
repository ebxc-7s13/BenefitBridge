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
  /** "profile" asks only the basic details and returns home; "screener" goes on to results. */
  mode?: "screener" | "profile";
  children: ReactNode;
}) {
  const { t, country, update, done } = useApp();
  const w = t.wizard;
  const { step, total } = props;
  const mode = props.mode ?? "screener";
  const to = (n: number) => (mode === "profile" ? go({ name: "profile", step: n }) : go({ name: "screener", step: n }));

  function next(e: FormEvent) {
    e.preventDefault();
    if (props.validate && !props.validate()) return;
    if (step < total) to(step + 1);
    else if (mode === "profile") go({ name: "home" });
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
      <p className="step-label">{mode === "profile" ? t.profile.title : w.stepOf(step, total)}</p>
      <h1 id="page-title" tabIndex={-1}>{props.title}</h1>
      {mode === "profile" && step === 1 && <p className="lead">{t.profile.lead}</p>}

      {props.children}

      <p className="fine-print privacy-inline">
        <Icon name="shield" size={16} /> {w.privacyNote}
      </p>

      <div className="wizard-nav">
        {step > 1 ? (
          <button type="button" className="button secondary" onClick={() => to(step - 1)}>
            <Icon name="back" /> {w.back}
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="button">
          {step === total ? (mode === "profile" ? t.profile.save : w.finish) : w.next} <Icon name="forward" />
        </button>
      </div>
    </form>
  );
}
