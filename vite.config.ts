import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		projects: [
			{
				extends: 'vite.config.ts',
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					storybookTest({ configDir: path.join(dirname, '.storybook') })
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					setupFiles: ['.storybook/vitest.setup.ts']
				}
			},
			{
				extends: 'vite.config.ts',
				test: {
					name: 'unit',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.stories.{js,ts,svelte}']
				}
			}
		]
	}
});
