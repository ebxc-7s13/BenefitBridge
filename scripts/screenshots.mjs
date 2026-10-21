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
  await page.close();
}
await browser.close();
server.kill();
