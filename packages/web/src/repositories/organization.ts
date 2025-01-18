import { organizationMemberships, organizations, projects, users, workflows, workflowStatus } from '@/db/schema'
import { User } from '@/types'
import { InsertOrganizationData, Organization, OrganizationDetail, Role } from '@/types/organization'
import { Project } from '@/types/project'
import { WorkflowDetail } from '@/types/workflow'
import { db } from '@db'
import { and, eq, sql } from 'drizzle-orm'

export class OrganizationRepository {
	// Static method to get a user by ID
	static async existsByKey(key: string): Promise<boolean> {
		const org = await db.select().from(organizations).where(eq(organizations.key, key)).limit(1).execute()
		return org.length > 0
	}

	static async create(data: InsertOrganizationData): Promise<Organization> {
		const result = await db.insert(organizations).values(data).returning()
		return result[0]
	}

	static async getByKeyIfUserIsMember(
		key: string,
		userId: string
	): Promise<{ organization: Omit<OrganizationDetail, 'members'>; role: Role } | null> {
		const rawOrganizationDetails = await db
			.select({
				id: organizations.id,
				name: organizations.name,
				key: organizations.key,
				imageUrl: organizations.imageUrl,
				createdBy: organizations.createdBy,
				createdAt: organizations.createdAt,
				updatedAt: organizations.updatedAt,
				workflow: sql<WorkflowDetail>`
					jsonb_build_object(
					'id', ${workflows.id},
					'name', ${workflows.name},
					'description', ${workflows.description},
					'is_active', ${workflows.isActive},
					'is_default', ${workflows.isDefault},
					'configured', ${workflows.configured},
					'created_by', ${workflows.createdBy},
					'created_at', ${workflows.createdAt},
					'updated_at', ${workflows.updatedAt},
					'statuses', (
						SELECT jsonb_agg(
							jsonb_build_object(
								'id', ${workflowStatus.id},
								'workflow_id', ${workflowStatus.workflowId},
								'organization_id', ${workflowStatus.organizationId},
								'created_by', ${workflowStatus.createdBy},
								'name', ${workflowStatus.name},
								'icon', ${workflowStatus.icon},
								'created_at', ${workflowStatus.createdAt},
								'updated_at', ${workflowStatus.updatedAt}
							)
						)
						FROM ${workflowStatus}
						WHERE ${workflowStatus.workflowId} = ${workflows.id}
						AND ${workflowStatus.organizationId} = ${organizations.id}
					))`.as('workflow'),
				projects: sql<Project[]>`
				array_agg(
					jsonb_build_object(
					'id', ${projects.id},
					'organization_id', ${projects.organizationId},
					'name', ${projects.name},
					'description', ${projects.description},
					'key', ${projects.key},
					'workflow_id', ${projects.workflowId},
					'created_by', ${projects.createdBy},
					'created_at', ${projects.createdAt},
					'updated_at', ${projects.updatedAt}
					) ORDER BY ${projects.id}
				)`.as('projects'),
				userRole: organizationMemberships.role
			})
			.from(organizations)
			.innerJoin(organizationMemberships, eq(organizations.id, organizationMemberships.organizationId))
			.leftJoin(
				workflows,
				and(
					eq(workflows.organizationId, organizations.id),
					eq(workflows.isActive, true) // Only the active workflow
				)
			)
			.leftJoin(projects, eq(projects.organizationId, organizations.id))
			.where(and(eq(organizationMemberships.userId, userId), eq(organizations.key, key)))
			.groupBy(organizations.id, workflows.id, organizationMemberships.role)
			.execute()

		if (rawOrganizationDetails.length === 0) return null

		const { userRole, ...rest } = rawOrganizationDetails[0]

		return { organization: rest, role: userRole }
	}

	static async getMembers(organizationId: number): Promise<User[]> {
		const result = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				createdAt: users.createdAt,
				imageUrl: users.imageUrl,
				role: organizationMemberships.role // Add the `role` from the `organization_memberships` table
			})
			.from(organizationMemberships)
			.innerJoin(users, eq(organizationMemberships.userId, users.id))
			.innerJoin(organizations, eq(organizationMemberships.organizationId, organizations.id))
			.where(eq(organizations.id, organizationId))
			.limit(10)

		return result
	}
}

export default OrganizationRepository
