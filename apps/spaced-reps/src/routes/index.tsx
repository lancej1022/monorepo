import { createFileRoute } from '@tanstack/react-router'

import { ReminderCard } from './-components/reminder-card'

export const Route = createFileRoute('/')({
	component: HomeComponent,
})

function HomeComponent() {
	return <ReminderCard />
}
