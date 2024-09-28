import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: ['index.html', '/src/dom-evaluator.ts'],
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
			onwarn(warning, defaultHandler) {
				if (warning.code === 'SOURCEMAP_ERROR') {
					return
				}

				defaultHandler(warning)
			},
		},
		minify: false,
		sourcemap: true,
	},
	plugins: [TanStackRouterVite({}), react()],
})
