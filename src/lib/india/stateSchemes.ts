import { stateSchemes20261021 } from "./stateData/2026-10-21";
import type { StateScheme } from "./stateRules";

/** The current state and UT schemes. Each update is a new dated file in ./stateData; published files are never edited. */
export const stateSchemes: StateScheme[] = stateSchemes20261021;

export const statePortals: Record<string, string> = {
  AP: "https://www.ap.gov.in/",
  AR: "https://arunachalpradesh.gov.in/",
  AS: "https://assam.gov.in/",
  BR: "https://state.bihar.gov.in/",
  CG: "https://cgstate.gov.in/",
  GA: "https://goa.gov.in/",
  GJ: "https://gujaratindia.gov.in/",
  HR: "https://haryana.gov.in/",
  HP: "https://himachal.nic.in/",
  JH: "https://jharkhand.gov.in/",
  KA: "https://karnataka.gov.in/",
  KL: "https://kerala.gov.in/",
  MP: "https://mp.gov.in/",
  MH: "https://maharashtra.gov.in/",
  MN: "https://manipur.gov.in/",
  ML: "https://meghalaya.gov.in/",
  MZ: "https://mizoram.gov.in/",
  NL: "https://nagaland.gov.in/",
  OD: "https://odisha.gov.in/",
  PB: "https://punjab.gov.in/",
  RJ: "https://rajasthan.gov.in/",
  SK: "https://sikkim.gov.in/",
  TN: "https://www.tn.gov.in/",
  TS: "https://telangana.gov.in/",
  TR: "https://tripura.gov.in/",
  UP: "https://up.gov.in/",
  UK: "https://uk.gov.in/",
  WB: "https://wb.gov.in/",
  AN: "https://andaman.gov.in/",
  CH: "https://chandigarh.gov.in/",
  DN: "https://ddd.gov.in/",
  DL: "https://delhi.gov.in/",
  JK: "https://jk.gov.in/",
  LA: "https://ladakh.gov.in/",
  LD: "https://lakshadweep.gov.in/",
  PY: "https://py.gov.in/",
};
