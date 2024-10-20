import * as React from 'react'

import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import { cn } from '@/utils/cn'

const alertVariants = cva(
	'relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
	{
		variants: {
			variant: {
				default: 'bg-gray-2 text-foreground',
				destructive: 'border-red-6 bg-red-2 text-destructive [&>svg]:text-destructive',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		className={cn(alertVariants({ variant }), className)}
		ref={ref}
		role='alert'
		{...props}
	/>
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
	<h5
		className={cn('mb-1 font-medium leading-none tracking-tight', className)}
		ref={ref}
		{...props}
	>
		{children}
	</h5>
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div className={cn('text-sm [&_p]:leading-relaxed', className)} ref={ref} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
