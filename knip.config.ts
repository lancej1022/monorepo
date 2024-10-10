import type { KnipConfig } from 'knip'

export default {
	entry: [
		'{index,main,cli}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
		'src/{index,main,cli}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}',
		'./scripts/*.ts',
	],
	eslint: {
		config: [
			'.eslintrc',
			'.eslintrc.{js,json,cjs}',
			'.eslintrc.{yml,yaml}',
			'package.json',
			'astro.js',
			'next.js',
			'react.js',
			'storybook.js',
		],
		entry: ['eslint.config.{js,cjs,mjs}'],
	},
	ignore: [
		'!packages/config/**', // attempts to exclude all the config packages. Not sure if this is actually working though
		'turbo/generators/**',
		'**/dist/**',
		'packages/sedona-react/src/Theme/**',
		'packages/sedona-react/src/Sprites/**',
		'packages/softphone/src/redux/slice.ts', // contains a TS export that is required for ensuring passing TS builds
		'packages/ncx-admin/src/components/EmailSignatureComposer/EmailSignatureComposer.tsx', // TODO: this actually shouldnt be ignored
		'packages/ncx-admin/src/views/UserManagement/UserManagementPanel/util.ts', // TODO: this actually shouldnt be ignored
		'packages/softphone/src/components/ActiveCall/ParticipantsList.tsx', // TODO: this actually shouldnt be ignored
		'packages/softphone/src/components/Dialer/DigitList.tsx', // TODO: this actually shouldnt be ignored
		'packages/softphone/src/hooks/useMakeCall.ts', // TODO: this actually shouldnt be ignored
		'**/setupTests.ts', // knip cannot tell this is used by vitest
		'**/testHelpers/**', // knip cannot tell this is used by vitest
		'**/mockServiceWorker.*', // knip struggles to tell this is used for mocking
		'**/postcss.config.*', // knip struggles to tell this is used for tailwind
	],
	ignoreDependencies: [
		'@storybook/*', // Knip cant detect the storybook usage in NUI
		'@turbo/gen', // used by the turbo generators config
	],
	vitest: {
		config: [
			'vite*.config.{js,mjs,ts,cjs,mts,cts}',
			'vite.{workspace,projects}.{ts,js,json}',
		],
		entry: ['**/*.{bench,test,test-d,spec}.?(c|m)[jt]s?(x)'],
	},
} satisfies KnipConfig
