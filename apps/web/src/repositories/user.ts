import { db } from "@db";

import { organizationMemberships, users } from "@tdata/shared/db/schema";
import { User } from "@tdata/shared/types";

import { and, eq } from "drizzle-orm";

export class UserRepository {
  static async getUser(userId: string, organizationId: number): Promise<User | null> {
    const result = await db
      .select({
        user: users,
        role: organizationMemberships.role,
      })
      .from(users)
      .innerJoin(organizationMemberships, and(eq(organizationMemberships.organizationId, organizationId), eq(organizationMemberships.userId, userId)))
      .where(eq(users.id, userId));

    if (result.length == 0) return null;

    const { user, role } = result[0];

    return { ...user, role };
  }

  static async getUserById(userId: string): Promise<Omit<User, "role"> | null> {
    const result = await db.select().from(users).where(eq(users.id, userId));

    if (result.length == 0) return null;

    return result[0];
  }
}
