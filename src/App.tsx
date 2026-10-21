import { useEffect } from "react";
import { Icon, type IconName } from "./components/Icon";
import { useUnread } from "./components/Updates";
import { InScreener } from "./countries/InScreener";
import { UsScreener } from "./countries/UsScreener";
import { LANGUAGES } from "./content/languages";
import { href, useRoute, type Route } from "./lib/router";
import { useApp } from "./lib/state";
import { CountryPicker } from "./screens/CountryPicker";
import { Help } from "./screens/Help";
import { Home } from "./screens/Home";
import { Plan } from "./screens/Plan";
import { ProgramDetail } from "./screens/ProgramDetail";
import { Results } from "./screens/Results";
import { Helplines } from "./screens/Helplines";
import { Jobs } from "./screens/Jobs";
import { Services } from "./screens/Services";
import { World } from "./screens/World";

const EXIT_URL = "https://weather.com/";

function quickExit() {
  try {
    window.top!.location.replace(EXIT_URL);
  } catch {
    window.location.replace(EXIT_URL);
  }
}

const screeners = { US: UsScreener, IN: InScreener };

export function App() {
  const route = useRoute();
  const { t, locale, locales, country, toggleLocale } = useApp();
  const unread = useUnread();

  // Move focus to the new page's heading so screen readers announce it.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("page-title")?.focus({ preventScroll: true });
  }, [route, country]);

  const tabs: { route: Route; label: string; icon: IconName; show: boolean }[] = [
    { route: { name: "home" }, label: t.nav.home, icon: "home", show: true },
    { route: { name: "results" }, label: t.nav.results, icon: "sparkle", show: !!country },
    { route: { name: "services" }, label: t.nav.services, icon: "id", show: !!country },
    { route: { name: "jobs" }, label: t.nav.jobs, icon: "work", show: !!country },
    { route: { name: "help" }, label: t.nav.help, icon: "help", show: true },
  ];
  const sections: Partial<Record<Route["name"], Route["name"]>> = {
    program: "results",
    screener: "results",
    plan: "results",
    helplines: "help",
    profile: "home",
    country: "home",
    world: "home",
  };
  const active = sections[route.name] ?? route.name;

  const nextLocale = locales[(locales.indexOf(locale) + 1) % locales.length];
  const Screener = country ? screeners[country] : null;
  // Everything country-specific waits until a country is chosen.
  const needsCountry = !country && route.name !== "help" && route.name !== "world";

  return (
    <>
      <a className="skip-link" href="#main">{t.skipToContent}</a>
      <header className="app-header">
        <a className="brand" href={href({ name: "home" })} aria-label={`${t.appName} — ${t.nav.home}`}>
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 512 512">
            <rect width="512" height="512" rx="112" fill="var(--brand)" />
            <path d="M96 340c40-90 100-136 160-136s120 46 160 136M96 340h320M176 340v-60M256 340v-80M336 340v-60" stroke="var(--on-brand)" strokeWidth="34" strokeLinecap="round" fill="none" />
          </svg>
          <span>{t.appName}</span>
        </a>
        <div className="header-actions">
          {country && (
            <a className="ghost-button country-chip" href={href({ name: "country" })} aria-label={`${country} — ${t.country.change}`} title={t.country.names[country]}>
              {country}
            </a>
          )}
          <button type="button" className="ghost-button" onClick={toggleLocale} lang={nextLocale}>
            <Icon name="globe" size={18} />
            {LANGUAGES[nextLocale].name}
          </button>
          <button type="button" className="exit-button" onClick={quickExit} title={t.quickExitHint}>
            <Icon name="exit" size={18} />
            {t.quickExit}
          </button>
        </div>
      </header>

      <main id="main">
        {(needsCountry || route.name === "country") && <CountryPicker />}
        {!needsCountry && route.name === "home" && <Home />}
        {!needsCountry && route.name === "screener" && Screener && <Screener step={route.step} />}
        {!needsCountry && route.name === "results" && <Results />}
        {!needsCountry && route.name === "program" && <ProgramDetail id={route.id} />}
        {!needsCountry && route.name === "plan" && <Plan />}
        {route.name === "help" && <Help />}
        {route.name === "world" && <World code={route.code} />}
        {!needsCountry && route.name === "profile" && Screener && <Screener step={route.step} mode="profile" />}
        {!needsCountry && route.name === "services" && <Services key={route.category ?? ""} category={route.category} />}
        {!needsCountry && route.name === "jobs" && <Jobs />}
        {!needsCountry && route.name === "helplines" && <Helplines />}
      </main>

      <nav className="tab-bar" aria-label={t.appName}>
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <a key={tab.route.name} href={href(tab.route)} aria-current={active === tab.route.name ? "page" : undefined}>
              <Icon name={tab.icon} size={22} />
              <span>{tab.label}</span>
              {tab.route.name === "home" && unread > 0 && active !== "home" && (
                <span className="tab-badge">
                  <span aria-hidden="true">{unread}</span>
                  <span className="visually-hidden">{t.updates.unread(unread)}</span>
                </span>
              )}
            </a>
          ))}
      </nav>
    </>
  );
}
