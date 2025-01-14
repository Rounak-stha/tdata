import { tasks } from '@/db/schema'
import { WorkflowStatus } from './workflow'
import { User } from './user'

export type InsertTaskData = typeof tasks.$inferInsert
export type Task = typeof tasks.$inferSelect

export type TaskDetail = Task & {
	assignee: User
	status: WorkflowStatus
}
