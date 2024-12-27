import { Label } from '@/components/ui/label'
import { StatusSelect } from './selects/status'
import { PrioritySelect } from './selects/priority'
import { DatePicker } from './date-picker'
import { AssigneeSelect } from './selects/assignee'
import type { Task } from '@/types/kanban'

interface TaskPropertiesProps {
	task: Task
	onUpdate: (updates: Partial<Task>) => void
}

export function TaskProperties({ task, onUpdate }: TaskPropertiesProps) {
	return (
		<div className='space-y-6 bg-muted/30 rounded-lg p-4'>
			<h3 className='text-sm font-medium'>Properties</h3>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label className='text-xs text-muted-foreground'>Status</Label>
					<StatusSelect value={task.status} onChange={(status) => onUpdate({ status })} />
				</div>
				<div className='space-y-2'>
					<Label className='text-xs text-muted-foreground'>Priority</Label>
					<PrioritySelect value={task.priority} onChange={(priority) => onUpdate({ priority })} />
				</div>
				<div className='space-y-2'>
					<Label className='text-xs text-muted-foreground'>Assignee</Label>
					<AssigneeSelect
						value={task.assignee?.id}
						onSelect={(assigneeId) => {
							const newAssignee = assigneeId
								? { id: assigneeId, name: assigneeId, email: 'test@email.com' }
								: undefined
							onUpdate({ assignee: newAssignee })
						}}
					/>
				</div>
				<div className='space-y-2'>
					<Label className='text-xs text-muted-foreground'>Due Date</Label>
					<DatePicker
						date={task.dueDate ? new Date(task.dueDate) : undefined}
						onSelect={(date) => onUpdate({ dueDate: date?.toISOString() })}
					/>
				</div>
			</div>
		</div>
	)
}
