import path from "node:path";
import { expect, test } from "@playwright/test";

// ─── helpers ────────────────────────────────────────────────────────────────

/** All upload selectors that must be filled in step 5. */
const REQUIRED_UPLOAD_SELECTORS = [
  "#file-upload-ticketingCompanyReport",
  "#file-upload-futureEventSchedule",
  "#file-upload-venueAgreements",
  "#file-upload-financialsYtdPL",
  "#file-upload-financialsYtdBS",
  "#file-upload-financialsYear1PL",
  "#file-upload-financialsYear1BS",
  "#file-upload-financialsYear2PL",
  "#file-upload-financialsYear2BS",
  "#file-upload-incorporationCertificate",
] as const;

// ─── custom link happy path ─────────────────────────────────────────────────
//
// True E2E for the password-protected custom company link flow.
// A client accesses the form via ?companyName=..., enters a real password
// verified by the Make.com → HubSpot webhook, then fills the form with the
// Company Name field locked (read-only).
//
// What's real:  password verification, link-token, file uploads, form submission
// What's mocked: Plaid exchange only (needs iframe-generated public_token)
//
// Requires env vars: E2E_COMPANY_NAME, E2E_COMPANY_PASSWORD

test("custom link happy path – password + locked company name", async ({ page }) => {
  const companyName = process.env.E2E_COMPANY_NAME;
  const companyPassword = process.env.E2E_COMPANY_PASSWORD;

  if (!companyName || !companyPassword) {
    test.skip(!companyName || !companyPassword, "E2E_COMPANY_NAME and E2E_COMPANY_PASSWORD required");
    return;
  }

  const now = Date.now();
  const fixturePath = path.resolve("tests/fixtures/e2e-upload.csv");

  // Bypass Plaid Link UI (third-party iframe)
  await page.addInitScript(() => {
    (window as any).__PLAID_TEST_MODE__ = true;
  });

  // Mock only the Plaid exchange webhook
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

  // ── Password screen ──────────────────────────────────────────────────────

  await page.goto(`/form?companyName=${encodeURIComponent(companyName)}`, {
    waitUntil: "domcontentloaded",
  });

  // Verify password screen is shown
  await expect(page.getByRole("heading", { name: "Access Required" })).toBeVisible();

  // Enter password and submit (real call to Make.com → HubSpot)
  await page.locator('input[name="password"]').fill(companyPassword);
  await page.getByRole("button", { name: "Access Form" }).click();

  // Wait for navigation after password validation
  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible({
    timeout: 15_000,
  });

  // Verify query params are preserved in URL after password
  expect(page.url()).toContain(`companyName=${encodeURIComponent(companyName)}`);

  // ── Step 1 — Company Name locked ─────────────────────────────────────────

  // Verify Company Name field is disabled and pre-filled
  const companyNameInput = page.locator('input[name="name"]');
  await expect(companyNameInput).toBeDisabled();
  await expect(companyNameInput).toHaveValue(companyName);

  // Verify helper text
  await expect(page.getByText("Company name set from your invitation link")).toBeVisible();

  // Fill remaining required fields (Company Name is already set)
  await page.locator('input[name="firstname"]').fill("E2E");
  await page.locator('input[name="lastname"]').fill("CustomLink");
  await page.locator('input[name="email"]').fill("e2e-custom@example.com");
  await page.locator('input[name="phone"]').fill("4155552672");
  await page.locator('input[name="role"]').fill("Owner");
  await page.locator('select[name="clientType"]').selectOption("Promoter");
  await page.locator('select[name="yearsInBusiness"]').selectOption("2-5 years");
  await page.locator('input[name="socials"]').fill("https://example.com");
  await page.locator('select[name="memberOf"]').selectOption("None");

  await page.locator('input[name="nextYearEvents"]').fill("10");
  await page.locator('input[name="nextYearSales"]').fill("200000");
  await page.locator('select[name="paymentProcessing"]').selectOption("Ticketing Co");
  await page.locator('select[name="currentPartner"]').selectOption("Eventbrite");
  await page.locator('select[name="settlementPayout"]').selectOption("Weekly");
  await page.locator('select[name="paymentProcessor"]').selectOption("Stripe");
  await page.locator('select[name="accountingSystem"]').selectOption("QuickBooks");

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 2 — Get funding ─────────────────────────────────────────────────

  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible();
  await page.locator('select[name="timingOfFunding"]').selectOption("In the next month");
  await page.locator('select[name="useOfProceeds"]').selectOption("General Working Capital Needs");

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 3 — Business & Ownership ────────────────────────────────────────
  // DBA and Legal Business Name should be pre-filled but editable

  await expect(page.locator('input[name="legalEntityName"]')).toBeVisible();

  const dbaInput = page.locator('input[name="dba"]');
  await expect(dbaInput).toHaveValue(companyName);
  await expect(dbaInput).toBeEnabled(); // DBA stays editable

  await page.locator('input[name="legalEntityName"]').fill(`${companyName} LLC`);
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
  await page.locator('textarea[name="industryReferences"]').fill(`Reference for ${companyName}`);
  await page.locator('textarea[name="additionalComments"]').fill(
    `Automated E2E custom link run ${now}`
  );

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 4 — Bank Connection ─────────────────────────────────────────────

  await expect(page.getByRole("heading", { name: "Bank Connection" })).toBeVisible();
  await page.getByRole("button", { name: "Connect your bank account" }).click();
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 5 — Diligence Files ─────────────────────────────────────────────

  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

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

  await expect(page.getByText("e2e-upload.csv").first()).toBeVisible();

  const nextButton = page.getByRole("button", { name: "Next" });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // ── Step 6 — Review & Submit ─────────────────────────────────────────────

  const submitButton = page.getByRole("button", { name: "Submit" });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await submitButton.click();
  await expect(submitButton).toBeDisabled();

  await page.waitForURL("**/submit-success", { timeout: 20_000 });
  await expect(page).toHaveURL(/\/submit-success$/);
  await expect(page.getByText("Application Submitted Successfully")).toBeVisible();

  // No critical HTTP errors throughout the flow
  expect(failedCriticalRequests, failedCriticalRequests.join("\n")).toEqual([]);
  expect(badCriticalResponses, JSON.stringify(badCriticalResponses, null, 2)).toEqual([]);
});
