import type { Status } from "../lib/core";

export type Locale = "en" | "es" | "hi";
export type CountryCode = "US" | "IN";
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

export interface Resource {
  title: string;
  body: string;
  links: { label: string; href: string }[];
}

/** Text that belongs to one country, in one language. `W` holds that country's questionnaire wording. */
export interface CountryContent<W = unknown> {
  home: { title: string; lead: string; programsTitle: string; programsBody: string };
  wizard: W;
  results: {
    valueNote: string;
    noneBody: string;
    /** An extra card under the results, e.g. a pointer to state schemes. */
    extra?: Resource;
  };
  deniedHelp: string;
  /** People and services to contact, shown on the help page. */
  resources: Resource[];
  categories: Record<string, string>;
  programs: Record<string, ProgramContent>;
  reasons: Record<string, (p: Params) => string>;
}

/** Text shared by every country, in one language. */
export interface UiStrings {
  locale: Locale;
  /** The language's own name, shown on the switch button. */
  languageName: string;
  appName: string;
  skipToContent: string;
  quickExit: string;
  quickExitHint: string;
  nav: { home: string; results: string; plan: string; help: string };
  country: { title: string; lead: string; change: string; names: Record<CountryCode, string>; blurbs: Record<CountryCode, string> };
  home: {
    start: string;
    resume: string;
    seeResults: string;
    privacyTitle: string;
    privacyBody: string;
    howTitle: string;
    how: [string, string][];
    notGov: string;
  };
  wizard: {
    stepOf: (n: number, total: number) => string;
    back: string;
    next: string;
    finish: string;
    privacyNote: string;
    minus: (label: string) => string;
    plus: (label: string) => string;
  };
  results: {
    title: string;
    summary: (likely: number, possibly: number) => string;
    valueLabel: string;
    onceLabel: (amount: string) => string;
    noneTitle: string;
    groupLikely: string;
    groupPossibly: string;
    groupUnlikely: string;
    showUnlikely: (n: number) => string;
    hideUnlikely: string;
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
    privacyTitle: string;
    privacyBody: string;
    saveLabel: string;
    saveHint: string;
    deleteAll: string;
    deleteConfirm: string;
    deleteYes: string;
    cancel: string;
    deleted: string;
    aboutTitle: string;
    aboutBody: (version: string, date: string) => string;
    sources: string;
    install: string;
    installBody: string;
  };
  money: { perMonth: string; perYear: string; upTo: string; once: string };
  status: Record<Status, string>;
}
