import type { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI) {
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- TODO: idk why TS is so mad about this? seems like valid plop syntax
	plop.load('./pnpm-install.ts'),
		// TODO: the `app/package` generators can be combined into a single generator, and then just do something like `data.app || data.package` based on a prompt
		plop.setGenerator('app', {
			actions: function (data) {
				if (!data) {
					console.error('No data collected from the prompts.')
					return []
				}
				const isReactApp = data.type === 'React'
				const actionsToTake: PlopTypes.Actions = [
					{
						base: 'templates/base',
						destination: 'apps/{{name}}',
						globOptions: { dot: true },
						templateFiles: 'templates/base/**/*',
						type: 'addMany',
					},
					{
						path: 'apps/{{name}}/tsconfig.json',
						pattern: /(-- PLOP EXTENDS HERE --)/,
						template: isReactApp
							? '["@monorepo/tsconfig/react.json"]'
							: '["@monorepo/tsconfig/base.json"]',
						type: 'modify',
					},
					{
						path: 'apps/{{name}}/package.json',
						pattern: /(-- PLOP DEVDEPENDENCIES HERE --)/,
						template: isReactApp
							? `"@playwright/test": "catalog:",
                "@tanstack/react-query": "catalog:",
                "@tanstack/react-router": "catalog:",
                "@testing-library/react": "catalog:",
                "@types/node": "catalog:",
                "@types/react": "catalog:",
                "@types/react-dom": "catalog:",
                "happy-dom": "catalog:",
                "msw": "catalog:",
                "react": "catalog:",
                "react-dom": "catalog:",`
							: '',
						type: 'modify',
					},
				]
				return actionsToTake
			},
			description: 'Create a new TypeScript app in the monorepo',
			prompts: [
				{
					message: 'What is the name of the app?',
					name: 'name',
					type: 'input',
					validate: function (value) {
						if (typeof value !== 'string' || value.length === 0) {
							return 'name is required'
						}
						return true
					},
				},
				{
					choices: ['React', 'Vanilla'],
					default: 'React',
					message: "Is this a 'vanilla' TypeScript app, or a TypeScript and React app?",
					name: 'type',
					type: 'list',
				},
				{
					message: 'What is the description of the app?',
					name: 'description',
					type: 'input',
					validate: function (value) {
						if (typeof value !== 'string' || value.length === 0) {
							return 'description is required'
						}
						return true
					},
				},
			],
		}),
		plop.setGenerator('package', {
			actions: function (data) {
				if (!data) {
					console.error('No data collected from the prompts.')
					return []
				}

				const isReactPackage = data.type === 'React'

				const actionsToTake: PlopTypes.Actions = [
					{
						base: 'templates/base',
						destination: 'packages/{{name}}',
						globOptions: { dot: true },
						templateFiles: 'templates/base/**/*',
						type: 'addMany',
					},
					// TODO: outdated
					{
						path: 'packages/{{name}}/.eslintrc.cjs',
						pattern: /(-- PLOP EXTENDS HERE --)/,
						template: isReactPackage
							? '["monorepo/base", "monorepo/react"]'
							: '["monorepo/base"]',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/tsconfig.json',
						pattern: /(-- PLOP EXTENDS HERE --)/,
						template: isReactPackage
							? '["@monorepo/tsconfig/react.json"]'
							: '["@monorepo/tsconfig/base.json"]',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/package.json',
						pattern: /(-- PLOP DEVDEPENDENCIES HERE --)/,
						template: isReactPackage
							? `"@playwright/test": "catalog:",
                "@tanstack/react-query": "catalog:",
                "@tanstack/react-router": "catalog:",
                "@testing-library/react": "catalog:",
                "@types/node": "catalog:",
                "@types/react": "catalog:",
                "@types/react-dom": "catalog:",
                "happy-dom": "catalog:",
                "msw": "catalog:",
                "react": "catalog:",
                "react-dom": "catalog:",`
							: '',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/package.json',
						pattern: /(-- PLOP PEERDEPENDENCIES HERE --)/,
						template: isReactPackage
							? `,"peerDependencies": {
                    "react": "catalog:",
                    "react-dom": "catalog:"
                  }`
							: '',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/package.json',
						pattern: /(-- PLOP SCRIPTS HERE --)/,
						template: isReactPackage
							? `,"test:e2e": "pnpm exec playwright install && playwright test --pass-with-no-tests"`
							: '',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/src/index.ts',
						pattern: /(-- PLOP EXPORT HERE --)/,
						template: isReactPackage
							? 'export { BoilerPlateComponent } from "./fakeButton";'
							: 'export {}',
						type: 'modify',
					},
					{
						path: 'packages/{{name}}/vite.config.mts',
						pattern: /(-- PLOP VITEST SETUP HERE --)/,
						template: isReactPackage
							? 'setupFiles: "src/testHelpers/setupTests.ts",'
							: '',
						type: 'modify',
					},
				]

				if (isReactPackage) {
					actionsToTake.push({
						base: 'templates/react',
						destination: 'packages/{{name}}',
						globOptions: { dot: true },
						templateFiles: 'templates/react/**/*',
						type: 'addMany',
					})

					// eslint-disable-next-line no-console -- intentionally logging to the terminal
					console.info(
						'\nNOTE: You will need to manualy assign a UNIQUE port on line 7 of the generated playwright.config.ts file.\n',
					)
				}

				// this action needs to come last in the actions array otherwise we might execute `pnpm install` before the package.json is finalized
				actionsToTake.push({
					type: 'pnpmInstall',
				})

				return actionsToTake
			},
			description: 'Create a new TypeScript package in the monorepo',
			prompts: [
				{
					message: 'What is the name of the package?',
					name: 'name',
					type: 'input',
					validate: function (value) {
						if (typeof value !== 'string' || value.length === 0) {
							return 'name is required'
						}
						return true
					},
				},
				{
					choices: ['Vanilla', 'React'],
					default: 'Vanilla',
					message:
						"Is this a 'vanilla' TypeScript package, or a TypeScript and React package?",
					name: 'type',
					type: 'list',
				},
				{
					message: 'What is the description of the package?',
					name: 'description',
					type: 'input',
					validate: function (value) {
						if (typeof value !== 'string' || value.length === 0) {
							return 'description is required'
						}
						return true
					},
				},
			],
		})
}
