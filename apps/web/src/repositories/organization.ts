import { organizationMemberships, organizations, priorities, projects, projectTemplates, taskTypes, users, workflowStatus } from "@tdata/shared/db/schema";
import {
  InsertOrganizationData,
  Organization,
  OrganizationDetail,
  Role,
  User,
  Project,
  TaskType,
  WorkflowStatus,
  Priority,
  InsertTaskTypeData,
  InsertPriorityData,
} from "@tdata/shared/types";
import { createDrizzleSupabaseClient, db } from "@db";
import { and, eq, sql } from "drizzle-orm";
import { InsertWorkflowStatuseData } from "@/types";

export class OrganizationRepository {
  // Static method to get a user by ID
  static async existsByKey(key: string): Promise<boolean> {
    const org = await db.select().from(organizations).where(eq(organizations.key, key)).limit(1).execute();
    return org.length > 0;
  }

  static async getByKey(key: string): Promise<Organization | null> {
    const organization = await db.select().from(organizations).where(eq(organizations.key, key)).limit(1).execute();

    if (!organization.length) return null;
    else return organization[0];
  }

  static async create(data: InsertOrganizationData): Promise<Organization> {
    const result = await db.insert(organizations).values(data).returning();
    return result[0];
  }

  static async getTaskTypes(organizationId: number): Promise<TaskType[]> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      return await tx.select().from(taskTypes).where(eq(taskTypes.organizationId, organizationId)).execute();
    });
    return result;
  }

  static async getStatuses(organizationId: number): Promise<WorkflowStatus[]> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      return await tx.select().from(workflowStatus).where(eq(workflowStatus.organizationId, organizationId)).execute();
    });
    return result;
  }

  static async getPriorities(organizationId: number): Promise<Priority[]> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      return await tx.select().from(priorities).where(eq(priorities.organizationId, organizationId)).execute();
    });
    return result;
  }

  static async createTaskType(data: InsertTaskTypeData): Promise<TaskType> {
    const result = await db.insert(taskTypes).values(data).returning();
    return result[0];
  }

  static async createStatus(data: InsertWorkflowStatuseData): Promise<WorkflowStatus> {
    const result = await db.insert(workflowStatus).values(data).returning();
    return result[0];
  }

  static async createPriority(data: InsertPriorityData): Promise<Priority> {
    const result = await db.insert(priorities).values(data).returning();
    return result[0];
  }

  static async getByKeyIfUserIsMember(key: string, userId: string): Promise<{ organization: Omit<OrganizationDetail, "members">; role: Role } | null> {
    const rawOrganizationDetails = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        key: organizations.key,
        imageUrl: organizations.imageUrl,
        createdBy: organizations.createdBy,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        projects: sql<Project[]>`
				coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', ${projects.id},
        'organization_id', ${projects.organizationId},
        'name', ${projects.name},
        'description', ${projects.description},
        'key', ${projects.key},
        'created_by', ${projects.createdBy},
        'created_at', ${projects.createdAt},
        'updated_at', ${projects.updatedAt}
      )
    ) FILTER (WHERE ${projects.id} IS NOT NULL),
    '[]'::jsonb
  )`.as("projects"),
        userRole: organizationMemberships.role,
      })
      .from(organizations)
      .innerJoin(organizationMemberships, eq(organizations.id, organizationMemberships.organizationId))
      .leftJoin(projects, eq(projects.organizationId, organizations.id))
      .where(and(eq(organizationMemberships.userId, userId), eq(organizations.key, key)))
      .groupBy(organizations.id, organizationMemberships.role)
      .execute();

    if (rawOrganizationDetails.length === 0) return null;

    const { userRole, ...rest } = rawOrganizationDetails[0];

    return { organization: rest, role: userRole };
  }

  static async getMembers(organizationId: number): Promise<User[]> {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        imageUrl: users.imageUrl,
        role: organizationMemberships.role, // Add the `role` from the `organization_memberships` table
      })
      .from(organizationMemberships)
      .innerJoin(users, eq(organizationMemberships.userId, users.id))
      .innerJoin(organizations, eq(organizationMemberships.organizationId, organizations.id))
      .where(eq(organizations.id, organizationId))
      .limit(10);

    return result;
  }
}

export default OrganizationRepository;
