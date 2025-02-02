'use server'

import { InsertTaskData, Task, TaskUpdateData } from '@/types/task'
import { TaskRepository } from '@/repositories'

export const createTask = async (data: InsertTaskData) => {
	return await TaskRepository.create(data)
}

export const updateTask = async (task: Pick<Task, 'id' | 'organizationId'>, data: TaskUpdateData) => {
	return await TaskRepository.updateField(task, data)
}
