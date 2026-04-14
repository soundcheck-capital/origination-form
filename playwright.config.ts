import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3001',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshots on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...process.env,
      REACT_APP_FORM_PASSWORD: process.env.REACT_APP_FORM_PASSWORD || '123456',
      REACT_APP_WEBHOOK_URL: process.env.REACT_APP_WEBHOOK_URL || 'https://webhook.test.com/test',
      REACT_APP_WEBHOOK_URL_FILES: process.env.REACT_APP_WEBHOOK_URL_FILES || 'https://hook.us1.make.com/test-upload',
      REACT_APP_HUBSPOT_COMPANY_ID: process.env.REACT_APP_HUBSPOT_COMPANY_ID || '12345',
      REACT_APP_HUBSPOT_DEAL_ID: process.env.REACT_APP_HUBSPOT_DEAL_ID || '67890',
      REACT_APP_HUBSPOT_CONTACT_ID: process.env.REACT_APP_HUBSPOT_CONTACT_ID || '11111',
      REACT_APP_HUBSPOT_DRIVE_ID: process.env.REACT_APP_HUBSPOT_DRIVE_ID || 'test-drive-id',
      REACT_APP_DISABLE_FORM_GUARD: 'true', // Désactiver le FormSubmissionGuard pendant les tests
    },
  },
});
