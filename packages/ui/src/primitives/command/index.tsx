'use client'

import * as React from 'react'

import { type DialogProps } from '@radix-ui/react-dialog'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'

import { Dialog, DialogContent } from '@/primitives/dialog'
import { cn } from '@/utils/cn'

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		className={cn(
			'flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
			className,
		)}
		ref={ref}
		{...props}
	/>
))
Command.displayName = CommandPrimitive.displayName

type CommandDialogProps = DialogProps

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent className='overflow-hidden p-0'>
				<Command>{children}</Command>
			</DialogContent>
		</Dialog>
	)
}

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div className='flex items-center border-b px-3'>
		<MagnifyingGlassIcon className='mr-2 size-4 shrink-0 opacity-50' />
		<CommandPrimitive.Input
			className={cn(
				'flex h-10 w-full rounded-md border-transparent bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-transparent focus:shadow-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			ref={ref}
			{...props}
		/>
	</div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
		ref={ref}
		{...props}
	/>
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
	<CommandPrimitive.Empty className='py-6 text-center text-sm' ref={ref} {...props} />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		className={cn(
			'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
			className,
		)}
		ref={ref}
		{...props}
	/>
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		className={cn('-mx-1 h-px bg-border', className)}
		ref={ref}
		{...props}
	/>
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		className={cn(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled="true"]:pointer-events-none data-[disabled="true"]:opacity-50',
			className,
		)}
		ref={ref}
		{...props}
	/>
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
			{...props}
		/>
	)
}
CommandShortcut.displayName = 'CommandShortcut'

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
}
