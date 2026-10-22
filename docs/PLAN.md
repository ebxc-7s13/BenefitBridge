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

### Status at v1.0.0 (October 2026)

Everything that can run privately on the phone is built. The remaining items need a
server, accounts or partners that the project owner has to set up.

| Phase | Built in v1.0.0 | Still to do (and why) |
|-------|-----------------|------------------------|
| 1 | Screener; rules engine using Oct 2026 figures; results with reasons; installable offline PWA; WCAG 2.1 AA checked on every screen in CI | Public hosting (needs GitHub Pages enabled or another host); testing with 20 real users through a partner nonprofit |
| 2 | **18 programs** (SNAP, WIC, school meals, Medicaid adults/pregnancy/kids, marketplace credits, Medicare Extra Help, EITC, CTC, free tax help, SSI, TANF, LIHEAP, Lifeline, Head Start, child care, housing vouchers); dollar estimates for SNAP, EITC, CTC, SSI and Lifeline; per-program document checklists; plain-language FAQs; **full Spanish** | Claude-powered Q&A (needs a server holding an API key); camera capture of documents; optional encrypted account |
| 3 | Step-by-step apply guides with official links and phone numbers; status tracking (not started → approved/denied, with appeal help); **calendar reminders** (.ics) for interviews and renewals; **printable / PDF plan** to bring to appointments; quick-exit button and help for safety, legal aid, immigration and crisis | SMS/email/push reminders (need a server and a messaging provider); caseworker helper mode with shared cases |
| 4 | **Renewal tracking** with dates and reminders in "My plan" | State-by-state rules for the top 10 states; partner API; anonymous outcome analytics (all need a server and data agreements) |

### Update: v1.1.0 (October 2026) — multiple countries

The app now asks for the country first and plugs in each country's rules, questionnaire,
wording, currency, helplines and languages. **India** is the second country, with 39 central
government schemes in English and Hindi (food, health, housing, energy, rural jobs, workers,
farmers, pensions and insurance, disability, women, students and small business), and a pointer
to myScheme for state schemes. Next countries can be added as packs without touching the
screens. Planned India follow-ups are deeper rules for the largest states' own schemes
(Ladli Behna, Ladki Bahin and similar), and more Indian languages (Bengali, Marathi, Tamil,
Telugu).

### Update: v1.2.0 (October 2026) — state by state, live updates, more countries

- **India:** 89 state and UT schemes in 30 states, screened from the same answers, with papers,
  steps and official links in English and Hindi, plus the official portal of all 36 states and UTs.
- **United States:** every state's official benefits site, and state EITCs and child tax credits
  for tax year 2026. This covers part of Phase 4's "state-by-state rules".
- **Live updates** on the home page: bundled notices plus `public/updates.json`, fetched when
  online without sending anything about the user.
- **19 more countries** in a directory of 119 official programs (no eligibility check yet).

Next: verify the links marked in the 1.2.0 notes; eligibility rules for the largest directory
countries (UK, Canada, Philippines, Mexico); more Indian languages.

### Update: v1.3.0 (October 2026) — states, languages, Android

- **India:** 240 state and UT schemes in all 36 states and UTs, listed in their own section of the
  results; the app is available in 11 state languages, offered after the state is chosen.
- **Android:** a Capacitor wrapper built for free on GitHub Actions and attached to each release.

Next: native-speaker review of translations; Konkani, Manipuri, Mizo, Khasi and Nepali for the
remaining states; a signed build on Google Play.

### Final status: v1.5.0 (October 2026) — feature-complete

Schemes, services, jobs and helplines for India (national and every state/UT) in 14 languages,
the U.S. with state programs, a 19-country directory, read aloud, sharing, text size, an Android
app and a Google Play-ready listing. Future work is data upkeep; ideas are in `docs/ROADMAP.md`.

## 5. Architecture

```
┌────────────────────────────── Client (React PWA, Vite) ──────────────────────────┐
│  Screener UI ──► lib/eligibility (pure TS rules engine, runs in browser)         │
│        │                 ▲                                                        │
│        │                 └── rulesets/*.ts  (versioned, cited, effective-dated)   │
│        ▼                                                                          │
│  Results / checklist UI      Service worker (offline)    IndexedDB (encrypted)    │
└───────────┬──────────────────────────────────────────────────────────────────────┘
            │ Phase 2+ (opt-in only)
            ▼
┌──────────── API (serverless functions) ────────────┐      ┌──────────────────┐
│  /api/explain   → Claude (explains engine output)    │─────►│  Claude API      │
│  /api/documents → Claude vision (extract pay stubs)  │      └──────────────────┘
│  /api/reminders → queue → SMS/email                  │
└───────────┬──────────────────────────────────────────┘
            ▼
     Postgres (accounts, encrypted case data, reminders) — Phase 2+
```

**Stack:** React + TypeScript built with Vite (static, offline-first PWA and a single-file build), Vitest, Playwright + axe; later Postgres (Neon or Supabase)
from Phase 2, the Claude API for explanations and document understanding. Deployable
on any static host (GitHub Pages workflow included).

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
