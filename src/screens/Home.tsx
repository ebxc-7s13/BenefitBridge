import { Icon } from "../components/Icon";
import { Updates } from "../components/Updates";
import { href } from "../lib/router";
import { useApp } from "../lib/state";

export function Home() {
  const { t, c, countryDone } = useApp();
  const h = t.home;
  if (!c) return null;
  return (
    <div className="page">
      <section className="hero">
        <h1 id="page-title" tabIndex={-1}>{c.home.title}</h1>
        <p className="lead">{c.home.lead}</p>
        <div className="button-row">
          {countryDone ? (
            <>
              <a className="button" href={href({ name: "results" })}>{h.seeResults}</a>
              <a className="button secondary" href={href({ name: "screener", step: 1 })}>{h.resume}</a>
            </>
          ) : (
            <a className="button" href={href({ name: "screener", step: 1 })}>
              {h.start}
              <Icon name="forward" />
            </a>
          )}
        </div>
      </section>

      <Updates />

      <section className="card privacy-card">
        <Icon name="shield" size={28} />
        <div>
          <h2>{h.privacyTitle}</h2>
          <p>{h.privacyBody}</p>
        </div>
      </section>

      <section>
        <h2>{h.howTitle}</h2>
        <ol className="how-list">
          {h.how.map(([title, body]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{body}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>{c.home.programsTitle}</h2>
        <p>{c.home.programsBody}</p>
      </section>

      <p className="fine-print">
        {h.notGov} <a href={href({ name: "country" })}>{t.country.change}</a>
      </p>
    </div>
  );
}
