import type { QueryClient } from '@tanstack/react-query'

import { queryOptions } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import * as v from 'valibot'

import { TooltipProvider } from '@monorepo/ui/tooltip'

// /**
//  * @description Promise-based wrapper around chrome.storage.local.remove. Permanently removes a reminder from the list of reminders.
//  * @param key the name of the reminder, as a string
//  * @returns void
//  */
// export function removeReminder(key: string): Promise<void> {
// 	return new Promise((resolve, reject) => {
// 		if (isLocal) {
// 			resolve()
// 		} else {
// 			// TODO: we should do an optimistic delete that doesnt require refetching the entire storage
// 			chrome.storage.local.remove(key, () => {
// 				// Pass any observed errors down the promise chain.
// 				if (chrome.runtime.lastError) {
// 					console.log('chrome.runtime.lastError:', chrome.runtime.lastError)
// 					reject(chrome.runtime.lastError)
// 					return
// 				}

// 				resolve()
// 			})
// 		}
// 	})
// }

const individualReminderSchema = v.object({
	daysUntilDue: v.number(),
	notes: v.optional(v.string()),
	title: v.string(),
	timestamp: v.string(),
})

export type Reminder = v.InferOutput<typeof individualReminderSchema>

const savedRemindersSchema = v.record(v.string(), individualReminderSchema)

export async function getAllStorageLocalData() {
	// @ts-expect-error -- the TSDoc says `null` is valid, but the ts types seem to conflict with that?
	return chrome.storage.local.get(null).then((res) => {
		const parsed = v.parse(savedRemindersSchema, res)
		return parsed
	})

	// helpers.testSize(items);
	// 		console.log('saved reminders', Object.entries(items))
	// 		const itemsArr: [string, Record<string, unknown>][] =
	// 			Object.entries(items)
	// 		helpers.sortByDaysRemainingBeforeReminder(itemsArr)
	// 		// Pass the data retrieved from storage down the promise chain.
	// 		resolve(itemsArr)
	// 	})
	// 	// }
	// })
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
