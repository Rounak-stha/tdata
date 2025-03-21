import {
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
  InsertProjectData,
  InsertProjectTemplate,
  Priority,
  Project,
  ProjectDetailMinimal,
  ProjectTemplate,
  ProjectTemplateDetail,
  ProjectTemplateProperty,
  TaskGroupedByStatus,
  TaskType,
} from "@tdata/shared/types";

import { TransactionDb, WorkflowStatus } from "@types";
import { createDrizzleSupabaseClient, db } from "@db";
import { and, eq, inArray, sql } from "drizzle-orm";
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

  static async createProjectAndTemplate(data: InsertProjectData, template: ProjectTemplateDetail): Promise<Project> {
    const db = await createDrizzleSupabaseClient();
    const createdProject = await db.rls(async (tx) => {
      const createdProject = await tx.insert(projects).values(data).returning();

      const projectTemplateCreateData: InsertProjectTemplate = {
        id: createdProject[0].id,
        name: template.name,
        organizationId: data.organizationId,
        description: template.description,
        singleAssignee: template.singleAssignee,
        taskProperties: template.taskProperties,
      };

      const projectStatusInserData = template.statuses.map((status) => ({
        projectId: createdProject[0].id,
        workflowStatusId: status.id,
      }));

      const projectPrioritiesInsertData = template.priorities.map((priority) => ({
        projectId: createdProject[0].id,
        priorityId: priority.id,
      }));

      const projectTaskTypesInsertData = template.taskTypes.map((taskType) => ({
        projectId: createdProject[0].id,
        taskTypeId: taskType.id,
      }));

      await Promise.all([
        tx.insert(projectTemplates).values(projectTemplateCreateData).returning(),
        tx.insert(projectWorkflowStatus).values(projectStatusInserData).returning(),
        tx.insert(projectPriorities).values(projectPrioritiesInsertData).returning(),
        tx.insert(projectTaskTypes).values(projectTaskTypesInsertData).returning(),
      ]);

      return createdProject[0];
    });
    return createdProject;
  }

  static getProjectTemplate = async (projectId: number): Promise<ProjectTemplateDetail | null> => {
    const projectTemplate = await db
      .select({
        id: projectTemplates.id,
        name: projectTemplates.name,
        organizationId: projectTemplates.organizationId,
        description: projectTemplates.description,
        singleAssignee: projectTemplates.singleAssignee,
        taskProperties: projectTemplates.taskProperties,
        updatedAt: projectTemplates.updatedAt,
        createdAt: projectTemplates.createdAt,
        statuses: sql<WorkflowStatus[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', workflow_status.id,
				'organizationId', workflow_status.organization_id,
				'createdBy', workflow_status.created_by,
				'name', workflow_status.name,
				'icon', workflow_status.icon,
				'createdAt', workflow_status.created_at,
				'updatedAt', workflow_status.updated_at
			)) FILTER (WHERE workflow_status.id IS NOT NULL), '[]'::jsonb)
		`.as("statuses"),
        priorities: sql<Priority[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', priorities.id,
				'name', priorities.name,
				'organizationId', priorities.organization_id,
				'createdBy', priorities.created_by,
				'icon', priorities.icon,
				'createdAt', priorities.created_at,
				'updatedAt', priorities.updated_at
			)) FILTER (WHERE priorities.id IS NOT NULL), '[]'::jsonb)
		`.as("priorities"),
        taskTypes: sql<TaskType[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', task_types.id,
				'name', task_types.name,
				'organizationId', task_types.organization_id,
				'createdBy', task_types.created_by,
				'icon', task_types.icon,
				'createdAt', task_types.created_at,
				'updatedAt', task_types.updated_at
			)) FILTER (WHERE task_types.id IS NOT NULL), '[]'::jsonb)
		`.as("taskTypes"),
      })
      .from(projectTemplates)
      .leftJoin(projectWorkflowStatus, eq(projectTemplates.id, projectWorkflowStatus.projectId))
      .leftJoin(workflowStatus, eq(workflowStatus.id, projectWorkflowStatus.workflowStatusId))
      .leftJoin(projectPriorities, eq(projectTemplates.id, projectPriorities.projectId))
      .leftJoin(priorities, eq(priorities.id, projectPriorities.priorityId))
      .leftJoin(projectTaskTypes, eq(projectTemplates.id, projectTaskTypes.projectId))
      .leftJoin(taskTypes, eq(taskTypes.id, projectTaskTypes.taskTypeId))
      .where(eq(projectTemplates.id, projectId))
      .groupBy(projectTemplates.id)
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
					s.organization_id as "organizationId",
					s.created_at as "createdAt",
					s.created_by as "createdBy",
					COALESCE(
						json_agg(t) FILTER (WHERE t.id IS NOT NULL), '[]'
					) as tasks
				FROM workflow_status s
				JOIN project_workflow_status w ON w.workflow_status_id = s.id
					 AND w.project_id = ${projectId}
				LEFT JOIN LATERAL (
						SELECT
							ta.id,
							ta.title,
							ta.content,
							ta.status_id as "statusId",
							ta.priority_id as "priorityId",
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

  static async getStarterTemplate(organizationId: number): Promise<ProjectTemplateDetail> {
    const starterStatusNames = ["To Do", "In Progress", "Completed"];
    const starterTaskTypeNames = ["Epic", "Story", "Bug", "Task"];
    const starterPriorityNames = ["Low", "Medium", "High", "Urgent"];

    const starterstatuses = await db
      .select()
      .from(workflowStatus)
      .where(and(eq(workflowStatus.organizationId, organizationId), inArray(workflowStatus.name, starterStatusNames)))
      .execute();
    const starterTaskTypes = await db
      .select()
      .from(taskTypes)
      .where(and(eq(taskTypes.organizationId, organizationId), inArray(taskTypes.name, starterTaskTypeNames)))
      .execute();
    const starterPriorities = await db
      .select()
      .from(priorities)
      .where(and(eq(priorities.organizationId, organizationId), inArray(priorities.name, starterPriorityNames)))
      .execute();

    const taskProperties: ProjectTemplateProperty[] = [
      {
        name: "Due Date",
        type: "date",
        required: false,
      },
    ];

    return {
      id: 0,
      name: "Starter Template",
      description: "A starter template with basic task types, statuses, and priorities",
      organizationId: organizationId,
      taskTypes: starterTaskTypes,
      statuses: starterstatuses,
      priorities: starterPriorities,
      singleAssignee: true,
      taskProperties: taskProperties,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async getProjectTemplates(organizationId: number): Promise<ProjectTemplateDetail[]> {
    const db = await createDrizzleSupabaseClient();
    const allProjectTemplates: ProjectTemplateDetail[] = await db.rls(async (tx) => {
      return await tx
        .select({
          id: projectTemplates.id,
          name: projectTemplates.name,
          organizationId: projectTemplates.organizationId,
          description: projectTemplates.description,
          singleAssignee: projectTemplates.singleAssignee,
          taskProperties: projectTemplates.taskProperties,
          updatedAt: projectTemplates.updatedAt,
          createdAt: projectTemplates.createdAt,
          statuses: sql<WorkflowStatus[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', workflow_status.id,
				'organizationId', workflow_status.organization_id,
				'createdBy', workflow_status.created_by,
				'name', workflow_status.name,
				'icon', workflow_status.icon,
				'createdAt', workflow_status.created_at,
				'updatedAt', workflow_status.updated_at
			)) FILTER (WHERE workflow_status.id IS NOT NULL), '[]'::jsonb)
			`.as("statuses"),
          priorities: sql<Priority[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', priorities.id,
				'name', priorities.name,
				'organizationId', priorities.organization_id,
				'createdBy', priorities.created_by,
				'icon', priorities.icon,
				'createdAt', priorities.created_at,
				'updatedAt', priorities.updated_at
			)) FILTER (WHERE priorities.id IS NOT NULL), '[]'::jsonb)
			`.as("priorities"),
          taskTypes: sql<TaskType[]>`
			COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'id', task_types.id,
				'name', task_types.name,
				'organizationId', task_types.organization_id,
				'createdBy', task_types.created_by,
				'icon', task_types.icon,
				'createdAt', task_types.created_at,
				'updatedAt', task_types.updated_at
			)) FILTER (WHERE task_types.id IS NOT NULL), '[]'::jsonb)
			`.as("taskTypes"),
        })
        .from(projectTemplates)
        .leftJoin(projectWorkflowStatus, eq(projectTemplates.id, projectWorkflowStatus.projectId))
        .leftJoin(workflowStatus, eq(workflowStatus.id, projectWorkflowStatus.workflowStatusId))
        .leftJoin(projectPriorities, eq(projectTemplates.id, projectPriorities.projectId))
        .leftJoin(priorities, eq(priorities.id, projectPriorities.priorityId))
        .leftJoin(projectTaskTypes, eq(projectTemplates.id, projectTaskTypes.projectId))
        .leftJoin(taskTypes, eq(taskTypes.id, projectTaskTypes.taskTypeId))
        .where(eq(projectTemplates.organizationId, organizationId))
        .groupBy(projectTemplates.id)
        .execute();
    });
    const starterTemplate = await ProjectRepository.getStarterTemplate(organizationId);
    return [...allProjectTemplates, starterTemplate];
  }
}

export default ProjectRepository;
