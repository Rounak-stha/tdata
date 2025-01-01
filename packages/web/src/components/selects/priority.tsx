import { useState } from 'react'

import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Priority } from '@/types/kanban'
import { cn } from '@/lib/utils'

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
	onChange?: (value: Priority) => void
	type?: 'icon' | 'default'
}

export function PrioritySelect({ priority: initialPriority, onChange, type = 'default' }: PrioritySelectProps) {
	const [priority, setPriority] = useState<Priority>(initialPriority || 'LOW')
	const Icon = priorityIcons[priority]

	const handleChange = (priority: Priority) => {
		setPriority(priority)
		if (onChange) onChange(priority)
	}

	return (
		<Select value={priority} onValueChange={handleChange}>
			<SelectTrigger
				className={cn('w-fit h-8 p-0 px-2 flex items-center justify-center', {
					'[&>svg]:mt-0.5': type == 'default',
					'[&>svg]:hidden': type == 'icon'
				})}
			>
				<SelectValue asChild>
					<p className={cn('flex items-center space-x-2', { 'mr-2': type == 'default' })}>
						<Icon className={`h-4 w-4 ${priorityColors[priority]}`} />
						{type == 'default' && <span className='text-sm'>{priorityMap[priority]}</span>}
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
