import { usedStateReasonKeys } from "../../lib/india/stateReasons";
import { inStateName } from "../../lib/india/states";
import { money } from "../format";
import { DOCS, STEPS, type Doc, type StateLocal, type StateReason, type Step } from "./stateText";
import type { CountryContent, Params, ProgramContent } from "../types";

type Lang = "en" | "hi";


interface Entry {
  en: [name: string, short: string, about: string];
  hi: [name: string, short: string, about: string];
  docs: Doc[];
  steps: Step[];
  /** Set on a state's general social security pension (shared wording). */
  pensionOf?: string;
}

/** A state's own social security pension, for states without a separately named one. */
function socialPension(state: string): Entry {
  return {
    en: [
      `Social security pension (${inStateName(state, "en")})`,
      "Monthly pension for seniors, widows and people with disabilities.",
      "The state pays its own monthly pensions to older people, widows and people with disabilities, on top of central support.",
    ],
    hi: [
      `सामाजिक सुरक्षा पेंशन (${inStateName(state, "hi")})`,
      "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को मासिक पेंशन।",
      "राज्य केंद्र की मदद के अलावा बुज़ुर्गों, विधवाओं और दिव्यांगजनों को अपनी मासिक पेंशन देता है।",
    ],
    docs: ["aadhaar", "age", "bank", "domicile"],
    steps: ["office", "verify"],
    pensionOf: state,
  };
}

const entries: Record<string, Entry> = {
  "ap-ntr-bharosa": {
    en: ["NTR Bharosa pension (Andhra Pradesh)", "Monthly pension from ₹4,000 for seniors, widows, single women and people with disabilities.", "Andhra Pradesh pays monthly pensions through village and ward secretariats. Most categories get ₹4,000 a month; people with disabilities or serious illness get more."],
    hi: ["एनटीआर भरोसा पेंशन (आंध्र प्रदेश)", "बुज़ुर्गों, विधवाओं, अकेली महिलाओं और दिव्यांगजनों को ₹4,000 से शुरू मासिक पेंशन।", "आंध्र प्रदेश गाँव और वार्ड सचिवालयों के ज़रिए मासिक पेंशन देता है। ज़्यादातर श्रेणियों को ₹4,000 महीना मिलता है; दिव्यांगजनों या गंभीर बीमारी वालों को ज़्यादा।"],
    docs: ["aadhaar", "ration", "age", "bank"],
    steps: ["secretariat", "verify"],
  },
  "ap-talliki-vandanam": {
    en: ["Talliki Vandanam (Andhra Pradesh)", "₹15,000 a year for each school-going child, paid to the mother.", "Mothers of children studying in classes 1–12 get ₹15,000 a year per child. Families need a white (BPL) ration card, and the child must attend school regularly."],
    hi: ["तल्लिकी वंदनम (आंध्र प्रदेश)", "स्कूल जाने वाले हर बच्चे के लिए माँ को साल में ₹15,000।", "कक्षा 1–12 में पढ़ने वाले बच्चों की माताओं को हर बच्चे पर साल में ₹15,000 मिलते हैं। परिवार के पास सफ़ेद (बीपीएल) राशन कार्ड होना चाहिए और बच्चे का स्कूल में नियमित रहना ज़रूरी है।"],
    docs: ["aadhaar", "ration", "school", "bank"],
    steps: ["secretariat", "verify"],
  },
  "ap-annadata-sukhibhava": {
    en: ["Annadata Sukhibhava (Andhra Pradesh)", "₹20,000 a year for farmers, including ₹6,000 from PM-KISAN.", "The state adds ₹14,000 a year to PM-KISAN's ₹6,000, paid in three instalments. Tenant farmers are also covered under the state's rules."],
    hi: ["अन्नदाता सुखीभव (आंध्र प्रदेश)", "किसानों को साल में ₹20,000, जिसमें पीएम-किसान के ₹6,000 शामिल हैं।", "राज्य पीएम-किसान के ₹6,000 में साल के ₹14,000 जोड़ता है, जो तीन किस्तों में मिलते हैं। राज्य के नियमों में किराएदार किसान भी शामिल हैं।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["auto", "ekyc"],
  },
  "ap-deepam": {
    en: ["Deepam 2.0 free gas cylinders (Andhra Pradesh)", "Three free LPG refills a year for white ration card families.", "Families with a white ration card and an LPG connection get the cost of three refills a year back in their bank account."],
    hi: ["दीपम 2.0 मुफ़्त गैस सिलेंडर (आंध्र प्रदेश)", "सफ़ेद राशन कार्ड वाले परिवारों को साल में तीन मुफ़्त एलपीजी रिफ़िल।", "सफ़ेद राशन कार्ड और एलपीजी कनेक्शन वाले परिवारों को साल में तीन रिफ़िल का पैसा बैंक खाते में वापस मिलता है।"],
    docs: ["aadhaar", "ration", "bank"],
    steps: ["portal", "verify"],
  },
  "ar-cmaay": {
    en: ["Chief Minister's Arogya Arunachal Yojana", "Cashless hospital treatment for families in Arunachal Pradesh.", "CMAAY gives health cover at listed hospitals to residents of Arunachal Pradesh, alongside Ayushman Bharat."],
    hi: ["मुख्यमंत्री आरोग्य अरुणाचल योजना", "अरुणाचल प्रदेश के परिवारों के लिए बिना पैसे अस्पताल इलाज।", "सीएमएएवाई अरुणाचल प्रदेश के निवासियों को आयुष्मान भारत के साथ-साथ सूचीबद्ध अस्पतालों में स्वास्थ्य कवर देती है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "ar-dulari-kanya": {
    en: ["Dulari Kanya (Arunachal Pradesh)", "Savings and education support for girls.", "Puts a fixed deposit in the name of girls born in government hospitals, and later helps with higher education costs."],
    hi: ["दुलारी कन्या (अरुणाचल प्रदेश)", "बेटियों के लिए बचत और पढ़ाई में मदद।", "सरकारी अस्पताल में जन्मी बेटियों के नाम सावधि जमा (FD) करती है, और बाद में उच्च शिक्षा के ख़र्च में मदद करती है।"],
    docs: ["birth", "aadhaar", "bank"],
    steps: ["anganwadi", "portal"],
  },
  "as-orunodoi": {
    en: ["Orunodoi 3.0 (Assam)", "₹1,250 a month for women of poor families.", "Assam pays the woman of eligible NFSA families a monthly amount by DBT for food, medicine and household needs."],
    hi: ["अरुणोदय 3.0 (असम)", "गरीब परिवारों की महिलाओं को हर महीने ₹1,250।", "असम पात्र एनएफ़एसए परिवारों की महिला को खाने, दवा और घर की ज़रूरतों के लिए हर महीने डीबीटी से पैसे देता है।"],
    docs: ["aadhaar", "ration", "bank"],
    steps: ["office", "verify"],
  },
  "as-nijut-moina": {
    en: ["Nijut Moina (Assam)", "Monthly stipend for girls in class 11, college and postgraduate study.", "Girls in government institutions get ₹1,000 (class 11), ₹1,250 (degree) or ₹2,500 (postgraduate) a month for up to 10 months, to keep studying and avoid early marriage."],
    hi: ["निजुत मोइना (असम)", "कक्षा 11, कॉलेज और स्नातकोत्तर में पढ़ने वाली छात्राओं को हर महीने भत्ता।", "सरकारी संस्थानों में पढ़ने वाली छात्राओं को 10 महीने तक हर महीने ₹1,000 (कक्षा 11), ₹1,250 (स्नातक) या ₹2,500 (स्नातकोत्तर) मिलते हैं, ताकि पढ़ाई जारी रहे और जल्दी शादी न हो।"],
    docs: ["aadhaar", "marks", "bank"],
    steps: ["school", "verify"],
  },
  "as-atal-amrit": {
    en: ["Atal Amrit Abhiyan (Assam)", "Health insurance for families earning under ₹5 lakh a year.", "Covers treatment of serious illnesses at listed hospitals for Assam families with income below ₹5 lakh."],
    hi: ["अटल अमृत अभियान (असम)", "₹5 लाख सालाना से कम आमदनी वाले परिवारों के लिए स्वास्थ्य बीमा।", "₹5 लाख से कम आमदनी वाले असम के परिवारों के लिए सूचीबद्ध अस्पतालों में गंभीर बीमारियों का इलाज कवर करता है।"],
    docs: ["aadhaar", "income", "ration"],
    steps: ["card", "hospital"],
  },
  "br-mahila-rozgar": {
    en: ["Mukhyamantri Mahila Rozgar Yojana (Bihar)", "₹10,000 to start a livelihood, and more help later.", "One woman from each family gets ₹10,000 to start work of her choice, with further help of up to ₹2 lakh in stages if the business does well."],
    hi: ["मुख्यमंत्री महिला रोज़गार योजना (बिहार)", "रोज़गार शुरू करने के लिए ₹10,000, और बाद में और मदद।", "हर परिवार की एक महिला को अपनी पसंद का काम शुरू करने के लिए ₹10,000 मिलते हैं, और काम अच्छा चलने पर चरणों में ₹2 लाख तक की और मदद।"],
    docs: ["aadhaar", "bank", "photo", "ration"],
    steps: ["office", "verify"],
  },
  "br-kanya-utthan": {
    en: ["Mukhyamantri Kanya Utthan Yojana (Bihar)", "A one-time incentive for unmarried girls who graduate.", "Unmarried women who graduate from a university in Bihar get a one-time cash incentive (the amount was revised; check the portal). Earlier stages support girls from birth to class 12."],
    hi: ["मुख्यमंत्री कन्या उत्थान योजना (बिहार)", "स्नातक पास करने वाली अविवाहित छात्राओं को एक बार प्रोत्साहन राशि।", "बिहार के विश्वविद्यालय से स्नातक करने वाली अविवाहित महिलाओं को एक बार नक़द प्रोत्साहन मिलता है (राशि बदली गई है; पोर्टल पर देखें)। पहले के चरणों में जन्म से कक्षा 12 तक बेटियों को मदद मिलती है।"],
    docs: ["aadhaar", "marks", "bank", "domicile"],
    steps: ["portal", "verify"],
  },
  "br-student-credit-card": {
    en: ["Bihar Student Credit Card", "Education loan up to ₹4 lakh at 4% (1% for women).", "Students who passed class 12 can get up to ₹4 lakh for higher studies. Interest is 4%, or 1% for women, students with disabilities and transgender students."],
    hi: ["बिहार स्टूडेंट क्रेडिट कार्ड", "4% (महिलाओं के लिए 1%) ब्याज पर ₹4 लाख तक का शिक्षा लोन।", "12वीं पास छात्र उच्च शिक्षा के लिए ₹4 लाख तक पा सकते हैं। ब्याज 4% है, और महिलाओं, दिव्यांग और ट्रांसजेंडर छात्रों के लिए 1%।"],
    docs: ["aadhaar", "marks", "domicile", "bank"],
    steps: ["portal", "office"],
  },
  "br-vridhjan-pension": {
    en: ["Mukhyamantri Vridhjan Pension (Bihar)", "Monthly pension for everyone 60+ who has no government pension.", "Bihar pays a monthly pension to people aged 60 or more who don't get a government pension, without a BPL condition. The amount was raised to ₹1,100 a month."],
    hi: ["मुख्यमंत्री वृद्धजन पेंशन (बिहार)", "सरकारी पेंशन न पाने वाले 60+ उम्र के हर व्यक्ति को मासिक पेंशन।", "बिहार 60 साल या ज़्यादा उम्र के उन लोगों को मासिक पेंशन देता है जिन्हें सरकारी पेंशन नहीं मिलती, बिना बीपीएल शर्त के। राशि बढ़ाकर ₹1,100 महीना की गई है।"],
    docs: ["aadhaar", "age", "bank", "photo"],
    steps: ["portal", "office"],
  },
  "cg-mahtari-vandan": {
    en: ["Mahtari Vandan Yojana (Chhattisgarh)", "₹1,000 a month for married women aged 21+.", "Married women aged 21 or more, including widows and divorced women, get ₹1,000 a month. Families of income-tax payers and government employees are excluded."],
    hi: ["महतारी वंदन योजना (छत्तीसगढ़)", "21+ उम्र की विवाहित महिलाओं को हर महीने ₹1,000।", "21 साल या ज़्यादा उम्र की विवाहित महिलाओं को, जिनमें विधवा और तलाक़शुदा महिलाएँ भी हैं, हर महीने ₹1,000 मिलते हैं। इनकम टैक्स भरने वाले और सरकारी कर्मचारियों के परिवार बाहर हैं।"],
    docs: ["aadhaar", "domicile", "bank", "marriage"],
    steps: ["portal", "verify"],
  },
  "cg-krishak-unnati": {
    en: ["Krishak Unnati Yojana (Chhattisgarh)", "Extra input support per acre for paddy and other crop farmers.", "Farmers who sell paddy and other notified crops at the support price get additional input assistance per acre from the state."],
    hi: ["कृषक उन्नति योजना (छत्तीसगढ़)", "धान और दूसरी फ़सलों के किसानों को प्रति एकड़ अतिरिक्त आदान सहायता।", "समर्थन मूल्य पर धान और दूसरी अधिसूचित फ़सलें बेचने वाले किसानों को राज्य से प्रति एकड़ अतिरिक्त आदान सहायता मिलती है।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["office", "verify"],
  },
  "ga-griha-aadhar": {
    en: ["Griha Aadhar (Goa)", "₹1,500 a month for homemakers in families earning under ₹3 lakh.", "Goa supports homemakers from lower-income families with a monthly amount to manage rising household costs."],
    hi: ["गृह आधार (गोवा)", "₹3 लाख से कम आमदनी वाले परिवारों की गृहिणियों को हर महीने ₹1,500।", "गोवा कम आमदनी वाले परिवारों की गृहिणियों को बढ़ते घरेलू ख़र्च के लिए हर महीने राशि देता है।"],
    docs: ["aadhaar", "domicile", "income", "bank"],
    steps: ["portal", "office"],
  },
  "ga-dsss": {
    en: ["Dayanand Social Security Scheme (Goa)", "Monthly financial help for seniors, widows and people with disabilities.", "Goa's social security scheme gives monthly assistance to senior citizens, widows and people with disabilities who live in Goa."],
    hi: ["दयानंद सामाजिक सुरक्षा योजना (गोवा)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को हर महीने आर्थिक मदद।", "गोवा की सामाजिक सुरक्षा योजना गोवा में रहने वाले वरिष्ठ नागरिकों, विधवाओं और दिव्यांगजनों को हर महीने सहायता देती है।"],
    docs: ["aadhaar", "domicile", "age", "bank"],
    steps: ["office", "verify"],
  },
  "ga-ddssy": {
    en: ["Deen Dayal Swasthya Seva Yojana (Goa)", "Health insurance for families living in Goa.", "Families resident in Goa get cashless treatment at listed hospitals under the state health insurance scheme."],
    hi: ["दीन दयाल स्वास्थ्य सेवा योजना (गोवा)", "गोवा में रहने वाले परिवारों के लिए स्वास्थ्य बीमा।", "गोवा के निवासी परिवारों को राज्य स्वास्थ्य बीमा योजना में सूचीबद्ध अस्पतालों में बिना पैसे इलाज मिलता है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "gj-namo-lakshmi": {
    en: ["Namo Lakshmi Yojana (Gujarat)", "₹50,000 over classes 9–12 for girls.", "Girls in classes 9–12 get ₹50,000 over four years, including lump sums after passing classes 10 and 12, if family income is under ₹6 lakh."],
    hi: ["नमो लक्ष्मी योजना (गुजरात)", "कक्षा 9–12 की छात्राओं को चार साल में ₹50,000।", "कक्षा 9–12 में पढ़ने वाली छात्राओं को, परिवार की आमदनी ₹6 लाख से कम होने पर, चार साल में ₹50,000 मिलते हैं, जिसमें 10वीं और 12वीं पास करने पर एकमुश्त राशि भी है।"],
    docs: ["aadhaar", "school", "income", "bank"],
    steps: ["school", "verify"],
  },
  "gj-vahli-dikri": {
    en: ["Vahli Dikri Yojana (Gujarat)", "₹1,10,000 for the first two daughters, in three parts.", "Paid at school entry, at class 9, and at 18 for education or marriage, for families with income up to ₹2 lakh."],
    hi: ["वहाली दीकरी योजना (गुजरात)", "पहली दो बेटियों को तीन हिस्सों में ₹1,10,000।", "₹2 लाख तक आमदनी वाले परिवारों को स्कूल में दाख़िले, कक्षा 9 और 18 साल पर पढ़ाई या शादी के लिए मिलते हैं।"],
    docs: ["birth", "aadhaar", "income", "bank"],
    steps: ["office", "verify"],
  },
  "gj-ganga-swarupa": {
    en: ["Ganga Swarupa widow pension (Gujarat)", "₹1,250 a month for widows.", "Widows in Gujarat get a monthly pension paid to their bank or post office account."],
    hi: ["गंगा स्वरूपा विधवा पेंशन (गुजरात)", "विधवाओं को हर महीने ₹1,250।", "गुजरात की विधवाओं को बैंक या डाकघर खाते में हर महीने पेंशन मिलती है।"],
    docs: ["aadhaar", "death", "age", "bank"],
    steps: ["portal", "office"],
  },
  "hr-lado-lakshmi": {
    en: ["Deen Dayal Lado Lakshmi Yojana (Haryana)", "₹2,100 a month for women 23+ in families earning up to ₹1 lakh.", "Haryana pays ₹2,100 a month: ₹1,100 to the woman's account and ₹1,000 into a deposit she receives with interest after five years. Every eligible woman in a family can get it."],
    hi: ["दीन दयाल लाडो लक्ष्मी योजना (हरियाणा)", "₹1 लाख तक आमदनी वाले परिवारों की 23+ उम्र की महिलाओं को हर महीने ₹2,100।", "हरियाणा हर महीने ₹2,100 देता है: ₹1,100 महिला के खाते में और ₹1,000 एक जमा खाते में, जो पाँच साल बाद ब्याज के साथ मिलता है। परिवार की हर पात्र महिला इसे पा सकती है।"],
    docs: ["aadhaar", "familyId", "bank", "domicile"],
    steps: ["portal", "verify"],
  },
  "hr-old-age-samman": {
    en: ["Old Age Samman Allowance (Haryana)", "Monthly pension for people 60+ with family income under ₹3 lakh.", "Haryana pays one of the highest monthly old-age allowances in India. Eligibility is checked through your Family ID."],
    hi: ["बुढ़ापा सम्मान भत्ता (हरियाणा)", "₹3 लाख से कम पारिवारिक आमदनी वाले 60+ लोगों को मासिक पेंशन।", "हरियाणा देश के सबसे ज़्यादा मासिक बुढ़ापा भत्तों में से एक देता है। पात्रता परिवार पहचान पत्र से जाँची जाती है।"],
    docs: ["familyId", "aadhaar", "age", "bank"],
    steps: ["auto", "ekyc"],
  },
  "hr-family-id": {
    en: ["Parivar Pehchan Patra – Family ID (Haryana)", "One family ID that opens most Haryana schemes.", "Haryana uses the Family ID to work out who qualifies for pensions, Lado Lakshmi, ration and more, often without a separate form. Keep its income and member details correct."],
    hi: ["परिवार पहचान पत्र (हरियाणा)", "एक परिवार आईडी जिससे हरियाणा की ज़्यादातर योजनाएँ मिलती हैं।", "हरियाणा परिवार पहचान पत्र से तय करता है कि पेंशन, लाडो लक्ष्मी, राशन वग़ैरह कौन पा सकता है, अक्सर बिना अलग फ़ॉर्म के। इसकी आमदनी और सदस्यों की जानकारी सही रखें।"],
    docs: ["aadhaar", "ration", "income", "photo"],
    steps: ["portal", "office"],
  },
  "hp-pyari-behna": {
    en: ["Indira Gandhi Pyari Behna Sukh Samman Nidhi (Himachal Pradesh)", "₹1,500 a month for women aged 18–59.", "Women aged 18–59 who live permanently in Himachal get ₹1,500 a month. Since April 2026 family income must be under ₹2 lakh, and families of government employees or pensioners are excluded."],
    hi: ["इंदिरा गांधी प्यारी बहना सुख सम्मान निधि (हिमाचल प्रदेश)", "18–59 साल की महिलाओं को हर महीने ₹1,500।", "हिमाचल की स्थायी निवासी 18–59 साल की महिलाओं को हर महीने ₹1,500 मिलते हैं। अप्रैल 2026 से परिवार की आमदनी ₹2 लाख से कम होनी चाहिए, और सरकारी कर्मचारियों या पेंशनरों के परिवार बाहर हैं।"],
    docs: ["aadhaar", "domicile", "income", "bank"],
    steps: ["portal", "office"],
  },
  "hp-social-pension": socialPension("HP"),
  "jh-maiyan-samman": {
    en: ["Mukhyamantri Maiyan Samman Yojana (Jharkhand)", "₹2,500 a month for women aged 18–50.", "Women aged 18–50 with a Jharkhand ration card and their own Aadhaar-linked bank account get ₹2,500 a month. Keep verification and e-KYC up to date."],
    hi: ["मुख्यमंत्री मईयाँ सम्मान योजना (झारखंड)", "18–50 साल की महिलाओं को हर महीने ₹2,500।", "झारखंड के राशन कार्ड और अपने नाम के आधार-जुड़े बैंक खाते वाली 18–50 साल की महिलाओं को हर महीने ₹2,500 मिलते हैं। सत्यापन और ई-केवाईसी अपडेट रखें।"],
    docs: ["aadhaar", "ration", "bank", "domicile"],
    steps: ["portal", "ekyc"],
  },
  "jh-sarvjan-pension": {
    en: ["Sarvjan Pension Yojana (Jharkhand)", "₹1,000 a month for seniors, widows and people with disabilities.", "Jharkhand's universal pension covers older people, widows, single women and people with disabilities with ₹1,000 a month."],
    hi: ["सर्वजन पेंशन योजना (झारखंड)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को हर महीने ₹1,000।", "झारखंड की सर्वजन पेंशन बुज़ुर्गों, विधवाओं, अकेली महिलाओं और दिव्यांगजनों को हर महीने ₹1,000 देती है।"],
    docs: ["aadhaar", "age", "bank", "ration"],
    steps: ["portal", "office"],
  },
  "jh-kishori-samriddhi": {
    en: ["Savitribai Phule Kishori Samriddhi Yojana (Jharkhand)", "Cash support for girls from class 8 to age 19.", "Girls get instalments as they move through classes 8–12, and a final amount at 18–19, to help them finish school."],
    hi: ["सावित्रीबाई फुले किशोरी समृद्धि योजना (झारखंड)", "कक्षा 8 से 19 साल की उम्र तक बेटियों को नक़द मदद।", "बेटियों को कक्षा 8–12 में आगे बढ़ने पर किस्तें मिलती हैं, और 18–19 साल पर आख़िरी राशि, ताकि वे स्कूल पूरा कर सकें।"],
    docs: ["aadhaar", "school", "ration", "bank"],
    steps: ["school", "verify"],
  },
  "jk-ladli-beti": {
    en: ["Ladli Beti (Jammu and Kashmir)", "Monthly savings for girls in low-income families, paid out at 21.", "The government deposits a monthly amount for girls born in families earning under ₹1.5 lakh; the savings are paid to her at 21."],
    hi: ["लाडली बेटी (जम्मू और कश्मीर)", "कम आमदनी वाले परिवारों की बेटियों के लिए मासिक बचत, 21 साल पर भुगतान।", "₹1.5 लाख से कम आमदनी वाले परिवारों में जन्मी बेटियों के लिए सरकार हर महीने राशि जमा करती है; यह बचत उसे 21 साल पर मिलती है।"],
    docs: ["birth", "aadhaar", "income", "bank"],
    steps: ["office", "verify"],
  },
  "jk-social-pension": socialPension("JK"),
  "ka-gruha-lakshmi": {
    en: ["Gruha Lakshmi (Karnataka)", "₹2,000 a month for the woman head of the family.", "The woman head of each eligible family gets ₹2,000 a month. She and her husband must not pay income tax or GST."],
    hi: ["गृह लक्ष्मी (कर्नाटक)", "परिवार की मुखिया महिला को हर महीने ₹2,000।", "हर पात्र परिवार की मुखिया महिला को हर महीने ₹2,000 मिलते हैं। वह और उसके पति इनकम टैक्स या जीएसटी न भरते हों।"],
    docs: ["aadhaar", "ration", "bank"],
    steps: ["portal", "verify"],
  },
  "ka-gruha-jyothi": {
    en: ["Gruha Jyothi (Karnataka)", "Free electricity up to 200 units a month for homes.", "Households get free electricity up to 200 units a month, based on their average use. Link your electricity account to Aadhaar."],
    hi: ["गृह ज्योति (कर्नाटक)", "घरों को हर महीने 200 यूनिट तक मुफ़्त बिजली।", "घरों को उनके औसत इस्तेमाल के आधार पर हर महीने 200 यूनिट तक मुफ़्त बिजली मिलती है। अपना बिजली खाता आधार से जोड़ें।"],
    docs: ["aadhaar", "electricity"],
    steps: ["portal", "auto"],
  },
  "ka-shakti": {
    en: ["Shakti free bus travel (Karnataka)", "Free travel for women in state-run buses.", "Women living in Karnataka travel free on non-luxury state transport buses. Show a government ID or Shakti smart card."],
    hi: ["शक्ति मुफ़्त बस यात्रा (कर्नाटक)", "सरकारी बसों में महिलाओं के लिए मुफ़्त यात्रा।", "कर्नाटक में रहने वाली महिलाएँ राज्य परिवहन की सामान्य बसों में मुफ़्त यात्रा करती हैं। सरकारी पहचान पत्र या शक्ति स्मार्ट कार्ड दिखाएँ।"],
    docs: ["aadhaar", "domicile"],
    steps: ["card", "showId"],
  },
  "ka-yuva-nidhi": {
    en: ["Yuva Nidhi (Karnataka)", "₹3,000 a month for unemployed graduates, ₹1,500 for diploma holders.", "Young graduates and diploma holders who haven't found a job within six months of finishing get a monthly allowance for up to two years."],
    hi: ["युवा निधि (कर्नाटक)", "बेरोज़गार स्नातकों को हर महीने ₹3,000, डिप्लोमा वालों को ₹1,500।", "पढ़ाई पूरी करने के छह महीने में नौकरी न पाने वाले युवा स्नातकों और डिप्लोमा धारकों को दो साल तक हर महीने भत्ता मिलता है।"],
    docs: ["aadhaar", "marks", "domicile", "bank"],
    steps: ["portal", "verify"],
  },
  "ka-anna-bhagya": {
    en: ["Anna Bhagya (Karnataka)", "Extra free rice on top of the central ration.", "AAY and priority ration card families in Karnataka get additional rice every month beyond the central 5 kg per person."],
    hi: ["अन्न भाग्य (कर्नाटक)", "केंद्र के राशन के ऊपर अतिरिक्त मुफ़्त चावल।", "कर्नाटक के अंत्योदय और पात्र गृहस्थी राशन कार्ड वाले परिवारों को केंद्र के 5 किलो प्रति व्यक्ति के अलावा हर महीने अतिरिक्त चावल मिलता है।"],
    docs: ["ration", "aadhaar"],
    steps: ["rationShop"],
  },
  "kl-welfare-pension": {
    en: ["Social security pension (Kerala)", "₹2,000 a month for seniors, widows and people with disabilities.", "Kerala's welfare pensions — old age, widow, disability, agricultural labourers and unmarried women over 50 — were raised to ₹2,000 a month in 2026. Family income must be under ₹1 lakh."],
    hi: ["सामाजिक सुरक्षा पेंशन (केरल)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को हर महीने ₹2,000।", "केरल की कल्याण पेंशन — वृद्धावस्था, विधवा, दिव्यांग, खेत मज़दूर और 50 से ज़्यादा उम्र की अविवाहित महिलाएँ — 2026 में बढ़ाकर ₹2,000 महीना की गई। परिवार की आमदनी ₹1 लाख से कम होनी चाहिए।"],
    docs: ["aadhaar", "age", "income", "bank"],
    steps: ["office", "verify"],
  },
  "kl-kasp": {
    en: ["Karunya Arogya Suraksha Padhathi (Kerala)", "Cashless treatment up to ₹5 lakh a year for poor families.", "Kerala's health cover, run with PM-JAY, pays for hospital care at government and listed private hospitals."],
    hi: ["कारुण्य आरोग्य सुरक्षा पद्धति (केरल)", "गरीब परिवारों को साल में ₹5 लाख तक बिना पैसे इलाज।", "केरल का स्वास्थ्य कवर, जो पीएम-जय के साथ चलता है, सरकारी और सूचीबद्ध निजी अस्पतालों में इलाज का ख़र्च देता है।"],
    docs: ["aadhaar", "ration"],
    steps: ["card", "hospital"],
  },
  "kl-life-mission": {
    en: ["LIFE Mission housing (Kerala)", "Help to build a house for homeless and landless families.", "LIFE Mission gives money to build a house, or a flat for landless families, through your local body."],
    hi: ["लाइफ़ मिशन आवास (केरल)", "बेघर और भूमिहीन परिवारों को घर बनाने में मदद।", "लाइफ़ मिशन आपकी स्थानीय निकाय के ज़रिए घर बनाने के लिए पैसे देता है, या भूमिहीन परिवारों को फ़्लैट।"],
    docs: ["aadhaar", "ration", "income", "land"],
    steps: ["office", "verify"],
  },
  "mp-ladli-behna": {
    en: ["Mukhyamantri Ladli Behna Yojana (Madhya Pradesh)", "₹1,500 a month for women aged 21–60.", "Married, widowed, divorced or abandoned women aged 21–60 in families earning under ₹2.5 lakh get ₹1,500 a month by DBT. New registration opens only in set periods."],
    hi: ["मुख्यमंत्री लाडली बहना योजना (मध्य प्रदेश)", "21–60 साल की महिलाओं को हर महीने ₹1,500।", "₹2.5 लाख से कम आमदनी वाले परिवारों की 21–60 साल की विवाहित, विधवा, तलाक़शुदा या परित्यक्ता महिलाओं को डीबीटी से हर महीने ₹1,500 मिलते हैं। नया पंजीकरण तय समय पर ही खुलता है।"],
    docs: ["samagra", "aadhaar", "bank"],
    steps: ["office", "ekyc"],
  },
  "mp-ladli-laxmi": {
    en: ["Ladli Laxmi Yojana (Madhya Pradesh)", "Over ₹1.4 lakh in stages for girls, from birth to college.", "Girls registered at birth get scholarships in classes 6, 9, 11 and 12, and a final payment after 21 if they finish class 12 and don't marry before 18."],
    hi: ["लाडली लक्ष्मी योजना (मध्य प्रदेश)", "बेटियों को जन्म से कॉलेज तक चरणों में ₹1.4 लाख से ज़्यादा।", "जन्म पर पंजीकृत बेटियों को कक्षा 6, 9, 11 और 12 में छात्रवृत्ति, और 12वीं पूरी करने व 18 से पहले शादी न होने पर 21 साल के बाद आख़िरी भुगतान मिलता है।"],
    docs: ["birth", "samagra", "aadhaar", "bank"],
    steps: ["anganwadi", "portal"],
  },
  "mp-kisan-kalyan": {
    en: ["Mukhyamantri Kisan Kalyan Yojana (Madhya Pradesh)", "₹6,000 a year extra for PM-KISAN farmers.", "Farmers in Madhya Pradesh who get PM-KISAN receive another ₹6,000 a year from the state — ₹12,000 in total."],
    hi: ["मुख्यमंत्री किसान कल्याण योजना (मध्य प्रदेश)", "पीएम-किसान वाले किसानों को साल में ₹6,000 अतिरिक्त।", "पीएम-किसान पाने वाले मध्य प्रदेश के किसानों को राज्य से साल में ₹6,000 और मिलते हैं — यानी कुल ₹12,000।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["auto", "ekyc"],
  },
  "mp-sambal": {
    en: ["Sambal 2.0 for unorganised workers (Madhya Pradesh)", "Accident cover, maternity help and funeral aid for workers.", "Registered unorganised workers get ex-gratia on accidental death or disability, maternity assistance, funeral help and support for children's education."],
    hi: ["संबल 2.0 असंगठित श्रमिकों के लिए (मध्य प्रदेश)", "श्रमिकों के लिए दुर्घटना सहायता, प्रसूति मदद और अंत्येष्टि सहायता।", "पंजीकृत असंगठित श्रमिकों को दुर्घटना में मृत्यु या दिव्यांगता पर अनुग्रह राशि, प्रसूति सहायता, अंत्येष्टि मदद और बच्चों की पढ़ाई में सहायता मिलती है।"],
    docs: ["samagra", "aadhaar", "labour", "bank"],
    steps: ["portal", "office"],
  },
  "mh-ladki-bahin": {
    en: ["Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra)", "₹1,500 a month for women aged 21–65.", "Married, widowed, divorced, abandoned or destitute women, and one unmarried woman per family, get ₹1,500 a month if family income is under ₹2.5 lakh. Existing beneficiaries must keep e-KYC current; new registration opens only at times."],
    hi: ["मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र)", "21–65 साल की महिलाओं को हर महीने ₹1,500।", "₹2.5 लाख से कम पारिवारिक आमदनी वाली विवाहित, विधवा, तलाक़शुदा, परित्यक्ता या निराधार महिलाओं, और परिवार की एक अविवाहित महिला को हर महीने ₹1,500 मिलते हैं। मौजूदा लाभार्थियों को ई-केवाईसी अपडेट रखना है; नया पंजीकरण कभी-कभी ही खुलता है।"],
    docs: ["aadhaar", "domicile", "income", "bank"],
    steps: ["portal", "ekyc"],
  },
  "mh-namo-shetkari": {
    en: ["Namo Shetkari Mahasanman Nidhi (Maharashtra)", "₹6,000 a year extra for PM-KISAN farmers.", "Every PM-KISAN farmer in Maharashtra gets another ₹6,000 a year from the state, in three instalments. There's no separate form."],
    hi: ["नमो शेतकरी महासन्मान निधि (महाराष्ट्र)", "पीएम-किसान वाले किसानों को साल में ₹6,000 अतिरिक्त।", "महाराष्ट्र के हर पीएम-किसान किसान को राज्य से तीन किस्तों में साल में ₹6,000 और मिलते हैं। अलग फ़ॉर्म नहीं है।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["auto", "ekyc"],
  },
  "mh-mjpjay": {
    en: ["Mahatma Jyotirao Phule Jan Arogya Yojana (Maharashtra)", "Cashless hospital treatment up to ₹5 lakh per family a year.", "Families in Maharashtra with a ration card get cashless treatment for listed illnesses and surgeries at network hospitals, together with PM-JAY."],
    hi: ["महात्मा ज्योतिराव फुले जन आरोग्य योजना (महाराष्ट्र)", "हर परिवार को साल में ₹5 लाख तक बिना पैसे अस्पताल इलाज।", "राशन कार्ड वाले महाराष्ट्र के परिवारों को पीएम-जय के साथ नेटवर्क अस्पतालों में सूचीबद्ध बीमारियों और ऑपरेशन का बिना पैसे इलाज मिलता है।"],
    docs: ["ration", "aadhaar"],
    steps: ["card", "hospital"],
  },
  "mh-lek-ladki": {
    en: ["Lek Ladki Yojana (Maharashtra)", "About ₹1 lakh in stages for girls born in yellow or orange ration card families.", "Girls born on or after 1 April 2023 get payments at birth, school entry, class 6, class 11 and at 18."],
    hi: ["लेक लाडकी योजना (महाराष्ट्र)", "पीले या नारंगी राशन कार्ड वाले परिवारों में जन्मी बेटियों को चरणों में लगभग ₹1 लाख।", "1 अप्रैल 2023 या उसके बाद जन्मी बेटियों को जन्म, स्कूल में दाख़िले, कक्षा 6, कक्षा 11 और 18 साल पर भुगतान मिलता है।"],
    docs: ["birth", "ration", "aadhaar", "bank"],
    steps: ["anganwadi", "verify"],
  },
  "mh-mahadbt": {
    en: ["MahaDBT scholarships (Maharashtra)", "One portal for state scholarships and fee reimbursement.", "SC, ST, OBC, VJNT, SBC, EWS and minority students apply for Maharashtra's scholarships and tuition fee reimbursement on MahaDBT."],
    hi: ["महाडीबीटी छात्रवृत्ति (महाराष्ट्र)", "राज्य की छात्रवृत्ति और फ़ीस प्रतिपूर्ति के लिए एक पोर्टल।", "एससी, एसटी, ओबीसी, वीजेएनटी, एसबीसी, ईडब्ल्यूएस और अल्पसंख्यक छात्र महाडीबीटी पर महाराष्ट्र की छात्रवृत्ति और ट्यूशन फ़ीस प्रतिपूर्ति के लिए आवेदन करते हैं।"],
    docs: ["aadhaar", "caste", "income", "marks"],
    steps: ["portal", "school"],
  },
  "mn-cmht": {
    en: ["Chief Minister-gi Hakshelgi Tengbang (Manipur)", "State health cover for families in Manipur.", "Manipur's health assurance scheme pays for treatment at listed hospitals, alongside Ayushman Bharat."],
    hi: ["चीफ़ मिनिस्टर-गी हकशेलगी तेंगबंग (मणिपुर)", "मणिपुर के परिवारों के लिए राज्य स्वास्थ्य कवर।", "मणिपुर की स्वास्थ्य योजना आयुष्मान भारत के साथ सूचीबद्ध अस्पतालों में इलाज का ख़र्च देती है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "ml-mhis": {
    en: ["Megha Health Insurance Scheme (Meghalaya)", "Health insurance for families in Meghalaya.", "MHIS gives cashless treatment at listed hospitals to residents of Meghalaya, working together with PM-JAY."],
    hi: ["मेघा स्वास्थ्य बीमा योजना (मेघालय)", "मेघालय के परिवारों के लिए स्वास्थ्य बीमा।", "एमएचआईएस पीएम-जय के साथ मिलकर मेघालय के निवासियों को सूचीबद्ध अस्पतालों में बिना पैसे इलाज देती है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "mz-bana-kaih": {
    en: ["Bana Kaih – Handholding scheme (Mizoram)", "Loans and support for farmers and small businesses.", "Mizoram's flagship scheme helps farmers and entrepreneurs with interest-subsidised loans and support to grow their work."],
    hi: ["बना काइह – हैंडहोल्डिंग योजना (मिज़ोरम)", "किसानों और छोटे व्यापारियों के लिए लोन और मदद।", "मिज़ोरम की प्रमुख योजना किसानों और उद्यमियों को ब्याज सब्सिडी वाले लोन और काम बढ़ाने में मदद देती है।"],
    docs: ["aadhaar", "domicile", "bank"],
    steps: ["portal", "office"],
  },
  "nl-cmhis": {
    en: ["Chief Minister's Health Insurance Scheme (Nagaland)", "Health cover for families in Nagaland.", "Nagaland's health insurance pays for treatment at listed hospitals for residents of the state, together with PM-JAY."],
    hi: ["मुख्यमंत्री स्वास्थ्य बीमा योजना (नागालैंड)", "नागालैंड के परिवारों के लिए स्वास्थ्य कवर।", "नागालैंड का स्वास्थ्य बीमा पीएम-जय के साथ राज्य के निवासियों को सूचीबद्ध अस्पतालों में इलाज का ख़र्च देता है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "sk-aama-sahayog": {
    en: ["Aama Sahayog Yojana (Sikkim)", "Yearly support for mothers who are homemakers.", "Sikkim supports mothers who don't have a government job with a yearly amount paid to their bank account."],
    hi: ["आमा सहयोग योजना (सिक्किम)", "गृहिणी माताओं को सालाना सहायता।", "सिक्किम सरकारी नौकरी न करने वाली माताओं को उनके बैंक खाते में सालाना राशि देता है।"],
    docs: ["aadhaar", "domicile", "bank"],
    steps: ["office", "verify"],
  },
  "od-subhadra": {
    en: ["Subhadra Yojana (Odisha)", "₹10,000 a year for women aged 21–60, in two instalments.", "Women aged 21–60 with an NFSA/SFSS ration card, or family income up to ₹2.5 lakh, get ₹50,000 over five years — ₹5,000 on Rakhi Purnima and ₹5,000 on Women's Day. Women already getting ₹1,500 a month or more from another scheme are excluded."],
    hi: ["सुभद्रा योजना (ओडिशा)", "21–60 साल की महिलाओं को दो किस्तों में साल में ₹10,000।", "एनएफ़एसए/एसएफ़एसएस राशन कार्ड वाली, या ₹2.5 लाख तक पारिवारिक आमदनी वाली 21–60 साल की महिलाओं को पाँच साल में ₹50,000 मिलते हैं — राखी पूर्णिमा पर ₹5,000 और महिला दिवस पर ₹5,000। किसी और योजना से ₹1,500 महीना या ज़्यादा पाने वाली महिलाएँ बाहर हैं।"],
    docs: ["aadhaar", "ration", "bank", "domicile"],
    steps: ["portal", "ekyc"],
  },
  "od-cm-kisan": {
    en: ["CM-KISAN (Odisha)", "State cash support for small farmers and landless farm families.", "Odisha's CM-KISAN gives yearly livelihood support to small and marginal farmers and landless agricultural households."],
    hi: ["सीएम-किसान (ओडिशा)", "छोटे किसानों और भूमिहीन खेतिहर परिवारों को राज्य की नक़द मदद।", "ओडिशा की सीएम-किसान योजना छोटे और सीमांत किसानों और भूमिहीन खेतिहर परिवारों को सालाना आजीविका सहायता देती है।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["portal", "office"],
  },
  "od-madhu-babu": {
    en: ["Madhu Babu Pension Yojana (Odisha)", "Monthly pension for seniors, widows and people with disabilities.", "Odisha's main state pension covers older people, widows, people with disabilities and other vulnerable groups, paid monthly by DBT."],
    hi: ["मधु बाबू पेंशन योजना (ओडिशा)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को मासिक पेंशन।", "ओडिशा की मुख्य राज्य पेंशन बुज़ुर्गों, विधवाओं, दिव्यांगजनों और दूसरे कमज़ोर समूहों को डीबीटी से हर महीने मिलती है।"],
    docs: ["aadhaar", "age", "income", "bank"],
    steps: ["office", "verify"],
  },
  "pb-old-age-pension": {
    en: ["Old age pension (Punjab)", "₹1,500 a month for seniors with low income.", "Men aged 65+ and women aged 58+ (as set by Punjab) with family income under ₹60,000 a year get ₹1,500 a month."],
    hi: ["वृद्धावस्था पेंशन (पंजाब)", "कम आमदनी वाले बुज़ुर्गों को हर महीने ₹1,500।", "₹60,000 सालाना से कम पारिवारिक आमदनी वाले 65+ उम्र के पुरुषों और 58+ उम्र की महिलाओं को (पंजाब के नियम के अनुसार) हर महीने ₹1,500 मिलते हैं।"],
    docs: ["aadhaar", "age", "income", "bank"],
    steps: ["office", "verify"],
  },
  "pb-ashirwad": {
    en: ["Ashirwad scheme (Punjab)", "Up to ₹51,000 for a daughter's marriage.", "SC, backward-class and economically weaker families with very low income get help for the marriage of up to two daughters."],
    hi: ["आशीर्वाद योजना (पंजाब)", "बेटी की शादी के लिए ₹51,000 तक।", "बहुत कम आमदनी वाले एससी, पिछड़े वर्ग और आर्थिक रूप से कमज़ोर परिवारों को दो बेटियों तक की शादी के लिए मदद मिलती है।"],
    docs: ["aadhaar", "caste", "income", "marriage"],
    steps: ["office", "verify"],
  },
  "pb-free-power": {
    en: ["300 free units of electricity (Punjab)", "Free electricity up to 300 units a month for homes.", "Domestic consumers in Punjab get up to 300 units a month free (600 units on a two-month bill)."],
    hi: ["300 यूनिट मुफ़्त बिजली (पंजाब)", "घरों को हर महीने 300 यूनिट तक मुफ़्त बिजली।", "पंजाब के घरेलू उपभोक्ताओं को हर महीने 300 यूनिट तक (दो महीने के बिल में 600 यूनिट) मुफ़्त मिलती है।"],
    docs: ["electricity", "aadhaar"],
    steps: ["auto"],
  },
  "rj-maa": {
    en: ["Mukhyamantri Ayushman Arogya Yojana – MAA (Rajasthan)", "Cashless treatment up to ₹25 lakh a year.", "Rajasthan's health scheme covers NFSA and SECC families, small farmers and contract workers free; other families can join by paying a yearly premium."],
    hi: ["मुख्यमंत्री आयुष्मान आरोग्य योजना – मा (राजस्थान)", "साल में ₹25 लाख तक बिना पैसे इलाज।", "राजस्थान की स्वास्थ्य योजना एनएफ़एसए और एसईसीसी परिवारों, छोटे किसानों और संविदा कर्मियों को मुफ़्त कवर देती है; बाक़ी परिवार सालाना प्रीमियम देकर जुड़ सकते हैं।"],
    docs: ["janAadhaar", "aadhaar", "ration"],
    steps: ["portal", "hospital"],
  },
  "rj-lado-protsahan": {
    en: ["Lado Protsahan Yojana (Rajasthan)", "₹1.5 lakh in stages for girls, from birth to graduation.", "Girls born in government or listed hospitals get a ₹1.5 lakh savings bond, paid in instalments from birth up to graduation and age 21."],
    hi: ["लाडो प्रोत्साहन योजना (राजस्थान)", "बेटियों को जन्म से स्नातक तक चरणों में ₹1.5 लाख।", "सरकारी या सूचीबद्ध अस्पताल में जन्मी बेटियों को ₹1.5 लाख का बचत बॉन्ड मिलता है, जो जन्म से स्नातक और 21 साल तक किस्तों में मिलता है।"],
    docs: ["birth", "janAadhaar", "bank"],
    steps: ["anganwadi", "verify"],
  },
  "rj-palanhar": {
    en: ["Palanhar Yojana (Rajasthan)", "Monthly support to raise children of widows, orphans and other vulnerable families.", "Families caring for orphans or for children of widowed, disabled or other vulnerable parents get a monthly amount per child plus a yearly grant, if the child attends school or anganwadi."],
    hi: ["पालनहार योजना (राजस्थान)", "विधवाओं, अनाथों और दूसरे कमज़ोर परिवारों के बच्चों की परवरिश के लिए मासिक मदद।", "अनाथ बच्चों या विधवा, दिव्यांग या दूसरे कमज़ोर माता-पिता के बच्चों की देखभाल करने वाले परिवारों को, बच्चे के स्कूल या आंगनवाड़ी जाने पर, हर बच्चे के लिए मासिक राशि और सालाना अनुदान मिलता है।"],
    docs: ["janAadhaar", "aadhaar", "school", "bank"],
    steps: ["portal", "office"],
  },
  "rj-pension": {
    en: ["Social security pension (Rajasthan)", "Monthly pension for seniors, widows and people with disabilities.", "Rajasthan's pensions for older people (women 55+, men 58+), widows and people with disabilities apply to families with income under ₹48,000 a year."],
    hi: ["सामाजिक सुरक्षा पेंशन (राजस्थान)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को मासिक पेंशन।", "राजस्थान की पेंशन बुज़ुर्गों (महिलाएँ 55+, पुरुष 58+), विधवाओं और दिव्यांगजनों के लिए है, ₹48,000 सालाना से कम आमदनी वाले परिवारों में।"],
    docs: ["janAadhaar", "aadhaar", "age", "bank"],
    steps: ["portal", "office"],
  },
  "tn-kmut": {
    en: ["Kalaignar Magalir Urimai Thogai (Tamil Nadu)", "₹1,000 a month for women heads of family.", "Women heads of family aged 21+ in families earning under ₹2.5 lakh get ₹1,000 a month. The new state government has said it will restructure and raise this support; check the latest rules."],
    hi: ["कलैग्नर मगलिर उरिमै तोगै (तमिलनाडु)", "परिवार की मुखिया महिलाओं को हर महीने ₹1,000।", "₹2.5 लाख से कम आमदनी वाले परिवारों की 21+ उम्र की मुखिया महिलाओं को हर महीने ₹1,000 मिलते हैं। नई राज्य सरकार ने कहा है कि वह इसे बदलकर बढ़ाएगी; ताज़ा नियम देखें।"],
    docs: ["aadhaar", "ration", "bank", "electricity"],
    steps: ["portal", "verify"],
  },
  "tn-pudhumai-penn": {
    en: ["Pudhumai Penn and Tamil Pudhalvan (Tamil Nadu)", "₹1,000 a month for college students who studied in government schools.", "Students who studied in Tamil Nadu government schools from class 6 to 12 get ₹1,000 a month during their first degree, diploma or ITI course — girls under Pudhumai Penn, boys under Tamil Pudhalvan."],
    hi: ["पुदुमै पेण्ण और तमिल पुदल्वन (तमिलनाडु)", "सरकारी स्कूलों से पढ़े कॉलेज छात्रों को हर महीने ₹1,000।", "कक्षा 6 से 12 तक तमिलनाडु के सरकारी स्कूलों में पढ़े छात्रों को पहली डिग्री, डिप्लोमा या आईटीआई के दौरान हर महीने ₹1,000 मिलते हैं — छात्राओं को पुदुमै पेण्ण में, छात्रों को तमिल पुदल्वन में।"],
    docs: ["aadhaar", "school", "bank"],
    steps: ["school", "verify"],
  },
  "tn-cmchis": {
    en: ["Chief Minister's Comprehensive Health Insurance Scheme (Tamil Nadu)", "Cashless treatment up to ₹5 lakh a year for families earning up to ₹1.2 lakh.", "CMCHIS, run with PM-JAY, pays for treatment at government and listed private hospitals in Tamil Nadu."],
    hi: ["मुख्यमंत्री व्यापक स्वास्थ्य बीमा योजना (तमिलनाडु)", "₹1.2 लाख तक आमदनी वाले परिवारों को साल में ₹5 लाख तक बिना पैसे इलाज।", "पीएम-जय के साथ चलने वाली सीएमसीएचआईएस तमिलनाडु के सरकारी और सूचीबद्ध निजी अस्पतालों में इलाज का ख़र्च देती है।"],
    docs: ["ration", "aadhaar", "income"],
    steps: ["card", "hospital"],
  },
  "tn-breakfast": {
    en: ["Chief Minister's Breakfast Scheme (Tamil Nadu)", "Free breakfast for children in government primary schools.", "Children in classes 1–5 of government schools get a hot breakfast every school day, in addition to the midday meal."],
    hi: ["मुख्यमंत्री नाश्ता योजना (तमिलनाडु)", "सरकारी प्राथमिक स्कूलों के बच्चों को मुफ़्त नाश्ता।", "सरकारी स्कूलों की कक्षा 1–5 के बच्चों को दोपहर के भोजन के अलावा स्कूल के हर दिन गरम नाश्ता मिलता है।"],
    docs: ["noPapers"],
    steps: ["schoolMeal"],
  },
  "ts-rythu-bharosa": {
    en: ["Rythu Bharosa (Telangana)", "₹12,000 per acre a year for farmers (₹6,000 each season).", "Telangana pays farmers investment support per acre for the kharif and rabi seasons, straight to their bank accounts. Payments have sometimes been made in stages."],
    hi: ["रैतु भरोसा (तेलंगाना)", "किसानों को साल में प्रति एकड़ ₹12,000 (हर मौसम ₹6,000)।", "तेलंगाना ख़रीफ़ और रबी मौसम के लिए किसानों को प्रति एकड़ निवेश सहायता सीधे बैंक खाते में देता है। भुगतान कभी-कभी चरणों में हुआ है।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["auto", "verify"],
  },
  "ts-mahalakshmi": {
    en: ["Mahalakshmi (Telangana)", "Free bus travel for women, and help with gas cylinder costs.", "Women in Telangana travel free on TGSRTC city and ordinary buses. Eligible families also get LPG cylinders at a subsidised price."],
    hi: ["महालक्ष्मी (तेलंगाना)", "महिलाओं के लिए मुफ़्त बस यात्रा, और गैस सिलेंडर के ख़र्च में मदद।", "तेलंगाना की महिलाएँ टीजीएसआरटीसी की शहरी और साधारण बसों में मुफ़्त यात्रा करती हैं। पात्र परिवारों को रियायती दाम पर एलपीजी सिलेंडर भी मिलते हैं।"],
    docs: ["aadhaar", "domicile"],
    steps: ["showId", "verify"],
  },
  "ts-gruha-jyothi": {
    en: ["Gruha Jyothi (Telangana)", "Free electricity up to 200 units a month for white ration card families.", "Households with a white ration card that use up to 200 units a month pay nothing for that electricity."],
    hi: ["गृह ज्योति (तेलंगाना)", "सफ़ेद राशन कार्ड वाले परिवारों को हर महीने 200 यूनिट तक मुफ़्त बिजली।", "सफ़ेद राशन कार्ड वाले जिन घरों में हर महीने 200 यूनिट तक बिजली ख़र्च होती है, उन्हें उसका कोई पैसा नहीं देना पड़ता।"],
    docs: ["electricity", "ration", "aadhaar"],
    steps: ["office", "auto"],
  },
  "ts-kalyana-lakshmi": {
    en: ["Kalyana Lakshmi and Shaadi Mubarak (Telangana)", "₹1,00,116 for a daughter's marriage.", "Brides aged 18+ from families earning up to ₹2 lakh get ₹1,00,116 — Kalyana Lakshmi for SC, ST and BC families, Shaadi Mubarak for minority families. Apply before the wedding or within six months after."],
    hi: ["कल्याण लक्ष्मी और शादी मुबारक (तेलंगाना)", "बेटी की शादी के लिए ₹1,00,116।", "₹2 लाख तक आमदनी वाले परिवारों की 18+ उम्र की दुल्हनों को ₹1,00,116 मिलते हैं — एससी, एसटी और बीसी परिवारों को कल्याण लक्ष्मी में, अल्पसंख्यक परिवारों को शादी मुबारक में। शादी से पहले या छह महीने के अंदर आवेदन करें।"],
    docs: ["aadhaar", "caste", "income", "marriage", "bank"],
    steps: ["portal", "verify"],
  },
  "ts-cheyutha": {
    en: ["Cheyutha pensions (Telangana)", "Monthly pension for seniors, widows, people with disabilities and other groups.", "Telangana's Cheyutha (earlier Aasara) pensions support older people, widows, people with disabilities, single women, beedi workers and others."],
    hi: ["चेयुता पेंशन (तेलंगाना)", "बुज़ुर्गों, विधवाओं, दिव्यांगजनों और दूसरे समूहों को मासिक पेंशन।", "तेलंगाना की चेयुता (पहले आसरा) पेंशन बुज़ुर्गों, विधवाओं, दिव्यांगजनों, अकेली महिलाओं, बीड़ी श्रमिकों और दूसरों को मदद देती है।"],
    docs: ["aadhaar", "age", "bank", "ration"],
    steps: ["office", "verify"],
  },
  "up-kanya-sumangala": {
    en: ["Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)", "₹25,000 in six stages for girls, from birth to college.", "Girls in families earning up to ₹3 lakh a year get ₹25,000 in six instalments: at birth, after vaccination, and on entering class 1, class 6, class 9 and a degree or diploma. Up to two girls per family."],
    hi: ["मुख्यमंत्री कन्या सुमंगला योजना (उत्तर प्रदेश)", "बेटियों को जन्म से कॉलेज तक छह चरणों में ₹25,000।", "₹3 लाख सालाना तक आमदनी वाले परिवारों की बेटियों को छह किस्तों में ₹25,000 मिलते हैं: जन्म पर, टीकाकरण के बाद, और कक्षा 1, कक्षा 6, कक्षा 9 तथा डिग्री या डिप्लोमा में दाख़िले पर। परिवार की दो बेटियों तक।"],
    docs: ["birth", "aadhaar", "income", "bank"],
    steps: ["portal", "verify"],
  },
  "up-pension": {
    en: ["Social security pension (Uttar Pradesh)", "₹1,000 a month for seniors, widows and people with disabilities.", "Uttar Pradesh pays ₹1,000 a month, every quarter, to older people (60+), widows and people with 40%+ disability in low-income families."],
    hi: ["सामाजिक सुरक्षा पेंशन (उत्तर प्रदेश)", "बुज़ुर्गों, विधवाओं और दिव्यांगजनों को हर महीने ₹1,000।", "उत्तर प्रदेश कम आमदनी वाले परिवारों के बुज़ुर्गों (60+), विधवाओं और 40%+ दिव्यांगता वाले लोगों को ₹1,000 महीने के हिसाब से हर तिमाही पैसे देता है।"],
    docs: ["aadhaar", "age", "income", "bank"],
    steps: ["portal", "verify"],
  },
  "up-scholarship": {
    en: ["UP scholarship and fee reimbursement (Uttar Pradesh)", "Scholarships and fee refunds for students from class 9 to postgraduate.", "Students of all categories from families under the income limit get scholarships and tuition fee reimbursement through the UP scholarship portal."],
    hi: ["यूपी छात्रवृत्ति और शुल्क प्रतिपूर्ति (उत्तर प्रदेश)", "कक्षा 9 से स्नातकोत्तर तक छात्रों को छात्रवृत्ति और फ़ीस वापसी।", "आमदनी सीमा के अंदर वाले परिवारों के सभी वर्गों के छात्रों को यूपी छात्रवृत्ति पोर्टल से छात्रवृत्ति और ट्यूशन फ़ीस प्रतिपूर्ति मिलती है।"],
    docs: ["aadhaar", "caste", "income", "marks", "bank"],
    steps: ["portal", "school"],
  },
  "up-samuhik-vivah": {
    en: ["Mukhyamantri Samuhik Vivah Yojana (Uttar Pradesh)", "Help with a daughter's wedding at a mass marriage ceremony.", "Families earning up to ₹2 lakh can have their daughter's wedding at a government mass marriage ceremony, with money paid to the bride and gifts and arrangements covered."],
    hi: ["मुख्यमंत्री सामूहिक विवाह योजना (उत्तर प्रदेश)", "सामूहिक विवाह समारोह में बेटी की शादी में मदद।", "₹2 लाख तक आमदनी वाले परिवार सरकारी सामूहिक विवाह समारोह में बेटी की शादी करा सकते हैं, जिसमें दुल्हन को पैसे और उपहार व व्यवस्था का ख़र्च शामिल है।"],
    docs: ["aadhaar", "income", "age", "bank"],
    steps: ["portal", "office"],
  },
  "uk-nanda-gaura": {
    en: ["Nanda Gaura Yojana (Uttarakhand)", "₹11,000 at a girl's birth and ₹51,000 after class 12.", "Up to two girls per family get ₹11,000 if born in a hospital and ₹51,000 after passing class 12. Applications are online only."],
    hi: ["नंदा गौरा योजना (उत्तराखंड)", "बेटी के जन्म पर ₹11,000 और 12वीं के बाद ₹51,000।", "परिवार की दो बेटियों तक, अस्पताल में जन्म होने पर ₹11,000 और 12वीं पास करने पर ₹51,000 मिलते हैं। आवेदन सिर्फ़ ऑनलाइन होते हैं।"],
    docs: ["birth", "aadhaar", "income", "bank"],
    steps: ["portal", "verify"],
  },
  "uk-social-pension": socialPension("UK"),
  "wb-annapurna-bhandar": {
    en: ["Annapurna Bhandar (West Bengal)", "₹3,000 a month for women aged 25–60.", "From June 2026, Annapurna Bhandar replaced Lakshmir Bhandar with a flat ₹3,000 a month. Most Lakshmir Bhandar beneficiaries moved over automatically after verification. Income-tax payers and government employees or pensioners are excluded."],
    hi: ["अन्नपूर्णा भंडार (पश्चिम बंगाल)", "25–60 साल की महिलाओं को हर महीने ₹3,000।", "जून 2026 से अन्नपूर्णा भंडार ने लक्ष्मीर भंडार की जगह ली है, हर महीने एक समान ₹3,000 के साथ। लक्ष्मीर भंडार की ज़्यादातर लाभार्थी सत्यापन के बाद अपने आप जुड़ गईं। इनकम टैक्स भरने वाले और सरकारी कर्मचारी या पेंशनर बाहर हैं।"],
    docs: ["aadhaar", "domicile", "bank", "photo"],
    steps: ["portal", "verify"],
  },
  "wb-kanyashree": {
    en: ["Kanyashree Prakalpa (West Bengal)", "Yearly scholarship and a ₹25,000 grant at 18 for girls in education.", "Unmarried girls aged 13–18 in classes 8–12 get a yearly scholarship, and a one-time ₹25,000 at 18 if they're still studying and unmarried."],
    hi: ["कन्याश्री प्रकल्प (पश्चिम बंगाल)", "पढ़ रही बेटियों को सालाना छात्रवृत्ति और 18 साल पर ₹25,000।", "कक्षा 8–12 में पढ़ने वाली 13–18 साल की अविवाहित बेटियों को सालाना छात्रवृत्ति मिलती है, और 18 साल पर पढ़ाई जारी और अविवाहित होने पर एक बार ₹25,000।"],
    docs: ["aadhaar", "school", "birth", "bank"],
    steps: ["school", "verify"],
  },
  "wb-krishak-bandhu": {
    en: ["Krishak Bandhu (West Bengal)", "Yearly cash support for farmers and a death benefit for their families.", "Farmers and sharecroppers registered under Krishak Bandhu get yearly financial help based on their land, and the family gets a one-time grant if the farmer (18–60) dies."],
    hi: ["कृषक बंधु (पश्चिम बंगाल)", "किसानों को सालाना नक़द मदद और परिवार को मृत्यु पर सहायता।", "कृषक बंधु में पंजीकृत किसानों और बटाईदारों को ज़मीन के हिसाब से सालाना आर्थिक मदद मिलती है, और 18–60 साल के किसान की मृत्यु पर परिवार को एक बार अनुदान।"],
    docs: ["aadhaar", "land", "bank"],
    steps: ["portal", "office"],
  },
  "wb-swasthya-sathi": {
    en: ["Swasthya Sathi (West Bengal)", "Family health cover up to ₹5 lakh a year.", "Swasthya Sathi gives cashless treatment at listed hospitals, with the card in the name of the woman of the family."],
    hi: ["स्वास्थ्य साथी (पश्चिम बंगाल)", "परिवार के लिए साल में ₹5 लाख तक स्वास्थ्य कवर।", "स्वास्थ्य साथी सूचीबद्ध अस्पतालों में बिना पैसे इलाज देता है, और कार्ड परिवार की महिला के नाम पर होता है।"],
    docs: ["aadhaar", "domicile", "ration"],
    steps: ["card", "hospital"],
  },
  "dl-old-age-pension": {
    en: ["Old age pension (Delhi)", "₹2,000 a month at 60–69 and ₹2,500 from 70.", "Delhi residents aged 60+ with family income under ₹1 lakh a year get a monthly pension."],
    hi: ["वृद्धावस्था पेंशन (दिल्ली)", "60–69 साल पर ₹2,000 और 70 से ₹2,500 महीना।", "₹1 लाख सालाना से कम पारिवारिक आमदनी वाले 60+ उम्र के दिल्ली निवासियों को मासिक पेंशन मिलती है।"],
    docs: ["aadhaar", "age", "income", "bank", "domicile"],
    steps: ["portal", "verify"],
  },
  "dl-widow-pension": {
    en: ["Pension for women in distress (Delhi)", "₹2,500 a month for widows and women in distress.", "Widowed, divorced, separated or abandoned women in Delhi with family income under ₹1 lakh a year get a monthly pension."],
    hi: ["संकटग्रस्त महिलाओं के लिए पेंशन (दिल्ली)", "विधवाओं और संकटग्रस्त महिलाओं को हर महीने ₹2,500।", "₹1 लाख सालाना से कम पारिवारिक आमदनी वाली दिल्ली की विधवा, तलाक़शुदा, अलग रह रही या परित्यक्ता महिलाओं को मासिक पेंशन मिलती है।"],
    docs: ["aadhaar", "death", "income", "bank"],
    steps: ["portal", "verify"],
  },
  "dl-free-bus": {
    en: ["Free bus travel for women (Delhi)", "Free rides on DTC and cluster buses for women.", "Women travel free on Delhi's DTC and cluster buses using the Saheli smart card."],
    hi: ["महिलाओं के लिए मुफ़्त बस यात्रा (दिल्ली)", "डीटीसी और क्लस्टर बसों में महिलाओं के लिए मुफ़्त सफ़र।", "महिलाएँ सहेली स्मार्ट कार्ड से दिल्ली की डीटीसी और क्लस्टर बसों में मुफ़्त यात्रा करती हैं।"],
    docs: ["aadhaar", "domicile"],
    steps: ["card", "showId"],
  },
  "dl-mahila-samriddhi": {
    en: ["Mahila Samriddhi Yojana (Delhi)", "Announced: ₹2,500 a month for women in need.", "The Delhi government approved this scheme in 2025, but its rules and registration have been delayed. Check the official site to see whether it has started."],
    hi: ["महिला समृद्धि योजना (दिल्ली)", "घोषित: ज़रूरतमंद महिलाओं को हर महीने ₹2,500।", "दिल्ली सरकार ने 2025 में इस योजना को मंज़ूरी दी, लेकिन नियम और पंजीकरण में देरी हुई है। यह शुरू हुई या नहीं, सरकारी साइट पर देखें।"],
    docs: ["aadhaar", "domicile", "income", "bank"],
    steps: ["portal", "verify"],
  },
  "py-women-heads": {
    en: ["Monthly assistance for women heads of BPL families (Puducherry)", "₹2,500 a month for women heads aged 21–55.", "Women aged 21–55 who head a BPL ration card family and have lived in Puducherry for five years get ₹2,500 a month (raised from ₹1,000 in January 2026)."],
    hi: ["बीपीएल परिवारों की मुखिया महिलाओं को मासिक सहायता (पुडुचेरी)", "21–55 साल की मुखिया महिलाओं को हर महीने ₹2,500।", "बीपीएल राशन कार्ड वाले परिवार की मुखिया, पाँच साल से पुडुचेरी में रह रही 21–55 साल की महिलाओं को हर महीने ₹2,500 मिलते हैं (जनवरी 2026 में ₹1,000 से बढ़ाया गया)।"],
    docs: ["aadhaar", "ration", "domicile", "bank"],
    steps: ["office", "verify"],
  },
};

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
      const text = e.pensionOf
        ? ([l.socialPension.name(l.stateNames[e.pensionOf] ?? inStateName(e.pensionOf, "en")), l.socialPension.short, l.socialPension.about] as const)
        : l.entries[id];
      const [name, short, about] = text ?? [en[id].name, en[id].short, en[id].about];
      return [id, { ...en[id], name, short, about, documents: e.docs.map((d) => l.docs[d]), steps: e.steps.map((st) => l.steps[st]), applyLabel: l.applyLabel }];
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
