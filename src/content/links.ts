import type { ProgramId } from "../lib/eligibility/types";
import type { Locale } from "./types";

interface Link {
  url: string;
  /** Spanish-language page, when the agency has one. */
  es?: string;
  phone?: string;
}

/** Official places to apply. Only government or official program sites. */
export const programLinks: Record<ProgramId, Link> = {
  snap: { url: "https://www.fns.usda.gov/snap/state-directory" },
  wic: { url: "https://www.fns.usda.gov/wic/wic-how-apply" },
  "school-meals": { url: "https://www.fns.usda.gov/nslp" },
  "medicaid-adults": { url: "https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/", es: "https://www.cuidadodesalud.gov/es/medicaid-chip/getting-medicaid-chip/", phone: "1-800-318-2596" },
  "medicaid-pregnancy": { url: "https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/", es: "https://www.cuidadodesalud.gov/es/medicaid-chip/getting-medicaid-chip/", phone: "1-800-318-2596" },
  "medicaid-chip": { url: "https://www.insurekidsnow.gov/coverage/index.html", phone: "1-877-543-7669" },
  "aca-marketplace": { url: "https://www.healthcare.gov/", es: "https://www.cuidadodesalud.gov/es/", phone: "1-800-318-2596" },
  "medicare-extra-help": { url: "https://www.ssa.gov/medicare/part-d-extra-help", phone: "1-800-772-1213" },
  eitc: { url: "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc" },
  ctc: { url: "https://www.irs.gov/credits-deductions/individuals/child-tax-credit" },
  "free-tax-help": { url: "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers", phone: "1-800-906-9887" },
  ssi: { url: "https://www.ssa.gov/ssi", phone: "1-800-772-1213" },
  tanf: { url: "https://www.acf.hhs.gov/ofa/map/about/help-families" },
  liheap: { url: "https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap", phone: "1-866-674-6327" },
  lifeline: { url: "https://www.lifelinesupport.org/", phone: "1-800-234-9473" },
  "head-start": { url: "https://headstart.gov/center-locator", phone: "1-866-763-6481" },
  "child-care": { url: "https://childcare.gov/" },
  "housing-voucher": { url: "https://www.hud.gov/contactus/public-housing-contacts", phone: "1-800-955-2232" },
};

export function applyUrl(id: ProgramId, locale: Locale): string {
  const link = programLinks[id];
  return (locale === "es" && link.es) || link.url;
}

export const helpLinks = {
  "211": "https://www.211.org/",
  legal: "https://www.lawhelp.org/",
  immigration: "https://www.immigrationadvocates.org/legaldirectory/",
  dvHotline: "1-800-799-7233",
  crisis: "988",
};
