import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 45000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3005',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3005',
    env: {
      PORT: '3005',
    },
    reuseExistingServer: false,
    timeout: 60000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});