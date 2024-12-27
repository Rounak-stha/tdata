'use client'

import { useState } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { BoardColumn } from './board-column'
import { ThemeToggle } from './theme-toggle'
import type { Column, Task } from '../types/kanban'

const INITIAL_TASKS: Task[] = [
	{
		id: 'TASK-1',
		title: 'Design system implementation',
		status: 'BACKLOG',
		priority: 'HIGH',
		projectId: 'PROJ-1',
		dueDate: '2024-01-20',
		assignee: {
			id: 'USER-1',
			name: 'Alice',
			avatar: '/placeholder.svg?height=32&width=32',
			email: 'tets@email.com'
		}
	},
	{
		id: 'TASK-2',
		title: 'API integration',
		status: 'TODO',
		priority: 'MEDIUM',
		projectId: 'PROJ-1',
		dueDate: '2024-01-25',
		assignee: {
			id: 'USER-2',
			name: 'Bob',
			avatar: '/placeholder.svg?height=32&width=32',
			email: 'tets@email.com'
		}
	},
	{
		id: 'TASK-3',
		title: 'User authentication flow',
		status: 'IN_PROGRESS',
		priority: 'HIGH',
		projectId: 'PROJ-1',
		dueDate: '2024-01-30'
	},
	{
		id: 'TASK-4',
		title: 'Dashboard analytics',
		status: 'DONE',
		priority: 'LOW',
		projectId: 'PROJ-1',
		assignee: {
			id: 'USER-3',
			name: 'Charlie',
			avatar: '/placeholder.svg?height=32&width=32',
			email: 'tets@email.com'
		}
	}
]

export function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)

	const columns: Column[] = [
		{ id: 'BACKLOG', title: 'Backlog', tasks: tasks.filter((t) => t.status === 'BACKLOG') },
		{ id: 'TODO', title: 'To Do', tasks: tasks.filter((t) => t.status === 'TODO') },
		{ id: 'IN_PROGRESS', title: 'In Progress', tasks: tasks.filter((t) => t.status === 'IN_PROGRESS') },
		{ id: 'DONE', title: 'Done', tasks: tasks.filter((t) => t.status === 'DONE') }
	]

	const handleTaskUpdate = (updatedTask: Task) => {
		setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
	}

	return (
		<div className='h-full flex-1 flex-col space-y-8 p-8 md:flex'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-2xl font-medium tracking-tight'>Project Board</h2>
					<p className='text-muted-foreground'>Manage and track your project tasks</p>
				</div>
				<ThemeToggle />
			</div>
			<ScrollArea className='h-full w-full rounded-md border bg-muted/20 p-4'>
				<div className='flex gap-4'>
					{columns.map((column) => (
						<BoardColumn key={column.id} column={column} onTaskUpdate={handleTaskUpdate} />
					))}
				</div>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
		</div>
	)
}
