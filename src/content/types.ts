import type { Category, ProgramId, Status } from "../lib/eligibility/types";

export type Locale = "en" | "es";
export type Params = Record<string, number | string>;

export interface ProgramContent {
  name: string;
  /** One line shown on result cards. */
  short: string;
  /** A short plain-language explanation. */
  about: string;
  documents: string[];
  steps: string[];
  applyLabel: string;
  faq: [question: string, answer: string][];
}

export interface Content {
  locale: Locale;
  ui: UiStrings;
  categories: Record<Category, string>;
  status: Record<Status, string>;
  programs: Record<ProgramId, ProgramContent>;
  reasons: Record<string, (p: Params) => string>;
}

export interface UiStrings {
  appName: string;
  tagline: string;
  skipToContent: string;
  quickExit: string;
  quickExitHint: string;
  language: string;
  nav: { home: string; results: string; plan: string; help: string };
  home: {
    title: string;
    lead: string;
    start: string;
    resume: string;
    seeResults: string;
    privacyTitle: string;
    privacyBody: string;
    howTitle: string;
    how: [string, string][];
    programsTitle: string;
    programsBody: string;
    notGov: string;
  };
  wizard: {
    stepOf: (n: number, total: number) => string;
    back: string;
    next: string;
    finish: string;
    optional: string;
    privacyNote: string;
    state: { title: string; label: string; placeholder: string };
    household: {
      title: string;
      size: string;
      sizeHint: string;
      under5: string;
      age5to16: string;
      age17to18: string;
      situations: string;
      pregnant: string;
      senior60: string;
      senior65: string;
      disability: string;
      married: string;
      homeless: string;
      minus: (label: string) => string;
      plus: (label: string) => string;
    };
    income: {
      title: string;
      lead: string;
      earned: string;
      earnedHint: string;
      other: string;
      otherHint: string;
      frequency: string;
      frequencies: { monthly: string; weekly: string; biweekly: string; twiceMonthly: string; yearly: string };
      perMonth: (amount: string) => string;
    };
    expenses: {
      title: string;
      lead: string;
      rent: string;
      utilities: string;
      childCare: string;
      medical: string;
      medicalHint: string;
    };
    current: {
      title: string;
      lead: string;
      snap: string;
      medicaid: string;
      ssi: string;
      tanf: string;
      medicare: string;
    };
    errors: { state: string };
  };
  results: {
    title: string;
    summary: (likely: number, possibly: number) => string;
    valueLabel: string;
    valueNote: string;
    noneTitle: string;
    noneBody: string;
    groupLikely: string;
    groupPossibly: string;
    groupUnlikely: string;
    showUnlikely: (n: number) => string;
    hideUnlikely: string;
    perYear: string;
    details: string;
    inPlan: string;
    editAnswers: string;
    startOver: string;
    disclaimer: (date: string) => string;
  };
  program: {
    back: string;
    why: string;
    estimate: string;
    about: string;
    documents: string;
    documentsHint: string;
    steps: string;
    apply: string;
    call: (phone: string) => string;
    faq: string;
    addToPlan: string;
    removeFromPlan: string;
    trackTitle: string;
    statusLabel: string;
    statuses: { todo: string; applying: string; applied: string; approved: string; denied: string };
    dates: string;
    interviewDate: string;
    renewalDate: string;
    addToCalendar: string;
    calendarInterview: (program: string) => string;
    calendarRenewal: (program: string) => string;
    deniedHelp: string;
  };
  plan: {
    title: string;
    lead: string;
    empty: string;
    emptyCta: string;
    upcoming: string;
    noDates: string;
    progress: (done: number, total: number) => string;
    print: string;
    printTitle: string;
    printFor: string;
    household: string;
    printedOn: (date: string) => string;
    open: string;
    interview: string;
    renewal: string;
  };
  help: {
    title: string;
    lead: string;
    call211: string;
    call211Body: string;
    legal: string;
    legalBody: string;
    immigration: string;
    immigrationBody: string;
    safety: string;
    safetyBody: string;
    crisis: string;
    crisisBody: string;
    privacyTitle: string;
    privacyBody: string;
    saveLabel: string;
    saveHint: string;
    deleteAll: string;
    deleteConfirm: string;
    deleted: string;
    aboutTitle: string;
    aboutBody: (version: string, date: string) => string;
    sources: string;
    install: string;
    installBody: string;
  };
  money: { perMonth: string; perYear: string; upTo: string };
}
