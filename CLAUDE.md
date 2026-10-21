# BenefitBridge

Private, offline-first benefits screener (React + TypeScript + Vite) for several countries (today: India and the United States). No backend: all answers stay in the browser.

## Commands
- `npm test` — Vitest: rules engine golden tests + content completeness for every country and language
- `npm run build` — typecheck + PWA build to `dist/`
- `npm run build:single` — one self-contained HTML file in `dist-single/`
- `npm run test:e2e` — Playwright + axe (needs `npm run build` and `npm run build:single` first; locally set `PW_CHROMIUM_PATH` if browsers are preinstalled)

## Layout
- `src/lib/<country>/` — that country's rules engine (pure functions). Shared result types live in `src/lib/core.ts`.
- `src/content/ui/` — screen text shared by every country (en, es, hi). `src/content/<country>/` — that country's questionnaire wording, scheme content, reasons and official links.
- `src/countries/index.ts` — one pack per country (rules, content, links, currency, languages). Questionnaires are `src/countries/*Screener.tsx`.

## Rules
- Eligibility lives only in the rules engines. Programs return reason *keys*; all wording lives in the content files.
- Every threshold goes in a dated rules file with sources. Never edit a published rules file — add a new one and update golden tests to the official figures.
- Every language of a country must stay in step (same reason keys; same number of documents, steps and FAQs, since checklists are saved by position). `src/content/content.test.ts` enforces this, and that shared UI text exists in every language.
- Only link to official government or scheme portals for applying.
- Keep every screen passing the axe checks in `e2e/app.spec.ts`.
