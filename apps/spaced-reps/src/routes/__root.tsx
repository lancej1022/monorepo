import { useEffect } from 'react'

import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
	component: RootComponent,
})

export interface DOMMessageResponse {
	headlines: string[]
}

function handleInitialPageLoad() {
	// if (isLocal) {
	// 	getAllStorageLocalData();
	// 	return;
	// }
	/**
	 * We can't use "chrome.runtime.sendMessage" for sending messages from the `popup.html`.
	 * For sending messages from React we need to specify which tab to send it to.
	 */
	// TODO: turn this into a Promise so it can be handled with React Query + root loader
	chrome.tabs.query(
		{
			active: true,
			currentWindow: true,
		},
		(tabs) => {
			if (!tabs[0]) return
			console.log('tabs[0]', tabs[0])
			// setReminderInfo(tabs)

			// getAllStorageLocalData();

			let questionUrl = tabs[0].url ?? ''
			if (questionUrl.includes('/submissions')) {
				questionUrl = questionUrl.replace('/submissions', '')
			}
			// setUrl(questionUrl)
			console.log({ questionUrl })
			/**
			 * Sends a single message to the content script(s) in the specified tab,
			 * with an optional callback to run when a response is sent back.
			 * The runtime.onMessage event registered in `DomEvaluator` is fired in each content script
			 * running in the specified tab for the current extension.
			 */
			chrome.tabs.sendMessage(
				tabs[0].id ?? 0, // Current tab ID
				{ type: 'GET_DOM' }, // Message type,
				undefined,
				// { type: 'GET_DOM' } as DOMMessage, // Message type
				// Callback executed when the content script sends a response
				(response: DOMMessageResponse) => {
					console.log(
						'DomEvaluator response in handleInitialPageLoad',
						response,
					)
					if (
						tabs[0]?.url?.includes('educative') &&
						tabs[0].title?.startsWith('Problem Challenge')
					) {
						// get rid of things like ` (hard)#` from the h2 heading `Permutation in a String (hard)#`
						const problemTitle =
							response.headlines[0]?.replace(/\s\((.*)/g, '') ?? ''
						const keyToSave = problemTitle.toLowerCase().replace(/\s/g, '-')
						// setTitle(problemTitle)
						console.log({ problemTitle })
						// setUnformattedTitle(keyToSave)
						console.log({ keyToSave })
					}
				},
			)
		},
	)
}

function RootComponent() {
	// useEffect(() => {
	// 	handleInitialPageLoad()
	// }, [])

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
