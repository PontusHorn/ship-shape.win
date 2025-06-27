import { defineConfig, devices, ViewportSize } from '@playwright/test';

const LARGE_DESKTOP_VIEWPORT: ViewportSize = { width: 1920, height: 1080 };

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'e2e',

	projects: [
		// Small computer screen
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		},

		// Larger computer screen
		{
			name: 'chromium (large)',
			use: { ...devices['Desktop Chrome'], viewport: LARGE_DESKTOP_VIEWPORT }
		}
	]
});
