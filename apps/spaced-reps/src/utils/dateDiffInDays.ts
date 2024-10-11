const millisecondsPerDay = 1000 * 60 * 60 * 24

// TODO: is there a more performant way to wind up sorted the dates?
export function dateDiffInDays(a: Date, b: Date) {
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

	return Math.floor((utc2 - utc1) / millisecondsPerDay)
}
