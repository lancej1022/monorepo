import { useEffect } from 'react'

import type { QueryClient } from '@tanstack/react-query'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// /**
//  * @description Promise-based wrapper around chrome.storage.local.set. Sets or overwrites a reminder in the chrome extension storage.
//  * @param key the name of the reminder, as a string
//  * @param userResponse necessary form data to update a reminder
//  * @returns void
//  */
// export function updateExistingReminder(
// 	key: string,
// 	userResponse: ReminderInterface,
// ): Promise<void> {
// 	return new Promise((resolve, reject) => {
// 		if (isLocal) {
// 			resolve()
// 		} else {
// 			chrome.storage.local.set({ [key]: userResponse }, function () {
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

export async function getAllStorageLocalData() {
	// TODO: this is returning an empty object, probably just because we havent saved anything yet
	// @ts-expect-error -- the TSDoc says `null` is valid, but the ts types seem to conflict with that?
	return chrome.storage.local.get(null).then((res) => {
		console.log('local.get res:', res)
		return res
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
		/**
		 * We can't use "chrome.runtime.sendMessage" for sending messages from the `popup.html`.
		 * For sending messages from React we need to specify which tab to send it to.
		 */
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

				// TODO: what to do with this?
				// void getAllStorageLocalData()

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

function parseUrl(url: string) {
	const urlObj = new URL(url)
	const { hostname, pathname } = urlObj

	const pathParts = pathname.split('/')
	// TODO: rather than assign this to an empty string, we should probably throw an error or something
	const problemName = pathParts[2] ?? ''
	let formattedTitle = problemName.replaceAll('-', ' ')
	// TODO: change this formatting to be `First Second Third` instead of `First second third`
	formattedTitle =
		(formattedTitle[0]?.toUpperCase() ?? '') + formattedTitle.slice(1)

	return { pathname, hostname, unformattedTitle: problemName, formattedTitle }
}

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
		return { title: greatFrontend, unformattedTitle }
	} else {
		// this block handles leetcode titles
		const { unformattedTitle, formattedTitle } = parseUrl(currentTab.url ?? '')
		return { title: formattedTitle, unformattedTitle }
	}
}

function RootComponent() {
	// const [reminderInfo, setReminderInfo] = useState()
	// TODO: move this to the `index.tsx` loader so that we can at least pre-render some of the UI and a Skeleton
	const { data } = useSuspenseQuery(queries.getTabs())

	useEffect(() => {
		if (!data) return
		console.log('data:', data)

		const res = getReminderInfo(data.tabs)
		console.log('getReminderInfo res:', res)
	}, [data])

	return (
		<>
			<Outlet />
			<TanStackRouterDevtools position='bottom-right' />
		</>
	)
}
