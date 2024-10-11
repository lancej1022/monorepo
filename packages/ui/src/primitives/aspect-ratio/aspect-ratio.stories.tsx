import { type Meta, type StoryObj } from '@storybook/react'

import { AspectRatio } from './'

const meta: Meta<typeof AspectRatio> = {
	component: AspectRatio,
	args: {
		ratio: 16 / 9,
	},
}

export default meta

type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
	render: (args) => (
		<div className='w-[400px]'>
			<AspectRatio {...args} className='bg-muted'>
				<img
					alt='By Drew Beamer'
					className='rounded-md object-cover'
					src='https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
				/>
			</AspectRatio>
		</div>
	),
}
