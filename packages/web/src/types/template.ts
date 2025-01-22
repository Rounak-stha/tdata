import { IconType } from './icon'

export type TemplateWorkflow = string[] // List of statuses for the workflow

export type TemplateTaskTypes = string[] // List of task types

export type taskProperties = TaskProperty[] // List of task attributes

export type ProjectTemplateTaskType = { name: string; icon: IconType }
export type ProjectTemplateWorkflow = { name: string; icon: IconType }
export type ProjectTemplatePriority = { name: string; icon: IconType }
export type ProjectTemplateAssignee = { multiple: boolean }
export type TaskPropertyTypes = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiSelect' | 'user'

export type TaskProperty = {
	name: string
	type: TaskPropertyTypes
	options?: string[]
	singleUser?: boolean
}

export type ProjectTemplateData = {
	taskTypes: ProjectTemplateTaskType[]
	workflow: ProjectTemplateWorkflow[]
	priority: ProjectTemplatePriority[]
	assignee: ProjectTemplateAssignee
	taskProperties: TaskProperty[]
}

export type ProjectTemplateUI = {
	id: string
	name: string
	description: string
	features: {
		title: string
		description: string
	}[]
	recommendedFor: string[]
} & ProjectTemplateData
