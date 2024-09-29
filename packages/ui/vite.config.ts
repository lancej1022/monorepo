import { buildConfig, mergeConfig, reactConfig } from '@monorepo/vite'

import pkg from './package.json'

export default mergeConfig(
	reactConfig,
	buildConfig({
		lib: {
			entry: ['./src/primitives/*/index.tsx', './src/utils/cn.ts'],
		},
		external: {
			externalizeDeps: Object.keys(pkg.dependencies),
		},
		dts: {
			exclude: ['src/storybook-utils', '**/*.stories.tsx'],
		},
	}),
)
