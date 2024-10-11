import type { QueryClient } from '@tanstack/react-query'

import { queryOptions } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import * as v from 'valibot'

import { TooltipProvider } from '@monorepo/ui/tooltip'

const individualReminderSchema = v.object({
	daysUntilDue: v.number(),
	notes: v.optional(v.string()),
	title: v.string(),
	timestamp: v.string(),
})

export type Reminder = v.InferOutput<typeof individualReminderSchema>

const savedRemindersSchema = v.record(v.string(), individualReminderSchema)
type SavedReminders = v.InferOutput<typeof savedRemindersSchema>

export async function getAllStorageLocalData() {
	// @ts-expect-error -- the TSDoc says `null` is valid, but the ts types seem to conflict with that?
	return chrome.storage.local.get(null).then((res) => {
		const parsed = v.parse(savedRemindersSchema, res)
		return parsed
	})
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: RootComponent,
		loader: (opts) => {
			// TODO: move this to the `index.tsx` loader so that we can at least pre-render some of the UI and a Skeleton
			return Promise.allSettled([
				opts.context.queryClient.ensureQueryData(queries.getTabs()),
				opts.context.queryClient.ensureQueryData(queries.getReminders()),
			])
		},
	},
)

export interface DOMMessageResponse {
	headlines: string[]
}

async function getCurrentTabDetails() {
	return new Promise<{
		tabs: chrome.tabs.Tab[]
		questionUrl?: string
		problemTitle?: string
		keyToSave?: string
	} | null>((resolve) => {
		// We can't use "chrome.runtime.sendMessage" for sending messages from the `popup.html`.
		// For sending messages from React we need to specify which tab to send it to.
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			(tabs) => {
				const currentTab = tabs[0]
				if (!currentTab) {
					resolve(null)
					return
				}

				const questionUrl = (currentTab.url ?? '').replace('/submissions', '')

				const returnObject: {
					tabs: chrome.tabs.Tab[]
					questionUrl: string
					problemTitle?: string
					keyToSave?: string
				} = {
					tabs,
					questionUrl,
				}

				/*
				  Sends a single message to the content script(s) in the specified tab,
				  with an optional callback to run when a response is sent back.
				  The runtime.onMessage event registered in `DomEvaluator` is fired in each content script
				  running in the specified tab for the current extension.
				 */
				chrome.tabs.sendMessage(
					currentTab.id ?? 0, // Current tab ID
					{ type: 'GET_DOM' }, // Message type,
					undefined,
					// Callback executed when the content script sends a response
					(response: DOMMessageResponse) => {
						console.log(
							'DomEvaluator response in getCurrentTabDetails:',
							response,
						)
						// TODO: do we even need this any more?
						resolve(returnObject)
					},
				)
			},
		)
	})
}

const millisecondsPerDay = 1000 * 60 * 60 * 24

// TODO: is there a more performant way to wind up sorted the dates?
export function dateDiffInDays(a: Date, b: Date) {
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

	return Math.floor((utc2 - utc1) / millisecondsPerDay)
}

export function sortByDaysRemainingBeforeReminder(reminders: SavedReminders) {
	const array = Object.entries(reminders)

	return array.sort((a, b) => {
		const daysSinceA =
			Number(a[1].daysUntilDue) -
			dateDiffInDays(new Date(a[1].timestamp), new Date())
		const daysSinceB =
			Number(b[1].daysUntilDue) -
			dateDiffInDays(new Date(b[1].timestamp), new Date())

		return daysSinceA - daysSinceB
	})
}

export const queries = {
	base: () => ['chrome'],
	getTabs: () =>
		queryOptions({
			queryFn: getCurrentTabDetails,
			queryKey: [...queries.base(), 'tabs'],
		}),
	getReminders: () =>
		queryOptions({
			queryFn: getAllStorageLocalData,
			queryKey: [...queries.base(), 'reminders'],
		}),
}

// TODO: move into a centralized utility file?
export function parseUrl(url: string) {
	const urlObj = new URL(url)
	const { pathname } = urlObj

	const pathParts = pathname.split('/')
	// TODO: rather than assign this to an empty string, we should probably throw an error or something
	const problemName = pathParts[2] ?? ''

	return problemName
}

// TODO: move most of this logic directly into `parseUrl`
function getReminderInfo(tabs: chrome.tabs.Tab[]) {
	const currentTab = tabs[0]
	if (!currentTab) return

	if (currentTab.url?.includes('greatfrontend')) {
		const greatFrontend = currentTab.title?.split('|')[0]?.trim() ?? ''
		console.log(greatFrontend)
		// unformattedTitle eventually gets used to set a `key`, so cannot have empty spaces or illegal characters
		let unformattedTitle = greatFrontend.toLowerCase().replace(/\s/g, '-')
		if (unformattedTitle.endsWith('-')) {
			unformattedTitle = unformattedTitle.slice(0, -1)
		}
		return unformattedTitle
	} else {
		// this block handles leetcode titles
		const unformattedTitle = parseUrl(currentTab.url ?? '')
		return unformattedTitle
	}
}

function RootComponent() {
	return (
		<TooltipProvider delayDuration={150}>
			<Outlet />
			<Toaster />
		</TooltipProvider>
	)
}
