import { configs, defineConfig } from '@monorepo/eslint'

export default defineConfig(
	{
		ignores: ['apps', 'packages'],
	},

	...configs.base,
)
