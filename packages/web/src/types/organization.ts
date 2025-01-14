import { organizations, Roles } from '@/db/schema'
import { WorkflowDetail } from './workflow'
import { Project } from './project'

export type InsertOrganizationData = typeof organizations.$inferInsert
export type Organization = Omit<typeof organizations.$inferSelect, 'deletedAt' | 'updatedAt'>

export type OrganizationDetail = Organization & {
	projects: Project[]
	workflow: WorkflowDetail
}

export type Role = (typeof Roles)[number]
