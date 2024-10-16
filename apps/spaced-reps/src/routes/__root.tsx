import type { QueryClient } from '@tanstack/react-query'

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Rocket } from 'lucide-react'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@monorepo/ui/tooltip'
import { Typography } from '@monorepo/ui/typography'

import { ThemeProvider } from './-components/theme-provider'
import { ThemeToggle } from './-components/theme-toggle'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<ThemeProvider defaultTheme='dark'>
			<TooltipProvider delayDuration={150}>
				<div className='flex items-center justify-around gap-2'>
					<Rocket />
					<Typography className='text-3xl font-bold' variant='h1'>
						Spaced Reps
					</Typography>
					<ThemeToggle />
				</div>
				<Outlet />
				<Toaster />
			</TooltipProvider>
		</ThemeProvider>
	)
}
