import type { Reminder } from '../queries/chrome-queries'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'
import * as v from 'valibot'

import { Button, buttonVariants } from '@monorepo/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@monorepo/ui/card'
import { cn } from '@monorepo/ui/cn'
import { Input } from '@monorepo/ui/input'
import { Label } from '@monorepo/ui/label'
import { Textarea } from '@monorepo/ui/textarea'
import { Typography } from '@monorepo/ui/typography'

import { queries } from '../queries/chrome-queries'
import { parseUrl } from '../utils/parseUrl'

function createFormattedTitle(unformattedTitle: string) {
	return unformattedTitle
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
		.join(' ')
}

async function saveReminder(url: string, reminder: Reminder) {
	await chrome.storage.local.set({ [url]: reminder })
}

export const Route = createFileRoute('/add-reminder-form')({
	component: AddReminderForm,
})

const reminderSchema = v.object({
	daysUntilDue: v.pipe(v.string(), v.transform(Number)),
	notes: v.optional(v.string()),
	title: v.string(),
	questionUrl: v.string(),
})

async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
	event.preventDefault()

	const form = event.target
	if (!(form instanceof HTMLFormElement)) {
		return new Promise((_, reject) => {
			reject(
				Error(
					'Form submissions rejected because the event received was not a form event!',
				),
			)
		})
	}

	const formData = new FormData(form)
	const { questionUrl, ...parsed } = v.parse(reminderSchema, Object.fromEntries(formData))

	const saveableReminder = {
		...parsed,
		timestamp: new Date().toISOString(),
	}

	return saveReminder(questionUrl, saveableReminder).then(() => {
		form.reset()
		toast.success(`Reminder for ${saveableReminder.title} saved`)
	})
}

function AddReminderForm() {
	const navigate = useNavigate({ from: '/add-reminder-form' })
	const { data } = useSuspenseQuery(queries.getTabs())

	const mutation = useMutation({
		mutationFn: handleFormSubmit,
		onError: () => {
			toast.error('There was a problem saving the reminder')
		},
		onSuccess: () => {
			// note: the form reset and snackbar are tackled by `handleFormSubmit` since it has access to the necessary variable
			void navigate({ to: '/' })
		},
	})

	const unformattedTitle = parseUrl(data?.questionUrl ?? '') ?? ''
	const formattedTitle = createFormattedTitle(unformattedTitle)

	return (
		<Card className='size-full'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Add New Reminder</CardTitle>
				<Typography>
					This form only works if the browser page is on a neetcode, leetcode, or
					greatfrontend problem URL.
				</Typography>
			</CardHeader>
			<CardContent>
				<form className='space-y-6' onSubmit={mutation.mutate}>
					<div className='space-y-2'>
						<Label htmlFor='title'>Reminder Name (this is automatically generated)</Label>
						<Input
							id='title'
							name='title'
							// TODO: we cant use `disabled` because `disabled` elements arent included during form submission so instead we use `readonly`
							// However, readonly isnt STYLED like a disabled `Input`, so we need to add some styles to handle that
							readOnly={true}
							required
							type='text'
							value={formattedTitle}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='daysUntilDue'>Days Until Due</Label>
						<Input
							id='daysUntilDue'
							max='180'
							min='0'
							name='daysUntilDue'
							placeholder='Enter number of days'
							required
							type='number'
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='notes'>Notes</Label>
						{/*
							TODO: submit the form as the user types so that they dont accidentally lose their notes
							We also need to make sure that this form doesnt render in the first place if the user is trying to "add" a reminder
							for a URL that is already saved
						*/}
						<Textarea
							className='h-32'
							id='notes'
							name='notes'
							placeholder='Enter any additional notes'
						/>
					</div>
					<input
						name='questionUrl'
						readOnly={true}
						type='hidden'
						value={data?.questionUrl}
					/>
					<Button className='w-full' type='submit'>
						<PlusCircle className='mr-2 size-4' />
						Add Reminder
					</Button>
				</form>
			</CardContent>
			<CardFooter>
				<Link className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')} to='/'>
					Back to overview
				</Link>
			</CardFooter>
		</Card>
	)
}
