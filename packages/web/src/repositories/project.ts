import { projects, projectTemplates } from '@/db/schema'
import { TransactionDb } from '@/types/db'
import { InsertProjectData, InsertProjectTemplate, Project, ProjectTemplate } from '@/types/project'
import { db } from '@db'
import { eq } from 'drizzle-orm'

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
}

export default ProjectRepository
