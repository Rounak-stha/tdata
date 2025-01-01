'use client'

import { useState } from 'react'
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area'
import { BoardColumn } from '@components/board-column'
import type { GroupedTasks, Priority, Status, Task, ViewType } from '@type/kanban'
import { Header } from '@components/header'
import { ListView } from './list-view'

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
	const [view, setView] = useState<ViewType>('board')
	const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([])
	const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])

	const filteredTasks = tasks.filter((task) => {
		const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
		const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status)
		return priorityMatch && statusMatch
	})

	const groupedTask: GroupedTasks = {
		BACKLOG: { title: 'Backlog', tasks: filteredTasks.filter((t) => t.status === 'BACKLOG'), isExpanded: true },
		TODO: { title: 'To Do', tasks: filteredTasks.filter((t) => t.status === 'TODO'), isExpanded: true },
		IN_PROGRESS: {
			title: 'In Progress',
			tasks: filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
			isExpanded: true
		},
		DONE: { title: 'Done', tasks: filteredTasks.filter((t) => t.status === 'DONE'), isExpanded: true },
		CANCELED: { title: 'Canceled', tasks: filteredTasks.filter((t) => t.status === 'CANCELED'), isExpanded: true }
	}

	const handleTaskUpdate = (updatedTask: Task) => {
		setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
	}

	return (
		<div className='h-full flex-1 flex-col space-y-8 p-8 md:flex'>
			<Header
				view={view}
				onViewChange={setView}
				selectedPriorities={selectedPriorities}
				selectedStatuses={selectedStatuses}
				setSelectedPriorities={setSelectedPriorities}
				setSelectedStatuses={setSelectedStatuses}
			/>
			{view === 'board' ? (
				<ScrollArea className='h-full w-full rounded-md border bg-muted/20 p-4'>
					<div className='flex gap-4'>
						{Object.entries(groupedTask).map(([status, { tasks }]) => (
							<BoardColumn
								key={status}
								columnName={status}
								tasks={tasks}
								onTaskUpdate={handleTaskUpdate}
							/>
						))}
					</div>
					<ScrollBar orientation='horizontal' />
				</ScrollArea>
			) : view === 'list' ? (
				<ListView groupedTask={groupedTask} onUpdate={handleTaskUpdate} />
			) : (
				<div className='flex items-center justify-center h-full text-muted-foreground'>
					Calendar view coming soon
				</div>
			)}
		</div>
	)
}
