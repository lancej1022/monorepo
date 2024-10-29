import { Moon, Sun } from 'lucide-react'

import { Button } from '@monorepo/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@monorepo/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@monorepo/ui/tooltip'

import { useTheme } from './theme-provider'

export function ThemeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button size='icon' variant='outline'>
							<Sun className='size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
							<Moon className='size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
							<span className='sr-only'>Toggle theme color</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Toggle theme color</p>
					</TooltipContent>
				</Tooltip>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem
					onClick={() => {
						setTheme('light')
					}}
				>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme('dark')
					}}
				>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setTheme('system')
					}}
				>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
