import { tasks, users, workflowStatus } from '@/db/schema'
import { Task, User, WorkflowStatus } from '@/types'
import { PgColumn } from 'drizzle-orm/pg-core'

export const UserSelects: Record<keyof Omit<User, 'role'>, PgColumn> = {
	id: users.id,
	email: users.email,
	imageUrl: users.imageUrl,
	name: users.name,
	createdAt: users.createdAt
}

export const TaskSelects: Record<keyof Task, PgColumn> = {
	id: tasks.id,
	assigneeId: tasks.assigneeId,
	content: tasks.content,
	createdBy: tasks.createdBy,
	organizationId: tasks.organizationId,
	priority: tasks.priority,
	projectId: tasks.projectId,
	statusId: tasks.statusId,
	taskNumber: tasks.taskNumber,
	title: tasks.title,
	workflowId: tasks.workflowId,
	createdAt: users.createdAt
}

export const WorkflowStatusSelects: Record<keyof WorkflowStatus, PgColumn> = {
	id: workflowStatus.id,
	createdBy: workflowStatus.createdBy,
	name: workflowStatus.name,
	organizationId: workflowStatus.organizationId,
	workflowId: workflowStatus.workflowId,
	icon: workflowStatus.icon,
	createdAt: workflowStatus.createdAt,
	updatedAt: workflowStatus.updatedAt
}
