import { useEffect } from 'react'

import type { QueryClient } from '@tanstack/react-query'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import {
	createRootRouteWithContext,
	Link,
	Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// import { isLocal } from '~/App';
// import { ReminderInterface } from '~/components/QuestionCard/QuestionCard';
// import helpers from '~/helpers';
// TODO: strip out the mocks when building for production because it drastically bloats the output JS bundle
// import mocks from '../mocks/questionMocks';

// /**
//  * @description Promise wrapper around the Chrome storage.local.get functionality, which is normally callback based.
//  * @returns Promise
//  */
// export function getAllStorageLocalData(): Promise<[string, ReminderInterface][]> {
//   // Immediately return a promise and start asynchronous work
//   return new Promise((resolve, reject) => {
//     let itemsArr: [string, ReminderInterface][] = [];
//     if (isLocal) {
//       itemsArr = mocks.questionMocks.slice(0, 10);

//       helpers.sortByDaysRemainingBeforeReminder(itemsArr);

//       resolve(itemsArr);
//     } else {
//       // Asynchronously fetch all data from storage.sync.
//       chrome.storage.local.get(null, (items) => {
//         // Pass any observed errors down the promise chain.
//         if (chrome.runtime.lastError) {
//           return reject(chrome.runtime.lastError);
//         }

//         // helpers.testSize(items);
//         console.log('saved reminders', Object.entries(items));
//         const itemsArr: [string, ReminderInterface][] = Object.entries(items);
//         helpers.sortByDaysRemainingBeforeReminder(itemsArr);
//         // Pass the data retrieved from storage down the promise chain.
//         resolve(itemsArr);
//       });
//     }
//   });
// }

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: RootComponent,
		loader: (opts) => {
			return opts.context.queryClient.ensureQueryData(queries.getTabs)
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
		// if (isLocal) {
		// 	getAllStorageLocalData();
		// 	return;
		// }
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

				const returnObject: {
					tabs: chrome.tabs.Tab[]
					questionUrl?: string
					problemTitle?: string
					keyToSave?: string
				} = {
					tabs,
				}

				let questionUrl = currentTab.url ?? ''
				if (questionUrl.includes('/submissions')) {
					questionUrl = questionUrl.replace('/submissions', '')
				}
				returnObject.questionUrl = questionUrl
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
							'DomEvaluator response in getCurrentTabDetails',
							response,
						)
						resolve(returnObject)
					},
				)
			},
		)
	})
}

const queries = {
	base: ['tabs'],
	getTabs: queryOptions({
		queryFn: getCurrentTabDetails,
		queryKey: ['tabs'],
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
	const { data } = useSuspenseQuery(queries.getTabs)

	useEffect(() => {
		if (!data) return
		console.log('data:', data)

		const res = getReminderInfo(data.tabs)
		console.log({ res })
	}, [data])

	return (
		<>
			<div className='flex gap-2 p-2 text-lg'>
				<Link
					to='/'
					activeProps={{
						className: 'font-bold',
					}}
					activeOptions={{ exact: true }}
				>
					Home
				</Link>{' '}
				<Link
					to='/about'
					activeProps={{
						className: 'font-bold',
					}}
				>
					About
				</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools position='bottom-right' />
		</>
	)
}
