import { configs, defineConfig } from '@monorepo/eslint'

export default defineConfig(
  ...configs.base,
  ...configs.next,
  ...configs.playwright,
)
