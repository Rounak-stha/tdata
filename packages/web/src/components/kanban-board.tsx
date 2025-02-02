'use client'

import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area'
import { BoardColumn } from '@components/board-column'
import { Header } from '@components/header'
import { ListView } from './list-view'

import type { GroupedTasks, Priority, ViewType } from '@type/kanban'
import type { TaskDetail } from '@type/task'

const INITIAL_TASKS: TaskDetail[] = [
	{
		id: 1,
		title: 'Design system implementation',
		statusId: 1,
		status: {
			id: 1,
			name: 'ToDo',
			icon: 'ToDo',
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: 'USER-1',
			organizationId: 1,
			workflowId: 1
		},
		priority: 'HIGH',
		projectId: 8,
		assignee: [
			{
				id: 'USER-1',
				name: 'Alice',
				imageUrl: '',
				email: 'tets@email.com',
				createdAt: new Date(),
				role: 'Member'
			}
		],

		allStatus: [
			{
				id: 1,
				name: 'ToDo',
				icon: 'ToDo',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'USER-1',
				organizationId: 1,
				workflowId: 1
			},
			{
				id: 2,
				name: 'InProgress',
				icon: 'InProgress',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'USER-1',
				organizationId: 1,
				workflowId: 1
			}
		],
		properties: null,
		content: 'Design system implementation',
		createdAt: new Date(),
		createdBy: 'USER-1',
		organizationId: 1,
		taskNumber: 'TASK-1'
	},
	{
		id: 2,
		title: 'Super App Super Duper App',
		statusId: 1,
		status: {
			id: 1,
			name: 'InProgress',
			icon: 'InProgress',
			createdAt: new Date(),
			updatedAt: new Date(),
			createdBy: 'USER-1',
			organizationId: 1,
			workflowId: 1
		},
		priority: 'HIGH',
		projectId: 8,
		assignee: [
			{
				id: 'USER-1',
				name: 'Alice',
				imageUrl: '',
				email: 'tets@email.com',
				createdAt: new Date(),
				role: 'Member'
			}
		],
		properties: null,
		allStatus: [
			{
				id: 1,
				name: 'ToDo',
				icon: 'ToDo',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'USER-1',
				organizationId: 1,
				workflowId: 1
			},
			{
				id: 2,
				name: 'InProgress',
				icon: 'InProgress',
				createdAt: new Date(),
				updatedAt: new Date(),
				createdBy: 'USER-1',
				organizationId: 1,
				workflowId: 1
			}
		],
		content: 'Design system implementation',
		createdAt: new Date(),
		createdBy: 'USER-1',
		organizationId: 1,
		taskNumber: 'TASK-1'
	}
]

const statuses = [
	{
		id: 1,
		name: 'ToDo',
		icon: 'ToDo',
		createdAt: new Date(),
		updatedAt: new Date(),
		createdBy: 'USER-1',
		organizationId: 1,
		workflowId: 1
	},
	{
		id: 2,
		name: 'InProgress',
		icon: 'InProgress',
		createdAt: new Date(),
		updatedAt: new Date(),
		createdBy: 'USER-1',
		organizationId: 1,
		workflowId: 1
	}
]

export function KanbanBoard() {
	const [tasks, setTasks] = useState<TaskDetail[]>(INITIAL_TASKS)
	const [view, setView] = useState<ViewType>('board')
	const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([])
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

	const filteredTasks = useMemo(
		() =>
			tasks.filter((task) => {
				const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority)
				const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status.name)
				return priorityMatch && statusMatch
			}),
		[selectedPriorities, selectedStatuses, tasks]
	)

	const groupedTask: GroupedTasks = useMemo(
		() =>
			statuses.reduce((a, c) => {
				a[c.name] = {
					status: c,
					tasks: filteredTasks.filter((t) => t.status.name === c.name),
					isExpanded: true
				}
				return a
			}, {} as GroupedTasks),
		[statuses, filteredTasks]
	)

	const handleTaskUpdate = (updatedTask: TaskDetail) => {
		setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
	}

	return (
		<div className='flex flex-col space-y-8'>
			<Header
				view={view}
				onViewChange={setView}
				selectedPriorities={selectedPriorities}
				selectedStatuses={selectedStatuses}
				setSelectedPriorities={setSelectedPriorities}
				setSelectedStatuses={setSelectedStatuses}
			/>
			{view === 'board' ? (
				<ScrollArea className='pb-6'>
					<div className='flex gap-4'>
						{Object.entries(groupedTask).map(([statusName, { tasks, status }]) => (
							<BoardColumn
								key={statusName}
								status={status}
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
