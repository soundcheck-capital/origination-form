import path from "node:path";
import { expect, test, Page } from "@playwright/test";

const FIXTURE_PATH = path.resolve("tests/fixtures/e2e-upload.csv");

// Each test pre-injects __PLAID_TEST_MODE__ so the usePlaidConnection hook
// short-circuits Plaid Link (third-party iframe + popup, unreliable in CI)
// and immediately fires onSuccess with a sandbox-shaped public_token.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__PLAID_TEST_MODE__ = true;
  });
});

async function fillStepsThroughBankConnection(page: Page, tag: string) {
  const email = `${tag.toLowerCase()}@example.com`;

  await page.goto("/form", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Tell us about your business" })).toBeVisible();

  // Step 1
  await page.locator('input[name="firstname"]').fill("E2E");
  await page.locator('input[name="lastname"]').fill("Plaid");
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

  // Step 2
  await expect(page.locator('select[name="timingOfFunding"]')).toBeVisible();
  await page.locator('select[name="timingOfFunding"]').selectOption("In the next month");
  await page.locator('select[name="useOfProceeds"]').selectOption("General Working Capital Needs");
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3
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
  await page.locator('textarea[name="additionalComments"]').fill(`Plaid E2E ${tag}`);
  await page.getByRole("button", { name: "Next" }).click();

  // Step 4 — Bank Connection
  await expect(page.getByRole("heading", { name: "Bank Connection" })).toBeVisible();
}

test("Step 4 — Plaid is required to proceed", async ({ page }) => {
  await fillStepsThroughBankConnection(page, `E2E_PLAID_${Date.now()}`);

  // Clicking Next without connecting must NOT advance to Diligence Files.
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("plaid-required-error")).toBeVisible();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).not.toBeVisible();

  // Mock the Make.com webhook so we don't depend on the live scenario.
  await page.route("**/hook.us1.make.com/**", async (route) => {
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

  // Trigger the test-mode Plaid success and confirm the connected state.
  await page.getByRole("button", { name: "Connect your bank account" }).click();
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();

  // Now Next must advance to step 5 (Diligence Files).
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();
});

test("public_token est envoyé au webhook Make.com et la réponse alimente l'UI", async ({ page }) => {
  await fillStepsThroughBankConnection(page, `E2E_PLAID_TOKEN_${Date.now()}`);

  let capturedBody: any = null;
  await page.route("**/hook.us1.make.com/**", async (route) => {
    capturedBody = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        institution: "Wells Fargo",
        account_mask: "5678",
        account_name: "Business Checking",
      }),
    });
  });

  await page.getByRole("button", { name: "Connect your bank account" }).click();
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();

  expect(capturedBody).not.toBeNull();
  expect(capturedBody).toHaveProperty("public_token");
  expect(typeof capturedBody.public_token).toBe("string");
  expect(capturedBody.public_token.length).toBeGreaterThan(0);

  await expect(page.getByText("Wells Fargo")).toBeVisible();
  await expect(page.getByText(/5678/)).toBeVisible();
});

test("Bank info apparaît dans le Summary Step 6", async ({ page }) => {
  const tag = `E2E_PLAID_SUMMARY_${Date.now()}`;
  await fillStepsThroughBankConnection(page, tag);

  await page.route("**/hook.us1.make.com/**", async (route) => {
    const raw = route.request().postData() || "";
    let isPlaidExchange = false;
    try {
      const parsed = JSON.parse(raw);
      isPlaidExchange = !!parsed.public_token;
    } catch {
      // Non-JSON bodies (FormData file uploads) — let them through with a 200.
    }
    if (isPlaidExchange) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          institution: "Bank of America",
          account_mask: "9999",
          account_name: "Savings",
        }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    }
  });

  await page.getByRole("button", { name: "Connect your bank account" }).click();
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();

  // Step 5 — Diligence Files. Upload the three required fixture files,
  // waiting for each upload's POST so the Next button leaves the saving state.
  await expect(page.locator("#file-upload-ticketingCompanyReport")).toBeVisible();

  const waitForUploadPost = () =>
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("hook.us1.make.com"),
      { timeout: 15_000 }
    );

  let pending = waitForUploadPost();
  await page.locator("#file-upload-ticketingCompanyReport").setInputFiles(FIXTURE_PATH);
  await pending;

  pending = waitForUploadPost();
  await page.locator("#file-upload-financialStatements").setInputFiles(FIXTURE_PATH);
  await pending;

  pending = waitForUploadPost();
  await page.locator("#file-upload-incorporationCertificate").setInputFiles(FIXTURE_PATH);
  await pending;

  await expect(page.getByText("e2e-upload.csv").first()).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();

  // Step 6 — Review & Submit. Bank info must be visible.
  await expect(page.getByRole("heading", { name: "Review & Submit" })).toBeVisible();
  await expect(page.getByText("Bank of America")).toBeVisible();
  await expect(page.getByText(/9999/)).toBeVisible();
});
