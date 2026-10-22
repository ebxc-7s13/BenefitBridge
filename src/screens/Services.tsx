import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { ShareButton } from "../components/Tools";
import { directoryFor } from "../content/directory";
import { serviceIcon } from "../content/directory/icons";
import { pick, pickList, telHref, type Service } from "../content/directory/types";
import { stateNameFor } from "../content/india/stateNames";
import { SERVICE_CATEGORIES, type ServiceCategory } from "../content/types";
import { href } from "../lib/router";
import { useApp } from "../lib/state";
import { stateName } from "../lib/states";

/** Lower-case text with accents removed, for forgiving search. */
const fold = (s: string) => s.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "");

/** Every government service in one place: national or the household's state, by category, with search. */
export function Services({ category }: { category?: string }) {
  const { t, locale, country, answers } = useApp();
  const s = t.services;
  const state = country ? answers[country].state : "";
  const place = !state ? "" : country === "IN" ? stateNameFor(state, locale) : stateName(state);
  const [scope, setScope] = useState<"state" | "national">(state ? "state" : "national");
  const [query, setQuery] = useState("");
  const initial = (category ?? "").split(",").filter((c): c is ServiceCategory => (SERVICE_CATEGORIES as readonly string[]).includes(c));
  const [cats, setCats] = useState<ServiceCategory[]>(initial);

  const all = useMemo(() => (country ? directoryFor(country).services : []), [country]);
  const inScope = all.filter((x) => (scope === "national" ? x.scope === "national" : x.scope === state));
  const q = fold(query.trim());
  // A search looks everywhere, so people find "land records" without knowing whether it's a state service.
  const pool = q ? all.filter((x) => x.scope === "national" || x.scope === state) : inScope;
  const shown = pool.filter(
    (x) =>
      (cats.length === 0 || cats.includes(x.category)) &&
      (!q || fold(`${pick(x.name, locale)} ${pick(x.what, locale)} ${x.name.en} ${x.what.en} ${s.categories[x.category]}`).includes(q)),
  );
  const present = SERVICE_CATEGORIES.filter((c) => pool.some((x) => x.category === c));

  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{s.title}</h1>
      <p className="lead">{s.lead}</p>

      {state ? (
        <div className="segmented" role="group" aria-label={s.title}>
          <button type="button" aria-pressed={scope === "state"} onClick={() => setScope("state")}>{s.state(place)}</button>
          <button type="button" aria-pressed={scope === "national"} onClick={() => setScope("national")}>{s.national}</button>
        </div>
      ) : (
        <p className="card">
          {s.noState} <a href={href({ name: "profile", step: 1 })}>{t.hub.profileAdd}</a>
        </p>
      )}

      <div className="search-field">
        <Icon name="search" />
        <input type="search" aria-label={s.search} placeholder={s.search} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="chips" role="group" aria-label={s.title}>
        <button type="button" aria-pressed={cats.length === 0} onClick={() => setCats([])}>{s.all}</button>
        {present.map((c) => (
          <button key={c} type="button" aria-pressed={cats.includes(c)} onClick={() => setCats(cats.includes(c) ? cats.filter((x) => x !== c) : [c])}>
            {s.categories[c]}
          </button>
        ))}
      </div>

      <p className="muted small" role="status">{s.count(shown.length)}</p>
      {shown.length === 0 ? <p className="empty-state">{s.none}</p> : <ServiceList items={shown} />}
      <p className="fine-print">{s.verify}</p>
    </div>
  );
}

export function ServiceList({ items }: { items: Service[] }) {
  const { t, locale } = useApp();
  const s = t.services;
  return (
    <ul className="dir-list">
      {items.map((x) => {
        const docs = pickList(x.docs, locale);
        const steps = pickList(x.steps, locale);
        return (
          <li key={x.id} className={`card dir-item tone-${x.category}`}>
            <div className="dir-head">
              <span className="tone-icon" aria-hidden="true"><Icon name={serviceIcon[x.category]} size={22} /></span>
              <div>
                <h3>{pick(x.name, locale)}</h3>
                <p>{pick(x.what, locale)}</p>
              </div>
            </div>
            {(docs.length > 0 || steps.length > 0) && (
              <details>
                <summary>{docs.length > 0 ? s.papers : s.steps}</summary>
                {docs.length > 0 && (
                  <>
                    <h4 className="visually-hidden">{s.papers}</h4>
                    <ul>{docs.map((d) => <li key={d}>{d}</li>)}</ul>
                  </>
                )}
                {steps.length > 0 && (
                  <>
                    <h4>{s.steps}</h4>
                    <ol>{steps.map((d) => <li key={d}>{d}</li>)}</ol>
                  </>
                )}
              </details>
            )}
            <div className="dir-actions">
              {x.url && (
                <a className="button" href={x.url} target="_blank" rel="noopener noreferrer">
                  {s.open} <Icon name="external" size={16} />
                </a>
              )}
              {x.phone && (
                <a className="button secondary" href={telHref(x.phone)}>
                  <Icon name="phone" size={16} /> {s.call(x.phone)}
                </a>
              )}
              <ShareButton title={pick(x.name, locale)} text={[pick(x.what, locale), x.phone].filter(Boolean).join(" · ")} url={x.url ?? undefined} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
