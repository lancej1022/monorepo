// vite.config.ts

import {
	buildConfig,
	mergeConfig,
	reactConfig,
} from 'file:///Users/lancejeffers/code/monorepo/packages/config/vite/dist/index.js'

// package.json
var package_default = {
	name: '@monorepo/ui',
	version: '0.4.3',
	private: true,
	description: 'monorepo UI Design System Components Library',
	license: 'MIT',
	author: 'monorepo',
	sideEffects: false,
	type: 'module',
	exports: {
		'./*': {
			types: './dist/primitives/*/index.d.ts',
			require: './dist/primitives/*/index.cjs',
			default: './dist/primitives/*/index.js',
		},
		'./cn': {
			types: './dist/utils/cn.d.ts',
			require: './dist/utils/cn.cjs',
			default: './dist/utils/cn.js',
		},
	},
	files: ['dist'],
	scripts: {
		build: 'vite build',
		'build-storybook': 'storybook build',
		clean: ' rm -rf dist storybook-static *.tsbuildinfo',
		dev: 'vite build -w',
		lint: 'eslint .  --max-warnings 0',
		storybook: 'storybook dev -p 6006 --no-open',
		'test-storybook': 'test-storybook',
		typecheck: 'tsc',
	},
	dependencies: {
		'@hookform/resolvers': '^3.9.0',
		'@radix-ui/react-accordion': '^1.2.0',
		'@radix-ui/react-alert-dialog': '^1.1.1',
		'@radix-ui/react-aspect-ratio': '^1.1.0',
		'@radix-ui/react-avatar': '^1.1.0',
		'@radix-ui/react-checkbox': '^1.1.1',
		'@radix-ui/react-collapsible': '^1.1.0',
		'@radix-ui/react-context': '1.1.0',
		'@radix-ui/react-context-menu': '^2.2.1',
		'@radix-ui/react-dialog': '^1.1.1',
		'@radix-ui/react-dropdown-menu': '^2.1.1',
		'@radix-ui/react-hover-card': '^1.1.1',
		'@radix-ui/react-icons': '^1.3.0',
		'@radix-ui/react-label': '^2.1.0',
		'@radix-ui/react-menubar': '^1.1.1',
		'@radix-ui/react-navigation-menu': '^1.2.0',
		'@radix-ui/react-popover': '^1.1.1',
		'@radix-ui/react-progress': '^1.1.0',
		'@radix-ui/react-radio-group': '^1.2.0',
		'@radix-ui/react-scroll-area': '^1.1.0',
		'@radix-ui/react-select': '^2.1.1',
		'@radix-ui/react-separator': '^1.1.0',
		'@radix-ui/react-slider': '^1.2.0',
		'@radix-ui/react-slot': '^1.1.0',
		'@radix-ui/react-switch': '^1.1.0',
		'@radix-ui/react-toast': '^1.2.1',
		'@radix-ui/react-toggle': '^1.1.0',
		'@radix-ui/react-toggle-group': '^1.1.0',
		'@radix-ui/react-tooltip': '^1.1.2',
		'class-variance-authority': '^0.7.0',
		clsx: '^2.1.1',
		cmdk: '^1.0.0',
		'date-fns': '^3.6.0',
		'embla-carousel-autoplay': '^8.2.0',
		'embla-carousel-react': '^8.2.0',
		'input-otp': '^1.2.4',
		react: '^18.3.1',
		'react-day-picker': '^9.0.8',
		'react-dom': '^18.3.1',
		'react-hook-form': '^7.53.0',
		'react-resizable-panels': '^2.1.2',
		'tailwind-merge': '^2.5.2',
		vaul: '^0.9.1',
		zod: '^3.23.8',
	},
	devDependencies: {
		'@monorepo/assets': 'workspace:^',
		'@monorepo/eslint': 'workspace:^',
		'@monorepo/storybook': 'workspace:^',
		'@monorepo/tailwind': 'workspace:^',
		'@monorepo/tsconfig': 'workspace:^',
		'@monorepo/vite': 'workspace:^',
		'@storybook/react': '^8.2.9',
		'@storybook/test': '^8.2.9',
		'@types/react': '^18.3.5',
		'@types/react-dom': '^18.3.0',
		autoprefixer: '^10.4.20',
		globby: '^14.0.2',
		playwright: '^1.46.1',
		postcss: '^8.4.44',
		'rollup-plugin-preserve-directives': '^0.4.0',
		storybook: '^8.2.9',
		tailwindcss: '^3.4.10',
		vite: '^5.4.2',
		'vite-plugin-dts': '^4.1.0',
		'vite-plugin-external': '^4.3.1',
	},
}

// vite.config.ts
var vite_config_default = mergeConfig(
	// Vite config to support React.
	reactConfig,
	/**
	 * This allows us to use vite to also bundle this package using the `vite build` script, it will also emit TS declaration files using the dts plugin.
	 */
	buildConfig({
		lib: {
			entry: ['./src/primitives/*/index.tsx', './src/utils/cn.ts'],
		},
		external: {
			externalizeDeps: Object.keys(package_default.dependencies),
		},
		dts: {
			exclude: ['src/storybook-utils', '**/*.stories.tsx'],
		},
	}),
)
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2xhbmNlamVmZmVycy9jb2RlL21vbm9yZXBvL3BhY2thZ2VzL3VpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGFuY2VqZWZmZXJzL2NvZGUvbW9ub3JlcG8vcGFja2FnZXMvdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2xhbmNlamVmZmVycy9jb2RlL21vbm9yZXBvL3BhY2thZ2VzL3VpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgYnVpbGRDb25maWcsIG1lcmdlQ29uZmlnLCByZWFjdENvbmZpZyB9IGZyb20gJ0Btb25vcmVwby92aXRlJ1xuXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcbiAgLy8gVml0ZSBjb25maWcgdG8gc3VwcG9ydCBSZWFjdC5cbiAgcmVhY3RDb25maWcsXG4gIC8qKlxuICAgKiBUaGlzIGFsbG93cyB1cyB0byB1c2Ugdml0ZSB0byBhbHNvIGJ1bmRsZSB0aGlzIHBhY2thZ2UgdXNpbmcgdGhlIGB2aXRlIGJ1aWxkYCBzY3JpcHQsIGl0IHdpbGwgYWxzbyBlbWl0IFRTIGRlY2xhcmF0aW9uIGZpbGVzIHVzaW5nIHRoZSBkdHMgcGx1Z2luLlxuICAgKi9cbiAgYnVpbGRDb25maWcoe1xuICAgIGxpYjoge1xuICAgICAgZW50cnk6IFsnLi9zcmMvcHJpbWl0aXZlcy8qL2luZGV4LnRzeCcsICcuL3NyYy91dGlscy9jbi50cyddLFxuICAgIH0sXG4gICAgZXh0ZXJuYWw6IHtcbiAgICAgIGV4dGVybmFsaXplRGVwczogT2JqZWN0LmtleXMocGtnLmRlcGVuZGVuY2llcyksXG4gICAgfSxcbiAgICBkdHM6IHtcbiAgICAgIGV4Y2x1ZGU6IFsnc3JjL3N0b3J5Ym9vay11dGlscycsICcqKi8qLnN0b3JpZXMudHN4J10sXG4gICAgfSxcbiAgfSksXG4pXG4iLCAie1xuXHRcIm5hbWVcIjogXCJAbW9ub3JlcG8vdWlcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMC40LjNcIixcblx0XCJwcml2YXRlXCI6IHRydWUsXG5cdFwiZGVzY3JpcHRpb25cIjogXCJtb25vcmVwbyBVSSBEZXNpZ24gU3lzdGVtIENvbXBvbmVudHMgTGlicmFyeVwiLFxuXHRcImxpY2Vuc2VcIjogXCJNSVRcIixcblx0XCJhdXRob3JcIjogXCJtb25vcmVwb1wiLFxuXHRcInNpZGVFZmZlY3RzXCI6IGZhbHNlLFxuXHRcInR5cGVcIjogXCJtb2R1bGVcIixcblx0XCJleHBvcnRzXCI6IHtcblx0XHRcIi4vKlwiOiB7XG5cdFx0XHRcInR5cGVzXCI6IFwiLi9kaXN0L3ByaW1pdGl2ZXMvKi9pbmRleC5kLnRzXCIsXG5cdFx0XHRcInJlcXVpcmVcIjogXCIuL2Rpc3QvcHJpbWl0aXZlcy8qL2luZGV4LmNqc1wiLFxuXHRcdFx0XCJkZWZhdWx0XCI6IFwiLi9kaXN0L3ByaW1pdGl2ZXMvKi9pbmRleC5qc1wiXG5cdFx0fSxcblx0XHRcIi4vY25cIjoge1xuXHRcdFx0XCJ0eXBlc1wiOiBcIi4vZGlzdC91dGlscy9jbi5kLnRzXCIsXG5cdFx0XHRcInJlcXVpcmVcIjogXCIuL2Rpc3QvdXRpbHMvY24uY2pzXCIsXG5cdFx0XHRcImRlZmF1bHRcIjogXCIuL2Rpc3QvdXRpbHMvY24uanNcIlxuXHRcdH1cblx0fSxcblx0XCJmaWxlc1wiOiBbXG5cdFx0XCJkaXN0XCJcblx0XSxcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxuXHRcdFwiYnVpbGQtc3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGJ1aWxkXCIsXG5cdFx0XCJjbGVhblwiOiBcImJ1biBydW4gcm0gLXJmIGRpc3Qgc3Rvcnlib29rLXN0YXRpYyAqLnRzYnVpbGRpbmZvXCIsXG5cdFx0XCJkZXZcIjogXCJ2aXRlIGJ1aWxkIC13XCIsXG5cdFx0XCJsaW50XCI6IFwiZXNsaW50IC4gIC0tbWF4LXdhcm5pbmdzIDBcIixcblx0XHRcInN0b3J5Ym9va1wiOiBcInN0b3J5Ym9vayBkZXYgLXAgNjAwNiAtLW5vLW9wZW5cIixcblx0XHRcInRlc3Qtc3Rvcnlib29rXCI6IFwidGVzdC1zdG9yeWJvb2tcIixcblx0XHRcInR5cGVjaGVja1wiOiBcInRzY1wiXG5cdH0sXG5cdFwiZGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBob29rZm9ybS9yZXNvbHZlcnNcIjogXCJeMy45LjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1hY2NvcmRpb25cIjogXCJeMS4yLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1hbGVydC1kaWFsb2dcIjogXCJeMS4xLjFcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1hc3BlY3QtcmF0aW9cIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1hdmF0YXJcIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1jaGVja2JveFwiOiBcIl4xLjEuMVwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LWNvbGxhcHNpYmxlXCI6IFwiXjEuMS4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtY29udGV4dFwiOiBcIjEuMS4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtY29udGV4dC1tZW51XCI6IFwiXjIuMi4xXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtZGlhbG9nXCI6IFwiXjEuMS4xXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudVwiOiBcIl4yLjEuMVwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LWhvdmVyLWNhcmRcIjogXCJeMS4xLjFcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1pY29uc1wiOiBcIl4xLjMuMFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LWxhYmVsXCI6IFwiXjIuMS4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtbWVudWJhclwiOiBcIl4xLjEuMVwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LW5hdmlnYXRpb24tbWVudVwiOiBcIl4xLjIuMFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXBvcG92ZXJcIjogXCJeMS4xLjFcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1wcm9ncmVzc1wiOiBcIl4xLjEuMFwiLFxuXHRcdFwiQHJhZGl4LXVpL3JlYWN0LXJhZGlvLWdyb3VwXCI6IFwiXjEuMi4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3Qtc2Nyb2xsLWFyZWFcIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1zZWxlY3RcIjogXCJeMi4xLjFcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1zZXBhcmF0b3JcIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1zbGlkZXJcIjogXCJeMS4yLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC1zbG90XCI6IFwiXjEuMS4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3Qtc3dpdGNoXCI6IFwiXjEuMS4wXCIsXG5cdFx0XCJAcmFkaXgtdWkvcmVhY3QtdG9hc3RcIjogXCJeMS4yLjFcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC10b2dnbGVcIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC10b2dnbGUtZ3JvdXBcIjogXCJeMS4xLjBcIixcblx0XHRcIkByYWRpeC11aS9yZWFjdC10b29sdGlwXCI6IFwiXjEuMS4yXCIsXG5cdFx0XCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIjogXCJeMC43LjBcIixcblx0XHRcImNsc3hcIjogXCJeMi4xLjFcIixcblx0XHRcImNtZGtcIjogXCJeMS4wLjBcIixcblx0XHRcImRhdGUtZm5zXCI6IFwiXjMuNi4wXCIsXG5cdFx0XCJlbWJsYS1jYXJvdXNlbC1hdXRvcGxheVwiOiBcIl44LjIuMFwiLFxuXHRcdFwiZW1ibGEtY2Fyb3VzZWwtcmVhY3RcIjogXCJeOC4yLjBcIixcblx0XHRcImlucHV0LW90cFwiOiBcIl4xLjIuNFwiLFxuXHRcdFwicmVhY3RcIjogXCJeMTguMy4xXCIsXG5cdFx0XCJyZWFjdC1kYXktcGlja2VyXCI6IFwiXjkuMC44XCIsXG5cdFx0XCJyZWFjdC1kb21cIjogXCJeMTguMy4xXCIsXG5cdFx0XCJyZWFjdC1ob29rLWZvcm1cIjogXCJeNy41My4wXCIsXG5cdFx0XCJyZWFjdC1yZXNpemFibGUtcGFuZWxzXCI6IFwiXjIuMS4yXCIsXG5cdFx0XCJ0YWlsd2luZC1tZXJnZVwiOiBcIl4yLjUuMlwiLFxuXHRcdFwidmF1bFwiOiBcIl4wLjkuMVwiLFxuXHRcdFwiem9kXCI6IFwiXjMuMjMuOFwiXG5cdH0sXG5cdFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcblx0XHRcIkBtb25vcmVwby9hc3NldHNcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuXHRcdFwiQG1vbm9yZXBvL2VzbGludFwiOiBcIndvcmtzcGFjZTpeXCIsXG5cdFx0XCJAbW9ub3JlcG8vc3Rvcnlib29rXCI6IFwid29ya3NwYWNlOl5cIixcblx0XHRcIkBtb25vcmVwby90YWlsd2luZFwiOiBcIndvcmtzcGFjZTpeXCIsXG5cdFx0XCJAbW9ub3JlcG8vdHNjb25maWdcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuXHRcdFwiQG1vbm9yZXBvL3ZpdGVcIjogXCJ3b3Jrc3BhY2U6XlwiLFxuXHRcdFwiQHN0b3J5Ym9vay9yZWFjdFwiOiBcIl44LjIuOVwiLFxuXHRcdFwiQHN0b3J5Ym9vay90ZXN0XCI6IFwiXjguMi45XCIsXG5cdFx0XCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMy41XCIsXG5cdFx0XCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjMuMFwiLFxuXHRcdFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMjBcIixcblx0XHRcImdsb2JieVwiOiBcIl4xNC4wLjJcIixcblx0XHRcInBsYXl3cmlnaHRcIjogXCJeMS40Ni4xXCIsXG5cdFx0XCJwb3N0Y3NzXCI6IFwiXjguNC40NFwiLFxuXHRcdFwicm9sbHVwLXBsdWdpbi1wcmVzZXJ2ZS1kaXJlY3RpdmVzXCI6IFwiXjAuNC4wXCIsXG5cdFx0XCJzdG9yeWJvb2tcIjogXCJeOC4yLjlcIixcblx0XHRcInRhaWx3aW5kY3NzXCI6IFwiXjMuNC4xMFwiLFxuXHRcdFwidml0ZVwiOiBcIl41LjQuMlwiLFxuXHRcdFwidml0ZS1wbHVnaW4tZHRzXCI6IFwiXjQuMS4wXCIsXG5cdFx0XCJ2aXRlLXBsdWdpbi1leHRlcm5hbFwiOiBcIl40LjMuMVwiXG5cdH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVQsU0FBUyxhQUFhLGFBQWEsbUJBQW1COzs7QUNBL1c7QUFBQSxFQUNDLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLFNBQVc7QUFBQSxFQUNYLFFBQVU7QUFBQSxFQUNWLGFBQWU7QUFBQSxFQUNmLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNWLE9BQU87QUFBQSxNQUNOLE9BQVM7QUFBQSxNQUNULFNBQVc7QUFBQSxNQUNYLFNBQVc7QUFBQSxJQUNaO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDUCxPQUFTO0FBQUEsTUFDVCxTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsSUFDWjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQVM7QUFBQSxJQUNSO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1YsT0FBUztBQUFBLElBQ1QsbUJBQW1CO0FBQUEsSUFDbkIsT0FBUztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsTUFBUTtBQUFBLElBQ1IsV0FBYTtBQUFBLElBQ2Isa0JBQWtCO0FBQUEsSUFDbEIsV0FBYTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZix1QkFBdUI7QUFBQSxJQUN2Qiw2QkFBNkI7QUFBQSxJQUM3QixnQ0FBZ0M7QUFBQSxJQUNoQyxnQ0FBZ0M7QUFBQSxJQUNoQywwQkFBMEI7QUFBQSxJQUMxQiw0QkFBNEI7QUFBQSxJQUM1QiwrQkFBK0I7QUFBQSxJQUMvQiwyQkFBMkI7QUFBQSxJQUMzQixnQ0FBZ0M7QUFBQSxJQUNoQywwQkFBMEI7QUFBQSxJQUMxQixpQ0FBaUM7QUFBQSxJQUNqQyw4QkFBOEI7QUFBQSxJQUM5Qix5QkFBeUI7QUFBQSxJQUN6Qix5QkFBeUI7QUFBQSxJQUN6QiwyQkFBMkI7QUFBQSxJQUMzQixtQ0FBbUM7QUFBQSxJQUNuQywyQkFBMkI7QUFBQSxJQUMzQiw0QkFBNEI7QUFBQSxJQUM1QiwrQkFBK0I7QUFBQSxJQUMvQiwrQkFBK0I7QUFBQSxJQUMvQiwwQkFBMEI7QUFBQSxJQUMxQiw2QkFBNkI7QUFBQSxJQUM3QiwwQkFBMEI7QUFBQSxJQUMxQix3QkFBd0I7QUFBQSxJQUN4QiwwQkFBMEI7QUFBQSxJQUMxQix5QkFBeUI7QUFBQSxJQUN6QiwwQkFBMEI7QUFBQSxJQUMxQixnQ0FBZ0M7QUFBQSxJQUNoQywyQkFBMkI7QUFBQSxJQUMzQiw0QkFBNEI7QUFBQSxJQUM1QixNQUFRO0FBQUEsSUFDUixNQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWiwyQkFBMkI7QUFBQSxJQUMzQix3QkFBd0I7QUFBQSxJQUN4QixhQUFhO0FBQUEsSUFDYixPQUFTO0FBQUEsSUFDVCxvQkFBb0I7QUFBQSxJQUNwQixhQUFhO0FBQUEsSUFDYixtQkFBbUI7QUFBQSxJQUNuQiwwQkFBMEI7QUFBQSxJQUMxQixrQkFBa0I7QUFBQSxJQUNsQixNQUFRO0FBQUEsSUFDUixLQUFPO0FBQUEsRUFDUjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsb0JBQW9CO0FBQUEsSUFDcEIsdUJBQXVCO0FBQUEsSUFDdkIsc0JBQXNCO0FBQUEsSUFDdEIsc0JBQXNCO0FBQUEsSUFDdEIsa0JBQWtCO0FBQUEsSUFDbEIsb0JBQW9CO0FBQUEsSUFDcEIsbUJBQW1CO0FBQUEsSUFDbkIsZ0JBQWdCO0FBQUEsSUFDaEIsb0JBQW9CO0FBQUEsSUFDcEIsY0FBZ0I7QUFBQSxJQUNoQixRQUFVO0FBQUEsSUFDVixZQUFjO0FBQUEsSUFDZCxTQUFXO0FBQUEsSUFDWCxxQ0FBcUM7QUFBQSxJQUNyQyxXQUFhO0FBQUEsSUFDYixhQUFlO0FBQUEsSUFDZixNQUFRO0FBQUEsSUFDUixtQkFBbUI7QUFBQSxJQUNuQix3QkFBd0I7QUFBQSxFQUN6QjtBQUNEOzs7QURsR0EsSUFBTyxzQkFBUTtBQUFBO0FBQUEsRUFFYjtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBSUEsWUFBWTtBQUFBLElBQ1YsS0FBSztBQUFBLE1BQ0gsT0FBTyxDQUFDLGdDQUFnQyxtQkFBbUI7QUFBQSxJQUM3RDtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsaUJBQWlCLE9BQU8sS0FBSyxnQkFBSSxZQUFZO0FBQUEsSUFDL0M7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFNBQVMsQ0FBQyx1QkFBdUIsa0JBQWtCO0FBQUEsSUFDckQ7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
