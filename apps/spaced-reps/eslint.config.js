import { configs, defineConfig } from '@monorepo/eslint'

export default defineConfig(...configs.base, ...configs.react, {
	ignores: ['src/routeTree.gen.ts'],
})
