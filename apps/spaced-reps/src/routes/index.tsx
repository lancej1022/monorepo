import type { ChangeEvent } from 'react'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import * as v from 'valibot'

import { buttonVariants } from '@monorepo/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@monorepo/ui/card'
import { cn } from '@monorepo/ui/cn'
import { Input } from '@monorepo/ui/input'
import { Label } from '@monorepo/ui/label'

import { ReminderList } from './-components/reminder-card'

const searchSchema = v.object({
	searchTerm: v.optional(v.string()),
})

export const Route = createFileRoute('/')({
	component: HomeComponent,
	validateSearch: (search) => v.parse(searchSchema, search),
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
		<Card>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Reminders</CardTitle>
				<div className='grid w-full max-w-sm items-center gap-1.5'>
					<Label htmlFor='reminder-search'>Search reminders</Label>
					<Input
						id='reminder-search'
						onChange={searchReminders}
						placeholder='Two sum'
						type='text'
					/>
				</div>
			</CardHeader>
			{/* TODO: add a gap between the list + link */}
			<CardContent>
				<ReminderList />
				<Link
					className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
					to='/add-reminder-form'
				>
					Add new reminder
				</Link>
			</CardContent>
		</Card>
	)
}
