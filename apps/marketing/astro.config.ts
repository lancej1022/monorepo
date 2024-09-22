import 'dotenv/config'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
// import sentry from '@sentry/astro'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [
		mdx(),
		sitemap(),
		tailwind({ applyBaseStyles: false }),
		react(),
		// sentry({
		// 	dsn: String(import.meta.env.PUBLIC_SENTRY_DSN),
		// 	sourceMapsUploadOptions: {
		// 		org: String(import.meta.env.SENTRY_ORG),
		// 		project: String(import.meta.env.SENTRY_PROJECT),
		// 		authToken: String(import.meta.env.SENTRY_AUTH_TOKEN),
		// 	},
		// }),
	],
})
