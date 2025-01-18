'use server'

import { InsertProjectData } from '@/types/project'
import { ProjectRepository } from '@/repositories'

export const checkProjectKeyAvailability = async (key: string) => {
	return !(await ProjectRepository.existsByKey(key))
}

export const createProject = async (data: InsertProjectData) => {
	return await ProjectRepository.create(data)
}
