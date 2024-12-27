import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from './task-card'
import type { Column, Task } from '../types/kanban'

interface BoardColumnProps {
	column: Column
	onTaskUpdate: (updatedTask: Task) => void
}

export function BoardColumn({ column, onTaskUpdate }: BoardColumnProps) {
	return (
		<div className='w-80 shrink-0'>
			<div className='mb-3 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<h2 className='text-sm font-medium'>{column.title}</h2>
					<span className='rounded-full bg-muted px-2 py-0.5 text-xs'>{column.tasks.length}</span>
				</div>
				<Button variant='ghost' size='icon' className='h-8 w-8 hover:bg-accent'>
					<Plus className='h-4 w-4' />
					<span className='sr-only'>Add task</span>
				</Button>
			</div>
			<div className='flex flex-col gap-2'>
				{column.tasks.map((task) => (
					<TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} />
				))}
			</div>
		</div>
	)
}
