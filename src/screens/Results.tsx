import { useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { reasonText } from "../content";
import { longDate, moneyRange } from "../content/format";
import { currentRuleset, programById, totalValue } from "../lib/eligibility/engine";
import type { ProgramResult, Status } from "../lib/eligibility/types";
import { go, href } from "../lib/router";
import { useApp } from "../lib/state";

export function Results() {
  const { t, locale, results, done, reset } = useApp();
  const r = t.ui.results;
  const [showUnlikely, setShowUnlikely] = useState(false);

  if (!done || results.length === 0) {
    return (
      <div className="page">
        <h1 id="page-title" tabIndex={-1}>{r.title}</h1>
        <p>
          <a className="button" href={href({ name: "screener", step: 1 })}>{t.ui.home.start}</a>
        </p>
      </div>
    );
  }

  const by = (s: Status) => results.filter((x) => x.status === s);
  const likely = by("likely");
  const possibly = by("possibly");
  const unlikely = by("unlikely");
  const total = totalValue(results);

  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{r.title}</h1>
      <p className="lead">{likely.length + possibly.length > 0 ? r.summary(likely.length, possibly.length) : r.noneTitle}</p>

      {total.high > 0 && (
        <section className="value-banner" aria-label={r.valueLabel}>
          <span className="value-label">{r.valueLabel}</span>
          <strong className="value-amount">{moneyRange(total.low, total.high, locale)}</strong>
          <span className="value-note">{r.valueNote}</span>
        </section>
      )}

      {likely.length + possibly.length === 0 && <p className="card">{r.noneBody}</p>}

      <ResultGroup title={r.groupLikely} items={likely} />
      <ResultGroup title={r.groupPossibly} items={possibly} />

      {unlikely.length > 0 && (
        <section>
          <button type="button" className="link-button" aria-expanded={showUnlikely} onClick={() => setShowUnlikely(!showUnlikely)}>
            {showUnlikely ? r.hideUnlikely : r.showUnlikely(unlikely.length)}
          </button>
          {showUnlikely && <ResultGroup title={r.groupUnlikely} items={unlikely} />}
        </section>
      )}

      <div className="button-row">
        <a className="button secondary" href={href({ name: "screener", step: 1 })}>{r.editAnswers}</a>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            reset();
            go({ name: "home" });
          }}
        >
          {r.startOver}
        </button>
      </div>
      <p className="fine-print">{r.disclaimer(longDate(currentRuleset.effectiveFrom, locale))}</p>
    </div>
  );
}

const categoryIcon: Record<string, IconName> = { food: "food", health: "health", money: "money", home: "home", family: "family" };

function ResultGroup({ title, items }: { title: string; items: ProgramResult[] }) {
  if (items.length === 0) return null;
  return (
    <section className="result-group">
      <h2>{title}</h2>
      <ul className="result-list">
        {items.map((item) => (
          <li key={item.programId}>
            <ResultCard result={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ResultCard({ result }: { result: ProgramResult }) {
  const { t, locale, plan } = useApp();
  const p = t.programs[result.programId];
  const category = programById[result.programId].category;
  return (
    <a className={`card result-card status-${result.status}`} href={href({ name: "program", id: result.programId })}>
      <div className="result-top">
        <span className="category">
          <Icon name={categoryIcon[category]} size={16} />
          {t.categories[category]}
        </span>
        {plan[result.programId] && (
          <span className="chip">
            <Icon name="check" size={14} />
            {t.ui.results.inPlan}
          </span>
        )}
      </div>
      <h3>{p.name}</h3>
      <p className="muted">{p.short}</p>
      {result.value && result.status !== "unlikely" && (
        <p className="result-value">
          {moneyRange(result.value.low, result.value.high, locale)} <span>{t.ui.results.perYear}</span>
        </p>
      )}
      <p className="reason">{reasonText(t, result.reasons[0])}</p>
      <span className="card-link">
        {t.ui.results.details} <Icon name="forward" size={16} />
      </span>
    </a>
  );
}
