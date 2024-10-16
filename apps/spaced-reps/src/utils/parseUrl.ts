/** contains the index to use in `pathParts` array to determine the problem name  */
const nameToIndexMap = {
	'greatfrontend.com': -1,
	'neetcode.io': -1,
	'leetcode.com': 2,
} as const

type Hostname = keyof typeof nameToIndexMap

function isValidDomain(hostname: string): hostname is Hostname {
	return hostname in nameToIndexMap
}

export function parseUrl(url: string) {
	const urlObj = new URL(url)
	const { pathname, hostname } = urlObj

	const hostParts = hostname.split('www.')
	const domainName = (hostParts.length > 1 ? hostParts.at(1) : hostParts.at(0)) ?? ''

	if (!isValidDomain(domainName)) {
		throw Error(`unsupported hostname: ${domainName}`)
	}

	const pathParts = pathname.split('/')
	// eslint-disable-next-line security/detect-object-injection -- TODO: Review this security error. It should theoretically be safe thanks to `isValidDomain()` check above
	const indexForProblemName = nameToIndexMap[domainName]
	const problemName = pathParts.at(indexForProblemName)

	return problemName
}
