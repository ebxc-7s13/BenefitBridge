import { usedStateReasonKeys } from "../../lib/india/stateReasons";
import { inStateName } from "../../lib/india/states";
import { money } from "../format";
import { entries, type Entry } from "./stateEntries";
import { DOCS, STEPS, type StateLocal, type StateReason } from "./stateText";
import type { CountryContent, Params, ProgramContent } from "../types";

type Lang = "en" | "hi";


/** States whose general social security pension uses the shared wording (translated once per language). */
const sharedPension = (id: string, e: Entry) => (e.en[0].startsWith("Social security pension (") ? id.slice(0, 2).toUpperCase() : undefined);

export const stateEntryIds = Object.keys(entries);

function programs(lang: Lang): Record<string, ProgramContent> {
  const i = lang === "en" ? 0 : 1;
  return Object.fromEntries(
    Object.entries(entries).map(([id, e]) => {
      const [name, short, about] = e[lang];
      return [
        id,
        {
          name,
          short,
          about,
          documents: e.docs.map((d) => DOCS[d][i]),
          steps: e.steps.map((s) => STEPS[s][i]),
          applyLabel: lang === "en" ? "Official website" : "सरकारी वेबसाइट",
          faq: [],
        },
      ];
    }),
  );
}

const CATEGORY_NAMES: Record<string, [string, string]> = {
  sc: ["SC", "एससी"],
  st: ["ST", "एसटी"],
  obc: ["OBC", "ओबीसी"],
  minority: ["minority", "अल्पसंख्यक"],
};

function reasons(lang: Lang): Record<string, (p: Params) => string> {
  const r = (n: number | string) => money(Number(n), lang, "INR");
  const list = (p: Params) => String(p.list).split(",").map((c) => CATEGORY_NAMES[c][lang === "en" ? 0 : 1]).join(", ");
  const en: Record<string, (p: Params) => string> = {
    "state.women": () => "For women.",
    "state.age": (p) => `For ages ${p.min} to ${p.max}.`,
    "state.ageMin": (p) => `For ages ${p.min} and over.`,
    "state.ageMax": (p) => `For ages up to ${p.max}.`,
    "state.incomeMax": (p) => `Family income up to ${r(p.limit)} a year.`,
    "state.rural": () => "For villages.",
    "state.categories": (p) => `For ${list(p)} families.`,
    "state.poorCard": () => "For families with an AAY or priority (BPL) ration card.",
    "state.anyCard": () => "For families with a state ration card.",
    "state.farmer": () => "For farmers.",
    "state.landOwner": () => "For farmers who own land.",
    "state.girl": () => "For families with a young daughter.",
    "state.school": () => "For families with children in school.",
    "state.college": () => "For students in class 11–12, college or a course.",
    "state.pregnant": () => "For pregnant women and new mothers.",
    "state.senior60": () => "For people aged 60 or more.",
    "state.widow": () => "For widows.",
    "state.disability": () => "For people with a disability.",
    "state.needy": () => "For seniors, widows and people with disabilities.",
    "state.worker": () => "For unorganised workers.",
    "state.jobseeker": () => "For young people looking for work.",
    "state.business": () => "For people running or starting a business.",
    "state.noTaxPayer": () => "Not for income-tax payers.",
    "state.noGovtJob": () => "Not for families with a government employee.",
    "state.noPuccaHouse": () => "For families without a pucca house.",
    "state.verify": () => "State schemes change often — check the official website before applying.",
  };
  const hi: Record<string, (p: Params) => string> = {
    "state.women": () => "महिलाओं के लिए।",
    "state.age": (p) => `${p.min} से ${p.max} साल की उम्र के लिए।`,
    "state.ageMin": (p) => `${p.min} साल या ज़्यादा उम्र के लिए।`,
    "state.ageMax": (p) => `${p.max} साल तक की उम्र के लिए।`,
    "state.incomeMax": (p) => `परिवार की आमदनी ${r(p.limit)} सालाना तक।`,
    "state.rural": () => "गाँवों के लिए।",
    "state.categories": (p) => `${list(p)} परिवारों के लिए।`,
    "state.poorCard": () => "अंत्योदय या पात्र गृहस्थी (बीपीएल) राशन कार्ड वाले परिवारों के लिए।",
    "state.anyCard": () => "राज्य के राशन कार्ड वाले परिवारों के लिए।",
    "state.farmer": () => "किसानों के लिए।",
    "state.landOwner": () => "अपनी ज़मीन वाले किसानों के लिए।",
    "state.girl": () => "छोटी बेटी वाले परिवारों के लिए।",
    "state.school": () => "स्कूल जाने वाले बच्चों वाले परिवारों के लिए।",
    "state.college": () => "कक्षा 11–12, कॉलेज या कोर्स में पढ़ने वालों के लिए।",
    "state.pregnant": () => "गर्भवती महिलाओं और नई माताओं के लिए।",
    "state.senior60": () => "60 साल या ज़्यादा उम्र के लोगों के लिए।",
    "state.widow": () => "विधवाओं के लिए।",
    "state.disability": () => "दिव्यांगजनों के लिए।",
    "state.needy": () => "बुज़ुर्गों, विधवाओं और दिव्यांगजनों के लिए।",
    "state.worker": () => "असंगठित श्रमिकों के लिए।",
    "state.jobseeker": () => "काम ढूँढ रहे युवाओं के लिए।",
    "state.business": () => "व्यापार चलाने या शुरू करने वालों के लिए।",
    "state.noTaxPayer": () => "इनकम टैक्स भरने वालों के लिए नहीं।",
    "state.noGovtJob": () => "सरकारी कर्मचारी वाले परिवारों के लिए नहीं।",
    "state.noPuccaHouse": () => "पक्के घर के बिना वाले परिवारों के लिए।",
    "state.verify": () => "राज्य की योजनाएँ अक्सर बदलती हैं — आवेदन से पहले सरकारी वेबसाइट देखें।",
  };
  const base = lang === "en" ? en : hi;
  const miss = (text: string) => (lang === "en" ? `Not a match: ${text.charAt(0).toLowerCase()}${text.slice(1)}` : `शर्त पूरी नहीं: ${text}`);
  const out: Record<string, (p: Params) => string> = {};
  for (const key of usedStateReasonKeys()) {
    const k = key.replace(/^state\.(miss\.)?/, "state.");
    const render = base[k];
    out[key] = key.startsWith("state.miss.") ? (p) => miss(render(p)) : render;
  }
  return out;
}

/** State scheme wording in a state language, falling back to English for anything not translated. */
function localPrograms(l: StateLocal): Record<string, ProgramContent> {
  const en = programs("en");
  return Object.fromEntries(
    Object.entries(entries).map(([id, e]) => {
      const pensionOf = sharedPension(id, e);
      const text = pensionOf
        ? ([l.socialPension.name(l.stateNames[pensionOf] ?? inStateName(pensionOf, "en")), l.socialPension.short, l.socialPension.about] as const)
        : l.entries[id];
      const [name, short, about] = text ?? [en[id].name, en[id].short, en[id].about];
      return [id, { ...en[id], name, short, about, documents: e.docs.map((d) => l.docs[d] ?? DOCS[d][0]), steps: e.steps.map((st) => l.steps[st] ?? STEPS[st][0]), applyLabel: l.applyLabel }];
    }),
  );
}

function localReasons(l: StateLocal): Record<string, (p: Params) => string> {
  const f = (p: Params) => ({
    money: (n: number | string) => money(Number(n), l.locale, "INR"),
    list: String(p.list ?? "").split(",").filter(Boolean).map((c) => l.categories[c as keyof StateLocal["categories"]]).join(", "),
  });
  const out: Record<string, (p: Params) => string> = {};
  for (const key of usedStateReasonKeys()) {
    const base = key.replace(/^state\.(miss\.)?/, "") as StateReason;
    const render = (p: Params) => l.reasons[base](p, f(p));
    out[key] = key.startsWith("state.miss.") ? (p) => l.miss(render(p)) : render;
  }
  return out;
}

/** Add state scheme wording to India's content in a state language. */
export function withLocalStateContent<W>(c: CountryContent<W>, l: StateLocal): CountryContent<W> {
  return { ...c, programs: { ...c.programs, ...localPrograms(l) }, reasons: { ...c.reasons, ...localReasons(l) } };
}

/** Add state scheme wording to India's content for one language. */
export function withStateContent<W>(c: CountryContent<W>, lang: Lang): CountryContent<W> {
  return {
    ...c,
    programs: { ...c.programs, ...programs(lang) },
    reasons: { ...c.reasons, ...reasons(lang) },
  };
}
