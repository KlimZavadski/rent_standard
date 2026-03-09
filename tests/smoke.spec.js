import { test, expect } from "@playwright/test";

test("page opens and renders without runtime errors", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("", { waitUntil: "networkidle" });

  expect(pageErrors, `Uncaught errors: ${pageErrors.join("; ")}`).toEqual([]);

  const themeToggle = page.getByRole("button", { name: /Ciemny|Jasny/ });
  await themeToggle.click();
  await page.waitForTimeout(100);

  expect(pageErrors, `Uncaught errors after theme toggle: ${pageErrors.join("; ")}`).toEqual([]);
});
