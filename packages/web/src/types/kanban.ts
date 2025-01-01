export type Status = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'
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

export type GroupedTasks = Record<Status, { title: string; tasks: Task[]; isExpanded: boolean }>

/* {
	BACKLOG: { title: 'Backlog'; tasks: []; isExpanded: true }
	TODO: { title: 'Todo'; tasks: []; isExpanded: true }
	IN_PROGRESS: { title: 'In Progress'; tasks: []; isExpanded: true }
	DONE: { title: 'Done'; tasks: []; isExpanded: true }
	CANCELED: { title: 'Canceled'; tasks: []; isExpanded: true }
} */
