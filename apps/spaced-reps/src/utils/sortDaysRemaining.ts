import { type SavedReminders } from 'src/queries/chrome-queries'

import { dateDiffInDays } from './dateDiffInDays'

export function sortByDaysRemainingBeforeReminder(reminders: SavedReminders) {
	const array = Object.entries(reminders)

	return array.sort((a, b) => {
		const daysSinceA =
			Number(a[1].daysUntilDue) - dateDiffInDays(new Date(a[1].timestamp), new Date())
		const daysSinceB =
			Number(b[1].daysUntilDue) - dateDiffInDays(new Date(b[1].timestamp), new Date())

		return daysSinceA - daysSinceB
	})
}
