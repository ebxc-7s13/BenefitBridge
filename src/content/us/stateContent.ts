import { stateName } from "../../lib/states";
import { stateCreditTable } from "../../lib/us/rulesets/stateCredits2026";
import { stateCtcId, stateEitcId } from "../../lib/us/stateCredits";
import { money } from "../format";
import type { CountryContent, Params, ProgramContent } from "../types";

type Lang = "en" | "es";

const statesWith = (k: "eitc" | "ctc") => Object.entries(stateCreditTable.states).filter(([, c]) => c[k]).map(([s]) => s);

function eitc(state: string, lang: Lang): ProgramContent {
  const name = stateName(state);
  return lang === "en"
    ? {
        name: `${name} Earned Income Tax Credit`,
        short: "Extra money at tax time from your state, on top of the federal EITC.",
        about: `${name} adds its own credit for working people who get the federal EITC. You claim it on your ${name} tax return.`,
        documents: ["W-2s and 1099s", "Social Security cards for you, your spouse and your children", "Proof you lived in the state (lease, utility bill or ID)", "Bank account and routing numbers for direct deposit"],
        steps: [`File a ${name} tax return along with your federal return.`, "Free tax help (VITA) can file both for free.", "Claim the EITC on both returns."],
        applyLabel: `${name} tax agency`,
        faq: [],
      }
    : {
        name: `Crédito por ingreso del trabajo de ${name}`,
        short: "Dinero extra de su estado al declarar impuestos, además del EITC federal.",
        about: `${name} agrega su propio crédito para las personas que trabajan y reciben el EITC federal. Se pide en la declaración de impuestos de ${name}.`,
        documents: ["Formularios W-2 y 1099", "Tarjetas de Seguro Social suyas, de su cónyuge y de sus hijos", "Prueba de que vivió en el estado (contrato de alquiler, factura de servicios o identificación)", "Números de cuenta y de ruta del banco para depósito directo"],
        steps: [`Presente una declaración de impuestos de ${name} junto con la federal.`, "La ayuda gratuita con impuestos (VITA) puede presentar ambas gratis.", "Pida el EITC en las dos declaraciones."],
        applyLabel: `Agencia de impuestos de ${name}`,
        faq: [],
      };
}

function ctc(state: string, lang: Lang): ProgramContent {
  const name = stateName(state);
  return lang === "en"
    ? {
        name: `${name} Child Tax Credit`,
        short: "Money at tax time for families with children, from your state.",
        about: `${name} has its own child tax credit for families with children. You claim it on your ${name} tax return, even if you owe no state tax in many cases.`,
        documents: ["Social Security number or ITIN for each child", "Children's birth certificates", "W-2s and other income forms", "Proof you lived in the state"],
        steps: [`File a ${name} tax return along with your federal return.`, "List each child on the return.", "Use free tax help (VITA) so you don't pay a preparer."],
        applyLabel: `${name} tax agency`,
        faq: [],
      }
    : {
        name: `Crédito tributario por hijos de ${name}`,
        short: "Dinero de su estado al declarar impuestos, para familias con hijos.",
        about: `${name} tiene su propio crédito tributario por hijos. Se pide en la declaración de impuestos de ${name}; en muchos casos, aunque no deba impuestos estatales.`,
        documents: ["Número de Seguro Social o ITIN de cada hijo", "Actas de nacimiento de los hijos", "Formularios W-2 y otros de ingresos", "Prueba de que vivió en el estado"],
        steps: [`Presente una declaración de impuestos de ${name} junto con la federal.`, "Incluya a cada hijo en la declaración.", "Use la ayuda gratuita con impuestos (VITA) para no pagarle a un preparador."],
        applyLabel: `Agencia de impuestos de ${name}`,
        faq: [],
      };
}

function reasons(lang: Lang): Record<string, (p: Params) => string> {
  const $ = (n: number | string) => money(Number(n), lang, "USD");
  return lang === "en"
    ? {
        "stateEitc.needsFederal": () => "You need to qualify for the federal EITC first.",
        "stateEitc.pct": (p) => `Worth ${p.pct}% of your federal EITC.`,
        "stateEitc.formula": () => "The state uses its own formula, based on your pay and family.",
        "stateEitc.refundable": () => "Refundable: you get it even if you owe no state tax.",
        "stateEitc.nonRefundable": () => "It lowers the state tax you owe, but isn't paid out beyond that.",
        "stateCtc.amount": (p) => `Up to ${$(p.max)} per child under ${p.age}.`,
        "stateCtc.income": (p) => `For families with income up to ${$(p.limit)} a year.`,
        "stateCtc.miss.children": (p) => `For families with children under ${p.age}.`,
        "stateCtc.miss.income": (p) => `Your income is above the limit of about ${$(p.limit)} a year.`,
        "stateCredit.file": () => "Claim it by filing a state tax return. Rules change each year, so check the state's website.",
      }
    : {
        "stateEitc.needsFederal": () => "Primero tiene que calificar para el EITC federal.",
        "stateEitc.pct": (p) => `Equivale al ${p.pct}% de su EITC federal.`,
        "stateEitc.formula": () => "El estado usa su propia fórmula, según su sueldo y su familia.",
        "stateEitc.refundable": () => "Reembolsable: lo recibe aunque no deba impuestos estatales.",
        "stateEitc.nonRefundable": () => "Reduce los impuestos estatales que debe, pero no se paga más allá de eso.",
        "stateCtc.amount": (p) => `Hasta ${$(p.max)} por cada hijo menor de ${p.age} años.`,
        "stateCtc.income": (p) => `Para familias con ingresos de hasta ${$(p.limit)} al año.`,
        "stateCtc.miss.children": (p) => `Para familias con hijos menores de ${p.age} años.`,
        "stateCtc.miss.income": (p) => `Sus ingresos superan el límite de unos ${$(p.limit)} al año.`,
        "stateCredit.file": () => "Se pide al presentar la declaración de impuestos estatal. Las reglas cambian cada año; consulte el sitio del estado.",
      };
}

/** Every state credit's program id. */
export const stateCreditIds = [...statesWith("eitc").map(stateEitcId), ...statesWith("ctc").map(stateCtcId)];

/** Add state tax credit wording to US content for one language. */
export function withStateContent<W>(c: CountryContent<W>, lang: Lang): CountryContent<W> {
  const programs = Object.fromEntries([
    ...statesWith("eitc").map((s) => [stateEitcId(s), eitc(s, lang)]),
    ...statesWith("ctc").map((s) => [stateCtcId(s), ctc(s, lang)]),
  ]);
  // Only wording for credits some state actually has.
  const used = Object.entries(reasons(lang)).filter(([k]) =>
    k.startsWith("stateEitc.") ? statesWith("eitc").length > 0 : k.startsWith("stateCtc.") ? statesWith("ctc").length > 0 : stateCreditIds.length > 0,
  );
  return { ...c, programs: { ...c.programs, ...programs }, reasons: { ...c.reasons, ...Object.fromEntries(used) } };
}
