/** States and union territories, with names in English and Hindi. */
export const IN_STATES: [code: string, en: string, hi: string][] = [
  ["AP", "Andhra Pradesh", "आंध्र प्रदेश"],
  ["AR", "Arunachal Pradesh", "अरुणाचल प्रदेश"],
  ["AS", "Assam", "असम"],
  ["BR", "Bihar", "बिहार"],
  ["CG", "Chhattisgarh", "छत्तीसगढ़"],
  ["GA", "Goa", "गोवा"],
  ["GJ", "Gujarat", "गुजरात"],
  ["HR", "Haryana", "हरियाणा"],
  ["HP", "Himachal Pradesh", "हिमाचल प्रदेश"],
  ["JH", "Jharkhand", "झारखंड"],
  ["KA", "Karnataka", "कर्नाटक"],
  ["KL", "Kerala", "केरल"],
  ["MP", "Madhya Pradesh", "मध्य प्रदेश"],
  ["MH", "Maharashtra", "महाराष्ट्र"],
  ["MN", "Manipur", "मणिपुर"],
  ["ML", "Meghalaya", "मेघालय"],
  ["MZ", "Mizoram", "मिज़ोरम"],
  ["NL", "Nagaland", "नागालैंड"],
  ["OD", "Odisha", "ओडिशा"],
  ["PB", "Punjab", "पंजाब"],
  ["RJ", "Rajasthan", "राजस्थान"],
  ["SK", "Sikkim", "सिक्किम"],
  ["TN", "Tamil Nadu", "तमिलनाडु"],
  ["TS", "Telangana", "तेलंगाना"],
  ["TR", "Tripura", "त्रिपुरा"],
  ["UP", "Uttar Pradesh", "उत्तर प्रदेश"],
  ["UK", "Uttarakhand", "उत्तराखंड"],
  ["WB", "West Bengal", "पश्चिम बंगाल"],
  ["AN", "Andaman and Nicobar Islands", "अंडमान और निकोबार द्वीपसमूह"],
  ["CH", "Chandigarh", "चंडीगढ़"],
  ["DN", "Dadra and Nagar Haveli and Daman and Diu", "दादरा और नगर हवेली और दमन और दीव"],
  ["DL", "Delhi", "दिल्ली"],
  ["JK", "Jammu and Kashmir", "जम्मू और कश्मीर"],
  ["LA", "Ladakh", "लद्दाख"],
  ["LD", "Lakshadweep", "लक्षद्वीप"],
  ["PY", "Puducherry", "पुडुचेरी"],
];

export function inStateName(code: string, locale: string): string {
  const row = IN_STATES.find(([c]) => c === code);
  return row ? (locale === "hi" ? row[2] : row[1]) : code;
}
