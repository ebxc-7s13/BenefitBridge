# Contributing to BenefitBridge

Thank you for helping people find the support they're entitled to. The most valuable contributions
are often not code:

- **Report a wrong link, number or amount** — open an issue with the "Wrong information" template and
  the official source.
- **Add a scheme or service** — tell us the state, the official website and who it's for.
- **Improve a translation** — native speakers of any of our 14 languages are very welcome.
- **Post a live update** — a dated notice for the home page goes in [`public/updates.json`](public/updates.json).

## Code

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # rules engines, content completeness in every language, directory checks
npm run build && npm run build:single
npm run test:e2e     # Playwright + axe accessibility checks
```

Ground rules (see [`CLAUDE.md`](CLAUDE.md) for the full list):

1. **Official sources only.** Every link must go to a government site. Never link to agents or
   private "sarkari" sites.
2. **Eligibility lives in the rules engines** (`src/lib/…`); wording lives in content files.
   Thresholds go in dated rules files with sources — add a new file instead of editing a published one.
3. **Every language stays in step.** The tests fail if a language misses a key.
4. **Private by design.** No accounts, analytics, trackers or servers that receive answers.
5. **Accessible.** Every screen must pass the axe checks in `e2e/app.spec.ts`.

By contributing you agree that your work is released under the [MIT License](LICENSE).
