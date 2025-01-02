'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type Option = {
	label: string
	value: string
}

interface MultiSelectProps {
	options: Option[]
	selected: string[]
	onChange: (selected: string[]) => void
	className?: string
	placeholder?: string
}

export function MultiSelect({
	options,
	selected,
	onChange,
	className,
	placeholder = 'Select items...'
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={cn('min-h-[2.5rem] h-auto', className)}
				>
					<div className='flex flex-wrap gap-1'>
						{selected.length === 0 && placeholder}
						{selected.map((value) => (
							<Badge
								variant='secondary'
								key={value}
								className='mr-1'
								onClick={(e) => {
									e.stopPropagation()
									onChange(selected.filter((s) => s !== value))
								}}
							>
								{options.find((opt) => opt.value === value)?.label}
								<button
									className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											onChange(selected.filter((s) => s !== value))
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault()
										e.stopPropagation()
									}}
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										onChange(selected.filter((s) => s !== value))
									}}
								>
									×
								</button>
							</Badge>
						))}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search items...' />
					<CommandEmpty>No item found.</CommandEmpty>
					<CommandGroup className='max-h-64 overflow-auto'>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								onSelect={() => {
									onChange(
										selected.includes(option.value)
											? selected.filter((s) => s !== option.value)
											: [...selected, option.value]
									)
								}}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
