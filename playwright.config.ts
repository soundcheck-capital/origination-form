import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "HOST=127.0.0.1 BROWSER=none npm run start",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      REACT_APP_CHECK_PASSWORD_CUSTOMER_LINK_WEBHOOK: "https://webhook.test.com/check-password",
      REACT_APP_SEND_SUMMARY: "https://webhook.test.com/summary",
      REACT_APP_WEBHOOK_URL: "https://webhook.test.com/test",
      REACT_APP_WEBHOOK_URL_FILES: "https://webhook.test.com/files",
      REACT_APP_HUBSPOT_COMPANY_ID: "12345",
      REACT_APP_HUBSPOT_DEAL_ID: "67890",
      REACT_APP_HUBSPOT_CONTACT_ID: "11111",
      REACT_APP_HUBSPOT_DRIVE_ID: "test-drive-id",
    },
  },
  use: {
    baseURL: "http://127.0.0.1:3001",
    headless: true,
    trace: "retain-on-failure",
    video: "off",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
