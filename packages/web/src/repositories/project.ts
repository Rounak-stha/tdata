import { organizations, projects, projectTemplates, tasks, users, workflows, workflowStatus } from "@/db/schema";
import { TaskGroupedByStatus, User, WorkflowDetail } from "@/types";
import { TransactionDb } from "@/types/db";
import { InsertProjectData, InsertProjectTemplate, Project, ProjectDetailMinimal, ProjectTemplate, ProjectTemplateDetail } from "@/types/project";
import { createDrizzleSupabaseClient, db } from "@db";
import { and, eq, sql } from "drizzle-orm";
import { ProjectSelects, ProjectTemplateMinimalSelects, UserSelects } from "./selects";

export class ProjectRepository {
  // Static method to get a user by ID
  static async existsByKey(key: string): Promise<boolean> {
    const org = await db.select().from(projects).where(eq(projects.key, key)).limit(1).execute();
    return org.length > 0;
  }

  static async getByKey(key: string, organizationKey: string): Promise<Project | null> {
    const project = await db
      .select(ProjectSelects)
      .from(projects)
      .where(eq(projects.key, key))
      .innerJoin(organizations, and(eq(projects.organizationId, organizations.id), eq(organizations.key, organizationKey)))
      .limit(1)
      .execute();
    if (project.length === 0) return null;
    return project[0] as Project;
  }

  static async create(data: InsertProjectData, tx?: TransactionDb): Promise<Project> {
    const database = tx ? tx : db;
    const result = await database.insert(projects).values(data).returning();
    return result[0];
  }

  static async createProjectTemplate(data: InsertProjectTemplate, tx?: TransactionDb): Promise<ProjectTemplate> {
    const database = tx ? tx : db;
    const result = await database.insert(projectTemplates).values(data).returning();
    return result[0];
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
				)`.as("workflow"),
      })
      .from(projectTemplates)
      .innerJoin(workflows, eq(projectTemplates.workflowId, workflows.id))
      .where(eq(projectTemplates.id, projectId))
      .groupBy(projectTemplates.id, workflows.id)
      .execute();

    return projectTemplate[0] as ProjectTemplateDetail;
  };

  static async getTasksGroupedByStatus(projectId: number, limit: number): Promise<TaskGroupedByStatus[]> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      // We need to perform raw query as drizzle doe snot yet support Lateral Joins
      const data = await tx.execute(sql`
				SELECT
					s.id,
					s.name,
					s.icon,
					s.project_id as "projectId",
					s.organization_id as "organizationId",
					s.created_at as "createdAt",
					s.workflow_id as "workflowId",
					s.created_by as "createdBy",
					COALESCE(
						json_agg(t) FILTER (WHERE t.id IS NOT NULL), '[]'
					) as tasks
				FROM workflow_status s
				LEFT JOIN LATERAL (
						SELECT
							ta.id,
							ta.title,
							ta.content,
							ta.status_id as "statusId",
							ta.priority,
							ta.task_number as "taskNumber",
							ta.created_by as "createdBy",
							ta.project_id as "projectId",
							ta.organization_id as "organizationId",
							ta.properties,
							ta.created_at as "createdAt",
							ta.updated_at as "updatedAt",
							COALESCE(
								JSON_OBJECT_AGG(
									grouped_users.relation_name,
									grouped_users.users
								) FILTER (WHERE grouped_users.relation_name IS NOT NULL), '{}'
              				) as "userRelations"
						FROM tasks ta
						LEFT JOIN LATERAL (
							SELECT
								tu.task_id,
								tu.name AS relation_name, -- Correct field
								JSON_AGG(ROW_TO_JSON(u)) AS users
							FROM tasks_users tu
							LEFT JOIN users u ON u.id = tu.user_id -- Correct field
							WHERE tu.task_id = ta.id -- Correct field
							GROUP BY tu.task_id, tu.name
						) grouped_users ON grouped_users.task_id = ta.id 
						WHERE ta.status_id = s.id
						GROUP BY ta.id
						ORDER BY ta.created_at desc
						LIMIT ${limit}
					) t on true
				WHERE s.project_id = ${projectId}
				GROUP BY s.id;
			`);
      return data;
    });

    if (!result.length) return [];

    const projectTemplate = await this.getProjectTemplate(projectId);

    // @ts-expect-error The data returned from the query is not typed

    const parsedResult = result.map((res) => {
      const { tasks, ...rest } = res;
      // @ts-expect-error The data returned from the query is not typed
      tasks.forEach((task) => {
        task.projectTemplate = projectTemplate;
      });
      return { tasks, group: rest };
    });

    return parsedResult as TaskGroupedByStatus[];
  }

  static getProjects = async (organizationId: number): Promise<ProjectDetailMinimal[]> => {
    const db = await createDrizzleSupabaseClient();
    const result: ProjectDetailMinimal[] = await db.rls(async (tx) => {
      const data = await tx
        .select({
          id: projects.id,
          name: projects.name,
          description: projects.description,
          key: projects.key,
          organizationId: projects.organizationId,
          createdAt: projects.createdAt,
          updatedAt: projects.updatedAt,
          createdBy: UserSelects,
          template: ProjectTemplateMinimalSelects,
        })
        .from(projects)
        .leftJoin(users, eq(users.id, projects.createdBy))
        .leftJoin(projectTemplates, eq(projectTemplates.id, projects.id))
        .where(eq(projects.organizationId, organizationId))
        .execute();
      return data;
    });
    return result;
  };
}

export default ProjectRepository;
