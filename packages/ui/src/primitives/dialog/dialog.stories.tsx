import { CopyIcon } from '@radix-ui/react-icons'
import { type Meta, type StoryObj } from '@storybook/react'

import { Button } from '@/primitives/button'
import { Input } from '@/primitives/input'
import { Label } from '@/primitives/label'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '.'

const meta: Meta<typeof Dialog> = {
	component: Dialog,
	render: (args) => (
		<Dialog {...args}>
			<DialogTrigger asChild>
				<Button variant='outline'>Edit Profile</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='name'>
							Name
						</Label>
						<Input className='col-span-3' id='name' value='Pedro Duarte' />
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label className='text-right' htmlFor='username'>
							Username
						</Label>
						<Input className='col-span-3' id='username' value='@peduarte' />
					</div>
				</div>
				<DialogFooter>
					<Button type='submit'>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {}

export const CustomCloseButton: Story = {
	render: (args) => (
		<Dialog {...args}>
			<DialogTrigger asChild>
				<Button variant='outline'>Share</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Share link</DialogTitle>
					<DialogDescription>
						Anyone who has this link will be able to view this.
					</DialogDescription>
				</DialogHeader>
				<div className='flex items-center space-x-2'>
					<div className='grid flex-1 gap-2'>
						<Label className='sr-only' htmlFor='link'>
							Link
						</Label>
						<Input
							defaultValue='https://ui.shadcn.com/docs/installation'
							id='link'
							readOnly
						/>
					</div>
					<Button className='px-3' size='sm' type='submit'>
						<span className='sr-only'>Copy</span>
						<CopyIcon className='size-4' />
					</Button>
				</div>
				<DialogFooter className='sm:justify-start'>
					<DialogClose asChild>
						<Button type='button' variant='outline'>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
}
