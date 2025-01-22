import { TaskRepository } from '@/repositories'

export async function getTaskDetails(taskNumber: string, organizationId: number) {
	return await TaskRepository.getDetails(taskNumber, organizationId)
}
