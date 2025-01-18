import { db } from '@db'

import { tasks, users, workflowStatus } from '@/db/schema'
import { InsertTaskData, Task, TaskDetail } from '@/types/task'
import { and, eq } from 'drizzle-orm'
import { TaskSelects, UserSelects, WorkflowStatusSelects } from './selects'

export class TaskRepository {
	static async create(data: InsertTaskData): Promise<Task> {
		const result = await db.insert(tasks).values(data).returning()
		return result[0]
	}

	static async getDetails(taskNumber: string, organizationId: number): Promise<TaskDetail | null> {
		const result = await db
			.select({ ...TaskSelects, assignee: UserSelects, status: WorkflowStatusSelects })
			.from(tasks)
			.innerJoin(workflowStatus, eq(workflowStatus.id, tasks.statusId))
			.leftJoin(users, eq(users.id, tasks.assigneeId))
			.where(and(eq(tasks.organizationId, organizationId), eq(tasks.taskNumber, taskNumber)))

		if (taskNumber.length == 0) return null
		return result[0] as unknown as TaskDetail
	}
}
