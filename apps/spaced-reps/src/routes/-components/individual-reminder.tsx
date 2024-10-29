import { useId, useRef, useState } from 'react'

import type { Reminder } from 'src/queries/chrome-queries'

import { useMutation } from '@tanstack/react-query'
import debounce from 'debounce'
import { ChevronDown, ChevronUp, Clock, ExternalLink, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@monorepo/ui/button'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@monorepo/ui/collapsible'
import { Textarea } from '@monorepo/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@monorepo/ui/tooltip'

import { dateDiffInDays } from '../../utils/dateDiffInDays'

/** Updates the text area height as the user types, ensuring that the user isnt forced to deal with a small textbox for a large note */
function resizeTextArea(el: HTMLTextAreaElement) {
	el.style.height = 'auto'
	el.style.height = `${el.scrollHeight}px`
}

function getDueDateText(daysUntilDue: number) {
	if (daysUntilDue === 0) return 'Due today'
	if (daysUntilDue < 0)
		return `${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''} overdue`
	return `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} until due`
}

function getDueDateColor(daysUntilDue: number) {
	if (daysUntilDue < 0) return 'text-red-500'
	if (daysUntilDue === 0) return 'text-yellow-500'
	return 'text-green-500'
}

export function IndividualReminder({
	reminder,
	url,
}: {
	reminder: Reminder
	url: string
}) {
	const id = useId()
	const [open, setOpen] = useState(false)
	const elementToScrollTo = useRef<HTMLLIElement>(null)

	const deleteMutation = useMutation({
		mutationFn: (_: unknown) => chrome.storage.local.remove(url),
		onError: (error) => {
			console.error(error)
		},
	})

	const updateNotesMutation = useMutation({
		mutationFn: async (note: string) => {
			return chrome.storage.local.set({ [url]: { ...reminder, notes: note } })
		},
		onError: (error) => {
			console.error(error)
		},
		onSuccess: () => {
			toast.success(`Notes for ${reminder.title} updated successfully`)
		},
	})

	const updateDueDateMutation = useMutation({
		mutationFn: async (newDaysUntilDue: string) => {
			return chrome.storage.local.set({
				[url]: {
					...reminder,
					daysUntilDue: Number(newDaysUntilDue), // TODO: before hitting the `return` here, make sure the `newDaysUntilDue` is a valid number!
					timestamp: new Date().toISOString(),
				},
			})
		},
		onError: (error) => {
			console.error(error)
		},
		onSuccess: () => {
			elementToScrollTo.current?.scrollIntoView()
			toast.success(`Due date for ${reminder.title} updated successfully`)
		},
	})

	const debouncedNoteUpdate = debounce(updateNotesMutation.mutate, 500)

	const calculatedDaysUntilDue =
		Number(reminder.daysUntilDue) -
		dateDiffInDays(new Date(reminder.timestamp), new Date())

	return (
		<li ref={elementToScrollTo}>
			<Collapsible
				onOpenChange={() => {
					setOpen((prev) => !prev)
				}}
				open={open}
			>
				<CollapsibleTrigger className='bg-secondary hover:bg-secondary/80 flex w-full items-center justify-between rounded-lg p-4 transition-colors'>
					<div className='flex items-center space-x-2 text-left'>{reminder.title}</div>
					<div className='flex items-center space-x-2'>
						<span className={`text-sm ${getDueDateColor(calculatedDaysUntilDue)}`}>
							{open ? (
								<>
									<div>
										<input
											className='mr-1 inline  max-w-8 rounded border-none bg-transparent p-0 text-sm'
											defaultValue={calculatedDaysUntilDue}
											dir='rtl'
											id={id}
											max='180'
											name='daysUntilDue'
											onChange={(e) => {
												updateDueDateMutation.mutate(e.target.value)
											}}
											onClick={(e) => {
												e.preventDefault()
											}}
											required
											type='number'
										/>
										{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- a label element is interactive!*/}
										<label
											htmlFor={id}
											onClick={(e) => {
												e.stopPropagation()
											}}
											onKeyDown={(e) => {
												e.stopPropagation()
											}}
										>
											{/* TODO: this needs to dynamically change based on the current value of the text input, so we need a controlled input */}
											day{calculatedDaysUntilDue > 1 ? 's' : ''} until due
										</label>
									</div>
									<div className='text-foreground'>
										previous reminder: {reminder.daysUntilDue} day
										{reminder.daysUntilDue > 1 ? 's' : ''}
									</div>
								</>
							) : (
								<>
									<Clock className='mr-1 inline size-4' />
									{getDueDateText(calculatedDaysUntilDue)}
								</>
							)}
						</span>

						{open ? <ChevronUp className='size-5' /> : <ChevronDown className='size-5' />}
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent className='bg-secondary/50 rounded-b-lg p-4 pt-2'>
					<div className='flex items-center space-x-2'>
						<form className='w-full'>
							<Textarea
								className='max-h-48 min-h-4 w-full'
								defaultValue={reminder.notes}
								onChange={(e) => {
									resizeTextArea(e.target)
									debouncedNoteUpdate(e.target.value)
								}}
								onFocus={(e) => {
									resizeTextArea(e.target)
								}}
							/>
						</form>
						<div className='max-w-min	'>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button asChild size='icon' variant='ghost'>
										<a
											href={url}
											referrerPolicy='no-referrer'
											rel='noreferrer'
											target='_blank'
										>
											<span className='sr-only'>Visit problem url</span>
											<ExternalLink className='size-5' />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Visit url</p>
								</TooltipContent>
							</Tooltip>
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
					</div>
				</CollapsibleContent>
			</Collapsible>
		</li>
	)
}
