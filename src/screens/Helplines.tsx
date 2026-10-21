import { Icon } from "../components/Icon";
import { directoryFor } from "../content/directory";
import { pick, telHref, type Helpline } from "../content/directory/types";
import { stateNameFor } from "../content/india/stateNames";
import { useApp } from "../lib/state";
import { stateName } from "../lib/states";

/** Free government numbers, emergency first, then the household's state. */
export function Helplines() {
  const { t, locale, country, answers } = useApp();
  const h = t.helplines;
  if (!country) return null;
  const state = answers[country].state;
  const all = directoryFor(country).helplines;
  const national = all.filter((x) => x.scope === "national").sort((a, b) => Number(!!b.emergency) - Number(!!a.emergency));
  const own = all.filter((x) => state && x.scope === state);
  const place = country === "IN" ? stateNameFor(state, locale) : stateName(state);
  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{h.title}</h1>
      <p className="lead">{h.lead}</p>
      {own.length > 0 && (
        <section>
          <h2>{h.state(place)}</h2>
          <NumberGrid items={own} />
        </section>
      )}
      <section>
        <h2>{h.national}</h2>
        <NumberGrid items={national} />
      </section>
    </div>
  );
}

function NumberGrid({ items }: { items: Helpline[] }) {
  const { locale } = useApp();
  return (
    <ul className="helpline-grid">
      {items.map((x) => (
        <li key={x.id}>
          <a className={`card helpline ${x.emergency ? "tone-health" : "tone-slate"}`} href={telHref(x.number)}>
            <span className="tone-icon" aria-hidden="true"><Icon name="phone" size={20} /></span>
            <span>
              <strong>{pick(x.name, locale)}</strong>
              <span className="muted small">{pick(x.what, locale)}</span>
            </span>
            <span className="call-number">{x.number}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
