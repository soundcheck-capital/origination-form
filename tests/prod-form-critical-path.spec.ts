import path from "node:path";
import { expect, test } from "@playwright/test";

// ─── helpers ────────────────────────────────────────────────────────────────

/** All upload selectors that must be filled in step 5. */
const REQUIRED_UPLOAD_SELECTORS = [
  // 1. Ticketing
  "#file-upload-ticketingCompanyReport",
  "#file-upload-futureEventSchedule",
  "#file-upload-venueAgreements",

  // 2. Finance – one file per document field
  "#file-upload-financialsYtdPL",
  "#file-upload-financialsYtdBS",
  "#file-upload-financialsYear1PL",
  "#file-upload-financialsYear1BS",
  "#file-upload-financialsYear2PL",
  "#file-upload-financialsYear2BS",

  // 3. Legal
  "#file-upload-incorporationCertificate",
] as const;

// ─── generic happy path ─────────────────────────────────────────────────────
//
// True E2E — every call hits the real Make.com webhooks except the Plaid
// exchange which requires a public_token from the Plaid Link iframe (a
// third-party UI we cannot drive in CI). The link-token call IS real.
//
// What's real:  link-token, file uploads, form submission
// What's mocked: exchange only (needs iframe-generated public_token)

test("generic happy path", async ({ page }) => {
  const now = Date.now();
  const tag = `E2E_PROD_${now}`;
  const email = "e2e@example.com";
  const fixturePath = path.resolve("tests/fixtures/e2e-upload.csv");

  // Bypass the Plaid Link *UI* only (third-party iframe, cannot be driven in
  // CI). The link-token fetch is real. The exchange is mocked because we
  // cannot obtain a real public_token without the iframe.
  await page.addInitScript(() => {
    (window as any).__PLAID_TEST_MODE__ = true;
  });

  // Mock only the exchange webhook — it will receive a synthetic public_token
  // that Make.com cannot process. Everything else hits the real webhooks.
  const exchangeWebhookUrl = process.env.REACT_APP_PLAID_WEBHOOK_URL || "";
  if (exchangeWebhookUrl) {
    const exchangePath = new URL(exchangeWebhookUrl).pathname;
    await page.route(`**${exchangePath}`, async (route) => {
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
  }

  const failedCriticalRequests: string[] = [];
  const badCriticalResponses: Array<{ url: string; status: number }> = [];

  const isCriticalUrl = (url: string) =>
    /(make\.com|\/applications\/|webhook|upload)/i.test(url);

  page.on("requestfailed", (request) => {
    if (isCriticalUrl(request.url())) {
      failedCriticalRequests.push(
        `${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "failed"}`
      );
    }
  });

  page.on("response", (response) => {
    const url = response.url();
    const status = response.status();
    if (response.request().method() === "POST" && isCriticalUrl(url) && status >= 400) {
      badCriticalResponses.push({ url, status });
    }
  });

  // ── Step 1 — Tell us about your business ──────────────────────────────────

  await page.goto("/form", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible();

  // Verify Next is blocked when required fields are empty
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Please enter a valid phone number")).toBeVisible();

  // Personal info
  await page.locator('input[name="firstname"]').fill("E2E");
  await page.locator('input[name="lastname"]').fill("Prod");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="phone"]').fill("4155552671");

  // Company info
  await page.locator('input[name="name"]').fill(tag);
  await page.locator('input[name="role"]').fill("Owner");
  await page.locator('select[name="clientType"]').selectOption("Promoter");
  await page.locator('select[name="yearsInBusiness"]').selectOption("2-5 years");
  await page.locator('input[name="socials"]').fill("https://example.com");
  await page.locator('select[name="memberOf"]').selectOption("None");

  // Ticketing info (now on step 1)
  await page.locator('input[name="nextYearEvents"]').fill("12");
  await page.locator('input[name="nextYearSales"]').fill("250000");
  await page.locator('select[name="paymentProcessing"]').selectOption("Ticketing Co");
  await page.locator('select[name="currentPartner"]').selectOption("Eventbrite");
  await page.locator('select[name="settlementPayout"]').selectOption("Weekly");

  // Underwriting dropdowns
  await page.locator('select[name="paymentProcessor"]').selectOption("Stripe");
  await page.locator('select[name="accountingSystem"]').selectOption("QuickBooks");

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 2 — Get funding (step 1→2 shows a 2s loading screen) ─────────────

  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible({
    timeout: 15_000,
  });
  await page.locator('select[name="timingOfFunding"]').selectOption("In the next month");
  await page.locator('select[name="useOfProceeds"]').selectOption("General Working Capital Needs");

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 3 — Business & Ownership ─────────────────────────────────────────

  await expect(page.locator('input[name="legalEntityName"]')).toBeVisible();

  await page.locator('input[name="legalEntityName"]').fill(`${tag} LLC`);
  await page.locator('input[name="dba"]').fill(tag);
  await page.locator('select[name="businessType"]').selectOption("Limited Liability Company (LLC)");
  await page.locator('select[name="stateOfIncorporation"]').selectOption("CA");
  await page.locator('input[name="companyAddressDisplay"]').fill(
    "123 Market St, San Francisco, CA 94105, USA"
  );
  await page.locator('input[name="ein"]').fill("12-3456789");
  await page.locator('input[name="owner0Name"]').fill("Jane Owner");
  await page.locator('input[name="owner0Percentage"]').fill("100");
  await page.locator('input[name="owner0Address"]').fill(
    "123 Main St, San Francisco, CA 94105, USA"
  );
  await page.locator('input[name="owner0BirthDate"]').fill("1988-01-01");
  await page.locator('textarea[name="industryReferences"]').fill(`Reference for ${tag}`);
  await page.locator('textarea[name="additionalComments"]').fill(
    `Automated E2E production run ${tag}`
  );

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 4 — Bank Connection ──────────────────────────────────────────────
  //
  // link-token: REAL call to Make.com (fires automatically on mount)
  // exchange:   MOCKED (needs a real public_token from the Plaid Link iframe)

  await expect(page.getByRole("heading", { name: "Bank Connection" })).toBeVisible();

  await page.getByRole("button", { name: "Connect your bank account" }).click();
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 5 — Diligence Files ──────────────────────────────────────────────

  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  // Validation gate: clicking Next without uploading must block progression
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  // Helper: trigger a file upload and wait for the real Make webhook POST
  const waitForUploadPost = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("hook.us1.make.com"),
      { timeout: 30_000 }
    );

  const uploadField = async (selector: string) => {
    const pending = waitForUploadPost();
    await page.locator(selector).setInputFiles(fixturePath);
    const result = await pending;
    expect(result.status()).toBeLessThan(400);
  };

  for (const selector of REQUIRED_UPLOAD_SELECTORS) {
    await uploadField(selector);
  }

  // Confirm at least one uploaded filename is visible on the page
  await expect(page.getByText("e2e-upload.csv").first()).toBeVisible();

  // Verify Next button is not disabled while navigating (no submit in flight)
  const nextButton = page.getByRole("button", { name: "Next" });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // ── Step 6 — Review & Submit ──────────────────────────────────────────────

  const submitButton = page.getByRole("button", { name: "Submit" });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await submitButton.click();

  // Submit button must become disabled immediately after click (anti double-submit)
  await expect(submitButton).toBeDisabled();

  // Wait for navigation to success page
  await page.waitForURL("**/submit-success", { timeout: 20_000 });
  await expect(page).toHaveURL(/\/submit-success$/);
  await expect(page.getByText("Application Submitted Successfully")).toBeVisible();

  // No critical HTTP errors or failed requests throughout the whole flow
  expect(failedCriticalRequests, failedCriticalRequests.join("\n")).toEqual([]);
  expect(badCriticalResponses, JSON.stringify(badCriticalResponses, null, 2)).toEqual([]);
});
