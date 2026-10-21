/** Types shared by every country's rules engine. */

export type Status = "likely" | "possibly" | "unlikely";

/** A language-neutral reason. `key` is looked up in the country's content for the user's language. */
export interface Reason {
  key: string;
  params?: Record<string, number | string>;
}

/**
 * Estimated value in the country's currency. `low` < `high` means a range; `low` of 0 means "up to `high`".
 * Yearly unless `once` is set (a one-time grant or subsidy).
 */
export interface Value {
  low: number;
  high: number;
  once?: boolean;
}

export interface Evaluation {
  status: Status;
  reasons: Reason[];
  value?: Value;
}

export interface ProgramResult extends Evaluation {
  programId: string;
}

const order: Record<Status, number> = { likely: 0, possibly: 1, unlikely: 2 };

/** Likely results first, then by estimated value. */
export function rank<R extends ProgramResult>(results: R[]): R[] {
  return results.sort((a, b) => order[a.status] - order[b.status] || (b.value?.high ?? 0) - (a.value?.high ?? 0));
}

/** Total estimated value of the results that are likely or possible, split into yearly and one-time. */
export function totals(results: ProgramResult[]) {
  const t = { yearly: { low: 0, high: 0 }, once: { low: 0, high: 0 } };
  for (const r of results) {
    if (r.status === "unlikely" || !r.value) continue;
    const bucket = r.value.once ? t.once : t.yearly;
    bucket.low += r.value.low;
    bucket.high += r.value.high;
  }
  return t;
}
