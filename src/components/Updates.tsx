import { useEffect, useState } from "react";
import { dateTime, longDate } from "../content/format";
import { useApp } from "../lib/state";
import { localized, updatesFor } from "../lib/updates";
import { useUpdates } from "../lib/useUpdates";
import { Icon } from "./Icon";

const SHOWN = 3;

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Unread updates for the chosen country and state. */
export function useUnread(): number {
  const { country, answers, seen } = useApp();
  const { updates } = useUpdates();
  if (!country) return 0;
  return updatesFor(updates, country, answers[country].state, today()).filter((u) => !seen.includes(u.id)).length;
}

/** Dated notices for the chosen country and state, newest first. */
export function Updates() {
  const { t, locale, country, answers, seen, markSeen } = useApp();
  const { updates, status, checkedAt, refresh } = useUpdates();
  const [all, setAll] = useState(false);
  // Updates that were unread when they appeared stay marked "New" for this visit.
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set());
  const list = country ? updatesFor(updates, country, answers[country].state, today()) : [];
  const ids = list.map((u) => u.id).join(",");

  useEffect(() => {
    const unseen = ids ? ids.split(",").filter((id) => !seen.includes(id)) : [];
    if (unseen.length === 0) return;
    setFresh((prev) => new Set([...prev, ...unseen]));
    markSeen(unseen);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the list changes
  }, [ids]);

  const u = t.updates;
  const shown = all ? list : list.slice(0, SHOWN);
  return (
    <section className="updates" aria-labelledby="updates-title">
      <div className="updates-head">
        <h2 id="updates-title">
          <Icon name="bell" size={22} /> {u.title}
        </h2>
        <button type="button" className="link-button" onClick={refresh} disabled={status === "checking"}>
          {u.refresh}
        </button>
      </div>
      <p className="muted small" role="status">
        {status === "checking" ? u.checking : status === "ok" && checkedAt ? u.checked(dateTime(checkedAt, locale)) : u.offline}
      </p>
      {list.length === 0 ? (
        <p>{u.empty}</p>
      ) : (
        <ul className="update-list">
          {shown.map((item) => (
            <li key={item.id} className="card update-card">
              <p className="update-meta">
                <time dateTime={item.date}>{longDate(item.date, locale)}</time>
                {(fresh.has(item.id) || !seen.includes(item.id)) && <span className="chip new-chip">{u.new}</span>}
              </p>
              <h3>{localized(item.title, locale)}</h3>
              <p>{localized(item.body, locale)}</p>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {u.details} <Icon name="external" size={16} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {list.length > SHOWN && (
        <button type="button" className="link-button" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? u.less : u.more(list.length - SHOWN)}
        </button>
      )}
    </section>
  );
}
