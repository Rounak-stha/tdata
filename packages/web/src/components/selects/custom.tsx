import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon, XIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@components/ui/command'
import { ChangeParams, TaskPropertyValue } from '@/types'

const MAX_VALUE_TO_DISPLAY = 3

interface CustomValueSelectProps {
	value?: TaskPropertyValue
	options: string[]
	onChange?: (change: ChangeParams<TaskPropertyValue>) => void
	size?: 'default' | 'full'
	isLoading?: boolean
	multiSelect?: boolean
}

export const CustomValueSelect: FC<CustomValueSelectProps> = ({ multiSelect, value, ...rest }) => {
	if (multiSelect) return <MultiSelect value={value as string[]} {...rest} />
	return <SingleValueSelect value={value as string} {...rest} />
}

type SingleSelectProps = Omit<CustomValueSelectProps, 'multiSelect' | 'value'> & { value?: string }

export function SingleValueSelect({
	value: initialValue,
	options,
	onChange,
	size = 'default',
	isLoading
}: SingleSelectProps) {
	const [value, setValue] = useState(initialValue)

	const handleChange = (newValue: string) => {
		setValue(newValue)
		if (onChange) onChange({ previousValue: value || '', newValue: newValue })
	}

	return (
		<Select value={initialValue} onValueChange={handleChange}>
			<SelectTrigger
				disabled={isLoading}
				className={cn('h-10 p-0 px-2', {
					'w-fit': size == 'default',
					'w-full': size == 'full'
				})}
			>
				<SelectValue placeholder='Select Value'>
					{isLoading ? (
						<span className='w-16 !flex justify-center'>
							<LoaderCircleIcon className='animate-spin h-4 w-4' />
						</span>
					) : (
						<p className='flex items-center space-x-2 text-sm mr-2'>{value}</p>
					)}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

type MultiSelectProps = Omit<CustomValueSelectProps, 'multiSelect' | 'value'> & { value?: string[] }

export function MultiSelect({ value: initialValue, options, onChange }: MultiSelectProps) {
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<string[]>(initialValue || [])

	const handleSelect = (option: string) => {
		const updatedSelection = selected.some((item) => item === option)
			? selected.filter((item) => item !== option)
			: [...selected, option]
		setSelected(updatedSelection)
		if (onChange) onChange({ newValue: updatedSelection, previousValue: selected })
	}

	const handleRemove = (option: string, e?: React.MouseEvent) => {
		e?.preventDefault()
		e?.stopPropagation()
		const updatedSelection = selected.filter((o) => o !== option)
		setSelected(updatedSelection)
		if (onChange) onChange({ newValue: updatedSelection, previousValue: selected })
	}

	const displayedTags = selected.slice(0, MAX_VALUE_TO_DISPLAY)
	const remainingTagsCount = Math.max(0, selected.length - MAX_VALUE_TO_DISPLAY)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full h-10 justify-between bg-inherit hover:bg-inherit px-2'
				>
					<div className='flex flex-wrap gap-1 items-center'>
						{displayedTags.map((option) => (
							<Badge key={option} variant='secondary' className='mr-1'>
								{option}
								<button
									className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleRemove(option)
										}
									}}
									onMouseDown={(e) => handleRemove(option, e)}
									onClick={(e) => handleRemove(option, e)}
								>
									<XIcon className='h-3 w-3 text-muted-foreground hover:text-foreground' />
								</button>
							</Badge>
						))}
						{remainingTagsCount > 0 && <Badge variant='secondary'>+{remainingTagsCount} more</Badge>}
						{selected.length === 0 && <span className='text-muted-foreground'>Select Options</span>}
					</div>
					<ChevronsUpDownIcon className='h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search options...' />
					<CommandList>
						<CommandEmpty>No options found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem key={option} onSelect={() => handleSelect(option)}>
									<CheckIcon
										className={cn(
											'mr-2 h-4 w-4',
											selected.some((item) => item === option) ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{option}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
