import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  fullyParallel: true, // Run all tests in parallel
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
