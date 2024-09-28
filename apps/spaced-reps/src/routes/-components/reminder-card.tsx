import { useState } from 'react'

import { Bell, ChevronDown, ChevronUp, Pencil } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@monorepo/ui/card'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@monorepo/ui/collapsible'
import { ScrollArea } from '@monorepo/ui/scroll-area'

interface Reminder {
	id: number
	title: string
	notes?: string
}

const initialReminders: Reminder[] = [
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

export function ReminderCard() {
	console.log('reminderCard mounting')
	const [reminders, setReminders] = useState(initialReminders)
	const [openItems, setOpenItems] = useState<number[]>([])

	const toggleItem = (id: number) => {
		setOpenItems((prevOpenItems) =>
			prevOpenItems.includes(id)
				? prevOpenItems.filter((item) => item !== id)
				: [...prevOpenItems, id],
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Reminders</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className='h-[540px] pr-4'>
					<ul className='space-y-4'>
						{reminders.map((reminder) => (
							<li key={reminder.id}>
								<Collapsible
									open={openItems.includes(reminder.id)}
									onOpenChange={() => {
										toggleItem(reminder.id)
									}}
								>
									<CollapsibleTrigger className='hover:bg-secondary/80 bg-secondary flex w-full items-center justify-between rounded-lg p-4 transition-colors'>
										<div className='flex items-center space-x-2'>
											<Bell className='size-5' />
											<span>{reminder.title}</span>
										</div>
										{openItems.includes(reminder.id) ? (
											<ChevronUp className='size-5' />
										) : (
											<ChevronDown className='size-5' />
										)}
									</CollapsibleTrigger>
									{reminder.notes && (
										<CollapsibleContent className='bg-secondary/50 rounded-b-lg p-4 pt-2'>
											<div className='flex items-start space-x-2'>
												<Pencil className='mt-0.5 size-5' />
												<p className='text-sm'>{reminder.notes}</p>
											</div>
										</CollapsibleContent>
									)}
								</Collapsible>
							</li>
						))}
					</ul>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
