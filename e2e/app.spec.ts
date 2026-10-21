import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

async function expectAccessible(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
}

async function completeScreener(page: Page) {
  await page.goto("./");
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

test("home page is accessible and private by default", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find help you may already qualify for.");
  await expect(page.getByRole("button", { name: "Quick exit" })).toBeVisible();
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
  await expectAccessible(page);

  await likely.getByRole("link", { name: /SNAP \(food stamps\)/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "SNAP (food stamps)" })).toBeFocused();
  await expect(page.getByText(/We estimate about \$\d+ a month for food\./)).toBeVisible();
  await page.getByText("Photo ID").click();
  await page.getByLabel("Interview or appointment").fill("2030-01-15");
  await expect(page.getByRole("button", { name: "Add to my calendar" })).toBeVisible();
  await expectAccessible(page);

  await page.getByRole("link", { name: "My plan" }).click();
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
  await page.getByRole("link", { name: "Get help" }).click();
  await expectAccessible(page);
  await page.getByRole("button", { name: "Delete everything" }).click();
  await page.getByRole("button", { name: "Yes, delete everything" }).click();
  await expect(page.getByText("Everything was deleted from this device.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Results" })).toHaveCount(0);
});

test("the single-file release works offline, straight from a file", async ({ page, context }) => {
  const file = new URL("../dist-single/index.html", import.meta.url);
  test.skip(!existsSync(file), "run `npm run build:single` first");
  await context.route(/^https?:/, (route) => route.abort());
  await page.goto(file.href);
  await page.getByRole("link", { name: "Check what I qualify for" }).click();
  await page.getByLabel("State").selectOption("CA");
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "See my results" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Your results" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "SNAP (food stamps)" })).toBeVisible();
});
