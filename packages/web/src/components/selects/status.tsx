import { CheckCircle2, CircleDashed, CircleDot, Circle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Status } from '@/types/kanban'
import { useState } from 'react'

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

const StatusMap: Record<Status, string> = {
	BACKLOG: 'Backlog',
	TODO: 'To Do',
	IN_PROGRESS: 'In Progress',
	DONE: 'Done'
}

interface StatusSelectProps {
	status?: Status
	onChange?: (value: Status) => void
}

export function StatusSelect({ status: InitialStatus, onChange }: StatusSelectProps) {
	const [status, setStatus] = useState<Status>(InitialStatus || 'BACKLOG')
	const Icon = statusIcons[status]

	const handleChange = (status: Status) => {
		setStatus(status)
		if (onChange) onChange(status)
	}
	return (
		<Select value={status} onValueChange={handleChange}>
			<SelectTrigger className='w-fit h-8 p-0 px-2 flex items-center justify-center  [&>svg]:mt-0.5'>
				<SelectValue asChild>
					<p className='flex items-center space-x-2 mr-2'>
						<Icon className={`h-4 w-4 ${statusColors[status]}`} />
						<span className='text-sm'>{StatusMap[status]}</span>
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
