import { pgTable, uuid, text, boolean, integer, timestamp, uniqueIndex, index, serial, pgEnum, varchar, jsonb, vector } from "drizzle-orm/pg-core";

import { ProjectTemplateProperty, TaskActivityMetadata, TaskProperty } from "@types";
import { AutomationFlow, FlowVariable } from "src/types/automation";
import { sql } from "drizzle-orm";

const timestamps = {
  updatedAt: timestamp()
    .$onUpdateFn(() => new Date())
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const InvitationExpiryTimeFn = () => new Date(Date.now() + SEVEN_DAYS_MS);

export const TableNames = {
  users: "users",
  organizations: "organizations",
  organizationMemberships: "organization_memberships",
  projects: "projects",
  workflows: "workflows",
  projectTemplates: "project_templates",
  workflowStatus: "workflow_status",
  projectWorkflowStatus: "project_workflow_status",
  projectTaskTypes: "project_task_types",
  projectPriorities: "project_priorities",
  tasks: "tasks",
  taskTypes: "task_types",
  priorities: "priorities",
  taskActivities: "task_activities",
  taskComments: "task_comments",
  tasksUsers: "tasks_users",
  transitions: "transitions",
  workflowTemplates: "workflow_templates",
  documents: "documents",
  documentVersions: "document_versions",
  documentCollaborators: "document_collaborators",
  documentComments: "document_comments",
  documentsTags: "documents_tags",
  documentProjects: "document_projects",
  documentEmbeddings: "document_embeddings",
  tags: "tags",

  invitations: "invitations",
};

/**
 *********************************************************NOTE*********************************************************************************************
 * NAME: CASCADE DELETE ON ORGANIZATION REFERENCE
 * 		We have enabled cascade delete on the organization reference as we want to delete all the entities that are associated with the organization
 * 		For example, if an organization is deleted, we want to delete all the projects, tasks, workflows, etc. that are associated with the organization
 *
 * DANGER:
 * NAME: NO COMMON REFERENCE FOR FIELDS
 * 		It might be tempting to create a common reference field for all the tables like organizationId, projectId but it's not a good idea
 * 		But this does not work correctly. I don't know the exact reason why it does not work. May be its how drizzle is implemented.
 *      t's working fine or timestamps but not for references. I had problem with the Task table where the projectId was not correctly created.
 *
 * EXTRA INFO
 *
 * NAME: USER SOFT DELETE
 * 		We have soft delete on users table which is done is db trigger. We need to think thoroighly on how to handle user references in the future.
 * 		The user is referenced by many tables and we need to handle the case when it references a deleted user
 */

export const Roles = ["Admin", "Member"] as const;
export const RoleEnum = pgEnum("role", Roles);

export const Priorities = ["LOW", "MEDIUM", "HIGH"] as const;
export const PriorityEnum = pgEnum("priority", Priorities);

export const ActivityActions = ["FIELD_UPDATE", "COMMENT_ADD", "COMMENT_DELETE", "ATTACHMENT_UPLOAD", "ATTACHMENT_DELETE", "TASK_CREATE", "TASK_DELETE"] as const;
export const ActivityActionEnum = pgEnum("activity_action", ActivityActions);

export const AutomationTriggerTypes = ["TASK_CREATED", "TASK_UPDATED"] as const;
export const TriggerTypeEnum = pgEnum("automation_trigger_type", AutomationTriggerTypes);

const KEY_LENGTH = 10;

// Tables
export const users = pgTable(TableNames.users, {
  id: uuid().primaryKey(),
  name: text().notNull(),
  email: text().unique().notNull(),
  imageUrl: text(),
  active: boolean(),
  ...timestamps,
  deletedAt: timestamp(),
});

export const organizations = pgTable(TableNames.organizations, {
  id: serial().primaryKey(),
  name: text().notNull(),
  key: varchar({ length: KEY_LENGTH }).unique().notNull(),
  imageUrl: text(),
  createdBy: uuid()
    .references(() => users.id)
    .notNull(),
  ...timestamps,
});

export const organizationMemberships = pgTable(
  TableNames.organizationMemberships,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid()
      .references(() => users.id)
      .notNull(),
    role: RoleEnum().default("Member").notNull(), // Role directly in the table as enum
    test: text(),
  },
  (table) => [uniqueIndex("unique_membership").on(table.organizationId, table.userId)],
);

export const projects = pgTable(
  TableNames.projects,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    name: text().notNull(),
    /**
     * Key of the project must be unique per Organization
     * A composite unique index iss created on organizationId and key
     */
    key: varchar({ length: KEY_LENGTH }).notNull(),
    description: text(),
    createdBy: uuid()
      .references(() => users.id)
      .notNull(),
    ...timestamps,
  },

  (table) => [uniqueIndex("unique_project_key_per_organization").on(table.organizationId, table.key), index("organizationIdIndex").on(table.organizationId)],
);

/**
 * Predefined Templates created for organizations to choose from
 */
export const projectTemplates = pgTable(TableNames.projectTemplates, {
  id: integer()
    .references(() => projects.id, { onDelete: "cascade" })
    .primaryKey(),
  name: text().notNull(),
  description: text(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  singleAssignee: boolean().default(true).notNull(),
  taskProperties: jsonb().$type<ProjectTemplateProperty[]>(),
  ...timestamps,
});

// Workflow Status Table
export const workflowStatus = pgTable(
  TableNames.workflowStatus,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid()
      .references(() => users.id)
      .notNull(),
    icon: text().notNull(),
    name: text().notNull(),
    ...timestamps,
  },
  (table) => [index("wfStatusOrganizationIdIndex").on(table.organizationId)],
);

// Workflow Status Table
export const taskTypes = pgTable(
  TableNames.taskTypes,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid()
      .references(() => users.id)
      .notNull(),
    icon: text().notNull(),
    name: text().notNull(),
    ...timestamps,
  },
  (table) => [index("taskTypesOrganizationIdIndex").on(table.organizationId)],
);

// Workflow Status Table
export const priorities = pgTable(
  TableNames.priorities,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid()
      .references(() => users.id)
      .notNull(),
    icon: text().notNull(),
    name: text().notNull(),
    ...timestamps,
  },
  (table) => [index("prioritiesOrganizationIdIndex").on(table.organizationId)],
);

/** Junction table to hold the relation between Project and Workflow Status
 * Workfloe status are managed under Project Templates
 */
export const projectWorkflowStatus = pgTable(
  TableNames.projectWorkflowStatus,
  {
    projectId: integer()
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    workflowStatusId: integer()
      .references(() => workflowStatus.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("unique_project_workflow_status").on(table.projectId, table.workflowStatusId)],
);

/** Junction table to hold the relation between Project Template and Task Types
 * Workfloe status are managed under Project Templates
 */
export const projectTaskTypes = pgTable(
  TableNames.projectTaskTypes,
  {
    projectId: integer()
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    taskTypeId: integer()
      .references(() => taskTypes.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("unique_project_task_types").on(table.projectId, table.taskTypeId)],
);

/** Junction table to hold the relation between Project Template and Priorities
 * Workfloe status are managed under Project Templates
 */
export const projectPriorities = pgTable(
  TableNames.projectPriorities,
  {
    projectId: integer()
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    priorityId: integer()
      .references(() => priorities.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("unique_project_pririties").on(table.projectId, table.priorityId)],
);

// Tasks Table
export const tasks = pgTable(
  TableNames.tasks,
  {
    id: serial().primaryKey(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    projectId: integer()
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: uuid()
      .references(() => users.id)
      .notNull(),
    title: text().notNull(),
    content: text(),
    /**
     * We're storing the Status id directly in the task for flexibility, scalability and data integrity
     * If the tenant wants to update the Status name, we don't have to update all the tasks
     * It also maintains data integrity, as we can't have a task in a Status that doesn't exist
     * It also makes it esay to add Custom Rules (Triggering Notifications, Auto-Escalations, Workflow Transitions) (we might do this in the future) attahed to different Statuses
     *
     * Thus we have centralized control
     * We already maintain a Status table which makes the Workflow extensible
     *
     * CONs: The only dowside is that it adds a slight overhead of joining the Status table to get the Status name
     * We already have an index on the WorkflowStatus table which helps in query perforance so this is a small price to pay for the benefits
     *
     * Initially, we added the workflowId directly in the task itself just so we can do a quick lookup of the workflow
     * But that would just add storage overhead and we can always get the workflowId from the project
     * Each lookup stores the id of the table which is a 4 byte integer
     */
    statusId: integer()
      .references(() => workflowStatus.id)
      .notNull(),
    priorityId: integer()
      .references(() => priorities.id)
      .notNull(),
    typeId: integer()
      .references(() => taskTypes.id)
      .notNull(),
    taskNumber: text().notNull(),
    properties: jsonb().$type<TaskProperty>(),
    ...timestamps,
  },
  (table) => [
    // We will always be filtering by organization, so apart from the constraint added by the folloing index, we will also get the performance benefit of the index
    uniqueIndex("unique_task_number_per_organization").on(table.organizationId, table.taskNumber),
  ],
);

export const taskActivities = pgTable(TableNames.taskActivities, {
  id: serial().primaryKey(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  action: ActivityActionEnum().notNull(),
  taskId: integer()
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  metadata: jsonb().$type<TaskActivityMetadata>().notNull(),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  ...timestamps,
});

export const taskComments = pgTable(TableNames.taskComments, {
  id: serial().primaryKey(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  taskId: integer()
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  content: text().notNull(),
  ...timestamps,
});

/**
 * This is a junction table to relate Task and Users
 * Each tasks can have multiple assignees and user can add additional relation between these 2 entities and nanem them as they requrie
 */
export const tasksUsers = pgTable(TableNames.tasksUsers, {
  id: serial().primaryKey(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  taskId: integer()
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text().notNull(),
  ...timestamps,
});

// Workflow Templates Table
export const workflowTemplates = pgTable(TableNames.workflowTemplates, {
  id: serial().primaryKey(),
  name: text("name").notNull(),
  content: text("content"),
  ...timestamps,
});

// AUTOMATION TABLES

export const automations = pgTable("automations", {
  /**
   * We're using uuid as the primary key for automations as we'll be using it in the URL and it's better than an integer id to be used in the URL
   */
  id: uuid()
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  projectId: integer()
    .references(() => projects.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  triggerType: TriggerTypeEnum().notNull(),
  flow: jsonb().$type<AutomationFlow>().notNull(),
  variables: jsonb().$type<FlowVariable[]>(),
  createdBy: uuid()
    .references(() => users.id)
    .notNull(),
  ...timestamps,
});

// Docs
export const documents = pgTable(TableNames.documents, {
  id: uuid()
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  title: text().notNull(),
  content: jsonb(),
  excerpt: text(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  createdById: uuid()
    .references(() => users.id)
    .notNull(),
  ...timestamps,
});

export const tags = pgTable(
  TableNames.tags,
  {
    id: serial().primaryKey(),
    name: text().notNull(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("unique_tag_name_per_organization").on(table.organizationId, table.name)],
);

export const documentsTags = pgTable(
  TableNames.documentsTags,
  {
    id: serial().primaryKey(),
    documentId: uuid()
      .references(() => documents.id)
      .notNull(),
    tagId: integer()
      .references(() => tags.id)
      .notNull(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("unique_tag_in_document").on(table.documentId, table.tagId)],
);

export const documentCollaborators = pgTable(TableNames.documentCollaborators, {
  id: serial().primaryKey(),
  documentId: uuid()
    .references(() => documents.id)
    .notNull(),
  userId: uuid()
    .references(() => users.id)
    .notNull(),
  organizationId: integer()
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

// https://www.youtube.com/watch?v=MDxEXKkxf2Q
// https://orm.drizzle.team/docs/guides/vector-similarity-search
export const documentEmbeddings = pgTable(
  TableNames.documentEmbeddings,
  {
    id: serial().primaryKey(),
    content: text().notNull(),
    embedding: vector("embedding", { dimensions: 384 }).notNull(),
    documentId: uuid()
      .references(() => documents.id)
      .notNull(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (table) => [index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops"))],
);

export const invitations = pgTable(TableNames.invitations, {
  id: serial().primaryKey(),
  email: text().notNull(),
  organizationId: integer()
    .references(() => organizations.id)
    .notNull(),
  token: text().notNull(),
  invitedById: uuid()
    .references(() => users.id)
    .notNull(),
  createdAt: timestamps.createdAt,
  expiresAt: timestamp().$defaultFn(InvitationExpiryTimeFn).notNull(),
  acceptedAt: timestamp(),
  role: RoleEnum().default("Member").notNull(),
});
