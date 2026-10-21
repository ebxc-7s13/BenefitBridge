/** Wording for the United States questionnaire. */
export interface UsWizard {
  optional: string;
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
}
