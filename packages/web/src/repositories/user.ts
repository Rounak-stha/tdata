import { db } from '@db'

import { organizationMemberships, users } from '@/db/schema'
import { User } from '@/types'

import { and, eq } from 'drizzle-orm'

export class UserRepository {
	static async getUser(userId: string, organizationId: number): Promise<User | null> {
		const result = await db
			.select({
				user: users,
				role: organizationMemberships.role
			})
			.from(users)
			.innerJoin(
				organizationMemberships,
				and(
					eq(organizationMemberships.organizationId, organizationId),
					eq(organizationMemberships.userId, userId)
				)
			)
			.where(eq(users.id, userId))

		if (result.length == 0) return null

		const { user, role } = result[0]

		console.log('In Get User\n', { ...user, role })
		return { ...user, role }
	}
}
