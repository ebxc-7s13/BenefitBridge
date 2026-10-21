import { Icon } from "../components/Icon";
import { reasonText } from "../content";
import { moneyRange } from "../content/format";
import { linkUrl } from "../content/links";
import { calendarFile, canSaveFiles, downloadCalendar } from "../lib/ics";
import { href } from "../lib/router";
import { useApp, type PlanStatus } from "../lib/state";

const STATUSES: PlanStatus[] = ["todo", "applying", "applied", "approved", "denied"];

export function ProgramDetail({ id }: { id: string }) {
  const { t, c, pack, locale, results, countryPlan, setPlanItem } = useApp();
  const content = c?.programs[id];
  if (!pack || !c || !content) {
    return (
      <div className="page">
        <h1 id="page-title" tabIndex={-1}>{t.results.title}</h1>
        <a href={href({ name: "results" })}>{t.program.back}</a>
      </div>
    );
  }
  const result = results.find((r) => r.programId === id);
  const ui = t.program;
  const item = countryPlan[id];
  const link = pack.links[id];
  const url = linkUrl(link, locale);

  const toggleDoc = (i: number, on: boolean) => {
    const docs = new Set(item?.docs ?? []);
    if (on) docs.add(i);
    else docs.delete(i);
    // Gathering papers means the person has started.
    const status = !item || item.status === "todo" ? "applying" : item.status;
    setPlanItem(id, { docs: [...docs].sort((a, b) => a - b), status });
  };

  const addToCalendar = (kind: "interview" | "renewal", date: string) => {
    const title = kind === "interview" ? ui.calendarInterview(content.name) : ui.calendarRenewal(content.name);
    downloadCalendar(`${id}-${kind}.ics`, calendarFile(title, date, `${content.name} — ${url}`, `${id}-${kind}-${date}`));
  };

  return (
    <article className="page program">
      <a className="back-link" href={href({ name: "results" })}>
        <Icon name="back" size={18} /> {ui.back}
      </a>
      <h1 id="page-title" tabIndex={-1}>{content.name}</h1>
      {result && <span className={`badge status-${result.status}`}>{t.status[result.status]}</span>}
      <p className="lead">{content.short}</p>

      {result && (
        <section className="card">
          <h2>{ui.why}</h2>
          <ul className="reasons">
            {result.reasons.map((r) => (
              <li key={r.key}>{reasonText(c, r)}</li>
            ))}
          </ul>
          {result.value && result.status !== "unlikely" && (
            <p className="result-value">
              {ui.estimate}: {moneyRange(result.value.low, result.value.high, locale, pack.currency, t.money.upTo)}{" "}
              <span>{result.value.once ? t.money.once : t.money.perYear}</span>
            </p>
          )}
        </section>
      )}

      <div className="button-row">
        <a className="button" href={url} target="_blank" rel="noopener noreferrer">
          {content.applyLabel} <Icon name="external" size={18} />
        </a>
        {link.phone && (
          <a className="button secondary" href={`tel:${link.phone.replace(/[^0-9]/g, "")}`}>
            <Icon name="phone" size={18} /> {ui.call(link.phone)}
          </a>
        )}
      </div>

      <section>
        <h2>{ui.about}</h2>
        <p>{content.about}</p>
      </section>

      <section>
        <h2>{ui.documents}</h2>
        <p className="hint">{ui.documentsHint}</p>
        <ul className="doc-list">
          {content.documents.map((doc, i) => (
            <li key={doc}>
              <label className="check">
                <input type="checkbox" checked={item?.docs.includes(i) ?? false} onChange={(e) => toggleDoc(i, e.target.checked)} />
                <span className="check-box" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
                <span>{doc}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>{ui.steps}</h2>
        <ol className="steps">
          {content.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="card track">
        <h2>{ui.trackTitle}</h2>
        {item ? (
          <>
            <div className="field">
              <label htmlFor="plan-status">{ui.statusLabel}</label>
              <select id="plan-status" value={item.status} onChange={(e) => setPlanItem(id, { status: e.target.value as PlanStatus })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{ui.statuses[s]}</option>
                ))}
              </select>
            </div>
            {item.status === "denied" && <p className="notice">{c.deniedHelp}</p>}
            <h3>{ui.dates}</h3>
            {(["interview", "renewal"] as const).map((kind) => (
              <div className="field date-field" key={kind}>
                <label htmlFor={`date-${kind}`}>{kind === "interview" ? ui.interviewDate : ui.renewalDate}</label>
                <div className="date-row">
                  <input id={`date-${kind}`} type="date" value={item[kind] ?? ""} onChange={(e) => setPlanItem(id, { [kind]: e.target.value || undefined })} />
                  {item[kind] && canSaveFiles && (
                    <button type="button" className="button secondary small" onClick={() => addToCalendar(kind, item[kind]!)}>
                      <Icon name="calendar" size={18} /> {ui.addToCalendar}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="link-button danger" onClick={() => setPlanItem(id, null)}>
              {ui.removeFromPlan}
            </button>
          </>
        ) : (
          <button type="button" className="button" onClick={() => setPlanItem(id, {})}>
            <Icon name="plus" size={18} /> {ui.addToPlan}
          </button>
        )}
      </section>

      <section>
        <h2>{ui.faq}</h2>
        {content.faq.map(([q, a]) => (
          <details key={q} className="faq">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </article>
  );
}
