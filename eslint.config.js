import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { 'no-undef': 'off' }
	},
	{
		files: ['src/**/*.ts', 'e2e/**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				parser: ts.parser
			}
		},
		rules: {
			'@typescript-eslint/no-floating-promises': 'error'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		},
		rules: {
			'svelte/no-useless-mustaches': ['error', { ignoreStringEscape: true }],
			// This is a reasonable warning, but in practice I trust myself to use it
			// safely and it's a pain to have to disable it everywhere, especially
			// since I need it to render comments for `html-validate`.
			'svelte/no-at-html-tags': 'off'
		}
	}
);
