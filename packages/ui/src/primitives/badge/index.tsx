import * as React from 'react'

import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'hover:bg-primary-9 border-transparent bg-primary text-primary-foreground shadow',
				secondary:
					'hover:bg-secondary-9 border-transparent bg-secondary text-secondary-foreground',
				destructive:
					'hover:bg-destructive-9 border-transparent bg-destructive text-destructive-foreground shadow',
				outline: 'text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

/**
 * A badge is a small status descriptor for UI elements.
 * @param props The badge props.
 * @param props.className The className to apply to the badge.
 * @param props.variant The variant of the badge.
 * @returns The badge component.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	)
}

export { Badge, badgeVariants }
