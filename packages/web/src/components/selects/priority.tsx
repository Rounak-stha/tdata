import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Priority } from '@/types/kanban'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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

interface PrioritySelectProps {
	value: Priority
	onChange: (value: Priority) => void
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
	const Icon = priorityIcons[value]
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Select value={value} onValueChange={onChange}>
						<SelectTrigger className='w-8 h-8 p-0 flex items-center justify-center [&>svg]:hidden'>
							<SelectValue>
								<Icon className={`h-4 w-4 ${priorityColors[value]}`} />
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Object.entries(priorityIcons).map(([priority, PriorityIcon]) => (
								<SelectItem key={priority} value={priority}>
									<div className='flex items-center'>
										<PriorityIcon
											className={`mr-2 h-4 w-4 ${priorityColors[priority as Priority]}`}
										/>
										{priority.charAt(0) + priority.slice(1).toLowerCase()}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</TooltipTrigger>
				<TooltipContent>
					<p>{value.charAt(0) + value.slice(1).toLowerCase()} Priority</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
