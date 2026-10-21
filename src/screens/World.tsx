import { Icon } from "../components/Icon";
import { world } from "../content/world/directory";
import { href } from "../lib/router";
import { useApp } from "../lib/state";
import { categoryIcon } from "./Results";

/** Official programs in countries we don't screen for yet. */
export function World({ code }: { code?: string }) {
  const { t } = useApp();
  const w = t.world;
  const country = code ? world.find((x) => x.code === code) : undefined;

  if (!country) {
    return (
      <div className="page">
        <h1 id="page-title" tabIndex={-1}>{w.title}</h1>
        <p className="lead">{w.lead}</p>
        <ul className="country-list">
          {world.map((x) => (
            <li key={x.code}>
              <a className="card country-card" href={href({ name: "world", code: x.code })}>
                <span className="country-code" aria-hidden="true">{x.code}</span>
                <span>
                  <strong lang="en">{x.name}</strong>
                  <span className="muted">{w.count(x.programs.length)}</span>
                </span>
                <Icon name="forward" />
              </a>
            </li>
          ))}
        </ul>
        <p className="fine-print">{w.note}</p>
      </div>
    );
  }

  return (
    <div className="page world">
      <a className="back-link" href={href({ name: "world" })}>
        <Icon name="back" size={18} /> {w.back}
      </a>
      <h1 id="page-title" tabIndex={-1} lang="en">{country.name}</h1>
      <p className="muted">{w.note}</p>

      <section className="card extra-card">
        <h2>{w.portal}</h2>
        <a className="button secondary" href={country.portal.url} target="_blank" rel="noopener noreferrer" lang="en">
          {country.portal.name} <Icon name="external" size={18} />
        </a>
        {country.helpline && (
          <p>
            {w.helpline}: <span lang="en">{country.helpline.name}</span> — <a href={`tel:${country.helpline.number.replace(/[^\d+]/g, "")}`}>{country.helpline.number}</a>
          </p>
        )}
      </section>

      <ul className="world-list" lang="en">
        {country.programs.map((p) => (
          <li key={p.id} className="card world-card">
            <h2>
              <Icon name={categoryIcon[p.category] ?? "list"} size={20} /> {p.name}
            </h2>
            <h3 lang={t.locale}>{w.whoFor}</h3>
            <p>{p.who}</p>
            <h3 lang={t.locale}>{w.gives}</h3>
            <p>{p.gives}</p>
            <details>
              <summary lang={t.locale}>
                {w.documents} · {w.apply}
              </summary>
              <h3 lang={t.locale}>{w.documents}</h3>
              <ul>
                {p.documents.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h3 lang={t.locale}>{w.apply}</h3>
              <ol>
                {p.apply.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </details>
            <a className="button secondary" href={p.url} target="_blank" rel="noopener noreferrer">
              <span lang={t.locale}>{w.official}</span> <Icon name="external" size={18} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
