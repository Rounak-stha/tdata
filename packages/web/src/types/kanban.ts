import { TaskDetail } from './task'

export type Status = 'Backlog' | 'ToDo' | 'InProgress' | 'Done' | 'Cancelled'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
	id: string
	title: string
	status: Status
	priority: Priority
	dueDate?: string
	assignee?: {
		id: string
		name: string
		avatar?: string
		email: string
	}
	projectId: string
	description?: string
}

export interface Column {
	id: Status
	title: string
	tasks: Task[]
}

export type ViewType = 'board' | 'list' | 'calendar'

export type GroupedTasks = Record<string, { title: string; tasks: TaskDetail[]; isExpanded: boolean }>
