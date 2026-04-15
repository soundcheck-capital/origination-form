import path from "node:path";
import { expect, test } from "@playwright/test";

test("main path e2e", async ({ page }) => {
  const now = Date.now();
  const tag = `E2E_MAIN_${now}`;
  const fixturePath = path.resolve("tests/fixtures/e2e-upload.csv");
  const isFormWebhook = (url: string) =>
    url === "https://webhook.test.com/test" ||
    url === "https://webhook.test.com/summary" ||
    url.includes("hook.us1.make.com");

  const isFileUploadWebhook = (url: string) =>
    url === "https://webhook.test.com/files" || url.includes("hook.us1.make.com");

  await page.route("**/*", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method === "POST" && isFileUploadWebhook(url)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
      return;
    }

    if (method === "POST" && isFormWebhook(url)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto("/?companyName=Acme", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Access Required" })).toBeVisible();

  await page.goto("/form?ticketingco=Shotgun", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/\?ticketingco=Shotgun$/);
  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible();
  await expect(page.getByAltText("Shotgun Logo")).toBeVisible();

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible();

  await page.locator('input[name="firstname"]').fill("E2E");
  await page.locator('input[name="lastname"]').fill("Main");
  await page.locator('input[name="email"]').fill("e2e@example.com");
  await page.locator('input[name="phone"]').fill("+14155552671");

  await page.locator('input[name="name"]').fill(tag);
  await page.locator('input[name="role"]').fill("Owner");
  await page.locator('select[name="clientType"]').selectOption("Promoter");
  await page.locator('select[name="yearsInBusiness"]').selectOption("2-5 years");
  await page.locator('input[name="socials"]').fill("https://example.com");
  await page.locator('select[name="memberOf"]').selectOption("None");
  await page.locator('input[name="nextYearEvents"]').fill("12");
  await page.locator('input[name="nextYearSales"]').fill("250000");
  await page.locator('select[name="paymentProcessing"]').selectOption("Ticketing Co");
  await page.locator('select[name="currentPartner"]').selectOption("Eventbrite");
  await page.locator('select[name="settlementPayout"]').selectOption("Weekly");

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible();

  await page.locator('select[name="timingOfFunding"]').selectOption("In the next month");
  await page.locator('select[name="useOfProceeds"]').selectOption("General Working Capital Needs");

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator('input[name="legalEntityName"]')).toBeVisible();

  await page.locator('input[name="legalEntityName"]').fill(`${tag} LLC`);
  await page.locator('input[name="dba"]').fill(tag);
  await page.locator('select[name="businessType"]').selectOption("Limited Liability Company (LLC)");
  await page.locator('select[name="stateOfIncorporation"]').selectOption("CA");
  await page.locator('input[name="companyAddressDisplay"]').fill("123 Market St, San Francisco, CA 94105, USA");
  await page.locator('input[name="ein"]').fill("12-3456789");
  await page.locator('input[name="owner0Name"]').fill("Jane Owner");
  await page.locator('input[name="owner0Percentage"]').fill("100");
  await page.locator('input[name="owner0Address"]').fill("123 Main St, San Francisco, CA 94105, USA");
  await page.locator('input[name="owner0BirthDate"]').fill("1988-01-01");
  await page.locator('textarea[name="industryReferences"]').fill(`Reference for ${tag}`);
  await page.locator('textarea[name="additionalComments"]').fill(`Automated E2E main-path run ${tag}`);

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  const waitForUploadPost = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        isFileUploadWebhook(response.url()),
      { timeout: 30_000 }
    );

  const uploadResponse1 = waitForUploadPost();
  await page.locator("#file-upload-ticketingCompanyReport").setInputFiles(fixturePath);
  expect((await uploadResponse1).status()).toBe(200);

  const uploadResponse2 = waitForUploadPost();
  await page.locator("#file-upload-financialStatements").setInputFiles(fixturePath);
  expect((await uploadResponse2).status()).toBe(200);

  const uploadResponse3 = waitForUploadPost();
  await page.locator("#file-upload-incorporationCertificate").setInputFiles(fixturePath);
  expect((await uploadResponse3).status()).toBe(200);

  await expect(page.getByText("e2e-upload.csv").first()).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL("**/submit-success", { timeout: 20_000 });
  await expect(page).toHaveURL(/\/submit-success$/);
  await expect(page.getByText("Application submitted successfully!")).toBeVisible();
});
