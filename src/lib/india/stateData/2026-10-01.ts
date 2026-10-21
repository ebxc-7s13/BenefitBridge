import type { StateScheme } from "../stateRules";

const yearly = (monthly: number) => ({ low: monthly * 12, high: monthly * 12 });
const once = (amount: number) => ({ low: amount, high: amount, once: true });

/**
 * Flagship state and UT schemes, as reported in October 2026.
 * State schemes change often, so amounts are only given where sources agreed, and most
 * schemes are marked `check` (conditions the questionnaire can't confirm).
 * Links go to the scheme's official portal, or the state's official portal when the
 * scheme has no portal of its own.
 */
export const stateSchemes20261001: StateScheme[] = [
  // Andhra Pradesh
  { id: "ap-ntr-bharosa", state: "AP", category: "security", criteria: { needy: true, poorCard: true }, check: true, value: yearly(4_000), url: "https://www.ap.gov.in/" },
  { id: "ap-talliki-vandanam", state: "AP", category: "education", criteria: { school: true, poorCard: true }, check: true, value: { low: 15_000, high: 15_000 }, url: "https://www.ap.gov.in/" },
  { id: "ap-annadata-sukhibhava", state: "AP", category: "farm", criteria: { farmer: true, noTaxPayer: true }, check: true, value: { low: 14_000, high: 14_000 }, url: "https://www.ap.gov.in/" },
  { id: "ap-deepam", state: "AP", category: "home", criteria: { poorCard: true }, check: true, url: "https://www.ap.gov.in/" },

  // Arunachal Pradesh
  { id: "ar-cmaay", state: "AR", category: "health", criteria: {}, check: true, url: "https://arunachalpradesh.gov.in/" },
  { id: "ar-dulari-kanya", state: "AR", category: "family", criteria: { girl: true }, check: true, url: "https://arunachalpradesh.gov.in/" },

  // Assam
  { id: "as-orunodoi", state: "AS", category: "family", criteria: { women: true, poorCard: true }, check: true, value: yearly(1_250), url: "https://cm.assam.gov.in/" },
  { id: "as-nijut-moina", state: "AS", category: "education", criteria: { college: true }, check: true, url: "https://assam.gov.in/" },
  { id: "as-atal-amrit", state: "AS", category: "health", criteria: { incomeMax: 500_000 }, check: true, url: "https://assam.gov.in/" },

  // Bihar
  { id: "br-mahila-rozgar", state: "BR", category: "work", criteria: { women: true, ageMin: 18 }, check: true, value: once(10_000), url: "https://state.bihar.gov.in/" },
  { id: "br-kanya-utthan", state: "BR", category: "education", criteria: { college: true }, check: true, url: "https://medhasoft.bih.nic.in/" },
  { id: "br-student-credit-card", state: "BR", category: "education", criteria: { college: true }, check: true, url: "https://www.7nishchay-yuvaupmission.bihar.gov.in/" },
  { id: "br-vridhjan-pension", state: "BR", category: "security", criteria: { senior60: true, noGovtJob: true }, check: true, value: yearly(1_100), url: "https://sspmis.bihar.gov.in/" },

  // Chhattisgarh
  { id: "cg-mahtari-vandan", state: "CG", category: "family", criteria: { women: true, ageMin: 21, noTaxPayer: true, noGovtJob: true }, check: true, value: yearly(1_000), url: "https://mahtarivandan.cgstate.gov.in/" },
  { id: "cg-krishak-unnati", state: "CG", category: "farm", criteria: { farmer: true }, check: true, url: "https://cgstate.gov.in/" },

  // Goa
  { id: "ga-griha-aadhar", state: "GA", category: "family", criteria: { women: true, incomeMax: 300_000 }, check: true, value: yearly(1_500), url: "https://goa.gov.in/" },
  { id: "ga-dsss", state: "GA", category: "security", criteria: { needy: true }, check: true, url: "https://goa.gov.in/" },
  { id: "ga-ddssy", state: "GA", category: "health", criteria: {}, check: true, url: "https://goa.gov.in/" },

  // Gujarat
  { id: "gj-namo-lakshmi", state: "GJ", category: "education", criteria: { school: true, incomeMax: 600_000 }, check: true, value: once(50_000), url: "https://gujaratindia.gov.in/" },
  { id: "gj-vahli-dikri", state: "GJ", category: "family", criteria: { girl: true, incomeMax: 200_000 }, check: true, value: once(110_000), url: "https://wcd.gujarat.gov.in/" },
  { id: "gj-ganga-swarupa", state: "GJ", category: "security", criteria: { widow: true }, check: true, value: yearly(1_250), url: "https://www.digitalgujarat.gov.in/" },

  // Haryana
  { id: "hr-lado-lakshmi", state: "HR", category: "family", criteria: { women: true, ageMin: 23, incomeMax: 100_000 }, check: true, value: yearly(2_100), url: "https://haryana.gov.in/" },
  { id: "hr-old-age-samman", state: "HR", category: "security", criteria: { senior60: true, incomeMax: 300_000 }, check: true, url: "https://socialjusticehry.gov.in/" },
  { id: "hr-family-id", state: "HR", category: "security", criteria: {}, url: "https://meraparivar.haryana.gov.in/" },

  // Himachal Pradesh
  { id: "hp-pyari-behna", state: "HP", category: "family", criteria: { women: true, ageMin: 18, ageMax: 59, incomeMax: 200_000, noGovtJob: true }, check: true, value: yearly(1_500), url: "https://himachal.nic.in/" },
  { id: "hp-social-pension", state: "HP", category: "security", criteria: { needy: true }, check: true, url: "https://himachal.nic.in/" },

  // Jharkhand
  { id: "jh-maiyan-samman", state: "JH", category: "family", criteria: { women: true, ageMin: 18, ageMax: 50, anyCard: true }, check: true, value: yearly(2_500), url: "https://mmmsy.jharkhand.gov.in/" },
  { id: "jh-sarvjan-pension", state: "JH", category: "security", criteria: { needy: true }, check: true, value: yearly(1_000), url: "https://jharkhand.gov.in/" },
  { id: "jh-kishori-samriddhi", state: "JH", category: "education", criteria: { school: true }, check: true, url: "https://jharkhand.gov.in/" },

  // Jammu and Kashmir
  { id: "jk-ladli-beti", state: "JK", category: "family", criteria: { girl: true, incomeMax: 150_000 }, check: true, url: "https://jk.gov.in/" },
  { id: "jk-social-pension", state: "JK", category: "security", criteria: { needy: true }, check: true, url: "https://jk.gov.in/" },

  // Karnataka
  { id: "ka-gruha-lakshmi", state: "KA", category: "family", criteria: { women: true, noTaxPayer: true }, check: true, value: yearly(2_000), url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-gruha-jyothi", state: "KA", category: "home", criteria: {}, check: true, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-shakti", state: "KA", category: "family", criteria: { women: true }, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-yuva-nidhi", state: "KA", category: "work", criteria: { jobseeker: true }, check: true, url: "https://sevasindhugs.karnataka.gov.in/" },
  { id: "ka-anna-bhagya", state: "KA", category: "food", criteria: { poorCard: true }, url: "https://karnataka.gov.in/" },

  // Kerala
  { id: "kl-welfare-pension", state: "KL", category: "security", criteria: { needy: true, incomeMax: 100_000 }, check: true, value: yearly(2_000), url: "https://kerala.gov.in/" },
  { id: "kl-kasp", state: "KL", category: "health", criteria: { poorCard: true }, check: true, url: "https://sha.kerala.gov.in/" },
  { id: "kl-life-mission", state: "KL", category: "home", criteria: { noPuccaHouse: true }, check: true, url: "https://lifemission.kerala.gov.in/" },

  // Madhya Pradesh
  { id: "mp-ladli-behna", state: "MP", category: "family", criteria: { women: true, ageMin: 21, ageMax: 60, incomeMax: 250_000, noTaxPayer: true }, check: true, value: yearly(1_500), url: "https://cmladlibahna.mp.gov.in/" },
  { id: "mp-ladli-laxmi", state: "MP", category: "family", criteria: { girl: true, noTaxPayer: true }, check: true, url: "https://ladlilaxmi.mp.gov.in/" },
  { id: "mp-kisan-kalyan", state: "MP", category: "farm", criteria: { farmer: true, landOwner: true, noTaxPayer: true }, check: true, value: { low: 6_000, high: 6_000 }, url: "https://mp.gov.in/" },
  { id: "mp-sambal", state: "MP", category: "work", criteria: { worker: true, noTaxPayer: true }, check: true, url: "https://sambal.mp.gov.in/" },

  // Maharashtra
  { id: "mh-ladki-bahin", state: "MH", category: "family", criteria: { women: true, ageMin: 21, ageMax: 65, incomeMax: 250_000, noTaxPayer: true, noGovtJob: true }, check: true, value: yearly(1_500), url: "https://ladakibahin.maharashtra.gov.in/" },
  { id: "mh-namo-shetkari", state: "MH", category: "farm", criteria: { farmer: true, landOwner: true, noTaxPayer: true }, check: true, value: { low: 6_000, high: 6_000 }, url: "https://pmkisan.gov.in/" },
  { id: "mh-mjpjay", state: "MH", category: "health", criteria: { anyCard: true }, check: true, url: "https://www.jeevandayee.gov.in/" },
  { id: "mh-lek-ladki", state: "MH", category: "family", criteria: { girl: true, incomeMax: 100_000 }, check: true, url: "https://womenchild.maharashtra.gov.in/" },
  { id: "mh-mahadbt", state: "MH", category: "education", criteria: { college: true }, check: true, url: "https://mahadbt.maharashtra.gov.in/" },

  // Manipur, Meghalaya, Mizoram, Nagaland, Sikkim
  { id: "mn-cmht", state: "MN", category: "health", criteria: {}, check: true, url: "https://manipur.gov.in/" },
  { id: "ml-mhis", state: "ML", category: "health", criteria: {}, check: true, url: "https://meghalaya.gov.in/" },
  { id: "mz-bana-kaih", state: "MZ", category: "work", criteria: {}, check: true, url: "https://mizoram.gov.in/" },
  { id: "nl-cmhis", state: "NL", category: "health", criteria: {}, check: true, url: "https://nagaland.gov.in/" },
  { id: "sk-aama-sahayog", state: "SK", category: "family", criteria: { women: true }, check: true, url: "https://sikkim.gov.in/" },

  // Odisha
  { id: "od-subhadra", state: "OD", category: "family", criteria: { women: true, ageMin: 21, ageMax: 60, incomeMax: 250_000, noTaxPayer: true, noGovtJob: true }, check: true, value: { low: 10_000, high: 10_000 }, url: "https://subhadra.odisha.gov.in/" },
  { id: "od-cm-kisan", state: "OD", category: "farm", criteria: { farmer: true }, check: true, url: "https://odisha.gov.in/" },
  { id: "od-madhu-babu", state: "OD", category: "security", criteria: { needy: true }, check: true, url: "https://ssepd.odisha.gov.in/" },

  // Punjab
  { id: "pb-old-age-pension", state: "PB", category: "security", criteria: { senior60: true, incomeMax: 60_000 }, check: true, value: yearly(1_500), url: "https://sswcd.punjab.gov.in/" },
  { id: "pb-ashirwad", state: "PB", category: "family", criteria: { incomeMax: 32_790 }, check: true, value: once(51_000), url: "https://punjab.gov.in/" },
  { id: "pb-free-power", state: "PB", category: "home", criteria: {}, url: "https://www.pspcl.in/" },

  // Rajasthan
  { id: "rj-maa", state: "RJ", category: "health", criteria: {}, check: true, url: "https://jankalyan.rajasthan.gov.in/" },
  { id: "rj-lado-protsahan", state: "RJ", category: "family", criteria: { girl: true }, check: true, value: once(150_000), url: "https://jankalyan.rajasthan.gov.in/" },
  { id: "rj-palanhar", state: "RJ", category: "family", criteria: { needy: true, school: true }, check: true, url: "https://sje.rajasthan.gov.in/" },
  { id: "rj-pension", state: "RJ", category: "security", criteria: { needy: true, incomeMax: 48_000 }, check: true, url: "https://ssp.rajasthan.gov.in/" },

  // Tamil Nadu
  { id: "tn-kmut", state: "TN", category: "family", criteria: { women: true, ageMin: 21, incomeMax: 250_000, noTaxPayer: true }, check: true, value: yearly(1_000), url: "https://www.tn.gov.in/" },
  { id: "tn-pudhumai-penn", state: "TN", category: "education", criteria: { college: true }, check: true, value: yearly(1_000), url: "https://www.tn.gov.in/" },
  { id: "tn-cmchis", state: "TN", category: "health", criteria: { incomeMax: 120_000 }, check: true, url: "https://www.cmchistn.com/" },
  { id: "tn-breakfast", state: "TN", category: "food", criteria: { school: true }, url: "https://www.tn.gov.in/" },

  // Telangana
  { id: "ts-rythu-bharosa", state: "TS", category: "farm", criteria: { farmer: true, landOwner: true }, check: true, perAcre: 12_000, url: "https://telangana.gov.in/" },
  { id: "ts-mahalakshmi", state: "TS", category: "family", criteria: { women: true }, url: "https://telangana.gov.in/" },
  { id: "ts-gruha-jyothi", state: "TS", category: "home", criteria: { poorCard: true }, check: true, url: "https://telangana.gov.in/" },
  { id: "ts-kalyana-lakshmi", state: "TS", category: "family", criteria: { incomeMax: 200_000 }, check: true, value: once(100_116), url: "https://telanganaepass.cgg.gov.in/" },
  { id: "ts-cheyutha", state: "TS", category: "security", criteria: { needy: true }, check: true, url: "https://telangana.gov.in/" },

  // Uttar Pradesh
  { id: "up-kanya-sumangala", state: "UP", category: "family", criteria: { girl: true, incomeMax: 300_000 }, check: true, value: once(25_000), url: "https://mksy.up.gov.in/" },
  { id: "up-pension", state: "UP", category: "security", criteria: { needy: true, incomeMax: 56_460 }, check: true, value: yearly(1_000), url: "https://sspy-up.gov.in/" },
  { id: "up-scholarship", state: "UP", category: "education", criteria: { college: true, incomeMax: 250_000 }, check: true, url: "https://scholarship.up.gov.in/" },
  { id: "up-samuhik-vivah", state: "UP", category: "family", criteria: { incomeMax: 200_000 }, check: true, url: "https://cmsvy.upsdc.gov.in/" },

  // Uttarakhand
  { id: "uk-nanda-gaura", state: "UK", category: "family", criteria: { girl: true }, check: true, value: once(62_000), url: "https://nandagaurauk.in/" },
  { id: "uk-social-pension", state: "UK", category: "security", criteria: { needy: true }, check: true, url: "https://uk.gov.in/" },

  // West Bengal
  { id: "wb-annapurna-bhandar", state: "WB", category: "family", criteria: { women: true, ageMin: 25, ageMax: 60, noTaxPayer: true, noGovtJob: true }, check: true, value: yearly(3_000), url: "https://wb.gov.in/" },
  { id: "wb-kanyashree", state: "WB", category: "education", criteria: { school: true }, check: true, url: "https://wbkanyashree.gov.in/" },
  { id: "wb-krishak-bandhu", state: "WB", category: "farm", criteria: { farmer: true }, check: true, url: "https://krishakbandhu.net/" },
  { id: "wb-swasthya-sathi", state: "WB", category: "health", criteria: {}, check: true, url: "https://swasthyasathi.gov.in/" },

  // Delhi
  { id: "dl-old-age-pension", state: "DL", category: "security", criteria: { senior60: true, incomeMax: 100_000 }, check: true, value: yearly(2_000), url: "https://edistrict.delhigovt.nic.in/" },
  { id: "dl-widow-pension", state: "DL", category: "security", criteria: { widow: true, incomeMax: 100_000 }, check: true, value: yearly(2_500), url: "https://edistrict.delhigovt.nic.in/" },
  { id: "dl-free-bus", state: "DL", category: "family", criteria: { women: true }, url: "https://delhi.gov.in/" },
  { id: "dl-mahila-samriddhi", state: "DL", category: "family", criteria: { women: true }, check: true, url: "https://delhi.gov.in/" },

  // Puducherry
  { id: "py-women-heads", state: "PY", category: "family", criteria: { women: true, ageMin: 21, ageMax: 55, poorCard: true }, check: true, value: yearly(2_500), url: "https://wcd.py.gov.in/" },
];

/** Every state and UT's official government portal, shown with its schemes. */
