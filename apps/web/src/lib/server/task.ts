import { TaskRepository } from "@/repositories";
import { CustomError } from "@lib/error";
import { PaginatedTaskFilterParams } from "@tdata/shared/types";

export async function getTaskDetails(taskNumber: string, organizationId: number) {
  const task = await TaskRepository.getDetails(taskNumber, organizationId);
  if (!task) throw new CustomError("404 - Task Not Found");
  return task;
}

export async function searchTasks(organizationId: number, params: PaginatedTaskFilterParams) {
  const tasks = await TaskRepository.searchTask(organizationId, params);
  return tasks;
}
