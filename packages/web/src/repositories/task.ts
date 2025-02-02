import { db } from '@db'

import { taskActivities, tasks, tasksUsers, users } from '@/db/schema'
import {
	InsertTaskActivityData,
	InsertTaskData,
	Task,
	TaskDetail,
	TaskStandardFieldUpdateKeys,
	TaskUpdateData
} from '@/types/task'
import { and, eq, sql } from 'drizzle-orm'
import { TaskSelects } from './selects'
import ProjectRepository from './project'
import { User } from '@/types'

export class TaskRepository {
	static async create(data: InsertTaskData): Promise<Task> {
		const { userRelations, ...task } = data
		let createdTask = {} as Task
		/**
		 * We have a before insert trigger that will add the correct task number
		 */
		await db.transaction(async (tx) => {
			const newTask = await tx
				.insert(tasks)
				.values({ ...task, taskNumber: 'o' })
				.returning()

			const insertData = Object.entries(userRelations).flatMap(([name, userIds]) =>
				userIds.map((userId) => ({
					taskId: newTask[0].id,
					userId,
					organizationId: newTask[0].organizationId,
					name
				}))
			)

			await tx.insert(tasksUsers).values(insertData)
			await tx.insert(taskActivities).values({
				organizationId: newTask[0].organizationId,
				action: 'TASK_CREATE',
				taskId: newTask[0].id,
				userId: newTask[0].createdBy,
				metadata: { type: 'task_create_delete' }
			})
			createdTask = newTask[0]
		})

		return createdTask
	}

	static async getDetails(taskNumber: string, organizationId: number): Promise<TaskDetail | null> {
		const result = await db
			.select({
				...TaskSelects, // Select all fields from the tasks table
				userRelations: sql<{ relationName: string; user: User }[]>`COALESCE(
			JSON_AGG(
			  JSON_BUILD_OBJECT(
				'relationName', ${tasksUsers.name},  
				'user', ROW_TO_JSON(${users}) 
			  )
			) FILTER (WHERE ${tasksUsers.id} IS NOT NULL), '[]'
		  )`.as('userRelations') // Aggregated user data
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
			.groupBy(tasks.id)

		if (result.length == 0) return null

		const task = result[0]
		const projectTemplate = await ProjectRepository.getProjectTemplate(task.projectId)

		if (!projectTemplate) return null

		const userRelations: Record<string, User[]> = {}

		task.userRelations.forEach((u) => {
			if (!userRelations[u.relationName]) userRelations[u.relationName] = []
			userRelations[u.relationName].push(u.user)
		})
		return { ...task, projectTemplate, userRelations }
	}

	static async updateField(task: Pick<Task, 'id' | 'organizationId'>, data: TaskUpdateData) {
		const performedBy = data.performedBy

		await db.transaction(async (tx) => {
			if (data.name === 'StandardFieldUpdate') {
				const { value, previous, ...rest } = data.data
				const updatedField = Object.keys(rest)[0] as TaskStandardFieldUpdateKeys

				const updatedTask = await tx
					.update(tasks)
					.set(rest)
					.where(and(eq(tasks.id, task.id), eq(tasks.organizationId, task.organizationId)))
					.returning()

				if (updatedTask.length == 0) {
					tx.rollback()
				}

				await tx.insert(taskActivities).values({
					action: 'FIELD_UPDATE',
					organizationId: task.organizationId,
					taskId: task.id,
					userId: performedBy,
					metadata: {
						type: 'field',
						name: updatedField,
						from: previous,
						to: value ? value : (rest[updatedField] as string)
					}
				})
			} else if (data.name == 'UserRelationUpdate') {
				const { name, previousUserId, newUserId } = data.data
				const activityData: InsertTaskActivityData[] = []

				if (newUserId) {
					await tx.insert(tasksUsers).values({
						name,
						organizationId: task.organizationId,
						taskId: task.id,
						userId: newUserId
					})

					activityData.push({
						action: 'FIELD_UPDATE',
						organizationId: task.organizationId,
						taskId: task.id,
						userId: performedBy,
						metadata: {
							type: 'user',
							subtype: 'add',
							name,
							userId: newUserId
						}
					})
				}

				if (previousUserId) {
					await tx
						.delete(tasksUsers)
						.where(
							and(
								eq(tasksUsers.taskId, task.id),
								eq(tasksUsers.organizationId, task.organizationId),
								eq(tasksUsers.userId, previousUserId),
								eq(tasksUsers.name, name)
							)
						)
					activityData.push({
						action: 'FIELD_UPDATE',
						organizationId: task.organizationId,
						taskId: task.id,
						userId: performedBy,
						metadata: {
							type: 'user',
							subtype: 'remove',
							name,
							userId: previousUserId
						}
					})
				}

				await tx.insert(taskActivities).values(activityData)
			} else if (data.name == 'CustomFieldUpdate') {
				const { name, newValue, previousValue } = data.data

				await tx
					.update(tasks)
					.set({
						properties: sql`${tasks.properties} || ${JSON.stringify({ [name]: newValue })}::jsonb`
					})
					.where(and(eq(tasks.id, task.id), eq(tasks.organizationId, task.organizationId)))

				await tx.insert(taskActivities).values({
					action: 'FIELD_UPDATE',
					organizationId: task.organizationId,
					taskId: task.id,
					userId: performedBy,
					metadata: {
						type: 'field',
						name,
						from: previousValue,
						to: newValue
					}
				})
			}
		})
	}
}
