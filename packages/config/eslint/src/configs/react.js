import { fixupConfigRules } from '@eslint/compat'
import pluginRouter from '@tanstack/eslint-plugin-router'

import { compat, defineConfig } from '../utils.js'

export const react = defineConfig(
	...fixupConfigRules(compat.extends('plugin:react/recommended')),
	...fixupConfigRules(compat.extends('plugin:react-hooks/recommended')),
	...fixupConfigRules(compat.extends('plugin:jsx-a11y/strict')),
	...pluginRouter.configs['flat/recommended'],

	{
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/no-unescaped-entities': 'off',
			// STYLISTIC
			'react/jsx-sort-props': 'error',
			'react/jsx-curly-brace-presence': ['error', 'never'],
		},
	},
)
