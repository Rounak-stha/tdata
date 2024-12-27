import { CheckCircle2, CircleDashed, CircleDot, Circle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Status } from '@/types/kanban'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const statusIcons = {
	BACKLOG: CircleDashed,
	TODO: Circle,
	IN_PROGRESS: CircleDot,
	DONE: CheckCircle2
}

const statusColors = {
	BACKLOG: 'text-slate-500',
	TODO: 'text-blue-500',
	IN_PROGRESS: 'text-yellow-500',
	DONE: 'text-green-500'
}

interface StatusSelectProps {
	value: Status
	onChange: (value: Status) => void
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
	const Icon = statusIcons[value]
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Select value={value} onValueChange={onChange}>
						<SelectTrigger className='w-8 h-8 p-0 flex items-center justify-center [&>svg]:hidden'>
							<SelectValue>
								<Icon className={`h-4 w-4 ${statusColors[value]}`} />
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Object.entries(statusIcons).map(([status, StatusIcon]) => (
								<SelectItem key={status} value={status}>
									<div className='flex items-center'>
										<StatusIcon className={`mr-2 h-4 w-4 ${statusColors[status as Status]}`} />
										{status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</TooltipTrigger>
				<TooltipContent>
					<p>{value.charAt(0) + value.slice(1).toLowerCase().replace('_', ' ')}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
