"use client";
/* 
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area'
import { BoardColumn } from '@components/board-column'
import { Header } from '@components/header'
import { ListView } from './list-view'

import type { GroupedTasks, Priority, ViewType } from '@type/kanban'
import type { TaskDetail } from '@type/task' */

export function KanbanBoard() {
  return <div>Coming soon</div>;
  /* const [tasks, setTasks] = useState<TaskDetail[]>([])
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
	) */
}
