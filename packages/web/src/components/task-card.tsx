import { Card } from '@/components/ui/card'
import { StatusSelect } from '@components/selects/status'
import { PrioritySelect } from '@components/selects/priority'
import { DatePicker } from './date-picker'
import { AssigneeSelect } from '@components/selects/assignee'
import type { Task } from '../types/kanban'
import Link from 'next/link'

interface TaskCardProps {
	task: Task
	onUpdate: (updatedTask: Task) => void
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
	const handleStatusChange = (newStatus: Task['status']) => {
		onUpdate({ ...task, status: newStatus })
	}

	const handlePriorityChange = (newPriority: Task['priority']) => {
		onUpdate({ ...task, priority: newPriority })
	}

	const handleDateChange = (newDate: Date | undefined) => {
		onUpdate({ ...task, dueDate: newDate?.toISOString() })
	}

	const handleAssigneeChange = (newAssigneeId: string) => {
		console.log(newAssigneeId)
		const newAssignee = newAssigneeId ? { id: newAssigneeId, name: newAssigneeId } : undefined
		onUpdate({ ...task, assignee: newAssignee })
	}

	return (
		<Card className='p-4 cursor-pointer bg-background hover:bg-accent/50 transition-colors border shadow-sm'>
			<div className='flex items-center justify-between mb-2'>
				<span className='text-xs text-muted-foreground font-mono'>{task.id}</span>
				<AssigneeSelect value={task.assignee?.id} onSelect={handleAssigneeChange} />
			</div>
			<Link href={`/task/${task.id}`} className='block'>
				<h3 className='text-sm font-medium leading-none mb-3 hover:underline'>{task.title}</h3>
			</Link>
			<div className='flex items-center gap-2'>
				<StatusSelect value={task.status} onChange={handleStatusChange} />
				<PrioritySelect value={task.priority} onChange={handlePriorityChange} />
				<DatePicker
					date={task.dueDate ? new Date(task.dueDate) : undefined}
					onSelect={handleDateChange}
					className='h-8 text-xs'
				/>
			</div>
		</Card>
	)
}
