import { tasks, taskActivities, taskComments, Priorities } from "@db/schema";
import { User, UserId } from "./user";
import { ProjectTemplateDetail } from "./project";
import { WorkflowStatus } from "./workflow";
import { Priority } from "./priority";
import { TaskType } from "./taskType";

export type TaskUserRelations = Record<string, User[]>;
export type TaskUserRelationMinimal = Record<string, UserId[]>;
export type TaskPropertyValue = string | string[];
export type TaskProperty = Record<string, TaskPropertyValue>;

export type Task = Omit<typeof tasks.$inferSelect, "updatedAt" | "deletedAt">;
export type TaskDetailMinimal = Task & { status: WorkflowStatus; priority: Priority; type: TaskType };
export type TaskActivity = Omit<typeof taskActivities.$inferSelect, "updatedAt" | "deletedAt">;
export type Comment = Omit<typeof taskComments.$inferSelect, "deletedAt">;

export type TaskDetail = Task & {
  projectTemplate: ProjectTemplateDetail;
  userRelations: TaskUserRelations;
};

export type TaskDetailOptimistic = TaskDetail & { tempId?: number; disabled?: boolean };

// If we're gouping by assignees, then the id will be a string as userId is a uuid field
export type TaskGrouped<T, U> = {
  group: T;
  tasks: U[];
};

export type TaskMinimalGroupedByStatus = TaskGrouped<Pick<WorkflowStatus, "id" | "name">, TaskDetailMinimal>;
export type TaskGroupedByStatus = TaskGrouped<WorkflowStatus, TaskDetail>;

export type TaskActivityDetail = TaskActivity & {
  user: User;
};

export type TaskCommentDetail = Comment & {
  user: User;
};

export type TaskActivitySectionData = (TaskActivityDetail & { type: "activity" }) | (TaskCommentDetail & { type: "comment" });
export interface TaskRelationFields {
  name: string;
}

export type InsertTaskData = Omit<typeof tasks.$inferInsert, "taskNumber"> & { userRelations: TaskUserRelationMinimal };
export type InsertTaskActivityData = Omit<typeof taskActivities.$inferInsert, "id">;
export type InsertCommentData = Omit<typeof taskComments.$inferInsert, "id">;

export type TaskStandardFieldUpdateKeys = keyof Partial<Pick<Task, "title" | "content" | "statusId" | "priorityId">>;

export type TaskStandardUpdatableFields = keyof Pick<Task, "title" | "content" | "statusId" | "priorityId">;
export type TaskStandardUpdatableFieldLabels = "title" | "content" | "status" | "priority" | "assignee";

export type TaskStandardFieldUpdateData = Partial<Pick<Task, TaskStandardUpdatableFields>> & {
  value: string;
  previous: string;
};
export type TaskUserRelationUpdateData = {
  name: string; // relationship name
  newUser?: { id: UserId; name: string };
  previousUser?: { id: UserId; name: string };
};
export type TaskCustomFieldUpdateData = {
  name: string;
  newValue: TaskPropertyValue;
  previousValue: TaskPropertyValue;
};

export type TaskActivityUserSubtype = "add" | "remove";

export type TaskUpdateData =
  | {
      name: "StandardFieldUpdate";
      performedBy: UserId;
      data: TaskStandardFieldUpdateData;
    }
  | {
      name: "UserRelationUpdate";
      performedBy: UserId;
      data: TaskUserRelationUpdateData;
    }
  | {
      name: "CustomFieldUpdate";
      performedBy: UserId;
      data: TaskCustomFieldUpdateData;
    };

/**
 * This is the structure of the metadata field in the TaskActivities table
 * For 'TASK_DELETE' action, the metadata will be empty
 */
export type TaskActivityMetadata =
  | {
      type: "field"; // Every field update will have this type
      name: string;
      from: TaskPropertyValue;
      to: TaskPropertyValue;
    }
  | {
      // this might have been part of the type: 'field' structure but we treat the user field as a special case
      type: "user";
      subtype: TaskActivityUserSubtype;
      name: string; // Name of the user relation eg: 'assignee'
      user: { id: UserId; name: string };
    }
  | {
      type: "comment";
      subtype: "add" | "edit" | "delete";
      comment: string;
    }
  | {
      type: "attachment";
      subtype: "add" | "delete";
      attachmentId: string;
    }
  | {
      type: "task_create_delete";
    };

export type TaskFieldActivityMetadata = Extract<TaskActivityMetadata, { type: "field" }>;
export type TaskUserRelationActivityMetadata = Extract<TaskActivityMetadata, { type: "user" }>;
