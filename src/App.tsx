import { useEffect } from "react";
import { Icon, type IconName } from "./components/Icon";
import { href, useRoute, type Route } from "./lib/router";
import { useApp } from "./lib/state";
import { Help } from "./screens/Help";
import { Home } from "./screens/Home";
import { Plan } from "./screens/Plan";
import { ProgramDetail } from "./screens/ProgramDetail";
import { Results } from "./screens/Results";
import { Screener } from "./screens/Screener";

const EXIT_URL = "https://weather.com/";

function quickExit() {
  try {
    window.top!.location.replace(EXIT_URL);
  } catch {
    window.location.replace(EXIT_URL);
  }
}

export function App() {
  const route = useRoute();
  const { t, locale, update, done } = useApp();

  // Move focus to the new page's heading so screen readers announce it.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("page-title")?.focus({ preventScroll: true });
  }, [route]);

  const tabs: { route: Route; label: string; icon: IconName; show: boolean }[] = [
    { route: { name: "home" }, label: t.ui.nav.home, icon: "home", show: true },
    { route: { name: "results" }, label: t.ui.nav.results, icon: "search", show: done },
    { route: { name: "plan" }, label: t.ui.nav.plan, icon: "list", show: true },
    { route: { name: "help" }, label: t.ui.nav.help, icon: "help", show: true },
  ];
  const active = route.name === "program" ? "results" : route.name === "screener" ? "home" : route.name;

  return (
    <>
      <a className="skip-link" href="#main">{t.ui.skipToContent}</a>
      <header className="app-header">
        <a className="brand" href={href({ name: "home" })} aria-label={`${t.ui.appName} — ${t.ui.nav.home}`}>
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 512 512">
            <rect width="512" height="512" rx="112" fill="var(--brand)" />
            <path d="M96 340c40-90 100-136 160-136s120 46 160 136M96 340h320M176 340v-60M256 340v-80M336 340v-60" stroke="var(--on-brand)" strokeWidth="34" strokeLinecap="round" fill="none" />
          </svg>
          <span>{t.ui.appName}</span>
        </a>
        <div className="header-actions">
          <button type="button" className="ghost-button" onClick={() => update({ locale: locale === "en" ? "es" : "en" })} lang={locale === "en" ? "es" : "en"}>
            <Icon name="globe" size={18} />
            {t.ui.language}
          </button>
          <button type="button" className="exit-button" onClick={quickExit} title={t.ui.quickExitHint}>
            <Icon name="exit" size={18} />
            {t.ui.quickExit}
          </button>
        </div>
      </header>

      <main id="main">
        {route.name === "home" && <Home />}
        {route.name === "screener" && <Screener step={route.step} />}
        {route.name === "results" && <Results />}
        {route.name === "program" && <ProgramDetail id={route.id} />}
        {route.name === "plan" && <Plan />}
        {route.name === "help" && <Help />}
      </main>

      <nav className="tab-bar" aria-label={t.ui.appName}>
        {tabs
          .filter((tab) => tab.show)
          .map((tab) => (
            <a key={tab.route.name} href={href(tab.route)} aria-current={active === tab.route.name ? "page" : undefined}>
              <Icon name={tab.icon} size={22} />
              <span>{tab.label}</span>
            </a>
          ))}
      </nav>
    </>
  );
}
