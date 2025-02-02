import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from './task-card'
import { useState } from 'react'
import { NewTaskPopup } from './new-task-popup'
import { TaskDetail } from '@/types/task'
import { WorkflowStatus } from '@/types/workflow'

interface BoardColumnProps {
	status: WorkflowStatus
	tasks: TaskDetail[]
	onTaskUpdate: (updatedTask: TaskDetail) => void
}

export function BoardColumn({ status, tasks, onTaskUpdate }: BoardColumnProps) {
	const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
	return (
		<div className='w-80 shrink-0'>
			<div className='mb-3 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<h2 className='text-sm font-medium'>{status.name}</h2>
					<span className='rounded-full bg-muted px-2 py-0.5 text-xs'>{tasks.length}</span>
				</div>
				<Button
					onClick={() => setNewTaskDialogOpen(true)}
					variant='ghost'
					size='icon'
					className='h-8 w-8 hover:bg-accent'
				>
					<Plus className='h-4 w-4' />
					<span className='sr-only'>Add task</span>
				</Button>
			</div>
			<div className='flex flex-col gap-2'>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
				))}
			</div>
			{newTaskDialogOpen && (
				<NewTaskPopup status={status} open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen} />
			)}
		</div>
	)
}
