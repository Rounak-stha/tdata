export type Status = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE'
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
