import { useState } from 'react'

import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Priority } from '@/types/kanban'
import { cn } from '@/lib/utils'
import { ChangeParams } from '@/types'

const priorityIcons = {
	LOW: ArrowDown,
	MEDIUM: ArrowRight,
	HIGH: ArrowUp
}

const priorityColors = {
	LOW: 'text-green-500',
	MEDIUM: 'text-yellow-500',
	HIGH: 'text-red-500'
}

const priorityMap: Record<Priority, string> = {
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High'
}

interface PrioritySelectProps {
	priority?: Priority
	onChange?: (change: ChangeParams<Priority>) => void
	size?: 'icon' | 'default' | 'full'
	isLoading?: boolean
}

export function PrioritySelect({
	priority: initialPriority,
	onChange,
	size = 'default',
	isLoading
}: PrioritySelectProps) {
	const [priority, setPriority] = useState<Priority>(initialPriority || 'LOW')
	const Icon = priorityIcons[priority]

	const handleChange = (newValue: Priority) => {
		setPriority(newValue)
		if (onChange) onChange({ newValue, previousValue: priority })
	}

	return (
		<Select value={priority} onValueChange={handleChange}>
			<SelectTrigger
				className={cn('h-10 p-0 px-2', {
					'w-fit': size == 'default' || size == 'icon',
					'w-full': size == 'full',
					'[&>svg]:hidden': isLoading || size == 'icon',
					'[&>svg]:mt-0.5': !isLoading || size != 'icon'
				})}
			>
				<SelectValue asChild>
					<p className={cn('flex items-center space-x-2', { 'mr-2': size != 'icon' })}>
						<Icon className={`h-4 w-4 ${priorityColors[priority]}`} />
						{size != 'icon' && <span className='text-sm'>{priorityMap[priority]}</span>}
					</p>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.entries(priorityIcons).map(([priority, PriorityIcon]) => (
					<SelectItem key={priority} value={priority}>
						<div className='flex items-center'>
							<PriorityIcon className={`mr-2 h-4 w-4 ${priorityColors[priority as Priority]}`} />
							{priority.charAt(0) + priority.slice(1).toLowerCase()}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
