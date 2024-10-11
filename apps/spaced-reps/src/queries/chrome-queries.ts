import { queryOptions } from '@tanstack/react-query'
import { type DOMMessageResponse } from 'src/dom-evaluator'
import * as v from 'valibot'

const individualReminderSchema = v.object({
	daysUntilDue: v.number(),
	notes: v.optional(v.string()),
	title: v.string(),
	timestamp: v.string(),
})

export type Reminder = v.InferOutput<typeof individualReminderSchema>

const savedRemindersSchema = v.record(v.string(), individualReminderSchema)
export type SavedReminders = v.InferOutput<typeof savedRemindersSchema>

export async function getAllStorageLocalData() {
	// @ts-expect-error -- the TSDoc says `null` is valid, but the ts types seem to conflict with that?
	return chrome.storage.local.get(null).then((res) => {
		const parsed = v.parse(savedRemindersSchema, res)
		return parsed
	})
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
