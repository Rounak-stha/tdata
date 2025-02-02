import { projects, projectTemplates, workflows, workflowStatus } from '@/db/schema'
import { WorkflowDetail } from '@/types'
import { TransactionDb } from '@/types/db'
import {
	InsertProjectData,
	InsertProjectTemplate,
	Project,
	ProjectTemplate,
	ProjectTemplateDetail
} from '@/types/project'
import { db } from '@db'
import { eq, sql } from 'drizzle-orm'

export class ProjectRepository {
	// Static method to get a user by ID
	static async existsByKey(key: string): Promise<boolean> {
		const org = await db.select().from(projects).where(eq(projects.key, key)).limit(1).execute()
		return org.length > 0
	}

	static async create(data: InsertProjectData, tx?: TransactionDb): Promise<Project> {
		const database = tx ? tx : db
		const result = await database.insert(projects).values(data).returning()
		return result[0]
	}

	static async createProjectTemplate(data: InsertProjectTemplate, tx?: TransactionDb): Promise<ProjectTemplate> {
		const database = tx ? tx : db
		const result = await database.insert(projectTemplates).values(data).returning()
		return result[0]
	}

	static getProjectTemplate = async (projectId: number): Promise<ProjectTemplateDetail | null> => {
		const projectTemplate = await db
			.select({
				id: projectTemplates.id,
				name: projectTemplates.name,
				organizationId: projectTemplates.organizationId,
				description: projectTemplates.description,
				workflowId: projectTemplates.workflowId,
				singleAssignee: projectTemplates.singleAssignee,
				taskProperties: projectTemplates.taskProperties,
				updatedAt: projectTemplates.updatedAt,
				createdAt: projectTemplates.createdAt,
				workflow: sql<WorkflowDetail>`
				jsonb_build_object(
					'id', ${workflows.id},
					'name', ${workflows.name},
					'description', ${workflows.description},
					'createdBy', ${workflows.createdBy},
					'createdAt', ${workflows.createdAt},
					'updatedAt', ${workflows.updatedAt},
					'statuses', (
						SELECT jsonb_agg(
							jsonb_build_object(
								'id', ${workflowStatus.id},
								'workflowId', ${workflowStatus.workflowId},
								'organizationId', ${workflowStatus.organizationId},
								'createdBy', ${workflowStatus.createdBy},
								'name', ${workflowStatus.name},
								'icon', ${workflowStatus.icon},
								'createdAt', ${workflowStatus.createdAt},
								'updatedAt', ${workflowStatus.updatedAt}
							)
						)
						FROM ${workflowStatus}
						WHERE ${workflowStatus.workflowId} = ${workflows.id}
						AND ${workflowStatus.organizationId} = ${projectTemplates.organizationId}
					)
				)`.as('workflow')
			})
			.from(projectTemplates)
			.innerJoin(workflows, eq(projectTemplates.workflowId, workflows.id))
			.where(eq(projectTemplates.id, projectId))
			.groupBy(projectTemplates.id, workflows.id)
			.execute()

		return projectTemplate[0] as ProjectTemplateDetail
	}
}

export default ProjectRepository
