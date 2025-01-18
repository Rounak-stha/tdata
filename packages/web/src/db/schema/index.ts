import {
	pgTable,
	uuid,
	text,
	boolean,
	integer,
	timestamp,
	uniqueIndex,
	index,
	serial,
	pgEnum,
	varchar
} from 'drizzle-orm/pg-core'

const timestamps = {
	updatedAt: timestamp().$onUpdateFn(() => new Date()),
	createdAt: timestamp().defaultNow().notNull(),
	deletedAt: timestamp()
}

const organizationId = integer()
	.references(() => organizations.id, { onDelete: 'cascade' })
	.notNull()

const projectId = integer()
	.references(() => projects.id, { onDelete: 'cascade' })
	.notNull()

const workflowId = integer()
	.references(() => workflows.id)
	.notNull()

const workflowStatusId = integer()
	.references(() => workflowStatus.id)
	.notNull()

const userId = uuid()
	.references(() => users.id)
	.notNull()

const assigneeId = uuid().references(() => users.id)

const createdBy = uuid()
	.references(() => users.id)
	.notNull()

export const Roles = ['Admin', 'Member'] as const
export const RoleEnum = pgEnum('role', Roles)

export const Priorities = ['LOW', 'MEDIUM', 'HIGH'] as const
export const PriorityEnum = pgEnum('priority', Priorities)

const KEY_LENGTH = 10

// Tables
export const users = pgTable('users', {
	id: uuid().primaryKey(),
	name: text().notNull(),
	email: text().unique().notNull(),
	imageUrl: text(),
	active: boolean(),
	...timestamps
})

export const organizations = pgTable('organizations', {
	id: serial().primaryKey(),
	name: text().notNull(),
	key: varchar({ length: KEY_LENGTH }).unique().notNull(),
	imageUrl: text(),
	createdBy,
	...timestamps
})

export const organizationMemberships = pgTable(
	'organization_memberships',
	{
		id: serial().primaryKey(),
		organizationId,
		userId,
		role: RoleEnum().default('Member').notNull() // Role directly in the table as enum
	},
	(table) => [uniqueIndex('unique_membership').on(table.organizationId, table.userId)]
)

export const projects = pgTable(
	'projects',
	{
		id: serial().primaryKey(),
		organizationId,
		name: text().notNull(),
		key: varchar({ length: KEY_LENGTH }).unique().notNull(),
		description: text(),
		workflowId,
		createdBy,
		...timestamps
	},

	(table) => [
		uniqueIndex('unique_project_key_per_organization').on(table.organizationId, table.key),
		index('organizationIdIndex').on(table.organizationId)
	]
)

// Workflows Table
export const workflows = pgTable(
	'workflows',
	{
		id: serial().primaryKey(),
		organizationId,
		name: text().notNull(),
		description: text(),
		configured: boolean().default(false).notNull(),
		isDefault: boolean().default(false).notNull(),
		isActive: boolean().default(false).notNull(),
		createdBy,
		...timestamps
	},
	(table) => [index('workflowOrganizationIdIndex').on(table.organizationId)]
)

// Workflow Status Table
export const workflowStatus = pgTable(
	'workflow_status',
	{
		id: serial().primaryKey(),
		organizationId,
		workflowId,
		createdBy,
		name: text().notNull(),
		icon: text().notNull(),
		...timestamps
	},
	(table) => [index('wfStatusOrganizationIdIndex').on(table.organizationId)]
)

// Tasks Table
export const tasks = pgTable(
	'tasks',
	{
		id: serial().primaryKey(),
		assigneeId: assigneeId,
		organizationId,
		projectId,
		createdBy,
		title: text().notNull(),
		content: text(),
		priority: PriorityEnum().default('MEDIUM').notNull(),
		workflowId,
		/**
		 * We're storing the Status id directly in the task for flexibility, scalability and data integrity
		 * If the tenant ants to update the Status name, we don't have to update all the tasks
		 * It also maintains data integrity, as we can't have a task in a Status that doesn't exist
		 * It also makes it esay to add Custom Rules (Triggering Notifications, Auto-Escalations, Workflow Transitions) (we might do this in the future) attahed to different Statuses
		 *
		 * Thus we have centralized control
		 * We already maintain a Status table which makes the Workflow extensible
		 *
		 * CONs: The only dowside is that it adds a slight overhead of joining the Status table to get the Status name
		 * We already have an index on the WorkflowStatus table which helps in query perforance so this is a small price to pay for the benefits
		 */
		statusId: workflowStatusId,
		taskNumber: text().notNull(),
		...timestamps
	},
	(table) => [
		// We will always be filtering by organization, so apart from the constraint added by the folloing index, we will also get the performance benefit of the index
		// so we will not be adding an extra index on task number to avoid storage requirements and to not urt insert / update performance
		uniqueIndex('unique_task_number_per_organization').on(table.organizationId, table.taskNumber)
	]
)

// Transitions Table
export const transitions = pgTable('transitions', {
	id: serial().primaryKey(),
	organizationId,
	workflowId,
	fromStatus: workflowStatusId,
	toStatus: workflowStatusId,
	...timestamps
})

// Workflow Templates Table
export const workflowTemplates = pgTable('workflow_templates', {
	id: serial().primaryKey(),
	name: text('name').notNull(),
	content: text('content'),
	...timestamps
})
