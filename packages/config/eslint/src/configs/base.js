import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { fixupConfigRules } from '@eslint/compat'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import * as regexpPlugin from 'eslint-plugin-regexp'
import pluginSecurity from 'eslint-plugin-security'
import turboPlugin from 'eslint-plugin-turbo'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { compat, defineConfig } from '../utils.js'

export const base = defineConfig(
	{
		ignores: [
			'.next',
			'.astro',
			'dist',
			'storybook-static',
			'vite.config.ts.*',
		],
	},

	// Base JS/TS configs
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	// Good to have extras
	comments.recommended,
	regexpPlugin.configs['flat/recommended'],
	pluginSecurity.configs.recommended,
	{
		plugins: {
			turbo: turboPlugin,
		},
	},

	// Tailwind plugin
	...fixupConfigRules(compat.extends('plugin:tailwindcss/recommended')),

	// Prettier config to disable conflicting rules
	prettierConfig,

	{
		files: ['**/*.cjs'],
		languageOptions: {
			sourceType: 'commonjs',
		},
	},

	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		settings: {
			tailwindcss: {
				callees: ['classnames', 'clsx', 'ctl', 'cn', 'cva'],
			},
		},
		rules: {
			...turboPlugin.configs.recommended.rules,
			'tailwindcss/no-custom-classname': 'off',
			// TS will already prevent unused variables during type generation, no need to have the linter check it
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{ assertionStyle: 'never' },
			],

			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'separate-type-imports' },
			],

			'@typescript-eslint/no-misused-promises': [
				'error',
				{ checksVoidReturn: { attributes: false } },
			],

			'@typescript-eslint/no-unnecessary-condition': [
				'error',
				{
					allowConstantLoopConditions: true,
				},
			],
		},
	},
)
