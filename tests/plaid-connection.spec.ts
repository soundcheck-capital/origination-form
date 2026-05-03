import { expect, test, request as playwrightRequest, Page } from "@playwright/test";

// These tests hit the LIVE Make.com webhooks for Plaid (24a + link_token).
// They stop right after the bank-connection step succeeds — no file uploads,
// no submit — so they don't trigger HubSpot/email side effects.

const PLAID_CLIENT_ID = process.env.REACT_APP_PLAID_CLIENT_ID || "";
const PLAID_SECRET = process.env.REACT_APP_PLAID_SECRET || "";
const PLAID_LINK_TOKEN_URL = process.env.REACT_APP_PLAID_LINK_TOKEN_URL || "";
const PLAID_WEBHOOK_URL = process.env.REACT_APP_PLAID_WEBHOOK_URL || "";

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
});

test("link_token webhook is reachable and the Connect button becomes enabled", async ({ page }) => {
  test.skip(!PLAID_LINK_TOKEN_URL, "REACT_APP_PLAID_LINK_TOKEN_URL not configured");

  // No __PLAID_TEST_MODE__ — we want the hook to actually call the live
  // link_token webhook and confirm that 24a (link_token side) is alive.
  const linkTokenResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url() === PLAID_LINK_TOKEN_URL,
    { timeout: 30_000 }
  );

  await fillStepsThroughBankConnection(page, `E2E_PLAID_LINKTOKEN_${Date.now()}`);

  const linkTokenResponse = await linkTokenResponsePromise;
  expect(linkTokenResponse.status()).toBeLessThan(400);
  const body = await linkTokenResponse.json();
  expect(body).toHaveProperty("link_token");
  expect(typeof body.link_token).toBe("string");
  expect(body.link_token.length).toBeGreaterThan(0);

  // Stop here — no submit, no file uploads, no notifications.
});

test("Plaid exchange webhook end-to-end with a real sandbox public_token", async ({ page }) => {
  test.skip(
    !PLAID_CLIENT_ID || !PLAID_SECRET || !PLAID_WEBHOOK_URL,
    "Plaid sandbox creds or exchange webhook URL not configured"
  );

  // Mint a real sandbox public_token server-side (no CORS from Playwright's
  // request context), then drive the UI in test mode using that token. The
  // hook POSTs it to the LIVE 24a exchange webhook, which exchanges it with
  // Plaid and returns real bank info.
  const apiContext = await playwrightRequest.newContext();
  const sandboxRes = await apiContext.post("https://sandbox.plaid.com/sandbox/public_token/create", {
    headers: { "Content-Type": "application/json" },
    data: {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      institution_id: "ins_109508", // First Platypus Bank (Plaid sandbox)
      initial_products: ["auth", "transactions"],
    },
  });
  expect(sandboxRes.status(), `Plaid sandbox responded ${sandboxRes.status()}`).toBe(200);
  const { public_token: realPublicToken } = await sandboxRes.json();
  expect(typeof realPublicToken).toBe("string");
  expect(realPublicToken).toMatch(/^public-sandbox-/);

  await page.addInitScript((token: string) => {
    (window as any).__PLAID_TEST_MODE__ = true;
    (window as any).__PLAID_TEST_PUBLIC_TOKEN__ = token;
  }, realPublicToken);

  await fillStepsThroughBankConnection(page, `E2E_PLAID_EXCHANGE_${Date.now()}`);

  // Click Connect — test mode fires onSuccess with the real public_token,
  // which the hook POSTs to the live exchange webhook.
  const exchangePromise = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url() === PLAID_WEBHOOK_URL,
    { timeout: 60_000 }
  );
  await page.getByRole("button", { name: "Connect your bank account" }).click();
  const exchangeResponse = await exchangePromise;

  expect(
    exchangeResponse.status(),
    `Exchange webhook responded ${exchangeResponse.status()}`
  ).toBeLessThan(400);
  const exchangeBody = await exchangeResponse.json();
  expect(exchangeBody).toHaveProperty("institution");
  expect(exchangeBody).toHaveProperty("account_mask");
  expect(exchangeBody).toHaveProperty("account_name");

  // The UI shows the real institution returned by Plaid sandbox.
  await expect(page.getByTestId("plaid-connected-card")).toBeVisible();
  await expect(page.getByText(exchangeBody.institution)).toBeVisible();

  // Stop here — no Next, no file uploads, no submit. No emails.
});
