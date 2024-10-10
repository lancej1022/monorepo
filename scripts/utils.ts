/* eslint-disable security/detect-non-literal-fs-filename -- TODO: refactor later so this lint rule isnt violated */

import type { PackageJson } from 'pkg-types'

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import * as fsPromise from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'

import * as v from 'valibot'

const dependencySchema = v.optional(v.record(v.string(), v.string()))

const packageJsonSchema = v.object({
	author: v.optional(
		v.union([
			v.string(),
			v.object({
				email: v.optional(v.string()),
				name: v.string(),
				url: v.optional(v.string()),
			}),
		]),
	),
	bin: v.optional(v.union([v.string(), v.record(v.string(), v.string())])),
	browser: v.optional(v.string()),
	bundledDependencies: v.optional(v.array(v.string())),
	config: v.optional(v.unknown()),
	dependencies: dependencySchema,
	description: v.optional(v.string()),
	devDependencies: dependencySchema,
	engines: v.optional(
		v.object({
			node: v.optional(v.string()),
		}),
	),
	license: v.optional(v.string()),
	main: v.optional(v.string()),
	name: v.optional(v.string()),
	optionalDependencies: dependencySchema,
	peerDependencies: dependencySchema,
	private: v.optional(v.boolean()),
	scripts: v.optional(v.record(v.string(), v.string())),
	version: v.optional(v.string()),
})

/**
 * Function to read and parse the root package.json
 * @param cwd the current working directory
 * @returns the root package.json in the workspace.
 */
export function getRootPackageJson(cwd: string): PackageJson {
	const rootPackageJsonPath = resolve(cwd, 'package.json')
	const rootPackageJson: unknown = JSON.parse(
		readFileSync(rootPackageJsonPath, 'utf-8'),
	)
	const validated = v.parse(packageJsonSchema, rootPackageJson)
	return validated
}

/**
 * Function to get all workspace package paths.
 * @param workspaces the workspaces defined in the root package.json.
 * @returns an array of all workspace package paths.
 */
export function getWorkspacePackagePaths(workspaces: string[]): string[] {
	const workspacePackagePaths: string[] = []

	workspaces.forEach((workspacePattern) => {
		const workspaceDirs = workspacePattern.replace(/\/\*$/, '')
		const absolutePath = resolve(process.cwd(), workspaceDirs)
		const packages = readdirSync(absolutePath)
			.map((pkgDir) => join(workspaceDirs, pkgDir))
			.filter((pkgPath) => existsSync(join(pkgPath, 'package.json'))) // Filter only directories with package.json
		workspacePackagePaths.push(...packages)
	})

	return workspacePackagePaths
}

/**
 * Function to get package names from package.json files
 * @param packagePaths an array of package paths
 * @returns an array of package names
 */
export function getPackageNamesFromPaths(packagePaths: string[]): string[] {
	const packageNames = packagePaths
		.map((pkgPath) => {
			const packageJsonPath = join(pkgPath, 'package.json')
			const packageJson: unknown = JSON.parse(
				readFileSync(packageJsonPath, 'utf-8'),
			)
			const validated = v.parse(packageJsonSchema, packageJson)
			return validated.name
		})
		.filter((name): name is string => !!name) // Filter out undefined names

	return packageNames
}

/**
 * Function to get all workspace package names
 * @param cwd the current working directory
 * @returns an array of all workspace package names
 */
export function getWorkspacePackageNames(cwd: string): string[] {
	const rootPackageJson = getRootPackageJson(cwd)
	if (!rootPackageJson.workspaces) {
		// throw new Error('No workspaces defined in the root package.json')
		rootPackageJson.workspaces = ['apps/*', 'packages/*', 'packages/config/*']
	}

	const workspacePackagePaths = getWorkspacePackagePaths(
		rootPackageJson.workspaces,
	)
	const packageNames = getPackageNamesFromPaths(workspacePackagePaths)

	return [
		...packageNames,
		...(rootPackageJson.name ? [rootPackageJson.name] : []),
	]
}

/**
 * Function to update all package.json files in the workspace
 * @param cwd the current working directory
 * @param update the function to update the package.json
 * @param includeRoot whether to include the root package.json
 */
export async function updateWorkspacePackages(
	cwd: string,
	update: (
		parsedPackageJson: PackageJson,
		fullPath: string,
	) => PackageJson | Promise<PackageJson>,
	includeRoot = false,
): Promise<void> {
	const rootPackageJson = getRootPackageJson(cwd)

	if (!rootPackageJson.workspaces) {
		rootPackageJson.workspaces = ['apps/*', 'packages/*', 'packages/config/*']
		// throw new Error('No workspaces defined in the root package.json')
	}

	const workspacePackagePaths = getWorkspacePackagePaths(
		rootPackageJson.workspaces,
	)

	if (includeRoot) {
		workspacePackagePaths.push(cwd)
	}

	await Promise.all(
		workspacePackagePaths.map(async (pkgPath) => {
			const packageJsonPath = join(pkgPath, 'package.json')
			const packageJsonContent = await fsPromise.readFile(
				packageJsonPath,
				'utf-8',
			)
			const packageJson: unknown = JSON.parse(packageJsonContent)
			const validated = v.parse(packageJsonSchema, packageJson)
			const updatedPackageJson = await update(validated, pkgPath)
			await fsPromise.writeFile(
				packageJsonPath,
				JSON.stringify(updatedPackageJson, null, 2) + '\n',
			)
		}),
	)
}

/**
 * Function to replace a string in a file
 * @param filePath path to the file
 * @param searchReplace an object with search and replace strings
 * @param ignoredFiles an array of file names to ignore
 */
export async function replaceInFile(
	filePath: string,
	searchReplace: Record<string, string>,
	ignoredFiles: string[] = [],
): Promise<void> {
	if (ignoredFiles.includes(basename(filePath))) {
		return
	}

	try {
		let data = await fsPromise.readFile(filePath, 'utf8')

		for (const [search, replace] of Object.entries(searchReplace)) {
			// eslint-disable-next-line security/detect-non-literal-regexp  -- TODO: refactor later so this lint rule isnt violated
			const regex = new RegExp(search, 'g')
			data = data.replace(regex, replace)
		}

		await fsPromise.writeFile(filePath, data, 'utf8')

		// eslint-disable-next-line no-console -- intentionally logging to the console
		console.log(`Successfully updated ${filePath}`)
	} catch (err) {
		console.error(`Error processing file ${filePath}:`, err)
	}
}

/**
 * Function to traverse a directory and call a callback on each file
 * @param directory the directory to traverse
 * @param callback a function to call on each file
 * @param ignoredFolders an array of folder names to ignore
 */
export async function traverseDirectory(
	directory: string,
	callback: (fullPath: string) => Promise<void>,
	ignoredFolders: string[] = [],
): Promise<void> {
	try {
		const files = await fsPromise.readdir(directory)

		for (const file of files) {
			const fullPath = join(directory, file)
			const stats = await fsPromise.stat(fullPath)

			if (stats.isDirectory()) {
				if (!ignoredFolders.includes(file)) {
					await traverseDirectory(fullPath, callback, ignoredFolders)
				}
			} else if (stats.isFile()) {
				await callback(fullPath)
			}
		}
	} catch (err) {
		console.error(`Error processing directory ${directory}:`, err)
	}
}

/**
 * Function to update the prettier.config.js file
 * @param cwd the current working directory
 * @param newNamespace the new namespace to replace
 */
export async function updateNamespaceInPrettierConfig(
	cwd: string,
	newNamespace: string,
): Promise<void> {
	const filePath = join(cwd, 'prettier.config.js')

	try {
		const data = await fsPromise.readFile(filePath, 'utf8')

		// Extract importOrder array content
		const importOrderStart = data.indexOf('importOrder: [')
		const importOrderEnd = data.indexOf('],', importOrderStart)
		if (importOrderStart === -1 || importOrderEnd === -1) {
			console.error('importOrder array not found in file')
			return
		}

		const beforeImportOrder = data.substring(0, importOrderStart)
		const importOrderContent = data.substring(
			importOrderStart,
			importOrderEnd + 2,
		) // Include '],'
		const afterImportOrder = data.substring(importOrderEnd + 2)

		const searchPattern = /'\^@\w+\/\(\.\*\)\$'/g

		// Replace within importOrder array content
		const updatedImportOrderContent = importOrderContent.replace(
			searchPattern,
			(match) => {
				return match.replace(/@\w+\//, `${newNamespace}/`)
			},
		)

		// Reconstruct the file content
		const updatedData =
			beforeImportOrder + updatedImportOrderContent + afterImportOrder

		await fsPromise.writeFile(filePath, updatedData, 'utf8')
		// eslint-disable-next-line no-console -- intentionally logging to the console
		console.log(`Successfully updated ${filePath}`)
	} catch (err) {
		console.error(`Error processing file ${filePath}:`, err)
	}
}

/* eslint-enable security/detect-non-literal-fs-filename */
