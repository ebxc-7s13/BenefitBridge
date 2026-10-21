// Captures phone-size screenshots of the main screens into docs/screenshots.
// Run after `npm run build`: node scripts/screenshots.mjs
import { chromium, devices } from "@playwright/test";
import { spawn } from "node:child_process";

const server = spawn("npx", ["vite", "preview", "--port", "4174", "--strictPort"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2500));
const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});

for (const scheme of ["light", "dark"]) {
  const page = await browser.newPage({ ...devices["Pixel 7"], colorScheme: scheme });
  const shot = (name) => page.screenshot({ path: `docs/screenshots/${name}-${scheme}.png` });
  await page.goto("http://localhost:4174/");
  await shot("0-country");
  await page.getByRole("button", { name: /United States/ }).click();
  await shot("1-home");
  await page.getByRole("link", { name: "Check what I qualify for" }).click();
  await page.getByLabel("State").selectOption("OH");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "More: Children under 5" }).click();
  await page.getByRole("button", { name: "More: Children 5 to 16" }).click();
  await page.getByText("I'm married").click();
  await shot("2-household");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Pay from work").fill("1300");
  await page.getByLabel("How often?").first().selectOption("biweekly");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Rent or mortgage, each month").fill("1150");
  await page.getByLabel("Heat, electric, gas and water, each month").fill("220");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "See my results" }).click();
  await page.waitForTimeout(300);
  await shot("3-results");
  await page.locator(".result-card", { hasText: "SNAP (food stamps)" }).click();
  await page.getByText("Photo ID").click();
  await page.getByLabel("Interview or appointment").fill("2026-11-04");
  await shot("4-program");
  await page.getByRole("link", { name: "My plan" }).click();
  await shot("5-plan");

  // India, in English and Hindi.
  const pick = (label) => page.getByText(label, { exact: true }).click();
  await page.getByRole("link", { name: /Change country/ }).click();
  await page.getByRole("button", { name: /India/ }).click();
  await shot("in-1-home");
  await page.getByRole("link", { name: "Check what I qualify for" }).click();
  await page.getByLabel("State or union territory").selectOption("BR");
  await pick("Village (rural area)");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Your age").fill("31");
  await pick("A woman");
  await page.getByRole("button", { name: "More: Children under 6" }).click();
  await page.getByRole("button", { name: "More: Children in school (class 1–12)" }).click();
  await pick("Is pregnant or breastfeeding");
  await shot("in-2-family");
  await page.getByRole("button", { name: "Next" }).click();
  await pick("OBC");
  await pick("Priority household (PHH / BPL)");
  await pick("Yes");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Total family income").fill("8500");
  await page.getByRole("button", { name: "Next" }).click();
  await pick("Farming on our own or rented land");
  await pick("Daily wage, construction, domestic or factory work");
  await page.getByLabel("Farmland our family owns (acres)").fill("1");
  await page.getByRole("button", { name: "Next" }).click();
  await pick("A kutcha or damaged house");
  await pick("We have an LPG gas connection");
  await page.getByRole("button", { name: "See my results" }).click();
  await page.waitForTimeout(300);
  await shot("in-3-results");
  await page.getByRole("button", { name: "हिन्दी" }).click();
  await page.waitForTimeout(200);
  await shot("in-4-results-hindi");
  await page.locator(".result-card", { hasText: "प्रधानमंत्री आवास योजना – ग्रामीण" }).click();
  await shot("in-5-program-hindi");
  await page.getByRole("button", { name: "English" }).click();
  await page.close();
}
await browser.close();
server.kill();
