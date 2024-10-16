export function parseUrl(url: string) {
	const urlObj = new URL(url)
	const { pathname, hostname } = urlObj

	// TODO: might be able to DRY this up by abstracting around the `.at(index)`
	// but need to add neetcode case as well before deciding if theres actually a viable abstraction here
	switch (true) {
		case hostname.includes('greatfrontend'): {
			const pathParts = pathname.split('/')
			const problemName = pathParts.at(-1)
			return problemName
		}
		case hostname.includes('leetcode'): {
			const pathParts = pathname.split('/')
			const problemName = pathParts[2]
			return problemName
		}
		default: {
			throw Error(`unsupported hostname: ${hostname}`)
		}
	}
}
