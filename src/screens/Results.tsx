import { useState } from "react";
import { Icon, type IconName } from "../components/Icon";
import { reasonText } from "../content";
import { longDate, moneyRange } from "../content/format";
import { totals, type ProgramResult, type Status } from "../lib/core";
import { go, href } from "../lib/router";
import { useApp } from "../lib/state";

export const categoryIcon: Record<string, IconName> = {
  food: "food",
  health: "health",
  money: "money",
  home: "home",
  family: "family",
  work: "work",
  farm: "farm",
  security: "security",
  education: "education",
};

export function Results() {
  const { t, c, pack, locale, country, answers, results, countryDone, reset } = useApp();
  const r = t.results;
  const [showUnlikely, setShowUnlikely] = useState(false);

  if (!pack || !c || !countryDone || results.length === 0) {
    return (
      <div className="page">
        <h1 id="page-title" tabIndex={-1}>{r.title}</h1>
        <p>
          <a className="button" href={href({ name: "screener", step: 1 })}>{t.home.start}</a>
        </p>
      </div>
    );
  }

  // National programs first, in groups by status; the state's own programs get their own section below.
  const national = results.filter((x) => !x.state);
  const ownState = results.filter((x) => x.state);
  const by = (s: Status) => national.filter((x) => x.status === s);
  const stateFits = ownState.filter((x) => x.status !== "unlikely").length;
  const likely = by("likely");
  const possibly = by("possibly");
  const unlikely = by("unlikely");
  const sum = totals(results);
  const local = country ? pack.local(answers[country] as never, locale) : null;
  const range = (v: { low: number; high: number }) => moneyRange(v.low, v.high, locale, pack.currency, t.money.upTo);

  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{r.title}</h1>
      <p className="lead">
        {likely.length + possibly.length + stateFits > 0
          ? r.summary(likely.length + ownState.filter((x) => x.status === "likely").length, possibly.length + ownState.filter((x) => x.status === "possibly").length)
          : r.noneTitle}
      </p>

      {(sum.yearly.high > 0 || sum.once.high > 0) && (
        <section className="value-banner" aria-label={r.valueLabel}>
          <span className="value-label">{r.valueLabel}</span>
          {sum.yearly.high > 0 && (
            <>
              <strong className="value-amount">{range(sum.yearly)}</strong>
              <span className="value-note">{c.results.valueNote}</span>
            </>
          )}
          {sum.once.high > 0 && <span className="value-once">{r.onceLabel(moneyRange(sum.once.high, sum.once.high, locale, pack.currency, t.money.upTo))}</span>}
        </section>
      )}

      {likely.length + possibly.length + stateFits === 0 && <p className="card">{c.results.noneBody}</p>}

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

      {ownState.length > 0 && local && (
        <section className="result-group state-group" aria-labelledby="state-schemes">
          <h2 id="state-schemes">{r.stateTitle(local.place)}</h2>
          <p className="muted">{r.stateLead}</p>
          <ul className="result-list">
            {ownState.map((item) => (
              <li key={item.programId}>
                <ResultCard result={item} showStatus />
              </li>
            ))}
          </ul>
        </section>
      )}

      {local && (
        <section className="card extra-card">
          <h2>{c.results.local.title(local.place)}</h2>
          <p>{c.results.local.body}</p>
          {local.links.map((l) => (
            <a key={l.href} className="button secondary" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <Icon name="external" size={18} />
            </a>
          ))}
        </section>
      )}

      {c.results.extra && (
        <section className="card extra-card">
          <h2>{c.results.extra.title}</h2>
          <p>{c.results.extra.body}</p>
          {c.results.extra.links.map((l) => (
            <a key={l.href} className="button secondary" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} <Icon name="external" size={18} />
            </a>
          ))}
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
      <p className="fine-print">{r.disclaimer(longDate(pack.rules.effectiveFrom, locale))}</p>
    </div>
  );
}

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

function ResultCard({ result, showStatus }: { result: ProgramResult; showStatus?: boolean }) {
  const { t, c, pack, locale, countryPlan } = useApp();
  const p = c!.programs[result.programId];
  const category = pack!.categoryOf(result.programId);
  const v = result.value;
  return (
    <a className={`card result-card status-${result.status}`} href={href({ name: "program", id: result.programId })}>
      <div className="result-top">
        <span className="category">
          <Icon name={categoryIcon[category] ?? "list"} size={16} />
          {c!.categories[category]}
        </span>
        {showStatus && <span className={`chip status-chip status-${result.status}`}>{t.status[result.status]}</span>}
        {countryPlan[result.programId] && (
          <span className="chip">
            <Icon name="check" size={14} />
            {t.results.inPlan}
          </span>
        )}
      </div>
      <h3>{p.name}</h3>
      <p className="muted">{p.short}</p>
      {v && result.status !== "unlikely" && (
        <p className="result-value">
          {moneyRange(v.low, v.high, locale, pack!.currency, t.money.upTo)} <span>{v.once ? t.money.once : t.money.perYear}</span>
        </p>
      )}
      <p className="reason">{reasonText(c!, result.reasons[0])}</p>
      <span className="card-link">
        {t.results.details} <Icon name="forward" size={16} />
      </span>
    </a>
  );
}
