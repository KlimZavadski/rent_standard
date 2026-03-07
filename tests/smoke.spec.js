import { test, expect } from "@playwright/test";

test("page opens and renders without runtime errors", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("/", { waitUntil: "networkidle" });

  expect(pageErrors, `Uncaught errors: ${pageErrors.join("; ")}`).toEqual([]);
});
