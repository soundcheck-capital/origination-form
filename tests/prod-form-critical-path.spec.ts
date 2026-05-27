import path from "node:path";
import { expect, test } from "@playwright/test";

test("prod form critical path stays healthy", async ({ page }) => {
  const now = Date.now();
  const tag = `E2E_PROD_${now}`;
  const email = "e2e@example.com";
  const fixturePath = path.resolve("tests/fixtures/e2e-upload.csv");

  // Bypass the Plaid Link iframe (third-party, popup, unreliable in CI) by
  // putting the hook into test mode. Connect-button click fires onSuccess
  // synthetically with a fake public_token; we mock the Plaid webhook so it
  // doesn't 500 on the unrecognized token. The dedicated plaid-connection
  // spec covers the real webhook contract.
  await page.addInitScript(() => {
    (window as any).__PLAID_TEST_MODE__ = true;
  });
  const plaidWebhookHost = new URL(process.env.REACT_APP_PLAID_WEBHOOK_URL || "https://hook.us1.make.com/t7uk729x2wsmnkhp8wyghxnusru5afk7").pathname;
  await page.route(`**${plaidWebhookHost}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        institution: "Chase",
        account_mask: "1234",
        account_name: "Checking",
      }),
    });
  });

  const failedCriticalRequests: string[] = [];
  const badCriticalResponses: Array<{ url: string; status: number }> = [];

  const isCriticalUrl = (url: string) => /(make\.com|\/applications\/|webhook|upload)/i.test(url);

  page.on("requestfailed", (request) => {
    if (isCriticalUrl(request.url())) {
      failedCriticalRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "failed"}`);
    }
  });

  page.on("response", (response) => {
    const url = response.url();
    const method = response.request().method();
    const status = response.status();
    if (method === "POST" && isCriticalUrl(url) && status >= 400) {
      badCriticalResponses.push({ url, status });
    }
  });

  await page.goto("/form", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Please enter a valid phone number")).toBeVisible();

  await page.locator('input[name="firstname"]').fill("E2E");
  await page.locator('input[name="lastname"]').fill("Prod");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="phone"]').fill("4155552671");

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
  await page.locator('textarea[name="additionalComments"]').fill(`Automated E2E production run ${tag}`);

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("heading", { name: "Bank Connection" })).toBeVisible();

  // Click Connect — test mode synthesizes a public_token, hook POSTs to the
  // real Make.com webhook from 24a, response populates Redux.
  const plaidWebhookResponse = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes("hook.us1.make.com") &&
      (response.request().postData() || "").includes("public_token"),
    { timeout: 30_000 }
  );
  await page.getByRole("button", { name: "Connect your bank account" }).click();
  const plaidResult = await plaidWebhookResponse;
  expect(plaidResult.status()).toBeLessThan(400);
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  const waitForUploadPost = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("hook.us1.make.com"),
      { timeout: 30_000 }
    );

  const uploadResponse1 = waitForUploadPost();
  await page.locator("#file-upload-ticketingCompanyReport").setInputFiles(fixturePath);
  const uploadResult1 = await uploadResponse1;
  expect(uploadResult1.status()).toBeLessThan(400);

  const uploadResponse2 = waitForUploadPost();
  await page.locator("#file-upload-financialStatements").setInputFiles(fixturePath);
  const uploadResult2 = await uploadResponse2;
  expect(uploadResult2.status()).toBeLessThan(400);

  const uploadResponse3 = waitForUploadPost();
  await page.locator("#file-upload-incorporationCertificate").setInputFiles(fixturePath);
  const uploadResult3 = await uploadResponse3;
  expect(uploadResult3.status()).toBeLessThan(400);

  await expect(page.getByText("e2e-upload.csv").first()).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL("**/submit-success", { timeout: 20_000 });
  await expect(page).toHaveURL(/\/submit-success$/);
  await expect(page.getByText("Application Submitted Successfully")).toBeVisible();

  expect(failedCriticalRequests, failedCriticalRequests.join("\n")).toEqual([]);
  expect(badCriticalResponses, JSON.stringify(badCriticalResponses, null, 2)).toEqual([]);
});
