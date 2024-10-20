import type { ChangeEvent } from 'react'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { buttonVariants } from '@monorepo/ui/button'
import { Card, CardContent, CardHeader } from '@monorepo/ui/card'
import { cn } from '@monorepo/ui/cn'
import { Input } from '@monorepo/ui/input'
import { Label } from '@monorepo/ui/label'

import { queries } from '../queries/chrome-queries'
import { ReminderList } from './-components/reminder-list'

const searchSchema = v.object({
	searchTerm: v.optional(v.string()),
})

export const Route = createFileRoute('/')({
	component: HomeComponent,
	validateSearch: (search) => v.parse(searchSchema, search),
	loader: (opts) => {
		void opts.context.queryClient.prefetchQuery(queries.getTabs())
		void opts.context.queryClient.prefetchQuery(queries.getReminders())
	},
})

// TODO: try using the profiler to understand what lag is causing this not to immediately render...
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
