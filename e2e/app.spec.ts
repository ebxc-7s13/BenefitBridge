import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
}

/** Tick a checkbox or radio by clicking its visible label text. */
const pick = (page: Page, label: string) => page.getByText(label, { exact: true }).click();

async function chooseCountry(page: Page, name: "United States" | "India") {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1, name: "Where do you live?" })).toBeVisible();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}

async function completeScreener(page: Page) {
  await chooseCountry(page, "United States");
  await page.getByRole("link", { name: "Check what I qualify for" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Where do you live?" })).toBeFocused();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("alert")).toHaveText("Please choose your state.");
  await page.getByLabel("State").selectOption("TX");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: "More: Children under 5" }).click();
  await page.getByRole("button", { name: "More: Children 5 to 16" }).click();
  await expect(page.getByRole("spinbutton", { name: "People in your home, including you" })).toHaveValue("3");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByLabel("Pay from work").fill("1100");
  await page.getByLabel("How often?").first().selectOption("biweekly");
  await expect(page.getByText("That's about $2,383 a month.")).toBeVisible();
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByLabel("Rent or mortgage, each month").fill("1100");
  await page.getByLabel("Heat, electric, gas and water, each month").fill("180");
  await page.getByRole("button", { name: "Next" }).click();

  await expectAccessible(page);
  await page.getByRole("button", { name: "See my results" }).click();
}

test("asks for the country first, and every start page is accessible", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Where do you live?");
  await expect(page.getByRole("button", { name: "Quick exit" })).toBeVisible();
  await expectAccessible(page);
  await chooseCountry(page, "United States");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find help you may already qualify for.");
  await expectAccessible(page);
  await page.getByRole("link", { name: /Change country/ }).first().click();
  await page.getByRole("button", { name: /India/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the government schemes your family can get.");
  await expect(page.getByRole("heading", { name: "Updates" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "New: listen, share and bigger text" })).toBeVisible();
  await expectAccessible(page);
});

test("a family finds benefits, tracks one, and sees it in their plan", async ({ page }) => {
  await completeScreener(page);

  await expect(page.getByRole("heading", { level: 1, name: "Your results" })).toBeVisible();
  const likely = page.locator("section.result-group").filter({ has: page.getByRole("heading", { name: "You likely qualify" }) });
  for (const name of ["SNAP (food stamps)", "Earned Income Tax Credit (EITC)", "Medicaid and CHIP for kids", "WIC"]) {
    await expect(likely.getByRole("heading", { name })).toBeVisible();
  }
  await expect(page.locator(".value-amount")).toContainText("$");
  const state = page.locator("section.extra-card").filter({ has: page.getByRole("heading", { name: "Apply in Texas" }) });
  await expect(state.getByRole("link", { name: /Your Texas Benefits/ })).toHaveAttribute("href", "https://www.yourtexasbenefits.com/");
  await expectAccessible(page);

  await likely.getByRole("link", { name: /SNAP \(food stamps\)/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "SNAP (food stamps)" })).toBeFocused();
  await expect(page.getByText(/We estimate about \$\d+ a month for food\./)).toBeVisible();
  await page.getByText("Photo ID").click();
  await page.getByLabel("Interview or appointment").fill("2030-01-15");
  await expect(page.getByRole("button", { name: "Add to my calendar" })).toBeVisible();
  await expectAccessible(page);

  // My plan is on the home page.
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await page.getByRole("link", { name: /My plan/ }).click();
  await expect(page.getByRole("heading", { level: 2, name: "SNAP (food stamps)" })).toBeVisible();
  await expect(page.getByText("1 of 6 papers ready")).toBeVisible();
  await expect(page.getByText("January 15, 2030")).toBeVisible();
  await expectAccessible(page);

  // Everything survives a reload (saved on the device).
  await page.reload();
  await expect(page.getByText("1 of 6 papers ready")).toBeVisible();
});

test("works in Spanish", async ({ page }) => {
  await completeScreener(page);
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Sus resultados" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SNAP (estampillas de comida)" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expectAccessible(page);
});

test("help page can delete everything", async ({ page }) => {
  await completeScreener(page);
  await page.getByRole("link", { name: "Help", exact: true }).click();
  await expectAccessible(page);
  await page.getByRole("button", { name: "Delete everything" }).click();
  await page.getByRole("button", { name: "Yes, delete everything" }).click();
  await expect(page.getByText("Everything was deleted from this device.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Schemes", exact: true })).toHaveCount(0);
});

test("the single-file release works offline, straight from a file", async ({ page, context }) => {
  const file = new URL("../dist-single/index.html", import.meta.url);
  test.skip(!existsSync(file), "run `npm run build:single` first");
  await context.route(/^https?:/, (route) => route.abort());
  await page.goto(file.href);
  await page.getByRole("button", { name: /United States/ }).click();
  await page.getByRole("link", { name: "Check what I qualify for" }).click();
  await page.getByLabel("State").selectOption("CA");
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "See my results" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Your results" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SNAP (food stamps)" })).toBeVisible();
});

async function completeIndia(page: Page) {
  await chooseCountry(page, "India");
  await page.getByRole("link", { name: "Check what I qualify for" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Where do you live?" })).toBeFocused();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Please choose your state.")).toBeVisible();
  await page.getByLabel("State or union territory").selectOption("UP");
  await pick(page, "Village (rural area)");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByLabel("Your age").fill("34");
  await pick(page, "A woman");
  await page.getByRole("button", { name: "More: Children under 6" }).click();
  await page.getByRole("button", { name: "More: Girls under 10" }).click();
  await page.getByRole("button", { name: "More: Children in school (class 1–12)" }).click();
  await page.getByRole("button", { name: "More: Children in school (class 1–12)" }).click();
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await pick(page, "SC (Scheduled Caste)");
  await pick(page, "Priority household (PHH / BPL)");
  await pick(page, "Yes");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByLabel("Total family income").fill("9000");
  await expect(page.getByText("That's about ₹1,08,000 a year.")).toBeVisible();
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await pick(page, "Farming on our own or rented land");
  await pick(page, "Farm labour");
  await page.getByLabel("Farmland our family owns (acres)").fill("1.5");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Next" }).click();

  await pick(page, "A kutcha or damaged house");
  await pick(page, "We have an LPG gas connection");
  await expectAccessible(page);
  await page.getByRole("button", { name: "See my results" }).click();
}

test("an Indian farming family finds its schemes and how to apply", async ({ page }) => {
  await completeIndia(page);
  await expect(page.getByRole("heading", { level: 1, name: "Your results" })).toBeVisible();
  const likely = page.locator("section.result-group").filter({ has: page.getByRole("heading", { name: "You likely qualify" }) });
  for (const name of [
    "PM-KISAN",
    "Free ration (PM Garib Kalyan Anna Yojana)",
    "PM Awas Yojana – Gramin",
    "PM Ujjwala Yojana",
    "Rural jobs guarantee (VB-G RAM G)",
    "Kisan Credit Card",
    "Sukanya Samriddhi Yojana",
  ]) {
    await expect(likely.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(page.locator(".value-amount")).toContainText("₹");
  const state = page.locator("section.extra-card").filter({ has: page.getByRole("heading", { name: "Schemes in Uttar Pradesh" }) });
  await expect(state.getByRole("link", { name: /up\.gov\.in/ })).toHaveAttribute("href", "https://up.gov.in/");
  await expectAccessible(page);

  // The state's own schemes have their own section below the national ones, with papers and the official website.
  const stateSection = page.locator("section.state-group").filter({ has: page.getByRole("heading", { level: 2, name: "Uttar Pradesh government schemes" }) });
  await expect(stateSection.locator("li")).not.toHaveCount(0);
  await expect(likely.getByRole("link", { name: /Uttar Pradesh/ })).toHaveCount(0);
  await stateSection.getByRole("link", { name: /Mukhyamantri Kanya Sumangala Yojana \(Uttar Pradesh\)/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Mukhyamantri Kanya Sumangala Yojana (Uttar Pradesh)" })).toBeFocused();
  await expect(page.getByRole("checkbox").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Official website/ })).toHaveAttribute("href", /^https:\/\/[a-z0-9.-]+\.gov\.in\//);
  await expectAccessible(page);
  await page.goBack();

  await likely.getByRole("link", { name: /PM-KISAN/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "PM-KISAN" })).toBeFocused();
  await expect(page.getByText("₹6,000 a year, paid as ₹2,000 every four months.")).toBeVisible();
  await expect(page.getByRole("link", { name: /PM-KISAN portal/ })).toHaveAttribute("href", "https://pmkisan.gov.in/");
  await expectAccessible(page);
});

test("India works in Hindi, and each country keeps its own answers", async ({ page }) => {
  await completeIndia(page);
  await page.getByRole("button", { name: "हिन्दी" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "आपके नतीजे" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "पीएम-किसान", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expectAccessible(page);

  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("link", { name: /Change country/ }).click();
  await page.getByRole("button", { name: /United States/ }).click();
  await expect(page.getByRole("link", { name: "Check what I qualify for" })).toBeVisible();
  await page.getByRole("link", { name: /Change country/ }).first().click();
  await page.getByRole("button", { name: /India/ }).click();
  await expect(page.getByRole("link", { name: "See my results" })).toBeVisible();
});

test("people in other countries find official programs and where to apply", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("link", { name: /Help in other countries/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Help in other countries" })).toBeFocused();
  await expectAccessible(page);
  await page.getByRole("link", { name: /United Kingdom/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "United Kingdom" })).toBeFocused();
  const uc = page.locator(".world-card").filter({ has: page.getByRole("heading", { name: "Universal Credit" }) });
  await uc.locator("summary").click();
  await expect(uc.getByRole("heading", { name: "How to apply" })).toBeVisible();
  await expect(uc.getByRole("link", { name: /Official website/ })).toHaveAttribute("href", /^https:\/\/www\.gov\.uk\//);
  await expectAccessible(page);
});

test("after choosing a state, the questionnaire can switch to the state's language", async ({ page }) => {
  await chooseCountry(page, "India");
  await page.getByRole("link", { name: "Check what I qualify for" }).click();
  await page.getByLabel("State or union territory").selectOption("TN");
  const tamil = page.getByRole("button", { name: "தமிழ்" });
  await expect(page.getByRole("group", { name: "Choose your language" }).getByRole("button")).toHaveText(["English", "हिन्दी", "தமிழ்"]);
  await tamil.click();
  await expect(tamil).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("lang", "ta");
  await expect(page.getByRole("heading", { level: 1, name: "நீங்கள் எங்கே வசிக்கிறீர்கள்?" })).toBeVisible();
  await expectAccessible(page);

  // Urdu is written right to left.
  await page.locator("#in-state").selectOption("JK");
  await page.getByRole("button", { name: "اردو" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expectAccessible(page);

  // A state without its own language offers English and Hindi only, and falls back to English.
  await page.locator("#in-state").selectOption("UP");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("group", { name: "Choose your language" }).getByRole("button")).toHaveText(["English", "हिन्दी"]);
});

test("the hub: basic details once, then services, jobs and helplines for the state", async ({ page }) => {
  await chooseCountry(page, "India");
  await page.getByRole("link", { name: "Add my details" }).click();
  await page.locator("#in-state").selectOption("MH");
  await pick(page, "Town or city (urban area)");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Your age").fill("24");
  await expectAccessible(page);
  await page.getByRole("button", { name: "Save and continue" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the government schemes your family can get.");
  await expect(page.getByText(/^Maharashtra · /)).toBeVisible();
  await expectAccessible(page);

  // Services: the state's own first, and search finds national ones too.
  await page.getByRole("link", { name: "Services", exact: true }).click();
  await expect(page.getByRole("button", { name: "Maharashtra" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".dir-item").first()).toBeVisible();
  await page.getByRole("searchbox").fill("aadhaar");
  await expect(page.locator(".dir-item h3").filter({ hasText: /Aadhaar/ }).first()).toBeVisible();
  for (const link of await page.locator(".dir-item a.button[href^='http']").all()) {
    expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
  }
  await expectAccessible(page);

  // Jobs: education and age decide what you can apply for.
  await page.getByRole("link", { name: "Jobs", exact: true }).click();
  await page.getByLabel("Your highest education").selectOption("graduate");
  const cgl = page.locator(".dir-item").filter({ hasText: "Combined Graduate Level" });
  await expect(cgl.getByText("You can apply")).toBeVisible();
  await expectAccessible(page);

  // Helplines: tap to call.
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await page.getByRole("link", { name: /Helplines/ }).click();
  await expect(page.locator('a[href="tel:112"]').first()).toBeVisible();
  await expectAccessible(page);
});

test("text can be made larger, and schemes and services can be shared", async ({ page }) => {
  await completeIndia(page);
  await page.getByRole("link", { name: "Help", exact: true }).click();
  await page.getByRole("button", { name: "Extra large" }).click();
  await expect(page.locator("html")).toHaveAttribute("style", /font-size: 125%/);
  await expectAccessible(page);

  await page.getByRole("link", { name: "Schemes", exact: true }).click();
  await expect(page.getByRole("button", { name: "Share" }).first()).toBeVisible();
  await page.getByRole("link", { name: /PM-KISAN/ }).first().click();
  await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
  await expectAccessible(page);
});
