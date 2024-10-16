import { queryOptions } from '@tanstack/react-query'
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
		questionUrl: string
	} | null>((resolve) => {
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

				resolve({
					tabs,
					questionUrl,
				})
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
