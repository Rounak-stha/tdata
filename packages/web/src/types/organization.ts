import { organizations, Roles } from '@/db/schema'
import { WorkflowDetail } from './workflow'
import { ProjectDetail } from './project'
import { User } from './user'

export type InsertOrganizationData = typeof organizations.$inferInsert
export type Organization = Omit<typeof organizations.$inferSelect, 'deletedAt' | 'updatedAt'>

export type OrganizationDetail = Organization & {
	projects: ProjectDetail[]
	members: User[]
	workflow: WorkflowDetail
}

export type Role = (typeof Roles)[number]
