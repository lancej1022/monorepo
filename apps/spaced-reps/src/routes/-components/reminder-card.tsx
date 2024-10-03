import { useState } from 'react'

import type { Reminder } from '../__root'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import debounce from 'debounce'
import { Bell, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

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

/** Updates the text area height as the user types, ensuring that the user isnt forced to deal with a small textbox for a large note */
function resizeTextArea(el: HTMLTextAreaElement) {
	el.style.height = 'auto'
	el.style.height = `${el.scrollHeight}px`
}

function IndividualReminder({
	reminder,
	url,
}: {
	reminder: Reminder
	url: string
}) {
	const [open, setOpen] = useState(false)
	const deleteMutation = useMutation({
		mutationFn: (_: unknown) => chrome.storage.local.remove(url),
		onError: (error) => {
			console.error(error)
		},
	})

	const updateMutation = useMutation({
		mutationFn: async (note: string) => {
			return chrome.storage.local.set({ [url]: { ...reminder, notes: note } })
		},
		onError: (error) => {
			console.error(error)
		},
	})

	const debouncedNoteUpdate = debounce(updateMutation.mutate, 500)

	return (
		<li>
			<Collapsible
				onOpenChange={() => {
					setOpen((prev) => !prev)
				}}
				open={open}
			>
				<CollapsibleTrigger className='bg-secondary hover:bg-secondary/80 flex w-full items-center justify-between rounded-lg p-4 transition-colors'>
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

				<CollapsibleContent className='bg-secondary/50 rounded-b-lg p-4 pt-2'>
					<div className='flex items-center space-x-2'>
						<form className='w-full'>
							<Textarea
								className='max-h-36 min-h-4 w-full'
								defaultValue={reminder.notes}
								onChange={(e) => {
									resizeTextArea(e.target)
									debouncedNoteUpdate(e.target.value)
								}}
							/>
						</form>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className='text-red-500 hover:bg-red-100 hover:text-red-700'
									onClick={deleteMutation.mutate}
									size='icon'
									variant='ghost'
								>
									<Trash2 className='size-5' />
									<span className='sr-only'>Delete reminder</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Delete reminder</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</CollapsibleContent>
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
