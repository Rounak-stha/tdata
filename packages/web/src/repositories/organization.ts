import { organizations } from '@/db/schema'
import { InsertOrganizationData, Organization } from '@/type/organization'
import { db } from '@db'
import { eq } from 'drizzle-orm'

class OrganizationRepository {
	// Static method to get a user by ID
	static async existsByKey(key: string): Promise<boolean> {
		const org = await db.select().from(organizations).where(eq(organizations.key, key)).limit(1).execute()
		return org.length > 0
	}

	static async create(data: InsertOrganizationData): Promise<Organization> {
		const result = await db.insert(organizations).values(data).returning()
		return result[0]
	}
}

export default OrganizationRepository
