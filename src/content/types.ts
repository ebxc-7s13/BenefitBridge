import type { Status } from "../lib/core";

/** English, Spanish, Hindi, and the official languages of Indian states (offered after choosing the state). */
export type Locale = "en" | "es" | "hi" | IndianLocale;
export type IndianLocale = "bn" | "mr" | "ta" | "te" | "kn" | "ml" | "gu" | "pa" | "or" | "as" | "ur";
export type CountryCode = "US" | "IN";
export type Params = Record<string, number | string>;

export type HubTile = "schemes" | "services" | "jobs" | "documents" | "helplines" | "plan" | "updates" | "world";
export const SERVICE_CATEGORIES = [
  "identity", "certificates", "welfare", "food", "health", "money", "pension", "tax", "land", "housing", "farm",
  "education", "jobs", "business", "transport", "travel", "utilities", "police", "legal", "grievance",
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type Education = "none" | "8th" | "10th" | "12th" | "iti" | "diploma" | "graduate" | "postgraduate";

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
    /** The card for the household's own state: its official portal and where to find more. */
    local: { title: (place: string) => string; body: string };
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
  nav: { home: string; results: string; plan: string; help: string; services: string; jobs: string };
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
    /** Label above the language buttons shown after choosing an Indian state. */
    language: string;
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
    /** Heading of the section listing the chosen state's own programs. */
    stateTitle: (place: string) => string;
    stateLead: string;
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
  world: {
    title: string;
    lead: string;
    note: string;
    portal: string;
    helpline: string;
    whoFor: string;
    gives: string;
    documents: string;
    apply: string;
    official: string;
    back: string;
    count: (n: number) => string;
    pickerTitle: string;
    pickerBody: string;
  };
  /** The home hub. */
  hub: {
    greeting: string;
    profileTitle: string;
    profileEmpty: string;
    profileAdd: string;
    profileEdit: string;
    profileSummary: (place: string, people: number) => string;
    explore: string;
    tiles: Record<HubTile, [title: string, subtitle: string]>;
  };
  /** Basic details, asked once and used everywhere. */
  profile: { title: string; lead: string; save: string };
  services: {
    title: string;
    lead: string;
    search: string;
    national: string;
    state: (place: string) => string;
    noState: string;
    all: string;
    categories: Record<ServiceCategory, string>;
    open: string;
    call: (n: string) => string;
    papers: string;
    steps: string;
    none: string;
    verify: string;
    count: (n: number) => string;
  };
  jobs: {
    title: string;
    lead: string;
    education: string;
    educationLevels: Record<Education, string>;
    needAge: string;
    eligible: string;
    notEligible: string;
    check: string;
    age: (min: number, max: number) => string;
    relaxed: (years: number) => string;
    minEducation: (level: string) => string;
    usually: (when: string) => string;
    apply: string;
    statePsc: (place: string) => string;
    stateJobs: string;
    training: string;
  };
  /** Read aloud, share and text size. */
  tools: {
    listen: string;
    stop: string;
    share: string;
    copied: string;
    shareFailed: string;
    textSize: string;
    sizes: { normal: string; large: string; xlarge: string };
  };
  helplines: { title: string; lead: string; national: string; state: (place: string) => string; emergency: string };
  updates: {
    title: string;
    new: string;
    details: string;
    checking: string;
    checked: (when: string) => string;
    offline: string;
    refresh: string;
    empty: string;
    unread: (n: number) => string;
    more: (n: number) => string;
    less: string;
  };
  money: { perMonth: string; perYear: string; upTo: string; once: string };
  status: Record<Status, string>;
}
