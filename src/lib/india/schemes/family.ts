import type { Scheme } from "../types";

/** Sukanya Samriddhi Yojana: high-interest, tax-free savings for a girl under 10. */
export const sukanya: Scheme = {
  id: "sukanya",
  category: "family",
  evaluate(h) {
    if (h.girlsUnder10 === 0) return { status: "unlikely", reasons: [{ key: "sukanya.noGirl" }] };
    return { status: "likely", reasons: [{ key: "sukanya.save" }] };
  },
};

/** DAY-NRLM / DAY-NULM self-help groups, including the Lakhpati Didi push. */
export const shg: Scheme = {
  id: "shg",
  category: "family",
  evaluate(h, { adult, bpl, nfsa }) {
    if (h.gender !== "female") return { status: "unlikely", reasons: [{ key: "shg.women" }] };
    if (!adult) return { status: "unlikely", reasons: [{ key: "common.adultsOnly" }] };
    const low = bpl || nfsa || h.annualIncome <= 300_000;
    return { status: low ? "likely" : "possibly", reasons: [{ key: "shg.join" }] };
  },
};

/** Pre- and post-matric scholarships for SC, ST, OBC and minority students. */
export const scholarshipCategory: Scheme = {
  id: "scholarship-category",
  category: "education",
  evaluate(h, { rules }) {
    if (h.schoolChildren === 0 && !h.collegeStudent) return { status: "unlikely", reasons: [{ key: "scholarship.noStudents" }] };
    const limits = rules.scholarshipIncome;
    const options: number[] = [];
    if (h.category === "sc") options.push(limits.sc);
    if (h.category === "st") options.push(limits.st);
    if (h.category === "obc") options.push(limits.obc);
    if (h.minority) options.push(limits.minority);
    if (options.length === 0) return { status: "unlikely", reasons: [{ key: "scholarship-category.categoryOnly" }] };
    const limit = Math.max(...options);
    if (h.annualIncome > limit) return { status: "unlikely", reasons: [{ key: "scholarship.over", params: { limit } }] };
    return { status: "likely", reasons: [{ key: "scholarship-category.under", params: { limit } }, { key: "scholarship.nsp" }] };
  },
};

/** Central Sector Scheme of Scholarship for college students who scored in the top 20% in class 12. */
export const scholarshipMerit: Scheme = {
  id: "scholarship-merit",
  category: "education",
  evaluate(h, { rules }) {
    if (!h.collegeStudent) return { status: "unlikely", reasons: [{ key: "scholarship-merit.noCollege" }] };
    const limit = rules.scholarshipIncome.merit;
    if (h.annualIncome > limit) return { status: "unlikely", reasons: [{ key: "scholarship.over", params: { limit } }] };
    return { status: "possibly", reasons: [{ key: "scholarship-merit.top20", params: { limit } }, { key: "scholarship.nsp" }] };
  },
};

/** National Means-cum-Merit Scholarship: ₹12,000 a year from class 9 to 12, via a class 8 exam. */
export const nmmss: Scheme = {
  id: "nmmss",
  category: "education",
  evaluate(h, { rules }) {
    if (h.schoolChildren === 0) return { status: "unlikely", reasons: [{ key: "scholarship.noStudents" }] };
    const limit = rules.scholarshipIncome.nmmss;
    if (h.annualIncome > limit) return { status: "unlikely", reasons: [{ key: "scholarship.over", params: { limit } }] };
    return { status: "possibly", reasons: [{ key: "nmmss.exam", params: { limit } }], value: { low: 12_000, high: 12_000 } };
  },
};
