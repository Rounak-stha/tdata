import {
  invitations,
  organizationMemberships,
  organizations,
  priorities,
  projectPriorities,
  projects,
  projectTaskTypes,
  projectTemplates,
  projectWorkflowStatus,
  taskTypes,
  users,
  workflowStatus,
} from "@tdata/shared/db/schema";
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
  ProjectTemplatePropertyTypes,
  InsertProjectTemplate,
} from "@tdata/shared/types";
import { createDrizzleSupabaseClient, db } from "@db";
import { and, eq, lt, or, sql, isNull } from "drizzle-orm";
import { IconType, InsertWorkflowStatuseData } from "@/types";
import { Invitation } from "@tdata/shared/types";

export class OrganizationRepository {
  // Static method to get a user by ID
  static async existsByKey(key: string): Promise<boolean> {
    const org = await db.select().from(organizations).where(eq(organizations.key, key)).limit(1).execute();
    return org.length > 0;
  }

  static async getByKey(key: string): Promise<Organization | null> {
    const organization = await db.select().from(organizations).where(eq(organizations.key, key.toUpperCase())).limit(1).execute();

    if (!organization.length) return null;
    else return organization[0];
  }

  static async getById(id: number): Promise<Organization | null> {
    const organization = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1).execute();

    if (!organization.length) return null;
    else return organization[0];
  }

  /**
   * This logic is duplicated in ProjectRepositoty.createProjectAndTemplate
   * Had to duplicate because each Repository method creates its own transaction
   * and we need to create a project and its template in the same transaction because we need the created organization id
   */
  static async create(data: InsertOrganizationData): Promise<Organization> {
    const db = await createDrizzleSupabaseClient();
    const organization = await db.rls(async (tx) => {
      const organization = (await tx.insert(organizations).values(data).returning())[0];

      // create organization defaults
      const orgaizationMemberCreateData = { organizationId: organization.id, userId: organization.createdBy, role: "Admin" as Role };

      const taskTypesInsertData = [
        { name: "Epic", organizationId: organization.id, icon: "Epic" as IconType, createdBy: organization.createdBy },
        { name: "Story", organizationId: organization.id, icon: "Story" as IconType, createdBy: organization.createdBy },
        { name: "Bug", organizationId: organization.id, icon: "Bug" as IconType, createdBy: organization.createdBy },
        { name: "Task", organizationId: organization.id, icon: "Task" as IconType, createdBy: organization.createdBy },
      ];

      const workflowStatusInsertData = [
        { name: "To Do", organizationId: organization.id, icon: "ToDo" as IconType, createdBy: organization.createdBy },
        { name: "In Progress", organizationId: organization.id, icon: "InProgress" as IconType, createdBy: organization.createdBy },
        { name: "Completed", organizationId: organization.id, icon: "Completed" as IconType, createdBy: organization.createdBy },
      ];

      const proritiesInsertData = [
        { name: "Low", organizationId: organization.id, icon: "Low" as IconType, createdBy: organization.createdBy },
        { name: "Medium", organizationId: organization.id, icon: "Medium" as IconType, createdBy: organization.createdBy },
        { name: "High", organizationId: organization.id, icon: "High" as IconType, createdBy: organization.createdBy },
        { name: "Urgent", organizationId: organization.id, icon: "Urgent" as IconType, createdBy: organization.createdBy },
      ];

      await tx.insert(organizationMemberships).values(orgaizationMemberCreateData).execute();
      const createdTaskTypes = await tx.insert(taskTypes).values(taskTypesInsertData).returning();
      const createdStatuses = await tx.insert(workflowStatus).values(workflowStatusInsertData).returning();
      const createdPriorities = await tx.insert(priorities).values(proritiesInsertData).returning();

      const newProjectData = { name: "Starter Project", key: "SP", organizationId: organization.id, createdBy: organization.createdBy };

      const createdProject = await tx.insert(projects).values(newProjectData).returning();

      const projectTemplateCreateData: InsertProjectTemplate = {
        id: createdProject[0].id,
        name: "Starter Project Template",
        description: "A starter template with basic task types, statuses, and priorities",
        organizationId: organization.id,
        singleAssignee: true,
        taskProperties: [
          {
            name: "Due Date",
            type: "date" as ProjectTemplatePropertyTypes,
            required: false,
          },
        ],
      };

      const projectStatusInserData = createdStatuses.map((status) => ({
        projectId: createdProject[0].id,
        workflowStatusId: status.id,
      }));

      const projectPrioritiesInsertData = createdPriorities.map((priority) => ({
        projectId: createdProject[0].id,
        priorityId: priority.id,
      }));

      const projectTaskTypesInsertData = createdTaskTypes.map((taskType) => ({
        projectId: createdProject[0].id,
        taskTypeId: taskType.id,
      }));

      await Promise.all([
        tx.insert(projectTemplates).values(projectTemplateCreateData).returning(),
        tx.insert(projectWorkflowStatus).values(projectStatusInserData).returning(),
        tx.insert(projectPriorities).values(projectPrioritiesInsertData).returning(),
        tx.insert(projectTaskTypes).values(projectTaskTypesInsertData).returning(),
      ]);
      return organization;
    });
    return organization;
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

  static async getUnAcceptedInvitations(organizationId: number): Promise<Invitation[]> {
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      return tx
        .select()
        .from(invitations)
        .where(and(eq(invitations.organizationId, organizationId), or(lt(invitations.expiresAt, new Date()), isNull(invitations.acceptedAt))))
        .execute();
    });
  }
}

export default OrganizationRepository;
