import type { Update } from "../lib/updates";

/**
 * Updates shipped with the app, so the home page has news even offline.
 * Newer ones are published in public/updates.json and fetched when online.
 */
export const bundledUpdates: Update[] = [
  {
    id: "app-2026-10-languages",
    date: "2026-10-21",
    country: "IN",
    title: {
      en: "New: 240 state schemes, your language and an Android app",
      hi: "नया: राज्यों की 240 योजनाएँ, आपकी भाषा और एंड्रॉयड ऐप",
    },
    body: {
      en: "Your state's own schemes now have their own section in the results. After choosing your state, you can use the app in English, Hindi or your state's language. An Android app (APK) is on the releases page.",
      hi: "आपके राज्य की अपनी योजनाएँ अब नतीजों में अलग हिस्से में हैं। राज्य चुनने के बाद आप ऐप अंग्रेज़ी, हिन्दी या अपने राज्य की भाषा में चला सकते हैं। एंड्रॉयड ऐप (APK) रिलीज़ पेज पर है।",
    },
    url: "https://github.com/ebxc-7s13/BenefitBridge/releases/latest",
  },
  {
    id: "app-2026-10-states",
    date: "2026-10-21",
    country: "ALL",
    title: {
      en: "New: your state's own schemes",
      es: "Nuevo: los programas de su estado",
      hi: "नया: आपके राज्य की अपनी योजनाएँ",
    },
    body: {
      en: "Results now include schemes run by your state, with the papers to gather and a link to the official website. Other countries' programs are in the country list.",
      es: "Los resultados ahora incluyen el sitio oficial de beneficios de su estado. Los programas de otros países están en la lista de países.",
      hi: "नतीजों में अब आपके राज्य की अपनी योजनाएँ भी हैं, ज़रूरी काग़ज़ों और सरकारी वेबसाइट के लिंक के साथ। दूसरे देशों की योजनाएँ देशों की सूची में हैं।",
    },
  },

  // United States
  {
    id: "us-open-enrollment-2027",
    date: "2026-10-20",
    country: "US",
    title: { en: "Health insurance sign-up for 2027 opens November 1", es: "La inscripción al seguro médico para 2027 abre el 1 de noviembre" },
    body: {
      en: "If you don't get health coverage through work, Medicaid or Medicare, you can pick a Marketplace plan for 2027. Help paying is based on income. Check HealthCare.gov for your state's deadline.",
      es: "Si no tiene cobertura médica por el trabajo, Medicaid o Medicare, puede elegir un plan del Mercado para 2027. La ayuda para pagar depende de sus ingresos. Consulte CuidadoDeSalud.gov para la fecha límite de su estado.",
    },
    url: "https://www.healthcare.gov/",
  },
  {
    id: "us-medicaid-work-rules",
    date: "2026-10-15",
    country: "US",
    title: { en: "Medicaid work rules start as early as January 2027", es: "Las reglas de trabajo de Medicaid empiezan desde enero de 2027" },
    body: {
      en: "In states that expanded Medicaid, many adults aged 19–64 will need to show 80 hours a month of work, school, training or volunteering. Parents of young children, pregnant women and people with disabilities are among those exempt. Open every letter from your Medicaid office and answer by the date given.",
      es: "En los estados que ampliaron Medicaid, muchos adultos de 19 a 64 años tendrán que mostrar 80 horas al mes de trabajo, estudio, capacitación o voluntariado. Los padres de niños pequeños, las mujeres embarazadas y las personas con discapacidad están entre los exentos. Abra cada carta de su oficina de Medicaid y responda antes de la fecha indicada.",
    },
    url: "https://www.medicaid.gov/",
  },
  {
    id: "us-snap-fy2027",
    date: "2026-10-01",
    country: "US",
    title: { en: "New SNAP amounts from October 1", es: "Nuevos montos de SNAP desde el 1 de octubre" },
    body: {
      en: "SNAP limits and benefits went up for October 2026 to September 2027. A family of four can now get up to $1,023 a month. Your results already use the new figures.",
      es: "Los límites y beneficios de SNAP subieron para octubre de 2026 a septiembre de 2027. Una familia de cuatro ahora puede recibir hasta $1,023 al mes. Sus resultados ya usan las nuevas cifras.",
    },
    url: "https://www.fns.usda.gov/snap/allotment/cola",
  },
  {
    id: "us-snap-work-rules",
    date: "2025-11-01",
    country: "US",
    title: { en: "SNAP work rules now cover more adults", es: "Las reglas de trabajo de SNAP ahora cubren a más adultos" },
    body: {
      en: "Adults aged 18–64 without a child under 14 at home may need to work, train or volunteer 80 hours a month to keep SNAP for more than 3 months in 3 years. Some people are exempt, such as those who can't work for health reasons. Ask your SNAP office.",
      es: "Los adultos de 18 a 64 años sin un hijo menor de 14 años en casa pueden tener que trabajar, capacitarse o hacer voluntariado 80 horas al mes para recibir SNAP más de 3 meses en 3 años. Algunas personas están exentas, como las que no pueden trabajar por salud. Pregunte en su oficina de SNAP.",
    },
    url: "https://www.fns.usda.gov/snap/work-requirements",
  },

  // India
  {
    id: "in-fraud-alert",
    date: "2026-10-15",
    country: "IN",
    title: { en: "Beware of fake scheme messages", hi: "फ़र्ज़ी योजना संदेशों से सावधान" },
    body: {
      en: "Applying for a government scheme is free. Never share your OTP, bank PIN or Aadhaar copy with callers or WhatsApp links. Report fraud on 1930 or cybercrime.gov.in.",
      hi: "सरकारी योजना में आवेदन मुफ़्त है। कॉल करने वालों या व्हाट्सऐप लिंक पर कभी अपना OTP, बैंक पिन या आधार की कॉपी न दें। धोखाधड़ी की शिकायत 1930 या cybercrime.gov.in पर करें।",
    },
    url: "https://cybercrime.gov.in/",
  },
  {
    id: "in-ration-ekyc",
    date: "2026-10-01",
    country: "IN",
    title: { en: "Ration card: finish Aadhaar eKYC", hi: "राशन कार्ड: आधार eKYC पूरा करें" },
    body: {
      en: "Every member on a ration card should complete Aadhaar eKYC to keep getting free ration. It's free at your ration shop, or on the Mera Ration app.",
      hi: "मुफ़्त राशन मिलते रहने के लिए राशन कार्ड के हर सदस्य का आधार eKYC होना चाहिए। यह राशन की दुकान पर या मेरा राशन ऐप पर मुफ़्त होता है।",
    },
    url: "https://nfsa.gov.in/",
  },
  {
    id: "in-vbgramg",
    date: "2026-07-01",
    country: "IN",
    title: { en: "Rural work now up to 125 days a year", hi: "गाँव में काम अब साल में 125 दिन तक" },
    body: {
      en: "The VB-G RAM G Act replaced MGNREGA from 1 July 2026. Rural families can get up to 125 days of paid work a year. Ask at your gram panchayat for your job card.",
      hi: "1 जुलाई 2026 से VB-G RAM G क़ानून ने मनरेगा की जगह ली है। गाँव के परिवारों को साल में 125 दिन तक काम मिल सकता है। जॉब कार्ड के लिए ग्राम पंचायत में पूछें।",
    },
    url: "https://nrega.dord.gov.in/",
  },
  {
    id: "in-br-mahila-rozgar",
    date: "2025-09-26",
    country: "IN",
    state: "BR",
    title: { en: "Bihar: ₹10,000 for women to start work", hi: "बिहार: काम शुरू करने के लिए महिलाओं को ₹10,000" },
    body: {
      en: "Under the Mukhyamantri Mahila Rozgar Yojana, one woman per family gets ₹10,000 to start a livelihood, with more help later if it goes well. Apply through your Jeevika group or the state portal.",
      hi: "मुख्यमंत्री महिला रोज़गार योजना में हर परिवार की एक महिला को रोज़गार शुरू करने के लिए ₹10,000 मिलते हैं, काम अच्छा चलने पर आगे और मदद। जीविका समूह या राज्य पोर्टल से आवेदन करें।",
    },
    url: "https://state.bihar.gov.in/",
  },
  {
    id: "in-mh-ladki-bahin-ekyc",
    date: "2025-09-18",
    country: "IN",
    state: "MH",
    title: { en: "Maharashtra: Ladki Bahin eKYC", hi: "महाराष्ट्र: लाडकी बहीण eKYC" },
    body: {
      en: "Women getting Ladki Bahin money must complete Aadhaar eKYC on the official portal to keep getting it. Don't pay anyone to do it for you.",
      hi: "लाडकी बहीण का पैसा पाने वाली महिलाओं को इसे जारी रखने के लिए सरकारी पोर्टल पर आधार eKYC करना ज़रूरी है। इसके लिए किसी को पैसे न दें।",
    },
    url: "https://ladakibahin.maharashtra.gov.in/",
  },
  {
    id: "in-ts-rythu-bharosa",
    date: "2025-01-26",
    country: "IN",
    state: "TS",
    title: { en: "Telangana: Rythu Bharosa ₹12,000 an acre", hi: "तेलंगाना: रैतु भरोसा ₹12,000 प्रति एकड़" },
    body: {
      en: "Farmers get ₹12,000 an acre a year for cultivable land, paid in two seasons. Landless farm workers' families can get support under Indiramma Atmiya Bharosa.",
      hi: "किसानों को खेती लायक ज़मीन पर हर साल ₹12,000 प्रति एकड़ मिलते हैं, दो फ़सल मौसमों में। भूमिहीन खेतिहर मज़दूर परिवारों को इंदिरम्मा आत्मीय भरोसा में मदद मिल सकती है।",
    },
    url: "https://telangana.gov.in/",
  },
  {
    id: "in-vay-vandana",
    date: "2024-10-29",
    country: "IN",
    title: { en: "Everyone aged 70+ gets ₹5 lakh health cover", hi: "70+ उम्र के हर व्यक्ति को ₹5 लाख का इलाज" },
    body: {
      en: "Under Ayushman Vay Vandana, every person aged 70 or more gets free hospital care up to ₹5 lakh a year, whatever their income. Get the card on the Ayushman app or at a hospital.",
      hi: "आयुष्मान वय वंदना में 70 साल या ज़्यादा उम्र के हर व्यक्ति को, आमदनी कुछ भी हो, साल में ₹5 लाख तक का मुफ़्त इलाज मिलता है। कार्ड आयुष्मान ऐप या अस्पताल में बनवाएँ।",
    },
    url: "https://beneficiary.nha.gov.in/",
  },
];
