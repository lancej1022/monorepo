import { type Meta, type StoryObj } from '@storybook/react'

import { Separator } from '@/primitives/separator'

import { ScrollArea, ScrollBar } from '.'

const meta: Meta<typeof ScrollArea> = {
	component: ScrollArea,
	argTypes: {
		asChild: { control: { disable: true } },
	},
}

export default meta

type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${String(a.length - i)}`,
)

export const Default: Story = {
	render: (args) => (
		<ScrollArea {...args} className='h-72 w-48 rounded-md border'>
			<div className='p-4'>
				<h4 className='mb-4 text-sm font-medium leading-none'>Tags</h4>
				{tags.map((tag) => (
					<>
						<div className='text-sm' key={tag}>
							{tag}
						</div>
						<Separator className='my-2' />
					</>
				))}
			</div>
		</ScrollArea>
	),
}

interface Artwork {
	artist: string
	art: string
}

const works: Artwork[] = [
	{
		artist: 'Ornella Binni',
		art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
	},
	{
		artist: 'Tom Byrom',
		art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
	},
	{
		artist: 'Vladimir Malyavko',
		art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
	},
]

export const HorizontalScrolling: Story = {
	render: (args) => (
		<ScrollArea {...args} className='w-96 whitespace-nowrap rounded-md border'>
			<div className='flex w-max space-x-4 p-4'>
				{works.map((artwork) => (
					<figure className='shrink-0' key={artwork.artist}>
						<div className='overflow-hidden rounded-md'>
							<img
								alt={`By ${artwork.artist}`}
								className='aspect-[3/4] size-fit object-cover'
								height={400}
								src={artwork.art}
								width={300}
							/>
						</div>
						<figcaption className='pt-2 text-xs text-gray-11'>
							Photo by{' '}
							<span className='font-semibold text-foreground'>{artwork.artist}</span>
						</figcaption>
					</figure>
				))}
			</div>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	),
}
