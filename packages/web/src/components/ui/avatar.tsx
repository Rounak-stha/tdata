'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { UserIcon } from 'lucide-react'

const AvatarRoot = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
		{...props}
	/>
))
AvatarRoot.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-xs', className)}
		{...props}
	/>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

type AvatarProps = {
	src?: string | null
	alt?: string
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className: customCn }) => {
	const className = cn(
		{
			'h-4 w-4': size === 'sm',
			'h-6 w-6': size === 'md',
			'h-8 w-8': size == 'lg'
		},
		customCn
	)

	const fallbckClassName = cn({
		'p-0.5': size === 'sm',
		'p-1': size === 'md',
		'p-2': size == 'lg'
	})
	return (
		<AvatarRoot className={className}>
			<AvatarImage src={src || ''} alt={alt} />
			<AvatarFallback className={fallbckClassName}>
				<UserIcon />
			</AvatarFallback>
		</AvatarRoot>
	)
}

export { Avatar }
