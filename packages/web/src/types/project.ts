import { projects, projectTemplates } from '@/db/schema'
import { WorkflowDetail } from './workflow'

export type InsertProjectData = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect

export type InsertProjectTemplate = Exclude<typeof projectTemplates.$inferInsert, 'id'>
export type ProjectTemplate = Omit<typeof projectTemplates.$inferSelect, 'deletedAt'>

export type ProjectDetail = Project & {
	template: ProjectTemplate
}

export type ProjectTemplateDetail = ProjectTemplate & {
	workflow: WorkflowDetail
}
