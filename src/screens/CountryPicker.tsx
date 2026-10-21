import { Icon } from "../components/Icon";
import type { CountryCode } from "../content";
import { world } from "../content/world/directory";
import { go, href } from "../lib/router";
import { useApp } from "../lib/state";

const COUNTRIES: CountryCode[] = ["IN", "US"];

export function CountryPicker() {
  const { t, country, chooseCountry } = useApp();
  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{t.country.title}</h1>
      <p className="lead">{t.country.lead}</p>
      <ul className="country-list">
        {COUNTRIES.map((code) => (
          <li key={code}>
            <button
              type="button"
              className="card country-card"
              aria-current={country === code ? "true" : undefined}
              onClick={() => {
                chooseCountry(code);
                go({ name: "home" });
              }}
            >
              <span className="country-code" aria-hidden="true">{code}</span>
              <span>
                <strong>{t.country.names[code]}</strong>
                <span className="muted">{t.country.blurbs[code]}</span>
              </span>
              <Icon name="forward" />
            </button>
          </li>
        ))}
      </ul>
      {world.length > 0 && (
        <section>
          <h2>{t.world.pickerTitle}</h2>
          <p>{t.world.pickerBody}</p>
          <a className="button secondary" href={href({ name: "world" })}>
            {t.world.title} <Icon name="forward" />
          </a>
          <p className="muted language-row" lang="en">{world.map((x) => x.name).join(" · ")}</p>
        </section>
      )}
      <section className="card privacy-card">
        <Icon name="shield" size={28} />
        <div>
          <h2>{t.home.privacyTitle}</h2>
          <p>{t.home.privacyBody}</p>
        </div>
      </section>
    </div>
  );
}
