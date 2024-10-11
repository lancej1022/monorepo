import { type Meta, type StoryObj } from '@storybook/react'

import { Label } from '@/primitives/label'

import { RadioGroup, RadioGroupItem } from '.'

const meta: Meta<typeof RadioGroup> = {
	component: RadioGroup,
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
	args: {
		defaultValue: 'option-one',
	},
	render: (args) => (
		<RadioGroup {...args}>
			<div className='flex items-center space-x-2'>
				<RadioGroupItem id='option-one' value='option-one' />
				<Label htmlFor='option-one'>Option One</Label>
			</div>
			<div className='flex items-center space-x-2'>
				<RadioGroupItem id='option-two' value='option-two' />
				<Label htmlFor='option-two'>Option Two</Label>
			</div>
		</RadioGroup>
	),
}
