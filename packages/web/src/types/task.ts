import { tasks, taskActivities } from '@/db/schema'
import { User, UserId } from './user'
import { ProjectTemplateDetail } from './project'

export type TaskUserRelations = Record<string, User[]>
export type TaskUserRelationMinimal = Record<string, UserId[]>
export type TaskPropertyValue = string | string[]
export type TaskProperty = Record<string, TaskPropertyValue>

export interface TaskRelationFields {
	name: string
}

export type InsertTaskData = Omit<typeof tasks.$inferInsert, 'taskNumber'> & { userRelations: TaskUserRelationMinimal }
export type InsertTaskActivityData = Omit<typeof taskActivities.$inferInsert, 'id'>

export type TaskStandardFieldUpdateKeys = keyof Partial<Pick<Task, 'title' | 'content' | 'statusId' | 'priority'>>

export type TaskStandardUpdatableFields = keyof Pick<Task, 'title' | 'content' | 'statusId' | 'priority'>

export type TaskStandardFieldUpdateData = Partial<Pick<Task, TaskStandardUpdatableFields>> & {
	value: string
	previous: string
}
export type TaskUserRelationUpdateData = {
	name: string // relationship name
	newUserId?: UserId
	previousUserId?: UserId
}
export type TaskCustomFieldUpdateData = {
	name: string
	newValue: TaskPropertyValue
	previousValue: TaskPropertyValue
}

export type TaskActivityUserSubtype = 'add' | 'remove'

export type TaskUpdateData =
	| {
			name: 'StandardFieldUpdate'
			performedBy: UserId
			data: TaskStandardFieldUpdateData
	  }
	| {
			name: 'UserRelationUpdate'
			performedBy: UserId
			data: TaskUserRelationUpdateData
	  }
	| {
			name: 'CustomFieldUpdate'
			performedBy: UserId
			data: TaskCustomFieldUpdateData
	  }

export type Task = Omit<typeof tasks.$inferSelect, 'updatedAt' | 'deletedAt'>

export type TaskDetail = Task & {
	projectTemplate: ProjectTemplateDetail
	userRelations: TaskUserRelations
}

/**
 * This is the structure of the metadata field in the TaskActivities table
 * For 'TASK_DELETE' action, the metadata will be empty
 */
export type TaskActivityMetadata =
	| {
			type: 'field' // Every field update will have this type
			name: string
			from: TaskPropertyValue
			to: TaskPropertyValue
	  }
	| {
			// this might have been part of the type: 'field' structure but we treat the user field as a special case
			type: 'user'
			subtype: TaskActivityUserSubtype
			name: string // Name of the user relation eg: 'assignee'
			userId: UserId
	  }
	| {
			type: 'comment'
			subtype: 'add' | 'edit' | 'delete'
			comment: string
	  }
	| {
			type: 'attachment'
			subtype: 'add' | 'delete'
			attachmentId: string
	  }
	| {
			type: 'task_create_delete'
	  }
