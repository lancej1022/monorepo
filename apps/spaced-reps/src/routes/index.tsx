import type { ChangeEvent } from 'react'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Rocket } from 'lucide-react'
import * as v from 'valibot'

import { buttonVariants } from '@monorepo/ui/button'
import { Card, CardContent, CardHeader } from '@monorepo/ui/card'
import { cn } from '@monorepo/ui/cn'
import { Input } from '@monorepo/ui/input'
import { Label } from '@monorepo/ui/label'
import { Typography } from '@monorepo/ui/typography'

import { queries } from './__root'
import { ReminderList } from './-components/reminder-list'

const searchSchema = v.object({
	searchTerm: v.optional(v.string()),
})

export const Route = createFileRoute('/')({
	component: HomeComponent,
	validateSearch: (search) => v.parse(searchSchema, search),
	loader: (opts) => {
		return Promise.allSettled([
			opts.context.queryClient.ensureQueryData(queries.getTabs()),
			opts.context.queryClient.ensureQueryData(queries.getReminders()),
		])
	},
})

function HomeComponent() {
	const navigate = useNavigate({ from: Route.fullPath })

	function searchReminders(event: ChangeEvent<HTMLInputElement>) {
		navigate({
			search: () => ({
				searchTerm: event.target.value ? event.target.value : undefined,
			}),
		}).catch((err) => {
			console.error(err)
		})
	}

	return (
		<Card className='flex flex-col gap-6 p-6'>
			<CardHeader className='gap-3 p-0'>
				<div className='flex items-center gap-2'>
					<Rocket />
					<Typography className='text-3xl font-bold' variant='h1'>
						Spaced Reps
					</Typography>
				</div>
				<div className='grid w-full max-w-sm items-center gap-1.5'>
					<Label htmlFor='reminder-search'>Search reminders</Label>
					<Input id='reminder-search' onChange={searchReminders} type='text' />
				</div>
			</CardHeader>
			<CardContent className='p-0'>
				<ReminderList />
			</CardContent>
			<Link
				className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
				to='/add-reminder-form'
			>
				Add new reminder
			</Link>
		</Card>
	)
}
