import { pgTable, uuid, text, boolean, integer, timestamp, uniqueIndex, index, serial } from 'drizzle-orm/pg-core'

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

const workflowStageId = integer()
	.references(() => workflowStages.id)
	.notNull()

const createdBy = uuid()
	.references(() => users.id)
	.notNull()

// Tables
export const users = pgTable('users', {
	id: uuid().primaryKey(),
	name: text(),
	email: text(),
	imageUrl: text(),
	active: boolean(),
	...timestamps
})

export const organizations = pgTable('organizations', {
	id: serial().primaryKey(),
	name: text().notNull(),
	key: text().unique().notNull(),
	createdBy,
	imageUrl: text(),
	...timestamps
})

export const projects = pgTable(
	'projects',
	{
		id: serial().primaryKey(),
		organizationId,
		name: text().notNull(),
		key: text().unique().notNull(),
		createdBy,
		...timestamps
	},

	(table) => [
		uniqueIndex('unique_project_key_per_organization').on(table.organizationId, table.key),
		index('organizationIdIndex').on(table.organizationId)
	]
)

// Workflows Table
export const workflows = pgTable('workflows', {
	id: serial().primaryKey(),
	organizationId,
	name: text().notNull(),
	isActive: boolean().default(false),
	createdBy,
	...timestamps
})

// Workflow Stages Table
export const workflowStages = pgTable('workflow_stages', {
	id: serial().primaryKey(),
	organizationId,
	workflowId,
	createdBy,
	name: text().notNull(),
	order: integer('order').notNull(),
	...timestamps
})

// Tasks Table
export const tasks = pgTable(
	'tasks',
	{
		id: serial().primaryKey(),
		organizationId,
		projectId,
		createdBy,
		title: text().notNull(),
		content: text(),
		workflowId,
		stageId: workflowStageId,
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
	fromState: workflowStageId,
	toStage: workflowStageId,
	...timestamps
})

// Workflow Templates Table
export const workflowTemplates = pgTable('workflow_templates', {
	id: serial().primaryKey(),
	name: text('name').notNull(),
	content: text('content'),
	...timestamps
})
