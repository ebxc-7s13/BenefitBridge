# BenefitBridge

**Find the help you already qualify for. It's private, in plain language, and takes about 3 minutes.**

Billions of dollars in food, health, energy and phone assistance go unclaimed every year, because
people don't know they qualify or the process is too confusing. BenefitBridge is a free web app for
phones that can be installed like a regular app (a PWA). It guides a household through four stages:
*discover → prepare → apply → keep it*.

> Status: **Phase 1 (MVP) foundation.** A screener and a rules engine covering 6 federal programs.
> See [`docs/PLAN.md`](docs/PLAN.md) for the full product and engineering plan.

## Principles
- **Private by default.** The screener runs entirely on the device: no account, no SSN, nothing sent.
- **Rules decide, AI explains.** Eligibility comes from a deterministic rules engine that is tested and cites its sources.
- **Honest about uncertainty.** Results say *likely*, *possibly* or *unlikely*, always with reasons.
- **Accessible.** Large tap targets, works on low-end phones, light and dark themes, plain language.

## Programs screened (MVP)
SNAP · Medicaid (adults) · Medicaid & CHIP (children) · WIC · LIHEAP · Lifeline

## Getting started
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # rules engine tests
npm run typecheck
npm run build
```

## Project layout
```
app/                      Next.js App Router pages (landing, screener)
lib/eligibility/
  engine.ts               screen(household) → ranked ProgramResult[]
  programs.ts             one pure evaluate() per program
  fpl.ts                  poverty-guideline math
  rulesets/2025.ts        versioned thresholds with sources (add a new file each year)
  engine.test.ts          golden tests against published tables
docs/PLAN.md              vision, roadmap, architecture, risks
```

## Updating rules
HHS poverty guidelines change every January, and SNAP limits change every October. To update,
add a new file in `lib/eligibility/rulesets/`, point `currentRuleset` at it, and add tests that
reproduce the official published tables. Never edit a published ruleset in place.

## Disclaimer
BenefitBridge is not a government service. Results are estimates, and the agency that runs each
program makes the final decision. For free help from a person, call or text **211**.
