import { Icon } from "../components/Icon";
import { directoryFor } from "../content/directory";
import { stateNameFor } from "../content/india/stateNames";
import { directoryText } from "../content/india/directory";
import { jobText } from "../content/india/jobs";
import { pick } from "../content/directory/types";
import type { Education, IndianLocale } from "../content/types";
import { evaluateJob, type JobFit } from "../lib/jobs";
import { jobs2026 } from "../lib/india/jobs2026";
import { href } from "../lib/router";
import { useApp } from "../lib/state";
import { stateName } from "../lib/states";
import { ServiceList } from "./Services";

const LEVELS: Education[] = ["none", "8th", "10th", "12th", "iti", "diploma", "graduate", "postgraduate"];
const order: Record<JobFit, number> = { yes: 0, maybe: 1, no: 2 };

/** Government jobs and exams (India: checked against age, education and category), plus state jobs and training. */
export function Jobs() {
  const { t, locale, country, answers, setAnswers } = useApp();
  const j = t.jobs;
  if (!country) return null;
  const state = answers[country].state;
  const place = country === "IN" ? stateNameFor(state, locale) : stateName(state);
  const services = directoryFor(country).services.filter((s) => s.category === "jobs");
  const stateJobs = services.filter((s) => state && s.scope === state);
  const national = services.filter((s) => s.scope === "national");

  if (country !== "IN") {
    return (
      <div className="page">
        <h1 id="page-title" tabIndex={-1}>{j.title}</h1>
        <p className="lead">{j.lead}</p>
        <ServiceList items={national} />
        {stateJobs.length > 0 && (
          <>
            <h2>{j.statePsc(place)}</h2>
            <ServiceList items={stateJobs} />
          </>
        )}
      </div>
    );
  }

  const a = answers.IN;
  const person = { age: a.age, education: a.education ?? "", category: a.category };
  const results = jobs2026
    .map((rule) => ({ rule, r: evaluateJob(rule, person), text: jobText[rule.id], local: directoryText[locale as IndianLocale]?.jobs[rule.id] }))
    .filter((x) => x.text)
    .sort((x, y) => order[x.r.status] - order[y.r.status]);
  const label = (fit: JobFit) => (fit === "yes" ? j.eligible : fit === "no" ? j.notEligible : j.check);

  return (
    <div className="page">
      <h1 id="page-title" tabIndex={-1}>{j.title}</h1>
      <p className="lead">{j.lead}</p>

      <div className="field">
        <label htmlFor="education">{j.education}</label>
        <select id="education" value={a.education ?? ""} onChange={(e) => setAnswers("IN", { education: e.target.value as Education })}>
          <option value="">—</option>
          {LEVELS.map((l) => <option key={l} value={l}>{j.educationLevels[l]}</option>)}
        </select>
      </div>
      {!a.age && (
        <p className="notice">
          {j.needAge} <a href={href({ name: "profile", step: 2 })}>{t.hub.profileEdit}</a>
        </p>
      )}

      {stateJobs.length > 0 && (
        <section>
          <h2>{j.statePsc(place)}</h2>
          <ServiceList items={stateJobs} />
        </section>
      )}

      <h2>{t.hub.tiles.jobs[0]}</h2>
      <ul className="dir-list">
        {results.map(({ rule, r, text, local }) => (
          <li key={rule.id} className="card dir-item tone-work">
            <div className="dir-head">
              <span className="tone-icon" aria-hidden="true"><Icon name="work" size={22} /></span>
              <div>
                <span className={`job-status ${r.status}`}>{label(r.status)}</span>
                <h3>{local?.name ?? pick(text.name, locale)}</h3>
                <p>{local?.what ?? pick(text.what, locale)}</p>
              </div>
            </div>
            <p className="muted small job-facts">
              {rule.minEducation && rule.minEducation !== "b.ed" && <span>{j.minEducation(j.educationLevels[rule.minEducation as Education] ?? rule.minEducation)}</span>}
              {rule.minEducation === "b.ed" && <span>{j.minEducation("B.Ed")}</span>}
              {rule.ageMin !== undefined && r.ageMax !== undefined && <span>{j.age(rule.ageMin, r.ageMax)}</span>}
              {r.relaxed > 0 && <span>{j.relaxed(r.relaxed)}</span>}
              {text.usual && <span>{j.usually(local?.usual ?? pick(text.usual, locale))}</span>}
            </p>
            <div className="dir-actions">
              <a className="button" href={rule.url} target="_blank" rel="noopener noreferrer">
                {j.apply} <Icon name="external" size={16} />
              </a>
            </div>
          </li>
        ))}
      </ul>

      <h2>{j.training}</h2>
      <ServiceList items={national.filter((s) => !jobs2026.some((r) => s.url === r.url))} />
    </div>
  );
}
