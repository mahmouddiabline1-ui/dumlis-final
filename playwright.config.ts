import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'https://dumlis-final.mahmouddiabline1.workers.dev',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'ar-EG',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  reporter: [['list'], ['html', { open: 'never' }]],
});
