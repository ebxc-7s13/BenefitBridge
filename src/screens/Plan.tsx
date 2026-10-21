import { Icon } from "../components/Icon";
import { longDate } from "../content/format";
import { linkUrl } from "../content/links";
import { canSaveFiles } from "../lib/ics";
import { href } from "../lib/router";
import { useApp } from "../lib/state";

export function Plan() {
  const { t, c, pack, locale, country, countryPlan: plan, answers, countryDone } = useApp();
  const ui = t.plan;
  if (!pack || !c || !country) return null;
  const ids = Object.keys(plan).filter((id) => c.programs[id]);
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
        <strong>{t.appName}</strong> — {ui.printTitle}
        <p>{ui.printFor}</p>
        <p>{ui.printedOn(longDate(today, locale))}</p>
        {countryDone && (
          <p>
            {ui.household}: {pack.summary(answers[country] as never, locale)}
          </p>
        )}
      </div>

      <h1 id="page-title" tabIndex={-1}>{ui.title}</h1>
      <p className="lead screen-only">{ui.lead}</p>

      {ids.length === 0 ? (
        <div className="card empty">
          <p>{ui.empty}</p>
          <a className="button" href={href(countryDone ? { name: "results" } : { name: "screener", step: 1 })}>{countryDone ? ui.emptyCta : t.home.start}</a>
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
                      <strong>{longDate(d.date, locale)}</strong> — {c.programs[d.id].name}: {d.kind === "interview" ? ui.interview : ui.renewal}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <ul className="plan-list">
            {ids.map((id) => {
              const item = plan[id]!;
              const p = c.programs[id];
              const link = pack.links[id];
              return (
                <li key={id} className="card plan-item">
                  <div className="plan-head">
                    <h2>{p.name}</h2>
                    <span className={`badge plan-${item.status}`}>{t.program.statuses[item.status]}</span>
                  </div>
                  <p className="muted">{ui.progress(item.docs.length, p.documents.length)}</p>
                  <div className="meter" aria-hidden="true">
                    <div style={{ width: `${(item.docs.length / p.documents.length) * 100}%` }} />
                  </div>
                  <ul className="print-docs">
                    {p.documents.map((doc, i) => (
                      <li key={doc} className={item.docs.includes(i) ? "done" : ""}>
                        {item.docs.includes(i) ? "☑" : "☐"} {doc}
                      </li>
                    ))}
                  </ul>
                  <p className="print-only">
                    {linkUrl(link, locale)}
                    {link.phone ? ` · ${link.phone}` : ""}
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
