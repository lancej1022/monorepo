import { type Meta, type StoryObj } from '@storybook/react'

import { Button } from '@/primitives/button'
import { Input } from '@/primitives/input'
import { Label } from '@/primitives/label'

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '.'

const meta: Meta<typeof SheetContent> = {
	component: SheetContent,
	args: {
		side: 'right',
	},
	argTypes: {
		side: {
			options: ['left', 'right', 'top', 'bottom'],
			control: { type: 'select' },
		},
	},
}

export default meta

type Story = StoryObj<typeof SheetContent>

export const Default: Story = {
	render: (args) => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='outline'>Open</Button>
			</SheetTrigger>
			<SheetContent {...args}>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</SheetDescription>
				</SheetHeader>
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
				<SheetFooter>
					<SheetClose asChild>
						<Button type='submit'>Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
}
