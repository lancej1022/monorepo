import { useState } from 'react'

import type { ChangeEvent } from 'react'
import type { Reminder } from '../__root'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import debounce from 'debounce'
import { Bell, ChevronDown, ChevronUp, Trash } from 'lucide-react'

import { Button } from '@monorepo/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@monorepo/ui/collapsible'
import { ScrollArea } from '@monorepo/ui/scroll-area'
import { Textarea } from '@monorepo/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@monorepo/ui/tooltip'

import { queries } from '../__root'
import { Route } from '../index'

function IndividualReminder({
	reminder,
	url,
}: {
	reminder: Reminder
	url: string
}) {
	const [open, setOpen] = useState(false)
	const mutation = useMutation({
		mutationFn: (_: unknown) => chrome.storage.local.remove(url),
		onError: (error) => {
			console.error(error)
		},
	})

	const updateNote = debounce(function updateReminder(
		event: ChangeEvent<HTMLTextAreaElement>,
	) {
		const textToSave = event.target.value

		chrome.storage.local
			.set({ [url]: { ...reminder, notes: textToSave } })
			.catch((err) => {
				console.error(err)
			})
	}, 300)

	return (
		<li>
			<Collapsible
				onOpenChange={() => {
					setOpen((prev) => !prev)
				}}
				open={open}
			>
				<CollapsibleTrigger className='flex w-full items-center justify-between rounded-lg bg-secondary p-4 transition-colors hover:bg-secondary/80'>
					<div className='flex items-center space-x-2'>
						<Bell className='size-5' />
						<span>{reminder.title}</span>
					</div>
					{open ? (
						<ChevronUp className='size-5' />
					) : (
						<ChevronDown className='size-5' />
					)}
				</CollapsibleTrigger>
				{reminder.notes && (
					<CollapsibleContent className='rounded-b-lg bg-secondary/50 p-4 pt-2'>
						<div className='flex items-start space-x-2'>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={mutation.mutate}
										size='icon'
										variant='outline'
									>
										<Trash className='mt-0.5 size-5' color='red' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Delete reminder</p>
								</TooltipContent>
							</Tooltip>
							<form className='w-full'>
								<Textarea
									className='min-h-24 w-full'
									defaultValue={reminder.notes}
									onChange={updateNote}
								/>
							</form>
						</div>
					</CollapsibleContent>
				)}
			</Collapsible>
		</li>
	)
}

export function ReminderList() {
	const searchTerm = Route.useSearch({ select: (search) => search.searchTerm })
	const { data } = useSuspenseQuery(queries.getReminders())
	const reminders = Object.entries(data)

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
