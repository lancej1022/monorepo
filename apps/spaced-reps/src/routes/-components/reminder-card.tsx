import { useState } from 'react'

import type { ChangeEvent } from 'react'

import { useSuspenseQuery } from '@tanstack/react-query'
import debounce from 'debounce'
import { Bell, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@monorepo/ui/collapsible'
import { ScrollArea } from '@monorepo/ui/scroll-area'
import { Textarea } from '@monorepo/ui/textarea'

import { queries } from '../__root'
import { Route } from '../index'

interface Reminder {
	id: number
	title: string
	notes?: string
}

const mockReminders: Reminder[] = [
	{ id: 1, title: 'Buy groceries', notes: 'Milk, eggs, bread, and vegetables' },
	{ id: 2, title: 'Call mom', notes: "Ask about her doctor's appointment" },
	{ id: 3, title: 'Finish project report' },
	{
		id: 4,
		title: 'Schedule dentist appointment',
		notes: 'Check available slots for next week',
	},
	{
		id: 5,
		title: 'Pay utility bills',
		notes: 'Electricity and water bills due on 15th',
	},
]

function IndividualReminder({ reminder }: { reminder: Reminder }) {
	const [open, setOpen] = useState(false)

	// TODO: debounce and/or useTransition here
	function updateNote(event: ChangeEvent<HTMLTextAreaElement>) {
		const textToSave = event.target.value
		console.log({ textToSave })
	}

	return (
		<li key={reminder.id}>
			<Collapsible
				open={open}
				onOpenChange={() => {
					setOpen((prev) => !prev)
				}}
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
				{reminder.notes && (
					<CollapsibleContent className='bg-secondary/50 rounded-b-lg p-4 pt-2'>
						<div className='flex items-start space-x-2'>
							<Pencil className='mt-0.5 size-5' />
							<form className='w-full'>
								<Textarea
									onChange={debounce(updateNote, 300)}
									className='min-h-24 w-full'
									defaultValue={reminder.notes}
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

	const filteredReminders = searchTerm
		? mockReminders.filter((r) =>
				r.title.toLowerCase().includes(searchTerm.toLowerCase()),
			)
		: mockReminders

	return (
		<ScrollArea className=' pr-4'>
			<ul className='space-y-4'>
				{filteredReminders.map((reminder) => (
					<IndividualReminder key={reminder.id} reminder={reminder} />
				))}
			</ul>
		</ScrollArea>
	)
}
