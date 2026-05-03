import { expect, test, Page } from "@playwright/test";

// These tests stop right after the bank-connection step — no file uploads,
// no submit — so they don't trigger HubSpot/email side effects. Tests that
// hit live webhooks call them directly (no page.route() mocks) so a broken
// webhook causes a real test failure.

const PLAID_LINK_TOKEN_URL = process.env.REACT_APP_PLAID_LINK_TOKEN_URL || "";

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

test("Step 4 — Plaid is required to proceed (validation only, no webhook)", async ({ page }) => {
  await fillStepsThroughBankConnection(page, `E2E_PLAID_BLOCK_${Date.now()}`);

  // Click Next without connecting — must NOT advance to Diligence Files.
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByTestId("plaid-required-error")).toBeVisible();
  await expect(page.locator("#file-upload-ticketingCompanyReport")).not.toBeVisible();

  // Stop here — no Plaid connection attempted, no webhook traffic, no emails.
});

test("link_token webhook returns a valid token and unlocks the Connect button", async ({ page }) => {
  test.skip(!PLAID_LINK_TOKEN_URL, "REACT_APP_PLAID_LINK_TOKEN_URL not configured");

  // Catch the live POST to the Make.com link_token webhook that the hook
  // fires when the bank-connection step mounts. No page.route() mock — if
  // the webhook is broken, this fails.
  const linkTokenResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url() === PLAID_LINK_TOKEN_URL,
    { timeout: 30_000 }
  );

  await fillStepsThroughBankConnection(page, `E2E_PLAID_LINKTOKEN_${Date.now()}`);

  const linkTokenResponse = await linkTokenResponsePromise;
  expect(
    linkTokenResponse.status(),
    `link_token webhook responded ${linkTokenResponse.status()}`
  ).toBeLessThan(400);
  const body = await linkTokenResponse.json();
  expect(body).toHaveProperty("link_token");
  expect(typeof body.link_token).toBe("string");
  expect(body.link_token.length).toBeGreaterThan(0);

  // Once the link_token has loaded, react-plaid-link reports ready and the
  // Connect button becomes enabled. Asserting this confirms the response was
  // wired into usePlaidConnection correctly.
  await expect(page.getByRole("button", { name: "Connect your bank account" })).toBeEnabled({
    timeout: 15_000,
  });

  // Stop here — no Plaid Link UI driven, no exchange webhook hit, no submit.
});
