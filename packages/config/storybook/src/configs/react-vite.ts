import { type StorybookConfig } from '@storybook/react-vite'

import { getAbsolutePath } from '@monorepo/utils/filesystem'

const config = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		// getAbsolutePath('@storybook/addon-links'),
		{
			name: getAbsolutePath('@storybook/addon-essentials'),
			options: {
				backgrounds: false,
			},
		},
		getAbsolutePath('@storybook/addon-onboarding'),
		getAbsolutePath('@storybook/addon-interactions'),
		getAbsolutePath('@storybook/addon-themes'),
		getAbsolutePath('@storybook/addon-a11y'),
	],
	framework: {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Not 100% sure but I think the type cast here is required
		name: getAbsolutePath('@storybook/react-vite') as '@storybook/react-vite',
		options: {
			strictMode: true,
		},
	},
	staticDirs: [getAbsolutePath('@monorepo/assets')],
	docs: {
		autodocs: 'tag',
	},
} satisfies StorybookConfig

export default config
