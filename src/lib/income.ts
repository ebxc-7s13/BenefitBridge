export type Frequency = "monthly" | "weekly" | "biweekly" | "twiceMonthly" | "yearly";

export const frequencies: Frequency[] = ["monthly", "weekly", "biweekly", "twiceMonthly", "yearly"];

const perMonth: Record<Frequency, number> = {
  monthly: 1,
  weekly: 52 / 12,
  biweekly: 26 / 12,
  twiceMonthly: 2,
  yearly: 1 / 12,
};

export interface IncomeInput {
  amount: string;
  frequency: Frequency;
}

export function toMonthly({ amount, frequency }: IncomeInput): number {
  const n = Number(amount.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * perMonth[frequency]) : 0;
}
