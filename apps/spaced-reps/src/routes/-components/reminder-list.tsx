import { useSuspenseQuery } from '@tanstack/react-query'

import { ScrollArea } from '@monorepo/ui/scroll-area'

import { queries } from '../../queries/chrome-queries'
import { sortByDaysRemainingBeforeReminder } from '../../utils/sortDaysRemaining'
import { Route } from '../index'
import { IndividualReminder } from './individual-reminder'

export function ReminderList() {
	const searchTerm = Route.useSearch({ select: (search) => search.searchTerm })
	const { data } = useSuspenseQuery(queries.getReminders())

	const reminders = sortByDaysRemainingBeforeReminder(data)

	const filteredReminders = searchTerm
		? reminders.filter(([_url, reminder]) =>
				reminder.title.toLowerCase().includes(searchTerm.toLowerCase()),
			)
		: reminders

	return (
		<ScrollArea>
			<ul className='space-y-4'>
				{filteredReminders.map(([url, reminder]) => (
					<IndividualReminder key={url} reminder={reminder} url={url} />
				))}
			</ul>
		</ScrollArea>
	)
}
