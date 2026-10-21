"use client";

import { useState } from "react";
import { currentRuleset, screen } from "@/lib/eligibility/engine";
import type { Household, ProgramResult } from "@/lib/eligibility/types";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const SITUATIONS = [
  ["pregnant", "Someone is pregnant or just had a baby"],
  ["hasChildUnder5", "A child under 5"],
  ["hasChildUnder19", "A child under 19"],
  ["hasSenior", "Someone 60 or older"],
  ["hasDisability", "Someone with a disability"],
] as const;

const CURRENT = [
  ["snap", "SNAP / food stamps"],
  ["medicaid", "Medicaid"],
  ["ssi", "SSI"],
  ["tanf", "TANF / cash assistance"],
] as const;

const LABEL = { likely: "Likely eligible", possibly: "Possibly eligible", unlikely: "Probably not eligible" };

export default function Screener() {
  const [results, setResults] = useState<ProgramResult[] | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const has = (k: string) => f.get(k) === "on";
    const household: Household = {
      state: String(f.get("state")),
      size: Number(f.get("size")),
      monthlyGrossIncome: Number(f.get("income")) || 0,
      pregnant: has("pregnant"),
      hasChildUnder5: has("hasChildUnder5"),
      hasChildUnder19: has("hasChildUnder19") || has("hasChildUnder5"),
      hasSenior: has("hasSenior"),
      hasDisability: has("hasDisability"),
      receives: { snap: has("snap"), medicaid: has("medicaid"), ssi: has("ssi"), tanf: has("tanf") },
    };
    setResults(screen(household));
    requestAnimationFrame(() => document.getElementById("results")?.focus());
  }

  return (
    <main>
      <h1>Check what you qualify for</h1>
      <p className="notice">Your answers never leave this device.</p>

      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="state">Which state do you live in?</label>
          <select id="state" name="state" required defaultValue="">
            <option value="" disabled>Choose a state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </fieldset>

        <fieldset>
          <label htmlFor="size">How many people live in your home, including you?</label>
          <input id="size" name="size" type="number" min={1} max={20} defaultValue={1} required />
        </fieldset>

        <fieldset>
          <label htmlFor="income">Total monthly income before taxes, for everyone ($)</label>
          <input id="income" name="income" type="number" min={0} step={1} inputMode="numeric" required />
          <p className="notice">Include wages, Social Security, child support and unemployment.</p>
        </fieldset>

        <fieldset>
          <legend>Does your home include… (check all that apply)</legend>
          {SITUATIONS.map(([k, label]) => (
            <label key={k} className="check"><input type="checkbox" name={k} /> {label}</label>
          ))}
        </fieldset>

        <fieldset>
          <legend>Do you already get any of these?</legend>
          {CURRENT.map(([k, label]) => (
            <label key={k} className="check"><input type="checkbox" name={k} /> {label}</label>
          ))}
        </fieldset>

        <button className="button" type="submit">See my results</button>
      </form>

      {results && (
        <section id="results" tabIndex={-1} aria-live="polite">
          <h2>Your results</h2>
          {results.map((r) => (
            <article key={r.programId} className="card result">
              <span className={`badge ${r.status}`}>{LABEL[r.status]}</span>
              <h3>{r.name}</h3>
              <p style={{ marginBottom: 0 }}>{r.summary}</p>
              <ul>{r.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
              {r.status !== "unlikely" && (
                <a href={r.applyUrl} target="_blank" rel="noopener noreferrer">How to apply →</a>
              )}
            </article>
          ))}
          <p className="notice">
            These are estimates based on rules updated {currentRuleset.effectiveFrom}. The agency makes the final
            decision. Free help: call or text 211.
          </p>
        </section>
      )}
    </main>
  );
}
