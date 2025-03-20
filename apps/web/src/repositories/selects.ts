import { projects, projectTemplates, tasks, users, workflowStatus, priorities, taskTypes } from "@tdata/shared/db/schema";
import { Project, ProjectTemplateMinimal, Task, User, WorkflowStatus, Priority, TaskType } from "@tdata/shared/types";
import { PgColumn } from "drizzle-orm/pg-core";

export const UserSelects: Record<keyof Omit<User, "role">, PgColumn> = {
  id: users.id,
  email: users.email,
  imageUrl: users.imageUrl,
  name: users.name,
  createdAt: users.createdAt,
};

export const ProjectTemplateMinimalSelects: Record<keyof ProjectTemplateMinimal, PgColumn> = {
  id: projectTemplates.id,
  name: projectTemplates.name,
  description: projectTemplates.description,
};

export const TaskSelects: Record<keyof Task, PgColumn> = {
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

export const ProjectSelects: Record<keyof Omit<Project, "deletedAt">, PgColumn> = {
  id: projects.id,
  createdBy: projects.createdBy,
  description: projects.description,
  organizationId: projects.organizationId,
  key: projects.key,
  name: projects.name,
  createdAt: projects.createdAt,
  updatedAt: projects.updatedAt,
};

export const WorkflowStatusSelects: Record<keyof WorkflowStatus, PgColumn> = {
  id: workflowStatus.id,
  createdBy: workflowStatus.createdBy,
  name: workflowStatus.name,
  organizationId: workflowStatus.organizationId,
  icon: workflowStatus.icon,
  createdAt: workflowStatus.createdAt,
  updatedAt: workflowStatus.updatedAt,
};

export const PrioritySelect: Record<keyof Priority, PgColumn> = {
  id: priorities.id,
  createdBy: priorities.createdBy,
  name: priorities.name,
  organizationId: priorities.organizationId,
  icon: priorities.icon,
  createdAt: priorities.createdAt,
  updatedAt: priorities.updatedAt,
};

export const TaskTypeSelect: Record<keyof TaskType, PgColumn> = {
  id: taskTypes.id,
  createdBy: taskTypes.createdBy,
  name: taskTypes.name,
  organizationId: taskTypes.organizationId,
  icon: taskTypes.icon,
  createdAt: taskTypes.createdAt,
  updatedAt: taskTypes.updatedAt,
};
