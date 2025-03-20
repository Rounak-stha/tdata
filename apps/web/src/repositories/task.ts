import { createDrizzleSupabaseClient, db } from "@db";

import { priorities, taskActivities, taskComments, tasks, tasksUsers, taskTypes, users, workflowStatus } from "@tdata/shared/db/schema";
import {
  InsertCommentData,
  InsertTaskActivityData,
  InsertTaskData,
  Task,
  TaskActivitySectionData,
  TaskDetail,
  TaskDetailMinimal,
  TaskMinimalGroupedByStatus,
  TaskStandardFieldUpdateKeys,
  TaskUpdateData,
  User,
} from "@tdata/shared/types";
import { and, eq, sql } from "drizzle-orm";
import { PrioritySelect, TaskSelects, TaskTypeSelect, WorkflowStatusSelects } from "./selects";
import ProjectRepository from "./project";
import { PagintionMeta } from "@types";
import { unionAll } from "drizzle-orm/pg-core";
import { AssigneeFieldName } from "@/lib/constants";

export class TaskRepository {
  static async create(data: InsertTaskData): Promise<Task> {
    const { userRelations, ...task } = data;
    let createdTask = {} as Task;
    /**
     * We have a before insert trigger that will add the correct task number
     */
    await db.transaction(async (tx) => {
      const newTask = await tx
        .insert(tasks)
        .values({ ...task, taskNumber: "o" })
        .returning();

      const insertData = Object.entries(userRelations).flatMap(([name, userIds]) =>
        userIds.map((userId) => ({
          taskId: newTask[0].id,
          userId,
          organizationId: newTask[0].organizationId,
          name,
        }))
      );

      if (insertData.length) await tx.insert(tasksUsers).values(insertData);
      await tx.insert(taskActivities).values({
        organizationId: newTask[0].organizationId,
        action: "TASK_CREATE",
        taskId: newTask[0].id,
        userId: newTask[0].createdBy,
        metadata: { type: "task_create_delete" },
      });
      createdTask = newTask[0];
    });

    return createdTask;
  }

  static async getDetails(taskNumber: string, organizationId: number): Promise<TaskDetail | null> {
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
        .where(
          and(
            eq(tasks.taskNumber, taskNumber), // Filter by taskNumber
            eq(tasks.organizationId, organizationId) // Filter by organizationId
          )
        )
        .groupBy(tasks.id);

      if (data.length == 0) return null;

      const task = data[0];
      const projectTemplate = await ProjectRepository.getProjectTemplate(task.projectId);

      if (!projectTemplate) return null;

      const userRelations: Record<string, User[]> = {};

      task.userRelations.forEach((u) => {
        if (!userRelations[u.relationName]) userRelations[u.relationName] = [];
        userRelations[u.relationName].push(u.user);
      });
      return { ...task, projectTemplate, userRelations };
    });
    return result;
  }

  static async updateField(task: Pick<Task, "id" | "organizationId">, data: TaskUpdateData) {
    const performedBy = data.performedBy;

    await db.transaction(async (tx) => {
      if (data.name === "StandardFieldUpdate") {
        const { value, previous, ...rest } = data.data;
        const updatedField = Object.keys(rest)[0] as TaskStandardFieldUpdateKeys;

        const updatedTask = await tx
          .update(tasks)
          .set(rest)
          .where(and(eq(tasks.id, task.id), eq(tasks.organizationId, task.organizationId)))
          .returning();

        if (updatedTask.length == 0) {
          tx.rollback();
        }

        await tx.insert(taskActivities).values({
          action: "FIELD_UPDATE",
          organizationId: task.organizationId,
          taskId: task.id,
          userId: performedBy,
          metadata: {
            type: "field",
            name: updatedField,
            from: previous,
            to: value ? value : (rest[updatedField] as string),
          },
        });
      } else if (data.name == "UserRelationUpdate") {
        const { name, previousUser, newUser } = data.data;
        const activityData: InsertTaskActivityData[] = [];

        if (newUser) {
          await tx.insert(tasksUsers).values({
            name,
            organizationId: task.organizationId,
            taskId: task.id,
            userId: newUser.id,
          });

          activityData.push({
            action: "FIELD_UPDATE",
            organizationId: task.organizationId,
            taskId: task.id,
            userId: performedBy,
            metadata: {
              type: "user",
              subtype: "add",
              name,
              user: newUser,
            },
          });
        }

        if (previousUser) {
          await tx
            .delete(tasksUsers)
            .where(and(eq(tasksUsers.taskId, task.id), eq(tasksUsers.organizationId, task.organizationId), eq(tasksUsers.userId, previousUser.id), eq(tasksUsers.name, name)));
          activityData.push({
            action: "FIELD_UPDATE",
            organizationId: task.organizationId,
            taskId: task.id,
            userId: performedBy,
            metadata: {
              type: "user",
              subtype: "remove",
              name,
              user: previousUser,
            },
          });
        }

        await tx.insert(taskActivities).values(activityData);
      } else if (data.name == "CustomFieldUpdate") {
        const { name, newValue, previousValue } = data.data;

        await tx
          .update(tasks)
          .set({
            properties: sql`${tasks.properties} || ${JSON.stringify({ [name]: newValue })}::jsonb`,
          })
          .where(and(eq(tasks.id, task.id), eq(tasks.organizationId, task.organizationId)));

        await tx.insert(taskActivities).values({
          action: "FIELD_UPDATE",
          organizationId: task.organizationId,
          taskId: task.id,
          userId: performedBy,
          metadata: {
            type: "field",
            name,
            from: previousValue,
            to: newValue,
          },
        });
      }
    });
  }

  static async getActivities({ taskId, organizationId, limit, page }: { taskId: number; organizationId: number } & PagintionMeta) {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      const activitiesQuery = tx
        .select({
          id: taskActivities.id,
          action: taskActivities.action,
          content: sql`null`,
          metadata: taskActivities.metadata,
          organizationId: taskActivities.organizationId,
          taskId: taskActivities.taskId,
          type: sql`'activity'`,
          userId: taskActivities.userId,
          createdAt: taskActivities.createdAt,
          updatedAt: taskActivities.updatedAt,

          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            imageUrl: users.imageUrl,
          },
        })
        .from(taskActivities)
        .leftJoin(users, eq(users.id, taskActivities.userId))
        .where(and(eq(taskActivities.organizationId, organizationId), eq(taskActivities.taskId, taskId)));

      const commentsQuery = tx
        .select({
          id: taskComments.id,
          action: sql`null`,
          content: taskComments.content,
          metadata: sql`null`,
          organizationId: taskComments.organizationId,
          taskId: taskComments.taskId,
          type: sql`'comment'`,
          userId: taskComments.userId,
          createdAt: taskComments.createdAt,
          updatedAt: taskComments.updatedAt,

          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            imageUrl: users.imageUrl,
          },
        })
        .from(taskComments)
        .leftJoin(users, eq(users.id, taskComments.userId))
        .where(and(eq(taskComments.organizationId, organizationId), eq(taskComments.taskId, taskId)));

      // @ts-expect-error We need to set non existent column in each table to be null using sql`null which makes the type in each table different and TS will complain
      const data = await unionAll(activitiesQuery, commentsQuery)
        .orderBy(sql`created_at DESC`)
        .limit(limit)
        .offset((page - 1) * limit);

      return data as TaskActivitySectionData[];
    });
    return result;
  }

  static async addComment(data: InsertCommentData) {
    const db = await createDrizzleSupabaseClient();
    const comment = await db.rls(async (tx) => {
      const insertedComment = await tx.insert(taskComments).values(data).returning();
      return insertedComment[0];
    });
    return comment;
  }

  static async getAssignedTasks(userId: string, organizationId: number): Promise<TaskMinimalGroupedByStatus[]> {
    const db = await createDrizzleSupabaseClient();
    const result: TaskDetailMinimal[] = await db.rls(async (tx) => {
      const data = await tx
        .select({
          ...TaskSelects,
          status: WorkflowStatusSelects,
          priority: PrioritySelect,
          type: TaskTypeSelect,
        })
        .from(tasks)
        .innerJoin(tasksUsers, and(eq(tasksUsers.taskId, tasks.id), eq(tasksUsers.name, AssigneeFieldName), eq(tasksUsers.userId, userId)))
        .leftJoin(workflowStatus, eq(workflowStatus.id, tasks.statusId))
        .leftJoin(priorities, eq(priorities.id, tasks.priorityId))
        .leftJoin(taskTypes, eq(taskTypes.id, tasks.typeId))
        .where(and(eq(tasks.organizationId, organizationId)));
      return data;
    });

    const groupedTasks = Object.values(
      result.reduce((a, c) => {
        if (!a[c.statusId]) {
          a[c.statusId] = {
            group: {
              id: c.statusId,
              name: c.status.name,
            },
            tasks: [],
          };
        }
        a[c.statusId].tasks.push(c);
        return a;
      }, {} as Record<number, TaskMinimalGroupedByStatus>)
    );
    return groupedTasks;
  }
}
