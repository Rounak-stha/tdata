import { sql, eq, and, inArray } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

import {
  Automation,
  Priority,
  Project,
  ProjectTemplate,
  ProjectTemplateDetail,
  Task,
  TaskDetail,
  TaskStandardFieldUpdateKeys,
  TaskType,
  TaskUpdateData,
  User,
  WorkflowStatus,
} from "@tdata/shared/types";
import { logger } from "../config/logger";
import { createDrizzleSupabaseClient } from "src/db";
import {
  automations,
  priorities,
  projectPriorities,
  projects,
  projectTaskTypes,
  projectTemplates,
  projectWorkflowStatus,
  tasks,
  tasksUsers,
  taskTypes,
  users,
  workflowStatus,
} from "@tdata/shared/db/schema";

export interface AutomationAction {
  type: string;
  config: Record<string, any>;
}

const TaskSelects: Record<keyof Task, PgColumn> = {
  id: tasks.id,
  content: tasks.content,
  createdBy: tasks.createdBy,
  organizationId: tasks.organizationId,
  priorityId: tasks.priorityId,
  typeId: tasks.typeId,
  projectId: tasks.projectId,
  statusId: tasks.statusId,
  taskNumber: tasks.taskNumber,
  title: tasks.title,
  properties: tasks.properties,
  createdAt: tasks.createdAt,
};

export class AutomationService {
  static async getTaskDetails(taskId: number): Promise<TaskDetail> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      const data = await tx
        .select({
          ...TaskSelects, // Select all fields from the tasks table
          userRelations: sql<{ relationName: string; user: User }[]>`COALESCE(
					JSON_AGG(
						JSON_BUILD_OBJECT(
							'relationName', ${tasksUsers.name},  
							'user', ROW_TO_JSON(${users}) 
						)
						) FILTER (WHERE ${tasksUsers.id} IS NOT NULL), '[]'
					)`.as("userRelations"), // Aggregated user data
        })
        .from(tasks)
        .leftJoin(tasksUsers, eq(tasks.id, tasksUsers.taskId)) // Left join with tasks_users table
        .leftJoin(users, eq(users.id, tasksUsers.userId)) // Left join with users table
        .where(eq(tasks.id, taskId))
        .groupBy(tasks.id);

      if (data.length == 0) return null;

      const task = data[0];

      const projectTemplate = await tx
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
        .where(eq(projectTemplates.id, task.projectId))
        .groupBy(projectTemplates.id)
        .execute();
      if (!projectTemplate) return null;

      const userRelations: Record<string, User[]> = {};

      task.userRelations.forEach((u) => {
        if (!userRelations[u.relationName]) userRelations[u.relationName] = [];
        userRelations[u.relationName].push(u.user);
      });
      return { ...task, projectTemplate, userRelations };
    });
    return result as unknown as TaskDetail;
  }

  static async getProjectById(id: number): Promise<Project> {
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      return (await tx.select().from(projects).where(eq(projects.id, id)).limit(1).execute())[0];
    });
  }

  static async getProjectTemplate(id: number): Promise<ProjectTemplateDetail> {
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      return (
        await tx
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
          .where(eq(projectTemplates.id, id))
          .groupBy(projectTemplates.id)
          .execute()
      )[0] as unknown as ProjectTemplateDetail;
    });
  }

  static async getProjectAutomations(projectId: number): Promise<Automation[]> {
    const db = await createDrizzleSupabaseClient();
    const data = await db.rls(async (tx) => {
      return await tx.select().from(automations).where(eq(automations.projectId, projectId)).execute();
    });
    return data;
  }

  static async updateTaskFields(
    task: { id: number; organizationId: number },
    data: { standardFields: Partial<Task>; customFields: Record<string, any>; userFields: Record<string, string> }
  ) {
    const db = await createDrizzleSupabaseClient();
    const taskId = task.id;
    const organizationId = task.organizationId;
    await db.rls(async (tx) => {
      if (Object.keys(data.standardFields).length > 0) {
        await tx.update(tasks).set(data.standardFields).where(eq(tasks.id, taskId));
      }

      if (Object.keys(data.customFields).length > 0) {
        let properties = sql`${tasks.properties}`;

        // Iterate over the `updates` object and append each update to the query
        for (const [key, value] of Object.entries(data.customFields)) {
          properties = sql`${properties} || ${JSON.stringify({ [key]: value })}::jsonb`;
        }

        await tx
          .update(tasks)
          .set({
            properties,
          })
          .where(eq(tasks.id, taskId));
      }

      if (Object.keys(data.userFields).length > 0) {
        const relationNames = [];
        const relationToCreate = [];

        for (const [key, value] of Object.entries(data.userFields)) {
          relationNames.push(key);
          relationToCreate.push({ taskId, organizationId, name: key, userId: value });
        }

        /**
         * For mulitple user relations, there can be multiple rows with the same name
         * Thus, we need to delete all eisting rows and create new ones
         */
        await tx.delete(tasksUsers).where(and(eq(tasksUsers.taskId, taskId), eq(tasksUsers.organizationId, organizationId), inArray(tasksUsers.name, relationNames)));
        await tx.insert(tasksUsers).values(relationToCreate);
      }
    });
  }
}
