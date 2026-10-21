import { Icon, type IconName } from "../components/Icon";
import { Updates } from "../components/Updates";
import { stateNameFor } from "../content/india/stateNames";
import type { HubTile } from "../content/types";
import { href, type Route } from "../lib/router";
import { useApp } from "../lib/state";
import { stateName } from "../lib/states";

const TILES: { id: HubTile; icon: IconName; tone: string; route?: Route }[] = [
  { id: "schemes", icon: "sparkle", tone: "money", route: { name: "results" } },
  { id: "services", icon: "home", tone: "home", route: { name: "services" } },
  { id: "jobs", icon: "work", tone: "work", route: { name: "jobs" } },
  { id: "documents", icon: "id", tone: "identity", route: { name: "services", category: "identity,certificates" } },
  { id: "helplines", icon: "phone", tone: "health", route: { name: "helplines" } },
  { id: "plan", icon: "list", tone: "education", route: { name: "plan" } },
  { id: "updates", icon: "bell", tone: "food" },
  { id: "world", icon: "globe", tone: "farm", route: { name: "world" } },
];

export function Home() {
  const { t, c, locale, country, answers, countryDone } = useApp();
  const h = t.home;
  if (!c || !country) return null;
  const a = answers[country];
  const place = !a.state ? "" : country === "IN" ? stateNameFor(a.state, locale) : stateName(a.state);

  return (
    <div className="page">
      <section className="hero">
        <span className="eyebrow">{t.hub.greeting}</span>
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

      <section className="card profile-card tone-security" aria-labelledby="profile-title">
        <span className="tone-icon" aria-hidden="true"><Icon name="user" size={22} /></span>
        <div>
          <strong id="profile-title">{t.hub.profileTitle}</strong>
          <p className="muted">{place ? t.hub.profileSummary(place, a.size) : t.hub.profileEmpty}</p>
        </div>
        <a className="button small secondary" href={href({ name: "profile", step: 1 })}>{place ? t.hub.profileEdit : t.hub.profileAdd}</a>
      </section>

      <h2>{t.hub.explore}</h2>
      <ul className="tiles">
        {TILES.map((tile) => {
          const [title, sub] = t.hub.tiles[tile.id];
          const body = (
            <>
              <span className="tone-icon" aria-hidden="true"><Icon name={tile.icon} size={22} /></span>
              <strong>{title}</strong>
              <span className="muted">{sub}</span>
            </>
          );
          return (
            <li key={tile.id}>
              {tile.route ? (
                <a className={`tile tone-${tile.tone}`} href={href(tile.route)}>{body}</a>
              ) : (
                <button type="button" className={`tile tone-${tile.tone}`} onClick={() => document.getElementById("updates-title")?.scrollIntoView({ behavior: "smooth" })}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Updates />

      <section className="card privacy-card">
        <Icon name="shield" size={28} />
        <div>
          <h2>{h.privacyTitle}</h2>
          <p>{h.privacyBody}</p>
        </div>
      </section>

      <p className="fine-print">
        {h.notGov} <a href={href({ name: "country" })}>{t.country.change}</a>
      </p>
    </div>
  );
}
