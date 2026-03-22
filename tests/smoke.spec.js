import { test, expect } from "@playwright/test";
import { STORAGE_KEY } from "../src/consent/consentConstants.js";

test("page opens and renders without runtime errors", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.addInitScript((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, STORAGE_KEY);

  await page.goto("", { waitUntil: "networkidle" });

  expect(pageErrors, `Uncaught errors: ${pageErrors.join("; ")}`).toEqual([]);

  const themeToggle = page.getByRole("button", { name: /Ciemny|Jasny/ });
  await themeToggle.click();
  await page.waitForTimeout(100);

  expect(pageErrors, `Uncaught errors after theme toggle: ${pageErrors.join("; ")}`).toEqual([]);
});

test("cookie banner: reject optional, then open footer preferences", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("", { waitUntil: "networkidle" });
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload({ waitUntil: "networkidle" });

  const banner = page.getByRole("region", { name: /Zgoda na pliki cookie/i });
  await expect(banner).toBeVisible();

  await page.getByRole("button", { name: "Odrzuć opcjonalne" }).first().click();
  await expect(banner).not.toBeVisible();

  await expect(page.locator("html")).toHaveAttribute("data-rs-consent-ready", "1");
  await expect(page.locator("html")).toHaveAttribute("data-rs-consent-analytics", "0");

  await page.getByRole("button", { name: "Ustawienia plików cookie" }).click();
  await expect(page.getByRole("dialog", { name: /Ustawienia plików cookie/i })).toBeVisible();
  await page.getByRole("button", { name: "Zamknij" }).click();
  await expect(
    page.getByRole("dialog", { name: /Ustawienia plików cookie/i }),
  ).not.toBeVisible();

  expect(pageErrors, `Uncaught errors: ${pageErrors.join("; ")}`).toEqual([]);
});
