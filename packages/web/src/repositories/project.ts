import { projects } from '@/db/schema'
import { InsertProjectData, Project } from '@/types/project'
import { db } from '@db'
import { eq } from 'drizzle-orm'

export class ProjectRepository {
	// Static method to get a user by ID
	static async existsByKey(key: string): Promise<boolean> {
		const org = await db.select().from(projects).where(eq(projects.key, key)).limit(1).execute()
		return org.length > 0
	}

	static async create(data: InsertProjectData): Promise<Project> {
		const result = await db.insert(projects).values(data).returning()
		return result[0]
	}
}

export default ProjectRepository
