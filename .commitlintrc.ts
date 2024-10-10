// We are exporting a custom commitlint configuration
export default {
	extends: [
		'@commitlint/config-conventional',
		'@commitlint/config-pnpm-scopes',
	],
}
