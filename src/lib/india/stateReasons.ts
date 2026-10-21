import { stateSchemes } from "./stateSchemes";

/** Every reason key the state schemes can produce, so content files only carry wording that is used. */
export function usedStateReasonKeys(): string[] {
  const keys = new Set<string>(["state.verify"]);
  for (const { criteria: c } of stateSchemes)
    for (const key of Object.keys(c) as (keyof typeof c)[]) {
      if (!c[key]) continue;
      const k = key === "ageMin" || key === "ageMax" ? (c.ageMin && c.ageMax ? "age" : key) : key;
      keys.add(`state.${k}`);
      keys.add(`state.miss.${k}`);
    }
  return [...keys].sort();
}
