import type { JobRule } from "../jobs";

/**
 * National recruitment exams and job schemes: education and age limits for the general category,
 * with the usual SC/ST/OBC age relaxation, from the latest notices seen in October 2026.
 * Limits change with each notice, so results say "check the notice". Add a new dated file for updates;
 * never edit a published one.
 */
export const jobsAsOf = "2026-10-21";

export const jobSources = ["https://ssc.gov.in/", "https://www.rrbapply.gov.in/", "https://upsc.gov.in/", "https://www.ibps.in/", "https://indiapostgdsonline.gov.in/", "https://www.apprenticeshipindia.gov.in/"];

export const jobs2026: JobRule[] = [
  { id: "ssc-mts", minEducation: "10th", ageMin: 18, ageMax: 25, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-chsl", minEducation: "12th", ageMin: 18, ageMax: 27, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-cgl", minEducation: "graduate", ageMin: 18, ageMax: 32, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-gd", minEducation: "10th", ageMin: 18, ageMax: 23, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-steno", minEducation: "12th", ageMin: 18, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-je", minEducation: "diploma", ageMin: 18, ageMax: 32, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "ssc-cpo", minEducation: "graduate", ageMin: 20, ageMax: 25, relax: { sc: 5, st: 5, obc: 3 }, url: "https://ssc.gov.in/" },
  { id: "rrb-ntpc-graduate", minEducation: "graduate", ageMin: 18, ageMax: 33, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.rrbapply.gov.in/" },
  { id: "rrb-ntpc-undergraduate", minEducation: "12th", ageMin: 18, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.rrbapply.gov.in/" },
  { id: "rrb-group-d", minEducation: "10th", ageMin: 18, ageMax: 33, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.rrbapply.gov.in/" },
  { id: "rrb-alp", minEducation: "iti", ageMin: 18, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.rrbapply.gov.in/" },
  { id: "rrb-je", minEducation: "diploma", ageMin: 18, ageMax: 33, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.rrbapply.gov.in/" },
  { id: "upsc-cse", minEducation: "graduate", ageMin: 21, ageMax: 32, relax: { sc: 5, st: 5, obc: 3 }, url: "https://upsc.gov.in/" },
  { id: "upsc-nda", minEducation: "12th", ageMin: 16.5, ageMax: 19.5, url: "https://upsc.gov.in/" },
  { id: "upsc-cds", minEducation: "graduate", ageMin: 19, ageMax: 25, url: "https://upsc.gov.in/" },
  { id: "upsc-capf", minEducation: "graduate", ageMin: 20, ageMax: 25, relax: { sc: 5, st: 5, obc: 3 }, url: "https://upsc.gov.in/" },
  { id: "ibps-po", minEducation: "graduate", ageMin: 20, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.ibps.in/" },
  { id: "ibps-clerk", minEducation: "graduate", ageMin: 20, ageMax: 28, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.ibps.in/" },
  { id: "ibps-rrb-oa", minEducation: "graduate", ageMin: 18, ageMax: 28, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.ibps.in/" },
  { id: "sbi-po", minEducation: "graduate", ageMin: 21, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://sbi.co.in/web/careers" },
  { id: "sbi-clerk", minEducation: "graduate", ageMin: 20, ageMax: 28, relax: { sc: 5, st: 5, obc: 3 }, url: "https://sbi.co.in/web/careers" },
  { id: "rbi-assistant", minEducation: "graduate", ageMin: 20, ageMax: 28, relax: { sc: 5, st: 5, obc: 3 }, url: "https://opportunities.rbi.org.in/" },
  { id: "agniveer-army", minEducation: "10th", ageMin: 17.5, ageMax: 21, url: "https://joinindianarmy.nic.in/" },
  { id: "agniveer-navy", minEducation: "10th", ageMin: 17.5, ageMax: 21, url: "https://www.joinindiannavy.gov.in/" },
  { id: "agniveer-vayu", minEducation: "12th", ageMin: 17.5, ageMax: 21, url: "https://agnipathvayu.cdac.in/" },
  { id: "india-post-gds", minEducation: "10th", ageMin: 18, ageMax: 40, relax: { sc: 5, st: 5, obc: 3 }, url: "https://indiapostgdsonline.gov.in/" },
  { id: "ctet-paper1", minEducation: "diploma", ageMin: 18, url: "https://ctet.nic.in/" },
  { id: "ctet-paper2", minEducation: "b.ed", ageMin: 18, url: "https://ctet.nic.in/" },
  { id: "kvs-nvs-prt", minEducation: "diploma", ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://kvsangathan.nic.in/" },
  { id: "kvs-nvs-tgt", minEducation: "b.ed", ageMax: 35, relax: { sc: 5, st: 5, obc: 3 }, url: "https://kvsangathan.nic.in/" },
  { id: "kvs-nvs-pgt", minEducation: "postgraduate", ageMax: 40, relax: { sc: 5, st: 5, obc: 3 }, url: "https://kvsangathan.nic.in/" },
  { id: "aiims-norcet", minEducation: "diploma", ageMin: 18, ageMax: 30, relax: { sc: 5, st: 5, obc: 3 }, url: "https://www.aiimsexams.ac.in/" },
  { id: "naps", minEducation: "8th", ageMin: 14, url: "https://www.apprenticeshipindia.gov.in/" },
  { id: "nats", minEducation: "diploma", url: "https://nats.education.gov.in/" },
  { id: "ncs", forAll: true, url: "https://www.ncs.gov.in/" },
  { id: "skill-india-pmkvy", forAll: true, url: "https://www.skillindiadigital.gov.in/" },
  { id: "pm-internship", minEducation: "10th", ageMin: 21, ageMax: 24, url: "https://pminternship.mca.gov.in/" },
];
