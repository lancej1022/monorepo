export function parseUrl(url: string) {
	const urlObj = new URL(url)
	const { pathname } = urlObj

	const pathParts = pathname.split('/')
	// TODO: rather than assign this to an empty string, we should probably throw an error or something
	const problemName = pathParts[2] ?? ''

	return problemName
}
