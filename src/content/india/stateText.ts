import type { IndianLocale, Params } from "../types";

/** Papers that state schemes ask for: [English, Hindi]. */
export const DOCS = {
  aadhaar: ["Aadhaar card", "आधार कार्ड"],
  domicile: ["Residence (domicile) certificate of the state", "राज्य का निवास (मूल निवास) प्रमाणपत्र"],
  income: ["Income certificate", "आय प्रमाणपत्र"],
  bank: ["Bank account linked to Aadhaar", "आधार से जुड़ा बैंक खाता"],
  ration: ["Ration card", "राशन कार्ड"],
  caste: ["Caste certificate, if applicable", "जाति प्रमाणपत्र, अगर लागू हो"],
  photo: ["Passport-size photo", "पासपोर्ट साइज़ फ़ोटो"],
  birth: ["Child's birth certificate", "बच्चे का जन्म प्रमाणपत्र"],
  land: ["Land records", "ज़मीन के कागज़"],
  marks: ["Marksheet and admission proof", "मार्कशीट और दाख़िले का प्रमाण"],
  age: ["Age proof", "उम्र का प्रमाण"],
  death: ["Husband's death certificate", "पति का मृत्यु प्रमाणपत्र"],
  marriage: ["Wedding card or marriage certificate", "शादी का कार्ड या विवाह प्रमाणपत्र"],
  electricity: ["Electricity bill or consumer number", "बिजली का बिल या उपभोक्ता नंबर"],
  familyId: ["Family ID (Parivar Pehchan Patra)", "परिवार पहचान पत्र"],
  school: ["School or college enrolment proof", "स्कूल या कॉलेज में दाख़िले का प्रमाण"],
  samagra: ["Samagra family ID", "समग्र परिवार आईडी"],
  janAadhaar: ["Jan Aadhaar card", "जन आधार कार्ड"],
  labour: ["Worker registration card, if you have one", "श्रमिक पंजीकरण कार्ड, अगर हो"],
  noPapers: ["No papers needed", "कोई कागज़ नहीं चाहिए"],
  vehicle: ["Driving licence and vehicle registration (RC)", "ड्राइविंग लाइसेंस और गाड़ी का रजिस्ट्रेशन (आरसी)"],
  jobCard: ["MGNREGA job card", "मनरेगा जॉब कार्ड"],
  disabilityCert: ["Disability certificate (UDID card)", "दिव्यांगता प्रमाणपत्र (यूडीआईडी कार्ड)"],
  parentDeath: ["Parent's death certificate", "माता या पिता का मृत्यु प्रमाणपत्र"],
  mcpCard: ["Mother and Child Protection (MCP) card", "मातृ एवं शिशु सुरक्षा (एमसीपी) कार्ड"],
} as const;

/** Steps to apply: [English, Hindi]. */
export const STEPS = {
  portal: ["Apply on the official website (button below), or at a Common Service Centre (CSC).", "नीचे दिए बटन से सरकारी वेबसाइट पर, या कॉमन सर्विस सेंटर (CSC) पर आवेदन करें।"],
  office: ["Or apply at your gram panchayat, block office or ward office.", "या ग्राम पंचायत, ब्लॉक या वार्ड दफ़्तर में आवेदन करें।"],
  secretariat: ["Apply at your village or ward secretariat.", "अपने गाँव या वार्ड सचिवालय में आवेदन करें।"],
  school: ["Apply through your school or college.", "अपने स्कूल या कॉलेज के ज़रिए आवेदन करें।"],
  anganwadi: ["Register through your anganwadi worker or the hospital where the child is born.", "आंगनवाड़ी कार्यकर्ता या जिस अस्पताल में बच्चे का जन्म हो, उसके ज़रिए पंजीकरण कराएँ।"],
  auto: ["No separate form: eligible people are added automatically. Check your status on the website.", "अलग फ़ॉर्म नहीं भरना है: पात्र लोग अपने आप जुड़ जाते हैं। वेबसाइट पर अपनी स्थिति देखें।"],
  verify: ["Officials check your details; the money comes straight to your bank account (DBT).", "अधिकारी आपकी जानकारी जाँचते हैं; पैसे सीधे बैंक खाते में आते हैं (DBT)।"],
  ekyc: ["Keep e-KYC done and Aadhaar linked to your bank so payments don't stop.", "ई-केवाईसी पूरा रखें और आधार बैंक से जुड़ा रखें ताकि भुगतान न रुके।"],
  card: ["Get the scheme card online or at a registration centre.", "योजना का कार्ड ऑनलाइन या पंजीकरण केंद्र पर बनवाएँ।"],
  hospital: ["Show the card or Aadhaar at a listed hospital for cashless treatment.", "बिना पैसे इलाज के लिए सूचीबद्ध अस्पताल में कार्ड या आधार दिखाएँ।"],
  showId: ["Show your card or a government ID to the conductor.", "कंडक्टर को अपना कार्ड या सरकारी पहचान पत्र दिखाएँ।"],
  rationShop: ["Collect it at your ration shop with your card and fingerprint.", "राशन दुकान पर कार्ड और अँगूठा लगाकर लें।"],
  schoolMeal: ["Enrol your child in a government school; the meal is served every school day.", "बच्चे का सरकारी स्कूल में दाख़िला कराएँ; खाना स्कूल के हर दिन मिलता है।"],
  canteen: ["Go to a listed canteen and pay at the counter. No form is needed.", "किसी सूचीबद्ध कैंटीन में जाकर काउंटर पर पैसे दें। कोई फ़ॉर्म नहीं भरना है।"],
  procurement: ["Register and sell your crop at a government procurement centre; the extra amount comes to your bank account.", "पंजीकरण कराकर सरकारी ख़रीद केंद्र पर फ़सल बेचें; अतिरिक्त राशि बैंक खाते में आती है।"],
} as const;

export type Doc = keyof typeof DOCS;
export type Step = keyof typeof STEPS;

/** Base reason keys for state schemes ("state.<key>"; misses are "state.miss.<key>"). */
export const STATE_REASONS = [
  "women", "age", "ageMin", "ageMax", "incomeMax", "rural", "categories", "poorCard", "anyCard", "farmer", "landOwner",
  "girl", "school", "college", "pregnant", "senior60", "widow", "disability", "needy", "worker", "jobseeker", "business",
  "noTaxPayer", "noGovtJob", "noPuccaHouse", "verify",
] as const;
export type StateReason = (typeof STATE_REASONS)[number];

/** Helpers a reason can use: rupees in the reader's language, and the social categories in params.list. */
export interface ReasonFormat {
  money(n: number | string): string;
  list: string;
}

/** State scheme wording in one of the state languages (Bengali, Tamil, …). Anything missing falls back to English. */
export interface StateLocal {
  locale: IndianLocale;
  /** Names of all 36 states and UTs, by code. */
  stateNames: Record<string, string>;
  /** Papers and steps; any not translated yet show in English. */
  docs: Partial<Record<Doc, string>>;
  steps: Partial<Record<Step, string>>;
  categories: Record<"sc" | "st" | "obc" | "minority", string>;
  reasons: Record<StateReason, (p: Params, f: ReasonFormat) => string>;
  /** Wraps a reason that isn't met, e.g. "Not a match: for women." */
  miss(text: string): string;
  /** Label of the button to the scheme's website. */
  applyLabel: string;
  /** Wording for a state's general social security pension. */
  socialPension: { name(state: string): string; short: string; about: string };
  /** [name, short line, about] for each scheme of the states that use this language. */
  entries: Record<string, [name: string, short: string, about: string]>;
}
