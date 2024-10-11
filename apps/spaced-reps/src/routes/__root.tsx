import type { QueryClient } from '@tanstack/react-query'

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@monorepo/ui/tooltip'

import { parseUrl } from '../utils/parseUrl'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		component: RootComponent,
	},
)

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
