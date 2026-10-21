# BenefitBridge — Product & Engineering Plan

## 1. The problem

Every year, tens of billions of dollars in public benefits go unclaimed in the US.
Roughly 1 in 5 people eligible for the Earned Income Tax Credit don't claim it.
Millions of people who qualify for SNAP (food assistance), WIC, Medicaid, energy
assistance and phone/internet discounts never apply.

People don't skip them because they don't need the help. They skip them because:

1. **They don't know they qualify.** The rules are scattered across dozens of agencies,
   and people assume "I work, so I probably make too much."
2. **The process is hard.** Long forms, unclear document requirements and confusing
   language put people off.
3. **They drop out partway.** Missed interviews, missing paperwork and lapsed renewals.
   Many people lose benefits through "churn" even while still eligible.

## 2. The solution

BenefitBridge is a free, private, plain-language guide that takes a household from
*"I'm struggling"* to *"I'm enrolled and I'm staying enrolled"*:

| Stage      | What BenefitBridge does                                                              |
|------------|--------------------------------------------------------------------------------------|
| Discover   | A 3-minute screener shows every program the household likely qualifies for, with an estimated value. |
| Prepare    | A personalized document checklist (pay stubs, ID, lease…), with phone-camera capture.  |
| Apply      | Step-by-step guidance to the right state portal, with answers pre-drafted from the screener. |
| Follow up  | Interview reminders, a deadline calendar and "what happens next" explanations.      |
| Keep it    | Renewal reminders, so people don't lose benefits they still qualify for.            |

### Who it's for
- **Primary:** low-income working families, seniors, people with disabilities,
  new parents, and people who just lost a job.
- **Secondary:** caseworkers, librarians, school counselors and nonprofit navigators
  who help many people at once (a "helper mode" comes in Phase 3).

### Principles (non-negotiable)
1. **Private by default.** The screener runs entirely on the device. No account is
   needed to see results. Sensitive data is never sold or shared.
2. **Rules decide eligibility; AI only explains.** Eligibility comes from a
   deterministic, versioned, tested rules engine that cites its sources. The LLM
   (Claude) is used to explain results in plain language, translate, and read
   documents. It never decides who qualifies.
3. **Honest about uncertainty.** Results say *likely*, *possibly* or *unlikely*, never
   "you are approved". Every result explains why.
4. **Accessible to everyone.** WCAG 2.1 AA, works on a cheap Android phone over 3G,
   reads at a 6th-grade level, and is multilingual (Spanish in Phase 2).
5. **Never a dead end.** Every result links to an official place to apply and to
   free human help (211, legal aid).

## 3. MVP scope (Phase 1)

The goal is to prove that people finish the screener and click through to apply.

- Landing page and an anonymous screener (household size, income, state, a few
  life situations).
- Rules engine covering 6 federal programs, applying their federal rules plus
  state-specific Medicaid expansion status:
  - SNAP (food assistance)
  - Medicaid (adults)
  - Medicaid / CHIP (children)
  - WIC (pregnant people, new parents, kids under 5)
  - LIHEAP (energy bill help)
  - Lifeline (phone/internet discount)
- A results page with a status, plain-language reasons and an official link for
  each program.
- An installable PWA (home-screen icon, offline screener).
- No backend, no accounts, no stored personal data.

**Phase 1 is done when** we have a deployed PWA, more than 90% test coverage on the
engine, a Lighthouse accessibility score of at least 95, and 20 real users tested
through a partner nonprofit.

## 4. Roadmap

| Phase | Theme                    | Key features |
|-------|--------------------------|--------------|
| 1     | Discover (MVP)           | Screener, 6-program rules engine, results, PWA |
| 2     | Prepare & explain        | Optional encrypted account; document checklist plus camera capture; Claude-powered plain-language Q&A grounded in program rules; Spanish; more programs (EITC/CTC, TANF, SSI, school meals, ACA subsidies, Section 8 waitlists) |
| 3     | Apply & follow up        | Pre-filled application packets (PDF); deadline/interview reminders (SMS, email, push); helper mode for caseworkers with consent-based shared cases |
| 4     | Keep it & scale          | Renewal tracking; deeper per-state rules for the top 10 states; partner API for nonprofits; outcome analytics (anonymous, aggregate) |

## 5. Architecture

```
┌────────────────────────────── Client (Next.js PWA) ──────────────────────────────┐
│  Screener UI ──► lib/eligibility (pure TS rules engine, runs in browser)         │
│        │                 ▲                                                        │
│        │                 └── rulesets/*.ts  (versioned, cited, effective-dated)   │
│        ▼                                                                          │
│  Results / checklist UI      Service worker (offline)    IndexedDB (encrypted)    │
└───────────┬──────────────────────────────────────────────────────────────────────┘
            │ Phase 2+ (opt-in only)
            ▼
┌──────────── API (Next.js route handlers) ────────────┐      ┌──────────────────┐
│  /api/explain   → Claude (explains engine output)    │─────►│  Claude API      │
│  /api/documents → Claude vision (extract pay stubs)  │      └──────────────────┘
│  /api/reminders → queue → SMS/email                  │
└───────────┬──────────────────────────────────────────┘
            ▼
     Postgres (accounts, encrypted case data, reminders) — Phase 2+
```

**Stack:** Next.js (App Router) + TypeScript + React, Vitest, Postgres (Neon or Supabase)
from Phase 2, the Claude API for explanations and document understanding, deployed
on Vercel.

### Rules engine design
- Each program is a pure function `evaluate(household, ctx) → ProgramResult`.
- Thresholds (poverty guidelines, income limits, state expansion lists) live in
  **versioned rulesets**. Each ruleset has an effective date and a source URL.
- The engine returns *reasons*: the facts and thresholds that led to each result.
  That makes it explainable, testable, and safe to hand to an LLM to rephrase.
- Each rule gets golden-file tests built from official examples.
- **Update process:** HHS poverty guidelines change every January, and SNAP limits
  change every October. Each change is a PR that adds a new ruleset file, never one
  that edits an old one.

### Using AI safely (Phase 2)
- Claude receives the **engine output** plus the program's official rule text, and is
  asked to explain the result, not to re-decide it.
- Every explanation shows the citations it used, and there's a "Was this helpful?"
  feedback loop.
- Personal data is minimized before any API call (no names or SSNs, income rounded).
- Document extraction (for example, reading a pay stub) always shows the extracted
  values for the user to confirm.

## 6. Data model (Phase 2+)

```
User(id, auth, locale, created_at)
Household(id, user_id, state, size, encrypted_profile)
Screening(id, household_id, ruleset_version, input_hash, results_json, created_at)
Document(id, household_id, kind, encrypted_blob_ref, extracted_json, confirmed_at)
Application(id, household_id, program_id, status, submitted_at, renewal_due_at)
Reminder(id, application_id, channel, send_at, sent_at)
```

## 7. Privacy & security
- No tracking pixels or third-party ad SDKs, ever.
- Phase 1 has no server-side personal data at all.
- Phase 2: field-level encryption for profiles and documents, the option to delete
  your account and all data in one tap, and data retention limits.
- Threat model: an abusive partner with access to the phone (quick-exit button and
  no-history mode), data breaches (encryption and minimization), and immigration
  fears (clear explanations of public-charge rules, no collection of immigration
  status unless the user needs it).

## 8. Success metrics
- Screener completion rate (target > 70%)
- Click-through to apply (target > 40% of people with a "likely" result)
- Self-reported enrollment at a 30-day follow-up (Phase 3)
- Estimated annual dollar value unlocked per user

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Wrong eligibility result harms trust | Conservative "possibly" bands, cited rules, tests, a visible "rules last updated" date |
| Rules drift (annual updates) | Effective-dated rulesets, a calendar of update dates, CI check that warns when a ruleset is stale |
| State-by-state complexity | Federal rules first, then state overrides for the highest-population states |
| LLM hallucination | The LLM never determines eligibility; it's grounded in rule text and shows citations |
| Seen as government / scam | Clear "not a government site" notice, links only to .gov or official portals, never asks for SSN in the screener |
