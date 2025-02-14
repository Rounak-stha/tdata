import { projects, projectTemplates, tasks, users, workflowStatus } from "@/db/schema";
import { Project, ProjectTemplateMinimal, Task, User, WorkflowStatus } from "@/types";
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
  priority: tasks.priority,
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
  projectId: workflowStatus.projectId,
  workflowId: workflowStatus.workflowId,
  icon: workflowStatus.icon,
  createdAt: workflowStatus.createdAt,
  updatedAt: workflowStatus.updatedAt,
};
