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
			// https://www.totaltypescript.com/react-apps-ts-performance -- `interface` is more performant during type-checking compared to `type`, especially in large codebases
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

			// this rule improves tree-shaking by ensuring types are consistently imported in a way that allows them to be removed from production bundles
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					disallowTypeAnnotations: false,
					fixStyle: 'inline-type-imports',
					prefer: 'type-imports',
				},
			],
			// Explicit type annotations add unnecessary verbosity to code and in some cases can prevent TypeScript from inferring a more specific literal type (e.g. `10` instead `number`)
			'@typescript-eslint/no-inferrable-types': 'error',

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

			'@eslint-community/eslint-comments/require-description': [
				'error',
				{ ignore: ['eslint-enable'] },
			],
			'no-console': ['error', { allow: ['error'] }],
			// improves perf and reduces bugs by ensuring devs dont write code where the operators behave differently from the way the developer thought they would
			'no-constant-binary-expression': 'error',
		},
	},
)
