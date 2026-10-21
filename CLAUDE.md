# BenefitBridge

Private, offline-first benefits screener (React + TypeScript + Vite). No backend: all answers stay in the browser.

## Commands
- `npm test` — Vitest: rules engine golden tests + EN/ES content completeness
- `npm run build` — typecheck + PWA build to `dist/`
- `npm run build:single` — one self-contained HTML file in `dist-single/`
- `npm run test:e2e` — Playwright + axe (needs `npm run build` and `npm run build:single` first; locally set `PW_CHROMIUM_PATH` if browsers are preinstalled)

## Rules
- Eligibility lives only in `src/lib/eligibility/` as pure functions. Programs return reason *keys*; all wording lives in `src/content/en.ts` and `es.ts`.
- Every threshold goes in a dated ruleset file with sources. Never edit a published ruleset — add a new one and update golden tests to the official tables.
- English and Spanish must stay in step (same reason keys; same number of documents, steps and FAQs, since checklists are saved by position). `content.test.ts` enforces this.
- Only link to official government or program sites for applying.
- Keep every screen passing the axe checks in `e2e/app.spec.ts`.
