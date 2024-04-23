import {defineConfig, devices} from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  timeout: 45000,
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.bysisters.dk',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    /*{
      name: 'e2e sign up',
      testMatch: 'signup-for-business-account.spec.ts',
      use: {
        storageState: undefined,
        ...devices['Desktop Chrome'],
      },
    },*/
    {
      name: 'setup',
      testMatch: 'login.setup.ts',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'e2e tests logged in',
      dependencies: ['setup'],
      testMatch: '**/*loggedin.spec.ts',
      use: {
        storageState: 'auth.json',
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /*webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run tunnel',
      url: process.env.NGROK_URL,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],*/
});
