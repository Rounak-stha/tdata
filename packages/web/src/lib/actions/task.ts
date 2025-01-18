'use server'

import { InsertTaskData } from '@/types/task'
import { TaskRepository } from '@/repositories'

export const createTask = async (data: InsertTaskData) => {
	return await TaskRepository.create(data)
}
