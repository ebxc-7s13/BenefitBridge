import type { StateScheme } from "../stateRules";

/**
 * State and UT schemes as reported on 21 October 2026 (241 researched, discontinued ones dropped).
 * State schemes change often: amounts are only given where official or reliable sources agreed, and most
 * schemes are marked `check` (conditions the questionnaire can't confirm). A null url means the scheme has no
 * confirmed page of its own; the app links to the state's official portal instead.
 */
export const stateSchemes20261021: StateScheme[] = [
  // Andhra Pradesh
  { id: "ap-ntr-bharosa", state: "AP", category: "security", criteria: { needy: true, poorCard: true }, check: true, value: { low: 48000, high: 48000 }, url: "https://sspensions.ap.gov.in/" },
  { id: "ap-talliki-vandanam", state: "AP", category: "education", criteria: { school: true, poorCard: true }, check: true, value: { low: 13000, high: 13000 }, url: "https://gsws-nbm.ap.gov.in/" },
  { id: "ap-annadata-sukhibhava", state: "AP", category: "farm", criteria: { farmer: true, noTaxPayer: true }, check: true, value: { low: 14000, high: 14000 }, url: "https://annadathasukhibhava.ap.gov.in/" },
  { id: "ap-deepam", state: "AP", category: "home", criteria: { poorCard: true }, check: true, url: "https://www.ap.gov.in/" },
  { id: "ap-stree-shakti", state: "AP", category: "family", criteria: { women: true }, url: null },
  { id: "ap-ntr-vaidya-seva", state: "AP", category: "health", criteria: { }, check: true, url: null, phone: "104" },
  { id: "ap-auto-driver-sevalo", state: "AP", category: "work", criteria: { worker: true }, check: true, value: { low: 15000, high: 15000 }, url: "https://gsws-nbm.ap.gov.in/" },
  { id: "ap-matsyakara-sevalo", state: "AP", category: "work", criteria: { worker: true }, check: true, value: { low: 20000, high: 20000 }, url: null },

  // Arunachal Pradesh
  { id: "ar-cmaay", state: "AR", category: "health", criteria: { }, check: true, url: "https://arunachalpradesh.gov.in/" },
  { id: "ar-dulari-kanya", state: "AR", category: "family", criteria: { girl: true }, check: true, value: { low: 50000, high: 50000, once: true }, url: "https://arunachalpradesh.gov.in/" },
  { id: "ar-cm-social-security", state: "AR", category: "security", criteria: { needy: true }, check: true, url: null },
  { id: "ar-cm-sky", state: "AR", category: "farm", criteria: { farmer: true }, check: true, url: null },
  { id: "ar-atmanirbhar-krishi", state: "AR", category: "farm", criteria: { farmer: true }, check: true, url: null },

  // Assam
  { id: "as-orunodoi", state: "AS", category: "family", criteria: { women: true, poorCard: true }, check: true, value: { low: 15000, high: 15000 }, url: "https://it.assam.gov.in/scheme-page/assam-orunodoi-scheme" },
  { id: "as-nijut-moina", state: "AS", category: "education", criteria: { women: true, college: true }, check: true, value: { low: 10000, high: 25000 }, url: null },
  { id: "as-nijut-babu", state: "AS", category: "education", criteria: { college: true }, check: true, value: { low: 10000, high: 20000 }, url: null },
  { id: "as-aa-mmjay", state: "AS", category: "health", criteria: { poorCard: true }, check: true, url: null },
  { id: "as-mmua", state: "AS", category: "work", criteria: { women: true }, check: true, value: { low: 10000, high: 10000, once: true }, url: null },
  { id: "as-cmaaa", state: "AS", category: "work", criteria: { ageMin: 28, ageMax: 45, jobseeker: true }, check: true, value: { low: 200000, high: 500000, once: true }, url: "https://cmaaa.assam.gov.in/" },
  { id: "as-tea-garden-maternity", state: "AS", category: "health", criteria: { women: true, pregnant: true }, check: true, value: { low: 15000, high: 15000, once: true }, url: "https://nhm.assam.gov.in/" },
  { id: "as-paddy-top-up", state: "AS", category: "farm", criteria: { farmer: true }, check: true, url: "https://agri-horti.assam.gov.in/" },

  // Bihar
  { id: "br-mahila-rozgar", state: "BR", category: "work", criteria: { women: true, ageMin: 18 }, check: true, value: { low: 10000, high: 10000, once: true }, url: "https://state.bihar.gov.in/" },
  { id: "br-kanya-utthan", state: "BR", category: "education", criteria: { college: true }, check: true, url: "https://medhasoft.bih.nic.in/" },
  { id: "br-student-credit-card", state: "BR", category: "education", criteria: { college: true }, check: true, url: "https://www.7nishchay-yuvaupmission.bihar.gov.in/" },
  { id: "br-vridhjan-pension", state: "BR", category: "security", criteria: { senior60: true, noGovtJob: true }, check: true, value: { low: 13200, high: 13200 }, url: "https://sspmis.bihar.gov.in/" },
  { id: "br-laxmibai-pension", state: "BR", category: "security", criteria: { widow: true, incomeMax: 60000 }, check: true, value: { low: 13200, high: 13200 }, url: "https://sspmis.bihar.gov.in/" },
  { id: "br-divyang-pension", state: "BR", category: "security", criteria: { disability: true }, check: true, value: { low: 13200, high: 13200 }, url: "https://sspmis.bihar.gov.in/" },
  { id: "br-free-electricity", state: "BR", category: "home", criteria: { }, check: true, url: null },
  { id: "br-swayam-sahayata-bhatta", state: "BR", category: "work", criteria: { jobseeker: true, ageMin: 20, ageMax: 25 }, check: true, value: { low: 12000, high: 12000 }, url: "https://www.7nishchay-yuvaupmission.bihar.gov.in/" },
  { id: "br-laghu-udyami", state: "BR", category: "work", criteria: { ageMin: 18, ageMax: 50, incomeMax: 72000 }, check: true, value: { low: 200000, high: 200000, once: true }, url: "https://udyami.bihar.gov.in/" },
  { id: "br-karpoori-kisan", state: "BR", category: "farm", criteria: { farmer: true, landOwner: true }, check: true, value: { low: 3000, high: 3000 }, url: "https://dbtagriculture.bihar.gov.in/" },

  // Chhattisgarh
  { id: "cg-mahtari-vandan", state: "CG", category: "family", criteria: { women: true, ageMin: 21, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://mahtarivandan.cgstate.gov.in/" },
  { id: "cg-krishak-unnati", state: "CG", category: "farm", criteria: { farmer: true }, check: true, url: "https://cgstate.gov.in/" },
  { id: "cg-bhumihin-majdoor", state: "CG", category: "work", criteria: { rural: true, worker: true }, check: true, value: { low: 10000, high: 10000 }, url: null },
  { id: "cg-m-urja", state: "CG", category: "home", criteria: { }, check: true, url: null },
  { id: "cg-kanya-vivah", state: "CG", category: "family", criteria: { poorCard: true }, check: true, url: null },
  { id: "cg-veer-narayan-health", state: "CG", category: "health", criteria: { anyCard: true }, check: true, url: null, phone: "104" },
  { id: "cg-pension", state: "CG", category: "security", criteria: { needy: true, poorCard: true }, check: true, url: null },

  // Goa
  { id: "ga-griha-aadhar", state: "GA", category: "family", criteria: { women: true, incomeMax: 300000 }, check: true, value: { low: 18000, high: 18000 }, url: "https://dwcd.goa.gov.in/" },
  { id: "ga-dsss", state: "GA", category: "security", criteria: { needy: true }, check: true, url: "https://socialwelfare.goa.gov.in/" },
  { id: "ga-ddssy", state: "GA", category: "health", criteria: { }, check: true, url: "https://goa.gov.in/" },
  { id: "ga-laadli-laxmi", state: "GA", category: "family", criteria: { incomeMax: 300000 }, check: true, value: { low: 100000, high: 100000, once: true }, url: "https://dwcd.goa.gov.in/" },
  { id: "ga-shetkari-aadhar-nidhi", state: "GA", category: "farm", criteria: { farmer: true }, check: true, url: "https://agri.goa.gov.in/" },

  // Gujarat
  { id: "gj-namo-lakshmi", state: "GJ", category: "education", criteria: { school: true, incomeMax: 600000 }, check: true, value: { low: 50000, high: 50000, once: true }, url: "https://gujaratindia.gov.in/" },
  { id: "gj-vahli-dikri", state: "GJ", category: "family", criteria: { girl: true, incomeMax: 200000 }, check: true, value: { low: 110000, high: 110000, once: true }, url: "https://wcd.gujarat.gov.in/" },
  { id: "gj-ganga-swarupa", state: "GJ", category: "security", criteria: { widow: true }, check: true, value: { low: 15000, high: 15000 }, url: "https://www.digitalgujarat.gov.in/" },
  { id: "gj-namo-shri", state: "GJ", category: "health", criteria: { pregnant: true, incomeMax: 800000 }, check: true, value: { low: 12000, high: 12000, once: true }, url: "https://wcd.gujarat.gov.in/" },
  { id: "gj-namo-saraswati", state: "GJ", category: "education", criteria: { college: true, incomeMax: 600000 }, check: true, value: { low: 25000, high: 25000, once: true }, url: null },
  { id: "gj-mysy", state: "GJ", category: "education", criteria: { college: true, incomeMax: 600000 }, check: true, url: "https://mysy.guj.nic.in/" },
  { id: "gj-kunvarbai-mameru", state: "GJ", category: "family", criteria: { categories: ["sc", "st", "obc"] }, check: true, url: "https://esamajkalyan.gujarat.gov.in/" },
  { id: "gj-manav-kalyan", state: "GJ", category: "work", criteria: { worker: true, incomeMax: 150000 }, check: true, url: "https://e-kutir.gujarat.gov.in/" },
  { id: "gj-old-age-pension", state: "GJ", category: "security", criteria: { senior60: true }, check: true, url: "https://www.digitalgujarat.gov.in/" },
  { id: "gj-pmjay-ma", state: "GJ", category: "health", criteria: { }, check: true, url: null },

  // Haryana
  { id: "hr-lado-lakshmi", state: "HR", category: "family", criteria: { women: true, ageMin: 23, incomeMax: 100000 }, check: true, value: { low: 25200, high: 25200 }, url: "https://haryana.gov.in/" },
  { id: "hr-old-age-samman", state: "HR", category: "security", criteria: { senior60: true, incomeMax: 300000 }, check: true, value: { low: 38400, high: 38400 }, url: "https://socialjusticehry.gov.in/" },
  { id: "hr-family-id", state: "HR", category: "security", criteria: { }, url: "https://meraparivar.haryana.gov.in/" },
  { id: "hr-widow-pension", state: "HR", category: "security", criteria: { widow: true, incomeMax: 300000 }, check: true, value: { low: 38400, high: 38400 }, url: "https://socialjusticehry.gov.in/" },
  { id: "hr-disability-pension", state: "HR", category: "security", criteria: { disability: true }, check: true, value: { low: 38400, high: 38400 }, url: "https://socialjusticehry.gov.in/" },
  { id: "hr-chirayu", state: "HR", category: "health", criteria: { incomeMax: 300000 }, check: true, url: null },
  { id: "hr-happy-card", state: "HR", category: "family", criteria: { incomeMax: 100000 }, check: true, url: "https://hartrans.gov.in/" },
  { id: "hr-lpg-500", state: "HR", category: "home", criteria: { poorCard: true }, check: true, url: "https://epds.haryanafood.gov.in/" },
  { id: "hr-vivah-shagun", state: "HR", category: "family", criteria: { incomeMax: 180000 }, check: true, url: "https://saralharyana.gov.in/" },

  // Himachal Pradesh
  { id: "hp-pyari-behna", state: "HP", category: "family", criteria: { women: true, ageMin: 18, ageMax: 59, incomeMax: 200000, noGovtJob: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://himachal.nic.in/" },
  { id: "hp-social-pension", state: "HP", category: "security", criteria: { needy: true }, check: true, url: "https://himachal.nic.in/" },
  { id: "hp-himcare", state: "HP", category: "health", criteria: { }, check: true, url: "https://www.hpsbys.in/" },
  { id: "hp-vidyarthi-rin", state: "HP", category: "education", criteria: { college: true, incomeMax: 400000 }, check: true, url: null },
  { id: "hp-sukh-shiksha", state: "HP", category: "education", criteria: { school: true }, check: true, url: null },
  { id: "hp-natural-farming", state: "HP", category: "farm", criteria: { farmer: true }, check: true, url: null },

  // Jharkhand
  { id: "jh-maiyan-samman", state: "JH", category: "family", criteria: { women: true, ageMin: 18, ageMax: 50, anyCard: true }, check: true, value: { low: 30000, high: 30000 }, url: "https://mmmsy.jharkhand.gov.in/" },
  { id: "jh-sarvjan-pension", state: "JH", category: "security", criteria: { needy: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://jharkhand.gov.in/" },
  { id: "jh-kishori-samriddhi", state: "JH", category: "education", criteria: { school: true }, check: true, url: "https://jharkhand.gov.in/" },
  { id: "jh-abua-awas", state: "JH", category: "home", criteria: { noPuccaHouse: true }, check: true, value: { low: 200000, high: 200000, once: true }, url: null },
  { id: "jh-free-electricity", state: "JH", category: "home", criteria: { }, check: true, url: null },
  { id: "jh-guruji-credit-card", state: "JH", category: "education", criteria: { college: true }, check: true, url: null },
  { id: "jh-abua-swasthya", state: "JH", category: "health", criteria: { anyCard: true }, check: true, url: null },
  { id: "jh-green-card", state: "JH", category: "food", criteria: { }, check: true, url: "https://aahar.jharkhand.gov.in/" },

  // Karnataka
  { id: "ka-gruha-lakshmi", state: "KA", category: "family", criteria: { women: true, noTaxPayer: true }, check: true, value: { low: 24000, high: 24000 }, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-gruha-jyothi", state: "KA", category: "home", criteria: { }, check: true, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-shakti", state: "KA", category: "family", criteria: { women: true }, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-yuva-nidhi", state: "KA", category: "work", criteria: { jobseeker: true }, check: true, value: { low: 18000, high: 36000 }, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-anna-bhagya", state: "KA", category: "food", criteria: { poorCard: true }, url: "https://karnataka.gov.in/" },
  { id: "ka-social-pension", state: "KA", category: "security", criteria: { needy: true }, check: true, url: "https://sevasindhu.karnataka.gov.in/" },
  { id: "ka-vidyasiri", state: "KA", category: "education", criteria: { college: true, categories: ["obc", "minority"] }, check: true, url: "https://ssp.postmatric.karnataka.gov.in/" },
  { id: "ka-arogya-karnataka", state: "KA", category: "health", criteria: { }, check: true, url: "https://arogya.karnataka.gov.in/" },
  { id: "ka-ganga-kalyana", state: "KA", category: "farm", criteria: { farmer: true, landOwner: true, categories: ["sc", "st", "obc", "minority"] }, check: true, url: null },

  // Kerala
  { id: "kl-welfare-pension", state: "KL", category: "security", criteria: { needy: true, incomeMax: 100000 }, check: true, value: { low: 24000, high: 24000 }, url: "https://welfarepension.lsgkerala.gov.in/" },
  { id: "kl-kasp", state: "KL", category: "health", criteria: { poorCard: true }, check: true, url: "https://sha.kerala.gov.in/" },
  { id: "kl-life-mission", state: "KL", category: "home", criteria: { noPuccaHouse: true }, check: true, url: "https://lifemission.kerala.gov.in/" },
  { id: "kl-priyadarshini", state: "KL", category: "family", criteria: { women: true }, url: null },
  { id: "kl-sthree-suraksha", state: "KL", category: "family", criteria: { women: true, ageMin: 35, ageMax: 60, poorCard: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://ksmart.lsgkerala.gov.in/" },
  { id: "kl-snehapoorvam", state: "KL", category: "education", criteria: { school: true }, check: true, url: "https://socialsecuritymission.gov.in/" },

  // Madhya Pradesh
  { id: "mp-ladli-behna", state: "MP", category: "family", criteria: { women: true, ageMin: 21, ageMax: 60, incomeMax: 250000, noTaxPayer: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://cmladlibahna.mp.gov.in/" },
  { id: "mp-ladli-laxmi", state: "MP", category: "family", criteria: { girl: true, noTaxPayer: true }, check: true, url: "https://ladlilaxmi.mp.gov.in/" },
  { id: "mp-kisan-kalyan", state: "MP", category: "farm", criteria: { farmer: true, landOwner: true, noTaxPayer: true }, check: true, value: { low: 6000, high: 6000 }, url: "https://mp.gov.in/" },
  { id: "mp-sambal", state: "MP", category: "work", criteria: { worker: true, noTaxPayer: true }, check: true, url: "https://sambal.mp.gov.in/" },
  { id: "mp-kanya-vivah", state: "MP", category: "family", criteria: { }, check: true, value: { low: 49000, high: 49000, once: true }, url: null },
  { id: "mp-gaon-ki-beti", state: "MP", category: "education", criteria: { college: true, rural: true }, check: true, value: { low: 5000, high: 5000 }, url: "https://scholarshipportal.mp.nic.in/" },
  { id: "mp-medhavi", state: "MP", category: "education", criteria: { college: true, incomeMax: 600000 }, check: true, url: "https://scholarshipportal.mp.nic.in/" },
  { id: "mp-lpg-450", state: "MP", category: "home", criteria: { women: true }, check: true, url: null },
  { id: "mp-atal-griha-jyoti", state: "MP", category: "home", criteria: { }, check: true, url: null },
  { id: "mp-pension", state: "MP", category: "security", criteria: { needy: true }, check: true, url: null },

  // Maharashtra
  { id: "mh-ladki-bahin", state: "MH", category: "family", criteria: { women: true, ageMin: 21, ageMax: 65, incomeMax: 250000, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://ladakibahin.maharashtra.gov.in/" },
  { id: "mh-namo-shetkari", state: "MH", category: "farm", criteria: { farmer: true, landOwner: true, noTaxPayer: true }, check: true, value: { low: 6000, high: 6000 }, url: "https://pmkisan.gov.in/" },
  { id: "mh-mjpjay", state: "MH", category: "health", criteria: { anyCard: true }, check: true, url: "https://www.jeevandayee.gov.in/" },
  { id: "mh-lek-ladki", state: "MH", category: "family", criteria: { girl: true, incomeMax: 100000 }, check: true, url: "https://womenchild.maharashtra.gov.in/" },
  { id: "mh-mahadbt", state: "MH", category: "education", criteria: { college: true }, check: true, url: "https://mahadbt.maharashtra.gov.in/" },
  { id: "mh-annapurna", state: "MH", category: "home", criteria: { women: true }, check: true, url: "https://mahafood.gov.in/" },
  { id: "mh-niradhar", state: "MH", category: "security", criteria: { needy: true, incomeMax: 50000 }, check: true, value: { low: 18000, high: 30000 }, url: "https://aaplesarkar.mahaonline.gov.in/" },
  { id: "mh-shravanbal", state: "MH", category: "security", criteria: { senior60: true, incomeMax: 21000 }, check: true, value: { low: 18000, high: 18000 }, url: "https://aaplesarkar.mahaonline.gov.in/" },
  { id: "mh-st-bus-women", state: "MH", category: "family", criteria: { women: true }, url: "https://msrtc.maharashtra.gov.in/" },
  { id: "mh-st-bus-seniors", state: "MH", category: "family", criteria: { senior60: true }, check: true, url: "https://msrtc.maharashtra.gov.in/" },
  { id: "mh-baliraja-power", state: "MH", category: "farm", criteria: { farmer: true }, check: true, url: "https://www.mahadiscom.in/" },
  { id: "mh-girls-free-education", state: "MH", category: "education", criteria: { college: true, incomeMax: 800000 }, check: true, url: "https://mahadbt.maharashtra.gov.in/" },

  // Manipur
  { id: "mn-cmht", state: "MN", category: "health", criteria: { }, check: true, url: "https://manipur.gov.in/" },
  { id: "mn-old-age-pension", state: "MN", category: "security", criteria: { senior60: true }, check: true, url: "https://socialwelfare.mn.gov.in/" },
  { id: "mn-widow-pension", state: "MN", category: "security", criteria: { widow: true, poorCard: true }, check: true, url: "https://socialwelfare.mn.gov.in/" },
  { id: "mn-women-shg", state: "MN", category: "work", criteria: { women: true }, check: true, value: { low: 10000, high: 10000, once: true }, url: null },

  // Meghalaya
  { id: "ml-mhis", state: "ML", category: "health", criteria: { noGovtJob: true }, check: true, url: "https://meghalaya.gov.in/" },
  { id: "ml-focus-plus", state: "ML", category: "farm", criteria: { }, check: true, value: { low: 5000, high: 5000, once: true }, url: null },
  { id: "ml-cm-elevate", state: "ML", category: "work", criteria: { business: true }, check: true, url: null },
  { id: "ml-safe-motherhood", state: "ML", category: "health", criteria: { women: true, pregnant: true }, check: true, url: "https://meghealth.gov.in/" },
  { id: "ml-cm-social-assistance", state: "ML", category: "security", criteria: { needy: true }, check: true, url: null },

  // Mizoram
  { id: "mz-bana-kaih", state: "MZ", category: "work", criteria: { }, check: true, url: "https://mizoram.gov.in/" },
  { id: "mz-muhcs", state: "MZ", category: "health", criteria: { }, check: true, url: null },
  { id: "mz-disability-pension", state: "MZ", category: "security", criteria: { disability: true, poorCard: true }, check: true, url: null },
  { id: "mz-merit-scholarship", state: "MZ", category: "education", criteria: { college: true }, check: true, url: null },

  // Nagaland
  { id: "nl-cmhis", state: "NL", category: "health", criteria: { }, check: true, url: "https://nagaland.gov.in/" },
  { id: "nl-cmlis", state: "NL", category: "security", criteria: { ageMin: 18, ageMax: 50 }, check: true, url: "https://cmlis.nagaland.gov.in/", phone: "1800-345-8924" },
  { id: "nl-cmmfi", state: "NL", category: "work", criteria: { }, check: true, url: "https://cmmfi.nagaland.gov.in/" },

  // Odisha
  { id: "od-subhadra", state: "OD", category: "family", criteria: { women: true, ageMin: 21, ageMax: 60, incomeMax: 250000, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 10000, high: 10000 }, url: "https://subhadra.odisha.gov.in/" },
  { id: "od-cm-kisan", state: "OD", category: "farm", criteria: { farmer: true }, check: true, value: { low: 4000, high: 4000 }, url: "https://odisha.gov.in/" },
  { id: "od-madhu-babu", state: "OD", category: "security", criteria: { needy: true }, check: true, url: "https://ssepd.odisha.gov.in/" },
  { id: "od-gjay", state: "OD", category: "health", criteria: { anyCard: true }, check: true, url: "https://gjaydashboard.odisha.gov.in/" },
  { id: "od-mamata", state: "OD", category: "family", criteria: { pregnant: true }, check: true, url: null },
  { id: "od-antyodaya-gruha", state: "OD", category: "home", criteria: { rural: true, noPuccaHouse: true }, check: true, url: null },

  // Punjab
  { id: "pb-old-age-pension", state: "PB", category: "security", criteria: { senior60: true, incomeMax: 60000 }, check: true, value: { low: 18000, high: 18000 }, url: "https://sswcd.punjab.gov.in/" },
  { id: "pb-ashirwad", state: "PB", category: "family", criteria: { incomeMax: 32790 }, check: true, value: { low: 51000, high: 51000, once: true }, url: "https://punjab.gov.in/" },
  { id: "pb-free-power", state: "PB", category: "home", criteria: { }, url: "https://www.pspcl.in/" },
  { id: "pb-mawan-dheeyan", state: "PB", category: "family", criteria: { women: true, ageMin: 18, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 12000, high: 18000 }, url: "https://sswcd.punjab.gov.in/" },
  { id: "pb-sehat", state: "PB", category: "health", criteria: { }, url: "https://sha.punjab.gov.in/" },
  { id: "pb-widow-pension", state: "PB", category: "security", criteria: { widow: true, incomeMax: 60000 }, check: true, value: { low: 18000, high: 18000 }, url: "https://sswcd.punjab.gov.in/" },
  { id: "pb-disability-pension", state: "PB", category: "security", criteria: { disability: true, incomeMax: 60000 }, check: true, value: { low: 18000, high: 18000 }, url: "https://sswcd.punjab.gov.in/" },
  { id: "pb-free-bus-women", state: "PB", category: "family", criteria: { women: true }, url: null },

  // Rajasthan
  { id: "rj-maa", state: "RJ", category: "health", criteria: { }, check: true, url: "https://jankalyan.rajasthan.gov.in/" },
  { id: "rj-lado-protsahan", state: "RJ", category: "family", criteria: { girl: true }, check: true, value: { low: 150000, high: 150000, once: true }, url: "https://jankalyan.rajasthan.gov.in/" },
  { id: "rj-palanhar", state: "RJ", category: "family", criteria: { needy: true, school: true }, check: true, url: "https://sje.rajasthan.gov.in/" },
  { id: "rj-pension", state: "RJ", category: "security", criteria: { needy: true, incomeMax: 48000 }, check: true, url: "https://ssp.rajasthan.gov.in/" },
  { id: "rj-kisan-samman", state: "RJ", category: "farm", criteria: { farmer: true, landOwner: true, noTaxPayer: true }, check: true, value: { low: 2000, high: 3000 }, url: "https://rajkisan.rajasthan.gov.in/" },
  { id: "rj-free-bijli", state: "RJ", category: "home", criteria: { }, check: true, url: "https://energy.rajasthan.gov.in/" },
  { id: "rj-yuva-sambal", state: "RJ", category: "work", criteria: { jobseeker: true, ageMin: 21, ageMax: 35, incomeMax: 200000 }, check: true, value: { low: 48000, high: 54000 }, url: "https://sso.rajasthan.gov.in/" },
  { id: "rj-kanyadan", state: "RJ", category: "family", criteria: { poorCard: true }, check: true, url: "https://sje.rajasthan.gov.in/" },
  { id: "rj-annapurna-rasoi", state: "RJ", category: "food", criteria: { }, url: null },
  { id: "rj-lpg-450", state: "RJ", category: "home", criteria: { poorCard: true }, check: true, url: "https://food.rajasthan.gov.in/" },

  // Sikkim
  { id: "sk-aama-sahayog", state: "SK", category: "home", criteria: { women: true, rural: true, poorCard: true }, check: true, value: { low: 4400, high: 4500 }, url: "https://sikkim.gov.in/" },
  { id: "sk-aama-sashaktikaran", state: "SK", category: "family", criteria: { women: true, noGovtJob: true }, check: true, value: { low: 40000, high: 40000 }, url: null },
  { id: "sk-cm-disability-pension", state: "SK", category: "security", criteria: { disability: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://pensionscheme.sikkim.gov.in/" },
  { id: "sk-cm-scholarship", state: "SK", category: "education", criteria: { college: true }, check: true, url: null },
  { id: "sk-garib-awas", state: "SK", category: "home", criteria: { noPuccaHouse: true }, check: true, url: null },

  // Tamil Nadu
  { id: "tn-kmut", state: "TN", category: "family", criteria: { women: true, ageMin: 21, incomeMax: 250000, noTaxPayer: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://kmut.tn.gov.in/" },
  { id: "tn-pudhumai-penn", state: "TN", category: "education", criteria: { college: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://www.pudhumaipenn.tn.gov.in/" },
  { id: "tn-cmchis", state: "TN", category: "health", criteria: { incomeMax: 120000 }, check: true, url: "https://www.cmchistn.com/" },
  { id: "tn-breakfast", state: "TN", category: "food", criteria: { school: true }, url: "https://www.tn.gov.in/" },
  { id: "tn-vettri-payanam", state: "TN", category: "family", criteria: { women: true }, url: "https://www.tn.gov.in/" },
  { id: "tn-annan-seer", state: "TN", category: "family", criteria: { incomeMax: 250000 }, check: true, url: null },
  { id: "tn-social-pension", state: "TN", category: "security", criteria: { needy: true }, check: true, url: "https://www.tn.gov.in/" },

  // Telangana
  { id: "ts-rythu-bharosa", state: "TS", category: "farm", criteria: { farmer: true, landOwner: true }, check: true, perAcre: 12000, url: "https://telangana.gov.in/" },
  { id: "ts-mahalakshmi", state: "TS", category: "family", criteria: { women: true }, url: "https://telangana.gov.in/" },
  { id: "ts-gruha-jyothi", state: "TS", category: "home", criteria: { poorCard: true }, check: true, url: "https://telangana.gov.in/" },
  { id: "ts-kalyana-lakshmi", state: "TS", category: "family", criteria: { incomeMax: 200000 }, check: true, value: { low: 100116, high: 100116, once: true }, url: "https://telanganaepass.cgg.gov.in/" },
  { id: "ts-cheyutha", state: "TS", category: "security", criteria: { needy: true }, check: true, value: { low: 24192, high: 48192 }, url: "https://telangana.gov.in/" },
  { id: "ts-aarogyasri", state: "TS", category: "health", criteria: { poorCard: true }, check: true, url: "https://aarogyasri.telangana.gov.in/" },
  { id: "ts-indiramma-indlu", state: "TS", category: "home", criteria: { noPuccaHouse: true, poorCard: true }, check: true, value: { low: 500000, high: 500000, once: true }, url: "https://telangana.gov.in/" },
  { id: "ts-atmiya-bharosa", state: "TS", category: "work", criteria: { worker: true, rural: true }, check: true, value: { low: 12000, high: 12000 }, url: "https://telangana.gov.in/" },
  { id: "ts-fine-rice", state: "TS", category: "food", criteria: { poorCard: true }, url: "https://telangana.gov.in/" },

  // Tripura
  { id: "tr-mssp-pension", state: "TR", category: "security", criteria: { needy: true }, check: true, value: { low: 24000, high: 24000 }, url: "https://socialwelfare.tripura.gov.in/" },
  { id: "tr-mssp-workers", state: "TR", category: "security", criteria: { worker: true, incomeMax: 100000 }, check: true, value: { low: 24000, high: 24000 }, url: "https://socialwelfare.tripura.gov.in/" },
  { id: "tr-balika-samriddhi", state: "TR", category: "family", criteria: { girl: true, poorCard: true }, check: true, value: { low: 50000, high: 50000, once: true }, url: "https://socialwelfare.tripura.gov.in/" },
  { id: "tr-konya-bibaha", state: "TR", category: "family", criteria: { poorCard: true }, check: true, value: { low: 50000, high: 50000, once: true }, url: "https://socialwelfare.tripura.gov.in/" },
  { id: "tr-kanya-atmanirbhar", state: "TR", category: "education", criteria: { women: true, college: true }, check: true, url: "https://highereducation.tripura.gov.in/" },
  { id: "tr-cm-jay", state: "TR", category: "health", criteria: { }, check: true, url: null },
  { id: "tr-minority-loan", state: "TR", category: "work", criteria: { categories: ["minority"], business: true }, check: true, url: null },

  // Uttar Pradesh
  { id: "up-kanya-sumangala", state: "UP", category: "family", criteria: { girl: true, incomeMax: 300000 }, check: true, value: { low: 25000, high: 25000, once: true }, url: "https://mksy.up.gov.in/" },
  { id: "up-pension", state: "UP", category: "security", criteria: { needy: true, incomeMax: 56460 }, check: true, value: { low: 12000, high: 12000 }, url: "https://sspy-up.gov.in/" },
  { id: "up-scholarship", state: "UP", category: "education", criteria: { college: true, incomeMax: 250000 }, check: true, url: "https://scholarship.up.gov.in/" },
  { id: "up-samuhik-vivah", state: "UP", category: "family", criteria: { incomeMax: 200000 }, check: true, value: { low: 60000, high: 60000, once: true }, url: "https://cmsvy.upsdc.gov.in/" },
  { id: "up-shadi-anudan", state: "UP", category: "family", criteria: { incomeMax: 100000 }, check: true, value: { low: 20000, high: 20000, once: true }, url: "https://shadianudan.upsdc.gov.in/" },
  { id: "up-cm-yuva", state: "UP", category: "work", criteria: { ageMin: 21, ageMax: 40, business: true }, check: true, url: "https://diupmsme.upsdc.gov.in/" },
  { id: "up-scooty", state: "UP", category: "education", criteria: { women: true, college: true, incomeMax: 1200000 }, check: true, url: null },
  { id: "up-free-lpg", state: "UP", category: "home", criteria: { poorCard: true }, check: true, url: null },
  { id: "up-jan-arogya", state: "UP", category: "health", criteria: { poorCard: true }, check: true, url: null },
  { id: "up-vishwakarma-shram-samman", state: "UP", category: "work", criteria: { worker: true }, check: true, url: "https://diupmsme.upsdc.gov.in/" },
  { id: "up-free-tubewell-power", state: "UP", category: "farm", criteria: { farmer: true }, check: true, url: null },

  // Uttarakhand
  { id: "uk-nanda-gaura", state: "UK", category: "family", criteria: { girl: true }, check: true, value: { low: 62000, high: 62000, once: true }, url: "https://nandagaurauk.in/" },
  { id: "uk-social-pension", state: "UK", category: "security", criteria: { needy: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://uk.gov.in/" },
  { id: "uk-atal-ayushman", state: "UK", category: "health", criteria: { }, check: true, url: "https://sha.uk.gov.in/" },
  { id: "uk-mahalakshmi-kit", state: "UK", category: "family", criteria: { pregnant: true }, check: true, url: null },
  { id: "uk-ekal-mahila", state: "UK", category: "work", criteria: { women: true, incomeMax: 72000, business: true }, check: true, url: null },
  { id: "uk-cm-swarozgar", state: "UK", category: "work", criteria: { business: true }, check: true, url: null },

  // West Bengal
  { id: "wb-annapurna-bhandar", state: "WB", category: "family", criteria: { women: true, ageMin: 25, ageMax: 60, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 36000, high: 36000 }, url: "https://wb.gov.in/" },
  { id: "wb-kanyashree", state: "WB", category: "education", criteria: { school: true }, check: true, url: "https://wbkanyashree.gov.in/" },
  { id: "wb-krishak-bandhu", state: "WB", category: "farm", criteria: { farmer: true }, check: true, url: "https://krishakbandhu.net/" },
  { id: "wb-swasthya-sathi", state: "WB", category: "health", criteria: { }, check: true, url: "https://swasthyasathi.gov.in/" },
  { id: "wb-free-bus", state: "WB", category: "family", criteria: { women: true }, url: null },
  { id: "wb-social-pension", state: "WB", category: "security", criteria: { needy: true }, check: true, url: null },

  // Andaman and Nicobar Islands
  { id: "an-old-age", state: "AN", category: "security", criteria: { senior60: true }, check: true, value: { low: 30000, high: 36000 }, url: null },
  { id: "an-widow-pension", state: "AN", category: "security", criteria: { widow: true }, check: true, value: { low: 30000, high: 30000 }, url: null },
  { id: "an-construction-workers", state: "AN", category: "work", criteria: { worker: true }, check: true, url: null },

  // Chandigarh
  { id: "ch-old-age-pension", state: "CH", category: "security", criteria: { senior60: true }, check: true, url: null },
  { id: "ch-widow-pension", state: "CH", category: "security", criteria: { widow: true }, check: true, url: null },
  { id: "ch-disability-pension", state: "CH", category: "security", criteria: { disability: true }, check: true, url: null },
  { id: "ch-widow-daughter-marriage", state: "CH", category: "family", criteria: { categories: ["sc"], widow: true }, check: true, url: null },

  // Dadra and Nagar Haveli and Daman and Diu
  { id: "dn-old-age-pension", state: "DN", category: "security", criteria: { senior60: true, incomeMax: 150000 }, check: true, value: { low: 18000, high: 24000 }, url: "https://www.myscheme.gov.in/schemes/psoap" },
  { id: "dn-widow-pension", state: "DN", category: "security", criteria: { widow: true, incomeMax: 150000 }, check: true, value: { low: 12000, high: 12000 }, url: "https://www.myscheme.gov.in/schemes/psw" },
  { id: "dn-disability-pension", state: "DN", category: "security", criteria: { disability: true, incomeMax: 150000 }, check: true, value: { low: 12000, high: 12000 }, url: "https://www.myscheme.gov.in/schemes/psdp" },
  { id: "dn-saraswati-vidya", state: "DN", category: "education", criteria: { school: true }, check: true, url: "https://www.myscheme.gov.in/schemes/svyfdb" },

  // Delhi
  { id: "dl-old-age-pension", state: "DL", category: "security", criteria: { senior60: true, incomeMax: 100000 }, check: true, value: { low: 24000, high: 24000 }, url: "https://edistrict.delhigovt.nic.in/" },
  { id: "dl-widow-pension", state: "DL", category: "security", criteria: { widow: true, incomeMax: 100000 }, check: true, value: { low: 30000, high: 30000 }, url: "https://edistrict.delhigovt.nic.in/" },
  { id: "dl-free-bus", state: "DL", category: "family", criteria: { women: true }, url: "https://delhi.gov.in/" },
  { id: "dl-mahila-samriddhi", state: "DL", category: "family", criteria: { women: true, ageMin: 21, ageMax: 60, incomeMax: 250000, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 30000, high: 30000 }, url: "https://dly.delhi.gov.in/" },
  { id: "dl-lakhpati-bitiya", state: "DL", category: "family", criteria: { girl: true, incomeMax: 120000 }, check: true, url: "https://wcd.delhi.gov.in/" },
  { id: "dl-atal-canteen", state: "DL", category: "food", criteria: { }, url: null },
  { id: "dl-free-power", state: "DL", category: "home", criteria: { }, url: "https://power.delhi.gov.in/" },
  { id: "dl-disability-pension", state: "DL", category: "security", criteria: { disability: true, incomeMax: 100000 }, check: true, url: "https://edistrict.delhigovt.nic.in/" },

  // Jammu and Kashmir
  { id: "jk-ladli-beti", state: "JK", category: "family", criteria: { girl: true, incomeMax: 150000 }, check: true, url: "https://jk.gov.in/" },
  { id: "jk-social-pension", state: "JK", category: "security", criteria: { needy: true }, check: true, url: "https://jk.gov.in/" },
  { id: "jk-marriage-assistance", state: "JK", category: "family", criteria: { poorCard: true }, check: true, value: { low: 50000, high: 50000, once: true }, url: null },
  { id: "jk-free-bus", state: "JK", category: "family", criteria: { women: true }, url: null },
  { id: "jk-free-electricity", state: "JK", category: "home", criteria: { poorCard: true }, check: true, url: null },
  { id: "jk-free-lpg", state: "JK", category: "home", criteria: { poorCard: true }, check: true, url: null },

  // Ladakh
  { id: "la-social-pension", state: "LA", category: "security", criteria: { needy: true }, check: true, url: null },
  { id: "la-ladli-beti", state: "LA", category: "family", criteria: { girl: true, incomeMax: 150000 }, check: true, url: null },
  { id: "la-rewa", state: "LA", category: "education", criteria: { college: true }, check: true, url: "https://helphub.ladakh.gov.in/landing/governor-assistance-for-meritorious-student" },
  { id: "la-sidco-loans", state: "LA", category: "work", criteria: { business: true }, check: true, url: "https://sidco.ladakh.gov.in/" },

  // Lakshadweep
  { id: "ld-social-pension", state: "LD", category: "security", criteria: { needy: true }, check: true, value: { low: 18000, high: 18000 }, url: "https://lakshadweep.gov.in/departments/social-welfare-and-tribal-affairs/" },
  { id: "ld-scholarship", state: "LD", category: "education", criteria: { college: true }, check: true, url: "https://lakshadweep.gov.in/" },
  { id: "ld-disability-marriage", state: "LD", category: "family", criteria: { disability: true }, check: true, value: { low: 30000, high: 30000, once: true }, url: "https://lakshadweep.gov.in/departments/social-welfare-and-tribal-affairs/" },

  // Puducherry
  { id: "py-women-heads", state: "PY", category: "family", criteria: { women: true, ageMin: 21, ageMax: 55, poorCard: true }, check: true, value: { low: 30000, high: 30000 }, url: "https://wcd.py.gov.in/" },
  { id: "py-pension", state: "PY", category: "security", criteria: { needy: true }, check: true, url: "https://wcd.py.gov.in/" },
  { id: "py-free-rice", state: "PY", category: "food", criteria: { anyCard: true }, check: true, url: null },
  { id: "py-lpg-subsidy", state: "PY", category: "home", criteria: { anyCard: true }, check: true, value: { low: 1800, high: 3600 }, url: null },
];
