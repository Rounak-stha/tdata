import { workflows, workflowStatus } from '@/db/schema'

export type InsertWorkflowData = typeof workflows.$inferInsert
export type Workflow = typeof workflows.$inferSelect

export type InsertWorkflowStatuseData = typeof workflowStatus.$inferInsert
export type WorkflowStatus = typeof workflowStatus.$inferSelect

export type WorkflowDetail = Workflow & {
	statuses: WorkflowStatus[]
}
