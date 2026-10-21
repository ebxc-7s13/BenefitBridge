import { Icon } from "../components/Icon";
import { longDate, money } from "../content/format";
import { applyUrl, programLinks } from "../content/links";
import type { ProgramId } from "../lib/eligibility/types";
import { canSaveFiles } from "../lib/ics";
import { href } from "../lib/router";
import { useApp } from "../lib/state";
import { stateName } from "../lib/states";

export function Plan() {
  const { t, locale, plan, answers, done } = useApp();
  const ui = t.ui.plan;
  const ids = Object.keys(plan) as ProgramId[];
  const today = new Date().toISOString().slice(0, 10);

  const dates = ids
    .flatMap((id) =>
      (["interview", "renewal"] as const)
        .filter((k) => plan[id]?.[k])
        .map((k) => ({ id, kind: k, date: plan[id]![k]! })),
    )
    .filter((d) => d.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="page plan">
      <div className="print-only print-header">
        <strong>{t.ui.appName}</strong> — {ui.printTitle}
        <p>{ui.printFor}</p>
        <p>{ui.printedOn(longDate(today, locale))}</p>
        {done && (
          <p>
            {ui.household}: {stateName(answers.state)} · {answers.size} · {money(answers.monthlyEarned + answers.monthlyOther, locale)}
            {t.ui.money.perMonth}
          </p>
        )}
      </div>

      <h1 id="page-title" tabIndex={-1}>{ui.title}</h1>
      <p className="lead screen-only">{ui.lead}</p>

      {ids.length === 0 ? (
        <div className="card empty">
          <p>{ui.empty}</p>
          <a className="button" href={href(done ? { name: "results" } : { name: "screener", step: 1 })}>{done ? ui.emptyCta : t.ui.home.start}</a>
        </div>
      ) : (
        <>
          <section>
            <h2>{ui.upcoming}</h2>
            {dates.length === 0 ? (
              <p className="muted">{ui.noDates}</p>
            ) : (
              <ul className="date-list">
                {dates.map((d) => (
                  <li key={`${d.id}-${d.kind}`}>
                    <Icon name="calendar" size={18} />
                    <span>
                      <strong>{longDate(d.date, locale)}</strong> — {t.programs[d.id].name}: {d.kind === "interview" ? ui.interview : ui.renewal}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <ul className="plan-list">
            {ids.map((id) => {
              const item = plan[id]!;
              const c = t.programs[id];
              const phone = programLinks[id].phone;
              return (
                <li key={id} className="card plan-item">
                  <div className="plan-head">
                    <h2>{c.name}</h2>
                    <span className={`badge plan-${item.status}`}>{t.ui.program.statuses[item.status]}</span>
                  </div>
                  <p className="muted">{ui.progress(item.docs.length, c.documents.length)}</p>
                  <div className="meter" aria-hidden="true">
                    <div style={{ width: `${(item.docs.length / c.documents.length) * 100}%` }} />
                  </div>
                  <ul className="print-docs">
                    {c.documents.map((doc, i) => (
                      <li key={doc} className={item.docs.includes(i) ? "done" : ""}>
                        {item.docs.includes(i) ? "☑" : "☐"} {doc}
                      </li>
                    ))}
                  </ul>
                  <p className="print-only">
                    {applyUrl(id, locale)}
                    {phone ? ` · ${phone}` : ""}
                  </p>
                  <a className="card-link screen-only" href={href({ name: "program", id })}>
                    {ui.open} <Icon name="forward" size={16} />
                  </a>
                </li>
              );
            })}
          </ul>

          {canSaveFiles && (
            <button type="button" className="button secondary screen-only" onClick={() => window.print()}>
              <Icon name="print" size={18} /> {ui.print}
            </button>
          )}
        </>
      )}
    </div>
  );
}
