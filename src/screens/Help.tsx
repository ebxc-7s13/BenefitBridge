import { useState } from "react";
import { Check } from "../components/Fields";
import { Icon } from "../components/Icon";
import { longDate } from "../content/format";
import { helpLinks } from "../content/links";
import { currentRuleset } from "../lib/eligibility/engine";
import { go } from "../lib/router";
import { useApp } from "../lib/state";

export function Help() {
  const { t, locale, save, update, reset } = useApp();
  const ui = t.ui.help;
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="page help">
      <h1 id="page-title" tabIndex={-1}>{ui.title}</h1>
      <p className="lead">{ui.lead}</p>

      <ul className="help-list">
        <li className="card">
          <h2>{ui.call211}</h2>
          <p>{ui.call211Body}</p>
          <div className="button-row">
            <a className="button" href="tel:211">
              <Icon name="phone" size={18} /> 211
            </a>
            <a className="button secondary" href={helpLinks["211"]} target="_blank" rel="noopener noreferrer">
              211.org <Icon name="external" size={18} />
            </a>
          </div>
        </li>
        <li className="card">
          <h2>{ui.legal}</h2>
          <p>{ui.legalBody}</p>
          <a href={helpLinks.legal} target="_blank" rel="noopener noreferrer">LawHelp.org</a>
        </li>
        <li className="card">
          <h2>{ui.immigration}</h2>
          <p>{ui.immigrationBody}</p>
          <a href={helpLinks.immigration} target="_blank" rel="noopener noreferrer">ImmigrationAdvocates.org</a>
        </li>
        <li className="card">
          <h2>{ui.safety}</h2>
          <p>{ui.safetyBody}</p>
          <a href={`tel:${helpLinks.dvHotline.replace(/-/g, "")}`}>{helpLinks.dvHotline}</a>
        </li>
        <li className="card">
          <h2>{ui.crisis}</h2>
          <p>{ui.crisisBody}</p>
          <a href={`tel:${helpLinks.crisis}`}>988</a>
        </li>
      </ul>

      <section className="card">
        <h2>{ui.privacyTitle}</h2>
        <p>{ui.privacyBody}</p>
        <Check label={ui.saveLabel} checked={save} onChange={(v) => update({ save: v })} />
        <p className="hint">{ui.saveHint}</p>
        <button
          type="button"
          className="button danger"
          onClick={() => {
            if (!window.confirm(ui.deleteConfirm)) return;
            reset();
            setDeleted(true);
          }}
        >
          <Icon name="trash" size={18} /> {ui.deleteAll}
        </button>
        <p role="status" className="notice-inline">
          {deleted ? ui.deleted : ""}
        </p>
      </section>

      <section className="card">
        <h2>{ui.install}</h2>
        <p>{ui.installBody}</p>
      </section>

      <section>
        <h2>{ui.aboutTitle}</h2>
        <p>{ui.aboutBody(currentRuleset.version, longDate(currentRuleset.effectiveFrom, locale))}</p>
        <h3>{ui.sources}</h3>
        <ul className="sources">
          {currentRuleset.sources.map((s) => (
            <li key={s}>
              <a href={s} target="_blank" rel="noopener noreferrer">{new URL(s).hostname.replace(/^www\./, "")}</a>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="link-button" onClick={() => go({ name: "home" })}>
        {t.ui.nav.home}
      </button>
    </div>
  );
}
