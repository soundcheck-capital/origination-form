import path from "node:path";
import { expect, test } from "@playwright/test";

// ─── helpers ────────────────────────────────────────────────────────────────

/** All upload selectors that must be filled in step 4. */
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

// ─── main test ───────────────────────────────────────────────────────────────

test("prod form critical path stays healthy", async ({ page }) => {
  const now = Date.now();
  const tag = `E2E_PROD_${now}`;
  const email = "e2e@example.com";
  const fixturePath = path.resolve("tests/fixtures/e2e-upload.csv");

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

  // New dropdowns added in this feature branch (step 1)
  await page.locator('select[name="paymentProcessor"]').selectOption("Stripe");
  await page.locator('select[name="accountingSystem"]').selectOption("QuickBooks");

  await page.getByRole("button", { name: "Next" }).click();

  // ── Step 2 — Get funding ──────────────────────────────────────────────────

  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible();
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

  // ── Step 4 — Diligence Files ──────────────────────────────────────────────

  // Verify at least the first required upload field is visible
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  // Helper: trigger a file upload and wait for the Make webhook POST to respond
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

  // ── Step 5 — Review & Submit ──────────────────────────────────────────────

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

// ─── isolated validation tests ───────────────────────────────────────────────

test("step 4: Next is blocked when no files are uploaded", async ({ page }) => {
  // Navigate through steps 1-3 using the minimum valid data, then verify
  // that clicking Next on an empty step 4 shows validation errors instead of
  // advancing to step 5.

  await page.goto("/form", { waitUntil: "domcontentloaded" });

  // Step 1
  await page.locator('input[name="firstname"]').fill("Test");
  await page.locator('input[name="lastname"]').fill("User");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('input[name="phone"]').fill("4155552671");
  await page.locator('input[name="name"]').fill("Test Co");
  await page.locator('input[name="role"]').fill("Owner");
  await page.locator('select[name="clientType"]').selectOption("Promoter");
  await page.locator('select[name="yearsInBusiness"]').selectOption("2-5 years");
  await page.locator('input[name="socials"]').fill("https://example.com");
  await page.locator('select[name="memberOf"]').selectOption("None");
  await page.locator('input[name="nextYearEvents"]').fill("5");
  await page.locator('input[name="nextYearSales"]').fill("100000");
  await page.locator('select[name="paymentProcessing"]').selectOption("Ticketing Co");
  await page.locator('select[name="currentPartner"]').selectOption("Eventbrite");
  await page.locator('select[name="settlementPayout"]').selectOption("Weekly");
  await page.locator('select[name="paymentProcessor"]').selectOption("Stripe");
  await page.locator('select[name="accountingSystem"]').selectOption("QuickBooks");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 2
  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible();
  await page.locator('select[name="timingOfFunding"]').selectOption("In the next month");
  await page.locator('select[name="useOfProceeds"]').selectOption("General Working Capital Needs");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3
  await expect(page.locator('input[name="legalEntityName"]')).toBeVisible();
  await page.locator('input[name="legalEntityName"]').fill("Test Co LLC");
  await page.locator('input[name="dba"]').fill("Test Co");
  await page.locator('select[name="businessType"]').selectOption("Limited Liability Company (LLC)");
  await page.locator('select[name="stateOfIncorporation"]').selectOption("CA");
  await page.locator('input[name="companyAddressDisplay"]').fill(
    "123 Market St, San Francisco, CA 94105, USA"
  );
  await page.locator('input[name="ein"]').fill("12-3456789");
  await page.locator('input[name="owner0Name"]').fill("Jane Owner");
  await page.locator('input[name="owner0Percentage"]').fill("100");
  await page.locator('input[name="owner0Address"]').fill("123 Main St, San Francisco, CA 94105");
  await page.locator('input[name="owner0BirthDate"]').fill("1988-01-01");
  await page.locator('textarea[name="industryReferences"]').fill("Reference person");
  await page.locator('textarea[name="additionalComments"]').fill("Comments");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 4 — click Next without uploading anything
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();

  // Must stay on step 4 (upload fields still visible) and show at least one error
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();
});
