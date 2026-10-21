import { useState } from "react";
import { Check } from "../components/Fields";
import { Icon } from "../components/Icon";
import { longDate } from "../content/format";
import { href } from "../lib/router";
import { useApp } from "../lib/state";

export function Help() {
  const { t, c, pack, locale, save, textSize, update, reset } = useApp();
  const ui = t.help;
  const [deleted, setDeleted] = useState(false);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="page help">
      <h1 id="page-title" tabIndex={-1}>{ui.title}</h1>
      <p className="lead">{ui.lead}</p>

      <section className="card" aria-labelledby="text-size">
        <h2 id="text-size">{t.tools.textSize}</h2>
        <div className="size-row" role="group" aria-labelledby="text-size">
          {(["normal", "large", "xlarge"] as const).map((size) => (
            <button key={size} type="button" className={`button small ${size === textSize ? "" : "secondary"}`} aria-pressed={size === textSize} onClick={() => update({ textSize: size })}>
              {t.tools.sizes[size]}
            </button>
          ))}
        </div>
      </section>

      <p>
        <a className="button secondary" href={href({ name: "helplines" })}>
          <Icon name="phone" size={18} /> {t.helplines.title}
        </a>
      </p>

      {c ? (
        <ul className="help-list">
          {c.resources.map((r) => (
            <li key={r.title} className="card">
              <h2>{r.title}</h2>
              <p>{r.body}</p>
              <div className="button-row">
                {r.links.map((l, i) => (
                  <a
                    key={l.href}
                    className={`button ${i === 0 ? "" : "secondary"}`}
                    href={l.href}
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon name={l.href.startsWith("tel:") ? "phone" : "external"} size={18} /> {l.label}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <a className="button" href={href({ name: "country" })}>{t.country.title}</a>
        </p>
      )}

      <section className="card">
        <h2>{ui.privacyTitle}</h2>
        <p>{ui.privacyBody}</p>
        <Check label={ui.saveLabel} checked={save} onChange={(v) => update({ save: v })} />
        <p className="hint">{ui.saveHint}</p>
        {confirming ? (
          <div className="confirm" role="group" aria-labelledby="delete-question">
            <p id="delete-question"><strong>{ui.deleteConfirm}</strong></p>
            <div className="button-row">
              <button
                type="button"
                className="button danger"
                onClick={() => {
                  reset();
                  setConfirming(false);
                  setDeleted(true);
                }}
              >
                <Icon name="trash" size={18} /> {ui.deleteYes}
              </button>
              <button type="button" className="button secondary" onClick={() => setConfirming(false)}>
                {ui.cancel}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="button danger"
            onClick={() => {
              setDeleted(false);
              setConfirming(true);
            }}
          >
            <Icon name="trash" size={18} /> {ui.deleteAll}
          </button>
        )}
        <p role="status" className="notice-inline">
          {deleted ? ui.deleted : ""}
        </p>
      </section>

      <section className="card">
        <h2>{ui.install}</h2>
        <p>{ui.installBody}</p>
      </section>

      {pack && (
        <section>
          <h2>{ui.aboutTitle}</h2>
          <p>{ui.aboutBody(pack.rules.version, longDate(pack.rules.effectiveFrom, locale))}</p>
          <h3>{ui.sources}</h3>
          <ul className="sources">
            {pack.rules.sources.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer">{new URL(s).hostname.replace(/^www\./, "")}</a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
