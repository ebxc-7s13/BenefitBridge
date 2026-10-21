import type { CountryCode } from "../types";
import { inHelplines, inServices } from "../india/services";
import { statePortals as usPortals } from "../us/statePortals";
import { usHelplines, usServices } from "../us/services";
import { stateCreditTable } from "../../lib/us/rulesets/stateCredits2026";
import { directoryText } from "../india/directory";
import type { IndianLocale } from "../types";
import type { Helpline, Service } from "./types";

/** India's services with each state language's wording merged in. */
const inLocalized: Service[] = inServices.map((s) => {
  const out: Service = { ...s, name: { ...s.name }, what: { ...s.what }, docs: s.docs && { ...s.docs }, steps: s.steps && { ...s.steps } };
  for (const [l, text] of Object.entries(directoryText) as [IndianLocale, NonNullable<(typeof directoryText)[IndianLocale]>][]) {
    const t = text.services[s.id];
    if (!t) continue;
    out.name[l] = t.name;
    out.what[l] = t.what;
    // Lists are only used when they match the English, so papers and steps never go missing.
    if (out.docs && t.docs?.length === out.docs.en.length) out.docs[l] = t.docs;
    if (out.steps && t.steps?.length === out.steps.en.length) out.steps[l] = t.steps;
  }
  return out;
});

/** Each U.S. state's benefits site, the agency that runs it and its tax agency, as services. */
function usStateServices(): Service[] {
  return Object.entries(usPortals).flatMap(([state, p]): Service[] => [
    ...(p.portal
      ? [{ id: `us-${state.toLowerCase()}-benefits`, scope: state, category: "welfare" as const, url: p.portal.url,
          name: { en: `Apply for benefits: ${p.portal.name}`, es: `Solicitar beneficios: ${p.portal.name}` },
          what: { en: "Apply online for SNAP, Medicaid and cash help in your state.", es: "Solicite SNAP, Medicaid y ayuda en efectivo en línea en su estado." } }]
      : []),
    { id: `us-${state.toLowerCase()}-agency`, scope: state, category: "welfare", url: p.agency.url,
      name: { en: p.agency.name }, what: { en: "The state office that runs food, health and cash help.", es: "La oficina estatal de ayuda con comida, salud y dinero." } },
    { id: `us-${state.toLowerCase()}-tax`, scope: state, category: "tax", url: stateCreditTable.states[state]?.tax.url ?? null,
      name: { en: "State tax agency", es: "Agencia estatal de impuestos" }, what: { en: "State taxes, refunds and state tax credits.", es: "Impuestos estatales, reembolsos y créditos estatales." } },
  ]);
}

const usAll = [...usServices, ...usStateServices()];

/** Every service and helpline for a country, national and state. */
export function directoryFor(country: CountryCode): { services: Service[]; helplines: Helpline[] } {
  return country === "IN" ? { services: inLocalized, helplines: inHelplines } : { services: usAll, helplines: usHelplines };
}
