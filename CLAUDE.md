# BenefitBridge

Private, offline-first benefits screener (React + TypeScript + Vite) for several countries (today: India and the United States). No backend: all answers stay in the browser.

## Commands
- `npm test` — Vitest: rules engine golden tests + content completeness for every country and language
- `npm run build` — typecheck + PWA build to `dist/`
- `npm run build:single` — one self-contained HTML file in `dist-single/`
- `npm run test:e2e` — Playwright + axe (needs `npm run build` and `npm run build:single` first; locally set `PW_CHROMIUM_PATH` if browsers are preinstalled)

## Layout
- `src/lib/<country>/` — that country's rules engine (pure functions). Shared result types live in `src/lib/core.ts`.
  State programs: India `src/lib/india/stateSchemes.ts` (+ `stateRules.ts`), US `src/lib/us/rulesets/stateCredits*.ts` (+ `stateCredits.ts`).
- `src/content/ui/` — screen text shared by every country (en, es, hi). `src/content/<country>/` — that country's questionnaire wording, scheme content, reasons and official links.
- `src/countries/index.ts` — one pack per country (rules, content, links, currency, languages, state portal card). Questionnaires are `src/countries/*Screener.tsx`.
- `src/content/world/` — directory of official programs in countries we don't screen yet (English only, no eligibility).
- Home-page updates: bundled in `src/content/updates.ts`; live ones go in `public/updates.json` on `main` (fetched from GitHub when online, no release needed).

## Rules
- Eligibility lives only in the rules engines. Programs return reason *keys*; all wording lives in the content files.
- Every threshold goes in a dated rules file with sources. Never edit a published rules file — add a new one and update golden tests to the official figures.
- Every language of a country must stay in step (same reason keys; same number of documents, steps and FAQs, since checklists are saved by position). `src/content/content.test.ts` enforces this, and that shared UI text exists in every language.
- Only link to official government or scheme portals for applying. Never put personal data in an update fetch.
- Keep every screen passing the axe checks in `e2e/app.spec.ts`.
