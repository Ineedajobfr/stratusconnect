// Demo Bots Playwright Config - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: __dirname,
  reporter: [
    ['list'], 
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: process.env.STRATUS_URL || 'http://localhost:8080',
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    video: 'on',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { 
      name: 'chromium', 
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      } 
    }
  ],
  forbidOnly: true,
  retries: 1,
  workers: 2,
  timeout: 60000,
  expect: {
    timeout: 10000
  }
});
