import { defineConfig, devices, ViewportSize } from '@playwright/test';

const LARGE_DESKTOP_VIEWPORT: ViewportSize = { width: 1920, height: 1080 };
const SMALL_MOBILE_VIEWPORT: ViewportSize = { width: 320, height: 600 };

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
		},

		// Mobile
		{
			name: 'chromium (mobile)',
			use: { ...devices['Mobile Chrome'], viewport: SMALL_MOBILE_VIEWPORT }
		},
		{
			name: 'firefox (mobile)',
			use: { ...devices['Mobile Firefox'], viewport: SMALL_MOBILE_VIEWPORT }
		},
		{
			name: 'webkit (mobile)',
			use: { ...devices['Mobile Safari'], viewport: SMALL_MOBILE_VIEWPORT }
		}
	]
});
