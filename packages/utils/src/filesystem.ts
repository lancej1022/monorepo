import { createRequire } from 'node:module'
import { dirname, join } from 'path'

// idk when we can remove this in favor of `import.meta.resolve` -- probably Node 22.x ? https://nodejs.org/api/esm.html#importmetaresolvespecifier
const require = createRequire(import.meta.url)

/**
 * This function is used to resolve the absolute path of a package. It is needed
 * in projects that use Yarn PnP or are set up within a monorepo.
 * @param value The package name.
 * @returns The absolute path of the package.
 */
export function getAbsolutePath(value: string) {
	return dirname(require.resolve(join(value, 'package.json')))
}
