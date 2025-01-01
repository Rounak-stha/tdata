import { CheckCircle2, CircleDashed, CircleDot, Circle, BanIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Status } from '@/types/kanban'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const statusIcons = {
	Backlog: CircleDashed,
	ToDo: Circle,
	InProgress: CircleDot,
	Done: CheckCircle2,
	Cancelled: BanIcon
}

const statusColors = {
	Backlog: 'text-slate-500',
	ToDo: 'text-blue-500',
	InProgress: 'text-yellow-500',
	Done: 'text-green-500',
	Cancelled: 'text-red-500'
}

interface StatusSelectProps {
	status?: Status
	onChange?: (value: Status) => void
	type?: 'icon' | 'default'
}

export function StatusSelect({ status: InitialStatus, onChange, type = 'default' }: StatusSelectProps) {
	const [status, setStatus] = useState<Status>(InitialStatus || 'Backlog')
	const Icon = statusIcons[status]

	const handleChange = (status: Status) => {
		setStatus(status)
		if (onChange) onChange(status)
	}
	return (
		<Select value={status} onValueChange={handleChange}>
			<SelectTrigger
				className={cn('w-fit h-8 p-0 px-2 flex items-center justify-center', {
					'[&>svg]:mt-0.5': type == 'default',
					'[&>svg]:hidden': type == 'icon'
				})}
			>
				<SelectValue asChild>
					<p className={cn('flex items-center space-x-2', { 'mr-2': type == 'default' })}>
						<Icon className={`h-4 w-4 ${statusColors[status]}`} />
						{type == 'default' && <span className='text-sm'>{status}</span>}
					</p>
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
	)
}
