import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

// Load .env so tests can read REACT_APP_* vars (e.g. webhook URLs) the same
// way react-scripts does at build time.
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  webServer: {
    command: "HOST=127.0.0.1 BROWSER=none npm run start",
    url: "http://127.0.0.1:3001/form",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://127.0.0.1:3001",
    headless: true,
    trace: "retain-on-failure",
    video: "off",
    screenshot: "only-on-failure",
  },
});
